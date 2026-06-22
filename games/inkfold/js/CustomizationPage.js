/** Renders vanity tiles and persists equip selections. */
class CustomizationPage {
    constructor(root, state, onChange) {
        this.root = root;
        this.sm = state;
        this.onChange = onChange;
        this.categories = [
            { key: "background", title: "Background", data: BACKGROUNDS },
            { key: "texture", title: "Texture", data: TEXTURES },
            { key: "strokePalette", title: "Stroke Palette", data: PALETTES },
            { key: "completionAnim", title: "Completion Animation", data: ANIMATIONS },
            { key: "penVisual", title: "Pen Visual", data: PEN_VISUALS },
        ];
    }

    render() {
        this.root.innerHTML = "";
        for (const cat of this.categories) {
            const wrap = document.createElement("div");
            wrap.className = "cat";
            const h = document.createElement("h3");
            h.textContent = cat.title;
            wrap.appendChild(h);
            const tiles = document.createElement("div");
            tiles.className = "tiles";
            for (const itemKey of Object.keys(cat.data)) {
                tiles.appendChild(this._tile(cat, itemKey));
            }
            wrap.appendChild(tiles);
            this.root.appendChild(wrap);
        }
    }

    _tile(cat, itemKey) {
        const item = cat.data[itemKey];
        const locked = this.sm.STATE.level < item.unlockLevel;
        const selected = this.sm.STATE.equipped[cat.key] === itemKey;

        const tile = document.createElement("div");
        tile.className = "tile" + (locked ? " locked" : "") + (selected ? " selected" : "");

        const name = document.createElement("div");
        name.className = "tname";
        name.textContent = item.label;
        tile.appendChild(name);

        if (cat.key === "background") {
            const sw = document.createElement("div");
            sw.className = "swrow";
            const s = document.createElement("span");
            s.style.background = item.color;
            sw.appendChild(s);
            tile.appendChild(sw);
        }

        const status = document.createElement("div");
        status.className = "tlock";
        status.textContent = locked ? "Unlocks at level " + item.unlockLevel : (selected ? "Equipped" : "Tap to equip");
        tile.appendChild(status);

        if (!locked) {
            tile.addEventListener("click", () => {
                this.sm.STATE.equipped[cat.key] = itemKey;
                this.sm.saveState();
                this.render();
                if (this.onChange) this.onChange();
            });
        }
        return tile;
    }
}
