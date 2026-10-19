/* ═══════════════════════════════════════════════════════════
   app.js  —  Depths & Forge
   Router, settings overlay, autosave timer, and boot logic.
   Loaded last — depends on game.js and all screen files.
═══════════════════════════════════════════════════════════ */

"use strict";

/* ─────────────────────────────────────────────────────────
   SECTION 1 — SCREEN REGISTRY
   Maps pageId → screen module.
───────────────────────────────────────────────────────── */

const SCREENS = {
  upgrades: ScreenUpgrades,
  mine:     ScreenMine,
  forge:    ScreenForge,
  town:     ScreenTown,
  world:    ScreenWorld,
};

const DEFAULT_PAGE = "mine";

/* ─────────────────────────────────────────────────────────
   SECTION 2 — ROUTER
───────────────────────────────────────────────────────── */

let _currentPageId = null;

function routerNavigate(pageId) {
  if (!SCREENS[pageId]) {
    console.warn("[Router] Unknown page:", pageId);
    return;
  }

  // Unmount previous screen
  if (_currentPageId && SCREENS[_currentPageId]) {
    SCREENS[_currentPageId].unmount();
  }

  _currentPageId = pageId;

  // Update nav button active state
  $(".nav-btn").removeClass("active");
  $(`.nav-btn[data-page="${pageId}"]`).addClass("active");

  // Mount new screen
  SCREENS[pageId].mount();
}

/* ─────────────────────────────────────────────────────────
   SECTION 3 — SETTINGS OVERLAY
───────────────────────────────────────────────────────── */

function settingsRenderOverlay() {
  const rows = [
    { key: "soundEnabled",  label: "Sound",   desc: "Toggle all audio" },
    { key: "hapticEnabled", label: "Haptics", desc: "Vibration on tap" },
    { key: "darkMode",      label: "Dark UI", desc: "Always dark (recommended)" },
  ];

  const html = rows.map(r => `
    <div class="setting-row">
      <div>
        <div class="setting-label">${r.label}</div>
        <div class="setting-desc">${r.desc}</div>
      </div>
      <label class="toggle-switch" title="${r.label}">
        <input type="checkbox" data-setting-key="${r.key}"
               ${settingsGet(r.key) ? "checked" : ""} />
        <span class="toggle-track">
          <span class="toggle-thumb"></span>
        </span>
      </label>
    </div>
  `).join("");

  const saveResetHtml = `
    <div class="divider"></div>
    <div style="display:flex;gap:10px;margin-top:4px">
      <button class="btn-secondary" id="btn-save-game" style="flex:1">
        <i class="ia ia-save"></i> Save
      </button>
      <button class="btn-secondary" id="btn-reset-game"
              style="flex:1;color:var(--c-danger);border-color:var(--c-danger)">
        <i class="ia ia-trash"></i> Reset
      </button>
    </div>
    <div style="font-size:.75rem;color:var(--c-text-muted);font-style:italic;margin-top:8px;text-align:center">
      Depths & Forge — alpha build
    </div>
  `;

  $("#settings-body").html(html + saveResetHtml);

  // Toggle bindings
  $("#settings-body").on("change", "input[data-setting-key]", function () {
    const key = $(this).data("setting-key");
    settingsToggle(key);
  });

  $("#btn-save-game").on("click", () => {
    gameSave();
    $("#btn-save-game").html(`<i class="ia ia-check"></i> Saved!`);
    setTimeout(() => $("#btn-save-game").html(`<i class="ia ia-save"></i> Save`), 1500);
  });

  $("#btn-reset-game").on("click", () => {
    if (confirm("Reset all progress? This cannot be undone.")) {
      gameReset();
    }
  });
}

function settingsOpen() {
  settingsRenderOverlay();
  $("#overlay-settings").removeClass("hidden");
}

function settingsClose() {
  $("#overlay-settings").addClass("hidden");
}

/* ─────────────────────────────────────────────────────────
   SECTION 4 — TOGGLE SWITCH STYLES (injected once)
───────────────────────────────────────────────────────── */

(function injectToggleStyles() {
  if (document.getElementById("toggle-styles")) return;
  const style = document.createElement("style");
  style.id = "toggle-styles";
  style.textContent = `
    .toggle-switch { display:inline-flex; align-items:center; cursor:pointer; }
    .toggle-switch input { display:none; }
    .toggle-track {
      width:40px; height:22px;
      background: var(--c-border);
      border-radius:11px;
      position:relative;
      transition: background .2s;
    }
    .toggle-switch input:checked + .toggle-track { background: var(--c-gold); }
    .toggle-thumb {
      width:16px; height:16px;
      background: var(--c-text);
      border-radius:50%;
      position:absolute;
      top:3px; left:3px;
      transition: left .2s;
    }
    .toggle-switch input:checked + .toggle-track .toggle-thumb { left:21px; }
  `;
  document.head.appendChild(style);
})();

/* ─────────────────────────────────────────────────────────
   SECTION 5 — AUTOSAVE
───────────────────────────────────────────────────────── */

const AUTOSAVE_INTERVAL_MS = 30_000;   // every 30 seconds

function autosaveStart() {
  setInterval(() => {
    gameSave();
    console.debug("[Autosave] Saved at", new Date().toLocaleTimeString());
  }, AUTOSAVE_INTERVAL_MS);
}

/* ─────────────────────────────────────────────────────────
   SECTION 6 — BOOT
───────────────────────────────────────────────────────── */

$(function () {
  /* 1. Initialise game (loads save or sets defaults, spawns mine nodes) */
  gameInit();

  /* 2. Nav button clicks */
  $(document).on("click", ".nav-btn[data-page]", function () {
    const pageId = $(this).data("page");
    routerNavigate(pageId);
  });

  /* 3. Settings open/close */
  $("#btn-settings").on("click", settingsOpen);
  $("#btn-settings-close").on("click", settingsClose);
  $("#overlay-settings").on("click", function (e) {
    if ($(e.target).is("#overlay-settings")) settingsClose();
  });

  /* 4. Navigate to default page */
  routerNavigate(DEFAULT_PAGE);

  /* 5. Start autosave */
  autosaveStart();
});
