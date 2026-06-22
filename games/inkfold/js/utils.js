/** Deterministic PRNG. Returns a function producing floats in [0, 1). */
function mulberry32(seed) {
    return function () {
        seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/** "#rrggbb" -> [r, g, b] (0-255). */
function hexToRgb(hex) {
    const h = hex.replace("#", "");
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

/** [r,g,b] -> "#rrggbb". */
function rgbToHex(r, g, b) {
    const c = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
    return "#" + c(r) + c(g) + c(b);
}

/** Euclidean RGB distance. */
function colorDistance(r1, g1, b1, r2, g2, b2) {
    const dr = r1 - r2, dg = g1 - g2, db = b1 - b2;
    return Math.sqrt(dr * dr + dg * dg + db * db);
}

/** RGB (0-255) -> HSL (h 0-360, s/l 0-1). */
function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0; const l = (max + min) / 2;
    const d = max - min;
    if (d !== 0) {
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === r) h = ((g - b) / d + (g < b ? 6 : 0));
        else if (max === g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
        h *= 60;
    }
    return [h, s, l];
}

/** HSL -> RGB (0-255). */
function hslToRgb(h, s, l) {
    h = ((h % 360) + 360) % 360;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (h < 60) [r, g, b] = [c, x, 0];
    else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x];
    else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c];
    else[r, g, b] = [c, 0, x];
    return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
}

/** Rotate (x,y) around (cx,cy) by `degrees`; returns [x, y]. */
function rotate(x, y, cx, cy, degrees) {
    const rad = (degrees * Math.PI) / 180;
    const dx = x - cx, dy = y - cy;
    return [cx + dx * Math.cos(rad) - dy * Math.sin(rad), cy + dx * Math.sin(rad) + dy * Math.cos(rad)];
}

/** Even-odd ray-cast point-in-polygon. `points` is [{x,y}, ...]. */
function pointInPolygon(x, y, points) {
    let inside = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const xi = points[i].x, yi = points[i].y, xj = points[j].x, yj = points[j].y;
        if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
}

function dist(ax, ay, bx, by) { return Math.hypot(ax - bx, ay - by); }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

/**
 * Apply a vanity palette transform to a base colour.
 * Hue is preserved (so distinct colours stay distinguishable for the flood fill);
 * only saturation/lightness and a small tint mix change.
 * @param {string} hex - base colour
 * @param {object} palette - one of PALETTES
 * @returns {string} resolved hex colour
 */
function applyPalette(hex, palette) {
    let [r, g, b] = hexToRgb(hex);
    if (palette.tint && palette.mix > 0) {
        const [tr, tg, tb] = hexToRgb(palette.tint);
        r += (tr - r) * palette.mix; g += (tg - g) * palette.mix; b += (tb - b) * palette.mix;
    }
    let [h, s, l] = rgbToHsl(r, g, b);
    s = clamp(s * palette.satMul, 0, 1);
    l = clamp(l * palette.lightMul, 0, 1);
    const [nr, ng, nb] = hslToRgb(h, s, l);
    return rgbToHex(nr, ng, nb);
}

/** Weighted pick from `items` ([{value, weight}, ...]) using rng(). */
function weightedPick(items, rng) {
    const total = items.reduce((s, it) => s + it.weight, 0);
    let r = rng() * total;
    for (const it of items) { r -= it.weight; if (r <= 0) return it.value; }
    return items[items.length - 1].value;
}

/** Human-readable label for a mechanical unlock key (for the level-up overlay). */
function unlockLabel(key) {
    if (!key) return "Welcome";
    if (key.startsWith("symmetry_")) return (SYMMETRY_TYPES[key.replace("symmetry_", "")] || {}).label + " symmetry";
    if (key.startsWith("pen_")) return (PEN_TYPES[key.replace("pen_", "")] || {}).label + " pen";
    if (key.startsWith("grid_")) return (GRID_TYPES[key.replace("grid_", "")] || {}).label + " grid";
    if (key.startsWith("zone_")) return (ZONE_TYPES[key.replace("zone_", "")] || {}).label + " zone";
    if (key === "color_2") return "A second colour";
    if (key === "color_3") return "A third colour";
    if (key.startsWith("dot_count")) return "More dots per puzzle";
    return key;
}
