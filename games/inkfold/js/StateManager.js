
const STATE_KEY = "inkfold_state";
const PROGRESS_KEY = "inkfold_progress";

/** Owns STATE, derives the unlock pool, and persists progression + progress. */
class StateManager {
    constructor() {
        this.STATE = {
            xp: 0,
            level: 0,
            equipped: {
                background: "dark",
                texture: "none",
                strokePalette: "default",
                completionAnim: "none",
                penVisual: "ballpoint",
            },
            selectedPen: "normal", // player-chosen drawing tool (persisted)
            puzzle: null,        // set by the generator / progress restore
            isDrawing: false,
        };
        this._loadState();
    }

    /** Mechanical unlock keys whose XP threshold has been reached (nulls filtered). */
    get unlockedPool() {
        return LEVELS.filter((lv) => lv.xpRequired <= this.STATE.xp && lv.unlocks).map((lv) => lv.unlocks);
    }

    /** The level a given XP total corresponds to (highest threshold reached). */
    levelForXp(xp) {
        let lv = 0;
        for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i].xpRequired) lv = i;
        return lv;
    }

    _loadState() {
        try {
            const raw = localStorage.getItem(STATE_KEY);
            if (raw) {
                const saved = JSON.parse(raw);
                this.STATE.xp = saved.xp || 0;
                this.STATE.level = this.levelForXp(this.STATE.xp);
                Object.assign(this.STATE.equipped, saved.equipped || {});
                if (saved.selectedPen && PEN_TYPES[saved.selectedPen]) this.STATE.selectedPen = saved.selectedPen;
            }
        } catch (e) {
            console.warn("Failed to load state:", e);
        }
    }

    saveState() {
        try {
            localStorage.setItem(STATE_KEY, JSON.stringify({ xp: this.STATE.xp, equipped: this.STATE.equipped, selectedPen: this.STATE.selectedPen }));
        } catch (e) {
            console.warn("Failed to save state:", e);
        }
    }

    /** Persist the in-progress puzzle plus a snapshot of the current ink. */
    saveProgress(canvasSnapshot) {
        try {
            const p = this.STATE.puzzle;
            localStorage.setItem(PROGRESS_KEY, JSON.stringify({
                seed: p.seed,
                puzzle: p,
                inkUsed: p.inkUsed,
                canvasSnapshot,
            }));
        } catch (e) {
            console.warn("Failed to save progress:", e);
        }
    }

    loadProgress() {
        try {
            const raw = localStorage.getItem(PROGRESS_KEY);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (e) {
            console.warn("Failed to load progress:", e);
            return null;
        }
    }

    clearProgress() {
        try { localStorage.removeItem(PROGRESS_KEY); } catch (e) { /* ignore */ }
    }
}
