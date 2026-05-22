/* =====================================================================
   settings-view.js
   Wires the settings screen: theme picker, players stepper, upload,
   stats navigation, and granular erase buttons.
   ===================================================================== */

(function (global) {
  'use strict';

  // ----- Sync controls to current settings -----
  function syncFromStorage() {
    var s = Storage.getSettings();

    // Theme picker
    $('#theme-picker .seg-btn').each(function () {
      $(this).toggleClass('active', $(this).data('theme') === s.theme);
    });

    // Players input
    var players = Math.max(1, Math.min(6, parseInt(s.players, 10) || 1));
    $('#players-input').val(players);
  }

  // ----- Theme picker -----
  $(document).on('click', '#theme-picker .seg-btn', function () {
    var theme = $(this).data('theme');
    Theme.set(theme);
    syncFromStorage();
  });

  // ----- Players stepper -----
  function clampPlayers(n) {
    n = parseInt(n, 10);
    if (isNaN(n)) n = 1;
    return Math.max(1, Math.min(6, n));
  }
  function setPlayers(n) {
    var v = clampPlayers(n);
    $('#players-input').val(v);
    Storage.setSettings({ players: v });
    $(document).trigger('settings:changed');
  }
  $(document).on('click', '#players-minus', function () {
    setPlayers((parseInt($('#players-input').val(), 10) || 1) - 1);
  });
  $(document).on('click', '#players-plus', function () {
    setPlayers((parseInt($('#players-input').val(), 10) || 1) + 1);
  });
  $(document).on('change', '#players-input', function () {
    setPlayers($(this).val());
  });

  // ----- Upload mission(s) -----
  $(document).on('click', '#upload-btn', function () {
    $('#upload-input').val('').trigger('click');
  });

  $(document).on('change', '#upload-input', function (e) {
    var files = e.target.files;
    if (!files || files.length === 0) return;

    var pending = files.length;
    var added = 0;
    var failed = 0;

    Array.prototype.forEach.call(files, function (file) {
      var reader = new FileReader();
      reader.onload = function () {
        try {
          var text = reader.result;
          var parsed = MissionParser.parse(text);
          if (!parsed.name) parsed.name = file.name.replace(/\.[^.]+$/, '');
          Storage.addUploadedMission({
            id:       'uploaded:' + Date.now() + ':' + file.name,
            filename: file.name,
            raw:      text,
            parsed:   parsed,
            uploadedAt: new Date().toISOString()
          });
          added++;
        } catch (err) {
          console.warn('upload parse failed', file.name, err);
          failed++;
        }
        if (--pending === 0) onDone();
      };
      reader.onerror = function () {
        failed++;
        if (--pending === 0) onDone();
      };
      reader.readAsText(file);
    });

    function onDone() {
      if (added > 0) {
        App.toast(added + ' mission' + (added === 1 ? '' : 's') + ' uploaded');
        $(document).trigger('missions:changed');
      }
      if (failed > 0) {
        App.toast(failed + ' file' + (failed === 1 ? '' : 's') + ' failed to parse');
      }
    }
  });

  // ----- Danger zone -----
  var ERASE_HANDLERS = {
    plays: {
      label: 'all recorded plays',
      run:   function () { Storage.clearPlays(); }
    },
    uploaded: {
      label: 'all uploaded missions',
      run:   function () { Storage.clearUploadedMissions(); }
    },
    current: {
      label: 'the current game',
      run:   function () { Storage.clearCurrentGame(); }
    },
    settings: {
      label: 'theme and player count',
      run:   function () {
        Storage.resetSettings();
        Theme.apply(Storage.getSettings().theme);
        syncFromStorage();
      }
    },
    all: {
      label: 'EVERYTHING (settings, missions, plays, current game)',
      run:   function () {
        Storage.clearAll();
        Theme.apply(Storage.getSettings().theme);
        syncFromStorage();
      }
    }
  };

  $(document).on('click', '[data-erase]', function () {
    var key = $(this).data('erase');
    var h = ERASE_HANDLERS[key];
    if (!h) return;
    Modal.confirm({
      title:        'Erase?',
      message:      'Erase ' + h.label + '? This cannot be undone.',
      confirmLabel: 'Erase',
      danger:       true
    }).then(function (ok) {
      if (!ok) return;
      h.run();
      App.toast('Erased ' + h.label);
      $(document).trigger('missions:changed');
      $(document).trigger('game:changed');
      $(document).trigger('plays:changed');
      $(document).trigger('settings:changed');
    });
  });

  // ----- Sync whenever the view is shown -----
  $(document).on('view:show', function (e, name) {
    if (name === 'settings') syncFromStorage();
  });
  // ...or when settings change from elsewhere (e.g. the top-bar
  // players-cycle button)
  $(document).on('settings:changed', syncFromStorage);

  global.SettingsView = { syncFromStorage: syncFromStorage };

})(window);
