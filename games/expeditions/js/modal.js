/* =====================================================================
   modal.js
   Drop-in replacement for window.confirm() — same intent, themed UI.

       Modal.confirm({
         title:        'Delete mission?',     // optional
         message:      'This cannot be undone.',
         confirmLabel: 'Delete',              // optional, default 'OK'
         cancelLabel:  'Cancel',              // optional
         danger:       true                   // optional, makes confirm red
       }).then(function (ok) {
         if (!ok) return;
         // user confirmed
       });

   The returned Promise resolves with `true` for confirm and `false` for
   cancel (Escape, backdrop click, or the Cancel button).
   ===================================================================== */

(function (global) {
  'use strict';

  var pending = null;         // { resolve, prevFocus }
  var transitionMs = 180;     // matches CSS

  function open(opts) {
    opts = opts || {};

    // If a modal is already open, resolve it as cancel and replace.
    if (pending) {
      var prev = pending; pending = null;
      prev.resolve(false);
    }

    return new Promise(function (resolve) {
      var $backdrop = $('#modal-backdrop');
      var $title    = $('#modal-title');
      var $message  = $('#modal-message');
      var $confirm  = $('#modal-confirm');
      var $cancel   = $('#modal-cancel');

      // Populate
      var hasTitle = !!opts.title;
      $title.text(opts.title || '').toggle(hasTitle);
      $message.text(opts.message || '');
      $confirm.text(opts.confirmLabel || 'OK')
              .toggleClass('danger', !!opts.danger);
      // Alert-style: pass cancelLabel: null to hide the cancel button.
      var showCancel = opts.cancelLabel !== null;
      $cancel.text(opts.cancelLabel || 'Cancel').toggle(showCancel);

      // Show
      $backdrop.removeClass('hidden').attr('aria-hidden', 'false');
      void $backdrop[0].offsetHeight;  // reflow → enables transition
      $backdrop.addClass('shown');

      // Track previously focused element so we can restore on close
      pending = {
        resolve:   resolve,
        prevFocus: document.activeElement
      };

      // Move focus into the modal — cancel for destructive (safer
      // default), otherwise confirm.
      setTimeout(function () {
        (opts.danger ? $cancel : $confirm).trigger('focus');
      }, 30);
    });
  }

  function close(answer) {
    if (!pending) return;
    var p = pending; pending = null;

    var $backdrop = $('#modal-backdrop');
    $backdrop.removeClass('shown').attr('aria-hidden', 'true');
    setTimeout(function () {
      // If another modal opened during the transition, don't hide.
      if (!pending) $backdrop.addClass('hidden');
    }, transitionMs);

    // Restore previous focus
    if (p.prevFocus && p.prevFocus.focus) {
      try { p.prevFocus.focus(); } catch (e) { /* element might be gone */ }
    }

    p.resolve(answer);
  }

  // ----- Wire interactions -----
  $(document).on('click', '#modal-confirm', function () { close(true);  });
  $(document).on('click', '#modal-cancel',  function () { close(false); });

  // Backdrop click (NOT clicks inside the modal card)
  $(document).on('click', '#modal-backdrop', function (e) {
    if (e.target === this) close(false);
  });

  // Escape key
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape' && pending) close(false);
  });

  // Info dialog — same as confirm() but only a single OK button.
  function alert(opts) {
    opts = Object.assign({}, opts || {}, { cancelLabel: null });
    return open(opts);
  }

  global.Modal = {
    confirm: open,
    alert:   alert
  };

})(window);
