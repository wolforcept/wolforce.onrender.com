// config/assets.js
// Asset manifest (all GLB paths, scale constants, grid footprints, shadow flags)
// and model position offset tuning constants.
// Loaded as a plain <script> before the module script.
// posOffset / rotOffset are plain {x,y,z} objects — no THREE dependency.
// See index.html for the reference comment documenting each field.

const MODEL_SCALE_GUN = 1;   // all blasters
const MODEL_SCALE_FLOOR = 4;    // floor tiles
const MODEL_SCALE_WALL = 1.0;    // wall segments
const MODEL_SCALE_PIPE = 1.0;    // pipe/column props
const MODEL_SCALE_ENV = 1.0;    // all other environment props
const MODEL_SCALE_ACCESSORY = 1.0;    // gun accessories (scopes, clips, etc.)

// Default size of a floor tile in world units (width = depth).
const MODEL_FLOOR_TILE_SIZE = 1.0;

// ── Grid system constants ─────────────────────────────────────
// GRID_UNIT   = world metres per 1 grid cell. Tune once — all
//               level coordinates and collision scale with it.
// WALL_HEIGHT = world metres tall per wall segment.
const GRID_UNIT = 4;   // 1 grid unit = 4 world metres
const WALL_HEIGHT = GRID_UNIT;   // 4 grid units tall = 16 world metres

// ── Per-model position offsets ────────────────────────────────
// Correct pivot-point mismatches between the GLB origin and where
// the game expects the object to sit. Values are in world units,
// added on top of the computed spawn position.
const MODEL_POS_OFFSET_FLOOR = { x: 0, y: -1, z: 0 };
const MODEL_POS_OFFSET_WALL = { x: 0, y: 0, z: 0 };
const MODEL_POS_OFFSET_PIPE = { x: 0, y: 0, z: 0 };

// ── Debug hitbox overlay ──────────────────────────────────────
// Toggle with F3. Renders white wireframe shapes over every
// collision volume so you can tune model offsets/scales.
let DEBUG_HITBOXES = false;

const ASSET_MANIFEST = {

    gun: {
        path: 'assets/guns/blaster-a.glb',
        scale: MODEL_SCALE_GUN,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: false },
    },

    //#region Blasters
    blasterA: {
        path: 'assets/guns/blaster-a.glb',
        scale: MODEL_SCALE_GUN,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: false },
    },
    blasterB: {
        path: 'assets/guns/blaster-b.glb',
        scale: MODEL_SCALE_GUN,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: false },
    },
    blasterC: {
        path: 'assets/guns/blaster-c.glb',
        scale: MODEL_SCALE_GUN,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: false },
    },
    blasterD: {
        path: 'assets/guns/blaster-d.glb',
        scale: MODEL_SCALE_GUN,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: false },
    },
    blasterE: {
        path: 'assets/guns/blaster-e.glb',
        scale: MODEL_SCALE_GUN,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: false },
    },
    blasterF: {
        path: 'assets/guns/blaster-f.glb',
        scale: MODEL_SCALE_GUN,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: false },
    },
    blasterG: {
        path: 'assets/guns/blaster-g.glb',
        scale: MODEL_SCALE_GUN,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: false },
    },
    blasterH: {
        path: 'assets/guns/blaster-h.glb',
        scale: MODEL_SCALE_GUN,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: false },
    },
    blasterI: {
        path: 'assets/guns/blaster-i.glb',
        scale: MODEL_SCALE_GUN,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: false },
    },
    blasterJ: {
        path: 'assets/guns/blaster-j.glb',
        scale: MODEL_SCALE_GUN,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: false },
    },
    blasterK: {
        path: 'assets/guns/blaster-k.glb',
        scale: MODEL_SCALE_GUN,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: false },
    },
    blasterL: {
        path: 'assets/guns/blaster-l.glb',
        scale: MODEL_SCALE_GUN,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: false },
    },
    blasterM: {
        path: 'assets/guns/blaster-m.glb',
        scale: MODEL_SCALE_GUN,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: false },
    },
    blasterN: {
        path: 'assets/guns/blaster-n.glb',
        scale: MODEL_SCALE_GUN,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: false },
    },
    blasterO: {
        path: 'assets/guns/blaster-o.glb',
        scale: MODEL_SCALE_GUN,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: false },
    },
    blasterP: {
        path: 'assets/guns/blaster-p.glb',
        scale: MODEL_SCALE_GUN,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: false },
    },
    blasterQ: {
        path: 'assets/guns/blaster-q.glb',
        scale: MODEL_SCALE_GUN,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: false },
    },
    blasterR: {
        path: 'assets/guns/blaster-r.glb',
        scale: MODEL_SCALE_GUN,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: false },
    },
    //#endregion

    //#region Gun accessories
    bulletFoamThick: {
        path: 'assets/guns/bullet-foam-thick.glb',
        scale: MODEL_SCALE_ACCESSORY,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: false },
    },
    bulletFoamTipThick: {
        path: 'assets/guns/bullet-foam-tip-thick.glb',
        scale: MODEL_SCALE_ACCESSORY,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: false },
    },
    bulletFoamTip: {
        path: 'assets/guns/bullet-foam-tip.glb',
        scale: MODEL_SCALE_ACCESSORY,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: false },
    },
    bulletFoam: {
        path: 'assets/guns/bullet-foam.glb',
        scale: MODEL_SCALE_ACCESSORY,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: false },
    },
    clipLarge: {
        path: 'assets/guns/clip-large.glb',
        scale: MODEL_SCALE_ACCESSORY,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: false },
    },
    clipSmall: {
        path: 'assets/guns/clip-small.glb',
        scale: MODEL_SCALE_ACCESSORY,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: false },
    },
    grenadeA: {
        path: 'assets/guns/grenade-a.glb',
        scale: MODEL_SCALE_ACCESSORY,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: false },
    },
    grenadeB: {
        path: 'assets/guns/grenade-b.glb',
        scale: MODEL_SCALE_ACCESSORY,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: false },
    },
    scopeLargeA: {
        path: 'assets/guns/scope-large-a.glb',
        scale: MODEL_SCALE_ACCESSORY,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: false },
    },
    scopeLargeB: {
        path: 'assets/guns/scope-large-b.glb',
        scale: MODEL_SCALE_ACCESSORY,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: false },
    },
    scopeSmall: {
        path: 'assets/guns/scope-small.glb',
        scale: MODEL_SCALE_ACCESSORY,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: false },
    },
    silencerLarger: {
        path: 'assets/guns/silencer-larger.glb',
        scale: MODEL_SCALE_ACCESSORY,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: false },
    },
    silencerSmall: {
        path: 'assets/guns/silencer-small.glb',
        scale: MODEL_SCALE_ACCESSORY,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: false },
    },
    smoke: {
        path: 'assets/guns/smoke.glb',
        scale: MODEL_SCALE_ACCESSORY,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: false },
    },
    targetDetail: {
        path: 'assets/guns/target-detail.glb',
        scale: MODEL_SCALE_ACCESSORY,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: false },
    },
    targetFragmentLarge: {
        path: 'assets/guns/target-fragment-large.glb',
        scale: MODEL_SCALE_ACCESSORY,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: false },
    },
    targetFragmentSmall: {
        path: 'assets/guns/target-fragment-small.glb',
        scale: MODEL_SCALE_ACCESSORY,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: false },
    },
    targetLarge: {
        path: 'assets/guns/target-large.glb',
        scale: MODEL_SCALE_ACCESSORY,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: false },
    },
    targetSmall: {
        path: 'assets/guns/target-small.glb',
        scale: MODEL_SCALE_ACCESSORY,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: false },
    },
    //#endregion

    //#region Crates
    crateMedium: {
        path: 'assets/guns/crate-medium.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    crateSmall: {
        path: 'assets/guns/crate-small.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    crateWide: {
        path: 'assets/guns/crate-wide.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    //#endregion

    //#region Environment: core level pieces
    floor: {
        path: 'assets/environment/floor.glb',
        scale: MODEL_SCALE_FLOOR,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: true },
        gridW: 1, gridD: 1,   // one floor tile = 1×1 grid cells
    },
    wall: {
        path: 'assets/environment/wall.glb',
        scale: MODEL_SCALE_WALL,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
        gridW: 4, gridD: 1,   // 4 units wide, 1 unit thick
    },
    pipe: {
        path: 'assets/environment/pipe.glb',
        scale: MODEL_SCALE_PIPE,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
        gridW: 1, gridD: 1,
    },
    //#endregion

    //#region Grid wall variants
    wallCorner: {
        path: 'assets/environment/wall-corner.glb',
        scale: MODEL_SCALE_WALL,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
        gridW: 1, gridD: 1,
    },
    wallCornerRound: {
        path: 'assets/environment/wall-corner-round.glb',
        scale: MODEL_SCALE_WALL,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
        gridW: 1, gridD: 1,
    },
    wallPillar: {
        path: 'assets/environment/wall-pillar.glb',
        scale: MODEL_SCALE_WALL,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
        gridW: 1, gridD: 1,
    },
    wallDoor: {
        path: 'assets/environment/wall-door.glb',
        scale: MODEL_SCALE_WALL,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
        gridW: 4, gridD: 1,
    },
    wallDoorWide: {
        path: 'assets/environment/wall-door-wide.glb',
        scale: MODEL_SCALE_WALL,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
        gridW: 4, gridD: 1,
    },
    wallWindow: {
        path: 'assets/environment/wall-window.glb',
        scale: MODEL_SCALE_WALL,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
        gridW: 4, gridD: 1,
    },
    wallWindowFrame: {
        path: 'assets/environment/wall-window-frame.glb',
        scale: MODEL_SCALE_WALL,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
        gridW: 4, gridD: 1,
    },

    //#endregion

    //#region Environment: props & structural pieces

    //#region door
    doorDoubleClosed: {
        path: 'assets/environment/door-double-closed.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    doorDoubleHalf: {
        path: 'assets/environment/door-double-half.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    doorDouble: {
        path: 'assets/environment/door-double.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    doorSingleClosed: {
        path: 'assets/environment/door-single-closed.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    doorSingleHalf: {
        path: 'assets/environment/door-single-half.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    doorSingle: {
        path: 'assets/environment/door-single.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    //#endregion

    //#region floors
    floorCorner: {
        path: 'assets/environment/floor-corner.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: true },
    },
    floorDetail: {
        path: 'assets/environment/floor-detail.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: true },
    },
    floorPanelCorner: {
        path: 'assets/environment/floor-panel-corner.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: true },
    },
    floorPanelEnd: {
        path: 'assets/environment/floor-panel-end.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: true },
    },
    floorPanelStraight: {
        path: 'assets/environment/floor-panel-straight.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: true },
    },
    floorPanel: {
        path: 'assets/environment/floor-panel.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: false, receive: true },
    },
    //#endregion

    //#region walls
    wallBanner: {
        path: 'assets/environment/wall-banner.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    wallCornerBanner: {
        path: 'assets/environment/wall-corner-banner.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    wallCornerRoundBanner: {
        path: 'assets/environment/wall-corner-round-banner.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    wallCornerRound: {
        path: 'assets/environment/wall-corner-round.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    wallCorner: {
        path: 'assets/environment/wall-corner.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    wallDetail: {
        path: 'assets/environment/wall-detail.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    wallDoorBanner: {
        path: 'assets/environment/wall-door-banner.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    wallDoorCenter: {
        path: 'assets/environment/wall-door-center.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    wallDoorEdgeBanner: {
        path: 'assets/environment/wall-door-edge-banner.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    wallDoorEdge: {
        path: 'assets/environment/wall-door-edge.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    wallDoorWideBanner: {
        path: 'assets/environment/wall-door-wide-banner.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    wallDoorWide: {
        path: 'assets/environment/wall-door-wide.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    wallDoor: {
        path: 'assets/environment/wall-door.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    wallPillarBanner: {
        path: 'assets/environment/wall-pillar-banner.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    wallPillar: {
        path: 'assets/environment/wall-pillar.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    wallSwitch: {
        path: 'assets/environment/wall-switch.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    wallWindowBanner: {
        path: 'assets/environment/wall-window-banner.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    wallWindowFrame: {
        path: 'assets/environment/wall-window-frame.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    wallWindowShutters: {
        path: 'assets/environment/wall-window-shutters.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    wallWindow: {
        path: 'assets/environment/wall-window.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    //#endregion

    //#region stairs
    stairsCornerInner: {
        path: 'assets/environment/stairs-corner-inner.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    stairsCorner: {
        path: 'assets/environment/stairs-corner.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    stairsHandrailSingle: {
        path: 'assets/environment/stairs-handrail-single.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    stairsHandrail: {
        path: 'assets/environment/stairs-handrail.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    stairsRamp: {
        path: 'assets/environment/stairs-ramp.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    stairsSmallCenter: {
        path: 'assets/environment/stairs-small-center.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    stairsSmallCornerInner: {
        path: 'assets/environment/stairs-small-corner-inner.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    stairsSmallCorner: {
        path: 'assets/environment/stairs-small-corner.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    stairsSmallEdgeHandrail: {
        path: 'assets/environment/stairs-small-edge-handrail.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    stairsSmallEdge: {
        path: 'assets/environment/stairs-small-edge.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    stairsSmallEdgesHandrail: {
        path: 'assets/environment/stairs-small-edges-handrail.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    stairsSmallEdges: {
        path: 'assets/environment/stairs-small-edges.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    stairs: {
        path: 'assets/environment/stairs.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    //#endregion

    //#region structure
    structureBarrierHigh: {
        path: 'assets/environment/structure-barrier-high.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    structureBarrier: {
        path: 'assets/environment/structure-barrier.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    structurePanel: {
        path: 'assets/environment/structure-panel.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    structure: {
        path: 'assets/environment/structure.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    //#endregion

    //#region table
    tableDisplayPlanet: {
        path: 'assets/environment/table-display-planet.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    tableDisplaySmall: {
        path: 'assets/environment/table-display-small.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    tableDisplay: {
        path: 'assets/environment/table-display.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    tableInsetSmall: {
        path: 'assets/environment/table-inset-small.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    tableInset: {
        path: 'assets/environment/table-inset.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    tableLarge: {
        path: 'assets/environment/table-large.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    table: {
        path: 'assets/environment/table.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    //#endregion

    //#region other
    balconyFloorCenter: {
        path: 'assets/environment/balcony-floor-center.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    balconyFloorCorner: {
        path: 'assets/environment/balcony-floor-corner.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    balconyFloor: {
        path: 'assets/environment/balcony-floor.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    balconyRailCenter: {
        path: 'assets/environment/balcony-rail-center.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    balconyRailCorner: {
        path: 'assets/environment/balcony-rail-corner.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    balconyRail: {
        path: 'assets/environment/balcony-rail.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    bedDoubleCover: {
        path: 'assets/environment/bed-double-cover.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    bedDouble: {
        path: 'assets/environment/bed-double.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    bedSingleCover: {
        path: 'assets/environment/bed-single-cover.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    bedSingle: {
        path: 'assets/environment/bed-single.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    chairArmrestHeadrest: {
        path: 'assets/environment/chair-armrest-headrest.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    chairArmrest: {
        path: 'assets/environment/chair-armrest.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    chairCushionHeadrest: {
        path: 'assets/environment/chair-cushion-headrest.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    chairCushion: {
        path: 'assets/environment/chair-cushion.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    chairHeadrest: {
        path: 'assets/environment/chair-headrest.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    chair: {
        path: 'assets/environment/chair.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    computerScreen: {
        path: 'assets/environment/computer-screen.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    computerSystem: {
        path: 'assets/environment/computer-system.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    computerWide: {
        path: 'assets/environment/computer-wide.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    computer: {
        path: 'assets/environment/computer.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    containerFlatOpen: {
        path: 'assets/environment/container-flat-open.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    containerFlat: {
        path: 'assets/environment/container-flat.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    containerTall: {
        path: 'assets/environment/container-tall.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    containerWide: {
        path: 'assets/environment/container-wide.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    container: {
        path: 'assets/environment/container.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    displayWallWide: {
        path: 'assets/environment/display-wall-wide.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    displayWall: {
        path: 'assets/environment/display-wall.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    pipeBendDiagonal: {
        path: 'assets/environment/pipe-bend-diagonal.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    pipeBend: {
        path: 'assets/environment/pipe-bend.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    pipeEndColored: {
        path: 'assets/environment/pipe-end-colored.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    pipeEnd: {
        path: 'assets/environment/pipe-end.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    pipeRingColored: {
        path: 'assets/environment/pipe-ring-colored.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    pipeRing: {
        path: 'assets/environment/pipe-ring.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    railNarrow: {
        path: 'assets/environment/rail-narrow.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    rail: {
        path: 'assets/environment/rail.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    rocks: {
        path: 'assets/environment/rocks.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    skipRocks: {
        path: 'assets/environment/skip-rocks.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    skip: {
        path: 'assets/environment/skip.glb',
        scale: MODEL_SCALE_ENV,
        posOffset: { x: 0, y: 0, z: 0 },
        rotOffset: { x: 0, y: 0, z: 0 },
        shadows: { cast: true, receive: true },
    },
    //#endregion

    //#endregion
};
