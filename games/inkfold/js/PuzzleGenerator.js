
/** Builds a deterministic puzzle from a seed + the active mechanical unlocks. */
class PuzzleGenerator {
    /**
     * @param {number} seed
     * @param {string[]} unlockPool - active mechanical unlock keys
     * @param {object} palette - equipped PALETTES entry (colours are baked in)
     * @returns {object} a serializable puzzle
     */
    generate(seed, unlockPool, palette) {
        const rng = mulberry32(seed >>> 0);
        const pool = new Set(unlockPool);

        const symmetry = this._pickKeyed(SYMMETRY_TYPES, pool, rng);
        const grid = this._pickKeyed(GRID_TYPES, pool, rng);

        const maxColors = 1 + ["color_2", "color_3"].filter((k) => pool.has(k)).length;
        const colorCount = 1 + Math.floor(rng() * maxColors);
        const baseColors = this._pickColors(colorCount, rng);
        const colors = baseColors.map((c) => applyPalette(c, palette));

        const maxPairs = 1 + ["dot_count_5", "dot_count_8"].filter((k) => pool.has(k)).length;

        const pairs = this._placePairs(symmetry, colorCount, maxPairs, rng);
        const zones = this._placeZones(pool, rng, pairs);

        // Budget is a pure geometric target — independent of the pen the player
        // chooses (a thick pen just burns through it faster; a thin pen spares it).
        const budget = pairs.reduce((s, p) => s + dist(p.a.x, p.a.y, p.b.x, p.b.y), 0)
            * CONSTANTS.INK_BUDGET_MULT;

        const puzzle = {
            seed,
            symmetry,
            grid,
            colors,
            pairs,
            zones,
            inkBudget: Math.round(budget),
            inkUsed: 0,
        };
        this._validate(puzzle);
        return puzzle;
    }

    /** Pick a key from a {key:{baseWeight, unlock}} table, limited to unlocked entries. */
    _pickKeyed(table, pool, rng) {
        const items = Object.keys(table)
            .filter((k) => table[k].unlock === null || pool.has(table[k].unlock))
            .map((k) => ({ value: k, weight: table[k].baseWeight }));
        return weightedPick(items, rng);
    }

    _pickColors(count, rng) {
        const shuffled = BASE_COLORS.slice();
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(rng() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled.slice(0, count);
    }

    /** Number of regions the symmetry splits the canvas into. */
    _sideCount(symmetry) {
        switch (symmetry) {
            case "4way": return 4;
            case "3fold": return 3;
            case "6fold": return 6;
            default: return 2; // vertical, horizontal, radial
        }
    }

    /**
     * Which side/region of the symmetry split a point lies in.
     * Returns an index in [0, sideCount), or -1 if the point is off-limits
     * (too close to an edge or a dividing line/axis).
     */
    _sideOf(x, y, symmetry) {
        const S = CONSTANTS.CANVAS_SIZE, cx = S / 2, cy = S / 2;
        const m = CONSTANTS.EDGE_MARGIN, g = CONSTANTS.AXIS_GAP;
        if (x < m || x > S - m || y < m || y > S - m) return -1;
        switch (symmetry) {
            case "vertical":
                return Math.abs(x - cx) < g ? -1 : (x < cx ? 0 : 1);
            case "horizontal":
                return Math.abs(y - cy) < g ? -1 : (y < cy ? 0 : 1);
            case "4way":
                if (Math.abs(x - cx) < g || Math.abs(y - cy) < g) return -1;
                return (x < cx ? 0 : 1) + (y < cy ? 0 : 2);
            case "3fold":
            case "6fold": {
                const n = symmetry === "3fold" ? 3 : 6;
                const sector = 360 / n;
                const r = dist(x, y, cx, cy);
                if (r < 90 || r > cx - m * 0.4) return -1;
                let ang = (Math.atan2(y - cy, x - cx) * 180) / Math.PI;
                ang = ((ang % 360) + 360) % 360;
                const within = ang % sector;
                if (within < 7 || within > sector - 7) return -1; // keep off the dividing spokes
                return Math.floor(ang / sector);
            }
            case "radial": {
                const r = dist(x, y, cx, cy);
                const maxDist = Math.min(cx, cy);
                const mid = maxDist / 2;
                if (r < 70 || r > maxDist - 20) return -1;
                if (Math.abs(r - mid) < g * 0.7) return -1; // keep off the mirror ring
                return r < mid ? 0 : 1; // inner / outer
            }
            default: return 0;
        }
    }

    _placePairs(symmetry, colorCount, maxPairs, rng) {
        const pairs = [];
        const placed = [];                                  // all dots so far, for separation
        const nSides = this._sideCount(symmetry);
        const sideCounts = new Array(nSides).fill(0);       // dots placed per side, kept balanced

        // Pick the least-populated side (random among ties) so dots spread evenly.
        const leastSide = () => {
            const min = Math.min(...sideCounts);
            const candidates = sideCounts.map((c, i) => (c === min ? i : -1)).filter((i) => i >= 0);
            return candidates[Math.floor(rng() * candidates.length)];
        };

        // Rejection-sample a separated point that lies in `targetSide`. Coordinates are
        // rounded before the side test so the stored integer point is exactly what we validate.
        const sampleInSide = (targetSide) => {
            const m = CONSTANTS.EDGE_MARGIN, span = CONSTANTS.CANVAS_SIZE - 2 * m;
            for (let t = 0; t < CONSTANTS.PLACEMENT_TRIES; t++) {
                const x = Math.round(m + rng() * span), y = Math.round(m + rng() * span);
                if (this._sideOf(x, y, symmetry) !== targetSide) continue;
                if (placed.every((d) => dist(d.x, d.y, x, y) >= CONSTANTS.MIN_DOT_SEPARATION)) return { x, y };
            }
            return null;
        };

        const commit = (point, side) => {
            placed.push(point);
            sideCounts[side]++;
        };

        let idCounter = 0;
        for (let ci = 0; ci < colorCount; ci++) {
            const nPairs = 1 + Math.floor(rng() * maxPairs);
            for (let p = 0; p < nPairs; p++) {
                const sideA = leastSide();
                const a = sampleInSide(sideA);
                if (!a) continue;
                commit(a, sideA);

                // Partner: aim for the (now) least-populated side — which pushes pairs to
                // straddle the split — preferring a sane connecting distance, with a fallback.
                let b = null, sideB = null;
                for (let t = 0; t < CONSTANTS.PLACEMENT_TRIES; t++) {
                    const s = leastSide();
                    const cand = sampleInSide(s);
                    if (!cand) continue;
                    const d = dist(a.x, a.y, cand.x, cand.y);
                    if (d >= CONSTANTS.MIN_PAIR_DIST && d <= CONSTANTS.MAX_PAIR_DIST) { b = cand; sideB = s; break; }
                }
                if (!b) { // distance band unsatisfiable — accept any valid separated point
                    sideB = leastSide();
                    b = sampleInSide(sideB);
                }
                if (!b) { placed.pop(); sideCounts[sideA]--; continue; }
                commit(b, sideB);

                pairs.push({
                    colorIndex: ci,
                    a: { x: Math.round(a.x), y: Math.round(a.y), id: idCounter++ },
                    b: { x: Math.round(b.x), y: Math.round(b.y), id: idCounter++ },
                });
            }
        }

        // Guarantee at least one pair if sampling was unlucky. Relax the separation
        // and distance constraints, but still require valid (in-side, off-axis) points.
        if (pairs.length === 0) {
            const m = CONSTANTS.EDGE_MARGIN, span = CONSTANTS.CANVAS_SIZE - 2 * m;
            const anyValid = () => {
                for (let t = 0; t < 4000; t++) {
                    const x = Math.round(m + rng() * span), y = Math.round(m + rng() * span);
                    if (this._sideOf(x, y, symmetry) >= 0) return { x, y };
                }
                return null;
            };
            const a = anyValid(), b = anyValid();
            if (a && b) {
                pairs.push({
                    colorIndex: 0,
                    a: { x: Math.round(a.x), y: Math.round(a.y), id: idCounter++ },
                    b: { x: Math.round(b.x), y: Math.round(b.y), id: idCounter++ },
                });
            }
        }
        return pairs;
    }

    _placeZones(pool, rng, pairs) {
        const unlocked = Object.keys(ZONE_TYPES).filter((k) => pool.has(ZONE_TYPES[k].unlock));
        if (unlocked.length === 0) return [];
        const count = Math.floor(rng() * 3); // 0..2
        const zones = [];
        for (let i = 0; i < count; i++) {
            const type = unlocked[Math.floor(rng() * unlocked.length)];
            const r = 70 + rng() * 60;
            const x = r + rng() * (CONSTANTS.CANVAS_SIZE - 2 * r);
            const y = r + rng() * (CONSTANTS.CANVAS_SIZE - 2 * r);
            zones.push({ type, kind: "circle", x: Math.round(x), y: Math.round(y), r: Math.round(r) });
        }
        return zones;
    }

    /** Dev-time contract check; logs but never throws. */
    _validate(puzzle) {
        console.assert(puzzle.pairs.length > 0, "puzzle has no pairs");
        console.assert(puzzle.inkBudget > 0, "puzzle has non-positive ink budget");
        for (const p of puzzle.pairs) {
            console.assert(p.a && p.b, "pair missing an endpoint");
        }
    }
}
