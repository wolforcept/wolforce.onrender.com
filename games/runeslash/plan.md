# Rune Slash — Implementation Plan

---

## Table of Contents

1. [Multi-Rune Recognition Investigation](#1-multi-rune-recognition-investigation)
2. [Project Structure](#2-project-structure)
3. [Architecture Overview](#3-architecture-overview)
4. [Data Schemas](#4-data-schemas)
5. [Game Systems](#5-game-systems)
6. [Rendering Pipeline](#6-rendering-pipeline)
7. [Input & Drawing System](#7-input--drawing-system)
8. [Enemy System](#8-enemy-system)
9. [Combat System — Damage Types & Attack Types](#9-combat-system--damage-types--attack-types)
10. [Status Effects on Enemies](#10-status-effects-on-enemies)
11. [Leveling, EXP & Talent Tree](#11-leveling-exp--talent-tree)
12. [Dev Tools Page](#12-dev-tools-page)
13. [File Breakdown](#13-file-breakdown)
14. [Suggested Rune Set](#14-suggested-rune-set)
15. [Open Questions for You](#15-open-questions-for-you)

---

## 1. Multi-Rune Recognition Investigation

### The core question
Can the $1 algorithm (or its family) recognize multiple runes within a single continuous drawing — e.g. the player draws a circle-then-line in one unbroken stroke, and the game fires two separate rune effects?

### What $1 actually does
$1 is a **unistroke** recognizer. It takes one continuous stroke (mousedown → mousemove → mouseup) and matches it against a library of normalized templates. It returns exactly one best-match result with a confidence score. It has no concept of stroke segmentation — the entire stroke is treated as one atomic gesture.

### Can it do multi-rune in one stroke? The honest answer
**No, not natively.** A single stroke encoding two shapes will, after normalization, produce a mangled intermediate shape that matches neither template well. If the player draws a circle then immediately draws a star without lifting, the resampled 64-point path will represent the "circle-star concatenation" — which matches nothing.

### However: there is a real solution — Stroke Segmentation
You can implement a **segmentation layer** that splits a single continuous stroke into sub-strokes before feeding each one to the recognizer. Two approaches:

**Option A — Time-gap segmentation (simple, recommended)**
The player draws one rune, pauses for ~300ms, draws another, pauses, etc. The drawing canvas monitors inter-point time gaps. When a gap exceeds a threshold, the current stroke is submitted to $1 and a new stroke begins. This is the same UX as how you write in cursive — natural pauses delimit symbols. This works well and is easy to implement.

**Option B — Speed/curvature segmentation (complex)**
Analyze the raw stroke for sudden changes in direction or speed. Points of high curvature are treated as stroke boundaries. This is fragile: runes themselves have sharp turns, so false splits are common. Not recommended for a game context.

**Option C — Use $N (multistroke recognizer)**
$N extends $1 to gestures made of multiple separate strokes (each mousedown→mouseup is one component stroke). A rune defined in $N would be "two strokes in sequence" and the player draws stroke 1, lifts, draws stroke 2, lifts. However, $N still recognizes one template per gesture invocation — it doesn't fire two separate rune effects. It's useful for making runes that require lifting (like a cross or asterisk), not for "casting two runes in one motion."

**Option D — $P Point-Cloud Recognizer**
$P ignores stroke count, order, and direction entirely — it treats all points as an unordered cloud. This is great for recognizing complex shapes drawn in any order, but it makes distinguishing similar shapes harder. Not ideal for this game where rune distinctiveness matters.

### Recommendation
**Implement Option A (time-gap segmentation) as the primary mechanism.**

- Player draws a stroke → lifts mouse/finger → that stroke is immediately submitted to $1 → effect fires
- This is the fast-feedback model: every mouseup = one potential rune cast
- For "combo runes" (a planned future feature), you can chain two recognized runes in rapid succession (within 1 second of each other) to trigger a bonus combo effect
- This is also the most intuitive UX: you see the result of each shape immediately

**Key implementation note:** The "basic slash" (just a line) is recognized like any other rune but has very low damage. All special rune effects are triggered by recognizing a specific shape. The slash is the fallback: if no rune is matched (score < threshold), the stroke is treated as a directional slash that deals basic physical damage along its drawn path.

### Summary table

| Approach | Multi-rune? | Complexity | Reliability | Verdict |
|---|---|---|---|---|
| Pure $1, one stroke | No | Low | High | Baseline only |
| Time-gap segmentation + $1 | Yes (sequential) | Low | High | **Use this** |
| $N multistroke | Partial | Medium | High | Use for complex shapes |
| Curvature segmentation | Theoretically yes | High | Low | Avoid |
| $P Point-Cloud | Single match | Low | Medium | Optional alternative |

---

## 2. Project Structure

```
/
├── index.html          # Main game page (canvas + input)
├── dev.html            # Dev tools page (rune editor + talent tree editor)
├── game.js             # All game logic, systems, rendering
├── runes.json          # Rune definitions and templates
└── talent_tree.json    # Talent tree nodes and connections
```

Both `index.html` and `dev.html` import `game.js`. The dev page calls different initialization functions that expose editor UIs instead of starting the game loop.

---

## 3. Architecture Overview

### Main loop (game.js)
```
GameState (singleton)
  ├── Core (entity with HP, position = center)
  ├── EnemyManager
  ├── ProjectileManager
  ├── EffectManager (orbits, zones, towers, friendlies)
  ├── ParticleSystem
  ├── DrawingSystem (canvas overlay, stroke capture, $1 recognizer)
  ├── RuneSystem (template library, recognition, effect dispatch)
  ├── CombatSystem (damage calc, status application)
  ├── TalentSystem (tree, stat modifiers)
  ├── LevelSystem (EXP, level-up, rune unlocks)
  └── UISystem (HUD, floating numbers, wave timer)
```

### Two canvases, layered
- **Background canvas**: game world (core, enemies, projectiles, effects)
- **Drawing canvas**: transparent overlay on top, captures mouse/touch input, shows stroke being drawn
- Drawing canvas sits on top so pointer events always register regardless of game objects underneath

### Game tick
`requestAnimationFrame` loop calls `GameState.update(dt)` and `GameState.render()` each frame. All systems receive `dt` (delta time in seconds) to be framerate-independent.

---

## 4. Data Schemas

### runes.json
```json
{
  "runes": [
    {
      "id": "fire_circle",
      "name": "Ember Ring",
      "unlockedAtLevel": 2,
      "shape": "circle",
      "templatePoints": [[x,y], ...],
      "effect": {
        "attackType": "zone_damage",
        "damageType": "fire",
        "baseDamage": 40,
        "radius": 120,
        "statusEffect": "burn",
        "statusDuration": 3.0,
        "description": "Burns all enemies in a ring around the core"
      },
      "visualColor": "#FF6B35",
      "particleTheme": "fire"
    }
  ]
}
```

### talent_tree.json
```json
{
  "nodes": [
    {
      "id": "slash_dmg_1",
      "name": "Sharp Edge",
      "description": "+5 base slash damage",
      "tier": 1,
      "x": 400, "y": 100,
      "cost": 1,
      "requires": [],
      "effect": {
        "stat": "slashBaseDamage",
        "op": "add",
        "value": 5
      }
    },
    {
      "id": "fire_burn_duration_1",
      "name": "Smoldering",
      "description": "+5% fire burn duration",
      "tier": 2,
      "x": 300, "y": 200,
      "cost": 1,
      "requires": ["slash_dmg_1"],
      "effect": {
        "stat": "fireBurnDuration",
        "op": "multiply",
        "value": 1.05
      }
    }
  ],
  "connections": [
    { "from": "slash_dmg_1", "to": "fire_burn_duration_1" }
  ]
}
```

---

## 5. Game Systems

### GameState
Holds all references. Tracks: `isRunning`, `isPaused`, `time`, `wave`, `score`.

### LevelSystem
- `exp`, `expToNextLevel` (scales: `100 * level^1.4`)
- `talentPoints` (1 per level)
- `unlockedRunes[]`
- On level-up: pause game briefly, show rune unlock popup if applicable, grant talent point
- Runes are unlocked at specific levels (configurable in `runes.json`)

### TalentSystem
- `appliedNodes[]`
- `getStatMultiplier(stat)` — walks all applied nodes that affect a stat, returns final value
- Stats modified include: `slashBaseDamage`, `fireBurnDuration`, `frostSlowPercent`, `arcaneProjectileCount`, `voidPullStrength`, `chainDamageRange`, `orbDamage`, `towerAttackSpeed`, etc.

---

## 6. Rendering Pipeline

All rendering happens in `game.js`. The render order each frame:

1. Clear background canvas
2. Draw background (simple dark gradient, subtle grid or aura around core)
3. Draw zone effects (under enemies)
4. Draw enemies (sprites are colored circles/polygons with HP bars)
5. Draw orbiting projectiles
6. Draw towers and friendly entities
7. Draw projectiles in flight
8. Draw particles
9. Draw the core (pulsing circle, HP ring)
10. Draw HUD (top bar: HP, EXP, level, wave timer)
11. Draw floating damage numbers
12. Drawing canvas: show current stroke being drawn (separate canvas, no clear needed until stroke ends)

### Visual style
Simple geometric shapes, no external image assets. Enemies are polygons (different shapes per enemy type). Damage types have color codes used for particles and effects:

| Damage Type | Color |
|---|---|
| basic | #C0C0C0 |
| fire | #FF6B35 |
| frost | #4FC3F7 |
| arcane | #CE93D8 |
| nature | #81C784 |
| void | #7E57C2 |

---

## 7. Input & Drawing System

### DrawingSystem
Manages the transparent canvas overlay.

**Events:** `mousedown` / `mousemove` / `mouseup` and equivalent touch events.

**Stroke capture:**
```
onPointerDown: start new stroke, record timestamp
onPointerMove: append point to currentStroke
onPointerUp:   finalize stroke → submitStroke(currentStroke)
```

**submitStroke(points):**
1. If points.length < 5, discard (accidental click)
2. Run $1 recognition → `{ name, score }`
3. If `score >= RECOGNITION_THRESHOLD` (default 0.82): fire the matched rune effect
4. Else: treat as a basic directional slash along the drawn path

**Time-gap segmentation (for combo drawing):**
- Player can hold mouse and pause mid-stroke for > 350ms
- The system splits the stroke at that gap and submits the first segment, then begins collecting the second
- Both are recognized independently in the same mousedown→mouseup session

**Slash damage application:**
- Compute bounding box and midpoint of the stroke
- Any enemy whose center lies within 30px of the stroke path takes slash damage
- Damage is proportional to stroke overlap (enemies swept through more = more hits theoretically, but practically it's one hit per stroke)

**Drawing feedback:**
- Stroke renders on the drawing canvas in real time as a glowing white/colored line
- On recognition: flash the stroke in the rune's color for ~400ms with a particle burst
- On no match: stroke fades red briefly
- Show rune name as floating text near centroid for 1 second

### $1 Implementation (embedded in game.js)
~120 lines. Standard implementation:
- `resample(points, n=64)`
- `indicativeAngle(points)`
- `rotateBy(points, radians)`
- `scaleTo(points, size=250)`
- `translateTo(points, origin)`
- `pathDistance(a, b)`
- `goldenSectionSearch(points, template)`
- `recognize(points, templates)` → `{ name, score }`

Template storage: pulled from `runes.json` at startup. Each rune has a `templatePoints` array recorded by the dev tool.

---

## 8. Enemy System

### Enemy base stats
Each enemy type definition has: `hp`, `speed`, `size`, `damage` (on reaching core), `expReward`, `shape` (polygon vertex count), `color`, `spawnWeightByWave`.

### Proposed enemy types

| Name | Description | HP | Speed | Notes |
|---|---|---|---|---|
| Grunt | Basic polygon, walks straight | low | medium | Most common early |
| Runner | Small, very fast | very low | high | Dodges slow projectiles |
| Tank | Large, slow, high HP | high | slow | Resists pushback |
| Splitter | Splits into 2 Grunts on death | medium | medium | |
| Charger | Stops and lunges in a straight line | medium | variable | Brief telegraphed pause before lunge |
| Shielder | Has a frontal shield, only damageable from behind | medium | slow | Shield direction rotates toward core |
| Swarm | Tiny, spawns in groups of 8–12 | very low | medium-high | Individual very weak, dangerous in mass |
| Boss | Appears every 5 waves, massive HP, special patterns | very high | slow | Unique abilities |

### Spawning
- Enemies spawn off-screen at random positions on a circle slightly outside the viewport
- Spawn rate increases with time: starts slow, ramps via a wave timer
- Wave system: every 30 seconds a "wave" increments, spawn rate increases and enemy composition shifts toward harder types
- There is no end to waves — the game is an endless survival

### Enemy AI
All enemies use simple steering: move toward the core. Optionally they slightly repel each other to avoid clumping (separation steering). No pathfinding needed since there are no obstacles.

---

## 9. Combat System — Damage Types & Attack Types

### Damage Types
```
basic    — no secondary effect, scales off slash base damage
fire     — can apply burn
frost    — can apply slow or freeze
arcane   — can apply a secondary arcane pulse on kill
nature   — can apply root or heal the core slightly on kill
void     — can apply pull toward a point; enemies near void explosions take bonus damage
```

Each damage type has a `resistance` value on certain enemy types (e.g. Tank has 30% fire resistance).

### Attack Types (all triggered by rune recognition)

**Projectile** (`projectile`)
A single or multiple projectiles spawned from the core, travel outward. Can be aimed (spawned toward stroke midpoint direction) or omnidirectional.

**Chain Lightning** (`chain_damage`)
Hits one nearest enemy, then arcs to the next-nearest within chain range, up to N hops. Damage degrades per hop. Drawn as arcing lines.

**Orbiting Projectiles** (`orbit`)
Spawns N projectiles that orbit the core at radius R for duration D. Each orbit projectile hits enemies it collides with (cooldown per enemy per orbit projectile). They persist until they expire or all hit X enemies.

**Zone Damage** (`zone_damage`)
Instantaneous damage in a radius around the core or around the stroke's centroid. Visual: ring/pulse expanding outward.

**Delayed Explosion** (`delayed_explosion`)
Places an invisible or glowing mine at the stroke's midpoint. After a fuse delay (e.g. 1.5 seconds) it explodes in a radius. Can stack multiple. Enemies on the mine take bonus damage (proximity trigger can also be added as a talent).

**Instant Ray** (`ray`)
A line from the core outward in the direction of the stroke, hits all enemies along it. Drawn as a laser beam that lingers for ~200ms.

**Land Mine** (`land_mine`)
Placed at stroke midpoint. Triggers on enemy proximity. Persists until triggered or a duration expires.

**Friendly Spawn** (`spawn_friendly`)
Creates a temporary friendly unit (e.g. a small elemental) that auto-attacks nearby enemies for its duration. Takes damage from enemies, can die early.

**Tower** (`spawn_tower`)
Creates a stationary turret at the stroke midpoint. Attacks the nearest enemy in range every X seconds. Can stack up to 3 at once. Has its own HP.

**Persistent Aura** (`aura`)
A temporary aura around the core that damages enemies that enter its radius each second. Lasts a short duration.

### Rune → Attack mapping examples

| Rune Shape | Name | Attack Type | Damage Type | Effect |
|---|---|---|---|---|
| Circle | Ember Ring | zone_damage | fire | Burn all nearby, apply burn |
| Star (5-point) | Arcane Nova | projectile (x5) | arcane | Fires 5 projectiles outward |
| Triangle | Frost Shard | projectile | frost | Aimed at stroke direction, applies slow |
| Zigzag | Chain Strike | chain_damage | basic | Chains through enemies |
| Spiral | Vortex | zone_damage | void | Pulls all nearby enemies toward core briefly, then damages |
| Square | Fortress | spawn_tower | basic | Places a tower |
| X shape | Sundering Cross | ray (x2 crossed) | basic | Two crossing rays, high damage |
| Lightning bolt | Static Surge | chain_damage | arcane | Bounces many times, arcane damage |
| Arrow | Verdant Shot | projectile | nature | Single fast aimed shot, roots on hit |
| Infinity (figure-8) | Void Loop | orbit | void | Spawns 2 void orbs orbiting the core |
| Heart | Nature's Blessing | aura | nature | Briefly heals core + roots nearby enemies |
| Wave / S-curve | Frost Wave | zone_damage | frost | Expanding frost wave, slows all hit |
| Checkmark | Land Mine | land_mine | fire | Places a fire mine at stroke end |
| Upward spike | Geyser | delayed_explosion | nature | Delayed earth explosion at centroid |
| Down spiral | Void Rift | spawn_friendly | void | Spawns a void imp that attacks |

---

## 10. Status Effects on Enemies

All effects stored on the enemy entity as an array of active `StatusEffect` objects, each with: `type`, `magnitude`, `duration`, `remaining`, `sourceType`.

| Effect | Behavior |
|---|---|
| **Burn** | Deals `magnitude` fire damage per second for `duration` seconds. Stacks (new burn extends/replaces). Visual: orange particles around enemy |
| **Slow** | Reduces move speed by `magnitude`% for `duration`. Multiple slows take the strongest value, don't stack multiplicatively. Visual: blue tint |
| **Freeze** | Speed = 0 for duration. Immune to slow while frozen. On freeze expiry: brief shatter particle burst. Visual: icy overlay, enemy stops |
| **Push** | Applies an impulse vector away from a point (rune centroid or core). Lasts one frame, decays over ~0.5s. Visual: motion blur streak |
| **Root** | Speed = 0 but can still attack if melee-capable. Duration-based. Visual: green vines/tendrils |
| **Pull** | Applies a sustained force vector toward a target point for duration. Visual: purple swirl |
| **Arcane Mark** | On death, triggers a small arcane explosion affecting adjacent enemies. Visual: purple rune symbol above enemy |
| **Vulnerability** | Takes +X% damage from all sources for duration. Some runes or talents apply this. Visual: crackling red outline |

Effect interactions:
- Freeze overrides Slow and Root (more severe)
- Burn and Freeze cancel each other (if both applied, both removed, deal one burst of steam damage)
- Pull and Push cancel by magnitude

---

## 11. Leveling, EXP & Talent Tree

### EXP & Levels
- Enemies drop EXP on death
- EXP threshold: `floor(100 * level^1.4)`
- On level-up:
  - +1 talent point
  - If this level has a rune unlock: show a popup (game not paused, just time-scale slowed to 0.2) letting the player acknowledge the new rune
  - Visual: core pulses with a level-up flash

### Rune unlock progression
Runes unlock at levels 2, 3, 4, 5, 7, 9, 12, 15, 20 (spaced to always give the player something to look forward to). Two runes unlock simultaneously at certain levels for variety.

### Talent Tree
Displayed as a node graph. Tree is split into 5 branches (one per damage type + one for utility):
- **Basic/Physical:** slash damage, multi-slash, projectile count, ray width
- **Fire:** burn damage, burn duration, explosion radius, fire resistance penetration
- **Frost:** slow potency, freeze chance, frost zone size, freeze duration
- **Arcane:** arcane mark chance, chain range, projectile speed, arcane nova count
- **Void/Nature:** pull strength, root duration, tower HP, friendly unit damage, mine trigger radius

Tiers 1–4, higher tiers require lower-tier nodes. Some nodes require nodes in adjacent branches (cross-synergy nodes).

### Talent spend UI
Accessed by pressing Tab or via a button. Semi-transparent overlay on the game (game continues at 0.2 speed while open). Shows the tree as rendered in `talent_tree.json` coordinates. Click a node to purchase if you have points and prereqs are met.

---

## 12. Dev Tools Page (`dev.html`)

Uses the same `game.js` but calls `initDevMode()` instead of `initGame()`.

### Rune Editor panel
- Left half: canvas where developer draws a rune shape
- Captures the stroke and shows the normalized 64-point path
- Input fields: rune ID, name, attack type, damage type, base damage, etc.
- "Save Rune" button: generates the JSON entry and shows it (can be copy-pasted into `runes.json`)
- "Test Recognition" mode: draws a shape and runs $1 against current template library, shows match + score
- Shows all current templates in a grid with their recorded shapes drawn out

### Talent Tree Editor panel
- Right half: click-and-drag canvas for placing and connecting talent nodes
- Click empty space: create new node (fill in stats in a sidebar form)
- Click and drag between nodes: create a connection (prerequisite link)
- Click a node: select and edit its properties
- "Export JSON" button: outputs the full `talent_tree.json`
- Live preview shows the tree as it would appear in the game

---

## 13. File Breakdown

### index.html
Responsibilities:
- Two `<canvas>` elements (game + drawing overlay), layered with CSS
- HUD elements as DOM (optional; can also be drawn on canvas)
- Pause screen, level-up overlay, game-over screen as DOM divs (shown/hidden)
- Import `game.js` as a module
- Call `import { initGame } from './game.js'; initGame(document.getElementById('gameCanvas'), document.getElementById('drawCanvas'));`
- Minimal CSS: black background, canvas centering, cursor crosshair on draw canvas

### dev.html
- Split layout: rune editor (left), talent tree editor (right)
- Import `game.js`
- Call `import { initDevMode } from './game.js'; initDevMode(panels)`
- No game loop running; only the recognizer and editor systems active

### game.js
All logic. Exported functions:
- `initGame(gameCanvas, drawCanvas)` — starts the game
- `initDevMode(panels)` — starts the dev tool UI

Internal modules (ES module structure or just clearly separated sections with comments):
- Constants & config
- $1 Recognizer implementation
- DrawingSystem class
- RuneSystem class (loads runes.json, matches strokes)
- Enemy class + EnemyManager
- Projectile class + ProjectileManager
- StatusEffect class
- CombatSystem (applyDamage, applyStatus, processTick)
- Entity classes: Core, Tower, Friendly, Mine, Orb
- EffectManager (manages non-projectile combat entities)
- ParticleSystem (lightweight: pool of particle objects)
- LevelSystem
- TalentSystem (loads talent_tree.json)
- UISystem (draws HUD, floating numbers)
- GameState (top-level, wires everything together, runs the loop)

### runes.json
Static data: all rune definitions including their template point arrays (populated by the dev tool).

### talent_tree.json
Static data: all talent node definitions and their prerequisite connections.

---

## 14. Suggested Rune Set (starter 15 runes)

These are designed to be visually distinct and recognizable by $1. Listed in unlock order.

| Level | Rune | Shape | Attack Type | Damage Type |
|---|---|---|---|---|
| 1 (default) | Slash | Line | basic slash | basic |
| 2 | Ember Ring | Circle | zone_damage | fire |
| 3 | Frost Shard | Triangle | projectile | frost |
| 4 | Chain Strike | Zigzag (W or M shape) | chain_damage | basic |
| 5 | Arcane Nova | Star (5 point) | projectile x5 | arcane |
| 5 | Verdant Shot | Check / arrow | projectile | nature |
| 7 | Fortress | Square | spawn_tower | basic |
| 7 | Void Loop | Figure-8 | orbit | void |
| 9 | Static Surge | Lightning bolt | chain_damage | arcane |
| 9 | Frost Wave | S-curve / wave | zone_damage | frost |
| 12 | Geyser | Caret ^ (upward spike) | delayed_explosion | nature |
| 12 | Void Rift | Down-spiral | spawn_friendly | void |
| 15 | Sundering Cross | X | ray x2 | basic |
| 15 | Nature's Blessing | Heart | aura | nature |
| 20 | Vortex | Spiral | zone_damage + pull | void |

Note: "Slash" is not in `runes.json` — it is the fallback for any unrecognized stroke, so it is always available from level 1.

---

## 15. Open Questions for You

These are design decisions that were not specified — answers will meaningfully affect implementation:

**Core & Game Feel**
1. **Does the player draw freely anywhere on the screen, or only in a designated drawing zone?** Drawing anywhere is more fluid but can obscure the game. A corner-based drawing zone is safer but feels less immersive.
2. **Should drawing pause or slow time?** While the player is actively drawing, should enemies freeze/slow? Or does drawing happen in real-time with enemies still moving? (Real-time is more tense; slow-time is fairer but less punishing.)
3. **Is there a cooldown between rune casts?** Should each rune have a per-rune cooldown, or a global cooldown after any cast, or no cooldown at all (spam-allowed)?
4. **Does the core regenerate HP?** If so, is it passive regen, or only via specific runes/talents?
5. **Can the core be moved or upgraded?** Or is it always at center, always the same size?

**Enemy Specifics**
6. **Do enemies deal damage only on reaching the core, or also over time while adjacent?** (Contact damage vs. "reaching" damage changes how urgent defense feels.)
7. **Should enemies drop loot/pickups** (e.g. EXP orbs that fly to the player, or power-up drops) or is EXP simply granted instantly on death?
8. **Do status effects affect enemy spawn AI?** E.g. can a frozen enemy be "shattered" for bonus damage? Can pulled enemies collide with other enemies for splash?

**Drawing & Runes**
9. **Can the same rune be drawn multiple times in a row immediately?** Or should repeated identical runes have diminishing returns to encourage variety?
10. **Are there "forbidden zones" on the canvas** (e.g. too close to the core) where drawing a rune does something special or is not allowed?
11. **Should unrecognized strokes (the fallback slash) deal damage in a line along the actual drawn path, or just at the path's midpoint/bounding region?** Path-following slash is more satisfying but more complex to implement.

**Progression**
12. **Does the talent tree reset between runs, or persist?** (Roguelite vs. permanent progression — very different design.)
13. **Should there be a "prestige" or meta-progression system**, or is it purely one-run scores?
14. **How is the level-up rune selection handled?** Do you always get all runes as you level (fixed unlock list), or is it a "choose 1 of 3 random runes" draft system like Vampire Survivors?

**Visual & UX**
15. **Mobile / touch support?** Touch events should be handled in parallel with mouse events if yes — affects input system architecture.
16. **Should there be background music / sound effects?** (Web Audio API is available; noting this now if you want a sound system planned.)
17. **Aspect ratio / resizing:** Should the canvas scale to fill the browser window dynamically, or have a fixed resolution?

---

*End of plan. Ready to begin implementation once the open questions are answered.*