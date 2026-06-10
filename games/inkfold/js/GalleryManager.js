/** Stores completed drawings as PNG Blobs in IndexedDB and renders the gallery. */
class GalleryManager {
    constructor(refs) {
        this.grid = refs.grid;
        this.empty = refs.empty;
        this.lightbox = refs.lightbox;
        this.lightboxImg = refs.lightboxImg;
        this.lightboxDownload = refs.lightboxDownload;
        this.dbPromise = this._openDb();
        this._objectUrls = [];
    }

    _openDb() {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open("inkfold", 1);
            req.onupgradeneeded = () => {
                const db = req.result;
                if (!db.objectStoreNames.contains("gallery")) {
                    db.createObjectStore("gallery", { keyPath: "id" });
                }
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    async _tx(mode) {
        const db = await this.dbPromise;
        return db.transaction("gallery", mode).objectStore("gallery");
    }

    /** Save a record, then trim oldest beyond the cap. */
    async save(record) {
        try {
            const store = await this._tx("readwrite");
            store.put(record);
            await this._trim();
        } catch (e) {
            console.warn("Gallery save failed:", e);
        }
    }

    async _trim() {
        const all = await this.getAll();
        if (all.length <= CONSTANTS.GALLERY_CAP) return;
        const store = await this._tx("readwrite");
        all.sort((a, b) => a.id - b.id);
        for (let i = 0; i < all.length - CONSTANTS.GALLERY_CAP; i++) store.delete(all[i].id);
    }

    getAll() {
        return new Promise(async (resolve) => {
            try {
                const store = await this._tx("readonly");
                const req = store.getAll();
                req.onsuccess = () => resolve(req.result || []);
                req.onerror = () => resolve([]);
            } catch (e) { resolve([]); }
        });
    }

    async render() {
        this._objectUrls.forEach((u) => URL.revokeObjectURL(u));
        this._objectUrls = [];
        const all = await this.getAll();
        all.sort((a, b) => b.id - a.id);
        this.grid.innerHTML = "";
        this.empty.style.display = all.length ? "none" : "block";
        for (const rec of all) {
            const url = URL.createObjectURL(rec.image);
            this._objectUrls.push(url);
            const tile = document.createElement("div");
            tile.className = "gtile";
            const img = document.createElement("img");
            img.src = url; img.alt = "drawing";
            const cap = document.createElement("div");
            cap.className = "cap";
            cap.textContent = `${rec.date} · ${SYMMETRY_TYPES[rec.symmetry]?.label || rec.symmetry} · +${rec.xpEarned} XP`;
            tile.appendChild(img); tile.appendChild(cap);
            tile.addEventListener("click", () => this._openLightbox(url));
            this.grid.appendChild(tile);
        }
    }

    _openLightbox(url) {
        this.lightboxImg.src = url;
        this.lightboxDownload.href = url;
        this.lightbox.classList.add("show");
    }
}
