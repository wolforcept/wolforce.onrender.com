/** Tracks zones, tests containment, and returns combined effects at a point. */
class ZoneManager {
    constructor() { this.zones = []; }
    setZones(zones) { this.zones = zones || []; }
    get fadeZones() { return this.zones.filter((z) => z.type === "fade"); }
    hasFadeZones() { return this.fadeZones.length > 0; }

    _contains(x, y, zone) {
        if (zone.kind === "circle") return dist(x, y, zone.x, zone.y) <= zone.r;
        if (zone.kind === "poly") return pointInPolygon(x, y, zone.points);
        return false;
    }

    /** @returns {{penSizeMultiplier, inkCostMultiplier, isGlide}} */
    effectsAt(x, y) {
        let penSizeMultiplier = 1, inkCostMultiplier = 1, isGlide = false;
        for (const zone of this.zones) {
            if (!this._contains(x, y, zone)) continue;
            switch (zone.type) {
                case "thin": penSizeMultiplier *= 0.4; break;
                case "thick": penSizeMultiplier *= 2.0; break;
                case "inkdrain": inkCostMultiplier *= 2.0; break;
                case "glide": isGlide = true; break;
                // fade is handled by the animation loop, not per-point
            }
        }
        return { penSizeMultiplier, inkCostMultiplier, isGlide };
    }
}
