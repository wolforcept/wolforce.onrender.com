/** Draws individual stroke segments in the active pen's style (opaque). */
class PenRenderer {
    /**
     * Draw one segment from p0 to p1.
     * @param {CanvasRenderingContext2D} ctx
     * @param {{x,y}} p0
     * @param {{x,y}} p1
     * @param {string} color
     * @param {number} size - resolved line/stamp size in px
     * @param {string} penType - a PEN_TYPES key
     */
    drawSegment(ctx, p0, p1, color, size, penType) {
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        switch (penType) {
            case "tapered": this._drawTapered(ctx, p0, p1, size); break;
            case "rectangular": this._drawRectangular(ctx, p0, p1, size); break;
            default: this._drawRound(ctx, p0, p1, size); break; // normal/thick/thin
        }
        ctx.restore();
    }

    _drawRound(ctx, p0, p1, size) {
        ctx.lineWidth = size;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
    }

    _drawTapered(ctx, p0, p1, size) {
        // faster movement => thinner; gives a calligraphic feel
        const speed = dist(p0.x, p0.y, p1.x, p1.y);
        const r = Math.max(1.2, size * (1 - clamp(speed / 60, 0, 0.75)) * 0.5);
        ctx.lineWidth = r * 2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
    }

    _drawRectangular(ctx, p0, p1, size) {
        const len = dist(p0.x, p0.y, p1.x, p1.y) + size;
        const ang = Math.atan2(p1.y - p0.y, p1.x - p0.x);
        ctx.translate(p0.x, p0.y);
        ctx.rotate(ang);
        ctx.fillRect(-size / 2, -size / 2, len, size);
    }
}
