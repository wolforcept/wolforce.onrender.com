/* ═══════════════════════════════════════════════════════════
   screen-forge.js  —  The Forge screen (scaffold)
   The Forge is the main hub for mineral transformation.
   Full implementation is deferred; structure is ready.
   Depends on: game.js
═══════════════════════════════════════════════════════════ */

"use strict";

/* ─────────────────────────────────────────────────────────
   SECTION 1 — FORGE RECIPES CATALOGUE (placeholder)
   Each recipe: { id, label, inputs, output, durationSec }
   Will be expanded in the full implementation.
───────────────────────────────────────────────────────── */

const FORGE_RECIPES = [
    {
        id: "smelt_copper",
        label: "Smelt Copper",
        icon: "ia-fire",
        inputs: { copper: 3 },
        output: { copper_bar: 1 },
        durationSec: 8,
    },
    {
        id: "smelt_iron",
        label: "Smelt Iron",
        icon: "ia-fire",
        inputs: { iron: 4 },
        output: { iron_bar: 1 },
        durationSec: 12,
    },
    {
        id: "smelt_silver",
        label: "Smelt Silver",
        icon: "ia-fire",
        inputs: { silver: 3, coal: 1 },
        output: { silver_bar: 1 },
        durationSec: 18,
    },
    {
        id: "smelt_gold",
        label: "Smelt Gold",
        icon: "ia-fire",
        inputs: { gold_ore: 2, coal: 2 },
        output: { gold_bar: 1 },
        durationSec: 30,
    },
];

/* ─────────────────────────────────────────────────────────
   SECTION 2 — TOP BAR
───────────────────────────────────────────────────────── */

function forgeRenderTopBar() {
    const forgeUnlocked = hasPurchased("forge_unlock");
    const slotCount = GameState.forge.slots.length;

    $("#top-middle").html(`
    <span class="page-title">The Forge</span>
  `);

    if (forgeUnlocked) {
        $("#top-right").html(`
      <div class="stat-row">
        <span class="res-pill" title="Active forge slots">
          <i class="ia ia-fire"></i> ${slotCount} slot${slotCount !== 1 ? "s" : ""}
        </span>
      </div>
    `);
    } else {
        $("#top-right").html("");
    }
}

/* ─────────────────────────────────────────────────────────
   SECTION 3 — SCREEN RENDER
───────────────────────────────────────────────────────── */

function forgeRenderScreen() {
    const $content = $("#content");
    $content.html(`<div id="screen-forge" class="screen-enter"></div>`);
    const $root = $("#screen-forge");

    const forgeUnlocked = hasPurchased("forge_unlock");

    if (!forgeUnlocked) {
        // Forge not yet built — prompt to purchase upgrade
        $root.html(`
      <div class="scaffold-placeholder">
        <i class="ia ia-fire"></i>
        <h2>Forge Not Built</h2>
        <p>Purchase the <em>Build the Forge</em> upgrade to unlock smelting.</p>
      </div>
    `);
        return;
    }

    /* — Smelting Slots ————————————————————————————————————— */
    $root.append(`<div class="section-title">Smelting Slots</div>`);

    const $slots = $('<div class="forge-slots"></div>');
    const slotCount = GameState.forge.slots.length;

    GameState.forge.slots.forEach((slot, idx) => {
        const isIdle = !slot.recipeId;
        $slots.append(`
      <div class="forge-slot" data-slot-index="${idx}">
        <i class="ia ${isIdle ? "ia-fire" : "ia-spinner"}"></i>
        <span>${isIdle ? `Slot ${idx + 1} — Idle` : `Smelting…`}</span>
        ${isIdle
                ? `<button class="btn-secondary btn-forge-start" data-slot="${idx}">
               <i class="ia ia-play"></i> Start
             </button>`
                : `<div style="font-size:.75rem;color:var(--c-text-muted)">
               <!-- Progress bar will go here -->
             </div>`
            }
      </div>
    `);
    });

    $root.append($slots);

    /* — Recipe List ————————————————————————————————————————— */
    $root.append(`<div class="section-title mt-16">Available Recipes</div>`);
    const $recipes = $('<div class="upgrade-list"></div>');

    FORGE_RECIPES.forEach(recipe => {
        const inputStr = Object.entries(recipe.inputs)
            .map(([r, n]) => `${n}× ${r}`)
            .join(", ");
        const outputStr = Object.entries(recipe.output)
            .map(([r, n]) => `${n}× ${r}`)
            .join(", ");

        $recipes.append(`
      <div class="card">
        <div class="upgrade-name"><i class="ia ${recipe.icon}"></i> &nbsp;${recipe.label}</div>
        <div class="upgrade-desc" style="margin-top:4px">
          <span class="text-muted">${inputStr}</span>
          &nbsp;<i class="ia ia-chevron-right"></i>&nbsp;
          <span class="text-gold">${outputStr}</span>
          &nbsp;&nbsp;
          <i class="ia ia-clock"></i> ${recipe.durationSec}s
        </div>
      </div>
    `);
    });

    $root.append($recipes);

    /* — Queue ——————————————————————————————————————————————— */
    $root.append(`
    <div class="forge-queue mt-16">
      <div class="section-title">Queue</div>
      <div class="scaffold-placeholder" style="min-height:80px">
        <i class="ia ia-scroll"></i>
        <p>Queue system coming soon.</p>
      </div>
    </div>
  `);
}

/* ─────────────────────────────────────────────────────────
   SECTION 4 — PUBLIC SCREEN INTERFACE
───────────────────────────────────────────────────────── */

const ScreenForge = {
    pageId: "forge",

    mount() {
        forgeRenderTopBar();
        forgeRenderScreen();
    },

    unmount() { },
};
