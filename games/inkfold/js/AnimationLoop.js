/** rAF loop: erodes fade zones on the main canvas and triggers re-checks. */
class AnimationLoop {
    constructor(ctx, state, zoneManager, connectionChecker) {
        this.ctx = ctx;
        this.sm = state;
        this.zones = zoneManager;
        this.checker = connectionChecker;
        this._tick = this._tick.bind(this);
    }

    start() { requestAnimationFrame(this._tick); }

    _tick() {
        const fadeZones = this.zones.fadeZones;
        if (fadeZones.length) {
            this._erode(fadeZones);
            const puzzle = this.sm.STATE.puzzle;
            if (puzzle && puzzle.pairs.length > 0) this.checker.recheckThrottled();
        }
        requestAnimationFrame(this._tick);
    }

    /** destination-out erosion lowers alpha inside each fade zone slightly per frame. */
    _erode(fadeZones) {
        const ctx = this.ctx;
        ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        ctx.globalAlpha = CONSTANTS.FADE_ZONE_ERASE_ALPHA;
        ctx.fillStyle = "#000";
        for (const z of fadeZones) {
            if (z.kind === "circle") {
                ctx.beginPath();
                ctx.arc(z.x, z.y, z.r, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.restore();
    }
}
