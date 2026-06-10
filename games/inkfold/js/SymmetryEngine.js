/** Produces the mirrored copies of a point for the active symmetry. */
class SymmetryEngine {
    /**
     * @param {number} x
     * @param {number} y
     * @param {string} symmetry - a SYMMETRY_TYPES key
     * @returns {Array<[number, number]>} copies including the original (index 0)
     */
    getMirroredPoints(x, y, symmetry) {
        const W = CONSTANTS.CANVAS_SIZE, H = CONSTANTS.CANVAS_SIZE;
        const cx = W / 2, cy = H / 2;
        switch (symmetry) {
            case "vertical": return [[x, y], [W - x, y]];
            case "horizontal": return [[x, y], [x, H - y]];
            case "4way": return [[x, y], [W - x, y], [x, H - y], [W - x, H - y]];
            case "3fold": return [0, 120, 240].map((d) => rotate(x, y, cx, cy, d));
            case "6fold": return [0, 60, 120, 180, 240, 300].map((d) => rotate(x, y, cx, cy, d));
            case "radial": {
                const dx = x - cx, dy = y - cy;
                const d = Math.hypot(dx, dy);
                const maxDist = Math.min(cx, cy);
                const mirrored = Math.max(0, maxDist - d);
                const ang = Math.atan2(dy, dx);
                return [[x, y], [cx + Math.cos(ang) * mirrored, cy + Math.sin(ang) * mirrored]];
            }
            default: return [[x, y]];
        }
    }
}