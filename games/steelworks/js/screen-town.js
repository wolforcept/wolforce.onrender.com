/* ═══════════════════════════════════════════════════════════
   screen-town.js  —  The Town screen (scaffold)
   Future home of shops, customers, and orders.
   Depends on: game.js
═══════════════════════════════════════════════════════════ */

"use strict";

/* ─────────────────────────────────────────────────────────
   SECTION 1 — TOWN BUILDINGS CATALOGUE (placeholder)
   Each building will become a sub-screen or modal.
───────────────────────────────────────────────────────── */

const TOWN_BUILDINGS = [
  {
    id:          "raw_market",
    label:       "Raw Market",
    icon:        "ia-store",
    description: "Sell unprocessed minerals for coin.",
    unlockUpgrade: "market_stall",
  },
  {
    id:          "bar",
    label:       "The Smelted Mug",
    icon:        "ia-mug",
    description: "Tavern — rumours of deep minerals filter here.",
    unlockUpgrade: null,   // always visible (scaffold only)
  },
  {
    id:          "workshop",
    label:       "Workshop",
    icon:        "ia-forge",
    description: "Craftsmen buy processed bars and gems.",
    unlockUpgrade: null,
  },
  {
    id:          "guild",
    label:       "Miners Guild",
    icon:        "ia-group",
    description: "Take on contracts, earn reputation.",
    unlockUpgrade: null,
  },
];

/* ─────────────────────────────────────────────────────────
   SECTION 2 — TOP BAR
───────────────────────────────────────────────────────── */

function townRenderTopBar() {
  $("#top-middle").html(`
    <span class="page-title">The Town</span>
  `);
  $("#top-right").html(`
    <div class="stat-row">
      <span class="res-pill" title="Reputation">
        <i class="ia ia-star"></i> ${GameState.town.reputation}
      </span>
      <span class="res-pill" title="Gold">
        <i class="ia ia-coins"></i> ${formatNumber(getResource("money"))}
      </span>
    </div>
  `);
}

/* ─────────────────────────────────────────────────────────
   SECTION 3 — SCREEN RENDER
───────────────────────────────────────────────────────── */

function townRenderScreen() {
  const $content = $("#content");
  $content.html(`<div id="screen-town" class="screen-enter"></div>`);
  const $root = $("#screen-town");

  /* — Buildings grid ————————————————————————————————————— */
  $root.append(`<div class="section-title">Buildings</div>`);
  const $grid = $('<div class="town-grid"></div>');

  TOWN_BUILDINGS.forEach(building => {
    const unlocked = !building.unlockUpgrade || GameState.town.shopUnlocks.includes(building.id);

    $grid.append(`
      <div class="town-building ${unlocked ? "" : "locked"}"
           data-building-id="${building.id}"
           style="${unlocked ? "" : "opacity:.4;pointer-events:none;"}">
        <i class="ia ${building.icon}" style="${unlocked ? "color:var(--c-gold)" : ""}"></i>
        <strong style="font-size:.9rem">${building.label}</strong>
        <span>${unlocked ? building.description : "Locked"}</span>
      </div>
    `);
  });

  $root.append($grid);

  /* — Customer orders ————————————————————————————————————— */
  $root.append(`
    <div class="divider"></div>
    <div class="section-title">Customer Orders</div>
  `);

  if (GameState.town.customerOrders.length === 0) {
    $root.append(`
      <div class="scaffold-placeholder" style="min-height:90px">
        <i class="ia ia-user"></i>
        <p>No active orders. Customers will arrive later.</p>
      </div>
    `);
  } else {
    // Will render order cards once town logic is implemented
    GameState.town.customerOrders.forEach(order => {
      $root.append(`<div class="card">[Order scaffold for order ${order.id}]</div>`);
    });
  }
}

/* ─────────────────────────────────────────────────────────
   SECTION 4 — PUBLIC SCREEN INTERFACE
───────────────────────────────────────────────────────── */

const ScreenTown = {
  pageId: "town",

  mount() {
    townRenderTopBar();
    townRenderScreen();
  },

  unmount() {},
};
