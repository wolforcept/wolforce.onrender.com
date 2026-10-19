/* ═══════════════════════════════════════════════════════════
   screen-mine.js  —  The Mine screen
   Depends on: game.js (GameState, mineStrikeNode, mineDescend,
               mineAscend, currentDepthConfig, formatNumber)
═══════════════════════════════════════════════════════════ */

"use strict";

/* ─────────────────────────────────────────────────────────
   SECTION 1 — MINERAL VISUAL CONFIG
   Maps mineralId → rendering properties.
───────────────────────────────────────────────────────── */

// disable formatter
const MINERAL_VISUALS = {
  stone:    { icon: "ia-rock",       color: "#7a7060", glow: "#a09080", size: 52 },
  copper:   { icon: "ia-rock",       color: "#b87333", glow: "#e09050", size: 50 },
  iron:     { icon: "ia-ingot",      color: "#6a7a8a", glow: "#90a0b0", size: 50 },
  silver:   { icon: "ia-ingot",      color: "#b0b8c0", glow: "#d8e0e8", size: 48 },
  gold_ore: { icon: "ia-ingot",      color: "#c9913a", glow: "#e8c060", size: 50 },
  coal:     { icon: "ia-rock",       color: "#303030", glow: "#505050", size: 46 },
  gem:      { icon: "ia-diamond",    color: "#5090c0", glow: "#80c0e8", size: 46 },
};

/** Fallback visuals for unknown minerals */
const MINERAL_VISUAL_DEFAULT = { icon: "ia-rock", color: "#7a7060", glow: "#a09080", size: 48 };

/* ─────────────────────────────────────────────────────────
   SECTION 2 — LOCAL STATE
   Only UI-level state (no game data mutations here).
───────────────────────────────────────────────────────── */

const _mine = {
  arenaSize: 300,        // resolved px size of the square arena
  activeHits: new Set(), // nodeIds currently animating a hit
};

/* ─────────────────────────────────────────────────────────
   SECTION 3 — TOP BAR
───────────────────────────────────────────────────────── */

function mineRenderTopBar() {
  const depth = GameState.mine.depth;
  const cfg   = currentDepthConfig();

  $("#top-middle").html(`
    <span class="page-title">${cfg.label}</span>
  `);

  const canDescend = depth < MAX_DEPTH && hasPurchased(`deep_reach${depth === 1 ? "" : "_" + depth}`);
  const canAscend  = depth > 1;

  $("#top-right").html(`
    <div class="stat-row">
      <button class="btn-secondary btn-sm" id="btn-mine-ascend"  ${canAscend  ? "" : "disabled"} title="Ascend">
        <i class="ia ia-chevron-up"></i>
      </button>
      <span class="mine-depth-label">D${depth}</span>
      <button class="btn-secondary btn-sm" id="btn-mine-descend" ${canDescend ? "" : "disabled"} title="Descend">
        <i class="ia ia-chevron-down"></i>
      </button>
    </div>
  `);

  // Bind depth buttons (re-bound on each topbar render)
  $("#btn-mine-ascend").on("click", () => {
    if (mineAscend()) mineRenderFull();
  });
  $("#btn-mine-descend").on("click", () => {
    if (mineDescend()) mineRenderFull();
  });
}

/* ─────────────────────────────────────────────────────────
   SECTION 4 — ARENA SIZING
   The arena must always be a square. We compute its side
   from whichever is smaller: content width or content height.
───────────────────────────────────────────────────────── */

function mineComputeArenaSize() {
  const $content = $("#content");
  const availW = $content.innerWidth()  - 24;   // 12px padding each side
  const availH = $content.innerHeight() - 80;   // leave room for controls
  _mine.arenaSize = Math.floor(Math.min(availW, availH));
}

/* ─────────────────────────────────────────────────────────
   SECTION 5 — NODE RENDERING
───────────────────────────────────────────────────────── */

/** Build the HTML for a single node element. */
function mineNodeHtml(node) {
  const vis      = MINERAL_VISUALS[node.mineralId] ?? MINERAL_VISUAL_DEFAULT;
  const size     = vis.size;
  const pct      = (node.hpCurrent / node.hpMax) * 100;
  const left     = (node.x * _mine.arenaSize).toFixed(1);
  const top      = (node.y * _mine.arenaSize).toFixed(1);

  return `
    <div class="mine-node"
         data-node-id="${node.id}"
         style="
           left: ${left}px;
           top:  ${top}px;
           width:  ${size}px;
           height: ${size}px;
           font-size: ${(size * 0.52).toFixed(0)}px;
           color: ${vis.color};
           text-shadow: 0 0 14px ${vis.glow};
           filter: drop-shadow(0 0 6px ${vis.glow}60);
         ">
      <i class="ia ${vis.icon}"></i>
      <div class="mine-node-hp">
        <div class="mine-node-hp-fill" style="width:${pct}%"></div>
      </div>
    </div>
  `;
}

/** Render all nodes into the arena. */
function mineRenderNodes() {
  const $arena = $("#mine-arena");
  $arena.empty();
  GameState.mine.nodes.forEach(node => {
    $arena.append(mineNodeHtml(node));
  });
}

/* ─────────────────────────────────────────────────────────
   SECTION 6 — HIT HANDLING
───────────────────────────────────────────────────────── */

function mineOnNodeHit(nodeId) {
  const damage = hasPurchased("better_pick") ? 2 : 1;
  const result = mineStrikeNode(nodeId, damage);
  if (!result) return;

  if (result.destroyed) {
    // Remove the node element immediately
    $(`[data-node-id="${nodeId}"]`).remove();

    if (result.allCleared) {
      // Re-render all new nodes after a brief pause
      setTimeout(() => mineRenderNodes(), 200);
    }

    // Show loot popup
    result.loot.forEach(({ resourceId, amount }) => {
      _mineShowLootPop(resourceId, amount, nodeId);
    });

  } else {
    // Animate a hit on the surviving node
    const $node = $(`[data-node-id="${nodeId}"]`);
    $node.addClass("hit");
    setTimeout(() => $node.removeClass("hit"), 300);

    // Update HP bar
    const node = GameState.mine.nodes.find(n => n.id === nodeId);
    if (node) {
      const pct = (node.hpCurrent / node.hpMax) * 100;
      $node.find(".mine-node-hp-fill").css("width", pct + "%");
    }
  }
}

/** Show a floating loot text over the arena. */
function _mineShowLootPop(resourceId, amount, nodeId) {
  const $arena  = $("#mine-arena");
  const node    = GameState.mine.nodes.find(n => n.id === nodeId) ??
                  { x: 0.5, y: 0.5 };   // fallback centre if node is gone

  const $pop = $(`
    <div style="
      position:absolute;
      left: ${(node.x * _mine.arenaSize).toFixed(0)}px;
      top:  ${(node.y * _mine.arenaSize - 30).toFixed(0)}px;
      transform: translateX(-50%);
      font-family: var(--font-display);
      font-size: .65rem;
      color: var(--c-gold);
      pointer-events: none;
      white-space: nowrap;
      animation: loot-float .9s ease-out forwards;
      z-index: 10;
    ">+${amount} ${resourceId}</div>
  `);

  $arena.append($pop);
  setTimeout(() => $pop.remove(), 950);
}

/* ─────────────────────────────────────────────────────────
   SECTION 7 — FULL SCREEN RENDER
───────────────────────────────────────────────────────── */

function mineRenderFull() {
  mineComputeArenaSize();
  mineRenderTopBar();

  const $content = $("#content");
  $content.html(`<div id="screen-mine" class="screen-enter"></div>`);
  const $screen = $("#screen-mine");

  $screen.append(`
    <div class="mine-arena-wrapper"
         style="
           width: ${_mine.arenaSize}px;
           height: ${_mine.arenaSize}px;
           padding-bottom: 0;
           position: relative;
         ">
      <div class="mine-arena" id="mine-arena"
           style="position:relative; width:100%; height:100%;">
      </div>
    </div>
  `);

  mineRenderNodes();
  _mineBindNodeEvents();
}

/** Delegate pointer/touch events on the arena to node hit handler. */
function _mineBindNodeEvents() {
  const $arena = $("#mine-arena");

  $arena.on("pointerdown", ".mine-node", function (e) {
    e.preventDefault();
    const nodeId = $(this).data("node-id");
    mineOnNodeHit(nodeId);
  });
}

/* ─────────────────────────────────────────────────────────
   SECTION 8 — LOOT FLOAT KEYFRAME (injected once)
───────────────────────────────────────────────────────── */

(function injectMineKeyframes() {
  if (document.getElementById("mine-keyframes")) return;
  const style = document.createElement("style");
  style.id = "mine-keyframes";
  style.textContent = `
    @keyframes loot-float {
      0%   { opacity: 1; transform: translateX(-50%) translateY(0); }
      100% { opacity: 0; transform: translateX(-50%) translateY(-40px); }
    }
  `;
  document.head.appendChild(style);
})();

/* ─────────────────────────────────────────────────────────
   SECTION 9 — PUBLIC SCREEN INTERFACE
───────────────────────────────────────────────────────── */

const ScreenMine = {
  pageId: "mine",

  mount() {
    mineRenderFull();
  },

  unmount() {
    $("#mine-arena").off();
  },
};
