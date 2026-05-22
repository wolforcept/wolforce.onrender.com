/* =====================================================================
   app.js
   Bootstrap + hash router. All views live inside index.html; this file
   chooses which one is visible based on location.hash.

   It also loads the predefined missions on first run and exposes a
   global App.missions registry that other views read from.
   ===================================================================== */

(function (global) {
  'use strict';

  var VIEWS = ['missions', 'settings', 'stats', 'game', 'end'];
  var DEFAULT_VIEW = 'missions';

  var App = {
    ready: false,
    onReady: []
  };

  // ------- View routing -------
  function showView(name) {
    if (VIEWS.indexOf(name) === -1) name = DEFAULT_VIEW;

    VIEWS.forEach(function (v) {
      $('#view-' + v).toggleClass('hidden', v !== name);
    });

    // Back button visibility: anything other than the missions list
    $('#back-btn').toggleClass('hidden', name === 'missions');
    $('#settings-btn').toggleClass('hidden', name !== 'missions');
    // Players-cycle button only makes sense on the missions list
    $('#players-btn').toggleClass('hidden', name !== 'missions');
    // On the game view we hide the logo and show the current act name
    // in the top bar instead. Other views show the logo as usual.
    var inGame = name === 'game';
    $('#logo, #logo-text').toggleClass('hidden', inGame);
    $('#top-act-name').toggleClass('hidden', !inGame);

    // Notify view modules
    $(document).trigger('view:show', [name]);

    // Sync hash without re-triggering hashchange
    var target = '#' + name;
    if (location.hash !== target) {
      history.replaceState(null, '', target);
    }

    // Scroll to top of the new view
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function handleHashChange() {
    var name = (location.hash || '').replace(/^#/, '') || DEFAULT_VIEW;
    showView(name);
  }

  // Combined list (synced + uploaded) for view consumers
  function allMissions() {
    var synced = MissionSync.all();
    var uploaded = Storage.getUploadedMissions().map(function (m) {
      return Object.assign({}, m, { source: 'uploaded' });
    });
    return synced.concat(uploaded);
  }

  function findMissionById(id) {
    var all = allMissions();
    for (var i = 0; i < all.length; i++) {
      if (all[i].id === id) return all[i];
    }
    return null;
  }

  // ------- Toast helper (Materialize) -------
  function toast(message, classes) {
    if (global.M && M.toast) {
      M.toast({ html: message, classes: classes || '', displayLength: 2400 });
    } else {
      console.log('[toast]', message);
    }
  }

  // ------- Service worker -------
  // On localhost we *don't* want the SW active — its aggressive cache
  // makes JS/CSS edits invisible until cache invalidation. So in dev we
  // skip registration AND tear down any SW that a previous visit left
  // behind. In production (non-localhost) we register normally.
  function isLocalhost() {
    var h = location.hostname;
    return h === 'localhost' || h === '127.0.0.1' || h === '0.0.0.0' || /\.local$/.test(h);
  }

  function registerSW() {
    if (!('serviceWorker' in navigator)) return;

    if (isLocalhost()) {
      navigator.serviceWorker.getRegistrations().then(function (regs) {
        regs.forEach(function (r) {
          r.unregister().then(function () { console.log('[sw] unregistered in dev'); });
        });
      });
      if (window.caches) {
        caches.keys().then(function (keys) {
          keys.forEach(function (k) { caches.delete(k); });
        });
      }
      return;
    }

    window.addEventListener('load', function () {
      navigator.serviceWorker.register('service-worker.js')
        .catch(function (e) { console.warn('[sw] register failed', e); });
    });
  }

  // ------- PWA install -------
  // Stash the browser-fired beforeinstallprompt event so the user can
  // trigger it from a button instead of being prompted automatically.
  // Note: the browser decides when to fire this — typically on the
  // first eligible visit. After install or dismissal, the browser may
  // not refire it until next session.
  var deferredInstallPrompt = null;
  var isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  var isStandalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
                     window.navigator.standalone === true;

  function syncInstallButton() {
    // Hide only when the app is already running standalone (installed).
    // Otherwise show the button — its click handler gracefully explains
    // when install isn't currently possible.
    $('#install-group').toggleClass('hidden', isStandalone);
  }

  function handleInstallClick() {
    if (deferredInstallPrompt) {
      var promptEvent = deferredInstallPrompt;
      deferredInstallPrompt = null;
      promptEvent.prompt();
      promptEvent.userChoice.then(function (choice) {
        if (choice && choice.outcome === 'accepted') {
          App.toast('Installing…');
        }
        syncInstallButton();
      });
      return;
    }
    if (isIOSDevice) {
      Modal.alert({
        title:        'Install on iOS',
        message:      'Open the Share menu in Safari, then choose "Add to Home Screen" to install Expeditions Companion.',
        confirmLabel: 'Got it'
      });
      return;
    }
    // No deferred prompt and not iOS — the browser hasn't offered to
    // install. Most common reason in development: the service worker
    // is intentionally disabled on localhost.
    Modal.alert({
      title:        'Install not available right now',
      message:      'Your browser will only offer an install option once the app is served over HTTPS (or as a deployed PWA) with the service worker active. On localhost the service worker is disabled to avoid cache issues, so install can\'t be triggered here. Try Chrome or Edge on the deployed site.',
      confirmLabel: 'Got it'
    });
  }

  // ------- Players-cycle button -------
  var PLAYERS_MIN = 1;
  var PLAYERS_MAX = 6;

  function syncPlayersBtn() {
    var p = parseInt(Storage.getSettings().players, 10) || 1;
    p = Math.max(PLAYERS_MIN, Math.min(PLAYERS_MAX, p));
    $('#players-btn').text(p);
  }

  function cyclePlayers() {
    var p = parseInt(Storage.getSettings().players, 10) || 1;
    p = p + 1;
    if (p > PLAYERS_MAX) p = PLAYERS_MIN;
    Storage.setSettings({ players: p });
    $(document).trigger('settings:changed');
  }

  // ------- Bootstrap -------
  function init() {
    Theme.init();

    // Wire global navigation (any element with data-show="<view>")
    $(document).on('click', '[data-show]', function () {
      showView($(this).data('show'));
    });

    // Players-cycle button on the top bar
    syncPlayersBtn();
    $(document).on('click', '#players-btn', cyclePlayers);
    $(document).on('settings:changed', syncPlayersBtn);

    // PWA install button (wired up; visibility decided by syncInstallButton)
    syncInstallButton();
    $(document).on('click', '#install-btn', handleInstallClick);

    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault();
      deferredInstallPrompt = e;
      syncInstallButton();
    });
    window.addEventListener('appinstalled', function () {
      deferredInstallPrompt = null;
      isStandalone = true;
      syncInstallButton();
      App.toast('App installed');
    });

    // First view from hash (or default)
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    // The synced missions are already in localStorage from a previous
    // visit (if any) — views read them via App.allMissions() immediately.
    // Kick off a background refresh to pick up any new/updated missions
    // from the server. We mark "ready" once that sync attempt finishes
    // (success or fail) so views can render the freshest content.
    MissionSync.sync().then(function () {
      App.ready = true;
      $(document).trigger('app:ready');
    });

    // If no synced missions exist locally yet (e.g. very first launch
    // with the cache primed by the service worker), we still want the
    // missions-view to render whatever IS available right now.
    $(document).trigger('missions:changed');

    registerSW();
  }

  // Expose
  App.showView         = showView;
  App.allMissions      = allMissions;
  App.findMissionById  = findMissionById;
  App.toast            = toast;

  global.App = App;

  $(function () { init(); });

})(window);
