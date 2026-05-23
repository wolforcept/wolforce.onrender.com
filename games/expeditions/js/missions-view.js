/* =====================================================================
   missions-view.js
   Renders the mission list + the "Continue Previous Mission" banner.
   Builds rows lazily — only when the view is shown — and re-renders
   when missions are uploaded or local storage is wiped.
   ===================================================================== */

(function (global) {
    'use strict';

    function renderRow(mission) {
        var p = mission.parsed || {};
        var name = TextRender.render(p.name || mission.filename || 'Untitled');
        var desc = TextRender.render(p.description || '');
        var diff = TextRender.render(p.difficulty || '');
        var author = TextRender.render(p.author || '');
        var actionsMax = parseInt(p.actions.split(",")[0], 10) || 0;
        var actionsMin = parseInt(p.actions.split(",")[5], 10) || 0;
        // var actions = parseInt(p.actions, 10) || 0;
        var acts = (p.acts || []).length;
        var isUploaded = mission.source === 'uploaded';
        var badge = isUploaded ? '<span class="mission-badge">Custom</span>' : '';

        return $(
            '<li class="mission-row" data-mission-id="' + TextRender.escape(mission.id) + '">' +
            '<button class="mission-header" type="button">' +
            '<span class="mission-title">' + name + ' ' + badge + '</span>' +
            '<span class="mission-chev"><i class="material-icons">expand_more</i></span>' +
            '</button>' +
            '<div class="mission-body">' +
            (desc ? '<p class="mission-desc">' + desc + '</p>' : '') +
            (author ? '<p class="mission-author">by ' + author + '</p>' : '') +
            '<div class="mission-meta">' +
            (diff ? '<span class="meta-chip">' + diff + '</span>' : '') +
            (actionsMin && actionsMax ? '<span class="meta-chip">' + actionsMin + ' - ' + actionsMax + ' actions</span>' : '') +
            (acts ? '<span class="meta-chip">' + acts + (acts === 1 ? ' act' : ' acts') + '</span>' : '') +
            '</div>' +
            '<button class="mission-start" type="button">' +
            '<i class="material-icons">play_arrow</i> Start mission' +
            '</button>' +
            (isUploaded ?
                '<button class="mission-delete" type="button">' +
                '<i class="material-icons">delete_outline</i> Delete mission' +
                '</button>' : '') +
            '</div>' +
            '</li>'
        );
    }

    function renderList() {
        var $list = $('#mission-list').empty();
        var missions = App.allMissions();

        if (missions.length === 0) {
            $('#missions-empty').removeClass('hidden');
            return;
        }
        $('#missions-empty').addClass('hidden');

        missions.forEach(function (m) {
            $list.append(renderRow(m));
        });
    }

    function renderContinueBanner() {
        var $banner = $('#continue-banner');
        var current = Storage.getCurrentGame();
        if (!current) {
            $banner.addClass('hidden');
            return;
        }

        var mission = App.findMissionById(current.missionId);
        var name = mission && mission.parsed && mission.parsed.name
            ? mission.parsed.name
            : 'Saved game';
        var actName = '';
        if (mission && mission.parsed && mission.parsed.acts) {
            var act = mission.parsed.acts[current.currentAct || 0];
            if (act && act.name) actName = act.name;
        }

        var detail = actName ? (name + ' — ' + actName) : name;
        $banner.removeClass('hidden');
        $banner.find('.continue-detail').html(TextRender.render(detail));
    }

    function refresh() {
        renderList();
        renderContinueBanner();
    }

    // ----- Event wiring -----

    // Expand/collapse a row (accordion behavior)
    $(document).on('click', '#mission-list .mission-header', function () {
        var $row = $(this).closest('.mission-row');
        var wasOpen = $row.hasClass('open');
        $('#mission-list .mission-row').removeClass('open');
        if (!wasOpen) $row.addClass('open');
    });

    // Start a mission
    $(document).on('click', '#mission-list .mission-start', function () {
        var id = $(this).closest('.mission-row').data('missionId');
        var mission = App.findMissionById(id);
        if (!mission) {
            App.toast('Mission not found');
            return;
        }

        var current = Storage.getCurrentGame();
        var prompt = null;

        if (current && current.missionId !== id) {
            prompt = {
                title: 'Discard current game?',
                message: 'A game is already in progress for another mission. Starting this one will discard it.',
                confirmLabel: 'Discard & start',
                danger: true
            };
        } else if (current && current.missionId === id) {
            prompt = {
                title: 'Restart mission?',
                message: 'Your current progress on this mission will be lost.',
                confirmLabel: 'Restart',
                danger: true
            };
        }

        function startNow() {
            if (current) Storage.clearCurrentGame();
            GameView.start(mission);
        }

        if (!prompt) { startNow(); return; }

        Modal.confirm(prompt).then(function (ok) {
            if (ok) startNow();
        });
    });

    // Delete an uploaded mission
    $(document).on('click', '#mission-list .mission-delete', function () {
        var id = $(this).closest('.mission-row').data('missionId');
        var mission = App.findMissionById(id);
        if (!mission) return;

        var name = (mission.parsed && mission.parsed.name) || 'this mission';
        Modal.confirm({
            title: 'Delete mission?',
            message: 'Delete "' + name + '"? This cannot be undone.',
            confirmLabel: 'Delete',
            danger: true
        }).then(function (ok) {
            if (!ok) return;

            // Drop the in-progress save if it's tied to the mission we're deleting
            var current = Storage.getCurrentGame();
            if (current && current.missionId === id) {
                Storage.clearCurrentGame();
            }

            Storage.removeUploadedMission(id);
            App.toast('Mission deleted');
            $(document).trigger('missions:changed');
            $(document).trigger('game:changed');
        });
    });

    // Continue banner
    $(document).on('click', '#continue-btn', function () {
        var current = Storage.getCurrentGame();
        if (!current) {
            refresh();
            return;
        }
        var mission = App.findMissionById(current.missionId);
        if (!mission) {
            App.toast('Saved mission no longer exists');
            Storage.clearCurrentGame();
            refresh();
            return;
        }
        GameView.resume(mission, current);
    });

    // Refresh whenever missions view becomes visible
    $(document).on('view:show', function (e, name) {
        if (name === 'missions') refresh();
    });

    // Refresh on app ready (predefined missions loaded)
    $(document).on('app:ready', refresh);

    // Refresh when uploaded missions change or current game changes
    $(document).on('missions:changed game:changed', refresh);

    global.MissionsView = { refresh: refresh };

})(window);
