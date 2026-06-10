"use strict";

/* Init — wire everything together */

const Game = (() => {
    // Core refs
    const canvas = document.getElementById("canvas");
    canvas.width = CONSTANTS.CANVAS_SIZE;
    canvas.height = CONSTANTS.CANVAS_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) { alert("Canvas not supported in this browser."); throw new Error("no 2d context"); }

    const stage = document.getElementById("stage");

    // Instances
    const sm = new StateManager();
    const generator = new PuzzleGenerator();
    const symmetry = new SymmetryEngine();
    const grid = new GridSnapper();
    const pen = new PenRenderer();
    const zones = new ZoneManager();
    const ink = new InkMeter(sm);

    const ui = new UIRenderer(sm, {
        dots: document.getElementById("dots"),
        overlay: document.getElementById("overlay"),
        swatches: document.getElementById("swatches"),
        pens: document.getElementById("pens"),
        onSelectPen: () => sm.saveState(),
        inkFill: document.getElementById("inkFill"),
        inkTrack: document.getElementById("inkTrack"),
        xpFill: document.getElementById("xpFill"),
        metaLeft: document.getElementById("metaLeft"),
        metaRight: document.getElementById("metaRight"),
        cursorDot: document.getElementById("cursorDot"),
        onSelectColor: () => { },
    });

    const checker = new ConnectionChecker(canvas, sm, onColorComplete, onWin);
    const loop = new AnimationLoop(ctx, sm, zones, checker);

    const levelUp = new LevelUpOverlay({
        overlay: document.getElementById("levelOverlay"),
        title: document.getElementById("levelTitle"),
        unlock: document.getElementById("levelUnlock"),
        continueBtn: document.getElementById("levelContinue"),
    });

    const gallery = new GalleryManager({
        grid: document.getElementById("galleryGrid"),
        empty: document.getElementById("galleryEmpty"),
        lightbox: document.getElementById("lightbox"),
        lightboxImg: document.getElementById("lightboxImg"),
        lightboxDownload: document.getElementById("lightboxDownload"),
    });

    const customization = new CustomizationPage(document.getElementById("customizeRoot"), sm, applyEquipped);

    let session = null;
    let saveTimer = 0;
    let pendingDrawing = null;  // composed canvas of the finished puzzle, awaiting Save
    let pendingMeta = null;     // its gallery metadata

    /* ---- progress snapshot (throttled) ---- */
    function persistProgress() {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(() => {
            try { sm.saveProgress(canvas.toDataURL("image/png")); } catch (e) { /* ignore */ }
        }, 150);
    }

    /* ---- apply equipped vanity ---- */
    function applyEquipped() {
        const eq = sm.STATE.equipped;
        const bg = BACKGROUNDS[eq.background] || BACKGROUNDS.dark;
        stage.style.backgroundColor = bg.color;
        const tex = TEXTURES[eq.texture] || TEXTURES.none;
        stage.style.backgroundImage = tex.css === "none" ? "none" : tex.css;
        stage.style.backgroundSize = tex.size || "auto";
        const pv = PEN_VISUALS[eq.penVisual] || PEN_VISUALS.ballpoint;
        ui.setCursorColor(pv.cursor);
    }

    /* ---- new puzzle ---- */
    function newPuzzle(seed) {
        const s = (seed === undefined) ? (Date.now() ^ (Math.random() * 1e9)) | 0 : seed;
        const palette = PALETTES[sm.STATE.equipped.strokePalette] || PALETTES.default;
        const puzzle = generator.generate(s, sm.unlockedPool, palette);
        startPuzzle(puzzle);
        persistProgress();
    }

    function startPuzzle(puzzle) {
        sm.STATE.puzzle = puzzle;
        ctx.clearRect(0, 0, CONSTANTS.CANVAS_SIZE, CONSTANTS.CANVAS_SIZE);
        zones.setZones(puzzle.zones);
        checker.reset();
        ui.renderPuzzle();
        ui.updateInkBar(ink.ratio);
        ui.updateXpBar();
        session.setLocked(false);
        hideOverlay("completeOverlay");
    }

    /** Restore a saved puzzle and blit its ink snapshot back onto the canvas. */
    function restorePuzzle(progress) {
        sm.STATE.puzzle = progress.puzzle;
        zones.setZones(progress.puzzle.zones);
        checker.reset();
        ui.renderPuzzle();
        ui.updateXpBar();
        session.setLocked(false);

        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, CONSTANTS.CANVAS_SIZE, CONSTANTS.CANVAS_SIZE);
            ctx.drawImage(img, 0, 0, CONSTANTS.CANVAS_SIZE, CONSTANTS.CANVAS_SIZE);
            ui.updateInkBar(ink.ratio);
            checker.run(); // in case a colour was already complete
        };
        img.onerror = () => ui.updateInkBar(ink.ratio);
        if (progress.canvasSnapshot) img.src = progress.canvasSnapshot;
        else ui.updateInkBar(ink.ratio);
    }

    /* ---- completion callbacks ---- */
    function onColorComplete(colorIndex) {
        ui.removeColorDots(colorIndex);
    }

    function onWin() {
        session.setLocked(true);
        const eq = sm.STATE.equipped;
        const anim = ANIMATIONS[eq.completionAnim];
        if (anim && anim.cls) {
            stage.classList.remove("anim-burst", "anim-ripple");
            void stage.offsetWidth; // restart animation
            stage.classList.add(anim.cls);
            setTimeout(() => stage.classList.remove(anim.cls), 900);
        }

        const xpEarned = ink.calcXP();
        const beforeLevel = sm.STATE.level;
        sm.STATE.xp += xpEarned;

        // level-up loop over crossed thresholds
        let newLevel = beforeLevel;
        while (LEVELS[newLevel + 1] && sm.STATE.xp >= LEVELS[newLevel + 1].xpRequired) {
            newLevel++;
            levelUp.enqueue(newLevel);
        }
        sm.STATE.level = newLevel;
        sm.saveState();
        sm.clearProgress();
        ui.updateXpBar();

        // Prepare the finished drawing for preview — but do NOT save it. The player
        // chooses whether it goes to the gallery via the Save button below.
        const puzzle = sm.STATE.puzzle;
        pendingDrawing = composeDrawing();
        pendingMeta = {
            symmetry: puzzle.symmetry,
            colors: puzzle.colors,
            xpEarned,
            level: sm.STATE.level,
        };

        document.getElementById("completeImg").src = pendingDrawing.toDataURL("image/png");
        document.getElementById("completeXp").textContent = "+" + xpEarned + " XP";
        document.getElementById("completeSub").textContent = "Save this drawing to your gallery?";
        const saveBtn = document.getElementById("completeSave");
        saveBtn.disabled = false;
        saveBtn.textContent = "Save to gallery";
        showOverlay("completeOverlay");
    }

    /** Composite the equipped background with the ink into an offscreen canvas. */
    function composeDrawing() {
        const exportCanvas = document.createElement("canvas");
        exportCanvas.width = CONSTANTS.CANVAS_SIZE;
        exportCanvas.height = CONSTANTS.CANVAS_SIZE;
        const ex = exportCanvas.getContext("2d");
        const bg = BACKGROUNDS[sm.STATE.equipped.background] || BACKGROUNDS.dark;
        ex.fillStyle = bg.color;
        ex.fillRect(0, 0, CONSTANTS.CANVAS_SIZE, CONSTANTS.CANVAS_SIZE);
        ex.drawImage(canvas, 0, 0);
        return exportCanvas;
    }

    /** Store the prepared drawing in the gallery — only when the player asks. */
    function savePending() {
        if (!pendingDrawing || !pendingMeta) return;
        const meta = pendingMeta;
        pendingDrawing.toBlob((blob) => {
            if (!blob) return;
            gallery.save({
                id: Date.now(),
                image: blob,
                date: new Date().toISOString().slice(0, 10),
                symmetry: meta.symmetry,
                colors: meta.colors,
                xpEarned: meta.xpEarned,
                level: meta.level,
            });
        }, "image/png");
        pendingDrawing = null; // guard against double-save
        const saveBtn = document.getElementById("completeSave");
        saveBtn.disabled = true;
        saveBtn.textContent = "Saved ✓";
        document.getElementById("completeSub").textContent = "Saved to gallery";
    }

    /* ---- view switching ---- */
    function showView(name) {
        document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
        document.getElementById(name + "-view").classList.add("active");
        document.querySelectorAll("#nav button").forEach((b) => b.classList.toggle("active", b.dataset.view === name));
        if (name === "gallery") gallery.render();
        if (name === "customize") customization.render();
    }

    function showOverlay(id) { document.getElementById(id).classList.add("show"); }
    function hideOverlay(id) { document.getElementById(id).classList.remove("show"); }

    /* ---- responsive stage scaling ---- */
    function fitStage() {
        const avail = Math.min(window.innerWidth - 40, 720, window.innerHeight - 260);
        const scale = clamp(avail / 720, 0.4, 1);
        stage.style.transform = "scale(" + scale + ")";
        stage.style.marginBottom = (720 * (scale - 1)) + "px"; // collapse the gap left by scaling
    }

    /* ---- bootstrap ---- */
    function init() {
        session = new DrawingSession({
            canvas, ctx, state: sm, symmetry, grid, pen, zones, ink, checker, ui,
            onProgress: persistProgress,
        });

        // nav
        document.querySelectorAll("#nav button").forEach((b) => {
            b.addEventListener("click", () => showView(b.dataset.view));
        });

        // buttons
        document.getElementById("newPuzzleBtn").addEventListener("click", () => newPuzzle());
        document.getElementById("completeSave").addEventListener("click", savePending);
        document.getElementById("completeNext").addEventListener("click", () => { hideOverlay("completeOverlay"); newPuzzle(); });
        document.getElementById("lightboxClose").addEventListener("click", () => hideOverlay("lightbox"));
        document.getElementById("lightbox").addEventListener("click", (e) => { if (e.target.id === "lightbox") hideOverlay("lightbox"); });

        applyEquipped();
        fitStage();
        window.addEventListener("resize", fitStage);

        const progress = sm.loadProgress();
        if (progress && progress.puzzle) restorePuzzle(progress);
        else newPuzzle();

        loop.start();
    }

    return { init };
})();

Game.init();
