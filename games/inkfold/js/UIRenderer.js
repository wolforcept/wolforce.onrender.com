/** Owns all non-ink UI: dot divs, zone/axis SVG, bars, swatches, cursor. */
class UIRenderer {
    constructor(state, refs) {
        this.sm = state;
        this.dots = refs.dots;
        this.overlay = refs.overlay;
        this.swatches = refs.swatches;
        this.pens = refs.pens;
        this.onSelectPen = refs.onSelectPen;
        this.inkFill = refs.inkFill;
        this.inkTrack = refs.inkTrack;
        this.xpFill = refs.xpFill;
        this.metaLeft = refs.metaLeft;
        this.metaRight = refs.metaRight;
        this.cursorDot = refs.cursorDot;
        this.onSelectColor = refs.onSelectColor;
        this.selectedColor = 0;
    }

    /** Rebuild dot markers, zones, axis, and swatches for the current puzzle. */
    renderPuzzle() {
        const p = this.sm.STATE.puzzle;
        this._renderDots(p);
        this._renderOverlay(p);
        this._renderSwatches(p);
        this._renderPens();
        this.metaRight.textContent = SYMMETRY_TYPES[p.symmetry].label;
        this.metaLeft.textContent = "Level " + this.sm.STATE.level;
    }

    _renderDots(p) {
        this.dots.innerHTML = "";
        for (const pair of p.pairs) {
            for (const d of [pair.a, pair.b]) {
                const el = document.createElement("div");
                el.className = "dot";
                const size = CONSTANTS.DOT_RADIUS * 2;
                el.style.width = el.style.height = (size / CONSTANTS.CANVAS_SIZE * 100) + "%";
                el.style.left = (d.x / CONSTANTS.CANVAS_SIZE * 100) + "%";
                el.style.top = (d.y / CONSTANTS.CANVAS_SIZE * 100) + "%";
                el.style.background = p.colors[pair.colorIndex];
                el.dataset.colorIndex = pair.colorIndex;
                this.dots.appendChild(el);
            }
        }
    }

    /** Animate-out and remove the dots of a completed colour. */
    removeColorDots(colorIndex) {
        this.dots.querySelectorAll('.dot[data-color-index="' + colorIndex + '"]').forEach((el) => {
            el.classList.add("removing");
            setTimeout(() => el.remove(), 260);
        });
        this._markSwatchDone(colorIndex);
    }

    _renderOverlay(p) {
        const NS = "http://www.w3.org/2000/svg";
        this.overlay.innerHTML = "";
        // zones
        for (const z of p.zones) {
            if (z.kind === "circle") {
                const c = document.createElementNS(NS, "circle");
                c.setAttribute("cx", z.x); c.setAttribute("cy", z.y); c.setAttribute("r", z.r);
                c.setAttribute("fill", ZONE_TYPES[z.type].color);
                c.setAttribute("fill-opacity", "0.07");
                c.setAttribute("stroke", ZONE_TYPES[z.type].color);
                c.setAttribute("stroke-opacity", "0.5");
                c.setAttribute("stroke-dasharray", "6 6");
                c.setAttribute("stroke-width", "2");
                this.overlay.appendChild(c);
            }
        }
        // symmetry axis (guide lines)
        const cx = CONSTANTS.CANVAS_SIZE / 2, cy = CONSTANTS.CANVAS_SIZE / 2, S = CONSTANTS.CANVAS_SIZE;
        const addLine = (x1, y1, x2, y2) => {
            const l = document.createElementNS(NS, "line");
            l.setAttribute("x1", x1); l.setAttribute("y1", y1); l.setAttribute("x2", x2); l.setAttribute("y2", y2);
            l.setAttribute("stroke", "#ffffff"); l.setAttribute("stroke-opacity", "0.08"); l.setAttribute("stroke-width", "1.5");
            this.overlay.appendChild(l);
        };
        const sym = p.symmetry;
        if (sym === "vertical" || sym === "4way") addLine(cx, 0, cx, S);
        if (sym === "horizontal" || sym === "4way") addLine(0, cy, S, cy);
        if (sym === "3fold" || sym === "6fold") {
            const n = sym === "3fold" ? 3 : 6;
            for (let i = 0; i < n; i++) {
                const a = (i * 360 / n) * Math.PI / 180;
                addLine(cx, cy, cx + Math.cos(a) * cx, cy + Math.sin(a) * cy);
            }
        }
        if (sym === "radial") {
            const c = document.createElementNS(NS, "circle");
            c.setAttribute("cx", cx); c.setAttribute("cy", cy); c.setAttribute("r", Math.min(cx, cy));
            c.setAttribute("fill", "none"); c.setAttribute("stroke", "#ffffff"); c.setAttribute("stroke-opacity", "0.08");
            this.overlay.appendChild(c);
        }
    }

    _renderSwatches(p) {
        this.swatches.innerHTML = "";
        this.selectedColor = 0;
        p.colors.forEach((color, i) => {
            const s = document.createElement("div");
            s.className = "swatch" + (i === 0 ? " selected" : "");
            s.style.background = color;
            s.dataset.colorIndex = i;
            s.addEventListener("click", () => {
                if (s.classList.contains("done")) return;
                this.selectColor(i);
            });
            this.swatches.appendChild(s);
        });
        // single colour: no need to choose
        this.swatches.style.visibility = p.colors.length > 1 ? "visible" : "hidden";
    }

    selectColor(i) {
        this.selectedColor = i;
        this.swatches.querySelectorAll(".swatch").forEach((s) => {
            s.classList.toggle("selected", Number(s.dataset.colorIndex) === i);
        });
        if (this.onSelectColor) this.onSelectColor(i);
    }

    _markSwatchDone(colorIndex) {
        const s = this.swatches.querySelector('.swatch[data-color-index="' + colorIndex + '"]');
        if (s) { s.classList.add("done"); s.classList.remove("selected"); }
        // if the active colour was completed, switch to a remaining one
        if (this.selectedColor === colorIndex) {
            const next = [...this.swatches.querySelectorAll(".swatch")].find((x) => !x.classList.contains("done"));
            if (next) this.selectColor(Number(next.dataset.colorIndex));
        }
    }

    /** Build the pen selector from the currently unlocked pens. */
    _renderPens() {
        const pool = this.sm.unlockedPool;
        const unlocked = Object.keys(PEN_TYPES)
            .filter((k) => PEN_TYPES[k].unlock === null || pool.includes(PEN_TYPES[k].unlock));
        if (!unlocked.includes(this.sm.STATE.selectedPen)) this.sm.STATE.selectedPen = "normal";

        this.pens.innerHTML = "";
        for (const key of unlocked) {
            const b = document.createElement("button");
            b.className = "pen-btn" + (key === this.sm.STATE.selectedPen ? " selected" : "");
            b.textContent = PEN_TYPES[key].label;
            b.dataset.pen = key;
            b.addEventListener("click", () => this.selectPen(key));
            this.pens.appendChild(b);
        }
        // only worth showing once the player has a choice
        this.pens.style.display = unlocked.length > 1 ? "flex" : "none";
    }

    selectPen(key) {
        this.sm.STATE.selectedPen = key;
        this.pens.querySelectorAll(".pen-btn").forEach((b) => b.classList.toggle("selected", b.dataset.pen === key));
        if (this.onSelectPen) this.onSelectPen(key);
    }

    updateInkBar(ratio) {
        this.inkFill.style.width = Math.min(100, ratio * 100) + "%";
        this.inkTrack.classList.toggle("over", ratio > 1);
    }

    updateXpBar() {
        const xp = this.sm.STATE.xp, level = this.sm.STATE.level;
        const curBase = LEVELS[level].xpRequired;
        const next = LEVELS[level + 1];
        const ratio = next ? (xp - curBase) / (next.xpRequired - curBase) : 1;
        this.xpFill.style.width = clamp(ratio, 0, 1) * 100 + "%";
        this.metaLeft.textContent = "Level " + level;
    }

    moveCursor(xPct, yPct, visible) {
        this.cursorDot.style.left = xPct + "%";
        this.cursorDot.style.top = yPct + "%";
        this.cursorDot.style.display = visible ? "block" : "none";
    }

    setCursorColor(color) { this.cursorDot.style.borderColor = color; }
}
