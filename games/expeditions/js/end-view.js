/* =====================================================================
   end-view.js
   Shown when a game ends — victory or defeat. Records the play in
   localStorage so the stats view picks it up, then clears the current
   game so the continue banner disappears.
   ===================================================================== */

(function (global) {
  'use strict';

  function formatDuration(ms) {
    if (!isFinite(ms) || ms < 0) ms = 0;
    var total = Math.floor(ms / 1000);
    var h = Math.floor(total / 3600);
    var m = Math.floor((total % 3600) / 60);
    var s = total % 60;
    if (h > 0) return h + 'h ' + pad(m) + 'm ' + pad(s) + 's';
    return m + 'm ' + pad(s) + 's';
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function show(opts) {
    var mission = opts.mission;
    var state   = opts.state;
    var outcome = opts.outcome;

    var acts = (mission.parsed.acts || []);
    var totalObjectives = acts.reduce(function (a, act) { return a + (act.objectives || []).length; }, 0);
    var objectivesDone = (state.actsState || []).reduce(function (a, as) {
      return a + (as.objectivesDone || []).filter(Boolean).length;
    }, 0);
    var actsReached = outcome === 'win' ? acts.length : (state.currentAct + 1);
    var startedAt = new Date(state.startedAt);
    var durationMs = Date.now() - startedAt.getTime();
    var actionsUsed = (state.startingActions || 0) - (state.actionsRemaining || 0);

    // Record the play
    Storage.addPlay({
      missionId:        mission.id,
      missionName:      mission.parsed.name || 'Mission',
      outcome:          outcome,
      startedAt:        state.startedAt,
      endedAt:          new Date().toISOString(),
      durationMs:       durationMs,
      players:          state.players,
      startingActions:  state.startingActions,
      actionsUsed:      actionsUsed,
      actionsRemaining: state.actionsRemaining,
      objectivesDone:   objectivesDone,
      totalObjectives:  totalObjectives,
      actsReached:      actsReached,
      totalActs:        acts.length
    });

    Storage.clearCurrentGame();
    $(document).trigger('game:changed');
    $(document).trigger('plays:changed');

    // Render
    $('#end-banner')
      .removeClass('victory defeat')
      .addClass(outcome === 'win' ? 'victory' : 'defeat');
    $('#end-title').text(outcome === 'win' ? 'Victory' : 'Defeat');

    var $stats = $('#end-stats').empty();
    function row(key, val) {
      $stats.append(
        '<div class="end-stat">' +
          '<span class="end-key">' + key + '</span>' +
          '<span class="end-val">' + val + '</span>' +
        '</div>'
      );
    }
    row('Mission',     TextRender.render(mission.parsed.name || '', state.players));
    row('Players',     state.players);
    row('Duration',    formatDuration(durationMs));
    row('Actions used', actionsUsed);
    row('Actions left', state.actionsRemaining);
    row('Objectives',  objectivesDone + ' / ' + totalObjectives);
    row('Acts reached', actsReached + ' / ' + acts.length);

    App.showView('end');
  }

  // The end view holds its content only in the DOM — there's no
  // persistent record we want to rehydrate. So if the user lands here
  // without first going through show() (e.g. refresh while on #end),
  // bounce back to the missions list rather than showing an empty page.
  $(document).on('view:show', function (e, name) {
    if (name !== 'end') return;
    if (!$('#end-title').text()) {
      App.showView('missions');
    }
  });

  global.EndView = { show: show };

})(window);
