/* =====================================================================
   stats-view.js
   Aggregates the recorded plays into a summary strip + per-play
   expandable list.
   ===================================================================== */

(function (global) {
  'use strict';

  function escapeText(s) { return TextRender.escape(s); }

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function formatDuration(ms) {
    if (!isFinite(ms) || ms < 0) ms = 0;
    var total = Math.floor(ms / 1000);
    var h = Math.floor(total / 3600);
    var m = Math.floor((total % 3600) / 60);
    var s = total % 60;
    if (h > 0) return h + 'h ' + pad(m) + 'm ' + pad(s) + 's';
    return m + 'm ' + pad(s) + 's';
  }

  function formatDate(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    if (isNaN(d)) return '';
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) +
           ' ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  }

  function renderSummary(plays) {
    var wins = plays.filter(function (p) { return p.outcome === 'win'; }).length;
    var losses = plays.length - wins;
    var winRate = plays.length === 0 ? 0 : Math.round((wins / plays.length) * 100);
    var avgMs = plays.length === 0 ? 0
      : Math.round(plays.reduce(function (a, p) { return a + (p.durationMs || 0); }, 0) / plays.length);

    var html = '' +
      card(plays.length, 'Plays') +
      card(wins,         'Wins') +
      card(losses,       'Losses') +
      card(winRate + '%','Win rate') +
      card(formatDuration(avgMs), 'Avg time');

    $('#stats-summary').html(html);
  }

  function card(num, label) {
    return '<div class="stat-card">' +
             '<span class="stat-num">' + escapeText(num) + '</span>' +
             '<span class="stat-label">' + escapeText(label) + '</span>' +
           '</div>';
  }

  function renderList(plays) {
    var $list = $('#stats-list').empty();
    if (plays.length === 0) {
      $('#stats-empty').removeClass('hidden');
      return;
    }
    $('#stats-empty').addClass('hidden');

    // Most recent first
    plays.slice().reverse().forEach(function (p, idx) {
      var outcomeCls = p.outcome === 'win' ? 'win' : 'loss';
      var outcomeLbl = p.outcome === 'win' ? 'Win' : 'Loss';
      var $row = $(
        '<li class="stat-row" data-idx="' + idx + '">' +
          '<button class="stat-header" type="button">' +
            '<span class="outcome-chip ' + outcomeCls + '">' + outcomeLbl + '</span>' +
            '<span class="stat-row-title">' + TextRender.render(p.missionName || 'Mission', p.players) + '</span>' +
            '<span class="stat-row-date">' + escapeText(formatDate(p.endedAt || p.startedAt)) + '</span>' +
          '</button>' +
          '<div class="stat-body">' +
            line('Duration',  formatDuration(p.durationMs || 0)) +
            line('Players',   p.players || 1) +
            line('Actions used',      (p.actionsUsed != null      ? p.actionsUsed      : '—')) +
            line('Actions remaining', (p.actionsRemaining != null ? p.actionsRemaining : '—')) +
            line('Objectives', (p.objectivesDone || 0) + ' / ' + (p.totalObjectives || 0)) +
            line('Acts reached', (p.actsReached || 0) + ' / ' + (p.totalActs || 0)) +
          '</div>' +
        '</li>'
      );
      $list.append($row);
    });
  }

  function line(key, val) {
    return '<div class="end-stat">' +
             '<span class="end-key">' + escapeText(key) + '</span>' +
             '<span class="end-val">' + escapeText(val) + '</span>' +
           '</div>';
  }

  function refresh() {
    var plays = Storage.getPlays();
    renderSummary(plays);
    renderList(plays);
  }

  // Expand/collapse a play row — accordion: opening one closes the rest
  $(document).on('click', '#stats-list .stat-header', function () {
    var $row = $(this).closest('.stat-row');
    var wasOpen = $row.hasClass('open');
    $('#stats-list .stat-row').removeClass('open');
    if (!wasOpen) $row.addClass('open');
  });

  $(document).on('view:show', function (e, name) {
    if (name === 'stats') refresh();
  });
  $(document).on('plays:changed', refresh);

  global.StatsView = { refresh: refresh };

})(window);
