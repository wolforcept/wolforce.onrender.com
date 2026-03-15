// ── AI.js ─────────────────────────────────────────────────────────────────────
// Archived AI code from pool-game.html.
// To re-integrate, these functions need access to the p5 sketch closure vars:
//   cfg, balls, shelves, mirrors, palette, paused, editMode,
//   BR, W, H, FLOOR_Y, engine, world, Bodies, Body, World, fin
// and must call advancePlayer() after shooting.
//
// In DEFAULT_SETTINGS, add:   aiMode: false
// In settings HTML, add the AI toggle (id="toggle-ai", id="ai-track")
// In buildSettingsUI(), wire the AI toggle.
// Call scheduleAI() from: initAll(), closeModal(), advancePlayer(), gameRelease()
// Guard gamePressAt() and gameRelease() with: if (isAITurn()) return;
// ─────────────────────────────────────────────────────────────────────────────

let aiPending = false;

function isAITurn() {
  return cfg.aiMode && (currentPlayer % 2 === 1);
}

function scheduleAI() {
  if (!isAITurn() || aiPending) return;
  aiPending = true;
  waitForSettleThenShoot();
}

function waitForSettleThenShoot() {
  const SETTLE_SPD  = 1.0;
  const POLL_MS     = 150;
  const MIN_WAIT_MS = 500;
  const MAX_WAIT_MS = 5000;
  const start = Date.now();

  function poll() {
    if (paused || editMode) { setTimeout(poll, POLL_MS); return; }
    if (!isAITurn()) { aiPending = false; return; }

    const elapsed = Date.now() - start;
    const allSettled = balls.every(b =>
      Math.hypot(b.body.velocity.x, b.body.velocity.y) < SETTLE_SPD
    );

    if ((allSettled && elapsed >= MIN_WAIT_MS) || elapsed >= MAX_WAIT_MS) {
      setTimeout(() => {
        aiPending = false;
        if (!paused && !editMode && isAITurn()) aiShoot();
      }, 200 + Math.random()*200);
    } else {
      setTimeout(poll, POLL_MS);
    }
  }
  setTimeout(poll, MIN_WAIT_MS);
}

// ── AI: shelf data ──────────────────────────────────────────────────────────
// Returns shelf segments as endpoint pairs for line intersection tests.
// Each seg: { ax,ay, bx,by, cx,cy } where (ax,ay)-(bx,by) is the shelf line,
// (cx,cy) is the shelf centre.
function getAllShelfSegs() {
  const segs = [];
  function addSeg(cx, cy, hw, ang) {
    const cosA = Math.cos(ang), sinA = Math.sin(ang);
    segs.push({
      ax: cx - cosA*hw, ay: cy - sinA*hw,
      bx: cx + cosA*hw, by: cy + sinA*hw,
      cx, cy,
    });
  }
  for (const s of shelves)
    addSeg(s.body.position.x, s.body.position.y, s.fw/2, s.body.angle);
  if (cfg.mirrorMode)
    for (const m of mirrors)
      addSeg(m.body.position.x, m.body.position.y, m.fw/2, m.body.angle);
  return segs;
}

// ── AI: accurate physics simulation ────────────────────────────────────────
function simulatePath(sx, sy, vx0, vy0) {
  const pts = [];
  let bx=sx, by=sy, vx=vx0, vy=vy0;
  const drag = 1 - cfg.airFriction;
  for (let i=0; i<200; i++) {
    vx = (vx + cfg.gravityX) * drag;
    vy = (vy + cfg.gravityY) * drag;
    bx += vx; by += vy;
    if (bx < BR)   { bx = BR;   vx =  Math.abs(vx) * 0.7; }
    if (bx > W-BR) { bx = W-BR; vx = -Math.abs(vx) * 0.7; }
    pts.push({x:bx, y:by, vx, vy});
    if (by > FLOOR_Y + 20) break;
    if (by < -H * 0.8) break;
  }
  return pts;
}

// ── AI: 2D segment intersection ─────────────────────────────────────────────
function segmentsIntersect(p1x,p1y, p2x,p2y, p3x,p3y, p4x,p4y) {
  const d1x=p2x-p1x, d1y=p2y-p1y;
  const d2x=p4x-p3x, d2y=p4y-p3y;
  const denom = d1x*d2y - d1y*d2x;
  if (Math.abs(denom) < 1e-10) return false;
  const ox=p3x-p1x, oy=p3y-p1y;
  const t = (ox*d2y - oy*d2x) / denom;
  const u = (ox*d1y - oy*d1x) / denom;
  return t > 0.01 && t < 0.99 && u > 0.01 && u < 0.99;
}

// ── AI: trajectory scoring ──────────────────────────────────────────────────
// REWARD: each shelf the ball crosses while descending = +10
// PENALTY: each shelf the ball clips while ascending   = -15
function scorePath(pts, segs) {
  if (pts.length < 2) return -999;
  const descHit = new Uint8Array(segs.length);
  const ascHit  = new Uint8Array(segs.length);
  let score = 0;

  for (let i=1; i<pts.length; i++) {
    const prev=pts[i-1], cur=pts[i];
    const descending = cur.y > prev.y;
    if (cur.y >= FLOOR_Y - BR) continue;

    for (let si=0; si<segs.length; si++) {
      const seg = segs[si];
      const expand = BR * 0.8;
      const ang = Math.atan2(seg.by-seg.ay, seg.bx-seg.ax);
      const nx  = -Math.sin(ang)*expand, ny = Math.cos(ang)*expand;

      const crossed = segmentsIntersect(
        prev.x, prev.y, cur.x, cur.y,
        seg.ax-nx, seg.ay-ny, seg.bx-nx, seg.by-ny
      ) || segmentsIntersect(
        prev.x, prev.y, cur.x, cur.y,
        seg.ax+nx, seg.ay+ny, seg.bx+nx, seg.by+ny
      );

      if (!crossed) continue;

      if (descending && !descHit[si]) {
        descHit[si] = 1;
        const dx = cur.x - seg.cx, dy = cur.y - seg.cy;
        const distToCenter = Math.hypot(dx, dy);
        const hw = Math.hypot(seg.bx-seg.ax, seg.by-seg.ay) / 2;
        const centerBonus = Math.max(0, 1 - distToCenter / (hw * 1.5));
        score += 10 + centerBonus * 5;
      } else if (!descending && !ascHit[si]) {
        ascHit[si] = 1;
        score -= 15;
      }
    }
  }
  return score;
}

// ── AI: main shot selection ─────────────────────────────────────────────────
function aiShoot() {
  const sy = FLOOR_Y - BR - 2;
  const segs = getAllShelfSegs();

  const xSamples   = 12;
  const angSamples = 20;
  const powers     = [4, 7, 10, 13, 16, 19];
  const candidates = [];

  function sweep(angMin, angMax, xMin, xMax) {
    for (let xi=0; xi<xSamples; xi++) {
      const sx = p.map(xi, 0, xSamples-1, xMin, xMax);
      for (let ai=0; ai<angSamples; ai++) {
        const ang = p.map(ai, 0, angSamples-1, angMin, angMax);
        for (const pwr of powers) {
          const vx  = Math.cos(ang)*pwr;
          const vy  = Math.sin(ang)*pwr;
          const pts = simulatePath(sx, sy, vx, vy);
          const sc  = scorePath(pts, segs);
          candidates.push({vx, vy, sx, score: sc});
        }
      }
    }
  }

  sweep(-Math.PI + 0.05, -0.05, BR+20, W-BR-20);

  let bestScore = -999;
  for (const c of candidates) if (c.score > bestScore) bestScore = c.score;

  const bestC = candidates.find(c => c.score === bestScore);
  if (bestC && bestScore > -999) {
    const bestAng  = Math.atan2(bestC.vy, bestC.vx);
    const bestPwr  = Math.hypot(bestC.vx, bestC.vy);
    const angSpan  = Math.PI / 8;
    const xSpan    = W * 0.12;
    const finePowers = [
      bestPwr * 0.80, bestPwr * 0.90, bestPwr,
      bestPwr * 1.10, bestPwr * 1.20,
    ];
    for (let xi=0; xi<10; xi++) {
      const sx = p.constrain(
        p.map(xi, 0, 9, bestC.sx - xSpan, bestC.sx + xSpan),
        BR+20, W-BR-20
      );
      for (let ai=0; ai<16; ai++) {
        const ang = p.map(ai, 0, 15, bestAng - angSpan, bestAng + angSpan);
        for (const pwr of finePowers) {
          const vx  = Math.cos(ang)*pwr;
          const vy  = Math.sin(ang)*pwr;
          if (vy > 0) continue;
          const pts = simulatePath(sx, sy, vx, vy);
          const sc  = scorePath(pts, segs);
          candidates.push({vx, vy, sx, score: sc});
          if (sc > bestScore) bestScore = sc;
        }
      }
    }
  }

  let chosen = null;
  if (bestScore > 0) {
    const threshold = bestScore * 0.70;
    const pool = candidates.filter(c => c.score >= threshold);
    chosen = pool[Math.floor(Math.random() * pool.length)];
  }

  let finalVx, finalVy, finalSx;
  if (chosen) {
    const chosenAng = Math.atan2(chosen.vy, chosen.vx);
    const chosenPwr = Math.hypot(chosen.vx, chosen.vy);
    const jitterAng = chosenAng + (Math.random()-0.5) * (Math.PI/30);
    const jitterPwr = chosenPwr * (0.92 + Math.random()*0.16);
    finalVx = Math.cos(jitterAng) * jitterPwr;
    finalVy = Math.sin(jitterAng) * jitterPwr;
    if (finalVy > 0) finalVy = -Math.abs(finalVy);
    finalSx = p.constrain(
      chosen.sx + (Math.random()-0.5) * W * 0.04,
      BR+20, W-BR-20
    );
  } else {
    finalSx = p.constrain(W/2 + (Math.random()-0.5)*W*0.4, BR+30, W-BR-30);
    const ang = p.map(Math.random(), 0, 1, -Math.PI*0.85, -Math.PI*0.15);
    const pwr = 9 + Math.random()*7;
    finalVx = Math.cos(ang)*pwr;
    finalVy = Math.sin(ang)*pwr;
  }

  const body = Bodies.circle(finalSx, sy, BR, {
    restitution: cfg.restitution,
    friction: 0.04,
    frictionAir: cfg.airFriction,
    density: 0.002,
  });
  Body.setVelocity(body, { x:fin(finalVx), y:fin(finalVy) });
  World.add(world, body);
  balls.push({ body, palette });
  advancePlayer();
}
