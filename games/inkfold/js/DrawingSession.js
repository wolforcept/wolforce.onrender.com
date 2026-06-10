/** Orchestrates pointer input and delegates to snap/zone/pen/ink/checker. */
class DrawingSession {
    constructor(deps) {
        this.canvas = deps.canvas;
        this.ctx = deps.ctx;
        this.sm = deps.state;
        this.symmetry = deps.symmetry;
        this.grid = deps.grid;
        this.pen = deps.pen;
        this.zones = deps.zones;
        this.ink = deps.ink;
        this.checker = deps.checker;
        this.ui = deps.ui;
        this.onProgress = deps.onProgress;   // called (throttled) to persist a snapshot
        this.locked = false;                 // true once the puzzle is complete
        this.last = null;                    // last snapped point
        this._bind();
    }

    setLocked(v) { this.locked = v; }

    _bind() {
        this.canvas.addEventListener("pointerdown", (e) => this._down(e));
        this.canvas.addEventListener("pointermove", (e) => this._move(e));
        window.addEventListener("pointerup", () => this._up());
        this.canvas.addEventListener("pointerleave", () => this.ui.moveCursor(0, 0, false));
    }

    _pointFromEvent(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (CONSTANTS.CANVAS_SIZE / rect.width);
        const y = (e.clientY - rect.top) * (CONSTANTS.CANVAS_SIZE / rect.height);
        return { x, y };
    }

    _down(e) {
        this.canvas.setPointerCapture && this.canvas.setPointerCapture(e.pointerId);
        if (this.locked) return;
        this.sm.STATE.isDrawing = true;
        const raw = this._pointFromEvent(e);
        const p = this._processPoint(raw);
        this.last = p;
        // a tap leaves a dab so single dots register
        this._paintSegment(p, p);
    }

    _move(e) {
        const raw = this._pointFromEvent(e);
        this.ui.moveCursor(raw.x / CONSTANTS.CANVAS_SIZE * 100, raw.y / CONSTANTS.CANVAS_SIZE * 100, true);
        if (!this.sm.STATE.isDrawing || this.locked) return;
        const p = this._processPoint(raw);
        if (this.last) this._paintSegment(this.last, p);
        this.last = p;
    }

    _up() {
        if (!this.sm.STATE.isDrawing) return;
        this.sm.STATE.isDrawing = false;
        this.last = null;
        if (this.locked) return;
        this.checker.run();
        if (this.onProgress) this.onProgress();
    }

    /** Snap + glide-smooth a raw point into the point we will draw. */
    _processPoint(raw) {
        const puzzle = this.sm.STATE.puzzle;
        let [sx, sy] = this.grid.snap(raw.x, raw.y, puzzle.grid);
        const fx = this.zones.effectsAt(sx, sy);
        if (fx.isGlide && this.last) {
            sx = this.last.x + (sx - this.last.x) * 0.5;
            sy = this.last.y + (sy - this.last.y) * 0.5;
        }
        return { x: sx, y: sy };
    }

    /** Paint a segment (with all symmetry copies) and bill ink for the primary copy. */
    _paintSegment(p0, p1) {
        const puzzle = this.sm.STATE.puzzle;
        const colorIndex = this.ui.selectedColor;
        const color = puzzle.colors[colorIndex];
        const fx = this.zones.effectsAt(p1.x, p1.y);
        const penKey = this.sm.STATE.selectedPen;
        const penDef = PEN_TYPES[penKey];
        const size = penDef.sizeBase * fx.penSizeMultiplier;

        const copies0 = this.symmetry.getMirroredPoints(p0.x, p0.y, puzzle.symmetry);
        const copies1 = this.symmetry.getMirroredPoints(p1.x, p1.y, puzzle.symmetry);
        for (let i = 0; i < copies0.length; i++) {
            this.pen.drawSegment(
                this.ctx,
                { x: copies0[i][0], y: copies0[i][1] },
                { x: copies1[i][0], y: copies1[i][1] },
                color, size, penKey
            );
        }

        // ink: primary segment only
        const segLen = dist(p0.x, p0.y, p1.x, p1.y);
        this.ink.addSegment(segLen, fx.inkCostMultiplier, penDef.inkModifier);
        this.ui.updateInkBar(this.ink.ratio);
    }
}
