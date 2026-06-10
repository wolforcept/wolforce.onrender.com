/** Accumulates ink used and computes XP. */
class InkMeter {
    constructor(state) { this.sm = state; }

    /** Add ink for one primary segment (mirror copies are free). */
    addSegment(lengthPx, inkCostMultiplier, penInkModifier) {
        this.sm.STATE.puzzle.inkUsed += lengthPx * inkCostMultiplier * penInkModifier;
    }

    get ratio() {
        const p = this.sm.STATE.puzzle;
        return p.inkBudget > 0 ? p.inkUsed / p.inkBudget : 0;
    }

    /** XP for the current puzzle: base + efficiency bonus, never below base. */
    calcXP() {
        const efficiencyBonus = Math.max(0, 1 - this.ratio) * CONSTANTS.EFFICIENCY_XP;
        return Math.round(CONSTANTS.BASE_XP + efficiencyBonus);
    }
}
