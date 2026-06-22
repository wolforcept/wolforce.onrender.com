# Inkfold — Implementation Plan

---

## Overview

Single `index.html` file. No frameworks, no build step. Vanilla JS organized into clearly labelled sections. Three views rendered in the same page, swapped via JS: **Play**, **Gallery**, and **Customization**. A **Level-up overlay** appears on top of any view when a level is gained.

---

## Pages & Navigation

```
[ Play ]   [ Gallery ]   [ Customize ]
```

- Navigation bar always visible at the top
- Views are `<div>` blocks, only one visible at a time (`display: none` on the rest)
- Level-up overlay is a fixed `<div>` that appears above everything when triggered

---

## Canvas Stack

One canvas, plus one offscreen canvas for connection checking. UI is HTML.

| # | Name | Purpose |
|---|------|---------|
| 1 | `canvas` | All ink, permanent. Fades inside fade zones. The only drawn-to canvas — chrome lives in HTML, not here. |
| — | `checkCanvas` (offscreen, not in DOM) | Downsampled 200×200 **snapshot of `canvas`**, blitted via `drawImage` when a connection check runs. No strokes are stored or replayed. |

**Background** — plain CSS `background-color` on the canvas container `<div>`. No canvas needed. Texture overlays (if unlocked) are CSS `background-image` patterns on the same div, composited via `mix-blend-mode`.

**Fade zones** — on every animation frame, `destination-out` is applied at very low alpha over each fade zone region directly on the main canvas. This continuously erodes the **alpha** of the ink painted there. A half-faded stroke still reads as a valid connection; only once a pixel's alpha drops below `CONSTANTS.CONNECTION_MIN_ALPHA` does the flood fill stop counting it. Only the main canvas is eroded — the connection check re-snapshots the canvas when it runs, so it automatically sees the faded pixels (see Connection Checking). The fade zone is a property of the space, not of when you drew.

**UI / chrome** — all of it is HTML/SVG absolutely positioned over the canvas, never drawn on the canvas (the canvas is never cleared, so on-canvas chrome would accumulate; keeping it in HTML also keeps the saved image clean):
- Ink bar: `<div>` with CSS width transition
- XP bar: `<div>` with CSS width transition
- Dot markers: positioned `<div>`s, removed from the DOM when their colour completes
- Zone outlines: an SVG layer with faint dashed shapes
- Symmetry axis: a thin SVG/`<div>` line, shown while drawing
- Pen cursor: CSS `cursor: none` on canvas, a small absolutely-positioned `<div>` that follows the pointer

## State Shape

```js
const STATE = {
  // Progression
  xp: 0,
  level: 0,
  // The unlock pool is NOT stored. It is a derived getter on StateManager:
  // all LEVELS[i].unlocks where LEVELS[i].xpRequired <= STATE.xp.

  // Equipped vanity (from customization page)
  equipped: {
    background: "dark",       // key into BACKGROUNDS
    texture: "none",          // key into TEXTURES
    strokePalette: "default", // key into PALETTES
    completionAnim: "none",   // key into ANIMATIONS
    penVisual: "ballpoint",   // key into PEN_VISUALS
  },

  // Current puzzle
  puzzle: {
    seed: 0,
    symmetry: "vertical",     // one of the symmetry type keys
    colors: [],               // array of color hex strings, e.g. ["#fff", "#f9a"]
    dots: [],                 // points still left to connect: { id, x, y, colorIndex, partnerId }
                              // a colour's dots are removed when all its pairs connect; empty = win
    zones: [],                // array of { type, shape, points[] }
    grid: "none",             // snapping grid type
    inkBudget: 0,             // total allowed stroke length in pixels
    inkUsed: 0,               // current accumulated stroke length
  },

  // Player-chosen drawing tool (NOT a puzzle property) — persisted, selected
  // from the unlocked pens via a selector under the canvas, like the colours.
  selectedPen: "normal",

  // Drawing session
  isDrawing: false,
  // No strokes are stored. The canvas bitmap is the single source of truth for
  // both rendering and connection checking; resume is restored from a saved
  // canvas snapshot (see Local Persistence).
};
```

---

## Progression & Levels

```js
const LEVELS = [
  { xpRequired: 0,    unlocks: null },                    // level 0, starting state
  { xpRequired: 100,  unlocks: "symmetry_horizontal" },
  { xpRequired: 250,  unlocks: "color_2" },
  { xpRequired: 450,  unlocks: "pen_thick" },
  { xpRequired: 700,  unlocks: "dot_count_5" },
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
  // Vanity unlocks interspersed throughout, keyed with a "vanity_" prefix
  // (e.g. "vanity_bg_indigo", "vanity_palette_gold", "vanity_pen_quill").
  // The generator ignores any "vanity_*" key; the Customization page reads ONLY those.
];
```

The unlock pool at any moment = all `unlocks` values from entries where `xpRequired <= STATE.xp`.

---

## XP Formula

```js
function calcXP(inkUsed, inkBudget) {
  const BASE_XP = 30;
  const ratio = inkUsed / inkBudget; // 1.0 = exactly at budget
  const efficiencyBonus = Math.max(0, (1 - ratio)) * 120;
  return Math.round(BASE_XP + efficiencyBonus);
}
// Examples:
// 20% ink used  → 30 + 96  = 126 XP
// 50% ink used  → 30 + 60  = 90 XP
// 100% ink used → 30 + 0   = 30 XP
// 150% ink used → 30 + 0   = 30 XP (base only)
```

After awarding XP, loop: `while (LEVELS[level+1] && STATE.xp >= LEVELS[level+1].xpRequired)`, increment `level` and queue a level-up overlay for that unlock. A single award can cross several thresholds at once; the queued overlays are shown in sequence.

---

## Procedural Puzzle Generator

Takes `seed` (integer) and the current unlock pool. Returns a full puzzle object.

### Seeded RNG

```js
function mulberry32(seed) {
  return function() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}
```

All random choices in the generator use this RNG. Same seed = same puzzle always.

### Generation steps

1. **Pick symmetry** — weighted random from the unlocked symmetry types, using each type's `baseWeight` from `SYMMETRY_TYPES` (simpler/earlier types have higher weight, so they stay common but every unlocked type is possible). `baseWeight` is the single source of weighting — there is no separate index-based formula.

2. **Pick color count** — weighted random from unlocked color counts (1, 2, or 3).

3. **Pick dot count** — random between 2 and the current max unlocked dot count, per color. Each color gets its own set of dot pairs.

4. **Pick grid** — weighted random from unlocked grids.

5. **Place dots** — generate `(x, y)` positions respecting:
   - Must be within the "drawable half" of the canvas (the other half is the mirror)
   - Must not be on the symmetry axis itself (too easy)
   - Dots are placed in pairs: dot A and dot B of the same color. B is placed such that a path connecting A→B is non-trivial but achievable within ink budget.
   - For rotational symmetries, dots are placed in the primary sector only; mirrored copies are visual-only and do not require separate connections.

6. **Calculate ink budget** — a pure geometric target: minimum path length to connect all dot pairs (straight-line distances) with a multiplier of ~2.5 for wiggle room. **Neither symmetry nor pen is a factor.** Symmetry doesn't count because dots live in the primary sector and ink bills only the primary stroke (mirror copies are free). The pen doesn't count because it's the player's choice (step 8) — a thick pen just burns through the same budget faster, a thin one spares it.

7. **Pick zones** — if zones are unlocked, roll for 0–2 zones. Place them as circles or polygons in the drawable area, also mirrored.

8. **Pen is not generated** — the mechanical pen is chosen by the **player** from the unlocked pens, via a selector under the canvas (like the colour swatches). It is part of `STATE.selectedPen`, persisted across puzzles, not baked into the puzzle. Drawing uses the selected pen's `sizeBase` and `inkModifier`; the budget (step 6) ignores it, so pen choice is a pure efficiency/forgiveness tradeoff.

---

## Symmetry Transform

Given a raw canvas point `(x, y)`, return all mirrored copies to draw simultaneously.

```js
function getMirroredPoints(x, y, symmetry) {
  const canvasW = CONSTANTS.CANVAS_SIZE, canvasH = CONSTANTS.CANVAS_SIZE; // square canvas
  const cx = canvasW / 2, cy = canvasH / 2;
  switch (symmetry) {
    case "vertical":
      return [[x, y], [canvasW - x, y]];
    case "horizontal":
      return [[x, y], [x, canvasH - y]];
    case "4way":
      return [[x, y], [canvasW - x, y], [x, canvasH - y], [canvasW - x, canvasH - y]];
    case "3fold": {
      // rotate (x,y) around center by 0°, 120°, 240°
      return [0, 120, 240].map(deg => rotate(x, y, cx, cy, deg));
    }
    case "6fold": {
      return [0, 60, 120, 180, 240, 300].map(deg => rotate(x, y, cx, cy, deg));
    }
    case "radial": {
      // mirror inward/outward from center — distance from center is reflected
      const dx = x - cx, dy = y - cy;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const maxDist = Math.min(cx, cy);
      const mirroredDist = maxDist - dist;
      const angle = Math.atan2(dy, dx);
      return [
        [x, y],
        [cx + Math.cos(angle) * mirroredDist, cy + Math.sin(angle) * mirroredDist]
      ];
    }
  }
}

function rotate(x, y, cx, cy, degrees) {
  const rad = degrees * Math.PI / 180;
  const dx = x - cx, dy = y - cy;
  return [
    cx + dx * Math.cos(rad) - dy * Math.sin(rad),
    cy + dx * Math.sin(rad) + dy * Math.cos(rad)
  ];
}
```

Every time a point is drawn, all its mirrored copies are also drawn on the single `canvas`. Nothing is written to `checkCanvas` here — it is produced on demand as a downscaled snapshot of `canvas` when a connection check runs (see Connection Checking).

---

## Drawing Pipeline

### Pointer events on `canvas`

Use Pointer Events (`pointerdown` / `pointermove` / `pointerup`) so mouse and touch share one code path.

```
pointerdown → start stroke, set STATE.isDrawing = true, draw first point
pointermove → if drawing: grid snap, apply zone effects, draw the new segment
              opaquely on canvas, draw mirrored copies, update ink counter
pointerup   → finish stroke, save canvas snapshot to localStorage, run connection check
```

### Grid snapping

Before drawing any point, snap it to the nearest grid vertex if a grid is active:

```js
function snapToGrid(x, y, grid, canvasW, canvasH) {
  if (grid === "none") return [x, y];
  if (grid === "square") {
    const size = 40; // px, adjustable
    return [Math.round(x / size) * size, Math.round(y / size) * size];
  }
  if (grid === "hex") { /* hex vertex snapping math */ }
  if (grid === "triangular") { /* triangular vertex snapping math */ }
  if (grid === "radial") { /* snap to nearest spoke/ring intersection */ }
}
```

### Zone effect application

On each new point, check all active zones:

```js
function getZoneEffects(x, y, zones) {
  let penSizeMultiplier = 1;
  let inkCostMultiplier = 1;
  let isFade = false;
  let isGlide = false;

  for (const zone of zones) {
    if (pointInZone(x, y, zone)) {
      switch (zone.type) {
        case "thin":       penSizeMultiplier *= 0.4; break;
        case "thick":      penSizeMultiplier *= 2.0; break;
        case "inkdrain":   inkCostMultiplier *= 2.0; break;
        case "fade":       isFade = true; break;
        case "glide":      isGlide = true; break; // smooth points before drawing
      }
    }
  }
  return { penSizeMultiplier, inkCostMultiplier, isFade, isGlide };
}
```

---

## Pen Rendering

Each mechanical pen type has a `draw(ctx, points, color, size)` function:

| Pen | Rendering approach |
|-----|--------------------|
| `normal` | Smooth bezier curve through points, constant `lineWidth` |
| `thick` | Same as normal, larger `lineWidth` (e.g. 12px) |
| `thin` | Same as normal, small `lineWidth` (e.g. 2px) |
| `tapered` | Series of circles along the path with radius proportional to speed (fast = thin, slow = thick). Gives calligraphy feel. |
| `rectangular` | Draw with a rotated rectangle stamp along the path. Wide in x, narrow in y. Use `ctx.save/restore` with `ctx.rotate`. |

All pens draw **opaque** (`globalAlpha = 1`). Strokes are painted once, segment by segment, onto the permanent canvas; opaque paint means overlapping segments never compound into darker blotches.

Stroke palette modifies the color(s) used:
- `default` — use the dot's assigned color directly
- `gold` — remap colors to gold/amber tones
- `watercolor` — lower opacity + desaturated tones
- `neon` — high saturation, slight glow effect via multiple passes

---

## Ink Measurement

```js
function strokeLength(points) {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i-1].x;
    const dy = points[i].y - points[i-1].y;
    total += Math.sqrt(dx*dx + dy*dy);
  }
  return total;
}
```

When a point is drawn:
```
inkDelta = segmentLength * inkCostMultiplier * pen.inkCostModifier
STATE.puzzle.inkUsed += inkDelta
```

Only the **primary** stroke length counts toward ink — mirror copies are free. This keeps the ink budget independent of symmetry (see generation step 6): `inkUsed` measures only what the player actually traced. `inkUsed` is a simple monotonic counter from 0 upward, compared against `inkBudget`. Nothing ever decreases it — there is no ink refill.

---

## Connection Checking (Pixel Flood Fill)

Run after every `pointerup` (stroke completion), and on a throttled timer while fade zones are active.

### Step 1 — Snapshot the canvas into checkCanvas

The check runs on a downsampled copy of the **main canvas**, so it always reflects exactly what is painted — fade included. Just before checking, blit the main canvas into the 200×200 `checkCanvas`:

```js
function snapshotCheckCanvas() {
  checkCtx.clearRect(0, 0, 200, 200);
  checkCtx.drawImage(canvas, 0, 0, 200, 200); // downscale the real ink
}
```

No strokes are stored or replayed, and `checkCanvas` is never eroded separately — because it is a fresh snapshot, fade is already baked into the pixels it copies. Chrome (dots, axis, zones) lives in HTML, so it never pollutes the snapshot.

### Step 2 — Flood fill per color

For each color still on the board (dots not yet removed):

```js
function checkConnection(dotA, dotB, color) {
  const scale = 200 / CANVAS_SIZE;
  const startX = Math.round(dotA.x * scale);
  const startY = Math.round(dotA.y * scale);
  const targetX = Math.round(dotB.x * scale);
  const targetY = Math.round(dotB.y * scale);

  const imageData = checkCtx.getImageData(0, 0, 200, 200);
  const visited = new Uint8Array(200 * 200);
  const queue = [[startX, startY]];
  visited[startY * 200 + startX] = 1;

  while (queue.length > 0) {
    const [cx, cy] = queue.shift();
    // Success when we reach within a small radius of the target dot, not its
    // exact pixel — keep the radius small so near-misses don't count.
    if ((cx - targetX) ** 2 + (cy - targetY) ** 2 <= CONSTANTS.CONNECTION_TARGET_RADIUS ** 2) return true;

    for (const [nx, ny] of neighbors(cx, cy)) {
      if (nx < 0 || ny < 0 || nx >= 200 || ny >= 200) continue;
      if (visited[ny * 200 + nx]) continue;
      if (!pixelMatchesColor(imageData, nx, ny, color)) continue;
      visited[ny * 200 + nx] = 1;
      queue.push([nx, ny]);
    }
  }
  return false;
}

function pixelMatchesColor(imageData, x, y, hexColor) {
  const idx = (y * 200 + x) * 4;
  const r = imageData.data[idx];
  const g = imageData.data[idx+1];
  const b = imageData.data[idx+2];
  const a = imageData.data[idx+3];
  if (a < CONSTANTS.CONNECTION_MIN_ALPHA) return false; // not painted, or faded below the cutoff
  const [tr, tg, tb] = hexToRgb(hexColor);
  // loose hue match to handle blending/anti-aliasing
  return colorDistance(r,g,b, tr,tg,tb) < CONSTANTS.COLOR_MATCH_THRESHOLD;
}
```

### Completion rule

There is **no stored per-pair "fulfilled" flag** — connectivity is recomputed from the live canvas each check. After each check, for every colour still on the board, test all of that colour's pairs:

- If **every** pair of the colour is connected, remove all of that colour's dots from `STATE.puzzle.dots` (brief vanish effect). Removal is the only state, and it is permanent — fade cannot bring a colour back.
- If not all pairs are connected, **nothing happens** — no partial state is kept.
- When `STATE.puzzle.dots` is empty (every colour removed), the puzzle is **won** → trigger Puzzle Completion.

Because connectivity is recomputed each check, a colour that is only *partially* connected can come apart again as its ink fades — that is the intended challenge: finish a colour before its ink decays past the cutoff. Only a fully-connected colour is locked, and it locks by being removed from the dot list.

---

## Puzzle Completion

Triggered when the last colour's dots are removed — i.e. every colour's pairs are connected and all dots are gone.

1. Stop accepting input
2. Run completion animation (if unlocked and equipped)
3. No chrome removal needed — dots/axis/zones are HTML, so the canvas already holds only ink
4. Call `canvas.toBlob(cb, "image/png")` directly to get the image Blob
5. Calculate XP, show XP awarded overlay
6. Save the Blob + metadata to the gallery in IndexedDB
7. Check for level-up (looping over crossed thresholds), show overlay(s) if needed
8. Show "Next puzzle" button

---

## Gallery

### Storage — IndexedDB, not localStorage

Completed drawings live in **IndexedDB**, not `localStorage`. localStorage is a ~5MB synchronous string store; 100 full-canvas PNGs as base64 data-URLs would blow straight past that (and base64 adds ~33% size overhead on top). IndexedDB stores binary **Blobs** directly (no base64 bloat), is asynchronous (no main-thread jank when saving), and has a far larger quota — typically hundreds of MB.

```js
// IndexedDB database: "inkfold", object store: "gallery", keyPath: "id", autoIncrement
// Each record:
{
  id: 1717900000000,   // auto-key (timestamp)
  image: Blob,         // PNG Blob from canvas.toBlob(), NOT a data-URL string
  date: "2026-06-09",
  symmetry: "6fold",
  colors: ["#ffffff", "#ff9aaa"],
  xpEarned: 94,
  level: 7,
}
```

Produce the image with `canvas.toBlob(cb, "image/png")` (smaller and faster than `toDataURL`). Cap the store at a generous limit (e.g. 200), deleting oldest first.

### Gallery page rendering

For each record, create an object URL with `URL.createObjectURL(record.image)` and set it as an `<img>` `src`; revoke it (`URL.revokeObjectURL`) when the tile is removed or the lightbox closes, to free memory. Each tile has a small caption: date, symmetry type, XP earned. Clicking an image opens a full-size lightbox with a download button (`<a download>` pointing at the object URL).

---

## Customization Page

Shows all vanity categories. Each item is shown as a tile — locked items are shown greyed out with a lock icon and the level they unlock at. Unlocked items are selectable. Current selection is highlighted.

Categories displayed:
- Background color
- Background texture
- Stroke palette
- Completion animation
- Pen visual

Saving selections updates `STATE.equipped` and persists to `localStorage`.

---

## Level-up Overlay

Triggered when XP crosses a level threshold. Shows:
- "Level [N] reached!"
- What was unlocked (name + brief description)
- A small illustration or icon of the unlock
- "Continue" button to dismiss

---

## UI Layer — HTML Overlay

All non-ink UI is HTML/SVG absolutely positioned over the canvas. It updates itself; the canvas is never used to draw chrome (a never-cleared canvas would accumulate it, and it would dirty the saved image):

- Dot markers — positioned `<div>`s (filled circle in the colour). Removed from the DOM when their colour completes.
- Zone outlines — an SVG layer with faint dashed shapes.
- Symmetry axis — a thin SVG/`<div>` line, shown while drawing.
- Ink bar — `<div>` filling left to right, subtle pulse animation when over 100%.
- XP bar — `<div>` that fills as XP accumulates across puzzles.
- Pen cursor — `cursor: none` on the canvas plus a small `<div>` following the pointer.

Below the canvas sit two player controls (also HTML, not on the canvas):
- **Colour swatches** — one per puzzle colour; selects which colour the next stroke draws. Hidden for single-colour puzzles. A swatch greys out when its colour completes.
- **Pen selector** — buttons for the unlocked pens; selects `STATE.selectedPen`. Hidden until more than one pen is unlocked.

The only thing painted on the canvas is ink (during `pointermove`). The animation loop's only canvas job is fade-zone erosion.

---

## Fade Zone — Frame Loop Detail

Each animation frame, `AnimationLoop`'s only canvas job is to erode every active fade zone region on the main canvas. The connection check re-snapshots the canvas when it runs, so it automatically sees the faded pixels — no separate erosion of `checkCanvas` is needed:

```js
function animationLoop() {
  const fadeZones = puzzle.zones.filter(z => z.type === "fade");

  // The ONLY canvas work per frame: erode fade zones on the main canvas.
  erodeFadeZones(ctx, fadeZones);

  // A fully-connected colour is already removed; a partial colour can come
  // apart as ink fades, so re-check (throttled) while dots remain and zones erode.
  if (fadeZones.length > 0 && STATE.puzzle.dots.length > 0) connectionChecker.recheckThrottled();

  requestAnimationFrame(animationLoop);
}

// destination-out erosion of every fade zone on the main canvas
function erodeFadeZones(targetCtx, fadeZones) {
  targetCtx.save();
  targetCtx.globalCompositeOperation = "destination-out";
  targetCtx.globalAlpha = CONSTANTS.FADE_ZONE_ERASE_ALPHA; // e.g. 0.008 per frame
  for (const zone of fadeZones) drawZoneShape(targetCtx, zone);
  targetCtx.restore();
}
```

Dots, axis, zone outlines, and the bars are all HTML and update themselves — the loop never draws them. This keeps the never-cleared canvas free of accumulating chrome.

---

## Local Persistence

| Key | Store | Contents |
|-----|-------|----------|
| `inkfold_state` | localStorage | `STATE` progression: `xp`, `level`, `equipped`. The unlock pool is **not** stored — it is derived from `xp`. |
| `inkfold_progress` | localStorage | Current puzzle: `seed`, the full generated `puzzle` object (including its remaining `dots`), `inkUsed`, and a `canvasSnapshot` data-URL of the current ink. On refresh the snapshot is drawn straight back onto the canvas — there are no strokes to replay. Written on each `pointerup`. |
| `inkfold_gallery` | **IndexedDB** | Completed drawings as image **Blobs** + metadata (see Gallery). Not localStorage. |

---

## Code Quality Standards

### General principles

- **Single responsibility** — every class and function does one thing. If a method needs a comment explaining what its two halves do, it should be two methods.
- **No magic numbers** — all constants (canvas size, ink multipliers, flood fill threshold, grid spacing, etc.) live in a single `CONSTANTS` object at the top of the script. Never hardcode `40` or `0.015` inline.
- **Pure functions where possible** — generator, symmetry transforms, grid snapping, ink measurement, and XP calculation are all pure (input → output, no side effects). Only drawing and state methods touch external state.
- **Fail loudly in development** — use `console.assert` liberally to catch contract violations (e.g. a dot without a partnerId, a stroke with no points).
- **No premature optimisation** — write clearly first. The one exception is the flood fill, which is performance-sensitive and is explicitly allowed to be low-level.

---

### Class structure

```
PuzzleGenerator         — generates puzzle objects from seed + unlock pool
SymmetryEngine          — transforms points according to symmetry type
GridSnapper             — snaps coordinates to active grid
PenRenderer             — draws strokes on canvas with pen-specific style
ZoneManager             — tracks zones, detects point-in-zone, returns effects
InkMeter                — tracks ink used, calculates XP, manages bar state
ConnectionChecker       — snapshots canvas into checkCanvas, runs flood fill, removes completed colours
DrawingSession          — orchestrates mouse/touch events, delegates to above classes
AnimationLoop           — rAF loop, owns fade zone erosion and the throttled re-check (draws no chrome)
StateManager            — loads/saves STATE + progress to localStorage, owns STATE, exposes mutations; `unlockedPool` is a derived getter (not stored)
GalleryManager          — saves completed drawings to IndexedDB (Blobs), renders gallery page
CustomizationPage       — renders unlock tiles, handles equip selections
LevelUpOverlay          — shows unlock notification, handles dismiss
UIRenderer              — manages the HTML/SVG overlay: dot divs, zone/axis SVG, ink/XP bars, pen cursor
```

Each class is instantiated once and stored at the top level. Classes communicate by calling each other's methods — no shared mutable globals except `STATE` (owned by `StateManager`).

---

### Method documentation standard

Every public method gets a JSDoc comment with `@param`, `@returns`, and a one-line description. Private/internal methods (prefixed `_`) get a brief inline comment only.

```js
/**
 * Generates a complete puzzle object deterministically from a seed.
 * The same seed and unlock pool always produce the same puzzle.
 *
 * @param {number} seed - Integer seed for the RNG
 * @param {string[]} unlockPool - Array of unlock keys currently active
 * @returns {Puzzle} A fully specified puzzle object ready to play
 */
generate(seed, unlockPool) { ... }

/**
 * Returns all mirrored copies of a canvas point for the given symmetry type.
 *
 * @param {number} x - X coordinate in canvas pixels
 * @param {number} y - Y coordinate in canvas pixels
 * @param {string} symmetry - One of the SYMMETRY_TYPES keys
 * @returns {Array<[number, number]>} Array of [x, y] pairs including the original
 */
getMirroredPoints(x, y, symmetry) { ... }

/**
 * Checks whether dot pair A→B are connected via painted pixels of their color.
 * Runs a BFS flood fill on the downsampled checkCanvas.
 *
 * @param {Dot} dotA - Starting dot
 * @param {Dot} dotB - Target dot
 * @param {string} color - Hex color string to match against
 * @returns {boolean} True if a continuous painted path exists between the dots
 */
checkConnection(dotA, dotB, color) { ... }
```

---

### Naming conventions

| Thing | Convention | Example |
|-------|-----------|---------|
| Classes | PascalCase | `PenRenderer` |
| Methods | camelCase | `getMirroredPoints` |
| Private methods | `_camelCase` | `_buildWeightTable` |
| Constants object | `SCREAMING_SNAKE` | `CONSTANTS.CANVAS_SIZE` |
| Data definition objects | `SCREAMING_SNAKE` | `SYMMETRY_TYPES`, `PEN_TYPES` |
| Instance variables | camelCase | `this.inkUsed` |
| Local variables | camelCase | `const floodQueue` |
| Boolean variables | `is/has/can` prefix | `isFulfilled`, `hasZones` |

---

### Data definitions

All game data is defined as plain objects at the top of the script, not scattered inline. This makes tuning easy without touching logic.

```js
const SYMMETRY_TYPES = {
  vertical:   { label: "Vertical Mirror",   axes: 2,  baseWeight: 10 },
  horizontal: { label: "Horizontal Mirror", axes: 2,  baseWeight: 8  },
  "4way":     { label: "4-Way",             axes: 4,  baseWeight: 6  },
  "3fold":    { label: "3-Fold Rotation",   axes: 3,  baseWeight: 5  },
  "6fold":    { label: "6-Fold Rotation",   axes: 6,  baseWeight: 4  },
  radial:     { label: "Radial",            axes: 0,  baseWeight: 3  },
};

const PEN_TYPES = {
  normal:      { label: "Normal",      inkModifier: 1.0, sizeBase: 5  },
  thick:       { label: "Thick",       inkModifier: 2.0, sizeBase: 12 },
  thin:        { label: "Thin",        inkModifier: 0.5, sizeBase: 2  },
  tapered:     { label: "Tapered",     inkModifier: 1.2, sizeBase: 6  },
  rectangular: { label: "Rectangular", inkModifier: 1.3, sizeBase: 8  },
};
```

---

### Error handling

- Wrap all `localStorage` reads in try/catch — storage can be full or corrupted
- Validate puzzle objects after generation with a `_validate(puzzle)` method that checks required fields and logs warnings
- Canvas context acquisition (`canvas.getContext("2d")`) checked on init; show a clear error message if unavailable (e.g. old browser)
- Flood fill has a max iteration cap (`CONSTANTS.FLOOD_FILL_MAX_PIXELS`) to prevent freezing on edge cases

---

## File Sections (in order inside `index.html`)

```
1. HTML structure
   - Nav bar
   - Play view (canvas stack)
   - Gallery view
   - Customization view
   - Level-up overlay
   - Puzzle-complete overlay

2. CSS
   - Layout, nav, views
   - Canvas positioning
   - Gallery grid
   - Customization tiles
   - Overlays
   - Ink bar / XP bar animations

3. JS — Constants & data definitions
   - `CONSTANTS` object (all magic numbers in one place)
   - `LEVELS` array
   - `SYMMETRY_TYPES`, `PEN_TYPES`, `ZONE_TYPES`, `GRID_TYPES`
   - `BACKGROUNDS`, `TEXTURES`, `PALETTES`, `PEN_VISUALS`, `ANIMATIONS`

4. JS — Utility functions
   - Seeded RNG (`mulberry32`)
   - `hexToRgb`, `colorDistance`, `rotate`, `pointInPolygon`

5. JS — `StateManager` class

6. JS — `PuzzleGenerator` class

7. JS — `SymmetryEngine` class

8. JS — `GridSnapper` class

9. JS — `PenRenderer` class

10. JS — `ZoneManager` class

11. JS — `InkMeter` class

12. JS — `ConnectionChecker` class

13. JS — `UIRenderer` class

14. JS — `AnimationLoop` class

15. JS — `DrawingSession` class

16. JS — `GalleryManager` class

17. JS — `CustomizationPage` class

18. JS — `LevelUpOverlay` class

19. JS — Init
    - Instantiate all classes
    - Wire up event listeners
    - Load state, generate first puzzle, start animation loop
```
