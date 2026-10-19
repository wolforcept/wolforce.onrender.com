/* ═══════════════════════════════════════════════════════════
   screen-world.js  —  The World screen (scaffold)
   Future: a map of regions, unlock-able biomes, expeditions.
   Depends on: game.js
═══════════════════════════════════════════════════════════ */

"use strict";

/* ─────────────────────────────────────────────────────────
   SECTION 1 — WORLD REGIONS CATALOGUE (placeholder)
───────────────────────────────────────────────────────── */

const WORLD_REGIONS = [
  { id: "home_valley", label: "Home Valley", icon: "ia-mountain",   unlocked: true,  description: "Where your mine begins." },
  { id: "ashwood",     label: "Ashwood",     icon: "ia-tree",       unlocked: false, description: "Dense forest. Rumours of silver." },
  { id: "ironspire",   label: "Iron Spire",  icon: "ia-factory",   unlocked: false, description: "Ancient ruins above a rich iron seam." },
  { id: "deep_sea",    label: "Deep Sea",    icon: "ia-water",      unlocked: false, description: "Underwater caves — legendary gems await." },
];

/* ─────────────────────────────────────────────────────────
   SECTION 2 — TOP BAR
───────────────────────────────────────────────────────── */

function worldRenderTopBar() {
  $("#top-middle").html(`
    <span class="page-title">The World</span>
  `);
  $("#top-right").html("");
}

/* ─────────────────────────────────────────────────────────
   SECTION 3 — SCREEN RENDER
───────────────────────────────────────────────────────── */

function worldRenderScreen() {
  const $content = $("#content");
  $content.html(`<div id="screen-world" class="screen-enter"></div>`);
  const $root = $("#screen-world");

  $root.append(`<div class="section-title">Regions</div>`);

  WORLD_REGIONS.forEach(region => {
    $root.append(`
      <div class="card" style="${region.unlocked ? "" : "opacity:.45;"}">
        <div style="display:flex;align-items:center;gap:10px;">
          <i class="ia ${region.icon}"
             style="font-size:1.5rem;color:${region.unlocked ? "var(--c-gold)" : "var(--c-border)"}"></i>
          <div>
            <div class="upgrade-name">${region.label}</div>
            <div class="upgrade-desc">${region.description}</div>
          </div>
          ${region.unlocked
            ? `<button class="btn-secondary" style="margin-left:auto" disabled>
                 <i class="ia ia-marker"></i> Here
               </button>`
            : `<span class="res-pill" style="margin-left:auto;color:var(--c-text-muted)">
                 <i class="ia ia-lock"></i> Locked
               </span>`
          }
        </div>
      </div>
    `);
  });

  $root.append(`
    <div class="divider"></div>
    <div class="scaffold-placeholder" style="min-height:100px">
      <i class="ia ia-compass"></i>
      <h2>Expeditions</h2>
      <p>Send workers on timed journeys for rare resources. Coming soon.</p>
    </div>
  `);
}

/* ─────────────────────────────────────────────────────────
   SECTION 4 — PUBLIC SCREEN INTERFACE
───────────────────────────────────────────────────────── */

const ScreenWorld = {
  pageId: "world",

  mount() {
    worldRenderTopBar();
    worldRenderScreen();
  },

  unmount() {},
};
