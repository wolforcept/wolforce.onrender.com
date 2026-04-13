// ============================================================
// RUNE SLASH — game.js
// ============================================================

// ─── CONSTANTS ──────────────────────────────────────────────
const C = {
  RECOGNITION_THRESHOLD: 0.78,
  RESAMPLE_N: 64,
  SCALE_SIZE: 250,
  SLASH_HIT_RADIUS: 28,
  GAP_SEGMENT_MS: 350,
  CORE_MAX_HP: 200,
  BASE_EXP: 100,
  EXP_SCALE: 1.4,
  WAVE_INTERVAL: 30,
  PARTICLE_POOL: 600,
  DAMAGE_COLORS: {
    basic: '#C0C0C0', fire: '#FF6B35', frost: '#4FC3F7',
    arcane: '#CE93D8', nature: '#81C784', void: '#7E57C2'
  },
  PARTICLE_THEMES: {
    fire:   { colors: ['#FF6B35','#FF9800','#FFCC02','#FF3D00'], gravity: -60, spread: 80 },
    frost:  { colors: ['#80DEEA','#4FC3F7','#B3E5FC','#FFFFFF'], gravity: 20, spread: 60 },
    arcane: { colors: ['#CE93D8','#9C27B0','#E1BEE7','#7B1FA2'], gravity: -20, spread: 90 },
    nature: { colors: ['#81C784','#4CAF50','#A5D6A7','#DCEDC8'], gravity: 30, spread: 70 },
    void:   { colors: ['#7E57C2','#4527A0','#B39DDB','#1A237E'], gravity: -30, spread: 100 },
    basic:  { colors: ['#BDBDBD','#9E9E9E','#FFFFFF','#757575'], gravity: 10, spread: 60 }
  }
};

// ─── MATH HELPERS ───────────────────────────────────────────
function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
function lerp(a, b, t) { return a + (b - a) * t; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function randRange(a, b) { return a + Math.random() * (b - a); }
function angle(a, b) { return Math.atan2(b.y - a.y, b.x - a.x); }
function vecFromAngle(a, mag = 1) { return { x: Math.cos(a) * mag, y: Math.sin(a) * mag }; }

// ─── $1 RECOGNIZER ──────────────────────────────────────────
class DollarRecognizer {
  constructor() { this.templates = []; }

  addTemplate(name, pts, id) {
    const norm = this._normalize(pts);
    this.templates.push({ name, pts: norm, id });
  }

  recognize(pts) {
    if (pts.length < 5) return { name: null, score: 0 };
    const candidate = this._normalize(pts);
    let best = Infinity, match = null;
    for (const t of this.templates) {
      const d = this._goldenSearch(candidate, t.pts, -Math.PI / 4, Math.PI / 4);
      if (d < best) { best = d; match = t; }
    }
    const score = match ? 1 - best / (0.5 * Math.sqrt(2) * C.SCALE_SIZE) : 0;
    return { name: match?.name || null, id: match?.id || null, score };
  }

  _normalize(pts) {
    let p = this._resample(pts, C.RESAMPLE_N);
    const a = this._indicativeAngle(p);
    p = this._rotateBy(p, -a);
    p = this._scaleTo(p, C.SCALE_SIZE);
    p = this._translateTo(p, { x: 0, y: 0 });
    return p;
  }

  _resample(pts, n) {
    let I = this._pathLength(pts) / (n - 1);
    let D = 0;
    const result = [{ ...pts[0] }];
    for (let i = 1; i < pts.length; i++) {
      const d = dist(pts[i - 1], pts[i]);
      if (D + d >= I) {
        const t = (I - D) / d;
        const q = { x: pts[i-1].x + t*(pts[i].x-pts[i-1].x), y: pts[i-1].y + t*(pts[i].y-pts[i-1].y) };
        result.push(q);
        pts = [q, ...pts.slice(i)];
        i = 0; D = 0;
      } else D += d;
    }
    while (result.length < n) result.push({ ...pts[pts.length - 1] });
    return result;
  }

  _pathLength(pts) {
    let d = 0;
    for (let i = 1; i < pts.length; i++) d += dist(pts[i-1], pts[i]);
    return d;
  }

  _indicativeAngle(pts) {
    const c = this._centroid(pts);
    return Math.atan2(pts[0].y - c.y, pts[0].x - c.x);
  }

  _centroid(pts) {
    const s = pts.reduce((a, p) => ({ x: a.x + p.x, y: a.y + p.y }), { x: 0, y: 0 });
    return { x: s.x / pts.length, y: s.y / pts.length };
  }

  _rotateBy(pts, r) {
    const c = this._centroid(pts);
    return pts.map(p => ({
      x: (p.x - c.x) * Math.cos(r) - (p.y - c.y) * Math.sin(r) + c.x,
      y: (p.x - c.x) * Math.sin(r) + (p.y - c.y) * Math.cos(r) + c.y
    }));
  }

  _scaleTo(pts, sz) {
    let minX=Infinity, maxX=-Infinity, minY=Infinity, maxY=-Infinity;
    for (const p of pts) { minX=Math.min(minX,p.x); maxX=Math.max(maxX,p.x); minY=Math.min(minY,p.y); maxY=Math.max(maxY,p.y); }
    const w = maxX - minX, h = maxY - minY, scale = sz / Math.max(w, h);
    return pts.map(p => ({ x: (p.x - minX) * scale, y: (p.y - minY) * scale }));
  }

  _translateTo(pts, to) {
    const c = this._centroid(pts);
    return pts.map(p => ({ x: p.x + to.x - c.x, y: p.y + to.y - c.y }));
  }

  _goldenSearch(pts, templ, a, b) {
    const phi = 0.618;
    let x1 = phi * a + (1 - phi) * b;
    let x2 = (1 - phi) * a + phi * b;
    let f1 = this._pathDist(this._rotateBy(pts, x1), templ);
    let f2 = this._pathDist(this._rotateBy(pts, x2), templ);
    for (let i = 0; i < 12; i++) {
      if (f1 < f2) { b = x2; x2 = x1; f2 = f1; x1 = phi*a+(1-phi)*b; f1 = this._pathDist(this._rotateBy(pts,x1),templ); }
      else { a = x1; x1 = x2; f1 = f2; x2 = (1-phi)*a+phi*b; f2 = this._pathDist(this._rotateBy(pts,x2),templ); }
    }
    return Math.min(f1, f2);
  }

  _pathDist(a, b) {
    let d = 0;
    for (let i = 0; i < a.length; i++) d += dist(a[i], b[i]);
    return d / a.length;
  }
}

// ─── PARTICLE SYSTEM ────────────────────────────────────────
class ParticleSystem {
  constructor() { this.pool = []; for (let i = 0; i < C.PARTICLE_POOL; i++) this.pool.push({ alive: false }); }

  emit(x, y, theme, count = 12) {
    const th = C.PARTICLE_THEMES[theme] || C.PARTICLE_THEMES.basic;
    for (let i = 0; i < count; i++) {
      const p = this.pool.find(p => !p.alive);
      if (!p) break;
      const spd = randRange(40, 160);
      const a = randRange(0, Math.PI * 2);
      p.alive = true; p.x = x; p.y = y;
      p.vx = Math.cos(a)*spd + randRange(-th.spread/3, th.spread/3);
      p.vy = Math.sin(a)*spd + randRange(-th.spread/3, th.spread/3);
      p.life = randRange(0.4, 0.9); p.maxLife = p.life;
      p.r = randRange(2, 5);
      p.color = th.colors[Math.floor(Math.random() * th.colors.length)];
      p.gravity = th.gravity;
    }
  }

  emitBurst(x, y, theme, count = 30) { this.emit(x, y, theme, count); }

  emitTrail(x, y, theme) { this.emit(x, y, theme, 3); }

  update(dt) {
    for (const p of this.pool) {
      if (!p.alive) continue;
      p.x += p.vx * dt; p.y += (p.vy + p.gravity) * dt;
      p.vx *= 0.96; p.vy *= 0.96;
      p.life -= dt;
      if (p.life <= 0) p.alive = false;
    }
  }

  draw(ctx) {
    for (const p of this.pool) {
      if (!p.alive) continue;
      const alpha = p.life / p.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * alpha, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
}

// ─── FLOATING NUMBERS ───────────────────────────────────────
class FloatingNumber {
  constructor(x, y, text, color) {
    this.x = x; this.y = y; this.text = text; this.color = color;
    this.life = 1.2; this.maxLife = 1.2; this.vy = -60;
  }
  update(dt) { this.y += this.vy * dt; this.vy *= 0.94; this.life -= dt; }
  draw(ctx) {
    const alpha = Math.min(1, this.life / this.maxLife * 2);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(this.text, this.x, this.y);
    ctx.globalAlpha = 1;
  }
}

// ─── STATUS EFFECT ──────────────────────────────────────────
class StatusEffect {
  constructor(type, magnitude, duration) {
    this.type = type; this.magnitude = magnitude;
    this.duration = duration; this.remaining = duration;
  }
}

// ─── ENEMY ──────────────────────────────────────────────────
class Enemy {
  constructor(x, y, type) {
    Object.assign(this, Enemy.TYPES[type] || Enemy.TYPES.grunt);
    this.x = x; this.y = y; this.type = type;
    this.maxHp = this.hp; this.dead = false;
    this.statuses = [];
    this.vx = 0; this.vy = 0;
    this.flashTimer = 0;
    this.id = Math.random();
  }

  static TYPES = {
    grunt:   { hp: 40,  speed: 70,  size: 16, damage: 10, exp: 8,  shape: 5, color: '#E57373', resistances: {} },
    runner:  { hp: 20,  speed: 140, size: 10, damage: 6,  exp: 10, shape: 3, color: '#FFB74D', resistances: {} },
    tank:    { hp: 180, speed: 35,  size: 28, damage: 25, exp: 30, shape: 6, color: '#78909C', resistances: { fire: 0.3 } },
    splitter:{ hp: 60,  speed: 60,  size: 18, damage: 8,  exp: 15, shape: 4, color: '#FF8A65', resistances: {} },
    charger: { hp: 50,  speed: 80,  size: 20, damage: 20, exp: 18, shape: 3, color: '#EF9A9A', resistances: {} },
    swarm:   { hp: 10,  speed: 90,  size: 8,  damage: 4,  exp: 4,  shape: 3, color: '#FFCC80', resistances: {} },
    boss:    { hp: 800, speed: 25,  size: 40, damage: 50, exp: 200,shape: 8, color: '#B71C1C', resistances: { fire: 0.2, frost: 0.2 } }
  };

  getEffectiveSpeed() {
    let spd = this.speed;
    for (const s of this.statuses) {
      if (s.type === 'freeze' || s.type === 'root') return 0;
      if (s.type === 'slow') spd *= (1 - s.magnitude / 100);
    }
    return Math.max(0, spd);
  }

  hasPull() { return this.statuses.some(s => s.type === 'pull'); }
  getPull() { return this.statuses.find(s => s.type === 'pull'); }

  hasStatus(type) { return this.statuses.some(s => s.type === type); }

  applyStatus(se) {
    // freeze cancels slow/root, burn+freeze cancel each other
    if (se.type === 'freeze') this.statuses = this.statuses.filter(s => s.type !== 'slow' && s.type !== 'root');
    if (se.type === 'burn' && this.hasStatus('freeze')) {
      this.statuses = this.statuses.filter(s => s.type !== 'freeze' && s.type !== 'burn');
      return 'steam';
    }
    if (se.type === 'freeze' && this.hasStatus('burn')) {
      this.statuses = this.statuses.filter(s => s.type !== 'burn' && s.type !== 'freeze');
      return 'steam';
    }
    const existing = this.statuses.find(s => s.type === se.type);
    if (existing) {
      existing.remaining = Math.max(existing.remaining, se.duration);
      existing.magnitude = Math.max(existing.magnitude, se.magnitude);
    } else {
      this.statuses.push(new StatusEffect(se.type, se.magnitude, se.duration));
    }
    return null;
  }

  update(dt, coreX, coreY, enemies) {
    // Update statuses
    for (let i = this.statuses.length - 1; i >= 0; i--) {
      this.statuses[i].remaining -= dt;
      if (this.statuses[i].remaining <= 0) this.statuses.splice(i, 1);
    }

    // Push impulse decay
    if (this._pushVx) { this.x += this._pushVx * dt; this._pushVx *= 0.8; if (Math.abs(this._pushVx) < 1) this._pushVx = 0; }
    if (this._pushVy) { this.y += this._pushVy * dt; this._pushVy *= 0.8; if (Math.abs(this._pushVy) < 1) this._pushVy = 0; }

    const spd = this.getEffectiveSpeed();

    // Pull toward target
    const pull = this.getPull();
    if (pull && pull.targetX !== undefined) {
      const a = Math.atan2(pull.targetY - this.y, pull.targetX - this.x);
      this.x += Math.cos(a) * pull.magnitude * dt;
      this.y += Math.sin(a) * pull.magnitude * dt;
    } else if (spd > 0) {
      // Move toward core
      const a = Math.atan2(coreY - this.y, coreX - this.x);
      // Slight separation from neighbors
      let sepX = 0, sepY = 0;
      for (const e of enemies) {
        if (e === this || e.dead) continue;
        const d = dist(this, e);
        if (d < this.size * 2.5 && d > 0) {
          sepX += (this.x - e.x) / d;
          sepY += (this.y - e.y) / d;
        }
      }
      this.x += (Math.cos(a) * spd + sepX * 15) * dt;
      this.y += (Math.sin(a) * spd + sepY * 15) * dt;
    }

    if (this.flashTimer > 0) this.flashTimer -= dt;
  }

  takeDamage(amount, damageType, gs) {
    const resist = this.resistances[damageType] || 0;
    const pen = gs.talents.getStat('fireResPen') || 0;
    const effectiveResist = Math.max(0, resist - pen);
    const vuln = this.hasStatus('vulnerability') ? (1 + (this.statuses.find(s=>s.type==='vulnerability')?.magnitude||0)/100) : 1;
    const actual = Math.floor(amount * (1 - effectiveResist) * vuln);
    this.hp -= actual;
    this.flashTimer = 0.1;
    gs.floats.push(new FloatingNumber(this.x, this.y - this.size, actual.toString(), C.DAMAGE_COLORS[damageType] || '#fff'));
    if (this.hp <= 0 && !this.dead) {
      this.dead = true;
      return actual;
    }
    return actual;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Status color tint
    let tint = null;
    if (this.hasStatus('freeze') || this.hasStatus('freeze')) tint = '#80DEEA';
    else if (this.hasStatus('slow')) tint = '#4FC3F7';
    else if (this.hasStatus('burn')) tint = '#FF6B35';
    else if (this.hasStatus('root')) tint = '#66BB6A';
    else if (this.hasStatus('pull')) tint = '#CE93D8';

    // Flash white on hit
    const flash = this.flashTimer > 0;

    const col = flash ? '#FFFFFF' : (tint || this.color);
    ctx.fillStyle = col;
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth = 1.5;

    // Draw polygon shape
    const sides = this.shape;
    const r = this.size;
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const a = (i / sides) * Math.PI * 2 - Math.PI / 2;
      i === 0 ? ctx.moveTo(Math.cos(a)*r, Math.sin(a)*r) : ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Arcane mark indicator
    if (this.hasStatus('arcane_mark')) {
      ctx.strokeStyle = '#CE93D8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, r + 5, 0, Math.PI * 2);
      ctx.stroke();
    }

    // HP bar
    if (this.hp < this.maxHp) {
      const bw = this.size * 2.5, bh = 4;
      const bx = -bw / 2, by = -r - 10;
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(bx, by, bw, bh);
      ctx.fillStyle = this.hp / this.maxHp > 0.5 ? '#76ff03' : this.hp / this.maxHp > 0.25 ? '#ffea00' : '#ff1744';
      ctx.fillRect(bx, by, bw * (this.hp / this.maxHp), bh);
    }

    ctx.restore();
  }
}

// ─── PROJECTILE ─────────────────────────────────────────────
class Projectile {
  constructor(x, y, vx, vy, opts) {
    this.x = x; this.y = y; this.vx = vx; this.vy = vy;
    this.damage = opts.damage; this.damageType = opts.damageType;
    this.statusEffect = opts.statusEffect;
    this.statusDuration = opts.statusDuration || 2;
    this.statusMagnitude = opts.statusMagnitude || 50;
    this.r = opts.r || 6; this.color = opts.color || '#fff';
    this.dead = false; this.owner = opts.owner || 'player';
    this.maxDist = opts.maxDist || 800;
    this.traveled = 0;
    this.trail = [];
  }

  update(dt) {
    const dx = this.vx*dt, dy = this.vy*dt;
    this.x += dx; this.y += dy;
    this.traveled += Math.hypot(dx, dy);
    this.trail.push({x:this.x,y:this.y});
    if (this.trail.length > 8) this.trail.shift();
    if (this.traveled > this.maxDist) this.dead = true;
  }

  draw(ctx) {
    // Trail
    for (let i = 0; i < this.trail.length - 1; i++) {
      const alpha = i / this.trail.length * 0.5;
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.r * (i / this.trail.length);
      ctx.beginPath();
      ctx.moveTo(this.trail[i].x, this.trail[i].y);
      ctx.lineTo(this.trail[i+1].x, this.trail[i+1].y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Core
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

// ─── ORBIT ORB ──────────────────────────────────────────────
class OrbitOrb {
  constructor(cx, cy, opts, angleOffset) {
    this.cx = cx; this.cy = cy;
    this.radius = opts.orbitRadius || 100;
    this.speed = opts.orbitSpeed || 2.5;
    this.angle = angleOffset || 0;
    this.damage = opts.baseDamage || 20;
    this.damageType = opts.damageType || 'void';
    this.color = opts.color || '#7E57C2';
    this.duration = opts.orbitDuration || 8;
    this.remaining = this.duration;
    this.r = 8;
    this.dead = false;
    this.hitCooldowns = new Map();
    this.statusEffect = opts.statusEffect;
    this.statusDuration = opts.statusDuration || 0.5;
    this.statusMagnitude = opts.statusMagnitude || 150;
  }

  update(dt, core) {
    this.cx = core.x; this.cy = core.y;
    this.angle += this.speed * dt;
    this.remaining -= dt;
    if (this.remaining <= 0) this.dead = true;
    // Cooldown cleanup
    for (const [k, v] of this.hitCooldowns) if (v - dt <= 0) this.hitCooldowns.delete(k); else this.hitCooldowns.set(k, v - dt);
  }

  get x() { return this.cx + Math.cos(this.angle) * this.radius; }
  get y() { return this.cy + Math.sin(this.angle) * this.radius; }

  canHit(enemy) { return !this.hitCooldowns.has(enemy.id); }
  markHit(enemy) { this.hitCooldowns.set(enemy.id, 0.5); }

  draw(ctx) {
    const alpha = Math.min(1, this.remaining / this.duration * 2);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }
}

// ─── TOWER ──────────────────────────────────────────────────
class Tower {
  constructor(x, y, opts, gs) {
    this.x = x; this.y = y;
    this.hp = (opts.towerHP || 60) + (gs.talents.getStat('towerHP') || 0);
    this.maxHp = this.hp;
    this.range = (opts.towerRange || 160) * (gs.talents.getStat('towerRange') || 1);
    this.attackRate = (opts.towerAttackRate || 1.2) * (gs.talents.getStat('towerAttackRate') || 1);
    this.damage = opts.baseDamage || 20;
    this.damageType = opts.damageType || 'basic';
    this.cooldown = 0;
    this.duration = opts.towerDuration || 15;
    this.remaining = this.duration;
    this.dead = false;
    this.color = '#90A4AE';
  }

  update(dt, enemies, gs) {
    this.remaining -= dt;
    if (this.remaining <= 0 || this.hp <= 0) { this.dead = true; return; }
    if (this.cooldown > 0) { this.cooldown -= dt; return; }

    // Find nearest enemy in range
    let closest = null, closestD = Infinity;
    for (const e of enemies) {
      if (e.dead) continue;
      const d = dist(this, e);
      if (d < this.range && d < closestD) { closestD = d; closest = e; }
    }
    if (closest) {
      const a = angle(this, closest);
      const spd = 300;
      gs.projectiles.push(new Projectile(this.x, this.y, Math.cos(a)*spd, Math.sin(a)*spd, {
        damage: this.damage, damageType: this.damageType,
        color: C.DAMAGE_COLORS[this.damageType], r: 5, owner: 'tower'
      }));
      this.cooldown = 1 / this.attackRate;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = this.color;
    ctx.strokeStyle = '#546E7A';
    ctx.lineWidth = 2;
    // Base
    ctx.fillRect(-10, -10, 20, 20);
    ctx.strokeRect(-10, -10, 20, 20);
    // Gun
    ctx.fillStyle = '#B0BEC5';
    ctx.fillRect(-3, -18, 6, 14);

    // HP bar
    const bw = 24, bh = 3;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(-bw/2, 14, bw, bh);
    ctx.fillStyle = '#76ff03';
    ctx.fillRect(-bw/2, 14, bw * (this.hp/this.maxHp), bh);

    // Duration pulse
    const alpha = Math.min(1, this.remaining / this.duration * 3);
    ctx.globalAlpha = alpha * 0.3;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.restore();
  }
}

// ─── FRIENDLY ───────────────────────────────────────────────
class Friendly {
  constructor(x, y, opts, gs) {
    this.x = x; this.y = y;
    this.hp = opts.friendlyHP || 40;
    this.maxHp = this.hp;
    this.range = opts.friendlyRange || 120;
    this.attackRate = opts.friendlyAttackRate || 1.5;
    this.damage = (opts.baseDamage || 18) * (gs.talents.getStat('friendlyDamage') || 1);
    this.damageType = opts.damageType || 'void';
    this.duration = (opts.friendlyDuration || 10) + (gs.talents.getStat('friendlyDuration') || 0);
    this.remaining = this.duration;
    this.statusEffect = opts.statusEffect;
    this.statusDuration = opts.statusDuration || 0.4;
    this.statusMagnitude = opts.statusMagnitude || 150;
    this.cooldown = 0;
    this.dead = false;
    this.color = C.DAMAGE_COLORS[opts.damageType] || '#7E57C2';
    this.angle = 0;
  }

  update(dt, enemies, gs) {
    this.remaining -= dt;
    if (this.remaining <= 0 || this.hp <= 0) { this.dead = true; return; }
    this.angle += dt * 3;
    if (this.cooldown > 0) { this.cooldown -= dt; return; }

    let closest = null, closestD = Infinity;
    for (const e of enemies) {
      if (e.dead) continue;
      const d = dist(this, e);
      if (d < this.range && d < closestD) { closestD = d; closest = e; }
    }
    if (closest) {
      const a = angle(this, closest);
      gs.projectiles.push(new Projectile(this.x, this.y, Math.cos(a)*250, Math.sin(a)*250, {
        damage: this.damage, damageType: this.damageType,
        statusEffect: this.statusEffect, statusDuration: this.statusDuration,
        statusMagnitude: this.statusMagnitude,
        color: this.color, r: 4, owner: 'friendly'
      }));
      this.cooldown = 1 / this.attackRate;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 12;
    // Diamond shape
    ctx.beginPath();
    ctx.moveTo(0, -12); ctx.lineTo(9, 0); ctx.lineTo(0, 12); ctx.lineTo(-9, 0);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
  }
}

// ─── DELAYED EXPLOSION ──────────────────────────────────────
class DelayedExplosion {
  constructor(x, y, opts) {
    this.x = x; this.y = y;
    this.fuse = opts.fuseTime || 1.5;
    this.remaining = this.fuse;
    this.radius = opts.explosionRadius || 120;
    this.damage = opts.baseDamage || 90;
    this.damageType = opts.damageType || 'nature';
    this.statusEffect = opts.statusEffect;
    this.statusMagnitude = opts.statusMagnitude || 320;
    this.color = C.DAMAGE_COLORS[opts.damageType] || '#81C784';
    this.triggered = false;
    this.dead = false;
  }

  update(dt) {
    this.remaining -= dt;
    if (this.remaining <= 0 && !this.triggered) { this.triggered = true; }
  }

  draw(ctx) {
    const t = 1 - this.remaining / this.fuse;
    const pulse = Math.sin(t * Math.PI * 8) * 0.5 + 0.5;
    ctx.globalAlpha = 0.3 + pulse * 0.4;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 8 + pulse * 6, 0, Math.PI*2);
    ctx.fill();
    // Countdown ring
    ctx.globalAlpha = 0.7;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 14, -Math.PI/2, -Math.PI/2 + (1-t) * Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
}

// ─── LAND MINE ──────────────────────────────────────────────
class LandMine {
  constructor(x, y, opts) {
    this.x = x; this.y = y;
    this.triggerRadius = (opts.mineRadius || 40);
    this.explosionRadius = (opts.mineRadius || 40) * 2.5;
    this.damage = opts.baseDamage || 60;
    this.damageType = opts.damageType || 'fire';
    this.duration = 20;
    this.remaining = this.duration;
    this.color = C.DAMAGE_COLORS[opts.damageType] || '#FF6B35';
    this.triggered = false;
    this.dead = false;
  }

  update(dt, enemies) {
    this.remaining -= dt;
    if (this.remaining <= 0) { this.dead = true; return; }
    for (const e of enemies) {
      if (e.dead) continue;
      if (dist(this, e) < this.triggerRadius) { this.triggered = true; return; }
    }
  }

  draw(ctx) {
    const pulse = Math.sin(Date.now() / 300) * 0.3 + 0.7;
    ctx.globalAlpha = pulse;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 6, 0, Math.PI*2);
    ctx.fill();
    ctx.globalAlpha = 0.2;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.triggerRadius, 0, Math.PI*2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
}

// ─── AURA ───────────────────────────────────────────────────
class Aura {
  constructor(cx, cy, opts) {
    this.cx = cx; this.cy = cy;
    this.radius = opts.auraRadius || 150;
    this.damage = opts.baseDamage || 20;
    this.damageType = opts.damageType || 'nature';
    this.duration = opts.auraDuration || 5;
    this.remaining = this.duration;
    this.tickRate = opts.auraTickRate || 1;
    this.tickCooldown = this.tickRate;
    this.statusEffect = opts.statusEffect;
    this.statusDuration = opts.statusDuration || 1.5;
    this.color = C.DAMAGE_COLORS[opts.damageType] || '#81C784';
    this.dead = false;
  }

  update(dt, enemies, gs) {
    this.remaining -= dt;
    if (this.remaining <= 0) { this.dead = true; return; }
    this.tickCooldown -= dt;
    if (this.tickCooldown <= 0) {
      this.tickCooldown = this.tickRate;
      for (const e of enemies) {
        if (e.dead) continue;
        if (dist({ x: this.cx, y: this.cy }, e) < this.radius) {
          e.takeDamage(this.damage, this.damageType, gs);
          if (this.statusEffect) applyStatusToEnemy(e, this.statusEffect, this.statusDuration, 50, null, null, gs);
        }
      }
    }
  }

  draw(ctx) {
    const alpha = this.remaining / this.duration * 0.25;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.radius, 0, Math.PI*2);
    ctx.fill();
    ctx.globalAlpha = Math.min(0.7, alpha * 3);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.radius, 0, Math.PI*2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
}

// ─── ZONE EFFECT (expanding ring) ───────────────────────────
class ZoneEffect {
  constructor(x, y, opts) {
    this.x = x; this.y = y;
    this.maxRadius = opts.radius || 140;
    this.currentRadius = 0;
    this.growTime = opts.radiusGrowthTime || 0.3;
    this.elapsed = 0;
    this.damage = opts.baseDamage;
    this.damageType = opts.damageType;
    this.statusEffect = opts.statusEffect;
    this.statusDuration = opts.statusDuration;
    this.statusMagnitude = opts.statusMagnitude || 50;
    this.color = C.DAMAGE_COLORS[opts.damageType] || '#fff';
    this.dead = false;
    this.hitIds = new Set();
    this.secondaryEffect = opts.secondaryEffect;
  }

  update(dt, enemies, gs) {
    this.elapsed += dt;
    this.currentRadius = Math.min(this.maxRadius, (this.elapsed / this.growTime) * this.maxRadius);

    // Pull phase for vortex
    if (this.secondaryEffect === 'void_explosion' && this.elapsed < this.growTime * 0.7) {
      for (const e of enemies) {
        if (e.dead) continue;
        if (dist(this, e) < this.maxRadius * 1.5) {
          applyStatusToEnemy(e, 'pull', 0.1, gs.talents.getStat('voidPullStrength') * 200 || 200, this.x, this.y, gs);
        }
      }
    }

    // Damage wave
    for (const e of enemies) {
      if (e.dead || this.hitIds.has(e.id)) continue;
      if (dist(this, e) < this.currentRadius) {
        this.hitIds.add(e.id);
        e.takeDamage(this.damage, this.damageType, gs);
        if (this.statusEffect) applyStatusToEnemy(e, this.statusEffect, this.statusDuration, this.statusMagnitude, this.x, this.y, gs);
        gs.particles.emit(e.x, e.y, C.PARTICLE_THEMES[this.damageType] ? this.damageType : 'basic', 8);
      }
    }

    if (this.elapsed > this.growTime + 0.3) this.dead = true;
  }

  draw(ctx) {
    const progress = clamp(this.elapsed / this.growTime, 0, 1);
    const fadeOut = clamp((this.elapsed - this.growTime) / 0.3, 0, 1);
    const alpha = (1 - fadeOut) * 0.6;
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.currentRadius, 0, Math.PI*2);
    ctx.stroke();
    ctx.globalAlpha = alpha * 0.15;
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }
}

// ─── RAY EFFECT ─────────────────────────────────────────────
class RayEffect {
  constructor(cx, cy, angle, opts) {
    this.cx = cx; this.cy = cy;
    this.angle = angle;
    this.length = opts.rayLength || 600;
    this.width = opts.rayWidth || 12;
    this.damage = opts.baseDamage || 70;
    this.damageType = opts.damageType || 'basic';
    this.statusEffect = opts.statusEffect;
    this.statusDuration = opts.statusDuration || 3;
    this.statusMagnitude = opts.statusMagnitude || 25;
    this.color = C.DAMAGE_COLORS[opts.damageType] || '#fff';
    this.life = 0.25;
    this.remaining = this.life;
    this.dead = false;
    this.hitIds = new Set();
  }

  get ex() { return this.cx + Math.cos(this.angle) * this.length; }
  get ey() { return this.cy + Math.sin(this.angle) * this.length; }

  pointOnRay(px, py) {
    // Distance from point to line segment
    const dx = this.ex - this.cx, dy = this.ey - this.cy;
    const len2 = dx*dx + dy*dy;
    if (len2 === 0) return dist({x:this.cx,y:this.cy},{x:px,y:py});
    let t = ((px-this.cx)*dx + (py-this.cy)*dy) / len2;
    t = clamp(t, 0, 1);
    return dist({x:px,y:py},{x:this.cx+t*dx,y:this.cy+t*dy});
  }

  update(dt, enemies, gs) {
    this.remaining -= dt;
    if (this.remaining <= 0) { this.dead = true; return; }
    for (const e of enemies) {
      if (e.dead || this.hitIds.has(e.id)) continue;
      if (this.pointOnRay(e.x, e.y) < this.width + e.size) {
        this.hitIds.add(e.id);
        e.takeDamage(this.damage, this.damageType, gs);
        if (this.statusEffect) applyStatusToEnemy(e, this.statusEffect, this.statusDuration, this.statusMagnitude, null, null, gs);
        gs.particles.emit(e.x, e.y, this.damageType, 10);
      }
    }
  }

  draw(ctx) {
    const alpha = this.remaining / this.life;
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width * alpha;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 25;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(this.cx, this.cy);
    ctx.lineTo(this.ex, this.ey);
    ctx.stroke();
    // Core line
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = this.width * alpha * 0.3;
    ctx.beginPath();
    ctx.moveTo(this.cx, this.cy);
    ctx.lineTo(this.ex, this.ey);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }
}

// ─── CHAIN LIGHTNING EFFECT ─────────────────────────────────
class ChainEffect {
  constructor(segments, color) {
    this.segments = segments; // [{x1,y1,x2,y2}]
    this.color = color;
    this.life = 0.3; this.remaining = this.life;
    this.dead = false;
  }

  update(dt) { this.remaining -= dt; if (this.remaining <= 0) this.dead = true; }

  draw(ctx) {
    const alpha = this.remaining / this.life;
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 15;
    for (const s of this.segments) {
      ctx.beginPath();
      ctx.moveTo(s.x1, s.y1);
      // Jitter for lightning look
      const mx = (s.x1+s.x2)/2 + randRange(-10,10);
      const my = (s.y1+s.y2)/2 + randRange(-10,10);
      ctx.quadraticCurveTo(mx, my, s.x2, s.y2);
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }
}

// ─── SLASH VISUAL ───────────────────────────────────────────
class SlashVisual {
  constructor(pts, color) {
    this.pts = pts; this.color = color;
    this.life = 0.5; this.remaining = this.life;
    this.dead = false;
  }
  update(dt) { this.remaining -= dt; if (this.remaining <= 0) this.dead = true; }
  draw(ctx) {
    if (this.pts.length < 2) return;
    const alpha = this.remaining / this.life;
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(this.pts[0].x, this.pts[0].y);
    for (let i = 1; i < this.pts.length; i++) ctx.lineTo(this.pts[i].x, this.pts[i].y);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }
}

// ─── HELPER: apply status to enemy ──────────────────────────
function applyStatusToEnemy(enemy, type, duration, magnitude, tx, ty, gs) {
  if (!enemy || enemy.dead) return;
  const se = new StatusEffect(type, magnitude, duration);
  if (tx !== null && tx !== undefined) { se.targetX = tx; se.targetY = ty; }
  const result = enemy.applyStatus(se);
  if (result === 'steam') {
    gs.particles.emitBurst(enemy.x, enemy.y, 'frost', 20);
    enemy.takeDamage(15, 'basic', gs);
  }
  if (type === 'push' && tx !== null && tx !== undefined) {
    const a = Math.atan2(enemy.y - ty, enemy.x - tx);
    enemy._pushVx = Math.cos(a) * magnitude;
    enemy._pushVy = Math.sin(a) * magnitude;
  }
}

// ─── TALENT SYSTEM ──────────────────────────────────────────
class TalentSystem {
  constructor() {
    this.nodes = [];
    this.connections = [];
    this.applied = new Set();
    this.points = 0;
  }

  load(data) {
    this.nodes = data.nodes;
    this.connections = data.connections;
  }

  canAfford(nodeId) {
    const node = this.nodes.find(n => n.id === nodeId);
    if (!node) return false;
    return this.points >= node.cost;
  }

  meetsReqs(nodeId) {
    const node = this.nodes.find(n => n.id === nodeId);
    if (!node) return false;
    return node.requires.every(r => this.applied.has(r));
  }

  purchase(nodeId) {
    const node = this.nodes.find(n => n.id === nodeId);
    if (!node || this.applied.has(nodeId)) return false;
    if (!this.canAfford(nodeId) || !this.meetsReqs(nodeId)) return false;
    this.points -= node.cost;
    this.applied.add(nodeId);
    return true;
  }

  // Returns the effective value of a stat, applying all purchased modifiers
  getStat(stat, base = 1) {
    let val = base;
    for (const id of this.applied) {
      const node = this.nodes.find(n => n.id === id);
      if (!node) continue;
      const e = node.effect;
      if (e.stat !== stat) continue;
      if (e.op === 'add') val += e.value;
      else if (e.op === 'multiply') val *= e.value;
      else if (e.op === 'set') val = e.value;
    }
    return val;
  }

  reset() { this.applied = new Set(); this.points = 0; }
}

// ─── LEVEL SYSTEM ───────────────────────────────────────────
class LevelSystem {
  constructor() {
    this.level = 1; this.exp = 0;
    this.expToNext = 100;
    this.unlockedRunes = [];
  }

  addExp(amount, multiplier = 1) {
    const gained = Math.floor(amount * multiplier);
    this.exp += gained;
    const leveled = [];
    while (this.exp >= this.expToNext) {
      this.exp -= this.expToNext;
      this.level++;
      this.expToNext = Math.floor(C.BASE_EXP * Math.pow(this.level, C.EXP_SCALE));
      leveled.push(this.level);
    }
    return leveled;
  }

  getRunes(allRunes) {
    return allRunes.filter(r => r.unlockedAtLevel <= this.level);
  }
}

// ─── DRAWING SYSTEM ─────────────────────────────────────────
class DrawingSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.currentStroke = [];
    this.isDrawing = false;
    this.lastPointTime = 0;
    this.gapCheckInterval = null;
    this.segmentBuffer = [];
    this.onStroke = null; // callback(pts)
    this._bind();
  }

  _bind() {
    const getPos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const src = e.touches ? e.touches[0] : e;
      return { x: src.clientX - rect.left, y: src.clientY - rect.top };
    };

    const onStart = (e) => {
      e.preventDefault();
      const p = getPos(e);
      this.isDrawing = true;
      this.currentStroke = [p];
      this.lastPointTime = Date.now();
    };

    const onMove = (e) => {
      e.preventDefault();
      if (!this.isDrawing) return;
      const p = getPos(e);
      const now = Date.now();

      // Time-gap segmentation
      if (now - this.lastPointTime > C.GAP_SEGMENT_MS && this.currentStroke.length >= 5) {
        this._submitSegment([...this.currentStroke]);
        this.currentStroke = [p];
      } else {
        this.currentStroke.push(p);
      }
      this.lastPointTime = now;
    };

    const onEnd = (e) => {
      e.preventDefault();
      if (!this.isDrawing) return;
      this.isDrawing = false;
      if (this.currentStroke.length >= 5) {
        this._submitSegment([...this.currentStroke]);
      }
      this.currentStroke = [];
    };

    this.canvas.addEventListener('mousedown', onStart);
    this.canvas.addEventListener('mousemove', onMove);
    this.canvas.addEventListener('mouseup', onEnd);
    this.canvas.addEventListener('mouseleave', onEnd);
    this.canvas.addEventListener('touchstart', onStart, { passive: false });
    this.canvas.addEventListener('touchmove', onMove, { passive: false });
    this.canvas.addEventListener('touchend', onEnd, { passive: false });
  }

  _submitSegment(pts) {
    if (this.onStroke) this.onStroke(pts);
    this._drawCompletedStroke(pts);
  }

  _drawCompletedStroke(pts) {
    // Stroke visuals are handled by the game layer
  }

  drawCurrentStroke(ctx) {
    if (this.currentStroke.length < 2) return;
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(this.currentStroke[0].x, this.currentStroke[0].y);
    for (let i = 1; i < this.currentStroke.length; i++) ctx.lineTo(this.currentStroke[i].x, this.currentStroke[i].y);
    ctx.stroke();
    ctx.restore();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

// ─── RUNE SYSTEM ────────────────────────────────────────────
class RuneSystem {
  constructor() {
    this.recognizer = new DollarRecognizer();
    this.allRunes = [];
    this.unlockedRunes = [];
    this.draftPool = [];
  }

  load(runesData) {
    this.allRunes = runesData.runes;
    for (const r of this.allRunes) {
      this.recognizer.addTemplate(r.name, r.templatePoints.map(([x,y]) => ({x,y})), r.id);
    }
  }

  unlockRune(id) {
    const r = this.allRunes.find(r => r.id === id);
    if (r && !this.unlockedRunes.find(u => u.id === id)) this.unlockedRunes.push(r);
  }

  // Returns 3 random available runes for level-up draft
  getDraftChoices(level) {
    const available = this.allRunes.filter(r => r.unlockedAtLevel <= level && !this.unlockedRunes.find(u => u.id === r.id));
    if (available.length === 0) return [];
    const shuffled = available.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(3, shuffled.length));
  }

  recognize(pts) {
    // Only match against unlocked runes
    const tempRecognizer = new DollarRecognizer();
    for (const r of this.unlockedRunes) {
      tempRecognizer.addTemplate(r.name, r.templatePoints.map(([x,y]) => ({x,y})), r.id);
    }
    return tempRecognizer.recognize(pts);
  }

  getRuneById(id) { return this.allRunes.find(r => r.id === id); }
  getRuneByName(name) { return this.allRunes.find(r => r.name === name); }
}

// ─── COMBAT SYSTEM ──────────────────────────────────────────
function executeCombat(gs, pts, runeId) {
  const rune = runeId ? gs.runes.getRuneById(runeId) : null;

  if (!rune) {
    // Basic slash
    executeSlash(gs, pts);
    return;
  }

  const effect = rune.effect;
  const centroid = pts.reduce((a, p) => ({ x: a.x + p.x, y: a.y + p.y }), {x:0,y:0});
  centroid.x /= pts.length; centroid.y /= pts.length;

  const strokeStart = pts[0];
  const strokeEnd = pts[pts.length - 1];
  const strokeAngle = Math.atan2(strokeEnd.y - strokeStart.y, strokeEnd.x - strokeStart.x);

  switch (effect.attackType) {
    case 'zone_damage': executeZone(gs, centroid, effect, rune); break;
    case 'projectile': executeProjectiles(gs, centroid, strokeAngle, effect, rune); break;
    case 'chain_damage': executeChain(gs, centroid, effect, rune); break;
    case 'orbit': executeOrbit(gs, effect, rune); break;
    case 'spawn_tower': executeTower(gs, centroid, effect); break;
    case 'spawn_friendly': executeFriendly(gs, centroid, effect); break;
    case 'delayed_explosion': executeDelayed(gs, centroid, effect); break;
    case 'land_mine': executeMine(gs, centroid, effect); break;
    case 'ray': executeRay(gs, gs.core, strokeAngle, effect, rune); break;
    case 'aura': executeAura(gs, gs.core, effect); break;
  }

  gs.particles.emitBurst(centroid.x, centroid.y, rune.particleTheme || 'basic', 25);
  gs.effects.slashes.push(new SlashVisual(pts, rune.visualColor || '#fff'));

  // Show rune name
  gs.floats.push(new FloatingNumber(centroid.x, centroid.y - 30, rune.name, rune.visualColor || '#fff'));
}

function executeSlash(gs, pts) {
  const baseDmg = gs.talents.getStat('slashBaseDamage', 10);
  const hitRadius = gs.talents.getStat('slashHitRadius', C.SLASH_HIT_RADIUS);
  let hits = 0;
  for (const e of gs.enemies) {
    if (e.dead) continue;
    // Check if enemy is near the stroke path
    for (let i = 0; i < pts.length - 1; i++) {
      const dx = pts[i+1].x - pts[i].x, dy = pts[i+1].y - pts[i].y;
      const len2 = dx*dx + dy*dy;
      if (len2 === 0) continue;
      let t = ((e.x-pts[i].x)*dx + (e.y-pts[i].y)*dy) / len2;
      t = clamp(t, 0, 1);
      const cx = pts[i].x + t*dx, cy = pts[i].y + t*dy;
      if (dist({x:cx,y:cy}, e) < hitRadius + e.size) {
        e.takeDamage(baseDmg, 'basic', gs);
        gs.particles.emit(e.x, e.y, 'basic', 6);
        hits++;
        break;
      }
    }
  }
  gs.effects.slashes.push(new SlashVisual(pts, '#C0C0C0'));
}

function executeZone(gs, pos, effect, rune) {
  const radius = effect.radius * (gs.talents.getStat(rune.effect.damageType === 'fire' ? 'fireZoneRadius' : rune.effect.damageType === 'frost' ? 'frostZoneRadius' : 1));
  gs.effects.zones.push(new ZoneEffect(pos.x, pos.y, { ...effect, radius }));
  // Heal on nature aura
  if (effect.damageType === 'nature') gs.core.heal(0);
}

function executeProjectiles(gs, pos, strokeAngle, effect, rune) {
  const count = effect.projectileCount + (rune.id === 'arcane_nova' ? (gs.talents.getStat('arcaneNovaCount', 0)) : 0) + (gs.talents.getStat('projectileCount', 0));
  const spd = effect.projectileSpeed * gs.talents.getStat('projectileSpeed', 1);
  const dmg = effect.baseDamage + gs.talents.getStat(effect.damageType + 'BaseDamage', 0);
  const color = C.DAMAGE_COLORS[effect.damageType] || '#fff';

  if (effect.aimed) {
    for (let i = 0; i < count; i++) {
      const spread = (count - 1) * 0.15;
      const a = strokeAngle + (i - (count-1)/2) * (count > 1 ? spread/(count-1) : 0);
      gs.projectiles.push(new Projectile(pos.x, pos.y, Math.cos(a)*spd, Math.sin(a)*spd, {
        damage: dmg, damageType: effect.damageType,
        statusEffect: effect.statusEffect, statusDuration: effect.statusDuration, statusMagnitude: effect.statusMagnitude,
        color, r: 7
      }));
    }
  } else {
    // Spread evenly in all directions
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      gs.projectiles.push(new Projectile(pos.x, pos.y, Math.cos(a)*spd, Math.sin(a)*spd, {
        damage: dmg, damageType: effect.damageType,
        statusEffect: effect.statusEffect, statusDuration: effect.statusDuration,
        color, r: 7
      }));
    }
  }
}

function executeChain(gs, pos, effect, rune) {
  const maxChain = effect.chainCount + gs.talents.getStat('chainCount', 0);
  const range = effect.chainRange * gs.talents.getStat('chainRange', 1);
  const decay = effect.chainDecay || 0.8;
  let damage = effect.baseDamage;
  const color = C.DAMAGE_COLORS[effect.damageType] || '#FFD700';
  const segments = [];

  // Find nearest enemy to centroid
  let current = pos;
  const hit = new Set();

  for (let i = 0; i < maxChain; i++) {
    let nearest = null, nearestD = range;
    for (const e of gs.enemies) {
      if (e.dead || hit.has(e.id)) continue;
      const d = dist(current, e);
      if (d < nearestD) { nearestD = d; nearest = e; }
    }
    if (!nearest) break;
    segments.push({ x1: current.x, y1: current.y, x2: nearest.x, y2: nearest.y });
    nearest.takeDamage(damage, effect.damageType, gs);
    if (effect.statusEffect) applyStatusToEnemy(nearest, effect.statusEffect, effect.statusDuration || 3, effect.statusMagnitude || 50, null, null, gs);
    gs.particles.emit(nearest.x, nearest.y, rune.particleTheme, 8);
    hit.add(nearest.id);
    current = nearest;
    damage *= decay;
  }

  if (segments.length > 0) gs.effects.chains.push(new ChainEffect(segments, color));
}

function executeOrbit(gs, effect, rune) {
  const count = (effect.orbitCount || 2) + gs.talents.getStat('orbitCount', 0);
  const dmg = (effect.baseDamage || 22) * gs.talents.getStat('orbitDamage', 1);
  for (let i = 0; i < count; i++) {
    gs.effects.orbs.push(new OrbitOrb(gs.core.x, gs.core.y, { ...effect, baseDamage: dmg, color: rune.visualColor }, (i / count) * Math.PI * 2));
  }
}

function executeTower(gs, pos, effect) {
  if (gs.effects.towers.length >= 3) gs.effects.towers.shift().dead = true;
  gs.effects.towers.push(new Tower(pos.x, pos.y, effect, gs));
}

function executeFriendly(gs, pos, effect) {
  gs.effects.friendlies.push(new Friendly(pos.x, pos.y, effect, gs));
}

function executeDelayed(gs, pos, effect) {
  gs.effects.delayedExplosions.push(new DelayedExplosion(pos.x, pos.y, effect));
}

function executeMine(gs, pos, effect) {
  const radius = effect.mineRadius * gs.talents.getStat('mineRadius', 1);
  gs.effects.mines.push(new LandMine(pos.x, pos.y, { ...effect, mineRadius: radius }));
}

function executeRay(gs, core, strokeAngle, effect, rune) {
  const count = effect.rayCount || 1;
  const width = (effect.rayWidth || 12) + gs.talents.getStat('rayWidth', 0);
  for (let i = 0; i < count; i++) {
    const a = strokeAngle + (i * Math.PI / count);
    gs.effects.rays.push(new RayEffect(core.x, core.y, a, { ...effect, rayWidth: width, color: rune.visualColor }));
    if (count > 1) gs.effects.rays.push(new RayEffect(core.x, core.y, a + Math.PI, { ...effect, rayWidth: width, color: rune.visualColor }));
  }
}

function executeAura(gs, core, effect) {
  // Heal core
  if (effect.coreHealAmount) core.heal(effect.coreHealAmount);
  gs.effects.auras.push(new Aura(core.x, core.y, effect));
}

// ─── CORE ENTITY ────────────────────────────────────────────
class Core {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.r = 22;
    this.hp = C.CORE_MAX_HP; this.maxHp = C.CORE_MAX_HP;
    this.pulseTimer = 0;
    this.hitFlash = 0;
    this.regenTimer = 0;
  }

  update(dt, gs) {
    this.pulseTimer += dt;
    if (this.hitFlash > 0) this.hitFlash -= dt;
    // Core regen from talent
    const regen = gs.talents.getStat('coreRegen', 0);
    if (regen > 0) {
      this.regenTimer += dt;
      if (this.regenTimer >= 1) { this.regenTimer -= 1; this.heal(regen); }
    }
  }

  heal(amount) { this.hp = Math.min(this.maxHp, this.hp + amount); }
  takeDamage(amount) { this.hp -= amount; this.hitFlash = 0.3; }
  isDead() { return this.hp <= 0; }

  draw(ctx) {
    const pulse = Math.sin(this.pulseTimer * 2) * 0.15 + 0.85;
    const flash = this.hitFlash > 0;
    const r = this.r;

    // Outer glow ring
    ctx.shadowColor = flash ? '#FF1744' : '#7B68EE';
    ctx.shadowBlur = 30 * pulse;
    ctx.strokeStyle = flash ? '#FF1744' : '#7B68EE';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, r + 10, 0, Math.PI * 2);
    ctx.stroke();

    // Main body
    ctx.fillStyle = flash ? '#FF5252' : '#1A1A2E';
    ctx.strokeStyle = flash ? '#FF1744' : '#9C88FF';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Inner rune symbol
    ctx.fillStyle = flash ? '#FF8A80' : '#9C88FF';
    ctx.font = `${Math.floor(r * 0.9)}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✦', this.x, this.y);

    // HP ring
    const hpAngle = (this.hp / this.maxHp) * Math.PI * 2;
    ctx.strokeStyle = this.hp / this.maxHp > 0.5 ? '#76ff03' : this.hp / this.maxHp > 0.25 ? '#FFD600' : '#FF1744';
    ctx.lineWidth = 4;
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(this.x, this.y, r + 6, -Math.PI / 2, -Math.PI / 2 + hpAngle);
    ctx.stroke();

    ctx.shadowBlur = 0;
  }
}

// ─── ENEMY MANAGER ──────────────────────────────────────────
class EnemyManager {
  constructor() {
    this.spawnTimer = 0;
    this.spawnInterval = 2.5;
  }

  getSpawnRate(wave) {
    return Math.max(0.4, 2.5 - wave * 0.18);
  }

  getEnemyComposition(wave) {
    if (wave < 2) return [['grunt', 1]];
    if (wave < 4) return [['grunt', 3], ['runner', 1]];
    if (wave < 6) return [['grunt', 2], ['runner', 2], ['tank', 1]];
    if (wave < 8) return [['grunt', 2], ['runner', 2], ['tank', 1], ['splitter', 1]];
    if (wave < 12) return [['grunt', 1], ['runner', 2], ['tank', 2], ['splitter', 2], ['charger', 1]];
    return [['runner', 2], ['tank', 2], ['splitter', 2], ['charger', 2], ['swarm', 3]];
  }

  pickType(wave) {
    const comp = this.getEnemyComposition(wave);
    const total = comp.reduce((s, [, w]) => s + w, 0);
    let r = Math.random() * total;
    for (const [type, w] of comp) { r -= w; if (r <= 0) return type; }
    return 'grunt';
  }

  spawnEnemy(canvas, wave) {
    const margin = 60;
    const side = Math.floor(Math.random() * 4);
    let x, y;
    switch (side) {
      case 0: x = Math.random() * canvas.width; y = -margin; break;
      case 1: x = canvas.width + margin; y = Math.random() * canvas.height; break;
      case 2: x = Math.random() * canvas.width; y = canvas.height + margin; break;
      case 3: x = -margin; y = Math.random() * canvas.height; break;
    }
    return new Enemy(x, y, this.pickType(wave));
  }

  update(dt, gs) {
    this.spawnTimer += dt;
    const interval = this.getSpawnRate(gs.wave);
    while (this.spawnTimer >= interval) {
      this.spawnTimer -= interval;
      const count = gs.wave >= 10 && Math.random() < 0.3 ? 3 : 1;
      for (let i = 0; i < count; i++) gs.enemies.push(this.spawnEnemy(gs.canvas, gs.wave));
    }

    // Boss every 5 waves
    if (gs.wave > 0 && gs.wave % 5 === 0 && !gs._bossPending) {
      gs._bossPending = true;
      gs.enemies.push(this.spawnEnemy(gs.canvas, gs.wave));
      gs.enemies[gs.enemies.length-1].type = 'boss';
      Object.assign(gs.enemies[gs.enemies.length-1], Enemy.TYPES.boss);
      gs.enemies[gs.enemies.length-1].maxHp = gs.enemies[gs.enemies.length-1].hp;
    }
  }
}

// ─── UI SYSTEM ──────────────────────────────────────────────
class UISystem {
  drawHUD(ctx, gs) {
    const w = ctx.canvas.width;

    // Top bar background
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, w, 54);

    // HP bar
    const hpW = 200, hpH = 16, hpX = 16, hpY = 16;
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fillRect(hpX, hpY, hpW, hpH);
    const hpRatio = gs.core.hp / gs.core.maxHp;
    ctx.fillStyle = hpRatio > 0.5 ? '#76ff03' : hpRatio > 0.25 ? '#FFD600' : '#FF1744';
    ctx.fillRect(hpX, hpY, hpW * hpRatio, hpH);
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(hpX, hpY, hpW, hpH);
    ctx.fillStyle = '#fff';
    ctx.font = '11px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`HP  ${Math.ceil(gs.core.hp)} / ${gs.core.maxHp}`, hpX + 4, hpY + 11);

    // EXP bar
    const expW = 200, expH = 8, expX = 16, expY = 38;
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fillRect(expX, expY, expW, expH);
    ctx.fillStyle = '#7B68EE';
    ctx.fillRect(expX, expY, expW * (gs.levels.exp / gs.levels.expToNext), expH);
    ctx.fillStyle = '#aaa';
    ctx.font = '10px monospace';
    ctx.fillText(`LVL ${gs.levels.level}`, expX + 4, expY + 6);

    // Wave / time
    ctx.fillStyle = '#FFD600';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`WAVE ${gs.wave}`, w / 2, 22);
    ctx.fillStyle = '#aaa';
    ctx.font = '11px monospace';
    const waveTimeLeft = Math.ceil(gs.waveTimer);
    ctx.fillText(`Next: ${waveTimeLeft}s`, w / 2, 38);

    // Talent points
    if (gs.talents.points > 0) {
      ctx.fillStyle = '#FFD600';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`[TAB] ${gs.talents.points} talent pts`, w - 16, 22);
    }

    // Score
    ctx.fillStyle = '#fff';
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`Kills: ${gs.kills}`, w - 16, 40);

    // Unlocked runes legend (bottom)
    this._drawRuneLegend(ctx, gs);
  }

  _drawRuneLegend(ctx, gs) {
    const runes = gs.runes.unlockedRunes;
    if (runes.length === 0) return;
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    const iconSize = 32, gap = 4, totalW = runes.length * (iconSize + gap);
    let x = (w - totalW) / 2;
    const y = h - 44;

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(x - 4, y - 4, totalW + 8, iconSize + 8);

    for (const r of runes) {
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.strokeStyle = r.visualColor;
      ctx.lineWidth = 1.5;
      ctx.fillRect(x, y, iconSize, iconSize);
      ctx.strokeRect(x, y, iconSize, iconSize);

      ctx.fillStyle = r.visualColor;
      ctx.font = '18px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(r.icon || '?', x + iconSize/2, y + iconSize/2);

      x += iconSize + gap;
    }
    ctx.textBaseline = 'alphabetic';
  }

  drawGameOver(ctx, gs) {
    const w = ctx.canvas.width, h = ctx.canvas.height;
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#FF1744';
    ctx.font = 'bold 48px serif';
    ctx.textAlign = 'center';
    ctx.fillText('CORE DESTROYED', w/2, h/2 - 60);

    ctx.fillStyle = '#aaa';
    ctx.font = '20px monospace';
    ctx.fillText(`Survived ${Math.floor(gs.survivalTime)}s  ·  Wave ${gs.wave}  ·  ${gs.kills} kills`, w/2, h/2 - 20);

    ctx.fillStyle = '#7B68EE';
    ctx.font = '16px monospace';
    ctx.fillText('TAP / CLICK TO RESTART', w/2, h/2 + 40);
  }

  drawLevelUp(ctx, gs, choices) {
    const w = ctx.canvas.width, h = ctx.canvas.height;
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#9C88FF';
    ctx.font = 'bold 28px serif';
    ctx.textAlign = 'center';
    ctx.fillText(`LEVEL ${gs.levels.level}`, w/2, h/2 - 140);

    if (choices.length === 0) {
      ctx.fillStyle = '#aaa';
      ctx.font = '16px monospace';
      ctx.fillText('No new runes available', w/2, h/2);
      return;
    }

    ctx.fillStyle = '#fff';
    ctx.font = '18px monospace';
    ctx.fillText('Choose a rune:', w/2, h/2 - 100);

    const cardW = 180, cardH = 200, gap = 20;
    const totalW = choices.length * (cardW + gap) - gap;
    let x = w/2 - totalW/2;

    choices.forEach((r, i) => {
      const cy = h/2 - 80;
      // Hover effect handled by mouse pos
      const hovered = gs._draftHover === i;

      ctx.fillStyle = hovered ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)';
      ctx.strokeStyle = r.visualColor;
      ctx.lineWidth = hovered ? 2.5 : 1.5;
      roundRect(ctx, x, cy, cardW, cardH, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = r.visualColor;
      ctx.font = '36px serif';
      ctx.textAlign = 'center';
      ctx.fillText(r.icon || '?', x + cardW/2, cy + 55);

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(r.name, x + cardW/2, cy + 90);

      ctx.fillStyle = '#aaa';
      ctx.font = '11px monospace';
      const words = r.description.split(' ');
      let line = '', ly = cy + 115;
      for (const word of words) {
        if ((line + word).length > 20) { ctx.fillText(line.trim(), x + cardW/2, ly); ly += 16; line = ''; }
        line += word + ' ';
      }
      if (line) ctx.fillText(line.trim(), x + cardW/2, ly);

      ctx.fillStyle = r.visualColor;
      ctx.font = '10px monospace';
      ctx.fillText(r.effect.damageType.toUpperCase(), x + cardW/2, cy + cardH - 15);

      gs._draftCards = gs._draftCards || [];
      gs._draftCards[i] = { x, y: cy, w: cardW, h: cardH };

      x += cardW + gap;
    });
  }

  drawTalentTree(ctx, gs) {
    const w = ctx.canvas.width, h = ctx.canvas.height;
    ctx.fillStyle = 'rgba(0,0,0,0.9)';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#9C88FF';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('TALENTS', w/2, 30);

    ctx.fillStyle = '#FFD600';
    ctx.font = '14px monospace';
    ctx.fillText(`${gs.talents.points} points available`, w/2, 52);

    ctx.fillStyle = '#555';
    ctx.font = '12px monospace';
    ctx.fillText('[TAB] to close', w/2, 70);

    const allNodes = gs.talents.nodes;
    const conns = gs.talents.connections;

    // Scale: tree spans ~1400px wide conceptually, fit to canvas
    const treeW = 1400, treeH = 800;
    const scaleX = (w - 40) / treeW;
    const scaleY = (h - 120) / treeH;
    const offsetX = 20;
    const offsetY = 90;

    const tx = (x) => offsetX + x * scaleX;
    const ty = (y) => offsetY + y * scaleY;

    // Connections
    for (const conn of conns) {
      const from = allNodes.find(n => n.id === conn.from);
      const to = allNodes.find(n => n.id === conn.to);
      if (!from || !to) continue;
      const canReach = gs.talents.applied.has(conn.from);
      ctx.strokeStyle = canReach ? 'rgba(156,136,255,0.5)' : 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(tx(from.x), ty(from.y));
      ctx.lineTo(tx(to.x), ty(to.y));
      ctx.stroke();
    }

    // Nodes
    const mx = gs._talentMouseX, my = gs._talentMouseY;
    gs._talentNodeHover = null;
    for (const node of allNodes) {
      const nx = tx(node.x), ny = ty(node.y), nr = 18;
      const applied = gs.talents.applied.has(node.id);
      const canBuy = !applied && gs.talents.meetsReqs(node.id) && gs.talents.canAfford(node.id);
      const hover = mx && Math.hypot(mx - nx, my - ny) < nr + 5;
      if (hover) gs._talentNodeHover = node.id;

      ctx.beginPath();
      ctx.arc(nx, ny, nr, 0, Math.PI*2);
      ctx.fillStyle = applied ? '#7B68EE' : canBuy ? 'rgba(123,104,238,0.3)' : 'rgba(40,40,40,0.8)';
      ctx.fill();
      ctx.strokeStyle = applied ? '#9C88FF' : canBuy ? '#7B68EE' : '#333';
      ctx.lineWidth = hover ? 2.5 : 1.5;
      ctx.stroke();

      if (hover) {
        ctx.shadowColor = '#9C88FF';
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      ctx.fillStyle = applied ? '#fff' : canBuy ? '#ccc' : '#555';
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const shortName = node.name.split(' ').map(w => w[0]).join('').toUpperCase();
      ctx.fillText(shortName, nx, ny);

      if (hover) {
        // Tooltip
        const tw = 180, th = 70;
        let ttx = nx + 25, tty = ny - 40;
        ttx = clamp(ttx, 5, w - tw - 5);
        tty = clamp(tty, 80, h - th - 5);
        ctx.fillStyle = 'rgba(0,0,0,0.9)';
        roundRect(ctx, ttx, tty, tw, th, 6);
        ctx.fill();
        ctx.strokeStyle = '#9C88FF';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText(node.name, ttx + 8, tty + 18);
        ctx.fillStyle = '#aaa';
        ctx.font = '10px monospace';
        ctx.fillText(node.description, ttx + 8, tty + 34);
        ctx.fillStyle = '#FFD600';
        ctx.fillText(`Cost: ${node.cost} pt${node.cost > 1 ? 's' : ''}  ${applied ? '✓ Owned' : canBuy ? '(click)' : ''}`, ttx + 8, tty + 54);
      }
    }
    ctx.textBaseline = 'alphabetic';
  }
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ─── GAME STATE ─────────────────────────────────────────────
class GameState {
  constructor(gameCanvas, drawCanvas) {
    this.canvas = gameCanvas;
    this.drawCanvas = drawCanvas;
    this.ctx = gameCanvas.getContext('2d');
    this._lastTime = 0;
    this._running = false;
    this.timeScale = 1;

    this.core = null;
    this.enemies = [];
    this.projectiles = [];
    this.floats = [];
    this.effects = { zones: [], chains: [], orbs: [], towers: [], friendlies: [], delayedExplosions: [], mines: [], auras: [], rays: [], slashes: [] };
    this.particles = new ParticleSystem();
    this.drawing = new DrawingSystem(drawCanvas);
    this.runes = new RuneSystem();
    this.talents = new TalentSystem();
    this.levels = new LevelSystem();
    this.enemyMgr = new EnemyManager();
    this.ui = new UISystem();

    this.wave = 1;
    this.waveTimer = C.WAVE_INTERVAL;
    this.survivalTime = 0;
    this.kills = 0;

    this._state = 'playing'; // 'playing' | 'gameover' | 'levelup' | 'talents'
    this._draftChoices = [];
    this._pendingLevelUps = [];
    this._bossPending = false;

    this.drawing.onStroke = (pts) => this._handleStroke(pts);
  }

  async loadData() {
    const [runeData, talentData] = await Promise.all([
      fetch('./runes.json').then(r => r.json()),
      fetch('./talent_tree.json').then(r => r.json())
    ]);
    this.runes.load(runeData);
    this.talents.load(talentData);
  }

  start() {
    this.core = new Core(this.canvas.width / 2, this.canvas.height / 2);
    this.enemies = [];
    this.projectiles = [];
    this.floats = [];
    this.effects = { zones: [], chains: [], orbs: [], towers: [], friendlies: [], delayedExplosions: [], mines: [], auras: [], rays: [], slashes: [] };
    this.wave = 1; this.waveTimer = C.WAVE_INTERVAL;
    this.survivalTime = 0; this.kills = 0;
    this.levels = new LevelSystem();
    this.talents.reset();
    this._state = 'playing';
    this._pendingLevelUps = [];
    this._bossPending = false;
    this.runes.unlockedRunes = [];

    this._running = true;
    requestAnimationFrame((t) => this._loop(t));
  }

  _loop(timestamp) {
    if (!this._running) return;
    const dt = Math.min((timestamp - this._lastTime) / 1000, 0.05) * this.timeScale;
    this._lastTime = timestamp;

    if (this._state === 'playing') {
      this._update(dt);
    }

    this._render();
    requestAnimationFrame((t) => this._loop(t));
  }

  _update(dt) {
    this.survivalTime += dt;
    this.waveTimer -= dt;
    if (this.waveTimer <= 0) {
      this.wave++;
      this.waveTimer = C.WAVE_INTERVAL;
      this._bossPending = false;
    }

    // Update core
    this.core.update(dt, this);

    // Spawn enemies
    this.enemyMgr.update(dt, this);

    // Update enemies
    for (const e of this.enemies) {
      if (e.dead) continue;
      e.update(dt, this.core.x, this.core.y, this.enemies);

      // Burn tick
      const burn = e.statuses.find(s => s.type === 'burn');
      if (burn) {
        burn._tickTimer = (burn._tickTimer || 0) + dt;
        if (burn._tickTimer >= 1) {
          burn._tickTimer -= 1;
          const burnDmg = burn.magnitude * this.talents.getStat('fireBurnDamage', 1);
          e.takeDamage(Math.floor(burnDmg), 'fire', this);
          this.particles.emit(e.x, e.y, 'fire', 4);
        }
      }

      // Check if reached core
      if (dist(e, this.core) < this.core.r || dist(e, this.core) < 24) {
        this.core.takeDamage(e.damage);
        e.dead = true;
        this.particles.emitBurst(e.x, e.y, 'basic', 15);
      }
    }

    // Process deaths
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      if (!e.dead) continue;

      // EXP
      const expGain = e.exp * this.talents.getStat('expMultiplier', 1);
      const newLevels = this.levels.addExp(expGain);
      this.kills++;

      // Arcane mark explosion
      if (e.hasStatus('arcane_mark')) {
        const markR = 80 * this.talents.getStat('arcaneMarkRadius', 1);
        for (const other of this.enemies) {
          if (other.dead || other === e) continue;
          if (dist(e, other) < markR) {
            other.takeDamage(30, 'arcane', this);
            this.particles.emit(other.x, other.y, 'arcane', 8);
          }
        }
        this.effects.zones.push(new ZoneEffect(e.x, e.y, { radius: markR, baseDamage: 0, damageType: 'arcane', radiusGrowthTime: 0.2 }));
      }

      // Frost shatter
      if (this.talents.getStat('frostShatter', false) && e.hasStatus('freeze')) {
        const shatterR = 80;
        for (const other of this.enemies) {
          if (other.dead || other === e) continue;
          if (dist(e, other) < shatterR) {
            other.takeDamage(e.maxHp * 0.5, 'frost', this);
          }
        }
        this.particles.emitBurst(e.x, e.y, 'frost', 30);
      }

      // Splitter
      if (e.type === 'splitter' && !e._split) {
        for (let j = 0; j < 2; j++) {
          const ne = new Enemy(e.x + randRange(-20,20), e.y + randRange(-20,20), 'grunt');
          ne.hp = 20; ne.maxHp = 20;
          this.enemies.push(ne);
        }
      }

      if (newLevels.length > 0) {
        for (const lv of newLevels) {
          const choices = this.runes.getDraftChoices(lv);
          if (choices.length > 0) this._pendingLevelUps.push({ level: lv, choices });
          this.talents.points++;
        }
        if (this._pendingLevelUps.length > 0) this._showNextLevelUp();
      }

      this.enemies.splice(i, 1);
    }

    // Projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.update(dt);
      if (p.dead) { this.projectiles.splice(i, 1); continue; }
      for (const e of this.enemies) {
        if (e.dead) continue;
        if (dist(p, e) < e.size + p.r) {
          e.takeDamage(p.damage, p.damageType, this);
          if (p.statusEffect) applyStatusToEnemy(e, p.statusEffect, p.statusDuration, p.statusMagnitude, p.x, p.y, this);
          this.particles.emit(e.x, e.y, p.damageType, 8);
          p.dead = true;
          break;
        }
      }
    }

    // Orbit orbs
    for (let i = this.effects.orbs.length - 1; i >= 0; i--) {
      const orb = this.effects.orbs[i];
      orb.update(dt, this.core);
      if (orb.dead) { this.effects.orbs.splice(i, 1); continue; }
      for (const e of this.enemies) {
        if (e.dead || !orb.canHit(e)) continue;
        if (dist({ x: orb.x, y: orb.y }, e) < e.size + orb.r) {
          e.takeDamage(orb.damage, orb.damageType, this);
          if (orb.statusEffect) applyStatusToEnemy(e, orb.statusEffect, orb.statusDuration, orb.statusMagnitude, orb.x, orb.y, this);
          orb.markHit(e);
          this.particles.emit(orb.x, orb.y, orb.damageType, 6);
        }
      }
    }

    // Towers
    for (let i = this.effects.towers.length - 1; i >= 0; i--) {
      this.effects.towers[i].update(dt, this.enemies, this);
      if (this.effects.towers[i].dead) this.effects.towers.splice(i, 1);
    }

    // Friendlies
    for (let i = this.effects.friendlies.length - 1; i >= 0; i--) {
      this.effects.friendlies[i].update(dt, this.enemies, this);
      if (this.effects.friendlies[i].dead) this.effects.friendlies.splice(i, 1);
    }

    // Delayed explosions
    for (let i = this.effects.delayedExplosions.length - 1; i >= 0; i--) {
      const de = this.effects.delayedExplosions[i];
      de.update(dt);
      if (de.triggered) {
        for (const e of this.enemies) {
          if (e.dead) continue;
          if (dist(de, e) < de.radius) {
            e.takeDamage(de.damage, de.damageType, this);
            if (de.statusEffect === 'push') applyStatusToEnemy(e, 'push', 0, de.statusMagnitude, de.x, de.y, this);
          }
        }
        this.effects.zones.push(new ZoneEffect(de.x, de.y, { radius: de.radius, baseDamage: 0, damageType: de.damageType, radiusGrowthTime: 0.3 }));
        this.particles.emitBurst(de.x, de.y, de.damageType, 40);
        de.dead = true;
        this.effects.delayedExplosions.splice(i, 1);
      }
    }

    // Land mines
    for (let i = this.effects.mines.length - 1; i >= 0; i--) {
      const mine = this.effects.mines[i];
      mine.update(dt, this.enemies);
      if (mine.triggered) {
        for (const e of this.enemies) {
          if (e.dead) continue;
          if (dist(mine, e) < mine.explosionRadius) {
            e.takeDamage(mine.damage, mine.damageType, this);
          }
        }
        this.effects.zones.push(new ZoneEffect(mine.x, mine.y, { radius: mine.explosionRadius, baseDamage: 0, damageType: mine.damageType, radiusGrowthTime: 0.25 }));
        this.particles.emitBurst(mine.x, mine.y, mine.damageType, 35);
        mine.dead = true;
        this.effects.mines.splice(i, 1);
        continue;
      }
      if (mine.dead) this.effects.mines.splice(i, 1);
    }

    // Auras
    for (let i = this.effects.auras.length - 1; i >= 0; i--) {
      this.effects.auras[i].update(dt, this.enemies, this);
      if (this.effects.auras[i].dead) this.effects.auras.splice(i, 1);
    }

    // Zone effects
    for (let i = this.effects.zones.length - 1; i >= 0; i--) {
      this.effects.zones[i].update(dt, this.enemies, this);
      if (this.effects.zones[i].dead) this.effects.zones.splice(i, 1);
    }

    // Rays
    for (let i = this.effects.rays.length - 1; i >= 0; i--) {
      this.effects.rays[i].update(dt, this.enemies, this);
      if (this.effects.rays[i].dead) this.effects.rays.splice(i, 1);
    }

    // Chain visuals
    for (let i = this.effects.chains.length - 1; i >= 0; i--) {
      this.effects.chains[i].update(dt);
      if (this.effects.chains[i].dead) this.effects.chains.splice(i, 1);
    }

    // Slash visuals
    for (let i = this.effects.slashes.length - 1; i >= 0; i--) {
      this.effects.slashes[i].update(dt);
      if (this.effects.slashes[i].dead) this.effects.slashes.splice(i, 1);
    }

    // Floating numbers
    for (let i = this.floats.length - 1; i >= 0; i--) {
      this.floats[i].update(dt);
      if (this.floats[i].life <= 0) this.floats.splice(i, 1);
    }

    this.particles.update(dt);

    if (this.core.isDead()) this._state = 'gameover';
  }

  _handleStroke(pts) {
    if (this._state === 'gameover') return;
    if (this._state === 'levelup') return;
    if (this._state === 'talents') return;

    const result = this.runes.recognize(pts);
    if (result.score >= C.RECOGNITION_THRESHOLD) {
      executeCombat(this, pts, result.id);
    } else {
      executeCombat(this, pts, null);
    }
  }

  _showNextLevelUp() {
    if (this._pendingLevelUps.length === 0) return;
    const next = this._pendingLevelUps.shift();
    this._draftChoices = next.choices;
    this._state = 'levelup';
    this._draftCards = [];
    this._draftHover = -1;
    this.timeScale = 0.15;

    this.drawCanvas.addEventListener('mousemove', this._draftMoveHandler = (e) => {
      const rect = this.drawCanvas.getBoundingClientRect();
      const mx = e.clientX - rect.left, my = e.clientY - rect.top;
      this._draftHover = -1;
      if (this._draftCards) {
        for (let i = 0; i < this._draftCards.length; i++) {
          const c = this._draftCards[i];
          if (c && mx >= c.x && mx <= c.x + c.w && my >= c.y && my <= c.y + c.h) { this._draftHover = i; break; }
        }
      }
    });

    this.drawCanvas.addEventListener('click', this._draftClickHandler = (e) => {
      const rect = this.drawCanvas.getBoundingClientRect();
      const mx = e.clientX - rect.left, my = e.clientY - rect.top;
      if (this._draftCards) {
        for (let i = 0; i < this._draftCards.length; i++) {
          const c = this._draftCards[i];
          if (c && mx >= c.x && mx <= c.x + c.w && my >= c.y && my <= c.y + c.h) {
            this.runes.unlockRune(this._draftChoices[i].id);
            this._closeLevelUp();
            return;
          }
        }
      }
    });

    this.drawCanvas.addEventListener('touchend', this._draftTouchHandler = (ev) => {
      ev.preventDefault();
      const t = ev.changedTouches[0];
      const rect = this.drawCanvas.getBoundingClientRect();
      const mx = t.clientX - rect.left, my = t.clientY - rect.top;
      if (this._draftCards) {
        for (let i = 0; i < this._draftCards.length; i++) {
          const c = this._draftCards[i];
          if (c && mx >= c.x && mx <= c.x + c.w && my >= c.y && my <= c.y + c.h) {
            this.runes.unlockRune(this._draftChoices[i].id);
            this._closeLevelUp();
            return;
          }
        }
      }
    }, { passive: false });
  }

  _closeLevelUp() {
    this.drawCanvas.removeEventListener('click', this._draftClickHandler);
    this.drawCanvas.removeEventListener('mousemove', this._draftMoveHandler);
    this.drawCanvas.removeEventListener('touchend', this._draftTouchHandler);
    this.timeScale = 1;
    if (this._pendingLevelUps.length > 0) {
      setTimeout(() => this._showNextLevelUp(), 100);
    } else {
      this._state = 'playing';
    }
  }

  _openTalents() {
    this._state = 'talents';
    this.timeScale = 0;

    this.drawCanvas.addEventListener('mousemove', this._talentMoveHandler = (e) => {
      const rect = this.drawCanvas.getBoundingClientRect();
      this._talentMouseX = e.clientX - rect.left;
      this._talentMouseY = e.clientY - rect.top;
    });

    this.drawCanvas.addEventListener('click', this._talentClickHandler = (e) => {
      if (this._talentNodeHover) {
        this.talents.purchase(this._talentNodeHover);
      }
    });

    this.drawCanvas.addEventListener('touchend', this._talentTouchHandler = (ev) => {
      ev.preventDefault();
      const t = ev.changedTouches[0];
      const rect = this.drawCanvas.getBoundingClientRect();
      this._talentMouseX = t.clientX - rect.left;
      this._talentMouseY = t.clientY - rect.top;
      if (this._talentNodeHover) this.talents.purchase(this._talentNodeHover);
    }, { passive: false });
  }

  _closeTalents() {
    this.drawCanvas.removeEventListener('click', this._talentClickHandler);
    this.drawCanvas.removeEventListener('mousemove', this._talentMoveHandler);
    this.drawCanvas.removeEventListener('touchend', this._talentTouchHandler);
    this.timeScale = 1;
    this._state = 'playing';
  }

  _render() {
    const ctx = this.ctx;
    const w = this.canvas.width, h = this.canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = '#0A0A14';
    ctx.fillRect(0, 0, w, h);

    // Subtle grid
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y < h; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

    // Core aura
    if (this._state !== 'gameover') {
      const grad = ctx.createRadialGradient(this.core.x, this.core.y, 20, this.core.x, this.core.y, 120);
      grad.addColorStop(0, 'rgba(123,104,238,0.08)');
      grad.addColorStop(1, 'rgba(123,104,238,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.core.x, this.core.y, 120, 0, Math.PI*2);
      ctx.fill();
    }

    // Zone effects (under enemies)
    for (const z of this.effects.zones) z.draw(ctx);
    for (const a of this.effects.auras) a.draw(ctx);

    // Mines + delayed explosions
    for (const m of this.effects.mines) m.draw(ctx);
    for (const d of this.effects.delayedExplosions) d.draw(ctx);

    // Slash visuals
    for (const s of this.effects.slashes) s.draw(ctx);

    // Enemies
    for (const e of this.enemies) if (!e.dead) e.draw(ctx);

    // Towers + friendlies
    for (const t of this.effects.towers) t.draw(ctx);
    for (const f of this.effects.friendlies) f.draw(ctx);

    // Orbit range indicator (subtle)
    for (const orb of this.effects.orbs) {
      ctx.strokeStyle = `${orb.color}22`;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(orb.cx, orb.cy, orb.radius, 0, Math.PI*2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Rays
    for (const r of this.effects.rays) r.draw(ctx);

    // Chain effects
    for (const c of this.effects.chains) c.draw(ctx);

    // Projectiles
    for (const p of this.projectiles) p.draw(ctx);

    // Orbit orbs (on top)
    for (const orb of this.effects.orbs) orb.draw(ctx);

    // Particles
    this.particles.draw(ctx);

    // Core
    if (this.core) this.core.draw(ctx);

    // Floating numbers
    ctx.textBaseline = 'alphabetic';
    for (const f of this.floats) f.draw(ctx);

    // Drawing overlay on draw canvas
    this.drawing.ctx.clearRect(0, 0, this.drawCanvas.width, this.drawCanvas.height);
    this.drawing.drawCurrentStroke(this.drawing.ctx);

    // UI states
    if (this._state === 'gameover') {
      this.ui.drawGameOver(ctx, this);
    } else if (this._state === 'levelup') {
      this.ui.drawLevelUp(ctx, this, this._draftChoices);
    } else if (this._state === 'talents') {
      this.ui.drawTalentTree(ctx, this);
    } else {
      this.ui.drawHUD(ctx, this);
    }
  }

  handleRestart() {
    if (this._state !== 'gameover') return;
    this.start();
  }

  handleTab() {
    if (this._state === 'playing' && this.talents.points > 0) this._openTalents();
    else if (this._state === 'talents') this._closeTalents();
  }

  resize(w, h) {
    this.canvas.width = w; this.canvas.height = h;
    this.drawCanvas.width = w; this.drawCanvas.height = h;
    if (this.core) { this.core.x = w/2; this.core.y = h/2; }
  }
}

// ─── DEV MODE ───────────────────────────────────────────────
function _initDevModeInternal(panels) {
  const { runeCanvas, runeOutput, talentCanvas, talentOutput } = panels;
  const recognizer = new DollarRecognizer();
  let currentStroke = [];
  let isDrawing = false;
  let savedTemplates = [];

  // Rune editor
  if (runeCanvas) {
    const ctx = runeCanvas.getContext('2d');
    ctx.fillStyle = '#0A0A14';
    ctx.fillRect(0, 0, runeCanvas.width, runeCanvas.height);

    const draw = () => {
      ctx.clearRect(0, 0, runeCanvas.width, runeCanvas.height);
      ctx.fillStyle = '#0A0A14';
      ctx.fillRect(0, 0, runeCanvas.width, runeCanvas.height);
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < runeCanvas.width; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,runeCanvas.height); ctx.stroke(); }
      for (let y = 0; y < runeCanvas.height; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(runeCanvas.width,y); ctx.stroke(); }
      if (currentStroke.length > 1) {
        ctx.strokeStyle = '#9C88FF';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(currentStroke[0].x, currentStroke[0].y);
        for (const p of currentStroke.slice(1)) ctx.lineTo(p.x, p.y);
        ctx.stroke();
        // Show resampled
        const norm = new DollarRecognizer()._normalize(currentStroke);
        ctx.fillStyle = '#FFD600';
        for (const p of norm) { ctx.beginPath(); ctx.arc(p.x + runeCanvas.width/2, p.y + runeCanvas.height/2, 2, 0, Math.PI*2); ctx.fill(); }
      }
    };

    const getPos = (e) => { const r = runeCanvas.getBoundingClientRect(); const s = e.touches ? e.touches[0] : e; return { x: s.clientX-r.left, y: s.clientY-r.top }; };
    runeCanvas.addEventListener('mousedown', (e) => { isDrawing=true; currentStroke=[getPos(e)]; });
    runeCanvas.addEventListener('mousemove', (e) => { if (!isDrawing) return; currentStroke.push(getPos(e)); draw(); });
    runeCanvas.addEventListener('mouseup', (e) => {
      isDrawing = false;
      if (currentStroke.length >= 5 && runeOutput) {
        const pts = currentStroke.map(p => [Math.round(p.x), Math.round(p.y)]);
        runeOutput.value = JSON.stringify(pts);
        // Test recognition
        if (savedTemplates.length > 0) {
          const result = recognizer.recognize(currentStroke);
          runeOutput.value += `\n\n// Best match: ${result.name} (score: ${result.score.toFixed(3)})`;
        }
      }
      draw();
    });
    runeCanvas.addEventListener('touchstart', (e) => { e.preventDefault(); isDrawing=true; currentStroke=[getPos(e)]; }, { passive: false });
    runeCanvas.addEventListener('touchmove', (e) => { e.preventDefault(); if (!isDrawing) return; currentStroke.push(getPos(e)); draw(); }, { passive: false });
    runeCanvas.addEventListener('touchend', (e) => { e.preventDefault(); isDrawing=false; if (currentStroke.length >= 5 && runeOutput) { runeOutput.value = JSON.stringify(currentStroke.map(p=>[Math.round(p.x),Math.round(p.y)])); } draw(); }, { passive: false });
    draw();
  }
}

// ─── ENTRY POINTS ───────────────────────────────────────────
export async function initGame(gameCanvas, drawCanvas) {
  const gs = new GameState(gameCanvas, drawCanvas);
  await gs.loadData();
  gs.start();

  // Resize handling
  const resize = () => {
    const w = window.innerWidth, h = window.innerHeight;
    gs.resize(w, h);
  };
  window.addEventListener('resize', resize);
  resize();

  // Input
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') { e.preventDefault(); gs.handleTab(); }
    if (e.key === 'r' || e.key === 'R') gs.handleRestart();
  });

  // Restart on click when gameover
  gameCanvas.addEventListener('click', () => gs.handleRestart());
  gameCanvas.addEventListener('touchend', (e) => { e.preventDefault(); gs.handleRestart(); }, { passive: false });

  return gs;
}

export function initDevMode(panels) {
  _initDevModeInternal(panels);
}
