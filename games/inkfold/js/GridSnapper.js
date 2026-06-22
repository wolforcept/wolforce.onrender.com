/** Snaps raw points to the active grid. Pure. */
class GridSnapper {
    /** @returns {[number, number]} snapped [x, y] */
    snap(x, y, grid) {
        const S = CONSTANTS.GRID_SIZE;
        switch (grid) {
            case "square": return [Math.round(x / S) * S, Math.round(y / S) * S];
            case "hex": return this._snapHex(x, y, S);
            case "triangular": return this._snapTriangular(x, y, S);
            case "radial": return this._snapRadial(x, y);
            default: return [x, y];
        }
    }

    _snapHex(x, y, size) {
        // snap to a pointy-top hex lattice approximated by offset rows
        const h = size * 0.866;
        const row = Math.round(y / h);
        const offset = (row % 2) * (size / 2);
        const col = Math.round((x - offset) / size);
        return [col * size + offset, row * h];
    }

    _snapTriangular(x, y, size) {
        const h = size * 0.866;
        const row = Math.round(y / h);
        const offset = (row % 2) * (size / 2);
        const col = Math.round((x - offset) / size);
        return [col * size + offset, row * h];
    }

    _snapRadial(x, y) {
        const cx = CONSTANTS.CANVAS_SIZE / 2, cy = CONSTANTS.CANVAS_SIZE / 2;
        const ringStep = CONSTANTS.GRID_SIZE;
        const spokeStep = 15; // degrees
        const dx = x - cx, dy = y - cy;
        const r = Math.round(Math.hypot(dx, dy) / ringStep) * ringStep;
        const ang = Math.round((Math.atan2(dy, dx) * 180 / Math.PI) / spokeStep) * spokeStep;
        const rad = ang * Math.PI / 180;
        return [cx + Math.cos(rad) * r, cy + Math.sin(rad) * r];
    }
}
