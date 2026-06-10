/** Snapshots the canvas and flood-fills to detect completed colours. */
class ConnectionChecker {
    /**
     * @param {HTMLCanvasElement} canvas - the live ink canvas
     * @param {StateManager} state
     * @param {function(number)} onColorComplete - called with the completed colorIndex
     * @param {function()} onWin
     */
    constructor(canvas, state, onColorComplete, onWin) {
        this.canvas = canvas;
        this.sm = state;
        this.onColorComplete = onColorComplete;
        this.onWin = onWin;
        this.checkCanvas = document.createElement("canvas");
        this.checkCanvas.width = CONSTANTS.CHECK_SIZE;
        this.checkCanvas.height = CONSTANTS.CHECK_SIZE;
        this.checkCtx = this.checkCanvas.getContext("2d", { willReadFrequently: true });
        this._lastRecheck = 0;
        this.won = false;
    }

    reset() { this.won = false; this._lastRecheck = 0; }

    /** Blit the live canvas (with whatever fade has occurred) into checkCanvas. */
    _snapshot() {
        const N = CONSTANTS.CHECK_SIZE;
        this.checkCtx.clearRect(0, 0, N, N);
        this.checkCtx.drawImage(this.canvas, 0, 0, N, N);
    }

    /** Throttled re-check, called from the animation loop while fade zones erode. */
    recheckThrottled() {
        const now = performance.now();
        if (now - this._lastRecheck < CONSTANTS.RECHECK_INTERVAL_MS) return;
        this._lastRecheck = now;
        this.run();
    }

    /** Full check: remove any colour whose pairs are all connected; win when none remain. */
    run() {
        if (this.won) return;
        const puzzle = this.sm.STATE.puzzle;
        if (!puzzle || puzzle.pairs.length === 0) return;

        this._snapshot();
        const N = CONSTANTS.CHECK_SIZE;
        const imageData = this.checkCtx.getImageData(0, 0, N, N);

        const byColor = new Map();
        for (const pair of puzzle.pairs) {
            if (!byColor.has(pair.colorIndex)) byColor.set(pair.colorIndex, []);
            byColor.get(pair.colorIndex).push(pair);
        }

        const completed = [];
        for (const [colorIndex, pairs] of byColor) {
            const rgb = hexToRgb(puzzle.colors[colorIndex]);
            const allConnected = pairs.every((p) => this._connected(imageData, p.a, p.b, rgb));
            if (allConnected) completed.push(colorIndex);
        }

        for (const colorIndex of completed) {
            puzzle.pairs = puzzle.pairs.filter((p) => p.colorIndex !== colorIndex);
            this.onColorComplete(colorIndex);
        }

        if (puzzle.pairs.length === 0 && !this.won) {
            this.won = true;
            this.onWin();
        }
    }

    /** BFS flood fill on the snapshot between two dots of one colour. */
    _connected(imageData, dotA, dotB, rgb) {
        const N = CONSTANTS.CHECK_SIZE;
        const scale = N / CONSTANTS.CANVAS_SIZE;
        const ax = clamp(Math.round(dotA.x * scale), 0, N - 1);
        const ay = clamp(Math.round(dotA.y * scale), 0, N - 1);
        const bx = clamp(Math.round(dotB.x * scale), 0, N - 1);
        const by = clamp(Math.round(dotB.y * scale), 0, N - 1);

        // Objective reach == OBJECTIVE_REACH_DOTS × the on-screen dot size, applied at
        // BOTH endpoints: ink within this radius of an endpoint counts as reaching it.
        const dotSize = CONSTANTS.DOT_RADIUS * 2; // on-screen dot diameter
        const radius = dotSize * CONSTANTS.OBJECTIVE_REACH_DOTS * scale;
        const r2 = radius * radius;
        const ri = Math.ceil(radius);

        const data = imageData.data;
        const visited = new Uint8Array(N * N);
        const queue = new Int32Array(N * N);
        let head = 0, tail = 0;

        // Seed the search with every painted matching pixel within `radius` of dot A,
        // so you don't have to land ink exactly on its centre.
        for (let dy = -ri; dy <= ri; dy++) {
            for (let dx = -ri; dx <= ri; dx++) {
                if (dx * dx + dy * dy > r2) continue;
                const nx = ax + dx, ny = ay + dy;
                if (nx < 0 || ny < 0 || nx >= N || ny >= N) continue;
                const ni = ny * N + nx;
                if (visited[ni] || !this._matches(data, ni, rgb)) continue;
                visited[ni] = 1;
                queue[tail++] = ni;
            }
        }

        while (head < tail) {
            const idx = queue[head++];
            const cx = idx % N, cy = (idx - cx) / N;
            const ddx = cx - bx, ddy = cy - by;
            if (ddx * ddx + ddy * ddy <= r2) return true; // within a dot's reach of B

            // 4-neighbours
            const ns = [idx - 1, idx + 1, idx - N, idx + N];
            const cols = [cx - 1, cx + 1, cx, cx];
            for (let k = 0; k < 4; k++) {
                const ni = ns[k];
                if (ni < 0 || ni >= N * N) continue;
                if (k < 2 && cols[k] !== ((ni % N))) continue; // wrapped row edge
                if (visited[ni]) continue;
                if (!this._matches(data, ni, rgb)) continue;
                visited[ni] = 1;
                queue[tail++] = ni;
            }
        }
        return false;
    }

    _matches(data, pixelIndex, rgb) {
        const o = pixelIndex * 4;
        if (data[o + 3] < CONSTANTS.CONNECTION_MIN_ALPHA) return false;
        return colorDistance(data[o], data[o + 1], data[o + 2], rgb[0], rgb[1], rgb[2]) < CONSTANTS.COLOR_MATCH_THRESHOLD;
    }
}
