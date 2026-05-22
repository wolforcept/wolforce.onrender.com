/* =====================================================================
   theme.js
   Flips data-theme on <html>, updates meta theme-color, persists choice.
   Apply ASAP — call from index bootstrap before view rendering so the
   page never flashes the wrong palette.
   ===================================================================== */

(function (global) {
  'use strict';

  var THEMES = ['dark', 'light'];

  var META_COLORS = {
    dark:  '#1a1d1f',
    light: '#f5f5f5'
  };

  function apply(theme) {
    if (THEMES.indexOf(theme) === -1) theme = 'dark';
    document.documentElement.dataset.theme = theme;

    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', META_COLORS[theme]);
  }

  function get() {
    var s = Storage.getSettings();
    return s.theme || 'dark';
  }

  function set(theme) {
    if (THEMES.indexOf(theme) === -1) theme = 'dark';
    Storage.setSettings({ theme: theme });
    apply(theme);
    $(document).trigger('theme:change', [theme]);
    return theme;
  }

  function init() {
    apply(get());
  }

  global.Theme = {
    THEMES: THEMES,
    get: get,
    set: set,
    apply: apply,
    init: init
  };

})(window);
