
const CONSTANTS = {
    CANVAS_SIZE: 720,            // main canvas internal resolution (square)
    CHECK_SIZE: 200,             // downsampled connection-check canvas
    FADE_ZONE_ERASE_ALPHA: 0.012,// alpha removed per frame inside a fade zone
    CONNECTION_MIN_ALPHA: 80,    // below this alpha a pixel is "not painted"
    COLOR_MATCH_THRESHOLD: 95,   // RGB distance under which a pixel matches a colour
    OBJECTIVE_REACH_DOTS: 2,     // objective reach radius = this × on-screen dot size (diameter)
    GRID_SIZE: 40,               // square-grid spacing (px)
    DOT_RADIUS: 9,               // dot marker radius (canvas px)
    EDGE_MARGIN: 70,             // keep dots away from canvas edges
    AXIS_GAP: 46,                // keep dots off the symmetry axis
    MIN_PAIR_DIST: 130,          // shortest A->B straight-line distance
    MAX_PAIR_DIST: 440,          // longest A->B straight-line distance (pairs often straddle the axis)
    MIN_DOT_SEPARATION: 58,      // minimum distance between unrelated dots
    INK_BUDGET_MULT: 2.5,        // budget = sum(pair distances) * this * pen modifier
    BASE_XP: 30,
    EFFICIENCY_XP: 120,
    GALLERY_CAP: 200,
    RECHECK_INTERVAL_MS: 220,    // throttle for fade-zone re-checks
    PLACEMENT_TRIES: 200,        // rejection-sampling attempts per dot
};

/** Progression. index = level; unlocks names a mechanical capability (or null). */
const LEVELS = [
    { xpRequired: 0, unlocks: null },
    { xpRequired: 100, unlocks: "symmetry_horizontal" },
    { xpRequired: 250, unlocks: "color_2" },
    { xpRequired: 450, unlocks: "pen_thick" },
    { xpRequired: 700, unlocks: "dot_count_5" },
    { xpRequired: 1000, unlocks: "grid_square" },
    { xpRequired: 1400, unlocks: "symmetry_4way" },
    { xpRequired: 1900, unlocks: "color_3" },
    { xpRequired: 2500, unlocks: "zone_fade" },
    { xpRequired: 3200, unlocks: "pen_thin" },
    { xpRequired: 4000, unlocks: "symmetry_3fold" },
    { xpRequired: 4900, unlocks: "grid_hex" },
    { xpRequired: 6000, unlocks: "zone_inkdrain" },
    { xpRequired: 7200, unlocks: "pen_tapered" },
    { xpRequired: 8500, unlocks: "symmetry_6fold" },
    { xpRequired: 10000, unlocks: "dot_count_8" },
    { xpRequired: 12000, unlocks: "zone_thin" },
    { xpRequired: 14000, unlocks: "grid_triangular" },
    { xpRequired: 16500, unlocks: "symmetry_radial" },
    { xpRequired: 19000, unlocks: "pen_rectangular" },
    { xpRequired: 22000, unlocks: "grid_radial" },
    { xpRequired: 25000, unlocks: "zone_glide" },
    { xpRequired: 32000, unlocks: "zone_thick" },
];

/** symmetry key -> definition. `unlock` null means available from level 0. */
const SYMMETRY_TYPES = {
    vertical:    /**/ { label: "Vertical Mirror", baseWeight: 1, unlock: null },
    horizontal:  /**/ { label: "Horizontal Mirror", baseWeight: 1, unlock: "symmetry_horizontal" },
    "4way":      /**/ { label: "4-Way", baseWeight: 6, unlock: "symmetry_4way" },
    "3fold":     /**/ { label: "3-Fold Rotation", baseWeight: 8, unlock: "symmetry_3fold" },
    "6fold":     /**/ { label: "6-Fold Rotation", baseWeight: 10, unlock: "symmetry_6fold" },
    radial:      /**/ { label: "Radial", baseWeight: 10, unlock: "symmetry_radial" },
};

const PEN_TYPES = {
    normal:      /**/ { label: "Normal", inkModifier: 1.0, sizeBase: 14, baseWeight: 10, unlock: null },
    thick:       /**/ { label: "Thick", inkModifier: 1.5, sizeBase: 22, baseWeight: 5, unlock: "pen_thick" },
    thin:        /**/ { label: "Thin", inkModifier: 0.5, sizeBase: 8, baseWeight: 5, unlock: "pen_thin" },
    tapered:     /**/ { label: "Tapered", inkModifier: 1.2, sizeBase: 14, baseWeight: 4, unlock: "pen_tapered" },
    rectangular: /**/ { label: "Rectangular", inkModifier: 1.3, sizeBase: 14, baseWeight: 4, unlock: "pen_rectangular" },
};

const GRID_TYPES = {
    none:        /**/ { label: "Free", baseWeight: 1, unlock: null },
    square:      /**/ { label: "Square", baseWeight: 1, unlock: "grid_square" },
    hex:         /**/ { label: "Hex", baseWeight: 1, unlock: "grid_hex" },
    triangular:  /**/ { label: "Triangular", baseWeight: 1, unlock: "grid_triangular" },
    radial:      /**/ { label: "Radial", baseWeight: 1, unlock: "grid_radial" },
};

const ZONE_TYPES = {
    fade: { label: "Fade", color: "#ff5a5f", unlock: "zone_fade" },
    inkdrain: { label: "Ink Drain", color: "#ffd23f", unlock: "zone_inkdrain" },
    thin: { label: "Thin", color: "#3a86ff", unlock: "zone_thin" },
    thick: { label: "Thick", color: "#8338ec", unlock: "zone_thick" },
    glide: { label: "Glide", color: "#06d6a0", unlock: "zone_glide" },
};

/** Base dot colours (perceptually distinct hues). */
const BASE_COLORS = ["#ff5a5f", "#3a86ff", "#ffd23f", "#8338ec", "#06d6a0", "#fb8500"];

/* ---- Vanity (cosmetic). Each item carries its own unlockLevel. ---- */
const BACKGROUNDS = {
    dark:   /**/ { label: "Dark", color: "#11131a", unlockLevel: 0 },
    slate:  /**/ { label: "Slate", color: "#1d2630", unlockLevel: 0 },
    indigo: /**/ { label: "Indigo", color: "#1a1430", unlockLevel: 3 },
    forest: /**/ { label: "Forest", color: "#0f1f17", unlockLevel: 8 },
    paper:  /**/ { label: "Paper", color: "#efe7d6", unlockLevel: 14 },
};

const TEXTURES = {
    none:   /**/ { label: "None", css: "none", unlockLevel: 0 },
    dots:   /**/ { label: "Dots", css: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)", size: "16px 16px", unlockLevel: 5 },
    grid:   /**/ { label: "Grid", css: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)", size: "24px 24px", unlockLevel: 11 },
    weave:  /**/ { label: "Weave", css: "repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0 6px, transparent 6px 12px)", size: "auto", unlockLevel: 17 },
};

const PALETTES = {
    default:     /**/ { label: "True Colour", tint: null, mix: 0, satMul: 1.0, lightMul: 1.0, unlockLevel: 0 },
    gold:        /**/ { label: "Gold", tint: "#ffcf5a", mix: 0.28, satMul: 1.05, lightMul: 1.02, unlockLevel: 4 },
    watercolor:  /**/ { label: "Watercolour", tint: "#ffffff", mix: 0.12, satMul: 0.6, lightMul: 1.12, unlockLevel: 9 },
    neon:        /**/ { label: "Neon", tint: null, mix: 0, satMul: 1.6, lightMul: 1.06, unlockLevel: 13 },
};

const PEN_VISUALS = {
    ballpoint:   /**/ { label: "Ballpoint", cursor: "rgba(255,255,255,0.9)", unlockLevel: 0 },
    quill:       /**/ { label: "Quill", cursor: "#ffd23f", unlockLevel: 7 },
    marker:      /**/ { label: "Marker", cursor: "#06d6a0", unlockLevel: 16 },
};

const ANIMATIONS = {
    none:        /**/ { label: "None", cls: null, unlockLevel: 0 },
    burst:       /**/ { label: "Burst", cls: "anim-burst", unlockLevel: 6 },
    ripple:      /**/ { label: "Ripple", cls: "anim-ripple", unlockLevel: 12 },
};