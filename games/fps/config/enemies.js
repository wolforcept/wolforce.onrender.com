// config/enemies.js
// Enemy type definitions, weighted pick table, and base speed.
// Loaded as a plain <script> before the module script.
// See index.html for the reference comment documenting each field.

const ENEMY_TYPES = [
  {
    id:           'standard',
    label:        'Standard',
    weight:       40,
    speedMult:    1.0,
    hpMult:       1.0,
    scale:        1.0,
    bodyColor:    0xff2244,
    bodyEmissive: 0x440011,
    eyeColor:     0xffff00,
    eyeEmissive:  0xffcc00,
    hpBarHi:  '#44ff88',
    hpBarMid: '#ffaa00',
    hpBarLo:  '#ff3333',
  },
  {
    id:           'speeder',
    label:        'Speeder',
    weight:       25,
    speedMult:    2.0,
    hpMult:       0.55,
    scale:        0.72,
    bodyColor:    0x22ddff,
    bodyEmissive: 0x003344,
    eyeColor:     0xffffff,
    eyeEmissive:  0xaaffff,
    hpBarHi:  '#22ddff',
    hpBarMid: '#1199bb',
    hpBarLo:  '#ff3333',
  },
  {
    id:           'brute',
    label:        'Brute',
    weight:       15,
    speedMult:    0.6,
    hpMult:       2.5,
    scale:        1.45,
    bodyColor:    0x882200,
    bodyEmissive: 0x330800,
    eyeColor:     0xff6600,
    eyeEmissive:  0xff3300,
    hpBarHi:  '#ff8800',
    hpBarMid: '#ff4400',
    hpBarLo:  '#ff0000',
  },
  {
    id:           'ghost',
    label:        'Ghost',
    weight:       12,
    speedMult:    1.3,
    hpMult:       0.7,
    scale:        0.9,
    bodyColor:    0xaaaaff,
    bodyEmissive: 0x222266,
    eyeColor:     0xffffff,
    eyeEmissive:  0xccccff,
    hpBarHi:  '#aaaaff',
    hpBarMid: '#8888cc',
    hpBarLo:  '#ff3333',
  },
  {
    id:           'tank',
    label:        'Tank',
    weight:       8,
    speedMult:    0.45,
    hpMult:       4.0,
    scale:        1.7,
    bodyColor:    0x334400,
    bodyEmissive: 0x111800,
    eyeColor:     0xaaff00,
    eyeEmissive:  0x66cc00,
    hpBarHi:  '#aaff00',
    hpBarMid: '#66aa00',
    hpBarLo:  '#ff4400',
  },
];

// Pre-build a weighted pick table for O(1) random selection
const _ENEMY_TYPE_TABLE = (() => {
  const table = [];
  ENEMY_TYPES.forEach(t => {
    for (let i = 0; i < t.weight; i++) table.push(t);
  });
  return table;
})();

function pickRandomEnemyType() {
  return _ENEMY_TYPE_TABLE[Math.floor(Math.random() * _ENEMY_TYPE_TABLE.length)];
}

const ENEMY_BASE_SPEED = 2.2; // u/s, matches original CONFIG.ENEMY_SPEED
