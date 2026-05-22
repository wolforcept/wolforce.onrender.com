# Expeditions Companion — Build Plan

A mobile-first PWA companion app for the board game **Expeditions**, built with HTML/CSS/vanilla JS + jQuery + Materialize CSS.

---

## 1. Tech Stack & Architecture

- **HTML / CSS / vanilla JS + jQuery** — single-page app, all views in one `index.html`, swapped via jQuery `show`/`hide`.
- **Material UI flavor** → **Materialize CSS** (well-supported, jQuery-friendly). MUI proper is React-only and out of scope.
- **No build step** — files served as-is. Works offline once installed as a PWA.
- **PWA** — `manifest.json` + `service-worker.js` caching all static assets and predefined missions.

## 2. File Structure

```
expeditions companion/
├── index.html                  # single-page shell, all views inside
├── manifest.json               # PWA manifest
├── service-worker.js           # offline cache
├── assets/
│   ├── logo.png                # placeholder
│   ├── icons/                  # objective icons (user-provided, full set — see §4)
│   │   ├── factions/           # {liz} {dem} {fur} ... → factions/<key>.png
│   │   ├── factions_small/     # {_liz} {_dem} ...    → factions_small/<key>.png
│   │   ├── rolls/              # {a} {m} {r} ...      → rolls/<full-name>.png
│   │   ├── rolls_small/        # {_a} {_m} {_r} ...
│   │   ├── dice/               # {1}..{6} {[} {]}
│   │   ├── dice_small/         # {_1}..{_6}
│   │   ├── time.png            # {time}
│   │   ├── time_small.png      # {_time}
│   │   ├── slash.png           # {/}
│   │   ├── slash_small.png     # {_/}
│   │   ├── arrow.png           # {>}
│   │   ├── arrow_small.png     # {_>}
│   │   ├── arrow_infinite.png  # {>>}
│   │   └── arrow_infinite_small.png  # {_>>}
│   ├── pwa-192.png             # PWA install icons
│   └── pwa-512.png
├── css/
│   └── theme.css               # ALL styles + CSS variables for both themes
├── js/
│   ├── app.js                  # view router & bootstrap
│   ├── theme.js                # dark/light theme switching
│   ├── storage.js              # local storage helpers + namespaced keys
│   ├── icon-map.js             # token → image path table
│   ├── text-render.js          # shared token renderer (icons + per-player + formatting)
│   ├── modal.js                # themed confirm/alert modal
│   ├── mission-parser.js       # text file → JSON
│   ├── mission-sync.js         # fetch + cache the server-hosted catalog
│   ├── missions-view.js        # main list page
│   ├── settings-view.js        # settings screen
│   ├── stats-view.js           # statistics screen
│   ├── game-view.js            # in-game logic
│   └── end-view.js             # victory / defeat screen
└── missions/                   # server-hosted catalog (network-first via SW)
    ├── index.json              # source of truth for available missions + versions
    ├── 01-first-steps.txt
    ├── 02-the-rival-camp.txt
    └── 03-summit.txt
```

## 3. Mission File Format

Plain text, sections separated by `----` on its own line. Properties are `key=value`, objectives are lines starting with `*`. The **first section** describes the mission; **every section after** is an act, in order.

```
name=The First Expedition
description=A short trek into the wilderness to test your gear.
difficulty=Easy
actions=10
author=Your Name

----

name=Act 1: Setting Out
flavor=The wind howls as you leave camp.
rules=Discard one supply after each objective.

* Gather your supplies {1:3} {2:5} {3:7} {z}
* Climb the first ridge {v}
* Spot the rival expedition {d}

----

name=Act 2: The Pass
flavor=Snow begins to fall.

* Cross the rope bridge — defend with {h}
* Defeat the bandits {w}{w}
```

**Parsing rules** (in `js/mission-parser.js`):

- Lines `key=value` → property on current section.
- Lines starting with `*` (or `-`) → objective (text trimmed after the marker).
- A line that is exactly `----` (4+ dashes) → start a new section.
- Blank lines & lines starting with `#` → ignored.
- Parser returns: `{ name, description, difficulty, actions, author, acts: [{ name, flavor, rules, objectives: [string] }, ...] }`.
- `actions` is parsed as a number; everything else stays string.
- The mission **header** recognizes: `name`, `description`, `difficulty`, `actions`, `author`. Any other `key=value` lines in the header are preserved in `extra`. Acts recognize: `name`, `flavor`, `rules`; everything else in `extra`.

## 4. Token Replacement in Objective Text

Three kinds of `{...}` tokens, all resolved at render time with the current player count in scope: **icons**, **per-player blocks**, and **formatting wrappers**.

### 4.1 Icon Tokens

Token content (between the braces) is looked up in a single map. Each key has a normal variant and a small variant prefixed with `_`. The map lives in `js/icon-map.js` so it's editable in one place.

| Token | Path | | Token | Path |
|---|---|---|---|---|
| **Factions** | `assets/icons/factions/<key>.png` | | **Rolls** | `assets/icons/rolls/<name>.png` |
| `{all}` | factions/all.png | | `{a}` | rolls/brain.png |
| `{liz}` | factions/liz.png | | `{m}` | rolls/melee.png |
| `{dem}` | factions/dem.png | | `{r}` | rolls/ranged.png |
| `{fur}` | factions/fur.png | | `{g}` | rolls/magic.png |
| `{sqd}` | factions/sqd.png | | `{v}` | rolls/move.png |
| `{avi}` | factions/avi.png | | `{u}` | rolls/util.png |
| `{por}` | factions/por.png | | `{l}` | rolls/build.png |
| `{gold}` | factions/gold.png | | `{c}` | rolls/chip.png |
| `{shield}` | factions/shield.png | | `{d}` | rolls/radar.png |
| `{wiz}` | factions/wiz.png | | `{h}` | rolls/shield.png |
| `{merc}` | factions/merc.png | | `{w}` | rolls/sword.png |
| `{mask}` | factions/mask.png | | `{z}` | rolls/zest.png |
| `{silent}` | factions/silent.png | | | |

| Token | Path | | Token | Path |
|---|---|---|---|---|
| **Dice** | `assets/icons/dice/<n>.png` | | **Misc** | |
| `{1}`..`{6}` | dice/1.png .. 6.png | | `{time}` | time.png |
| `{[}` | dice/left.png | | `{/}` | slash.png |
| `{]}` | dice/right.png | | `{>}` | arrow.png |
| | | | `{>>}` | arrow_infinite.png |

**Small variants** — prefix any key with `_`: `{_z}`, `{_liz}`, `{_time}`, `{_>>}`, etc. → corresponding `*_small.png` file (rolls_small/, factions_small/, dice_small/, or `<name>_small.png` for the root-level ones).

Unknown tokens render as the original literal text (e.g. `{xyz}`) so authors notice bad tokens. Missing image files fall back to the same literal via an `onerror` handler.

### 4.2 Per-Player Tokens

`{N: content}` where `N` is the player count and `content` is arbitrary text (may contain other tokens — see §4.5).

- Example: `"Requires {1:3} {2:5} {3:7} {w}"` with 2 players → `"Requires 5 [sword icon]"`.
- All other player-count blocks are removed.
- If no block matches the current player count, fall back to the **highest defined** block (4 players → uses `{3:...}`).

### 4.3 Formatting Wrappers

Same `{key: content}` shape as per-player blocks, but the key is a formatting code instead of a digit. Each maps to a CSS class defined in `theme.css` so styling honors the active theme.

| Token | Effect | CSS class |
|---|---|---|
| `{b: text}` | **bold** | `.fmt-b` |
| `{i: text}` | *italic* | `.fmt-i` |
| `{u: text}` | underline | `.fmt-u` |
| `{s: text}` | strike-through | `.fmt-s` |
| `{big: text}` | larger | `.fmt-big` |
| `{small: text}` | smaller | `.fmt-small` |
| `{warn: text}` | danger color (theme `--danger`) | `.fmt-warn` |
| `{ok: text}` | accent color (theme `--accent`) | `.fmt-ok` |
| `{dim: text}` | dimmed color (theme `--text-dim`) | `.fmt-dim` |

Renders as `<span class="fmt-<key>">content</span>`. Content can itself contain icons, per-player blocks, or other wrappers (nesting supported, see §4.5).

### 4.4 Disambiguation: three cases

A token `{X}` or `{X: Y}` is classified by what's between the braces:

1. **Contains `:`** with `X` being a digit → per-player block.
2. **Contains `:`** with `X` being a formatting key → formatting wrapper.
3. **No `:`** → icon-map lookup (`X` is the key, with optional `_` prefix for the small variant).
4. **None of the above match** → render as literal `{...}` text (helps authors notice typos).

So `{1}` = dice-one icon, `{1: 3}` = per-player, `{b: bold}` = formatting wrapper, `{u}` = util icon, `{u: text}` = underlined text. Clean separation across all three.

### 4.5 Tokenizer

Two-pass strategy:

1. **Innermost-first replacement loop**: repeatedly match `\{[^{}]*\}` and replace each match using §4.4's dispatch, until no matches remain. The character class `[^{}]` forbids inner braces, so the regex only finds innermost tokens — replacing them first lets the next pass see the now-flat outer tokens. This gives full nesting support.
2. After all braces are resolved, the result is safe HTML for injection (icons + spans only). All user text is HTML-escaped *before* token processing so authored content can't inject markup.

Implemented as **`TextRender.render(rawText, playerCount?)`** in [text-render.js](js/text-render.js), backed by the map in [icon-map.js](js/icon-map.js). Player count defaults to `settings.players` when omitted. Every view that displays mission-authored text (titles, descriptions, difficulty, act names, flavor, rules, objectives, stats labels, end-screen mission name, continue-banner detail) routes through this single function — no view does its own escaping or token replacement.

## 5. Screens (Views)

All views are `<section>` blocks inside `index.html`, toggled by `app.js`. URL hash (`#missions`, `#settings`, `#stats`, `#game`, `#end`) preserves deep-linkable state and lets the browser back button work.

### 5.1 Main / Missions View (`#missions`)
- **Top bar**: logo (`assets/logo.png`) on the left, gear icon top-right opens Settings.
- **Continue banner** (conditional): if `expeditions:currentGame` exists, a prominent **Continue Previous Mission** button is shown directly under the top bar, above the mission list. Shows the mission name and current act on a secondary line (e.g. "The First Expedition — Act 2"). Tapping it jumps straight to the game view, rehydrating state. If no current game exists, the banner is hidden and the list sits flush with the top bar.
- **Mission list**: each row = collapsible card with the mission title. Tap to expand → shows description, author (if set), difficulty, action count, act count, **Start** button, and — for custom (uploaded) missions only — a small **Delete** button (themed red, confirms before removing from local storage; also clears the current-game save if it referred to that mission). Expanding one row collapses any other open row. Starting a new mission while a current game exists prompts to discard the in-progress one first.
- Predefined missions are fetched once from `missions/*.txt` and merged with uploaded ones in the list (uploaded ones tagged visually).
- **No FAB.** Mission upload lives in Settings only.

### 5.2 Settings View (`#settings`)
- **Theme picker**: segmented control — Dark / Light.
- **Number of players**: numeric input (1–6, default 1).
- **Upload mission** button (the only place uploads happen).
- **Statistics** button → opens Stats view.
- **Danger zone** — separate erase buttons, each with a confirm dialog:
  - Erase recorded plays
  - Erase uploaded missions
  - Erase current game (in-progress)
  - Erase settings (resets theme / players)
  - Erase everything
- Back arrow returns to missions list.

### 5.3 Statistics View (`#stats`)
- Aggregate strip at top: total plays, wins, losses, win rate, avg duration.
- Scrollable list of past plays, each showing: mission name, outcome (✓/✗ as colored chip), date, duration, players, actions used/remaining, objectives done, acts reached.
- Tapping a row expands extra detail.

### 5.4 Game View (`#game`)
- **Row 1** (header): small back-arrow on the left, **mission title** centered, full width, compact.
- **Row 2** (action bar): the **action counter** as a large, prominent tappable chip — centered, with a small `+` button beside it. Tap the chip = decrement. When the counter hits 0, this chip becomes the red **Defeated** button that jumps to the End view (defeat).
- **Act header**: act name + flavor + special rules (collapsible to save screen space).
- **Objectives**: stacked rows. Tap toggles done — done objectives get **lower opacity** (no strike-through) and a checkmark on the right. When all objectives in an act are done, the view auto-advances to the next act with a short transition. After the last act → End view (victory).
- **Act progress strip** at the bottom: one circle per act, filled = completed, ringed = current, empty = upcoming.
- Every state change is persisted to `expeditions:currentGame` so a refresh resumes exactly where you were.

### 5.5 End View (`#end`)
- Big banner: **Victory** (green) or **Defeat** (red).
- Stats card: duration (real time, mm:ss), players, mission, actions used, actions remaining, objectives done, acts reached.
- A button: "Back to missions".
- On reaching this view, a record is appended to `expeditions:plays` and `expeditions:currentGame` is cleared.

## 6. Theme System

All visual styling lives in `css/theme.css`. No `style="..."` attributes in HTML; minimal utility classes only.

```css
:root[data-theme="dark"] {
  --bg: #1a1d1f;
  --surface: #25292c;
  --surface-2: #2f3438;
  --text: #e8eaed;
  --text-dim: #9ba1a6;
  --accent: #4caf50;        /* green */
  --accent-strong: #2e7d32;
  --danger: #ef5350;
  --divider: #3a3f44;
}

:root[data-theme="light"] {
  --bg: #f5f5f5;
  --surface: #ffffff;
  --surface-2: #ececec;
  --text: #1a1d1f;
  --text-dim: #5f6368;
  --accent: #2e7d32;
  --accent-strong: #1b5e20;
  --danger: #c62828;
  --divider: #d0d0d0;
}
```

`theme.js` flips `document.documentElement.dataset.theme` and persists choice in `expeditions:settings.theme`. Everything else (cards, chips, buttons, top bar) references the variables — change one block, the whole app re-skins.

## 7. Local Storage Schema

All keys namespaced under `expeditions:`. Each is a self-contained JSON blob so the granular erase buttons can delete them independently.

| Key | Shape | Purpose |
|---|---|---|
| `expeditions:settings` | `{ theme, players }` | Theme & player count |
| `expeditions:uploadedMissions` | `[{ id, filename, raw, parsed }]` | User-uploaded missions |
| `expeditions:currentGame` | `{ missionId, startedAt, players, actionsRemaining, actsState: [{ objectivesDone: [bool] }], currentAct }` | In-progress run |
| `expeditions:plays` | `[{ missionName, outcome, startedAt, durationMs, players, actionsUsed, actionsRemaining, objectivesDone, actsReached, totalActs }]` | History for stats screen |

`storage.js` exposes `get(key) / set(key, val) / remove(key) / clearAll()` and one helper per category.

## 8. PWA & Mission Sync

- `manifest.json` — name "Expeditions Companion", `display: standalone`, theme & background colors pulled from the dark palette, icons 192/512.
- `service-worker.js` — **cache-first** for the app shell (HTML, CSS, JS, static icons); **network-first** for anything under `missions/` so the catalog stays fresh while remaining offline-capable.
- Registered in `app.js` on load. On `localhost` the SW is intentionally **unregistered** in dev to avoid stale-cache headaches.

### Mission catalog sync

The server hosts `missions/index.json`:

```json
{
  "version": 1,
  "missions": [
    { "id": "first-steps", "url": "missions/01-first-steps.txt", "version": 1 },
    ...
  ]
}
```

On boot, `js/mission-sync.js`:

1. Reads from `expeditions:syncedMissions` in localStorage → mission list renders instantly.
2. In the background, fetches `index.json` (network-first via SW; falls back to cached copy if offline).
3. For each entry whose per-mission `version` is newer than the cached one, fetches the `.txt` file and stores the parsed result.
4. Removes from the cache any missions that no longer appear in the index.
5. Fires `missions:changed` when any of the above happens → list re-renders.

Each mission lives in two places:

- **Service-worker cache**: holds the raw HTTP responses for offline use.
- **localStorage (`expeditions:syncedMissions`)**: holds the parsed JSON the UI reads from, keyed by id, with metadata like `version` and `syncedAt`.

To publish a new mission (or update one): add it to `missions/`, bump its `version` in `index.json`, deploy. Clients pick it up on next visit (online) without needing to redeploy the SW.
- Viewport meta + Materialize's responsive grid → mobile-first by default. Touch targets ≥ 44px. Top bars and act-strip respect `safe-area-inset` for iOS notch.

## 9. Sample Predefined Missions

Three sample `.txt` missions covering 1 / 2 / 3 acts, varying difficulties, exercising every icon and the per-player block syntax so parsing & rendering can be confirmed end-to-end.

## 10. Build Order

1. Scaffolding: `index.html`, `theme.css` with variables, Materialize CDN, jQuery CDN, view containers.
2. `theme.js` + settings-driven theme switch (with persistence).
3. `storage.js` (the central data layer).
4. `mission-parser.js` + sanity check using a sample file.
5. Missions view (list, accordion, predefined fetch).
6. Settings view (theme picker, players input, upload, granular erase).
7. Game view (act flow, objective toggling, action counter, auto-advance).
8. End view (victory/defeat, record play).
9. Stats view (aggregate + list).
10. PWA wiring (`manifest.json`, `service-worker.js`, install prompt).
11. Placeholder logo + 6 icon PNGs + PWA icons.
12. Polish: transitions, accessibility (aria), iOS safe-area, manual mobile pass.

## Open Points

1. **Asset delivery** — I'll create the `assets/icons/...` folder structure empty and add a tiny placeholder `logo.png`. You drop in your existing `factions/`, `rolls/`, `dice/`, etc. folders (and their `_small` counterparts) under `assets/icons/`. Missing files fall back to the literal token text so the app stays usable while assets are being added. OK?
2. **Per-player fallback** — when player count exceeds defined blocks, fall back to the **highest defined** block. Acceptable?
3. **Formatting set** — picked `b / i / u / s / big / small / warn / ok / dim` for the wrappers. Want me to add/remove any? (Nesting is supported, so `{b: requires {w}}` and `{1: {warn: one {w}}} {2: {warn: two {w}{w}}}` both work.)
