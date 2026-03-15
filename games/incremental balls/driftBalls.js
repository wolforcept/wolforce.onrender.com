// ── driftBalls.js ─────────────────────────────────────────────────────────────
// Archived ambient drift ball code from pool-game.html.
// To re-integrate, these functions need access to the p5 sketch closure vars:
//   p, cfg, driftBalls, engine, world, Bodies, Body, World,
//   paused, editMode, BR, W, H, FLOOR_Y, fin
//
// In game objects, add:   let driftBalls = [];
// In initAll() and rebuildAfterResize(), add to reset line:  driftBalls = [];
// In toggleEditMode() when entering edit:
//   for (const db of driftBalls) World.remove(world, db.body);
//   driftBalls = [];
// In handleFallOff(), add the driftBalls loop (see below).
// In p.draw (non-editMode block), add:
//   for (const db of driftBalls) drawDriftBall(db);
// Call scheduleDriftBall() from initAll() after everything is set up.
// ─────────────────────────────────────────────────────────────────────────────

// Poisson-like spacing: delay = -ln(rand) * meanMs  →  avg 1 ball/second
const DRIFT_MEAN_MS = 1000;

function scheduleDriftBall() {
  const delay = -Math.log(Math.random()) * DRIFT_MEAN_MS;
  setTimeout(() => {
    if (!paused && !editMode && engine) spawnDriftBall();
    scheduleDriftBall();
  }, delay);
}

function spawnDriftBall() {
  const x  = BR*2 + Math.random() * (W - BR*4);
  const y  = -BR - 2;
  const vx = (Math.random()-0.5) * 2.5;
  const vy = 0.5 + Math.random() * 1.5;
  const body = Bodies.circle(x, y, BR * 0.92, {
    restitution: 0.45,
    friction: 0.06,
    frictionAir: 0.010,
    density: 0.0015,
  });
  Body.setVelocity(body, { x: fin(vx), y: fin(vy) });
  World.add(world, body);
  driftBalls.push({ body });
}

// Add this loop inside handleFallOff():
function handleFallOffDriftBalls() {
  for (let i=driftBalls.length-1; i>=0; i--) {
    const pos = driftBalls[i].body.position;
    if (pos.y > H+80) {
      World.remove(world, driftBalls[i].body);
      driftBalls.splice(i,1);
    }
  }
}

function drawDriftBall(db) {
  const x = fin(db.body.position.x), y = fin(db.body.position.y);
  if (y < -BR*2) return;
  const gc = p.drawingContext;

  const gw = gc.createRadialGradient(x,y,0, x,y,BR*2.2);
  gw.addColorStop(0,'rgba(180,180,195,0.12)');
  gw.addColorStop(1,'rgba(0,0,0,0)');
  gc.fillStyle=gw; gc.beginPath(); gc.arc(x,y,BR*2.2,0,Math.PI*2); gc.fill();

  const gr = gc.createRadialGradient(x-BR*.3,y-BR*.35,BR*.04, x,y,BR*0.92);
  gr.addColorStop(0, 'rgba(200,200,210,0.92)');
  gr.addColorStop(0.45,'rgba(130,132,142,0.97)');
  gr.addColorStop(1,  'rgba(68,70,80,0.95)');
  gc.fillStyle=gr;
  gc.beginPath(); gc.arc(x,y,BR*0.92,0,Math.PI*2); gc.fill();

  const sp = gc.createRadialGradient(x-BR*.28,y-BR*.36,0, x-BR*.28,y-BR*.36,BR*.38);
  sp.addColorStop(0,'rgba(255,255,255,0.55)');
  sp.addColorStop(1,'rgba(255,255,255,0)');
  gc.fillStyle=sp;
  gc.beginPath(); gc.arc(x,y,BR*0.92,0,Math.PI*2); gc.fill();

  gc.strokeStyle='rgba(255,255,255,0.08)'; gc.lineWidth=0.6;
  gc.beginPath(); gc.arc(x,y,BR*0.92,0,Math.PI*2); gc.stroke();
}
