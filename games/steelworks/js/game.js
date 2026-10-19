/* ═══════════════════════════════════════════════════════════
   game.js  —  Depths & Forge
   All game STATE and LOGIC lives here.
   Zero DOM access. Zero jQuery. Pure data + functions.
═══════════════════════════════════════════════════════════ */

"use strict";

/* ─────────────────────────────────────────────────────────
   SECTION 1 — CONSTANTS
   Static definitions that never change at runtime.
───────────────────────────────────────────────────────── */

/** Depth configurations: what mineral types spawn at each depth tier. */
const DEPTH_CONFIGS = [
    {
        depth: 1,
        label: "Shallow Earth",
        nodeCount: 4,
        nodeRadius: 42,       // px on a 300px arena — scaled later
        minerals: [
            { id: "stone", label: "Stone", color: "#7a7060", glowColor: "#a09080", weight: 60, hpPerNode: 3, yieldMin: 1, yieldMax: 3 },
            { id: "copper", label: "Copper", color: "#b87333", glowColor: "#e0a060", weight: 30, hpPerNode: 5, yieldMin: 1, yieldMax: 2 },
            { id: "iron", label: "Iron", color: "#6a7a8a", glowColor: "#90a0b0", weight: 10, hpPerNode: 8, yieldMin: 1, yieldMax: 2 },
        ],
    },
    {
        depth: 2,
        label: "Deep Rock",
        nodeCount: 5,
        nodeRadius: 38,
        minerals: [
            { id: "stone", label: "Stone", color: "#7a7060", glowColor: "#a09080", weight: 30, hpPerNode: 4, yieldMin: 1, yieldMax: 3 },
            { id: "iron", label: "Iron", color: "#6a7a8a", glowColor: "#90a0b0", weight: 40, hpPerNode: 10, yieldMin: 1, yieldMax: 2 },
            { id: "silver", label: "Silver", color: "#b0b8c0", glowColor: "#d0d8e0", weight: 20, hpPerNode: 12, yieldMin: 1, yieldMax: 2 },
            { id: "coal", label: "Coal", color: "#303030", glowColor: "#505050", weight: 10, hpPerNode: 6, yieldMin: 2, yieldMax: 4 },
        ],
    },
    {
        depth: 3,
        label: "The Dark Vein",
        nodeCount: 6,
        nodeRadius: 34,
        minerals: [
            { id: "iron", label: "Iron", color: "#6a7a8a", glowColor: "#90a0b0", weight: 30, hpPerNode: 12, yieldMin: 1, yieldMax: 2 },
            { id: "silver", label: "Silver", color: "#b0b8c0", glowColor: "#d0d8e0", weight: 25, hpPerNode: 14, yieldMin: 1, yieldMax: 2 },
            { id: "gold_ore", label: "Gold Ore", color: "#c9913a", glowColor: "#e8b85a", weight: 15, hpPerNode: 20, yieldMin: 1, yieldMax: 1 },
            { id: "coal", label: "Coal", color: "#303030", glowColor: "#505050", weight: 20, hpPerNode: 8, yieldMin: 2, yieldMax: 5 },
            { id: "gem", label: "Raw Gem", color: "#5090c0", glowColor: "#80c0e0", weight: 10, hpPerNode: 25, yieldMin: 1, yieldMax: 1 },
        ],
    },
];

/** Maximum depth currently in the game. */
const MAX_DEPTH = DEPTH_CONFIGS.length;

/** How many taps between new node spawns (placeholder debounce). */
const NODE_SPAWN_MARGIN = 0.06;  // minimum distance from arena edge (0-1 coords)

/** Minimum separation between nodes (0-1 coordinate space). */
const NODE_MIN_SEPARATION = 0.18;

/* ─────────────────────────────────────────────────────────
   SECTION 2 — GAME STATE
   All mutable runtime state lives in this object.
   Screens read from it; they never write directly.
───────────────────────────────────────────────────────── */

const GameState = {
    /* — Resources — */
    resources: {
        money: 0,
        stone: 0,
        copper: 0,
        iron: 0,
        silver: 0,
        gold_ore: 0,
        coal: 0,
        gem: 0,

        // Smelted / processed — populated by forge later
        copper_bar: 0,
        iron_bar: 0,
        silver_bar: 0,
        gold_bar: 0,
    },

    /* — Mine — */
    mine: {
        depth: 1,          // current depth tier (1-based, maps to DEPTH_CONFIGS index-1)
        nodes: [],         // Array<{ id, mineralId, x, y, hpMax, hpCurrent }>
    },

    /* — Upgrades — */
    purchasedUpgrades: new Set(),   // Set of upgrade IDs that have been bought

    /* — Forge — */
    forge: {
        slots: [],         // Array<{ recipeId, progress, duration }> — populated when forge is built out
        queue: [],         // Array of pending recipe jobs
    },

    /* — Town — */
    town: {
        reputation: 0,
        customerOrders: [],   // Array<{ id, wants, reward, expiresAt }>
        shopUnlocks: [],      // Array of shop IDs unlocked
    },

    /* — Meta — */
    settings: {
        soundEnabled: true,
        hapticEnabled: true,
        darkMode: true,
    },
};

/* ─────────────────────────────────────────────────────────
   SECTION 3 — HELPERS
───────────────────────────────────────────────────────── */

/** Pick a random integer in [min, max] inclusive. */
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Weighted random pick from an array of { weight, ...rest }. */
function weightedRandom(items) {
    const totalWeight = items.reduce((sum, it) => sum + it.weight, 0);
    let roll = Math.random() * totalWeight;
    for (const item of items) {
        roll -= item.weight;
        if (roll <= 0) return item;
    }
    return items[items.length - 1];
}

/** Generate a unique node ID. */
let _nodeIdCounter = 0;
function nextNodeId() { return `node_${++_nodeIdCounter}`; }

/** Return the DEPTH_CONFIG for the current mine depth. */
function currentDepthConfig() {
    return DEPTH_CONFIGS[GameState.mine.depth - 1] ?? DEPTH_CONFIGS[0];
}

/**
 * Attempt to place a node at a random position that:
 *  - is away from the arena edge by NODE_SPAWN_MARGIN
 *  - is at least NODE_MIN_SEPARATION from all existing positions
 * Returns {x, y} or null if placement failed after maxTries.
 */
function findNodePosition(existingPositions, maxTries = 60) {
    const margin = NODE_SPAWN_MARGIN;
    for (let i = 0; i < maxTries; i++) {
        const x = margin + Math.random() * (1 - margin * 2);
        const y = margin + Math.random() * (1 - margin * 2);
        const tooClose = existingPositions.some(p => {
            const dx = p.x - x, dy = p.y - y;
            return Math.sqrt(dx * dx + dy * dy) < NODE_MIN_SEPARATION;
        });
        if (!tooClose) return { x, y };
    }
    return null;
}

/* ─────────────────────────────────────────────────────────
   SECTION 4 — MINE LOGIC
───────────────────────────────────────────────────────── */

/**
 * Spawn fresh nodes for the current depth.
 * Clears any existing nodes.
 */
function mineSpawnNodes() {
    const cfg = currentDepthConfig();
    const positions = [];
    const nodes = [];

    for (let i = 0; i < cfg.nodeCount; i++) {
        const mineral = weightedRandom(cfg.minerals);
        const pos = findNodePosition(positions);
        if (!pos) {
            console.warn("[Mine] Could not place all nodes; stopping at", i);
            break;
        }
        positions.push(pos);
        nodes.push({
            id: nextNodeId(),
            mineralId: mineral.id,
            x: pos.x,
            y: pos.y,
            hpMax: mineral.hpPerNode,
            hpCurrent: mineral.hpPerNode,
        });
    }

    GameState.mine.nodes = nodes;
}

/**
 * Strike a specific node (called when player taps it).
 * Returns a result object:
 *   { nodeId, damage, destroyed, loot: [{resourceId, amount}], allCleared }
 */
function mineStrikeNode(nodeId, damage = 1) {
    const node = GameState.mine.nodes.find(n => n.id === nodeId);
    if (!node) return null;

    node.hpCurrent = Math.max(0, node.hpCurrent - damage);
    const destroyed = node.hpCurrent === 0;
    let loot = [];

    if (destroyed) {
        const cfg = currentDepthConfig();
        const mineral = cfg.minerals.find(m => m.id === node.mineralId);
        if (mineral) {
            const amount = randInt(mineral.yieldMin, mineral.yieldMax);
            loot = [{ resourceId: mineral.id, amount }];
            GameState.resources[mineral.id] = (GameState.resources[mineral.id] ?? 0) + amount;
        }
        // Remove the node
        GameState.mine.nodes = GameState.mine.nodes.filter(n => n.id !== nodeId);
    }

    const allCleared = GameState.mine.nodes.length === 0;
    if (allCleared) {
        // Immediately respawn same-depth nodes
        mineSpawnNodes();
    }

    return { nodeId, damage, destroyed, loot, allCleared };
}

/**
 * Descend to the next depth.
 * Returns true if successful, false if already at max depth.
 */
function mineDescend() {
    if (GameState.mine.depth >= MAX_DEPTH) return false;
    GameState.mine.depth++;
    mineSpawnNodes();
    return true;
}

/**
 * Ascend to the previous depth.
 * Returns true if successful, false if already at shallowest.
 */
function mineAscend() {
    if (GameState.mine.depth <= 1) return false;
    GameState.mine.depth--;
    mineSpawnNodes();
    return true;
}

/* ─────────────────────────────────────────────────────────
   SECTION 5 — UPGRADES LOGIC
───────────────────────────────────────────────────────── */

/**
 * Attempt to purchase an upgrade by its ID.
 * Returns { success: bool, reason?: string }
 */
function upgradePurchase(upgradeId) {
    // Import the UPGRADES array from screen-upgrades (loaded after this file).
    // We access it via window to avoid a circular dependency.
    const upgrade = (window.UPGRADES ?? []).find(u => u.id === upgradeId);
    if (!upgrade) return { success: false, reason: "Unknown upgrade" };
    if (GameState.purchasedUpgrades.has(upgradeId)) return { success: false, reason: "Already purchased" };

    // Check all costs
    for (const [resourceId, cost] of Object.entries(upgrade.cost)) {
        if ((GameState.resources[resourceId] ?? 0) < cost) {
            return { success: false, reason: "Not enough " + resourceId };
        }
    }

    // Deduct costs
    for (const [resourceId, cost] of Object.entries(upgrade.cost)) {
        GameState.resources[resourceId] -= cost;
    }

    // Apply effect (each upgrade defines its own effect function)
    GameState.purchasedUpgrades.add(upgradeId);
    if (typeof upgrade.onPurchase === "function") {
        upgrade.onPurchase(GameState);
    }

    return { success: true };
}

/**
 * Check whether the player can currently afford an upgrade.
 */
function upgradeCanAfford(upgradeId) {
    const upgrade = (window.UPGRADES ?? []).find(u => u.id === upgradeId);
    if (!upgrade) return false;
    for (const [resourceId, cost] of Object.entries(upgrade.cost)) {
        if ((GameState.resources[resourceId] ?? 0) < cost) return false;
    }
    return true;
}

/* ─────────────────────────────────────────────────────────
   SECTION 6 — RESOURCES LOGIC
───────────────────────────────────────────────────────── */

/** Return a formatted number string (abbreviates large numbers). */
function formatNumber(n) {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
    if (n >= 1_000) return (n / 1_000).toFixed(1) + "k";
    return String(n);
}

/** Get a resource value safely. */
function getResource(id) {
    return GameState.resources[id] ?? 0;
}

/* ─────────────────────────────────────────────────────────
   SECTION 7 — SETTINGS LOGIC
───────────────────────────────────────────────────────── */

function settingsToggle(key) {
    if (key in GameState.settings) {
        GameState.settings[key] = !GameState.settings[key];
    }
}

function settingsGet(key) {
    return GameState.settings[key];
}

/* ─────────────────────────────────────────────────────────
   SECTION 8 — SAVE / LOAD  (localStorage, thin wrapper)
───────────────────────────────────────────────────────── */

const SAVE_KEY = "depths_forge_save_v1";

function gameSave() {
    try {
        const payload = {
            resources: GameState.resources,
            mineDepth: GameState.mine.depth,
            purchasedUpgrades: [...GameState.purchasedUpgrades],
            settings: GameState.settings,
            town: GameState.town,
        };
        localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
    } catch (e) {
        console.warn("[Save] Failed:", e);
    }
}

function gameLoad() {
    try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return false;
        const data = JSON.parse(raw);
        Object.assign(GameState.resources, data.resources ?? {});
        GameState.mine.depth = data.mineDepth ?? 1;
        GameState.purchasedUpgrades = new Set(data.purchasedUpgrades ?? []);
        Object.assign(GameState.settings, data.settings ?? {});
        Object.assign(GameState.town, data.town ?? {});
        return true;
    } catch (e) {
        console.warn("[Load] Failed:", e);
        return false;
    }
}

function gameReset() {
    localStorage.removeItem(SAVE_KEY);
    location.reload();
}

/* ─────────────────────────────────────────────────────────
   SECTION 9 — INITIALISE
───────────────────────────────────────────────────────── */

function gameInit() {
    const loaded = gameLoad();
    if (!loaded) {
        // Fresh start
        GameState.resources.money = 0;
    }
    mineSpawnNodes();
}
