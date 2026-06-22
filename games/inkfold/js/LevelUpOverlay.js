/** Shows queued level-up notifications one at a time. */
class LevelUpOverlay {
    constructor(refs) {
        this.overlay = refs.overlay;
        this.title = refs.title;
        this.unlock = refs.unlock;
        this.queue = [];
        refs.continueBtn.addEventListener("click", () => this._next());
    }

    enqueue(level) { this.queue.push(level); if (!this.overlay.classList.contains("show")) this._next(); }

    _next() {
        if (this.queue.length === 0) { this.overlay.classList.remove("show"); return; }
        const level = this.queue.shift();
        this.title.textContent = "Level " + level + " reached!";
        this.unlock.textContent = "Unlocked: " + unlockLabel(LEVELS[level].unlocks);
        this.overlay.classList.add("show");
    }
}
