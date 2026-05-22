/* =====================================================================
   text-render.js
   Single entry point for rendering mission-authored text. Handles:
     - HTML escaping
     - {icon}  / {_icon} lookup via IconMap
     - {N: content}  per-player blocks (highest-defined fallback)
     - {b|i|u|s|big|small|warn|ok|dim: content}  formatting wrappers
     - Arbitrary nesting (innermost-first replacement loop)

   Use it anywhere a string from a mission file reaches the DOM:
     mission titles, descriptions, act names, flavor, rules, objectives,
     stats labels, etc. Plain JS strings (app chrome like "Settings",
     "Win", "Duration") don't need it.

       TextRender.render(text)             // uses settings.players
       TextRender.render(text, players)    // explicit override
   ===================================================================== */

(function (global) {
  'use strict';

  var FORMAT_KEYS = ['b', 'i', 'u', 's', 'big', 'small', 'warn', 'ok', 'dim'];

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function defaultPlayers() {
    if (global.Storage && global.Storage.getSettings) {
      var p = parseInt(global.Storage.getSettings().players, 10);
      if (!isNaN(p) && p > 0) return p;
    }
    return 1;
  }

  // Determine which {N: ...} block to keep for the given player count.
  function pickActivePlayer(text, players) {
    var re = /\{(\d+)\s*:[^{}]*\}/g;
    var defined = [];
    var m;
    while ((m = re.exec(text)) !== null) defined.push(parseInt(m[1], 10));
    if (defined.length === 0) return -1;
    if (defined.indexOf(players) !== -1) return players;
    return Math.max.apply(null, defined);
  }

  // Render a string from a mission file as safe HTML.
  function render(rawText, players) {
    if (rawText == null) return '';
    if (players == null) players = defaultPlayers();

    var text = escapeHtml(rawText);
    var active = pickActivePlayer(rawText, players);

    var prev;
    var guard = 0;
    do {
      prev = text;
      text = text.replace(/\{([^{}]*)\}/g, function (match, inner) {
        var colonIdx = inner.indexOf(':');
        if (colonIdx === -1) {
          var entry = global.IconMap ? global.IconMap.lookup(inner) : null;
          if (!entry) return match;
          var cls = entry.small ? 'obj-icon small' : 'obj-icon';
          return '<img class="' + cls + '"' +
                 ' src="'   + escapeHtml(entry.src) + '"' +
                 ' alt="'   + escapeHtml(inner)     + '"' +
                 ' data-token="' + escapeHtml(inner) + '"' +
                 ' onerror="window.__iconFallback(this)">';
        }
        var key = inner.slice(0, colonIdx).trim();
        var content = inner.slice(colonIdx + 1).replace(/^\s/, '').replace(/\s$/, '');

        if (/^\d+$/.test(key)) {
          return parseInt(key, 10) === active ? content : '';
        }
        if (FORMAT_KEYS.indexOf(key) !== -1) {
          return '<span class="fmt-' + key + '">' + content + '</span>';
        }
        return match;
      });
      guard++;
    } while (text !== prev && guard < 12);

    // Collapse the double-spaces that appear where {N: ...} blocks were dropped.
    text = text.replace(/ {2,}/g, ' ');

    return text;
  }

  // Plain escape (no token processing) for app-controlled labels.
  function escape(s) { return escapeHtml(s); }

  // Global image-fallback handler. Referenced from inline onerror so it
  // works on dynamically injected HTML without per-render rewiring.
  global.__iconFallback = function (img) {
    if (!img) return;
    var token = img.dataset && img.dataset.token ? img.dataset.token : '?';
    var node = document.createTextNode('{' + token + '}');
    if (img.parentNode) img.parentNode.replaceChild(node, img);
  };

  global.TextRender = {
    render: render,
    escape: escape,
    FORMAT_KEYS: FORMAT_KEYS
  };

})(window);
