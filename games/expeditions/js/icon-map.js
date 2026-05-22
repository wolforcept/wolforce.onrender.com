/* =====================================================================
   icon-map.js
   Maps token keys (the bit between { and }) to image paths.
   Mirrors the abbreviation table from the card-making tool.

   Token forms:
       {key}    normal-size icon
       {_key}   small-size icon (path swaps to *_small folder/file)

   Edit this file to add/remove icons. The game-view renderObjective
   helper reads the IconMap.get(key) function.
   ===================================================================== */

(function (global) {
  'use strict';

  var BASE = 'assets/';

  // Factions: {liz}, {dem}, {fur}, ...
  var FACTIONS = [
    'all', 'liz', 'dem', 'fur', 'sqd', 'avi',
    'por', 'gold', 'shield', 'wiz', 'merc', 'mask', 'silent'
  ];

  // Rolls (key -> image filename without extension)
  var ROLLS = {
    a: 'brain',
    m: 'melee',
    r: 'ranged',
    g: 'magic',
    v: 'move',
    u: 'util',
    l: 'build',
    c: 'chip',
    d: 'radar',
    h: 'shield',
    w: 'sword',
    z: 'zest'
  };

  // Dice (1..6 + left/right brackets)
  var DICE_NUMS = ['1', '2', '3', '4', '5', '6'];
  var DICE_BRACKETS = { '[': 'left', ']': 'right' };

  // World: {gear}, {hammer}, {key}
  var WORLD = ['gear', 'hammer', 'key'];

  // Misc one-offs (key -> filename without extension, at BASE root)
  var MISC = {
    'time': 'time',
    '/':    'slash',
    '>':    'arrow',
    '>>':   'arrow_infinite'
  };

  // Build the final map: { key: { src: '...png', small: bool } }
  var MAP = {};

  function add(key, src, small) {
    MAP[key] = { src: src, small: !!small };
  }

  FACTIONS.forEach(function (f) {
    add(f,        BASE + 'factions/'        + f + '.png', false);
    add('_' + f,  BASE + 'factions_small/'  + f + '.png', true);
  });

  Object.keys(ROLLS).forEach(function (k) {
    var name = ROLLS[k];
    add(k,        BASE + 'rolls/'           + name + '.png', false);
    add('_' + k,  BASE + 'rolls_small/'     + name + '.png', true);
  });

  DICE_NUMS.forEach(function (n) {
    add(n,        BASE + 'dice/'            + n + '.png', false);
    add('_' + n,  BASE + 'dice_small/'      + n + '.png', true);
  });

  Object.keys(DICE_BRACKETS).forEach(function (k) {
    var name = DICE_BRACKETS[k];
    add(k,        BASE + 'dice/'            + name + '.png', false);
    add('_' + k,  BASE + 'dice_small/'      + name + '.png', true);
  });

  WORLD.forEach(function (w) {
    add(w,        BASE + 'world/'           + w + '.png', false);
    add('_' + w,  BASE + 'world_small/'     + w + '.png', true);
  });

  Object.keys(MISC).forEach(function (k) {
    var name = MISC[k];
    add(k,        BASE + name + '.png',                false);
    add('_' + k,  BASE + name + '_small.png',          true);
  });

  function lookup(key) {
    return MAP[key] || null;
  }

  global.IconMap = {
    lookup: lookup,
    raw: MAP
  };

})(window);
