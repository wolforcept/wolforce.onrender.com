/* ═══════════════════════════════════════════════════════════
   screen-upgrades.js  —  Upgrades screen
   Depends on: game.js (GameState, upgradePurchase, upgradeCanAfford, formatNumber)
═══════════════════════════════════════════════════════════ */

"use strict";

/* ─────────────────────────────────────────────────────────
   SECTION 1 — UPGRADES CATALOGUE
   Define every purchasable upgrade here.
   Screens never modify GameState directly — all effects
   go through the onPurchase callback, which receives the
   live GameState object.
───────────────────────────────────────────────────────── */

/** @type {Array<UpgradeDef>}
 *  UpgradeDef = {
 *    id:          string    — unique key
 *    label:       string    — display name
 *    description: string    — flavour + effect text
 *    icon:        string    — ia icon class name
 *    cost:        Object<resourceId, number>
 *    requires:    string[]  — upgrade IDs that must be purchased first
 *    onPurchase:  (state) => void
 *  }
 */
const UPGRADES = [

    /* ── Mining ────────────────────────────────────────────── */
    {
        id: "better_pick",
        label: "Reinforced Pickaxe",
        description: "Deals 2 damage per strike instead of 1.",
        icon: "ia-pickaxe",
        cost: { stone: 10, money: 0 },
        requires: [],
        onPurchase(state) {
            // Tracked by screens/logic via hasPurchased check
        },
    },
    {
        id: "deep_reach",
        label: "Deep Reach",
        description: "Unlocks descent to Depth 2.",
        icon: "ia-chevron-down",
        cost: { stone: 20, iron: 5 },
        requires: [],
        onPurchase(state) {
            // Depth unlock is read from purchasedUpgrades in mineCanDescend
        },
    },
    {
        id: "veteran_miner",
        label: "Veteran Miner",
        description: "Each node yields +1 extra mineral.",
        icon: "ia-hat",
        cost: { iron: 10, money: 50 },
        requires: ["better_pick"],
        onPurchase(state) { /* yield bonus read in mineStrikeNode via hasPurchased */ },
    },
    {
        id: "deep_reach_2",
        label: "Deeper Reach",
        description: "Unlocks descent to Depth 3.",
        icon: "ia-chevron-down",
        cost: { iron: 30, silver: 5, money: 100 },
        requires: ["deep_reach"],
        onPurchase(state) { },
    },

    /* ── Economy ───────────────────────────────────────────── */
    {
        id: "market_stall",
        label: "Market Stall",
        description: "Allows selling raw minerals at the Town.",
        icon: "ia-store",
        cost: { stone: 30, money: 20 },
        requires: [],
        onPurchase(state) {
            state.town.shopUnlocks.push("raw_market");
        },
    },
    {
        id: "haggling",
        label: "Haggling",
        description: "Sell prices for raw minerals increased by 25%.",
        icon: "ia-coins",
        cost: { money: 150 },
        requires: ["market_stall"],
        onPurchase(state) { },
    },

    /* ── Forge ─────────────────────────────────────────────── */
    {
        id: "forge_unlock",
        label: "Build the Forge",
        description: "Unlocks The Forge — smelt ore into bars.",
        icon: "ia-fire",
        cost: { stone: 50, iron: 10, money: 100 },
        requires: [],
        onPurchase(state) {
            state.forge.slots.push({ recipeId: null, progress: 0, duration: 0 });
        },
    },
    {
        id: "forge_slot_2",
        label: "Second Forge Slot",
        description: "Run two smelting jobs simultaneously.",
        icon: "ia-fire",
        cost: { iron: 25, money: 250 },
        requires: ["forge_unlock"],
        onPurchase(state) {
            state.forge.slots.push({ recipeId: null, progress: 0, duration: 0 });
        },
    },
];

/* Expose globally so game.js can reference UPGRADES for logic checks */
window.UPGRADES = UPGRADES;

/* Convenience helper — check if an upgrade has been purchased */
function hasPurchased(id) {
    return GameState.purchasedUpgrades.has(id);
}

/* ─────────────────────────────────────────────────────────
   SECTION 2 — TOP BAR CONTENT
───────────────────────────────────────────────────────── */

function upgradesRenderTopBar() {
    $("#top-middle").html(`
    <span class="page-title">Upgrades</span>
  `);
    $("#top-right").html(`
    <div class="stat-row">
      <span class="res-pill">
        <i class="ia ia-coins"></i>
        <span id="top-money">${formatNumber(getResource("money"))}</span>
      </span>
    </div>
  `);
}

/* ─────────────────────────────────────────────────────────
   SECTION 3 — SCREEN RENDER
───────────────────────────────────────────────────────── */

function upgradesRenderScreen() {
    const $screen = $("#content");
    $screen.html('<div id="screen-upgrades" class="screen-enter"></div>');
    const $root = $("#screen-upgrades");

    // Resource summary bar
    const resourcePills = [
        { id: "money", icon: "ia-coins", label: "Gold" },
        { id: "stone", icon: "ia-mountain" },
        { id: "copper", icon: "ia-circle" },
        { id: "iron", icon: "ia-circle" },
    ].map(r => {
        const val = getResource(r.id);
        return `<span class="res-pill"><i class="ia ${r.icon}"></i>${formatNumber(val)}</span>`;
    }).join("");

    $root.append(`<div class="resources-bar">${resourcePills}</div>`);

    // Section heading
    $root.append(`<div class="section-title">Available Upgrades</div>`);

    // Upgrade list
    const $list = $('<div class="upgrade-list"></div>');

    UPGRADES.forEach(upgrade => {
        const purchased = hasPurchased(upgrade.id);
        const prereqsMet = upgrade.requires.every(r => hasPurchased(r));
        const affordable = upgradeCanAfford(upgrade.id);

        if (!prereqsMet) return;  // hide locked upgrades

        let stateClass = "";
        if (purchased) stateClass = "purchased";
        else if (!affordable) stateClass = "unaffordable";

        const costHtml = Object.entries(upgrade.cost)
            .filter(([, v]) => v > 0)
            .map(([res, val]) => `<span><i class="ia ia-coins"></i>${formatNumber(val)} ${res}</span>`)
            .join(" &nbsp;");

        const btnLabel = purchased
            ? `<i class="ia ia-check"></i> Owned`
            : `<i class="ia ia-shop"></i> Buy`;

        $list.append(`
      <div class="upgrade-card ${stateClass}" data-upgrade-id="${upgrade.id}">
        <div class="upgrade-name"><i class="ia ${upgrade.icon}"></i> &nbsp;${upgrade.label}</div>
        <div class="upgrade-desc">${upgrade.description}</div>
        <div class="upgrade-cost upgrade-buy-btn">
          <div class="upgrade-cost">${costHtml}</div>
          <button class="btn-primary btn-buy-upgrade"
                  data-upgrade-id="${upgrade.id}"
                  ${purchased ? "disabled" : ""}
                  style="margin-top:6px">
            ${btnLabel}
          </button>
        </div>
      </div>
    `);
    });

    $root.append($list);

    // Bind purchase buttons
    $root.on("click", ".btn-buy-upgrade", function () {
        const id = $(this).data("upgrade-id");
        const result = upgradePurchase(id);
        if (result.success) {
            upgradesRenderScreen();      // re-render to reflect new state
            upgradesRenderTopBar();
        } else {
            // Brief shake animation on the card
            $(this).closest(".upgrade-card").css("animation", "none");
            setTimeout(() => $(this).closest(".upgrade-card").css("animation", ""), 10);
        }
    });
}

/* ─────────────────────────────────────────────────────────
   SECTION 4 — PUBLIC SCREEN INTERFACE
   Each screen exports a single object consumed by app.js
───────────────────────────────────────────────────────── */

const ScreenUpgrades = {
    pageId: "upgrades",

    mount() {
        upgradesRenderTopBar();
        upgradesRenderScreen();
    },

    unmount() {
        // Nothing to clean up for this screen
    },
};
