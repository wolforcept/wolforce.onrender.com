'use strict';
/* Neon Pegs, the game: settings, upgrades, peg types, the rules, the game's drawing and saving.
   Loaded by index.html after its own script and uses what that defines (Physics, Effects, Camera, Renderer, Input, Ui, App, fmt, rand, ...). */

/* =====================================================================
   CONFIG
   ===================================================================== */
const W = 360;                              // logical world width (height grows with upgrades)
const PEG_R = 9;
// pegs get slightly smaller the lower they are placed: negligible near the top, up to 15% smaller at a depth of 1500 (about 8 Taller World levels)
const PEG_SHRINK = 0.15, SHRINK_DEPTH = 1500;
const pegRadius = y => PEG_R * (1 - PEG_SHRINK * Math.min(1, Math.pow(Math.max(0, y) / SHRINK_DEPTH, 2)));
const LAUNCH_Y = 38;                        // ball leaves the cannon just below the ceiling
const BUCKET_X = W / 2;
const LAUNCH_SPEED = 3;                     // initial downward speed (px per physics step)
const SWEEP_MS = 3600;                      // time for one full left-right-left sweep
const SWEEP_MARGIN = 26;                    // how close the cannon gets to the walls
const MAX_SPEED = 22;
const BALL_MAX_AGE = 120000;                // ms; only clears a ball that would otherwise bounce around for ever (its haul is lost)
const GRAVITY_SCALE = 0.0004;
const G_STEP = GRAVITY_SCALE * STEP * (1000 / 60);          // speed gravity adds per physics step, in Matter's setVelocity units (px per 1/60 s)
const GOLD = '#ffd23a';
const BALL_GLOWS = ['#3d8bff', '#4da3ff', '#19a8ff', '#5b7bff', '#7a4dff', '#8a5bff', '#a56bff', '#b78cff'];   // each ball gets a random bluish or purplish glow
const randGlow = () => BALL_GLOWS[(Math.random() * BALL_GLOWS.length) | 0];
const GRAVPEG_R = 90;                       // how far a gravity peg reaches (px)
const GRAVPEG_PULL = 0.7 * G_STEP;          // strongest pull, right next to the peg: half of normal gravity, so only a nudge
const SAVE_KEY = 'neonpegs.save.v2';

/* =====================================================================
   UPGRADES  (data driven: add an object here and it shows up in the list)
   ===================================================================== */
// Each level adds less height than the one before, but the sum never stops growing (a power below 1 has no asymptote).
// Level 8 still gives the same 1479 as the old linear formula.
const worldHeight = l => Math.round(360 + 191 * Math.pow(l, 0.85));
// Soft limits: asymptote(l) = LIMIT - (LIMIT - START) * RATE^l. Always increasing, never reaching LIMIT, so these can be bought without end.
const soft = (start, limit, rate, l) => limit - (limit - start) * Math.pow(rate, l);
const LAUNCH_SPREAD = 1;                                     // total random launch range, in degrees
const bucketW = l => soft(160, 280, 0.89, l);                // soft limit 280 (keeps 7 buckets plus gaps inside the board)
const bucketValue = l => 1 + l;
const restitution = l => soft(0.5, 0.9, 0.96, l);            // bounce: very slow growth, never reaches 90%
const ballRadius = l => soft(6, 14, 0.93, l);                // soft limit 14
const LAB_FIRST = 10000, LAB_MIN = 50;                       // research lab: ms between ticks at level 1, and the limit it approaches (1/20 s)
const labInterval = l => LAB_MIN + (LAB_FIRST - LAB_MIN) / l; // 10s, 5s, 3.3s ... each level helps less, never below LAB_MIN
const secs = ms => (ms / 1000).toFixed(ms < 1000 ? 2 : 1) + 's';
const RP_PEG = 1;                                            // research points per research-peg hit
const rpPerHit = l => RP_PEG * (1 + l);                      // Research Pegs Value: +RP_PEG per level
const autoInterval = l => 2000 * Math.pow(0.85, l - 1);      // ms between automatic drops
const bucketCount = l => l >= 20 ? 7 : l >= 15 ? 6 : l >= 10 ? 5 : l >= 7 ? 4 : l >= 4 ? 3 : l >= 1 ? 2 : 1;
const BUCKET_GAP = 12;                                       // empty space between neighbouring buckets (a ball falling in the gap is lost)
const midMult = l => 1 + 0.5 * l;                            // value multiplier of the middle bucket
const MONEY_MAX = 5;                                         // base max level of the normal money upgrades
const CAP_STEP = 5;                                          // money upgrade max levels added per Upgrade Limit level
const GOO_COL = '#6bff1f';                                   // acid green
const GOO_MAX = 10;                                          // research levels of Phlegm Goo
const gooChance = l => l <= 0 ? 0 : 0.01 + 0.04 * (1 - Math.pow(0.75, l - 1)) / (1 - Math.pow(0.75, GOO_MAX - 1));   // 1% at level 1, 5% at max level, diminishing steps
const GOLD_CHANCE = 0.05;                                     // chance that a launched ball is a gold ball (once researched)
const goldMult = l => l <= 0 ? 1 : 2 + 0.25 * (l - 1);       // money multiplier of gold balls: x2 at level 1, slowly rising
const gooballPegs = l => 10 + 2 * l;                         // a gooball vanishes after touching this many pegs (Lasting Goo: +2 per level)
const GOO_PEG_MS = 12000;                                    // how long a pegs stays goo-coated
const gooPerHit = l => 1 + l;                                // Phlegm Goo per (non-goo) ball hit on a goo peg (Rich Phlegm: +1 per level)
const DUAL_HITS = 5, DUAL_MULT = 100;                        // dual peg: hits before it vanishes, reward multiplier
const BURST_MS = 8000, BURST_CD = 30000;                     // ball burst: duration, cooldown after it ends
const GHOST_MS = 10000;                                      // ghost balls duration
const GRAV_MS = 10000, GRAV_MULT = 5;                        // heavy gravity: duration, gravity multiplier
const DEAD_MS = 10000, DEAD_REST = 0.02;                     // dead balls: duration, bounciness of every contact while active
const CHAOS_MS = 10000, CHAOS_CD = 30000;                    // chaos balls: duration, cooldown
const GHOST_CD = 30000, GRAV_CD = 30000, DEAD_CD = 30000;   // cooldowns of the temporary goo upgrades, counted after they end (ball burst: BURST_CD)
// repulsion field (evil): pegs that are too close push each other apart for a few seconds, evening out the gaps
const RELAX_COL = '#ff4fd8';
const RELAX_MS = 5000, RELAX_CD = 30000, RELAX_COST = 30;    // duration, cooldown, price in evil
const RELAX_MOVE = 1.2;                                      // fastest a peg moves (px per physics step)
// temporary upgrades, keyed by upgrade id: how long they run (ms) and how long they recharge after they end (cd)
const TEMPS = {
    ball_burst: { ms: BURST_MS, cd: BURST_CD }, ghost_balls: { ms: GHOST_MS, cd: GHOST_CD }, heavy_gravity: { ms: GRAV_MS, cd: GRAV_CD },
    dead_balls: { ms: DEAD_MS, cd: DEAD_CD }, chaos_balls: { ms: CHAOS_MS, cd: CHAOS_CD }, repulsion_field: { ms: RELAX_MS, cd: RELAX_CD },
};
// button state of a temporary upgrade: running, cooling down, or ready (null)
const tmr = s => s.t > 0 ? { active: true, s: Math.ceil(s.t / 1000) } : s.cd > 0 ? { active: false, s: Math.ceil(s.cd / 1000) } : null;
const GOO_BASE_CAP = 100, GOO_CAP_STEP = 50;                 // the most Phlegm Goo you can hold: starts at 100, +50 per Goo Tank level
const gooCap = l => GOO_BASE_CAP + GOO_CAP_STEP * l;
const edgeMult = l => 1 / (1 + 0.1 * l);                     // value multiplier of the outermost buckets

// the shop tabs, which are also the currencies an upgrade's costs can use; card colour per tab
const RES_COL = { money: '#ffffff', research: '#8a5bff', goo: '#6bff1f', evil: '#ff2a3d' };
// where each currency's balance lives in Progress (research points are `rp` inside the code)
const CUR_FIELD = { money: 'money', research: 'rp', goo: 'goo', evil: 'evil' };

/* ---- evil: a 4th resource (red star). While the Evil toggle is on, every peg hit damages the peg and yields evil ---- */
const EVIL_COL = '#ff2a3d';
const EVIL_COST = 1e6;                                       // research points needed to unlock evil
const EVIL_BASE = 0.01;                                      // evil per hit on an undamaged peg; grows towards 1 as the peg gets damaged
const EVIL_KILL = 50;                                        // evil from destroying a peg
const EVIL_DMG = 0.05;                                       // base damage per hit (a peg is destroyed at 1)
const evilDmg = l => EVIL_DMG * (0.1 + 0.9 * Math.pow(0.9778, l));   // Sturdy Pegs: soft limit, damage keeps shrinking but never goes below 10% of the base
const evilRegen = l => 0.02 * (1 + 0.6 * l);                 // damage healed per second while evil is off
const evilYield = l => 1 + 0.25 * l;                         // multiplier on all evil gained

/* ---- bomb balls: a red ball that keeps everything it earns; it pays x10 in a bucket, or explodes when its fuse runs out ---- */
const BOMB_COL = '#ff2a3d';
const BOMB_COST = 40;                                        // evil, fixed price
const BOMB_FUSE = 10000;                                     // ms until it explodes
const BOMB_MULT = 10;                                        // payout multiplier when it lands in a bucket
const BOMB_R = 70;                                           // pegs within this distance break when it explodes
const BOMB_EVIL_BASE = 5, BOMB_EVIL_PEG = 10;                // evil from an explosion: base + per broken peg (times Dark Harvest)

/* ---- electric ball: charges up as it hits pegs, then discharges an arc that jumps from peg to peg ---- */
const ZAP_COL = '#4dd2ff';
const ZAP_COST = 25;                                         // evil, fixed price
const ZAP_HITS = 8;                                          // peg hits for a full charge
const ZAP_R = 60;                                            // how far the arc jumps from one peg to the next
const ZAP_BRANCH = 2;                                        // each tagged peg passes the arc on to this many pegs at most
const ZAP_MAX = 15;                                          // pegs tagged per discharge
const ZAP_DELAY = 70;                                        // ms per jump, so the arc can be seen travelling

/* ---- peg types: placed in edit mode. Each takes a peg slot (except blast pegs) and costs a flat price in money to place.
        unlock = the research upgrade that makes the type available (none: available from the start). ---- */
const START_SLOTS = 3;                                       // peg slots before any Peg Slots upgrade
// alchemy pegs charge from ALCH_MIN to their max value over ALCH_MS (dark yellow -> bright gold); a hit pays the value and empties them
const ALCH_MS = 10000, ALCH_MIN = 1;
const alchMax = l => 100 + 50 * l;                           // Alchemy Pegs Value: +50 max per level
const ALCH_DARK = '#8a6a12', ALCH_BRIGHT = '#ffd23a';
const PEG_KINDS = {
    basic: { name: 'Peg', color: '#ffffff', price: 10, desc: 'Every hit adds more money.' },
    research: { name: 'Research', color: '#8a5bff', price: 150, unlock: 'research_pegs', desc: 'Every hit adds research points.' },
    splitter: { name: 'Splitter', color: '#4da3ff', price: 400, unlock: 'splitter_pegs', desc: 'Splits balls in half.' },
    gravity: { name: 'Gravity', color: '#2effb0', price: 600, unlock: 'gravity_pegs', desc: `Pulls balls towards it.` },
    alchemy: { name: 'Alchemy', color: ALCH_DARK, price: 500, unlock: 'alchemy', desc: `Slowly turns to gold: from ${ALCH_MIN} to ${alchMax(0)} money in ${ALCH_MS / 1000}s. A hit pays it out and starts it over.` },
    dual: { name: 'Blast', color: '#ffd23a', price: 0, slotless: true, desc: `Pays money AND research points at x${DUAL_MULT} for ${DUAL_HITS} hits, then disappears. Bought in the Goo tab; does not take a slot.` },
};

const UPGRADE_BY_ID = {
    bucket_value: {
        tab: 'money',
        name: 'Bucket Value', max: 10 * MONEY_MAX,
        costs: { money: { base: 5, growth: 1.3 } },
        desc: 'Increases the value of the buckets.',
        stat: l => `$${fmt(bucketValue(l))} per catch`
    },
    peg_slots: {
        tab: 'money',
        name: 'Peg Slots', max: 0,
        required: [{ id: 'bucket_value', level: 2 }],
        costs: { money: { base: 5, growth: 1.2 } },
        desc: 'Increase the number of pegs you can have.',
        stat: l => `${START_SLOTS + l} slots`
    },
    peg_value: {
        tab: 'money',
        name: 'Peg Value', max: MONEY_MAX,
        required: [{ id: 'peg_slots', level: 5 }],
        costs: { money: { base: 20, growth: 1.5 } },
        desc: 'Increases the added value of pegs.',
        stat: l => `$${fmt(1 + l)} per hit`
    },
    extra_ball: {
        tab: 'money',
        name: 'Extra Ball', max: MONEY_MAX,
        required: [{ id: "peg_value", level: 2 }],
        costs: { money: { base: 50, growth: 2.4 } },
        desc: 'Allows one more ball in play at the same time.',
        stat: l => `${1 + l} ball${l ? 's' : ''} at once`
    },
    peg_power: {
        tab: 'money',
        name: 'Peg Power', max: MONEY_MAX,
        required: [{ id: 'peg_slots', level: 10 }],
        costs: { money: { base: 120, growth: 1.8 } },
        desc: 'Multiplies the value of every peg hit.',
        stat: l => `x${(1 + 0.5 * l).toFixed(1)}`
    },
    wide_bucket: {
        tab: 'money',
        name: 'Wide Bucket', max: MONEY_MAX,
        required: [{ id: 'bucket_value', level: 8 }],
        costs: { money: { base: 120, growth: 1.9 } },
        desc: 'A wider bucket is easier to hit (with more buckets, the whole row gets wider).',
        stat: l => `${Math.round(bucketW(l))} wide`
    },
    research_lab: {
        tab: 'money',
        name: 'Research Lab', max: MONEY_MAX,
        required: [
            { id: 'extra_ball' },
            { id: 'wide_bucket' },
            { id: 'peg_power' },
        ],
        costs: { money: { base: 1000, growth: 1.7 } },
        desc: 'Unlocks research points (hexagons). The lab gives research points on a timer; every level makes it tick faster, with diminishing returns.',
        stat: l => l ? `1 tick every ${secs(labInterval(l))}` : 'no research'
    },
    research_batch: {
        tab: 'money',
        name: 'Research Batch', max: MONEY_MAX,
        required: [{ id: 'research_lab', level: 3 }],
        costs: { money: { base: 25000, growth: 3 } },
        desc: 'Every tick of the Research Lab gives more research points.',
        stat: l => `${1 + l} RP per tick`
    },
    research_pegs_value: {
        tab: 'money',
        name: 'Research Pegs Value', max: MONEY_MAX,
        required: [{ id: 'research_pegs' }],
        costs: { money: { base: 3000, growth: 1.9 } },
        desc: 'Research Peg\'s hits are worth more.',
        stat: l => `${fmt(rpPerHit(l))} RP per hit`
    },
    /* ---- unlocked by research: the research only unlocks them (or switches its feature on), the levels here are the effect ---- */
    combo_chain: {
        tab: 'money',
        name: 'Combo Chain', max: MONEY_MAX,
        required: [{ id: 'combo_theory' }],
        costs: { money: { base: 400, growth: 1.7 } },
        desc: 'Each consecutive peg hit by the same ball is worth more.',
        stat: l => `+${5 * l}% per hit in a row`
    },
    golden_pegs: {
        tab: 'money',
        name: 'Golden Pegs', max: MONEY_MAX,
        required: [{ id: 'alchemy' }],
        costs: { money: { base: 900, growth: 2.0 } },
        desc: 'Hits can turn golden and pay x5.',
        stat: l => `${4 * l}% chance`
    },
    alchemy_pegs_value: {
        tab: 'money',
        name: 'Alchemy Pegs Value', max: MONEY_MAX,
        required: [{ id: 'alchemy' }],
        costs: { money: { base: 2500, growth: 1.9 } },
        desc: 'Alchemy pegs charge up to a higher value (same minimum, same time to charge).',
        stat: l => `up to $${fmt(alchMax(l))} per hit`
    },
    bouncy_balls: {
        tab: 'money',
        required: [{ id: 'elastic_balls' }], name: 'Bouncy Balls', max: 0,
        costs: { money: { base: 1200, growth: 1.9 } },
        desc: 'Balls keep more energy when they bounce. Can be bought without end, but the gains keep shrinking and never quite reach 90%.',
        stat: l => `${(restitution(l) * 100).toFixed(1)}% bounce`
    },
    fat_balls: {
        tab: 'money',
        required: [{ id: 'ball_inflation' }], name: 'Fat Balls', max: MONEY_MAX,
        costs: { money: { base: 2000, growth: 1.9 } },
        desc: 'Bigger balls are harder to miss with.',
        stat: l => `radius ${ballRadius(l).toFixed(1)} (max 14)`
    },
    deeper_world: {
        tab: 'money',
        required: [{ id: 'world_size' }], name: 'Deeper World', max: 0,
        costs: { money: { base: 2000, growth: 1.8 } },
        desc: 'Makes the board taller still: more room below the launcher for pegs. Every level adds a little less height than the last, but there is no limit.',
        stat: l => `${worldHeight(l)} tall`
    },
    faster_dropper: {
        tab: 'money',
        required: [{ id: 'auto_dropper' }], name: 'Faster Dropper', max: 13,
        costs: { money: { base: 1000, growth: 1.6 } },
        desc: 'The Auto Dropper drops balls faster.',
        stat: l => `1 ball every ${(autoInterval(1 + l) / 1000).toFixed(2)}s`
    },
    extra_buckets: {
        tab: 'money',
        required: [{ id: 'more_buckets' }], name: 'Extra Buckets', max: 0,
        costs: { money: { base: 3000, growth: 1.25 } },
        desc: 'More buckets at the bottom: 2 at level 1, 3 at level 4, then 4, 5, 6 and 7 (at levels 7, 10, 15 and 20). The middle ones pay more and the outer ones less, and every level widens the gap. Balls that fall between buckets are lost.',
        stat: l => `${bucketCount(l)} bucket${bucketCount(l) > 1 ? 's' : ''}, middle x${midMult(l).toFixed(1)}, edges x${edgeMult(l).toFixed(2)}`
    },
    gold_ball_value: {
        tab: 'money',
        required: [{ id: 'gold_balls' }], name: 'Gold Ball Value', max: 11,
        costs: { money: { base: 5000, growth: 1.5 } },
        desc: 'Gold balls multiply the money they earn even more.',
        stat: l => `x${goldMult(1 + l).toFixed(2)} money`
    },
    more_gooballs: {
        tab: 'money',
        required: [{ id: 'phlegm_goo' }], name: 'More Gooballs', max: GOO_MAX - 1,
        costs: { money: { base: 20000, growth: 1.6 } },
        desc: 'More of the launched balls are gooballs, with diminishing returns.',
        stat: l => `${(gooChance(1 + l) * 100).toFixed(1)}% gooball chance`
    },
    lasting_goo: {
        tab: 'money',
        required: [{ id: 'phlegm_goo' }], name: 'Lasting Goo', max: 0,
        costs: { money: { base: 50000, growth: 4 } },
        desc: 'Gooballs touch more pegs before they burn out, so they coat more pegs.',
        stat: l => `${gooballPegs(l)} pegs per gooball`
    },
    rich_phlegm: {
        tab: 'money',
        name: 'Rich Phlegm', max: 0,
        required: [{ id: 'phlegm_goo' }],
        costs: { money: { base: 100000, growth: 5 } },
        desc: 'Every hit on a goo-coated peg produces more Phlegm Goo.',
        stat: l => `${gooPerHit(l)} goo per hit`
    },
    higher_limit: {   // uncapped: its own maximum is not raised by Upgrade Limit (otherwise every level would raise it further)
        tab: 'money',
        required: [{ id: 'upgrade_limit' }], uncapped: true, name: 'Higher Limit', max: 15,
        costs: { money: { base: 50000, growth: 3.7 } },
        desc: `Raises the maximum level of every money upgrade that has one by another ${CAP_STEP}.`,
        stat: l => `money upgrades +${CAP_STEP * l} levels`
    },

    //
    // RESEARCH TAB
    // these cost research points
    // are bought once, and get steeply pricier down the list
    //

    research_pegs: {
        tab: 'research',
        required: [{ id: 'research_lab' }], name: 'Research Pegs', max: 1,
        costs: { research: { base: 100 } },
        desc: `Unlocks hexagonal research pegs in edit mode. Balls that hit them earn research points (+${RP_PEG} RP per hit) instead of money.`,
        stat: () => 'research pegs in edit mode'
    },
    auto_dropper: {
        tab: 'research',
        required: [{ id: 'research_lab' }], name: 'Auto Dropper', max: 1,
        costs: { research: { base: 1000 } },
        desc: 'Balls drop on their own (still limited by your max balls). Unlocks Faster Dropper in the Money tab.',
        stat: () => `1 ball every ${(autoInterval(1) / 1000).toFixed(2)}s · unlocks Faster Dropper`
    },
    world_size: {
        tab: 'research',
        required: [{ id: 'research_lab' }], name: 'World Size', max: 1,
        costs: { research: { base: 3000 } },
        desc: 'Unlocks Deeper World in the Money tab, which makes the board taller: more room below the launcher for pegs.',
        stat: () => 'unlocks Deeper World'
    },
    upgrade_limit: {
        tab: 'research',
        required: [{ id: 'research_lab' }], name: 'Upgrade Limit', max: 1,
        costs: { research: { base: 5555 } },
        desc: `Unlocks Higher Limit in the Money tab, which raises the maximum level of every money upgrade that has one by ${CAP_STEP} per level.`,
        stat: () => 'unlocks Higher Limit'
    },
    combo_theory: {
        tab: 'research',
        required: [{ id: 'research_lab' }], name: 'Combo Theory', max: 1,
        costs: { research: { base: 11000 } },
        desc: 'Unlocks Combo Chain in the Money tab: each consecutive peg hit by the same ball is worth more.',
        stat: () => 'unlocks Combo Chain'
    },
    alchemy: {
        tab: 'research',
        required: [{ id: 'research_lab' }], name: 'Alchemy', max: 1,
        costs: { research: { base: 120 } },
        desc: `Alchemy pegs slowly turn to gold.`,
        stat: () => 'alchemy pegs in edit mode'
    },
    elastic_balls: {
        tab: 'research',
        required: [{ id: 'research_lab' }], name: 'Elastic Balls', max: 1,
        costs: { research: { base: 180 } },
        desc: 'Unlocks Bouncy Balls in the Money tab: balls keep more energy when they bounce.',
        stat: () => 'unlocks Bouncy Balls'
    },
    ball_inflation: {
        tab: 'research',
        required: [{ id: 'research_lab' }], name: 'Ball Inflation', max: 1,
        costs: { research: { base: 240 } },
        desc: 'Unlocks Fat Balls in the Money tab: bigger balls are harder to miss with.',
        stat: () => 'unlocks Fat Balls'
    },
    splitter_pegs: {
        tab: 'research',
        required: [{ id: 'research_pegs' }], name: 'Splitter Pegs', max: 1,
        costs: { research: { base: 360 } },
        desc: 'Unlocks blue splitter pegs in edit mode. A ball that hits one splits in two half-size balls, each counting as half a ball for your ball limit. Half-size balls cannot be split again.',
        stat: () => 'splitter pegs in edit mode'
    },
    gravity_pegs: {
        tab: 'research',
        required: [{ id: 'splitter_pegs' }], name: 'Gravity Pegs', max: 1,
        costs: { research: { base: 1060 } },
        desc: `Unlocks teal gravity pegs in edit mode. Balls passing within ${GRAVPEG_R}px of one get pulled gently towards it (the closer, the stronger), bending their path. It also pays money like a plain peg.`,
        stat: () => 'gravity pegs in edit mode'
    },
    gold_balls: {
        tab: 'research',
        required: [{ id: 'research_lab' }, { id: 'golden_pegs' }], name: 'Gold Balls', max: 1,
        costs: { research: { base: 3000 } },
        desc: `${GOLD_CHANCE * 100}% of launched balls are gold, and all the money a gold ball earns (pegs and buckets) is multiplied. Unlocks Gold Ball Value in the Money tab.`,
        stat: () => `x${goldMult(1).toFixed(2)} money · unlocks Gold Ball Value`
    },
    more_buckets: {
        tab: 'research',
        required: [{ id: 'research_lab' }], name: 'More Buckets', max: 1,
        costs: { research: { base: 2600 } },
        desc: 'Unlocks Extra Buckets in the Money tab, which splits the bottom into more buckets: the middle ones pay more, the outer ones less. Balls that fall between buckets are lost.',
        stat: () => 'unlocks Extra Buckets'
    },
    phlegm_goo: {
        tab: 'research',
        required: [{ id: 'research_lab' }], name: 'Phlegm Goo', max: 1,
        costs: { research: { base: 10000 } },
        desc: 'Unlocks Phlegm Goo and the Goo tab. Some balls become gooballs (they vanish after touching a few pegs): pegs they hit turn into goo pegs for a while, and any other ball hitting a goo peg produces Phlegm Goo. Unlocks More Gooballs, Lasting Goo and Rich Phlegm in the Money tab.',
        stat: () => `${(gooChance(1) * 100).toFixed(1)}% gooball chance · unlocks More Gooballs`
    },

    evil: {
        tab: 'research',
        required: [{ id: 'phlegm_goo' }], name: 'Evil',  max: 1,
        costs: { research: { base: EVIL_COST } },
        desc: 'Unlocks the Evil toggle, the Evil resource (red star) and a new Evil tab. While Evil is on, every peg that is hit takes damage, turns redder and yields Evil. Destroyed pegs must be placed again. Pegs heal while Evil is off.',
        stat: () => 'the Evil toggle and the Evil tab'
    },

    //
    // GOO TAB
    // temporary upgrades, paid in Phlegm Goo, fixed price
    //
    goo_tank: {
        required: [{ id: 'phlegm_goo' }], name: 'Goo Tank', tab: 'goo', max: 0,
        costs: { goo: { fn: l => gooCap(l) } },
        desc: `Raises the most Phlegm Goo you can hold by ${GOO_CAP_STEP}. It always costs a full tank: as much goo as your current limit.`,
        stat: l => `holds up to ${gooCap(l)} goo`
    },
    blast_pegs: {
        required: [{ id: 'phlegm_goo' }], temp: true, name: 'Blast Pegs', tab: 'goo', max: 0,
        costs: { goo: { base: 20 } },
        desc: `Adds a temporary blast peg to place in edit mode (it does not take a peg slot). Every hit pays money AND research points at x${DUAL_MULT}. It disappears after ${DUAL_HITS} hits.`,
        status: p => `${p.dualReady.length} ready`,
        stat: () => `x${DUAL_MULT} money and RP, ${DUAL_HITS} hits`,
        onBuy: p => { p.dualReady.push(DUAL_HITS); }
    },
    ghost_balls: {
        required: [{ id: 'phlegm_goo' }], temp: true, name: 'Ghost Balls', tab: 'goo', max: 0,
        costs: { goo: { base: 200 } },
        desc: `For ${GHOST_MS / 1000} seconds every ball passes through pegs, but still hits them and earns the rewards. Then it needs ${GHOST_CD / 1000} seconds to recharge.`,
        stat: () => `non-solid balls for ${GHOST_MS / 1000}s`
    },
    heavy_gravity: {
        required: [{ id: 'phlegm_goo' }], temp: true, name: 'Heavy Gravity', tab: 'goo', max: 0,
        costs: { goo: { base: 250 } },
        desc: `For ${GRAV_MS / 1000} seconds gravity is ${GRAV_MULT}x stronger: balls fall much faster. Then it needs ${GRAV_CD / 1000} seconds to recharge.`,
        stat: () => `${GRAV_MULT}x gravity for ${GRAV_MS / 1000}s`
    },
    dead_balls: {
        required: [{ id: 'phlegm_goo' }], temp: true, name: 'Dead Balls', tab: 'goo', max: 0,
        costs: { goo: { base: 300 } },
        desc: `For ${DEAD_MS / 1000} seconds balls lose almost all their bounce: pegs, walls and buckets just stop them. Then it needs ${DEAD_CD / 1000} seconds to recharge.`,
        stat: () => `almost no bounce for ${DEAD_MS / 1000}s`
    },
    chaos_balls: {
        required: [{ id: 'phlegm_goo' }], temp: true, name: 'Chaos Balls', tab: 'goo', max: 0,
        costs: { goo: { base: 333 } },
        desc: `For ${CHAOS_MS / 1000} seconds balls ignore the laws of physics when they bounce: every impact sends them off in a strange, random direction and speed. Then it needs ${CHAOS_CD / 1000} seconds to recharge.`,
        stat: () => `random bounces for ${CHAOS_MS / 1000}s`
    },
    ball_burst: {
        required: [{ id: 'phlegm_goo' }], temp: true, name: 'Ball Burst', tab: 'goo', max: 0,
        costs: { goo: { base: 700 } },
        desc: `For ${BURST_MS / 1000} seconds you can have 10x as many balls in play. Then it needs ${BURST_CD / 1000} seconds to recharge.`,
        stat: () => `x10 ball limit for ${BURST_MS / 1000}s`
    },

    /* ---- evil tab: paid in Evil (red star) ---- */
    sturdy_pegs: {
        required: [{ id: 'evil' }], name: 'Sturdy Pegs', tab: 'evil', max: 0,
        costs: { evil: { base: 25, growth: 1.6 } },
        desc: 'Pegs take less damage from each hit while Evil is on, so they last longer. Can be bought without end, but each level helps less and damage never drops below 10% of the original.',
        stat: l => `${(evilDmg(l) * 100).toFixed(2)}% damage per hit (${Math.round(evilDmg(l) / EVIL_DMG * 100)}% of base)`
    },
    fast_healing: {
        required: [{ id: 'evil' }], name: 'Fast Healing', tab: 'evil', max: 10,
        costs: { evil: { base: 25, growth: 1.6 } },
        desc: 'Damaged pegs heal faster while Evil is off.',
        stat: l => `${(evilRegen(l) * 100).toFixed(1)}% healed per second`
    },
    dark_harvest: {
        required: [{ id: 'evil' }], name: 'Dark Harvest', tab: 'evil', max: 10,
        costs: { evil: { base: 50, growth: 1.7 } },
        desc: 'Every hit and every destroyed peg yields more Evil.',
        stat: l => `x${evilYield(l).toFixed(2)} Evil`
    },
    bomb_balls: {
        required: [{ id: 'evil' }], temp: true, danger: true, watch: true, name: 'Bomb Balls', tab: 'evil', max: 0,
        costs: { evil: { base: BOMB_COST } },
        desc: `Fires a red bomb ball (it does not count towards your ball limit). If it lands in a bucket it pays out x${BOMB_MULT} of everything it collected. If its ${BOMB_FUSE / 1000}s fuse runs out first, or it is lost, it explodes: the loot is gone, pegs nearby break and must be placed again, and you get Evil instead.`,
        status: () => 'one at a time',
        stat: () => `${BOMB_FUSE / 1000}s fuse, x${BOMB_MULT} payout in a bucket`,
        onBuy: (p, game) => game.launchBomb()
    },
    repulsion_field: {
        required: [{ id: 'evil' }], temp: true, danger: true, watch: true, name: 'Repulsion Field', tab: 'evil', max: 0,
        costs: { evil: { base: RELAX_COST } },
        desc: `For ${RELAX_MS / 1000} seconds every peg pushes away the pegs that are too close to it (the walls push back too), so crowded spots spread out and the gaps between pegs even out. Pegs keep their new places. Then it needs ${RELAX_CD / 1000} seconds to recharge.`,
        stat: () => `${RELAX_MS / 1000}s of spreading out`
    },
    electric_ball: {
        required: [{ id: 'evil' }], temp: true, watch: true, act: ZAP_COL, name: 'Electric Ball', tab: 'evil', max: 0,
        costs: { evil: { base: ZAP_COST } },
        desc: `Fires an electric ball (it does not count towards your ball limit). Every peg it hits charges it up. After ${ZAP_HITS} hits it discharges: an arc jumps from that peg to the pegs nearby, and from those to more pegs, up to ${ZAP_MAX}. Every peg the arc touches counts as hit by the ball, and the electric ball collects the rewards. Then it charges up again.`,
        status: () => 'one at a time',
        stat: () => `discharges every ${ZAP_HITS} hits, up to ${ZAP_MAX} pegs`,
        onBuy: (p, game) => game.launchZap()
    },
};

// the key is the upgrade's id; ids are shared by all tabs, so `required` can point anywhere (mistakes are reported in the console)
// required: [{ id, level }]: that upgrade's own level must be at least `level` (1 when left out)
for (const id in UPGRADE_BY_ID) UPGRADE_BY_ID[id].id = id;
const UPGRADES = Object.values(UPGRADE_BY_ID);   // in shop order
for (const u of UPGRADES) for (const r of u.required || []) if (!UPGRADE_BY_ID[r.id]) console.error(`Upgrade "${u.id}" requires "${r.id}", which does not exist`);
// tab: 'money' | 'research' | 'goo' | 'evil' (required). costs: { currency: { base, growth = 1, minLevel = 0 } } or { currency: { fn: level => price } }:
// that currency is charged from minLevel on, base * growth^(level - minLevel); buying takes every currency listed
for (const u of UPGRADES) {
    if (!RES_COL[u.tab]) console.error(`Upgrade "${u.id}" has no valid tab (got "${u.tab}")`);
    const curs = Object.keys(u.costs || {});
    if (!curs.length) console.error(`Upgrade "${u.id}" has no costs`);
    for (const c of curs) if (!CUR_FIELD[c]) console.error(`Upgrade "${u.id}" costs an unknown currency "${c}"`);
}

/* =====================================================================
   HELPERS
   ===================================================================== */
// evil comes in small amounts (0.01 per hit), so show two decimals until it gets big
const evFmt = n => n < 100 ? n.toFixed(2) : fmt(n);

/* =====================================================================
   PROGRESS: currencies, upgrade levels and prices
   ===================================================================== */
class Progress {
    constructor() {
        this.money = 0; this.rp = 0; this.goo = 0; this.evil = 0;   // the balances: this[CUR_FIELD[currency]]
        this.dualReady = [];                 // blast pegs bought but not placed yet (hits left on each)
        this.freePegs = { basic: 0, research: 0, splitter: 0, gravity: 0, alchemy: 0 };   // pegs that can be placed without paying (broken ones come back here)
        this.levels = {};
        for (const u of UPGRADES) this.levels[u.id] = 0;
    }
    L(id) { return this.levels[id] | 0; }
    slots() { return START_SLOTS + this.L('peg_slots'); }
    unlocked(type) { const k = PEG_KINDS[type]; return !k.unlock || this.L(k.unlock) > 0; }
    gain(v) { this.money += v; }
    gooCap() { return gooCap(this.L('goo_tank')); }
    addGoo(n) { this.goo = Math.min(this.gooCap(), this.goo + n); }

    // { currency: amount } for buying level l + 1; a currency is only charged from its minLevel on
    price(u, l = this.L(u.id)) {
        const out = {};
        for (const [cur, c] of Object.entries(u.costs)) {
            const from = c.minLevel || 0;
            if (l < from) continue;
            const amount = c.fn ? c.fn(l) : Math.ceil(c.base * Math.pow(c.growth ?? 1, l - from));
            if (amount > 0) out[cur] = amount;
        }
        return out;
    }
    canAfford(u) { return Object.entries(this.price(u)).every(([cur, a]) => this[CUR_FIELD[cur]] >= a); }
    pay(u) { for (const [cur, a] of Object.entries(this.price(u))) this[CUR_FIELD[cur]] -= a; }    // buyable once every required upgrade has its level (anything already owned stays unlocked)
    missing(u) { return (u.required || []).filter(r => this.L(r.id) < (r.level || 1)); }
    isUnlocked(u) { return this.L(u.id) > 0 || !this.missing(u).length; }
    // names only the missing requirements that are discovered themselves (a still-locked one would just be another '???')
    lockReason(u) {
        const known = this.missing(u).filter(r => this.isUnlocked(UPGRADE_BY_ID[r.id]));
        return known.length ? 'Requires: ' + known.map(r => UPGRADE_BY_ID[r.id].name + ((r.level || 1) > 1 ? ` Lv ${r.level}` : '')).join(', ') : '';
    }
    // money upgrades with a max level get +CAP_STEP per Upgrade Limit level (research + Higher Limit), except the uncapped ones
    maxOf(u) { return u.max > 0 && u.tab === 'money' && !u.uncapped ? u.max + CAP_STEP * this.L('higher_limit') : u.max; }
    isMaxed(u) { const m = this.maxOf(u); return m > 0 && this.L(u.id) >= m; }
}

/* =====================================================================
   TEMPORARY UPGRADES (goo ones and the repulsion field): ms left running (t) and recharging (cd)
   ===================================================================== */
class TempEffects {
    constructor() {
        this.s = {};
        for (const id in TEMPS) this.s[id] = { t: 0, cd: 0 };
    }
    running(id) { return this.s[id].t > 0; }
    start(id) { this.s[id].t = TEMPS[id].ms; }
    timer(id) { return TEMPS[id] ? tmr(this.s[id]) : null; }   // { active, s } while running or cooling down; null for other upgrades
    tick(dt) {                               // run, then recharge
        for (const id in this.s) {
            const s = this.s[id];
            if (s.t > 0) { s.t -= dt; if (s.t <= 0) { s.t = 0; s.cd = TEMPS[id].cd; } }
            else if (s.cd > 0) s.cd = Math.max(0, s.cd - dt);
        }
    }
    toSave() { return Object.fromEntries(Object.keys(this.s).map(id => [id, [this.s[id].t, this.s[id].cd]])); }
    // no balls survive a reload, so an effect that was still running is not resumed: its time left plus the full cooldown is owed instead
    load(timers) {
        for (const id in this.s) {
            const t = timers[id];
            if (!Array.isArray(t)) continue;
            const run = Number.isFinite(t[0]) ? Math.max(0, t[0]) : 0, left = Number.isFinite(t[1]) ? Math.max(0, t[1]) : 0;
            this.s[id].cd = Math.min(run > 0 ? run + TEMPS[id].cd : left, 600000);
        }
    }
}

/* =====================================================================
   PEGS: the placed pegs, how many of each type, and a grid to find the ones near a ball
   ===================================================================== */
const CELL = 32;                             // grid cell size; pegs never move, so the grid is only rebuilt when pegs change
const cellKey = (cx, cy) => cy * 64 + cx + 8;

class PegBoard {
    constructor(physics, progress) {
        this.physics = physics;
        this.progress = progress;
        this.list = [];
        this.placed = {};                    // placed pegs per type
        this.gravity = [];                   // the gravity pegs, so the physics step does not scan every peg for them
        this.grid = null;                    // Map: cell key -> pegs; null = rebuild on next use
    }

    // paid: money paid to place it (refunded when picked up); free: placed from the free pegs (goes back there instead)
    add(x, y, type = 'basic', left = 0, dmg = 0, paid = 0, free = false) {
        const r = pegRadius(y);
        const body = this.physics.addPeg(x, y, r, type === 'research');
        const peg = { x, y, r, type, body, flash: 0, color: PEG_KINDS[type].color, gooT: 0, left, dead: false, dmg, gone: false, evilKill: false, paid, free, charge: 0 };
        body.peg = peg;
        this.list.push(peg);
        this.placed[type] = this.placedOf(type) + 1;
        if (type === 'gravity') this.gravity.push(peg);
        this.grid = null;
        return peg;
    }
    remove(peg) {
        const i = this.list.indexOf(peg);
        if (i < 0) return;
        this.physics.remove(peg.body);
        this.list.splice(i, 1);
        this.placed[peg.type]--;
        if (peg.type === 'gravity') this.gravity.splice(this.gravity.indexOf(peg), 1);
        this.grid = null;
    }

    placedOf(t) { return this.placed[t] | 0; }
    used() { return this.list.length - this.placedOf('dual'); }   // pegs taking a slot (blast pegs do not)
    at(x, y) { return this.list.find(p => Math.hypot(x - p.x, y - p.y) < p.r + 8); }   // the peg under a tap, if any
    move(peg, x, y) {
        peg.x = x; peg.y = y;
        this.physics.movePeg(peg.body, x, y);
        this.grid = null;
    }

    near(x0, y0, x1, y1, out) {
        if (!this.grid) {
            this.grid = new Map();
            for (const p of this.list) {
                const k = cellKey(Math.floor(p.x / CELL), Math.floor(p.y / CELL));
                const a = this.grid.get(k);
                if (a) a.push(p); else this.grid.set(k, [p]);
            }
        }
        out.length = 0;
        const m = PEG_R + 2;                 // a peg is filed under its centre, so widen the search by a peg radius
        const cx0 = Math.floor((x0 - m) / CELL), cx1 = Math.floor((x1 + m) / CELL);
        const cy0 = Math.floor((y0 - m) / CELL), cy1 = Math.floor((y1 + m) / CELL);
        for (let cy = cy0; cy <= cy1; cy++) for (let cx = cx0; cx <= cx1; cx++) {
            const a = this.grid.get(cellKey(cx, cy));
            if (a) for (const p of a) out.push(p);
        }
        return out;
    }

    // average distance from a peg to its nearest neighbour (counted as `far` when none is that close)
    spacing(far) {
        if (this.list.length < 2) return far;
        const near = [];
        let sum = 0;
        for (const p of this.list) {
            let best = far;
            for (const q of this.near(p.x - far, p.y - far, p.x + far, p.y + far, near)) if (q !== p) best = Math.min(best, Math.hypot(q.x - p.x, q.y - p.y));
            sum += best;
        }
        return sum / this.list.length;
    }

    /* One step of repulsion relaxation: every pair of pegs closer than d0 pushes apart (harder the closer they are),
       and the edges of box push back like a peg would, so pegs spread inside the board instead of piling up at its edges.
       ease (0..1) scales the movement down as the effect ends. links collects the pushing pairs (for drawing). */
    relaxStep(d0, ease, box, links) {
        const list = this.list, near = [], half = d0 / 2;
        links.length = 0;
        list.forEach((p, i) => { p.i = i; p.fx = 0; p.fy = 0; });
        for (const p of list) {
            if (p.dead) continue;
            for (const q of this.near(p.x - d0, p.y - d0, p.x + d0, p.y + d0, near)) {
                if (q.i <= p.i || q.dead) continue;      // each pair once
                let dx = q.x - p.x, dy = q.y - p.y, d = Math.hypot(dx, dy);
                if (d >= d0) continue;
                if (d < 0.01) { dx = rand(-1, 1); dy = rand(-1, 1); d = Math.hypot(dx, dy) || 1; }   // right on top of each other: any direction
                const push = 1 - d / d0, ux = dx / d * push, uy = dy / d * push;
                p.fx -= ux; p.fy -= uy; q.fx += ux; q.fy += uy;
                if (links.length < 1200) links.push(p, q);
            }
        }
        const wall = gap => Math.max(0, 1 - gap / half);
        for (const p of list) {
            if (p.dead) continue;
            p.fx += wall(p.x - box.x0) - wall(box.x1 - p.x);
            p.fy += wall(p.y - box.y0) - wall(box.y1 - p.y);
            const f = Math.hypot(p.fx, p.fy);
            if (f < 1e-4) continue;
            const m = Math.min(RELAX_MOVE, f * d0 * 0.08) * ease;   // px this step
            p.x = Math.min(W - PEG_R, Math.max(PEG_R, p.x + p.fx / f * m));
            p.y = Math.min(box.yMax, Math.max(PEG_R, p.y + p.fy / f * m));
            this.physics.movePeg(p.body, p.x, p.y);
        }
        this.grid = null;
    }
    // after moving, every peg takes the size that belongs to its new depth
    resettle() { for (const p of this.list) this.resettleOne(p); }
    resettleOne(p) {
        const r = pegRadius(p.y);
        if (Math.abs(r - p.r) < 0.02) return;
        this.physics.resizePeg(p.body, p.type === 'research' ? (r + 1) / (p.r + 1) : r / p.r);
        p.r = r;
        this.grid = null;
    }

    // flashes fade, goo wears off, damage heals (heal = damage healed per second; 0 while evil is on), alchemy pegs charge
    tick(dt, heal) {
        for (const pg of this.list) {
            if (pg.type === 'alchemy' && pg.charge < 1) {
                pg.charge = Math.min(1, pg.charge + dt / ALCH_MS);
                pg.color = mixCol(ALCH_DARK, ALCH_BRIGHT, Math.round(pg.charge * 10) / 10);   // 10 shades, so the sprites stay cached
            }
            if (pg.flash > 0) pg.flash = Math.max(0, pg.flash - dt / 220);
            if (pg.gooT > 0) pg.gooT = Math.max(0, pg.gooT - dt);
            if (heal > 0 && pg.dmg > 0) pg.dmg = Math.max(0, pg.dmg - heal * dt / 1000);
        }
    }
}

/* =====================================================================
   BUCKETS: only drawn; catching is a position check in Game.updateBalls().
   With more buckets the same total width is split into equal buckets; the further from the middle, the lower the multiplier.
   ===================================================================== */
class Buckets {
    constructor(progress) {
        this.progress = progress;
        this.key = '';
        this.cache = null;
        this.flash = [0, 0, 0, 0, 0, 0, 0];
    }
    layout() {
        const p = this.progress, key = p.L('extra_buckets') + ',' + p.L('wide_bucket');
        if (key !== this.key) { this.key = key; this.cache = this.build(); }
        return this.cache;
    }
    build() {
        const p = this.progress, l = p.L('extra_buckets'), n = bucketCount(l), w = bucketW(p.L('wide_bucket')) / n, pitch = w + BUCKET_GAP;
        const span = w * n + BUCKET_GAP * (n - 1), x0 = BUCKET_X - span / 2;
        const cm = (n - 1) / 2, mid = midMult(l), edge = edgeMult(l), out = [];
        const inner = n % 2 === 0 ? 0.5 : 0;                         // with an even count there is no single middle bucket
        for (let i = 0; i < n; i++) {
            const d = Math.abs(i - cm);
            const t = cm > inner ? (d - inner) / (cm - inner) : 0;     // 0 = innermost, 1 = outermost
            out.push({ cx: x0 + w / 2 + pitch * i, w, t, mult: n === 1 ? 1 : Math.pow(mid, 1 - t) * Math.pow(edge, t) });
        }
        return out;
    }
    indexAt(bs, x) {
        for (let i = 0; i < bs.length; i++) if (Math.abs(x - bs[i].cx) < bs[i].w / 2 - 2) return i;
        return -1;
    }
    tick(dt) { for (let i = 0; i < this.flash.length; i++) this.flash[i] = Math.max(0, this.flash[i] - dt / 260); }
}

/* =====================================================================
   GAME: the rules. Launching, peg hits, splitting, catching, and one fixed physics step.
   ===================================================================== */
class Game {
    constructor() {
        this.progress = new Progress();
        this.temps = new TempEffects();
        this.effects = new Effects();
        this.balls = [];
        this.physics = new Physics({
            balls: this.balls,
            pegsNear: (x0, y0, x1, y1, out) => this.pegs.near(x0, y0, x1, y1, out),
            deadBalls: () => this.temps.running('dead_balls'),
        });
        this.pegs = new PegBoard(this.physics, this.progress);
        this.buckets = new Buckets(this.progress);
        this.physics.onCollisionStart(pairs => this.onContacts(pairs));

        this.worldH = worldHeight(0);
        this.evilOn = false;                 // the Evil toggle (not saved: it always starts off)
        this.autoOn = true;                  // auto dropper switch (the AUTO button, shown once Auto Dropper is researched)
        this.simT = 0;
        this.labT = 0;                       // ms since the research lab's last tick
        this.autoT = 0;
        this.recoil = 0;                     // cannon recoil after a shot, 1 -> 0
        this.launchX = W / 2;                // the cannon sweeps left and right along the ceiling
        this.prevLaunchX = this.launchX;     // launchX before the last physics step (for smooth drawing)
        this.pendingRemove = [];             // pegs and splits are handled after the physics step
        this.pendingSplit = [];
        this.uiDirty = false;                // the UI is refreshed on the next frame (never from inside a physics step)
        this.relax = null;                   // repulsion field in progress: { d0: target spacing, links: pushing pairs }
        this.arcs = [];                      // electric arc jumps still to land: { from, to: peg, at: simT, ball }
        this.editing = false;                // edit mode: the game stands still and pegs can be placed, picked up and moved
        const fx = this.effects;
        this.hitFx = { burst: (...a) => fx.burst(...a), float: (x, y, text, color, o = {}) => fx.float(x, y, text, color, { ...o, dim: true }) };
    }

    /* ---------- edit mode ---------- */
    // Entering clears the board of balls (a bomb or electric ball in play is refunded) and freezes everything:
    // App stops calling step(), so timers, cooldowns and passive research points wait too. Returns the evil refunded.
    enterEdit() {
        let refund = 0;
        for (const b of [...this.balls]) {
            if (b.bomb) refund += BOMB_COST;
            if (b.zap) refund += ZAP_COST;
            this.dropBall(b);
        }
        this.progress.evil += refund;
        this.arcs.length = 0;
        this.pendingSplit.length = 0;
        const fx = this.effects;
        fx.particles.length = fx.floaters.length = fx.rings.length = fx.bolts.length = 0;
        fx.shake = 0; fx.flash.a = 0;
        for (const pg of this.pegs.list) pg.flash = 0;   // a hit flash would stay lit while everything is frozen
        this.editing = true;
        this.uiDirty = true;
        return refund;
    }
    exitEdit() {
        this.editing = false;
        this.uiDirty = true;
    }

    // why a peg of this type cannot be placed right now (null when it can)
    cantPlace(type) {
        const p = this.progress, k = PEG_KINDS[type];
        if (!p.unlocked(type)) return `Unlock ${k.name} pegs in Research first`;
        if (type === 'dual') return p.dualReady.length ? null : 'No blast pegs left (Goo tab)';
        if (this.pegs.used() >= p.slots()) return 'Slots full: buy Peg Slots in the Shop';
        if (!p.freePegs[type] && p.money < k.price) return `Need $${fmt(k.price)} for a ${k.name.toLowerCase()} peg`;
        return null;
    }
    // places a peg (free ones first, then paid); returns why it could not, or null
    placePeg(type, x, y) {
        const why = this.cantPlace(type);
        if (why) return why;
        const p = this.progress, s = this.placeSpot(x, y);
        let peg;
        if (type === 'dual') peg = this.pegs.add(s.x, s.y, 'dual', p.dualReady.pop());
        else if (p.freePegs[type] > 0) { p.freePegs[type]--; peg = this.pegs.add(s.x, s.y, type, 0, 0, 0, true); }
        else { p.money -= PEG_KINDS[type].price; peg = this.pegs.add(s.x, s.y, type, 0, 0, PEG_KINDS[type].price); }
        this.effects.burst(peg.x, peg.y, peg.color, 8, { speed: [30, 90] });
        this.uiDirty = true;
        return null;
    }
    // picking a peg up gives back what placing it took: its price, its free placement, or a blast peg with its hits left
    pickUp(peg) {
        const p = this.progress;
        if (peg.type === 'dual') p.dualReady.push(peg.left);
        else if (peg.free) p.freePegs[peg.type]++;
        else p.money += peg.paid;
        this.pegs.remove(peg);
        this.uiDirty = true;
        return peg.type === 'dual' || peg.free ? '' : '$' + fmt(peg.paid);
    }
    // dragging: the peg follows the pointer, and takes the size that belongs to its depth when it is let go
    dragPeg(peg, x, y) { const s = this.placeSpot(x, y); this.pegs.move(peg, s.x, s.y); }
    dropPeg(peg) { this.pegs.resettleOne(peg); }

    L(id) { return this.progress.L(id); }
    // the launcher stays near the top; the bucket is anchored to the floor, because the world grows downward
    rimY() { return this.worldH - 36; }
    catchY() { return this.worldH - 30; }
    maxBalls() { return (1 + this.L('extra_ball')) * (this.temps.running('ball_burst') ? 10 : 1); }
    ballLoad() { return this.balls.reduce((a, b) => a + b.w, 0); }   // half-size balls count 0.5
    goldMul(b) { return b.gold ? goldMult(1 + this.L('gold_ball_value')) : 1; }
    // The world grows downward: the launcher and every peg stay where they are, the floor and bucket move down.
    growWorld() { this.worldH = worldHeight(this.L('deeper_world')); }

    // Pegs can go anywhere. The only thing done is keeping them inside the walls and the floor,
    // so a tap in the dimmed area outside the board lands on the nearest spot inside it.
    placeSpot(x, y) {
        return { x: Math.min(W - PEG_R, Math.max(PEG_R, x)), y: Math.min(this.worldH - PEG_R, Math.max(PEG_R, y)) };
    }

    buy(u) {
        const p = this.progress;
        if (!p.isUnlocked(u) || p.isMaxed(u)) return false;
        if (this.timer(u.id)) return false;            // temporary upgrades can be busy (active / cooling down)
        if (!p.canAfford(u)) return false;
        p.pay(u);
        if (TEMPS[u.id]) this.temps.start(u.id); else if (u.onBuy) u.onBuy(p, this); else p.levels[u.id]++;
        if (u.id === 'world_size' || u.id === 'deeper_world') this.growWorld();
        return true;
    }

    /* The cannon hangs from the ceiling and sweeps left and right all the time. It fires straight down
       from wherever it is. Returns false when every ball slot is taken. */
    launch() {
        if (this.editing || this.ballLoad() + 1 > this.maxBalls()) return false;
        const half = LAUNCH_SPREAD * Math.PI / 180 / 2;
        const th = rand(-half, half);                  // 0 = straight down
        const isGoo = Math.random() < (this.L('phlegm_goo') ? gooChance(1 + this.L('more_gooballs')) : 0);
        const isGold = !isGoo && this.L('gold_balls') > 0 && Math.random() < GOLD_CHANCE;   // a ball is never both
        this.makeBall(this.launchX, LAUNCH_Y, ballRadius(this.L('fat_balls')), LAUNCH_SPEED * Math.sin(th), LAUNCH_SPEED * Math.cos(th), { goo: isGoo, gold: isGold });
        this.recoil = 1;
        this.uiDirty = true;
        return true;
    }

    // button state of a temporary upgrade ({ active, s, text? } or null); the bomb and the electric ball are busy while one is in play
    timer(id) {
        if (id === 'bomb_balls') {
            const b = this.balls.find(b => b.bomb);
            return b ? { active: true, s: Math.max(0, Math.ceil(b.fuse / 1000)) } : null;
        }
        if (id === 'electric_ball') {
            const b = this.balls.find(b => b.zap);
            return b ? { active: true, text: Math.round(b.charge * 100) + '%' } : null;
        }
        return this.temps.timer(id);
    }

    // the electric ball leaves the cannon like the bomb: outside the ball limit and it never splits
    launchZap() {
        const r = Math.max(7, ballRadius(this.L('fat_balls')));
        this.makeBall(this.launchX, LAUNCH_Y, r, 0, LAUNCH_SPEED, { zap: true, w: 0, split: true, charge: 0, glow: ZAP_COL });
        this.recoil = 1;
        this.effects.burst(this.launchX, LAUNCH_Y + 6, ZAP_COL, 14, { speed: [60, 160], angle: [0.3, 2.84] });
        this.uiDirty = true;
    }

    // A bomb ball leaves the cannon like any ball, but outside the ball limit (w: 0) and it never splits.
    launchBomb() {
        const r = Math.max(8, ballRadius(this.L('fat_balls')));
        this.makeBall(this.launchX, LAUNCH_Y, r, 0, LAUNCH_SPEED, {
            bomb: true, w: 0, split: true, fuse: BOMB_FUSE, phase: 0, glow: BOMB_COL,
        });
        this.recoil = 1;
        this.effects.burst(this.launchX, LAUNCH_Y + 6, BOMB_COL, 14, { speed: [60, 160], angle: [0.3, 2.84] });
        this.uiDirty = true;
    }

    // everything a ball earns goes into its haul (ball.stash); the player only gets it when the ball lands in a bucket
    earn(ball, cur, v) { ball.stash[cur] += v; }

    // a ball body plus its game state
    makeBall(x, y, r, vx, vy, props) {
        const body = this.physics.addBall(x, y, r, vx, vy, restitution(this.L('bouncy_balls')));
        const ball = Object.assign({
            body, r, px: x, py: y, hits: 0, age: 0, still: 0, tick: 0, trail: [], lastPeg: null, lastT: 0,
            goo: false, gold: false, gooHits: 0, expired: false, w: 1, split: false, glow: randGlow(), ghost: this.temps.running('ghost_balls'), inPeg: false,
            stash: { money: 0, rp: 0, goo: 0, evil: 0 },   // the haul: paid out in a bucket, lost any other way
        }, props);
        body.ball = ball;
        this.balls.push(ball);
        return ball;
    }
    dropBall(ball) {
        this.physics.remove(ball.body);
        this.balls.splice(this.balls.indexOf(ball), 1);
    }

    onContacts(pairs) {
        for (const pr of pairs) {
            let b = pr.bodyA, o = pr.bodyB;
            if (!b.ball) { b = pr.bodyB; o = pr.bodyA; }
            if (!b.ball) continue;
            if (this.temps.running('chaos_balls') && !pr.isSensor) b.ball.chaos = true;   // randomised right after this physics step (a ghost passing through a peg is no bounce)
            if (o.peg && this.hitPeg(b.ball, o.peg) && b.ball.zap) this.chargeZap(b.ball, o.peg);
        }
    }

    // a ball hits a peg and the peg pays out; arc = tagged by an electric arc (no anti-farming check, no charge)
    // returns false when the hit does not count
    hitPeg(ball, peg, arc = false) {
        const fx = this.hitFx;              // hit numbers are drawn dimmer: they are collected, not yet earned
        if (peg.dead) return false;
        if (!arc) {
            if (ball.lastPeg === peg && this.simT - ball.lastT < 200) return false;   // no farming one peg while resting on it
            ball.lastPeg = peg; ball.lastT = this.simT;
        }
        peg.flash = 1;
        if (ball.goo && ++ball.gooHits >= gooballPegs(this.L('lasting_goo'))) ball.expired = true;   // gooballs burn out after enough pegs

        // evil: while the toggle is on, every hit damages the peg and yields evil (more evil the more damaged the peg is)
        if (this.evilOn) {
            const ey = evilYield(this.L('dark_harvest'));
            const ev = (EVIL_BASE + (1 - EVIL_BASE) * peg.dmg) * ey;
            this.earn(ball, 'evil', ev);
            peg.dmg += evilDmg(this.L('sturdy_pegs'));
            if (ev >= 0.25) fx.float(peg.x - 10, peg.y - 22, '+' + evFmt(ev), EVIL_COL);
            if (peg.dmg >= 1) {                  // too much damage: the peg breaks and must be placed again
                peg.dmg = 1; peg.dead = true; peg.evilKill = true; this.pendingRemove.push(peg);
                const ek = EVIL_KILL * ey;
                this.earn(ball, 'evil', ek);
                fx.burst(peg.x, peg.y, EVIL_COL, 24);
                fx.float(peg.x, peg.y - 34, '+' + evFmt(ek), EVIL_COL, { big: true, life: 1100, always: true });
            }
        }

        // goo: a gooball coats pegs; any other ball that hits a coated peg produces Phlegm Goo
        if (peg.type !== 'dual') {
            if (ball.goo) peg.gooT = GOO_PEG_MS;
            else if (peg.gooT > 0) {
                const goo = gooPerHit(this.L('rich_phlegm'));
                this.earn(ball, 'goo', goo);
                fx.float(peg.x + 10, peg.y - 22, '+' + fmt(goo), GOO_COL);
            }
        }

        if (peg.type === 'splitter' && ball.w === 1 && !ball.split) { ball.split = true; this.pendingSplit.push({ ball, peg }); }

        if (peg.type === 'dual') {
            const v = DUAL_MULT * (1 + this.L('peg_value')) * (1 + 0.5 * this.L('peg_power')) * (1 + 0.05 * this.L('combo_chain') * ball.hits) * this.goldMul(ball);
            ball.hits++;
            this.earn(ball, 'money', v);
            const rp = rpPerHit(this.L('research_pegs_value')) * DUAL_MULT;
            this.earn(ball, 'rp', rp);
            fx.burst(peg.x, peg.y, '#ffd23a', 10);
            fx.float(peg.x, peg.y - 12, '+$' + fmt(v), '#ffd23a', { big: true, life: 900, always: true });
            fx.float(peg.x, peg.y - 28, '+' + fmt(rp) + ' RP', '#8a5bff', { big: true, life: 900, always: true });
            if (--peg.left <= 0) { peg.dead = true; this.pendingRemove.push(peg); }
            return true;
        }

        if (peg.type === 'research') {
            ball.hits++;
            const rp = rpPerHit(this.L('research_pegs_value'));
            this.earn(ball, 'rp', rp);
            fx.burst(peg.x, peg.y, peg.color, 6);
            fx.float(peg.x, peg.y - 12, '+' + fmt(rp) + ' RP', peg.color);
            return true;
        }

        // alchemy pegs pay what they have charged up to (instead of Peg Value), then start over
        const alch = peg.type === 'alchemy', full = alch && peg.charge >= 1;
        const base = alch ? Math.round(ALCH_MIN + (alchMax(this.L('alchemy_pegs_value')) - ALCH_MIN) * peg.charge) : 1 + this.L('peg_value');
        if (alch) { peg.charge = 0; peg.color = ALCH_DARK; }
        let v = base * (1 + 0.5 * this.L('peg_power')) * (1 + 0.05 * this.L('combo_chain') * ball.hits) * this.goldMul(ball);
        ball.hits++;
        const gold = Math.random() < 0.04 * this.L('golden_pegs');
        if (gold) v *= 5;
        this.earn(ball, 'money', v);
        const col = gold || full ? GOLD : alch ? mixCol(ALCH_DARK, ALCH_BRIGHT, 0.6) : peg.color;
        fx.burst(peg.x, peg.y, col, gold || full ? 10 : 5);
        fx.float(peg.x, peg.y - 12, '+' + fmt(v), col, { big: gold || full });
        return true;
    }

    // every real hit charges the electric ball; a full charge discharges from the peg it just hit
    chargeZap(ball, peg) {
        ball.charge = Math.min(1, ball.charge + 1 / ZAP_HITS);
        if (ball.charge < 1) return;
        ball.charge = 0;
        this.discharge(ball, peg);
    }

    /* The arc spreads outward in waves: every tagged peg passes it on to its nearest untagged pegs within ZAP_R
       (at most ZAP_BRANCH each, ZAP_MAX in total). Each wave lands ZAP_DELAY ms after the one before. */
    discharge(ball, src) {
        const fx = this.effects, seen = new Set([src]), near = [], bp = ball.body.position;
        let wave = [src], depth = 0, tagged = 0;
        while (wave.length && tagged < ZAP_MAX) {
            depth++;
            const next = [];
            for (const from of wave) {
                const cands = this.pegs.near(from.x - ZAP_R, from.y - ZAP_R, from.x + ZAP_R, from.y + ZAP_R, near)
                    .filter(q => !seen.has(q) && !q.dead && Math.hypot(q.x - from.x, q.y - from.y) <= ZAP_R)
                    .sort((a, b) => Math.hypot(a.x - from.x, a.y - from.y) - Math.hypot(b.x - from.x, b.y - from.y));
                for (const q of cands.slice(0, ZAP_BRANCH)) {
                    if (tagged >= ZAP_MAX) break;
                    seen.add(q); next.push(q); tagged++;
                    this.arcs.push({ from, to: q, at: this.simT + depth * ZAP_DELAY, ball });
                }
            }
            wave = next;
        }
        fx.bolt(bp.x, bp.y, src.x, src.y, ZAP_COL, 260);
        fx.ring(src.x, src.y, 4, ZAP_R, ZAP_COL, { life: 420, width: 3, fill: true });
        fx.burst(src.x, src.y, '#eaffff', 12, { speed: [80, 220], size: 9, always: true });
        fx.float(src.x, src.y - 22, tagged ? `ZAP x${tagged}` : 'ZAP', ZAP_COL, { big: true, life: 900, always: true });
        fx.screen(ZAP_COL, 0.12, 2);
    }

    // arc jumps that are due land now: lightning, sparks, and a hit just as if the ball had hit the peg
    updateArcs() {
        for (let i = this.arcs.length - 1; i >= 0; i--) {
            const a = this.arcs[i];
            if (a.at > this.simT) continue;
            this.arcs.splice(i, 1);
            if (a.to.dead || !this.pegs.list.includes(a.to)) continue;   // broken or picked up meanwhile
            this.effects.bolt(a.from.x, a.from.y, a.to.x, a.to.y, ZAP_COL);
            this.effects.burst(a.to.x, a.to.y, ZAP_COL, 6, { speed: [60, 180], size: 8 });
            this.hitPeg(a.ball, a.to, true);
        }
    }

    /* A full-size ball that hits a splitter peg becomes two half-size balls (deferred until the physics step is over). */
    splitBall(ball, peg) {
        if (this.balls.indexOf(ball) < 0) return;
        const p = ball.body.position, v = this.physics.velocity(ball.body), r = ball.r / 2;
        const base = Math.atan2(v.y, v.x), sp = Math.max(Math.hypot(v.x, v.y), 3);
        this.dropBall(ball);
        for (const sg of [-1, 1]) {
            const a = base + sg * 0.5;
            this.makeBall(p.x, p.y, r, sp * Math.cos(a), sp * Math.sin(a), {
                hits: ball.hits, age: ball.age, lastPeg: peg, lastT: this.simT, goo: ball.goo, gold: ball.gold, gooHits: ball.gooHits,
                w: 0.5, split: true, glow: ball.glow, ghost: ball.ghost,
                stash: Object.fromEntries(Object.entries(ball.stash).map(([cur, v]) => [cur, v / 2])),   // each half carries half the haul
            });
        }
        this.effects.burst(peg.x, peg.y, peg.color, 8);
        this.uiDirty = true;
    }

    // the ball made it: its haul is paid out as is, plus the bucket's own catch value (bucket and gold multipliers apply to that)
    catchBall(ball, bk, idx) {
        const s = ball.stash, p = this.progress, fx = this.effects, x = ball.body.position.x, y = this.rimY();
        const money = s.money + bucketValue(this.L('bucket_value')) * bk.mult * this.goldMul(ball);
        p.gain(money); p.rp += s.rp; p.addGoo(s.goo); p.evil += s.evil;
        this.buckets.flash[idx] = 1;
        fx.burst(x, y + 4, '#b6ff2e', 10);
        const lines = [['+$' + fmt(money), '#b6ff2e'], s.rp && ['+' + fmt(s.rp) + ' RP', '#8a5bff'],
        s.goo && ['+' + fmt(s.goo) + ' GOO', GOO_COL], s.evil && ['+' + evFmt(s.evil) + ' EVIL', EVIL_COL]].filter(Boolean);
        lines.forEach(([text, col], i) => fx.float(x, y - 8 - 17 * i, text, col, { big: true, life: 1000, always: true }));
        this.dropBall(ball);
    }

    // the ball left play any other way: its haul is gone (a faint red note shows what was lost)
    loseBall(ball) {
        const s = ball.stash, p = ball.body.position;
        const lost = [s.money && '$' + fmt(s.money), s.rp && fmt(s.rp) + ' RP', s.goo && fmt(s.goo) + ' GOO', s.evil && evFmt(s.evil) + ' EVIL'].filter(Boolean);
        if (lost.length) this.effects.float(p.x, Math.min(p.y, this.worldH - 12), '−' + lost.join(' · '), '#ff5a6a', { life: 1000 });
        this.dropBall(ball);
    }

    // the bomb made it: the bucket's own value goes into the stash too, then everything is paid out x10
    cashBomb(ball, bk, idx) {
        const s = ball.stash, p = this.progress, fx = this.effects, x = ball.body.position.x, y = this.rimY(), m = BOMB_MULT;
        s.money += bucketValue(this.L('bucket_value')) * bk.mult;
        p.gain(s.money * m); p.rp += s.rp * m; p.addGoo(s.goo * m); p.evil += s.evil * m;
        this.buckets.flash[idx] = 1;
        fx.ring(x, y, 6, 95, '#ffd23a', { life: 650, width: 6, fill: true });
        fx.ring(x, y, 6, 150, '#ffffff', { life: 900, width: 3 });
        fx.burst(x, y, '#ffd23a', 50, { speed: [140, 380], angle: [Math.PI * 1.12, Math.PI * 1.88], size: 13, life: 950, always: true });
        fx.burst(x, y, '#b6ff2e', 24, { speed: [100, 280], angle: [Math.PI * 1.2, Math.PI * 1.8], size: 10, life: 800, always: true });
        fx.float(x, y - 26, `x${m}!`, '#ffd23a', { huge: true, life: 1400, always: true });
        const lines = [['+$' + fmt(s.money * m), '#ffd23a'], s.rp && ['+' + fmt(s.rp * m) + ' RP', '#8a5bff'],
        s.goo && ['+' + fmt(s.goo * m) + ' GOO', GOO_COL], s.evil && ['+' + evFmt(s.evil * m) + ' EVIL', EVIL_COL]].filter(Boolean);
        lines.forEach(([text, col], i) => fx.float(x, y - 52 - 18 * i, text, col, { big: true, life: 1600, always: true }));
        fx.screen('#ffd23a', 0.25, 4);
        this.dropBall(ball);
    }

    // the fuse ran out (or the bomb was lost): the loot is gone, nearby pegs break, and it pays Evil instead
    explodeBomb(ball) {
        const { x, y } = ball.body.position, fx = this.effects;
        let broken = 0;
        for (const pg of this.pegs.near(x - BOMB_R, y - BOMB_R, x + BOMB_R, y + BOMB_R, [])) {
            if (pg.dead || Math.hypot(pg.x - x, pg.y - y) > BOMB_R + pg.r) continue;
            pg.dead = true; pg.evilKill = true; pg.flash = 1;   // evilKill: a broken blast peg comes back with its hits left
            this.pendingRemove.push(pg);
            broken++;
            fx.burst(pg.x, pg.y, pegCol(pg), 10, { speed: [60, 200], size: 9, always: true });
        }
        const ev = (BOMB_EVIL_BASE + BOMB_EVIL_PEG * broken) * evilYield(this.L('dark_harvest'));
        this.progress.evil += ev;
        fx.ring(x, y, 4, BOMB_R, '#ffd23a', { life: 380, width: 7, fill: true });
        fx.ring(x, y, 4, BOMB_R * 1.35, BOMB_COL, { life: 650, width: 4 });
        fx.burst(x, y, BOMB_COL, 40, { speed: [90, 330], size: 15, life: 750, always: true });
        fx.burst(x, y, '#ff9d1a', 30, { speed: [60, 260], size: 12, life: 620, always: true });
        fx.burst(x, y, '#ffd23a', 16, { speed: [30, 150], size: 17, life: 420, always: true });
        fx.float(x, y - 8, 'BOOM!', '#ff9d1a', { huge: true, life: 1100, always: true });
        fx.float(x, y - 34, '+' + evFmt(ev) + ' EVIL', EVIL_COL, { big: true, life: 1500, always: true });
        if (broken) fx.float(x, y - 52, `${broken} peg${broken > 1 ? 's' : ''} broken`, '#ff9d1a', { life: 1500, always: true });
        fx.screen(BOMB_COL, 0.4, 9);
        this.dropBall(ball);
    }

    // Repulsion field: while it runs, pegs push apart until no two are closer than d0. d0 is set when it starts,
    // a bit above the current average gap to the nearest peg, so crowded spots spread out but the board keeps its density.
    updateRelax() {
        const s = this.temps.s.repulsion_field, pegs = this.pegs, fx = this.effects;
        if (s.t > 0) {
            if (!this.relax) {
                this.relax = { d0: Math.min(70, Math.max(2 * PEG_R + 8, pegs.spacing(80) * 1.25)), links: [] };
                const live = pegs.list.length || 1, cx = pegs.list.reduce((a, p) => a + p.x, 0) / live, cy = pegs.list.reduce((a, p) => a + p.y, 0) / live;
                fx.ring(cx, cy, 10, 260, RELAX_COL, { life: 900, width: 5 });
                fx.ring(cx, cy, 10, 160, RELAX_COL, { life: 700, width: 3, fill: true });
                fx.screen(RELAX_COL, 0.18, 2);
            }
            const box = { x0: PEG_R + 2, x1: W - PEG_R - 2, y0: PEG_R + 2, y1: this.worldH - 50, yMax: this.worldH - PEG_R };
            pegs.relaxStep(this.relax.d0, Math.min(1, s.t / 1500), box, this.relax.links);   // eases out over the last 1.5 s
        } else if (this.relax) {
            pegs.resettle();
            this.relax = null;
            this.uiDirty = true;
        }
    }

    // Gravity pegs: every ball within reach is pulled gently towards the peg's centre; the closer the ball, the stronger the pull.
    applyGravityPegs() {
        const ph = this.physics;
        for (const pg of this.pegs.gravity) {
            if (pg.dead) continue;
            for (const b of this.balls) {
                const p = b.body.position;
                const dx = pg.x - p.x, dy = pg.y - p.y, d = Math.hypot(dx, dy);
                if (d >= GRAVPEG_R || d < 1) continue;
                const f = GRAVPEG_PULL * (1 - d / GRAVPEG_R), v = ph.velocity(b.body);
                ph.setVelocity(b.body, v.x + dx / d * f, v.y + dy / d * f);
            }
        }
    }

    // Chaos Balls: whatever the physics just decided, throw the ball in a random direction at a random speed
    applyChaos() {
        const ph = this.physics;
        for (const b of this.balls) {
            if (!b.chaos) continue;
            b.chaos = false;
            if (!this.temps.running('chaos_balls')) continue;
            const v = ph.velocity(b.body), sp = Math.hypot(v.x, v.y);
            const s = Math.min(MAX_SPEED, Math.max(2.5, sp * rand(0.7, 1.4)));
            const a = rand(0, 6.2832);
            ph.setVelocity(b.body, s * Math.cos(a), s * Math.sin(a));
            this.effects.burst(b.body.position.x, b.body.position.y, '#ff2bd6', 3);
        }
    }

    // speed limit, trails, and every way a ball leaves play: caught, fallen out, too old, stuck, or a burnt-out gooball
    updateBalls(dt) {
        const ph = this.physics, bs = this.buckets.layout();
        for (let i = this.balls.length - 1; i >= 0; i--) {
            const b = this.balls[i], p = b.body.position, v = ph.velocity(b.body);
            const sp = Math.hypot(v.x, v.y);
            if (sp > MAX_SPEED) ph.setVelocity(b.body, v.x / sp * MAX_SPEED, v.y / sp * MAX_SPEED);
            b.age += dt;
            b.still = sp < 0.225 ? b.still + dt : 0;          // 0.225 per 1/60 s = 0.15 px per physics step
            // ghost time is over: turn solid only once clear of pegs, or the physics would shove the ball out violently
            if (b.ghost && !this.temps.running('ghost_balls') && !b.inPeg) b.ghost = false;
            if ((++b.tick & 1) === 0) { b.trail.push(p.x, p.y); if (b.trail.length > 14) b.trail.splice(0, 2); }
            if (b.bomb) {                    // the fuse burns, and the glow pulses faster as it gets short
                b.fuse -= dt;
                b.phase += dt * (0.0126 + 0.038 * (1 - Math.max(0, b.fuse) / BOMB_FUSE));
            }

            // the bucket is not a physics body: a falling ball whose centre passes the bucket mouth inside its width is caught
            const bi = (v.y > 0 && b.age > 250 && p.y >= this.catchY()) ? this.buckets.indexAt(bs, p.x) : -1;
            if (bi >= 0) {
                if (b.bomb) this.cashBomb(b, bs[bi], bi); else this.catchBall(b, bs[bi], bi);
            } else if (p.y > this.worldH + 40 || b.age > BALL_MAX_AGE || b.still > 1500 || b.expired) {
                if (b.bomb) { this.explodeBomb(b); continue; }   // a lost bomb goes off where it is
                if (b.expired) this.effects.burst(p.x, p.y, GOO_COL, 12);
                this.loseBall(b);
            } else if (b.bomb && b.fuse <= 0) {
                this.explodeBomb(b);
            }
        }
    }

    // research lab: every labInterval it gives 1 RP + Research Batch; several ticks in one step when the interval is shorter than a step
    labTick(dt) {
        const l = this.L('research_lab');
        if (!l) return;
        const iv = labInterval(l);
        this.labT += dt;
        if (this.labT < iv) return;
        const n = Math.floor(this.labT / iv);
        this.labT -= n * iv;
        this.progress.rp += n * (1 + this.L('research_batch'));
    }

    step(dt) {
        this.simT += dt;
        this.labTick(dt);
        this.prevLaunchX = this.launchX;
        this.launchX = W / 2 + (W / 2 - SWEEP_MARGIN) * Math.sin(this.simT * Math.PI * 2 / SWEEP_MS);
        this.recoil = Math.max(0, this.recoil - dt / 220);

        this.temps.tick(dt);
        this.updateRelax();
        this.physics.setGravity(this.temps.running('heavy_gravity') ? GRAV_MULT : 1);
        if (this.temps.running('ghost_balls')) for (const b of this.balls) b.ghost = true;

        const al = this.L('auto_dropper') && 1 + this.L('faster_dropper');   // auto dropper: keeps trying until a ball slot is free
        if (al > 0 && this.autoOn) {
            this.autoT = Math.min(this.autoT + dt, autoInterval(al));
            if (this.autoT >= autoInterval(al) && this.launch()) this.autoT = 0;
        }
        for (const b of this.balls) { b.px = b.body.position.x; b.py = b.body.position.y; }
        this.applyGravityPegs();
        this.physics.update(dt);
        this.applyChaos();
        this.updateBalls(dt);
        this.updateArcs();

        while (this.pendingSplit.length) { const s = this.pendingSplit.pop(); this.splitBall(s.ball, s.peg); }
        while (this.pendingRemove.length) {
            const pg = this.pendingRemove.pop();
            if (pg.gone) continue;
            pg.gone = true;
            if (pg.evilKill) {               // broken (by evil or a bomb), not used up: it comes back to be placed again for free
                if (pg.type !== 'dual') this.progress.freePegs[pg.type]++;
                else if (pg.left > 0) this.progress.dualReady.push(pg.left);   // a blast peg keeps its remaining hits
            }
            this.pegs.remove(pg);
        }
        this.buckets.tick(dt);
        this.pegs.tick(dt, this.evilOn ? 0 : evilRegen(this.L('fast_healing')));   // pegs heal while evil is off
        this.effects.tick(dt);
    }
}

/* =====================================================================
   GAME DRAWING: pegs, balls, buckets, the cannon and the special effects of the upgrades
   ===================================================================== */
const PEG_GLOW = 12;                         // how far the resting glow reaches past the peg edge

// damaged pegs blend from their own colour towards evil red (damage rounded to 0.1 steps so the sprites stay cached)
const pegCol = p => p.dmg > 0.02 ? mixCol(p.color, EVIL_COL, Math.round(p.dmg * 10) / 10) : p.color;

class GameRenderer extends Renderer {
    // everything on the board, back to front (the base Renderer has cleared the canvas and set the camera)
    drawScene(a, view, k, top, bot) {
        const game = this.game;
        this.drawBoard(top, bot);
        this.drawBucket();
        this.drawGravityFields(top, bot);
        this.drawPegs(k, top, bot);
        this.drawPlacement(view);
        this.drawBalls(a, top, bot);
        this.drawEffects(top, bot);
        if (!game.editing) this.drawLauncher(game.prevLaunchX + (game.launchX - game.prevLaunchX) * a, Math.min(game.worldH, bot));   // no cannon while editing
    }

    pegPath(p, grow = 0) {
        const ctx = this.ctx;
        if (p.type === 'research') hexPath(ctx, p.x, p.y, p.r + 1 + grow); else { ctx.beginPath(); ctx.arc(p.x, p.y, p.r + grow, 0, TAU); }
    }

    // Each peg look (type, colour, damage, radius) is drawn once into a sprite at device pixels: glow, body, outline.
    // Drawing hundreds of cached images is far cheaper than hundreds of glows plus path fills and strokes every frame.
    pegSprite(p, col, k) {
        const r = Math.round(p.r * 4) / 4, dmg = p.dmg > 0.02 ? Math.round(p.dmg * 10) / 10 : 0;
        const key = p.type + col + dmg + ',' + r + ',' + k;   // k too: the edit palette draws its icons at its own scale
        let s = this.sprites[key];
        if (s) return s;
        const R = r + 1 + PEG_GLOW, size = Math.ceil(2 * R * k) + 2, c = size / 2 / k;
        s = document.createElement('canvas'); s.width = s.height = size;
        const g = s.getContext('2d');
        g.scale(k, k);
        const gr = g.createRadialGradient(c, c, 0, c, c, R);
        gr.addColorStop(0, col + '59'); gr.addColorStop(0.35, col + '29'); gr.addColorStop(1, col + '00');
        g.fillStyle = gr; g.fillRect(0, 0, 2 * c, 2 * c);
        if (p.type === 'research') hexPath(g, c, c, r + 1); else { g.beginPath(); g.arc(c, c, r, 0, TAU); }
        g.fillStyle = '#0b0825'; g.fill();
        if (dmg) { g.fillStyle = `rgba(255,30,50,${dmg * 0.5})`; g.fill(); }
        g.strokeStyle = col; g.lineWidth = 2.5; g.stroke();
        if (p.type === 'splitter') {         // a vertical split line marks the splitter
            g.beginPath(); g.moveTo(c, c - 5); g.lineTo(c, c + 5);
            g.lineWidth = 2; g.lineCap = 'round'; g.stroke();
        }
        if (p.type === 'alchemy') {          // an inner rim makes the alchemy peg look like a coin
            g.beginPath(); g.arc(c, c, r * 0.55, 0, TAU);
            g.lineWidth = 1.4; g.stroke();
        }
        if (p.type === 'gravity') {          // a small ring around a dot marks the gravity peg
            g.beginPath(); g.arc(c, c, r * 0.5, 0, TAU);
            g.lineWidth = 1.6; g.stroke();
            g.beginPath(); g.arc(c, c, 1.6, 0, TAU);
            g.fillStyle = col; g.fill();
        }
        return (this.sprites[key] = s);
    }

    // a goo-covered peg wears a wavy green cap on its top side, like icing on a cake; it slowly slides off as the goo wears out
    drawGooCap(p) {
        const ctx = this.ctx, simT = this.game.simT;
        const R = p.r + 1.5, cover = Math.min(1, p.gooT / 2500);
        const edge = p.y - R * 1.25 + R * 1.45 * cover;              // full cover: the goo reaches just below the middle of the peg
        const wave = x => Math.sin(x * 0.62 + simT / 260 + p.x) * 1.6 + Math.sin(x * 1.5 - simT / 380 + p.y) * 0.9;
        ctx.save();
        this.pegPath(p, 1.3); ctx.clip();                             // slightly larger than the peg so the cap also covers the outline
        ctx.beginPath();
        ctx.moveTo(p.x - R - 1, p.y - R - 3);
        ctx.lineTo(p.x + R + 1, p.y - R - 3);
        for (let dx = R + 1; dx >= -R - 1; dx -= 1) ctx.lineTo(p.x + dx, edge + wave(p.x + dx));
        ctx.closePath();
        ctx.fillStyle = 'rgba(107,255,31,.9)'; ctx.fill();
        ctx.strokeStyle = 'rgba(220,255,190,.75)'; ctx.lineWidth = 1.2; ctx.stroke();   // bright rim along the wavy edge
        ctx.fillStyle = 'rgba(255,255,255,.55)';                                        // little shine
        ctx.beginPath(); ctx.ellipse(p.x - R * 0.35, p.y - R * 0.55, 2.4, 1.3, -0.5, 0, TAU); ctx.fill();
        ctx.restore();
    }

    drawBucket() {
        const ctx = this.ctx, game = this.game, bs = game.buckets.layout(), n = bs.length;
        const rim = game.rimY(), bot = game.worldH - 8, base = bucketValue(game.L('bucket_value'));
        for (let i = 0; i < n; i++) {
            const b = bs[i], fl = game.buckets.flash[i];
            const col = n === 1 ? '#b6ff2e' : b.t < 0.01 ? '#ffd23a' : b.t > 0.99 ? '#b6ff2e' : '#ff9d1a';
            const sl = Math.min(8, b.w * 0.15);
            const x0 = b.cx - b.w / 2, x1 = b.cx + b.w / 2;
            ctx.save();
            ctx.beginPath(); ctx.moveTo(x0, rim); ctx.lineTo(x0 + sl, bot); ctx.lineTo(x1 - sl, bot); ctx.lineTo(x1, rim); ctx.closePath();
            ctx.globalAlpha = 0.08 + 0.3 * fl; ctx.fillStyle = col; ctx.fill();
            ctx.lineJoin = 'round'; ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(x0, rim); ctx.lineTo(x0 + sl, bot); ctx.lineTo(x1 - sl, bot); ctx.lineTo(x1, rim);
            this.glowStroke(col, n > 1 ? 2.5 : 3, 9 + 6 * fl, 0.2 + 0.3 * fl);
            ctx.restore();
            ctx.textAlign = 'center'; ctx.font = `800 ${Math.max(8, Math.min(12, b.w / 3.6))}px system-ui,sans-serif`;
            ctx.fillStyle = col;
            ctx.fillText('$' + fmt(base * b.mult), b.cx, rim + 17);
        }
    }

    // gravity pegs: a faint field showing how far their pull reaches (drawn under the pegs)
    drawGravityFields(top, bot) {
        const ctx = this.ctx, pegs = this.game.pegs.gravity;
        const visible = p => p.y >= top - GRAVPEG_R && p.y <= bot + GRAVPEG_R;
        ctx.globalCompositeOperation = 'lighter';
        for (const p of pegs) if (visible(p)) this.glow(p.color, p.x, p.y, GRAVPEG_R * 2, 0.16);
        ctx.globalCompositeOperation = 'source-over';
        ctx.setLineDash([3, 6]);
        for (const p of pegs) {
            if (!visible(p)) continue;
            ctx.beginPath(); ctx.arc(p.x, p.y, GRAVPEG_R, 0, TAU);
            ctx.strokeStyle = 'rgba(46,255,176,.22)'; ctx.lineWidth = 1; ctx.stroke();
        }
        ctx.setLineDash([]);
    }

    // one cached sprite per peg (glow + body); the bigger flash glow, goo caps and blast counters only where needed
    drawPegs(k, top, bot) {
        const ctx = this.ctx, camY = this.camera.y, pegs = this.game.pegs.list;
        this.drawRelaxLinks();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        for (const p of pegs) {
            if (p.y < top || p.y > bot) continue;
            const s = this.pegSprite(p, pegCol(p), k);
            ctx.drawImage(s, Math.round(p.x * k - s.width / 2 + this.ox), Math.round((p.y - camY) * k - s.width / 2 + this.oy));   // whole device pixels: crisp
        }
        this.worldTransform(k);
        ctx.globalCompositeOperation = 'lighter';
        for (const p of pegs) {
            if (p.y < top || p.y > bot) continue;
            if (p.flash > 0) this.glow(pegCol(p), p.x, p.y, 46 + 22 * p.flash, 0.65 * p.flash);
            if (p.gooT > 0) this.glow(GOO_COL, p.x, p.y - 4, 30, 0.35);   // faint green glow from the cap only
            if (p.charge >= 1) this.glow(ALCH_BRIGHT, p.x, p.y, 36, 0.3 + 0.15 * Math.sin(this.game.simT / 180 + p.x));   // a fully charged alchemy peg pulses
        }
        ctx.globalCompositeOperation = 'source-over';
        for (const p of pegs) {
            if (p.y < top || p.y > bot) continue;
            if (p.type === 'dual') {
                ctx.fillStyle = '#ffd23a'; ctx.font = '800 10px system-ui,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                ctx.fillText(String(p.left), p.x, p.y + 0.5); ctx.textBaseline = 'alphabetic';
            }
            // the peg keeps its own colour; goo is only a green cap drawn on top of it (top side green, bottom side original)
            if (p.gooT > 0) this.drawGooCap(p);
            if (p.flash > 0) { this.pegPath(p); ctx.fillStyle = `rgba(255,255,255,${p.flash * 0.85})`; ctx.fill(); }
        }
    }

    // repulsion field: a glowing line between every pair of pegs that are pushing each other apart (under the pegs)
    drawRelaxLinks() {
        const relax = this.game.relax, ctx = this.ctx;
        if (!relax || !relax.links.length) return;
        const L = relax.links, ease = Math.min(1, this.game.temps.s.repulsion_field.t / 1500);
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = RELAX_COL; ctx.lineWidth = 1.5; ctx.lineCap = 'round';
        ctx.globalAlpha = 0.5 * ease;
        ctx.beginPath();
        for (let i = 0; i < L.length; i += 2) { ctx.moveTo(L[i].x, L[i].y); ctx.lineTo(L[i + 1].x, L[i + 1].y); }
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
    }

    // edit mode, mouse: a dashed outline of the selected peg type under the pointer, red when it cannot be placed
    drawPlacement(view) {
        const ctx = this.ctx, game = this.game, type = view.editType;
        if (!game.editing || !view.hover || view.dragging || game.pegs.at(view.hover.x, view.hover.y)) return;
        const s = game.placeSpot(view.hover.x, view.hover.y), hr = pegRadius(s.y), ok = !game.cantPlace(type);
        if (type === 'research') hexPath(ctx, s.x, s.y, hr + 1); else { ctx.beginPath(); ctx.arc(s.x, s.y, hr, 0, TAU); }
        ctx.strokeStyle = ok ? PEG_KINDS[type].color : 'rgba(255,60,80,.85)';
        ctx.lineWidth = 2; ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]);
        if (type === 'gravity' && ok) {      // preview the reach of the gravity peg
            ctx.beginPath(); ctx.arc(s.x, s.y, GRAVPEG_R, 0, TAU);
            ctx.strokeStyle = 'rgba(46,255,176,.35)'; ctx.lineWidth = 1; ctx.setLineDash([3, 6]); ctx.stroke(); ctx.setLineDash([]);
        }
    }

    // a peg picture for the edit palette (the board's own peg sprite, scaled into a small canvas)
    pegIcon(type, canvas) {
        const s = this.pegSprite({ type, r: PEG_R, dmg: 0 }, PEG_KINDS[type].color, 2), g = canvas.getContext('2d');
        const pad = canvas.width * 0.3;      // trim most of the glow so the peg itself fills the icon
        g.clearRect(0, 0, canvas.width, canvas.height);
        g.drawImage(s, -pad, -pad, canvas.width + 2 * pad, canvas.height + 2 * pad);
        const c = canvas.width / 2, fade = g.createRadialGradient(c, c, c * 0.6, c, c, c);   // fade the cut-off glow out, so no square edge shows
        fade.addColorStop(0, '#000'); fade.addColorStop(1, 'rgba(0,0,0,0)');
        g.globalCompositeOperation = 'destination-in';
        g.fillStyle = fade; g.fillRect(0, 0, canvas.width, canvas.height);
        g.globalCompositeOperation = 'source-over';
    }

    drawBalls(a, top, bot) {
        const ctx = this.ctx, balls = this.game.balls;
        const pos = b => { const p = b.body.position; return [b.px + (p.x - b.px) * a, b.py + (p.y - b.py) * a]; };
        ctx.globalCompositeOperation = 'lighter';
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        for (const b of balls) {
            const [x, y] = pos(b);
            if (y < top || y > bot) continue;
            const col = b.goo ? GOO_COL : b.gold ? GOLD : b.glow;
            const t = b.trail;
            if (t.length >= 4) {
                ctx.strokeStyle = col; ctx.globalAlpha = 0.35; ctx.lineWidth = b.r * 1.1;
                ctx.beginPath(); ctx.moveTo(t[0], t[1]);
                for (let i = 2; i < t.length; i += 2) ctx.lineTo(t[i], t[i + 1]);
                ctx.lineTo(x, y); ctx.stroke(); ctx.globalAlpha = 1;
            }
            if (b.bomb) {                    // a big red glow that throbs faster as the fuse burns down
                const pulse = 0.5 + 0.5 * Math.sin(b.phase);
                this.glow(BOMB_COL, x, y, b.r * (6 + 3 * pulse), 0.75 + 0.25 * pulse);
            } else if (b.zap) {              // a flickering blue glow that grows with the charge
                this.glow(ZAP_COL, x, y, b.r * (5 + 3 * b.charge) * rand(0.9, 1.1), 0.8 + 0.2 * b.charge);
            } else this.glow(col, x, y, b.r * 5, 0.9);
        }
        ctx.globalCompositeOperation = 'source-over';
        for (const b of balls) {
            const [x, y] = pos(b);
            if (y < top || y > bot) continue;
            ctx.globalAlpha = b.ghost ? 0.5 : 1;  // ghost balls are see-through
            if (b.bomb) { this.drawBomb(b, x, y); continue; }
            if (b.zap) { this.drawZap(b, x, y); continue; }
            ctx.fillStyle = b.goo ? GOO_COL : b.gold ? GOLD : '#fff';
            ctx.beginPath(); ctx.arc(x, y, b.r * 0.78, 0, TAU); ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    // red bomb with a shine, a ring showing the fuse left, the seconds left and the loot inside
    drawBomb(b, x, y) {
        const ctx = this.ctx, r = b.r, left = Math.max(0, b.fuse) / BOMB_FUSE, secs = Math.ceil(Math.max(0, b.fuse) / 1000);
        const hot = left < 0.3 && Math.sin(b.phase * 2) > 0;   // the last seconds blink white-hot
        ctx.fillStyle = hot ? '#ffd0d4' : BOMB_COL;
        ctx.beginPath(); ctx.arc(x, y, r * 0.85, 0, TAU); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.6)';
        ctx.beginPath(); ctx.arc(x - r * 0.3, y - r * 0.3, r * 0.22, 0, TAU); ctx.fill();
        ctx.strokeStyle = 'rgba(255,42,61,.25)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(x, y, r + 3.5, 0, TAU); ctx.stroke();
        ctx.strokeStyle = left < 0.3 ? '#ffffff' : '#ffd23a'; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(x, y, r + 3.5, -Math.PI / 2, -Math.PI / 2 + TAU * left); ctx.stroke();

        ctx.textAlign = 'center';
        ctx.font = FONT_BIG;
        ctx.fillStyle = hot ? '#ffffff' : '#ff6b78';
        ctx.fillText(String(secs), this.onBoard(String(secs), x), y - r - 9);
        const s = b.stash, loot = [s.money && '$' + fmt(s.money), s.rp && fmt(s.rp) + ' RP', s.evil && evFmt(s.evil) + ' EVIL'].filter(Boolean).join('  ');
        if (loot) { ctx.font = FONT_SMALL; ctx.fillStyle = '#ffd23a'; ctx.fillText(loot, this.onBoard(loot, x), y - r - 26); }
    }

    // white-hot core, a ring that fills up with the charge, and sparks crackling around it once it is half charged
    drawZap(b, x, y) {
        const ctx = this.ctx, r = b.r;
        ctx.fillStyle = '#e8fbff';
        ctx.beginPath(); ctx.arc(x, y, r * 0.8, 0, TAU); ctx.fill();
        ctx.lineWidth = 2.5; ctx.lineCap = 'round';
        ctx.strokeStyle = 'rgba(77,210,255,.25)';
        ctx.beginPath(); ctx.arc(x, y, r + 3.5, 0, TAU); ctx.stroke();
        ctx.strokeStyle = ZAP_COL;
        ctx.beginPath(); ctx.arc(x, y, r + 3.5, -Math.PI / 2, -Math.PI / 2 + TAU * b.charge); ctx.stroke();
        if (b.charge >= 0.5) {
            ctx.globalCompositeOperation = 'lighter';
            ctx.strokeStyle = '#bff0ff'; ctx.lineWidth = 1.2;
            for (let i = 0, n = Math.round(b.charge * 4); i < n; i++) {
                const a = rand(0, TAU), r0 = r + 2, r1 = r + rand(6, 11), m = (r0 + r1) / 2, wob = rand(-0.35, 0.35);
                ctx.beginPath();
                ctx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0);
                ctx.lineTo(x + Math.cos(a + wob) * m, y + Math.sin(a + wob) * m);
                ctx.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1);
                ctx.stroke();
            }
            ctx.globalCompositeOperation = 'source-over';
        }
    }

    drawLauncher(x, visBot) {
        const ctx = this.ctx, y = LAUNCH_Y, recoil = this.game.recoil;

        // faint aim line straight down, so players can time their shot
        ctx.save();
        ctx.strokeStyle = 'rgba(255,157,26,.25)'; ctx.lineWidth = 1.5; ctx.setLineDash([3, 7]);
        ctx.beginPath(); ctx.moveTo(x, y + 2); ctx.lineTo(x, Math.max(y + 2, visBot)); ctx.stroke();
        ctx.restore();

        ctx.globalCompositeOperation = 'lighter';
        this.glow('#ff9d1a', x, y - 6, 70, 0.45);
        ctx.globalCompositeOperation = 'source-over';

        // barrel, pointing down
        ctx.save();
        ctx.translate(x, 0);
        ctx.fillStyle = '#1a1038'; ctx.strokeStyle = '#ff9d1a'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.rect(-6.5, 10 - recoil * 7, 13, 24); ctx.fill(); ctx.stroke();
        ctx.restore();

        // carriage hanging from the ceiling
        ctx.fillStyle = '#120b2b'; ctx.strokeStyle = '#ff9d1a'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.rect(x - 15, 0, 30, 14); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(x, 7, 3.5, 0, TAU); ctx.fillStyle = '#ff9d1a'; ctx.fill();
    }
}

/* =====================================================================
   SAVE / LOAD
   ===================================================================== */
const SAVE_CODE = { research: 'r', dual: 'd', splitter: 's', gravity: 'g', alchemy: 'a', basic: 'b' };
const SAVE_TYPE = Object.fromEntries(Object.entries(SAVE_CODE).map(([type, code]) => [code, type]));
// upgrade ids that were renamed (old id -> new id): older saves keep levels and timers under the old id
const RENAMED = {
    ball: 'peg_value',
    bucket: 'bucket_value',
    peg: 'peg_slots',
    balls: 'extra_ball',
    power: 'peg_power',
    wide: 'wide_bucket',
    research: 'research_lab',
    rpeg_value: 'research_pegs_value',
    combo: 'combo_chain',
    gold: 'golden_pegs',
    bounce: 'bouncy_balls',
    fat: 'fat_balls',
    deeper: 'deeper_world',
    dropper: 'faster_dropper',
    bucketrow: 'extra_buckets',
    goldvalue: 'gold_ball_value',
    gooball: 'more_gooballs',
    goolife: 'lasting_goo',
    goopay: 'rich_phlegm',
    capx: 'higher_limit',
    rpeg: 'research_pegs',
    depth: 'world_size',
    cap: 'upgrade_limit',
    auto: 'auto_dropper',
    rcombo: 'combo_theory',
    rgold: 'alchemy',
    rbounce: 'elastic_balls',
    rfat: 'ball_inflation',
    splitpeg: 'splitter_pegs',
    gravpeg: 'gravity_pegs',
    goldball: 'gold_balls',
    buckets: 'more_buckets',
    goo: 'phlegm_goo',
    goocap: 'goo_tank',
    dual: 'blast_pegs',
    ghost: 'ghost_balls',
    gravity: 'heavy_gravity',
    dead: 'dead_balls',
    chaos: 'chaos_balls',
    burst: 'ball_burst',
    evilhard: 'sturdy_pegs',
    evilregen: 'fast_healing',
    evilyield: 'dark_harvest',
    bomb: 'bomb_balls',
    relax: 'repulsion_field',
    zap: 'electric_ball',
};

class SaveStore {
    constructor(game) {
        this.game = game;
        this.resetting = false;              // no more saving once a reset is under way
    }
    autosave() {
        setInterval(() => this.save(), 5000);
        document.addEventListener('visibilitychange', () => { if (document.hidden) this.save(); });
        window.addEventListener('pagehide', () => this.save());
    }
    reset() {
        this.resetting = true;
        try { localStorage.removeItem(SAVE_KEY); } catch (e) { }
        location.reload();
    }
    save() {
        if (this.resetting) return;
        const g = this.game, p = g.progress;
        try {
            localStorage.setItem(SAVE_KEY, JSON.stringify({
                v: 7, money: p.money, rp: p.rp, goo: p.goo, evil: p.evil, autoOn: g.autoOn, labT: g.labT, dualReady: p.dualReady, levels: p.levels, freePegs: p.freePegs,
                timers: g.temps.toSave(),        // temporary goo upgrades: [time left running, cooldown left] (ms)
                // [x, y, type, hits left (blast), damage, money paid, placed for free (1/0)]
                pegs: g.pegs.list.map(pg => [Math.round(pg.x * 10) / 10, Math.round(pg.y * 10) / 10, SAVE_CODE[pg.type] || 'b', pg.left || 0, Math.round(pg.dmg * 100) / 100, pg.paid, pg.free ? 1 : 0]),
            }));
        } catch (e) { }
    }
    load() {
        const g = this.game, p = g.progress;
        try {
            const raw = localStorage.getItem(SAVE_KEY);
            if (!raw) return;
            const d = JSON.parse(raw);
            const pd = v => Number.isFinite(v) ? Math.min(0.99, Math.max(0, v)) : 0;   // saved peg damage
            for (const k of ['money', 'rp', 'goo', 'evil']) if (Number.isFinite(d[k])) p[k] = d[k];   // goo is trimmed to the limit once the levels are loaded
            if (typeof d.autoOn === 'boolean') g.autoOn = d.autoOn;
            if (Number.isFinite(d.labT)) g.labT = Math.min(Math.max(0, d.labT), LAB_FIRST);
            for (const o of [d.levels, d.timers]) if (o) for (const old in RENAMED) if (o[old] !== undefined && o[RENAMED[old]] === undefined) o[RENAMED[old]] = o[old];
            if (d.timers) g.temps.load(d.timers);
            if (Array.isArray(d.dualReady)) p.dualReady = d.dualReady.filter(Number.isFinite).map(n => n | 0);
            if (d.levels) for (const u of UPGRADES) if (Number.isFinite(d.levels[u.id])) p.levels[u.id] = d.levels[u.id] | 0;
            const old = (d.v | 0) < 3;
            if (old) this.migrate(d);
            else if (d.freePegs) for (const t in p.freePegs) p.freePegs[t] = Math.max(0, d.freePegs[t] | 0);
            // before v4 research could have many levels; now it is bought once (the extra levels are gone, money upgrades take over)
            if ((d.v | 0) < 4) for (const u of UPGRADES) if (u.tab === 'research') p.levels[u.id] = Math.min(1, p.levels[u.id]);
            // before v5 these money upgrades had no research: owned levels keep their effect, the research now counting as the first one
            if ((d.v | 0) < 5) for (const [r, m] of [['combo_theory', 'combo_chain'], ['alchemy', 'golden_pegs'], ['elastic_balls', 'bouncy_balls'], ['ball_inflation', 'fat_balls']]) if (p.levels[m] > 0) { p.levels[r] = 1; p.levels[m]--; }
            // before v6 Alchemy gave Golden Pegs its first level (now it unlocks alchemy pegs): owners get that level as a money level
            if ((d.v | 0) < 6 && p.levels.alchemy > 0) p.levels.golden_pegs++;
            // before v7 these research upgrades also gave the first level of their money upgrade (now they only unlock it)
            if ((d.v | 0) < 7) for (const [r, m] of [['combo_theory', 'combo_chain'], ['elastic_balls', 'bouncy_balls'], ['ball_inflation', 'fat_balls'], ['world_size', 'deeper_world'], ['more_buckets', 'extra_buckets'], ['upgrade_limit', 'higher_limit']]) if (p.levels[r] > 0) p.levels[m]++;
            g.growWorld();
            p.goo = Math.min(p.goo, p.gooCap());
            for (const pt of Array.isArray(d.pegs) ? d.pegs : []) {
                if (!Array.isArray(pt) || !Number.isFinite(pt[0]) || !Number.isFinite(pt[1])) continue;
                const type = pt[2] === 'd' ? 'dual' : SAVE_TYPE[pt[2]] || 'basic';
                if (pt[1] > g.worldH - PEG_R) {      // below the floor (the board got shorter): back to be placed again for free
                    if (type === 'dual') { if (pt[3] > 0) p.dualReady.push(pt[3] | 0); } else p.freePegs[type]++;
                    continue;
                }
                if (pt[2] === 'd') { if (Number.isFinite(pt[3]) && pt[3] > 0) g.pegs.add(pt[0], pt[1], 'dual', pt[3] | 0, pd(pt[4])); continue; }
                const paid = old ? PEG_KINDS[type].price : Number.isFinite(pt[5]) ? Math.max(0, pt[5]) : 0;
                g.pegs.add(pt[0], pt[1], type, 0, pd(pt[4]), paid, !old && pt[6] === 1);
            }
        } catch (e) { }
    }
    // Saves from before edit mode: every peg was bought one by one, then placed for free. Now there are slots and pegs cost
    // money to place. So everything owned becomes a slot, owning a special peg unlocks its type, unplaced pegs become free
    // placements, and placed pegs count as paid for (picking one up refunds its price).
    migrate(d) {
        const p = this.game.progress, lv = d.levels || {};
        const owned = { basic: lv.peg_slots | 0, research: lv.research_pegs | 0, splitter: lv.splitter_pegs | 0, gravity: lv.gravity_pegs | 0 };
        const placed = { basic: 0, research: 0, splitter: 0, gravity: 0 };
        for (const pt of Array.isArray(d.pegs) ? d.pegs : []) if (Array.isArray(pt) && pt[2] !== 'd') placed[SAVE_TYPE[pt[2]] || 'basic']++;
        let total = 0;
        for (const t in owned) {
            total += Math.max(owned[t], placed[t]);
            p.freePegs[t] = Math.max(0, owned[t] - placed[t]);
        }
        p.levels.peg_slots = Math.max(0, total - START_SLOTS);
        for (const id of ['research_pegs', 'splitter_pegs', 'gravity_pegs']) p.levels[id] = Math.min(1, p.levels[id]);
    }
}

/* =====================================================================
   START
   ===================================================================== */
new App().start();
