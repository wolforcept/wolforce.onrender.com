// ── mirrorMode.js ─────────────────────────────────────────────────────────────
// Archived mirror shelf code from pool-game.html.
// To re-integrate, these functions need access to the p5 sketch closure vars:
//   cfg, shelves, mirrors, engine, world, Bodies, Body, World, W, p
//
// In game objects, add:   let mirrors = [];
// In DEFAULT_SETTINGS, add:  mirrorMode: false
// In initAll() and rebuildAfterResize(), add to reset:  mirrors = [];
// In spawnShelf(), after pushing to shelves, add:
//   if (cfg.mirrorMode) spawnMirrorFor(idx);
// In syncDef(), add:
//   if (cfg.mirrorMode) syncMirrorFor(idx);
// In deleteSelected(), add:
//   if (cfg.mirrorMode) removeMirrorFor(selectedShelf);
// In p.draw, add:
//   if (cfg.mirrorMode) drawMirrorShelves();
// In settings HTML, add the mirror toggle (id="toggle-mirror", id="mirror-track")
// In buildSettingsUI(), wire the mirror toggle to call rebuildMirrors().
// ─────────────────────────────────────────────────────────────────────────────

// Mirror shelf color palette
const MIRROR_SHELF = ['rgba(100,220,210,0.75)','rgba(130,240,230,0.92)','rgba(80,200,190,0.65)'];

// Spawn a physics mirror body for shelf at shelves[idx]
function spawnMirrorFor(idx) {
  const s  = shelves[idx];
  const mx = W - s.body.position.x;
  const my = s.body.position.y;
  const ma = -s.body.angle;
  const mb = Bodies.rectangle(mx, my, s.fw, 10, {
    isStatic:true, friction:0.55, restitution:0.28
  });
  Body.setAngle(mb, ma);
  World.add(world, mb);
  mirrors.push({ body: mb, fw: s.fw, sourceIdx: idx });
}

// Remove all mirror bodies and rebuild from current shelves
function rebuildMirrors() {
  for (const m of mirrors) World.remove(world, m.body);
  mirrors = [];
  if (!cfg.mirrorMode) return;
  for (let i=0; i<shelves.length; i++) spawnMirrorFor(i);
}

// Update mirror body for shelf at idx to match its source shelf
function syncMirrorFor(idx) {
  const m = mirrors.find(m => m.sourceIdx === idx);
  if (!m) return;
  const s  = shelves[idx];
  const mx = W - s.body.position.x;
  const my = s.body.position.y;
  World.remove(world, m.body);
  const nb = Bodies.rectangle(mx, my, s.fw, 10, {
    isStatic:true, friction:0.55, restitution:0.28
  });
  Body.setAngle(nb, -s.body.angle);
  World.add(world, nb);
  m.body = nb;
  m.fw   = s.fw;
}

// Remove mirror body for a deleted shelf at idx, fix sourceIdx refs
function removeMirrorFor(idx) {
  const mi = mirrors.findIndex(m => m.sourceIdx === idx);
  if (mi >= 0) {
    World.remove(world, mirrors[mi].body);
    mirrors.splice(mi, 1);
  }
  for (const m of mirrors) {
    if (m.sourceIdx > idx) m.sourceIdx--;
  }
}

// Draw all mirror shelves (teal/cyan color, not selectable)
function drawMirrorShelves() {
  for (const m of mirrors) {
    const pos = m.body.position;
    const ang = m.body.angle;

    p.push(); p.translate(pos.x, pos.y); p.rotate(ang);
    const gc = p.drawingContext;

    for (let j=5; j>0; j--) {
      gc.fillStyle = `rgba(80,210,200,${0.016*j})`;
      gc.beginPath(); gc.roundRect(-m.fw/2-j,-6-j,m.fw+j*2,12+j*2,6); gc.fill();
    }
    const g = gc.createLinearGradient(-m.fw/2,-5, m.fw/2,5);
    g.addColorStop(0,  MIRROR_SHELF[0]);
    g.addColorStop(0.5,MIRROR_SHELF[1]);
    g.addColorStop(1,  MIRROR_SHELF[2]);
    gc.fillStyle=g;
    gc.beginPath(); gc.roundRect(-m.fw/2,-5,m.fw,10,4); gc.fill();
    gc.strokeStyle='rgba(160,255,248,0.4)'; gc.lineWidth=0.7;
    gc.beginPath(); gc.moveTo(-m.fw/2+5,-4); gc.lineTo(m.fw/2-5,-4); gc.stroke();
    p.pop();
  }
}
