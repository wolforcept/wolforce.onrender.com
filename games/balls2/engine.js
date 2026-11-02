'use strict';
/* Neon Pegs, the shell: engine settings, helpers and the parts that rarely change (physics wrapper, effects, camera,
   base renderer, input, UI, frame loop). The game itself is in game.js, loaded right after this script; it must define
   the game config (UPGRADES, PEG_KINDS, ...), Game, GameRenderer (extends Renderer) and SaveStore, and start with new App().start().
   Both files share one global scope (classic scripts, no modules, so opening index.html from disk still works). */

/* =====================================================================
   ENGINE SETTINGS
   ===================================================================== */
const STEP = 1000 / 90;                     // fixed physics step (ms)
const MAX_STEPS = 3;                        // physics steps per frame; more would make a slow phone even slower (it plays in slow motion instead)
const DPR_TIERS = [2, 1.5, 1.25, 1];        // quality tiers: the max canvas pixel ratio
const DEBUG = /[?&]debug\b/.test(location.search);   // ?debug in the URL shows fps, physics ms, render ms and the pixel ratio

/* =====================================================================
   HELPERS
   ===================================================================== */
const SUF = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
function fmt(n) {
    if (!isFinite(n)) return '∞';
    if (n < 1000) return (n >= 100 || Math.abs(n - Math.round(n)) < 0.05) ? String(Math.round(n)) : n.toFixed(1);
    const e = Math.floor(Math.log10(n) / 3);
    if (e >= SUF.length) return n.toExponential(2);
    const v = n / Math.pow(1000, e);
    return (v < 10 ? v.toFixed(2) : v < 100 ? v.toFixed(1) : v.toFixed(0)) + SUF[e];
}
const rand = (a, b) => a + Math.random() * (b - a);

/* =====================================================================
   PHYSICS: everything that talks to Matter.js
   ===================================================================== */
class Physics {
    // hooks: { balls: the live ball list, pegsNear(x0, y0, x1, y1, out), deadBalls(): Dead Balls is running }
    constructor(hooks) {
        const { Engine, Bodies, Composite } = Matter;
        this.engine = Engine.create();
        this.engine.gravity.y = 1;
        this.engine.gravity.scale = GRAVITY_SCALE;
        this.world = this.engine.world;
        const o = { isStatic: true, restitution: 0.5, friction: 0, label: 'wall', collisionFilter: { category: 4, mask: 0xFFFFFFFF, group: 0 } };
        this.walls = [
            Bodies.rectangle(-30, 500000, 60, 1000000, o),    // left (very tall: the board has no maximum height)
            Bodies.rectangle(W + 30, 500000, 60, 1000000, o), // right
            Bodies.rectangle(W / 2, -30, W + 200, 60, o),     // ceiling
        ];
        Composite.add(this.world, this.walls);
        this.installDetector(hooks);
        this.installContactRules(hooks);
    }

    // Matter's detector sweeps over every body on every step, which gets slow with hundreds of pegs.
    // Only balls ever collide (balls ignore each other, pegs and walls are static), so check just the balls against nearby pegs and the walls.
    installDetector({ balls, pegsNear }) {
        if (!(Matter.Detector && Matter.Collision && Matter.Collision.collides)) return;
        const { Detector, Collision } = Matter, walls = this.walls, near = [];
        Detector.collisions = function (detector) {
            const out = [], pairs = detector.pairs;
            const test = (A, B) => {
                const a = A.bounds, b = B.bounds;
                if (b.min.x > a.max.x || b.max.x < a.min.x || b.min.y > a.max.y || b.max.y < a.min.y) return;
                if (!Detector.canCollide(A.collisionFilter, B.collisionFilter)) return;
                const c = Collision.collides(A, B, pairs);
                if (c) out.push(c);
            };
            for (const ball of balls) {
                const A = ball.body, a = A.bounds;
                for (const w of walls) test(A, w);
                for (const p of pegsNear(a.min.x, a.min.y, a.max.x, a.max.y, near)) test(A, p.body);
            }
            return out;
        };
    }

    // Game rules for contacts, applied each step right after Matter sets up its contact pairs and before it resolves them:
    // a ghost ball's contact with a peg becomes a sensor (no push, but the hit is still reported), and Dead Balls takes the bounce out of every contact.
    installContactRules({ balls, deadBalls }) {
        const update = Matter.Pairs.update;
        Matter.Pairs.update = function (pairs, collisions, timestamp) {
            update(pairs, collisions, timestamp);
            const dead = deadBalls();
            for (const b of balls) b.inPeg = false;
            for (const pr of pairs.list) {
                const ball = pr.bodyA.ball || pr.bodyB.ball;
                if (!pr.isActive || !ball) continue;
                const onPeg = !!(pr.bodyA.peg || pr.bodyB.peg);
                if (onPeg) ball.inPeg = true;
                pr.isSensor = onPeg && ball.ghost;
                if (dead) pr.restitution = DEAD_REST;
            }
        };
    }

    onCollisionStart(fn) { Matter.Events.on(this.engine, 'collisionStart', ev => fn(ev.pairs)); }

    addPeg(x, y, r, hex) {
        const { Bodies, Composite } = Matter;
        const po = { isStatic: true, restitution: 0.5, friction: 0, label: 'peg' };
        const body = hex ? Bodies.polygon(x, y, 6, r + 1, po) : Bodies.circle(x, y, r, po);   // Matter's hexagon has a point at the top, like hexPath()
        Composite.add(this.world, body);
        return body;
    }
    // Balls never collide with each other: category 2 is not in their mask (1 = pegs, 4 = walls).
    addBall(x, y, r, vx, vy, bounce) {
        const body = Matter.Bodies.circle(x, y, r, {
            restitution: bounce, friction: 0, frictionStatic: 0, frictionAir: 0, density: 0.002,
            collisionFilter: { category: 2, mask: 5 }, label: 'ball',
        });
        Matter.Body.setVelocity(body, { x: vx, y: vy });
        Matter.Composite.add(this.world, body);
        return body;
    }
    remove(body) { Matter.Composite.remove(this.world, body); }
    movePeg(body, x, y) { Matter.Body.setPosition(body, { x, y }); }
    resizePeg(body, factor) { Matter.Body.scale(body, factor, factor); }

    // velocities in px per 1/60 s, the units setVelocity takes (body.velocity is per 1/90 s physics step)
    velocity(body) { return Matter.Body.getVelocity(body); }
    setVelocity(body, x, y) { Matter.Body.setVelocity(body, { x, y }); }
    setGravity(mult) { this.engine.gravity.scale = GRAVITY_SCALE * mult; }
    update(dt) { Matter.Engine.update(this.engine, dt); }
}

/* =====================================================================
   EFFECTS: particles and floating numbers (decoration only, no game rules)
   ===================================================================== */
class Effects {
    constructor() {
        this.particles = [];
        this.floaters = [];
        this.rings = [];                     // expanding shockwaves
        this.bolts = [];                     // lightning between two points (the jagged path is redrawn every frame, so it flickers)
        this.shake = 0;                      // screen shake strength (CSS px), fades out
        this.flash = { color: '#fff', a: 0 };   // full-screen flash, fades out
    }
    // speed in px/s, angle range in radians (default all around; canvas y points down, so pi..2pi is upwards)
    // always = may go past the normal particle cap (big moments only)
    burst(x, y, color, n, { speed = [40, 130], angle = [0, 6.283], size = 10, life = 450, always = false } = {}) {
        for (let i = 0; i < n && this.particles.length < (always ? 400 : 250); i++) {
            const a = rand(angle[0], angle[1]), s = rand(speed[0], speed[1]);
            this.particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life, max: life, color, size });
        }
    }
    // small numbers are skipped when 30 are already showing; always = shown anyway (big rewards)
    // dim = drawn fainter (rewards a ball collected, not paid out yet)
    float(x, y, text, color, { big = false, huge = false, dim = false, life = 800, always = false } = {}) {
        if (!always && this.floaters.length >= 30) return;
        this.floaters.push({ x, y, text, color, big, huge, dim, life, max: life });
    }
    // a ring growing from r0 to r1; fill = also a soft glowing disc inside it
    ring(x, y, r0, r1, color, { life = 500, width = 4, fill = false } = {}) {
        this.rings.push({ x, y, r0, r1, color, life, max: life, width, fill });
    }
    bolt(x1, y1, x2, y2, color, life = 320) {
        this.bolts.push({ x1, y1, x2, y2, color, life, max: life });
    }
    screen(color, alpha, shake) {
        this.flash = { color, a: Math.max(this.flash.a, alpha) };
        this.shake = Math.max(this.shake, shake);
    }
    tick(dt) {
        this.shake = Math.max(0, this.shake - dt * 0.025);
        this.flash.a = Math.max(0, this.flash.a - dt / 450);
        for (let i = this.rings.length - 1; i >= 0; i--) if ((this.rings[i].life -= dt) <= 0) this.rings.splice(i, 1);
        for (let i = this.bolts.length - 1; i >= 0; i--) if ((this.bolts[i].life -= dt) <= 0) this.bolts.splice(i, 1);
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const q = this.particles[i];
            q.life -= dt; q.x += q.vx * dt / 1000; q.y += q.vy * dt / 1000; q.vy += 300 * dt / 1000;
            if (q.life <= 0) this.particles.splice(i, 1);
        }
        for (let i = this.floaters.length - 1; i >= 0; i--) {
            const f = this.floaters[i];
            f.life -= dt; f.y -= 28 * dt / 1000;
            if (f.life <= 0) this.floaters.splice(i, 1);
        }
    }
}

/* =====================================================================
   CAMERA: vertical scroll position, its limits and momentum
   ===================================================================== */
class Camera {
    constructor(worldH) {
        this.worldH = worldH;                // () => current world height
        this.y = 0;                          // world y at the top of the screen
        this.vel = 0;                        // momentum after a drag (world px per second)
        this.scale = 1;                      // screen px per world px
        this.viewH = 640;                    // canvas height (CSS px)
        this.padTop = 70;                    // screen space covered by the HUD and the button bar
        this.padBot = 100;
    }
    // If the world fits between the HUD and the button bar it is centred and cannot be dragged.
    range() {
        const s = this.scale, worldH = this.worldH();
        const lo = -this.padTop / s, hi = worldH + this.padBot / s - this.viewH / s;
        if (hi >= lo) return [lo, hi];
        const free = this.viewH - this.padTop - this.padBot;
        const c = -(this.padTop + (free - worldH * s) / 2) / s;
        return [c, c];
    }
    clamp() {
        const [lo, hi] = this.range();
        this.y = Math.min(hi, Math.max(lo, this.y));
    }
    // momentum scrolling after a drag is let go
    coast(dt, dragging) {
        if (!dragging && Math.abs(this.vel) > 4) {
            this.y += this.vel * dt / 1000;
            this.vel *= Math.pow(0.04, dt / 1000);
            const [lo, hi] = this.range();
            if (this.y < lo || this.y > hi) this.vel = 0;
        } else if (!dragging) this.vel = 0;
        this.clamp();
    }
}

/* =====================================================================
   RENDERER: canvas, quality tiers and the generic drawing; the game adds its own on top (GameRenderer in game.js)
   ===================================================================== */
const TAU = Math.PI * 2;
const FONT_BIG = '800 15px system-ui,sans-serif', FONT_SMALL = '700 11px system-ui,sans-serif', FONT_HUGE = '900 24px system-ui,sans-serif';

// blend two #rrggbb colours (t = 0..1); cached, since the same few blends are asked for every frame
const mixCache = {};
function mixCol(a, b, t) {
    const k = a + b + t;
    if (mixCache[k]) return mixCache[k];
    const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
    const ch = s => Math.round(((pa >> s) & 255) * (1 - t) + ((pb >> s) & 255) * t);
    return (mixCache[k] = '#' + ((1 << 24) | (ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).slice(1));
}

const glowCache = {};
function glowSprite(color) {
    if (glowCache[color]) return glowCache[color];
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const g = c.getContext('2d');
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, color + 'ff'); gr.addColorStop(0.35, color + '77'); gr.addColorStop(1, color + '00');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    return (glowCache[color] = c);
}
// a hexagon with a point at the top and bottom and flat sides
function hexPath(g, x, y, r) {
    g.beginPath();
    for (let i = 0; i < 6; i++) {
        const a = i * Math.PI / 3 + Math.PI / 6, px = x + r * Math.cos(a), py = y + r * Math.sin(a);
        if (i) g.lineTo(px, py); else g.moveTo(px, py);
    }
    g.closePath();
}

class Renderer {
    constructor(canvas, game, camera) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.game = game;
        this.camera = camera;
        this.dpr = 1;
        this.cssW = 360;
        this.tier = navigator.deviceMemory && navigator.deviceMemory <= 4 ? 1 : 0;   // index in DPR_TIERS; low-memory phones (Chrome reports this) start one down
        this.sprites = {};                   // peg sprites, drawn at device pixels
        this.ox = 0; this.oy = 0;            // screen shake offset of the current frame (device px)
    }

    resize() {
        const r = this.canvas.getBoundingClientRect();
        this.cssW = r.width;
        this.dpr = Math.min(window.devicePixelRatio || 1, DPR_TIERS[this.tier]);
        this.canvas.width = Math.round(r.width * this.dpr);
        this.canvas.height = Math.round(r.height * this.dpr);
        this.camera.scale = r.width / W;
        this.camera.viewH = r.height;
        this.sprites = {};
    }
    // one quality tier down (call resize() after); false when already at the lowest
    lowerQuality() {
        if (this.tier >= DPR_TIERS.length - 1) return false;
        this.tier++;
        return true;
    }

    glow(color, x, y, size, alpha) {
        const ctx = this.ctx;
        ctx.globalAlpha = alpha;
        ctx.drawImage(glowSprite(color), x - size / 2, y - size / 2, size, size);
        ctx.globalAlpha = 1;
    }
    // the old shadowBlur glow, faked with a wide faint stroke under the real one (shadowBlur is very slow on phones)
    glowStroke(color, width, glowW, glowA) {
        const ctx = this.ctx;
        ctx.strokeStyle = color;
        ctx.globalAlpha = glowA; ctx.lineWidth = glowW; ctx.stroke();
        ctx.globalAlpha = 1; ctx.lineWidth = width; ctx.stroke();
    }
    // a: how far we are between the last two physics steps (0..1), so balls and the cannon move smoothly at any refresh rate
    // view: { hover, dragging, editType } from the input
    render(a, view) {
        const { ctx, game, camera } = this, k = this.dpr * camera.scale, shake = game.effects.shake * this.dpr;
        this.ox = shake ? rand(-shake, shake) : 0;   // screen shake: the whole board is offset (device px)
        this.oy = shake ? rand(-shake, shake) : 0;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.worldTransform(k);
        const top = camera.y - 40, bot = camera.y + camera.viewH / camera.scale + 40;   // visible world rows, with a margin
        this.drawScene(a, view, k, top, bot);   // the game draws its board (GameRenderer in game.js)
        this.drawFlash();
    }
    // the game draws its board here (overridden by GameRenderer in game.js)
    drawScene(a, view, k, top, bot) { }
    // world units -> device pixels, scrolled by the camera and offset by the screen shake
    worldTransform(k) { this.ctx.setTransform(k, 0, 0, k, this.ox, this.oy - this.camera.y * k); }

    drawFlash() {
        const f = this.game.effects.flash, ctx = this.ctx;
        if (f.a <= 0) return;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalAlpha = f.a; ctx.fillStyle = f.color;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.globalAlpha = 1;
    }

    // grid, depth markers, the dimmed outside, walls, ceiling and drain line
    drawBoard(top, bot) {
        const ctx = this.ctx, worldH = this.game.worldH;
        const visTop = Math.max(0, top), visBot = Math.min(worldH, bot);   // long lines are only drawn where visible

        // grid, anchored to the top so it stays put when the world grows downward
        ctx.lineWidth = 1 / this.camera.scale;
        ctx.strokeStyle = 'rgba(138,91,255,.10)';
        ctx.beginPath();
        for (let x = 40; x < W; x += 40) { ctx.moveTo(x, visTop); ctx.lineTo(x, visBot); }
        for (let y = 40; y < worldH; y += 40) {
            if (y < top || y > bot) continue;
            ctx.moveTo(0, y); ctx.lineTo(W, y);
        }
        ctx.stroke();

        // depth markers every 200 below the ceiling
        ctx.font = '600 9px system-ui,sans-serif';
        ctx.textAlign = 'left'; ctx.fillStyle = 'rgba(139,134,184,.55)';
        for (let y = 200; y < worldH; y += 200) {
            if (y < top || y > bot) continue;
            ctx.strokeStyle = 'rgba(138,91,255,.22)';
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
            ctx.fillText(String(y), 6, y - 4);
        }

        ctx.fillStyle = 'rgba(2,1,10,.65)';
        ctx.fillRect(-10, worldH, W + 20, 4000);
        ctx.fillRect(-10, -4000, W + 20, 4000);
        ctx.lineCap = 'butt';
        ctx.beginPath(); ctx.moveTo(0, visTop); ctx.lineTo(0, visBot); ctx.moveTo(W, visTop); ctx.lineTo(W, visBot);
        if (top < 0) { ctx.moveTo(0, 0); ctx.lineTo(W, 0); }
        this.glowStroke(this.game.editing ? '#19f5ff' : '#8a5bff', 2.5, 9, 0.22);   // the board edge turns cyan in edit mode
        if (bot > worldH) {
            ctx.setLineDash([10, 8]);
            ctx.beginPath(); ctx.moveTo(0, worldH); ctx.lineTo(W, worldH);
            this.glowStroke('#ff2bd6', 2.5, 9, 0.22);
            ctx.setLineDash([]);
        }
    }

    // lightning: a fresh jagged path every frame (so it flickers), a wide coloured glow under a thin white core
    drawBolts() {
        const ctx = this.ctx, pts = [];
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        for (const bl of this.game.effects.bolts) {
            const dx = bl.x2 - bl.x1, dy = bl.y2 - bl.y1, d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d;
            const n = Math.max(2, Math.ceil(d / 9)), amp = Math.min(6, d * 0.15), a = bl.life / bl.max;
            pts.length = 0;
            for (let i = 0; i <= n; i++) {
                const t = i / n, off = i === 0 || i === n ? 0 : rand(-amp, amp);
                pts.push(bl.x1 + dx * t + nx * off, bl.y1 + dy * t + ny * off);
            }
            for (const [col, w, alpha] of [[bl.color, 5, 0.4 * a], ['#f2fdff', 1.6, a]]) {
                ctx.strokeStyle = col; ctx.lineWidth = w; ctx.globalAlpha = alpha;
                ctx.beginPath(); ctx.moveTo(pts[0], pts[1]);
                for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
                ctx.stroke();
            }
        }
        ctx.globalAlpha = 1;
    }

    drawEffects(top, bot) {
        const ctx = this.ctx, fx = this.game.effects;
        ctx.globalCompositeOperation = 'lighter';
        this.drawBolts();
        for (const q of fx.particles) {
            if (q.y < top || q.y > bot) continue;
            this.glow(q.color, q.x, q.y, q.size, q.life / q.max);
        }
        for (const g of fx.rings) {          // shockwaves: grow fast, then slow down while fading
            const life = g.life / g.max, rr = g.r0 + (g.r1 - g.r0) * (1 - Math.pow(life, 3));
            if (g.fill) this.glow(g.color, g.x, g.y, rr * 2, 0.7 * life);
            ctx.globalAlpha = life; ctx.strokeStyle = g.color; ctx.lineWidth = g.width * (0.4 + 0.6 * life);
            ctx.beginPath(); ctx.arc(g.x, g.y, rr, 0, TAU); ctx.stroke();
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';

        ctx.textAlign = 'center';
        let lastFont = '';
        for (const f of fx.floaters) {
            if (f.y < top || f.y > bot) continue;
            ctx.globalAlpha = Math.min(1, f.life / f.max * 1.6) * (f.dim ? 0.55 : 1);
            const font = f.huge ? FONT_HUGE : f.big ? FONT_BIG : FONT_SMALL;
            if (font !== lastFont) { ctx.font = lastFont = font; }   // setting ctx.font re-parses the string, so only when it changes
            ctx.fillStyle = f.color;
            ctx.fillText(f.text, this.onBoard(f.text, f.x), f.y);
        }
        ctx.globalAlpha = 1;
    }

    // x for centred text, moved in so the whole text stays between the walls (uses the current font)
    onBoard(text, x) {
        const half = this.ctx.measureText(text).width / 2 + 3;
        return Math.min(W - half, Math.max(half, x));
    }

    // the ?debug readout, in a bar just above the buttons
    drawDebug(text) {
        const ctx = this.ctx, y = this.camera.viewH - this.camera.padBot;
        ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
        ctx.fillStyle = 'rgba(0,0,0,.7)'; ctx.fillRect(0, y - 18, this.cssW, 18);
        ctx.fillStyle = '#fff'; ctx.font = '600 11px system-ui,sans-serif'; ctx.textAlign = 'left';
        ctx.fillText(text, 6, y - 5);
    }
}

/* =====================================================================
   INPUT: drag to scroll; in edit mode tap to place / pick up a peg and drag a peg to move it; otherwise tap the cannon to launch
   ===================================================================== */
class Input {
    constructor(canvas, game, camera, ui, store) {
        this.canvas = canvas;
        this.game = game;
        this.camera = camera;
        this.ui = ui;
        this.store = store;
        this.drag = null;
        this.hover = null;                   // mouse position in the world (for the placement preview)

        canvas.addEventListener('pointerdown', e => {
            canvas.setPointerCapture(e.pointerId);
            const w = this.toWorld(e.clientX, e.clientY);
            const peg = game.editing ? game.pegs.at(w.x, w.y) : null;   // in edit mode a drag that starts on a peg moves it
            this.drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, cam0: camera.y, lastX: e.clientX, lastY: e.clientY, lastT: performance.now(), moved: false, peg };
            camera.vel = 0;
        });
        canvas.addEventListener('pointermove', e => this.move(e));
        canvas.addEventListener('pointerup', e => this.end(e, false));
        canvas.addEventListener('pointercancel', e => this.end(e, true));
        canvas.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') this.hover = null; });
        // mouse wheel scrolls the board (the open shop covers the canvas, so there the wheel scrolls the shop list instead)
        canvas.addEventListener('wheel', e => {
            e.preventDefault();
            const px = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * camera.viewH : e.deltaY;   // lines / pages to pixels
            camera.vel = 0;
            camera.y += px / camera.scale;
            camera.clamp();
            this.hover = this.toWorld(e.clientX, e.clientY);   // keep the placement preview under the mouse
        }, { passive: false });
    }
    get dragging() { return !!this.drag; }
    get editType() { return this.ui.edit.selected; }   // the peg type picked in the edit palette

    toWorld(cx, cy) {
        const r = this.canvas.getBoundingClientRect();
        return { x: (cx - r.left) / this.camera.scale, y: (cy - r.top) / this.camera.scale + this.camera.y };
    }

    move(e) {
        const drag = this.drag, cam = this.camera;
        if (e.pointerType === 'mouse') this.hover = this.toWorld(e.clientX, e.clientY);
        if (!drag || e.pointerId !== drag.id) return;
        const dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
        if (!drag.moved && Math.hypot(dx, dy) > 8) drag.moved = true;
        if (!drag.moved) return;
        if (drag.peg) {                      // moving a peg: it follows the pointer
            drag.lastX = e.clientX; drag.lastY = e.clientY;
            const w = this.toWorld(e.clientX, e.clientY);
            this.game.dragPeg(drag.peg, w.x, w.y);
            return;
        }
        cam.y = drag.cam0 - dy / cam.scale;
        cam.clamp();
        const now = performance.now(), dt = now - drag.lastT;
        if (dt > 0) {
            const v = (drag.lastY - e.clientY) / cam.scale / dt * 1000;
            cam.vel = cam.vel * 0.5 + v * 0.5;
        }
        drag.lastY = e.clientY; drag.lastT = now;
    }
    end(e, cancelled) {
        const d = this.drag;
        if (!d || e.pointerId !== d.id) return;
        this.drag = null;
        if (d.peg && d.moved) { this.game.dropPeg(d.peg); this.store.save(); return; }
        if (cancelled) return;
        if (!d.moved) { this.camera.vel = 0; this.tap(this.toWorld(e.clientX, e.clientY)); }
        else if (performance.now() - d.lastT > 90) this.camera.vel = 0;
    }

    // while a peg is dragged near the top or bottom of the visible board, the board scrolls along
    update(dt) {
        const d = this.drag;
        if (!d || !d.peg || !d.moved) return;
        const cam = this.camera, y = d.lastY - this.canvas.getBoundingClientRect().top, edge = 48;
        const dir = y < cam.padTop + edge ? -1 : y > cam.viewH - cam.padBot - edge ? 1 : 0;
        if (!dir) return;
        cam.y += dir * 420 / cam.scale * dt / 1000;
        cam.clamp();
        const w = this.toWorld(d.lastX, d.lastY);
        this.game.dragPeg(d.peg, w.x, w.y);
    }

    tap(w) {
        const game = this.game, ui = this.ui;
        if (game.editing) {                  // edit mode: tap a peg to pick it up, tap anywhere else to place the selected type
            const peg = game.pegs.at(w.x, w.y);
            if (peg) {
                const back = game.pickUp(peg);
                ui.toast(back ? `Peg picked up: ${back} back` : 'Peg picked up');
            } else {
                const why = game.placePeg(this.editType, w.x, w.y);
                if (why) ui.toast(why, 2200);
            }
            ui.refresh();
            this.store.save();
            return;
        }
        ui.launch();                         // play mode: a tap anywhere on the board launches a ball
    }
}

/* =====================================================================
   UI: HUD, buttons, shop overlay and keyboard
   ===================================================================== */
const TABS = { money: 'tabMoney', research: 'tabRp', goo: 'tabGoo', evil: 'tabEvil' };   // shop tab per currency
const setText = (node, s) => { if (node._t !== s) { node._t = s; node.textContent = s; } };
const setHtml = (node, s) => { if (node._t !== s) { node._t = s; node.innerHTML = s; } };
// currency symbols: the same icons as the HUD counters
const CUR_ICON = { money: 'moneyBox', research: 'rpBox', goo: 'gooBox', evil: 'evilBox' };
for (const cur in CUR_ICON) CUR_ICON[cur] = document.querySelector(`#${CUR_ICON[cur]} svg`).outerHTML;
const priceHtml = price => Object.entries(price).map(([cur, a]) => `<span class="pc">${CUR_ICON[cur]}${fmt(a)}</span>`).join('+') || 'FREE';

/* ---------- edit palette: the strip of peg types at the bottom in edit mode, with a description bubble above it ---------- */
class EditPanel {
    constructor(game, renderer) {
        this.game = game;
        this.selected = 'basic';             // the peg type that a tap on the board places
        this.tipType = null;                 // the type whose description is showing
        this.strip = document.getElementById('palStrip');
        this.tip = document.getElementById('palTip');
        this.chips = {};
        for (const type in PEG_KINDS) this.chips[type] = this.makeChip(type, renderer);
    }

    makeChip(type, renderer) {
        const k = PEG_KINDS[type], el = document.createElement('button');
        el.type = 'button'; el.className = 'chip';
        el.style.setProperty('--k', k.color);
        el.innerHTML = '<canvas width="76" height="76"></canvas><span class="pn"></span><span class="pp"></span>';
        renderer.pegIcon(type, el.querySelector('canvas'));
        el.querySelector('.pn').textContent = k.name;
        let pointer = 'mouse';
        el.addEventListener('pointerdown', e => { pointer = e.pointerType; });
        // mouse: hovering shows the description and a click selects
        el.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') this.showTip(type); });
        el.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') this.showTip(null); });
        // touch: a tap selects and shows the description; tapping the selected type again hides it (it stays selected)
        el.addEventListener('click', () => {
            if (pointer === 'mouse') this.selected = type;
            else if (this.selected === type && this.tipType === type) this.showTip(null);
            else { this.selected = type; this.showTip(type); }
            this.refresh();
        });
        this.strip.appendChild(el);
        return { el, price: el.querySelector('.pp') };
    }

    // a type shows up once it is unlocked; blast pegs only while there are some to place
    visible(type) { const p = this.game.progress; return p.unlocked(type) && (type !== 'dual' || p.dualReady.length > 0); }
    priceHtml(type) {
        const p = this.game.progress;
        return type === 'dual' ? `${p.dualReady.length} left` : p.freePegs[type] > 0 ? `${p.freePegs[type]} free` : priceHtml({ money: PEG_KINDS[type].price });
    }
    showTip(type) {
        this.tipType = type;
        this.tip.hidden = !type;
        if (!type) return;
        const k = PEG_KINDS[type];
        this.tip.style.setProperty('--k', k.color);
        this.tip.innerHTML = `<b>${k.name} peg</b> · ${this.priceHtml(type)}<br>${k.desc}`;
    }

    refresh() {
        const game = this.game, p = game.progress;
        if (!this.visible(this.selected)) this.selected = 'basic';
        for (const type in this.chips) {
            const c = this.chips[type], show = this.visible(type);
            c.el.hidden = !show;
            if (!show) continue;
            setHtml(c.price, this.priceHtml(type));
            c.price.classList.toggle('free', type === 'dual' || p.freePegs[type] > 0);
            c.el.classList.toggle('sel', type === this.selected);
            c.el.classList.toggle('cant', !!game.cantPlace(type));
        }
    }
}

class Ui {
    constructor(game, camera, store, renderer) {
        this.game = game;
        this.camera = camera;
        this.store = store;
        this.d = {};
        for (const id of ['app', 'hud', 'bar', 'hint', 'btns', 'settingsBtn', 'launchBtn', 'gooBtn', 'evilBtn', 'upBtn', 'editBtn', 'overlay', 'tabs', 'list',
            'money', 'rpBox', 'rpNum', 'gooBox', 'gooNum', 'evilBox', 'evilNum', 'stBalls', 'stPegs', ...Object.values(TABS)]) this.d[id] = document.getElementById(id);
        this.edit = new EditPanel(game, renderer);
        this.tab = 'money';
        this.toastText = '';
        this.toastUntil = 0;
        this.hudH = -1;

        this.cards = UPGRADES.map(u => this.makeCard(u));
        for (const cur in TABS) this.d[TABS[cur]].addEventListener('click', () => { this.tab = cur; this.d.list.scrollTop = 0; this.refresh(); });
        this.makeResetButton();

        const d = this.d;
        d.upBtn.addEventListener('click', () => this.shopOpen ? this.closeShop() : this.openShop());
        // the Auto Dropper's on/off switch (only shown once it is researched; balls are launched by tapping the board)
        d.launchBtn.addEventListener('click', () => { game.autoOn = !game.autoOn; this.refresh(); store.save(); });
        d.settingsBtn.addEventListener('click', () => this.toast('Settings: coming soon'));   // TODO: settings screen
        d.gooBtn.addEventListener('click', () => this.toast('Goo: coming soon'));              // TODO: goo action
        d.evilBtn.addEventListener('click', () => this.setEvil(!game.evilOn));
        d.editBtn.addEventListener('click', () => this.toggleEdit());
        if (DEBUG) this.debugResources();
        window.addEventListener('keydown', e => {
            if (e.key === 'Escape') { if (game.editing) this.toggleEdit(); else this.closeShop(); }
            else if ((e.key === 'e' || e.key === 'E') && !e.repeat) this.setEvil(!game.evilOn);
            else if (e.code === 'Space' && !e.repeat && !game.editing) { e.preventDefault(); this.launch(); }
        });

        // reading offsetHeight every frame forces a layout; only re-measure when the HUD or button bar actually change size
        this.padObserver = window.ResizeObserver ? new ResizeObserver(() => { this.measurePads(); camera.clamp(); }) : null;
        if (this.padObserver) { this.padObserver.observe(d.hud); this.padObserver.observe(d.bar); }
    }

    get shopOpen() { return this.d.overlay.classList.contains('open'); }

    // ?debug: tapping a resource counter at the top gives 10% more of it (1 when there is none; goo stays within its tank)
    debugResources() {
        const p = this.game.progress;
        for (const [box, cur] of [['moneyBox', 'money'], ['rpBox', 'rp'], ['gooBox', 'goo'], ['evilBox', 'evil']]) {
            const el = document.getElementById(box);
            el.style.pointerEvents = 'auto';
            el.style.cursor = 'pointer';
            el.addEventListener('click', () => {
                p[cur] = p[cur] > 0 ? p[cur] * 1.1 : 1;
                if (cur === 'goo') p.goo = Math.min(p.goo, p.gooCap());
                this.toast(`debug: ${cur} x1.1`, 800);
                this.refresh();
            });
        }
    }

    makeCard(u) {
        const el = document.createElement('div');
        el.className = 'card';
        el.style.setProperty('--c', RES_COL[u.tab]);   // white = money, purple = research, green = goo
        el.innerHTML =
            '<div class="info"><div class="name"><span class="n"></span><span class="lvl"></span></div>' +
            '<div class="desc"></div><div class="stat"></div></div>' +
            '<button class="buy" type="button"><span class="bl"></span><span class="bc"></span></button>';
        const ref = {
            u, el,
            n: el.querySelector('.n'), lvl: el.querySelector('.lvl'),
            desc: el.querySelector('.desc'), stat: el.querySelector('.stat'),
            btn: /** @type {HTMLButtonElement} */ (el.querySelector('.buy')), bl: el.querySelector('.bl'), bc: el.querySelector('.bc'),
        };

        // tap to buy; hold to keep buying. (Buying on click, not pointerdown, so scrolling the list never buys.)
        let holdT = null, holdI = null, suppress = false;
        const clearHold = () => { clearTimeout(holdT); clearInterval(holdI); holdT = holdI = null; };
        ref.btn.addEventListener('pointerdown', () => {
            suppress = false; clearHold();
            holdT = setTimeout(() => {
                suppress = true;
                if (!this.buy(u)) return;
                holdI = setInterval(() => { if (!this.buy(u)) clearHold(); }, 90);
            }, 450);
        });
        ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => ref.btn.addEventListener(ev, clearHold));
        ref.btn.addEventListener('click', () => { if (suppress) { suppress = false; return; } this.buy(u); });
        ref.btn.addEventListener('contextmenu', e => e.preventDefault());
        if (u.danger) ref.btn.classList.add('danger');   // glows red instead of green while running
        if (u.act) ref.btn.style.setProperty('--act', u.act);   // or in its own colour

        this.d.list.appendChild(el);
        return ref;
    }
    makeResetButton() {
        const b = document.createElement('button');
        b.id = 'resetBtn'; b.type = 'button'; b.textContent = 'Reset progress';
        b.addEventListener('click', () => { if (confirm('Erase all progress and start over?')) this.store.reset(); });
        this.d.list.appendChild(b);
    }

    buy(u) {
        if (!this.game.buy(u)) return false;
        if (u.watch) this.closeShop();           // something to watch happens on the board: get the shop out of the way
        else this.refresh();
        return true;
    }
    launch() {
        if (this.game.launch()) return;
        this.toast(this.game.maxBalls() === 1 ? 'A ball is already in play' : 'All balls are in play');
    }
    toast(t, ms = 1600) { this.toastText = t; this.toastUntil = performance.now() + ms; }

    openShop() {
        const d = this.d;
        d.app.classList.add('ov');
        d.app.style.setProperty('--barH', d.bar.offsetHeight + 'px');   // overlay stops above the button bar
        d.overlay.classList.add('open'); d.overlay.setAttribute('aria-hidden', 'false');
        this.refresh();
    }
    closeShop() {
        const d = this.d;
        d.overlay.classList.remove('open'); d.overlay.setAttribute('aria-hidden', 'true');
        d.app.classList.remove('ov');
        this.refresh();
    }
    // edit mode on/off: the bottom bar swaps its buttons for the peg palette, and the game stands still meanwhile
    toggleEdit() {
        const game = this.game, d = this.d;
        if (game.editing) {
            game.exitEdit();
            this.edit.showTip(null);
            d.app.classList.remove('edit');
            this.store.save();
        } else {
            this.closeShop();
            const refund = game.enterEdit();
            if (refund) this.toast(`Special ball cleared: +${evFmt(refund)} EVIL`, 2400);
            d.app.classList.add('edit');
        }
        this.refresh();
    }
    setEvil(on) {
        this.game.evilOn = !!on && this.game.L('evil') > 0;
        this.d.app.classList.toggle('evil', this.game.evilOn);
        this.refresh();
    }

    // how much of the screen the HUD and the button bar cover (the camera keeps the board between them)
    measurePads() {
        const d = this.d, h = d.hud.offsetHeight;
        if (h !== this.hudH) { this.hudH = h; d.app.style.setProperty('--hudH', h + 'px'); }   // the shop starts right below the HUD
        this.camera.padTop = h - 6;
        if (!d.app.classList.contains('ov')) this.camera.padBot = d.bar.offsetHeight;      // measured only while the bar is in its normal state
    }

    refresh() {
        const game = this.game, p = game.progress, pegs = game.pegs, d = this.d;
        game.uiDirty = false;

        setText(d.money, fmt(Math.floor(p.money)));
        const hasRp = p.L('research_lab') > 0, hasGoo = p.L('phlegm_goo') > 0, hasEvil = p.L('evil') > 0;
        d.rpBox.classList.toggle('on', hasRp);
        if (hasRp) setText(d.rpNum, fmt(Math.floor(p.rp * 10) / 10));
        d.gooBox.classList.toggle('on', hasGoo);
        if (hasGoo) setText(d.gooNum, fmt(Math.floor(p.goo)));
        if (!hasEvil && game.evilOn) this.setEvil(false);
        d.evilBox.classList.toggle('on', hasEvil);
        if (hasEvil) setText(d.evilNum, evFmt(Math.floor(p.evil * 100) / 100));
        // the round buttons keep their slot while locked (an empty translucent circle)
        d.evilBtn.classList.toggle('locked', !hasEvil);
        d.evilBtn.classList.toggle('on', game.evilOn);
        d.gooBtn.classList.toggle('locked', !hasGoo);
        setText(d.stBalls, `${fmt(game.ballLoad())}/${game.maxBalls()}`);
        setText(d.stPegs, `${pegs.used()}/${p.slots()}`);   // pegs on the board / peg slots
        setText(d.editBtn, game.editing ? 'DONE' : 'EDIT');
        const hasAuto = p.L('auto_dropper') > 0;
        d.launchBtn.classList.toggle('locked', !hasAuto);
        d.launchBtn.classList.toggle('on', game.autoOn);
        d.launchBtn.classList.toggle('cant', !game.autoOn);

        const canAfford = this.refreshCards();
        const open = this.shopOpen;
        d.upBtn.classList.toggle('alert', Object.keys(canAfford).length > 0 && !open);
        d.upBtn.classList.toggle('open', open);   // the bag icon becomes an X
        d.tabs.classList.toggle('on', hasRp);
        if (!hasRp) this.tab = 'money';
        d.tabGoo.classList.toggle('on', hasGoo);
        d.tabEvil.classList.toggle('on', hasEvil);
        for (const cur in TABS) {
            d[TABS[cur]].classList.toggle('sel', this.tab === cur);
            d[TABS[cur]].classList.toggle('alert', !!canAfford[cur] && this.tab !== cur);
        }

        let h = '', pulse = false;
        const freeSlots = p.slots() - pegs.used(), canPay = p.money >= PEG_KINDS.basic.price || Object.values(p.freePegs).some(n => n > 0);
        if (performance.now() < this.toastUntil) h = this.toastText;
        else if (game.editing) h = 'Tap: place · tap a peg: remove · drag: move';
        else if (pegs.list.length === 0) {
            h = canPay ? 'Tap EDIT to place your first peg' : 'Tap to launch when the cannon is over the bucket';
            pulse = true;
        } else if (freeSlots > 0 && canPay) { h = `${freeSlots} free slot${freeSlots > 1 ? 's' : ''}: tap EDIT to place pegs`; pulse = true; }
        setText(d.hint, h);
        d.hint.classList.toggle('pulse', pulse);
        if (game.editing) this.edit.refresh();
    }

    // updates every upgrade card; returns which currencies can buy something ({ money: true, ... })
    refreshCards() {
        const game = this.game, p = game.progress, canAfford = {};
        let order = '';
        for (const c of this.cards) {
            const u = c.u, unlocked = p.isUnlocked(u), maxed = p.isMaxed(u), l = p.L(u.id);
            c.unlocked = unlocked; order += unlocked ? 1 : 0;
            c.el.classList.toggle('locked', !unlocked);
            c.el.classList.toggle('hid', u.tab !== this.tab);
            if (!unlocked) {
                setText(c.n, '???'); setText(c.lvl, '');
                setText(c.desc, p.lockReason(u));
                setText(c.stat, '');
                setText(c.bl, 'LOCKED'); setText(c.bc, '🔒');
                c.btn.classList.add('cant'); c.btn.classList.remove('maxed');
                continue;
            }
            const once = u.max === 1;                       // bought once (all research): no levels to show, just what it gives
            setText(c.n, u.name);
            setText(c.lvl, u.temp ? (u.status ? u.status(p) : '') : once ? (l ? 'OWNED' : '') : maxed ? `Lv ${l} · MAX` : `Lv ${l}`);
            setText(c.desc, u.desc);
            setText(c.stat, once ? u.stat(1) : (maxed || u.temp) ? u.stat(l) : `${u.stat(l)}  →  ${u.stat(l + 1)}`);
            const tm = game.timer(u.id);
            const afford = !maxed && !tm && p.canAfford(u);
            if (afford) canAfford[u.tab] = true;
            if (tm) { setText(c.bl, ''); setText(c.bc, tm.text || tm.s + 's'); }   // only the seconds left (or the electric ball's charge)
            else { setText(c.bl, maxed ? (once ? 'OWNED' : 'MAXED') : ''); setHtml(c.bc, maxed ? '✓' : priceHtml(p.price(u))); }
            c.btn.classList.toggle('active', !!(tm && tm.active));      // glowing, twinkling green while running
            c.btn.classList.toggle('cant', !afford && !maxed && !(tm && tm.active));
            c.btn.classList.toggle('maxed', maxed);
        }
        if (order !== this.order) this.sortCards(order);
        return canAfford;
    }

    // available upgrades first, then the locked ones, each group in shop order (the reset button stays last)
    sortCards(order) {
        this.order = order;
        const end = document.getElementById('resetBtn');
        for (const c of [...this.cards.filter(c => c.unlocked), ...this.cards.filter(c => !c.unlocked)]) this.d.list.insertBefore(c.el, end);
    }
}

/* =====================================================================
   APP: wires everything together and runs the frame loop
   ===================================================================== */
class App {
    constructor() {
        this.game = new Game();
        this.camera = new Camera(() => this.game.worldH);
        this.store = new SaveStore(this.game);
        this.renderer = new GameRenderer(document.getElementById('game'), this.game, this.camera);
        this.ui = new Ui(this.game, this.camera, this.store, this.renderer);
        this.input = new Input(this.renderer.canvas, this.game, this.camera, this.ui, this.store);

        this.store.autosave();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('orientationchange', () => setTimeout(() => this.resize(), 150));

        this.store.load();
        this.resize();
        this.camera.y = this.camera.range()[0];   // start looking at the top, where the launcher is
        this.ui.refresh();

        this.last = performance.now();
        this.acc = 0;                        // simulated time owed to the physics (ms)
        this.uiT = 0;
        this.skipRender = false;
        this.frameAvg = 16;                  // quality governor: average frame time and how long it has been too slow
        this.slowT = 0;
        this.dbg = { frames: 0, phys: 0, draw: 0, t: 0, text: '' };
        this.frame = this.frame.bind(this);
    }

    resize() {
        this.renderer.resize();
        this.ui.measurePads();
        this.camera.clamp();
    }
    start() { requestAnimationFrame(this.frame); }

    // if frames stay slow (below ~50 fps) for 1.5 seconds, lower the canvas pixel ratio one tier
    governQuality(raw) {
        if (raw >= 250) return;              // ignore the gap after the tab was hidden
        this.frameAvg += (raw - this.frameAvg) * 0.05;
        this.slowT = this.frameAvg > 20 ? this.slowT + raw : 0;
        if (this.slowT > 1500 && this.renderer.lowerQuality()) { this.slowT = 0; this.frameAvg = 16; this.resize(); }
    }

    frame(t) {
        const raw = t - this.last, dt = Math.min(100, raw);
        this.last = t;
        this.governQuality(raw);

        // fixed-timestep physics, identical behaviour on 60 Hz and 120 Hz screens
        const t0 = DEBUG ? performance.now() : 0;
        if (this.game.editing) { this.acc = 0; this.game.effects.tick(dt); }   // edit mode: the game stands still, only the sparkles of placing pegs play out
        else {
            this.acc += dt;
            let n = 0;
            while (this.acc >= STEP && n < MAX_STEPS) { this.game.step(STEP); this.acc -= STEP; n++; }
            if (n === MAX_STEPS) this.acc = Math.min(this.acc, STEP);
        }
        const t1 = DEBUG ? performance.now() : 0;

        if (!this.ui.padObserver) this.ui.measurePads();
        this.input.update(dt);
        this.camera.coast(dt, this.input.dragging);

        // the shop covers most of the board, so the board is only drawn every other frame while it is open
        this.skipRender = this.ui.shopOpen && !this.skipRender;
        if (!this.skipRender) this.renderer.render(this.acc / STEP, this.input);
        if (DEBUG) this.debug(raw, t1 - t0, performance.now() - t1);

        this.uiT += dt;
        if (this.uiT > 100 || this.game.uiDirty) { this.uiT = 0; this.ui.refresh(); }
        requestAnimationFrame(this.frame);
    }

    debug(raw, phys, draw) {
        const d = this.dbg, g = this.game;
        d.frames++; d.phys += phys; d.draw += draw; d.t += raw;
        if (d.t >= 1000) {
            d.text = `${Math.round(d.frames * 1000 / d.t)} fps  phys ${(d.phys / d.frames).toFixed(1)}ms  draw ${(d.draw / d.frames).toFixed(1)}ms  dpr ${this.renderer.dpr}  pegs ${g.pegs.list.length}  balls ${g.balls.length}`;
            d.frames = d.phys = d.draw = d.t = 0;
        }
        this.renderer.drawDebug(d.text);
    }
}
