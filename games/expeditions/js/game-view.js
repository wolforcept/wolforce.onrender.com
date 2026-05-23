/* =====================================================================
   game-view.js
   Drives the in-game screen: mission title row, action counter row,
   act header, objectives, and the bottom progress strip.

   Public:
       GameView.start(mission)            — start fresh
       GameView.resume(mission, savedState) — pick up where left off

   State shape stored under "expeditions:currentGame":
       {
         missionId,
         startedAt,          ISO timestamp
         players,            number 1..6
         startingActions,    initial counter value
         actionsRemaining,
         currentAct,         index into mission.parsed.acts
         actsState: [
           { objectivesDone: [bool, ...] }, ...
         ],
         defeated            true once the user confirms the defeated chip
       }
   ===================================================================== */

(function (global) {
    'use strict';

    var state = null;          // current-game in-memory mirror of storage
    var mission = null;        // active mission object {id, parsed, ...}

    // ----------------- State management -----------------

    function buildFreshState(missionObj, players) {
        var acts = (missionObj.parsed.acts || []).map(function (act) {
            return { objectivesDone: (act.objectives || []).map(function () { return false; }) };
        });
        console.log(missionObj)
        var actionsPerNplayers = missionObj.parsed.actions.split(",")
        var base = parseInt(actionsPerNplayers[players - 1], 10) || 0;
        return {
            missionId: missionObj.id,
            startedAt: new Date().toISOString(),
            players: players,
            startingActions: base,
            actionsRemaining: base,
            currentAct: 0,
            actsState: acts,
            defeated: false
        };
    }

    function persist() {
        if (state) Storage.setCurrentGame(state);
    }

    // ----------------- Rendering -----------------

    function renderActionCounter() {
        var $chip = $('#action-chip');
        var $count = $('#action-count');
        var $label = $chip.find('.action-label');

        if (state.actionsRemaining <= 0) {
            $chip.addClass('defeated');
            $label.text('Defeated — tap to confirm');
            $count.text('0');
        } else {
            $chip.removeClass('defeated');
            $label.text('');
            $count.text(String(state.actionsRemaining));
        }
    }

    function renderActHeader() {
        var act = mission.parsed.acts[state.currentAct] || {};
        $('#top-act-name').html(TextRender.render(act.name || ('Act ' + (state.currentAct + 1)), state.players));
        $('#act-flavor').html(TextRender.render(act.flavor || '', state.players));
        $('#act-rules').html(TextRender.render(act.rules || '', state.players));
    }

    function renderObjectives() {
        var act = mission.parsed.acts[state.currentAct];
        var doneFlags = state.actsState[state.currentAct].objectivesDone;

        var $list = $('#objective-list').empty();

        (act.objectives || []).forEach(function (text, i) {
            var html = TextRender.render(text, state.players);
            var $row = $(
                '<li class="objective-row" data-idx="' + i + '">' +
                '<div class="objective-text">' + html + '</div>' +
                '<span class="objective-check">' +
                '<i class="material-icons">check</i>' +
                '</span>' +
                '</li>'
            );
            if (doneFlags[i]) $row.addClass('done');
            $list.append($row);
        });
    }

    function renderActStrip() {
        var $strip = $('#act-strip').empty();
        var total = mission.parsed.acts.length;
        for (var i = 0; i < total; i++) {
            var cls = 'act-dot';
            if (i < state.currentAct) cls += ' done';
            else if (i === state.currentAct) cls += ' current';
            $strip.append('<span class="' + cls + '"></span>');
        }
    }

    function renderAll() {
        renderActionCounter();
        renderActHeader();
        renderObjectives();
        renderActStrip();
    }

    // ----------------- Flow -----------------

    function start(missionObj) {
        mission = missionObj;
        var settings = Storage.getSettings();
        var players = Math.max(1, Math.min(6, parseInt(settings.players, 10) || 1));
        state = buildFreshState(missionObj, players);
        persist();
        $(document).trigger('game:changed');
        renderAll();
        App.showView('game');
    }

    function resume(missionObj, savedState) {
        mission = missionObj;
        state = savedState;
        // Defensive: if mission structure changed since save, normalize
        var acts = mission.parsed.acts || [];
        if (!Array.isArray(state.actsState) || state.actsState.length !== acts.length) {
            state.actsState = acts.map(function (act, i) {
                var prev = (state.actsState && state.actsState[i]) || {};
                var doneFlags = (act.objectives || []).map(function (_, j) {
                    return !!(prev.objectivesDone && prev.objectivesDone[j]);
                });
                return { objectivesDone: doneFlags };
            });
        }
        if (state.currentAct >= acts.length) state.currentAct = Math.max(0, acts.length - 1);
        persist();
        renderAll();
        App.showView('game');
    }

    function toggleObjective(idx) {
        var doneFlags = state.actsState[state.currentAct].objectivesDone;
        doneFlags[idx] = !doneFlags[idx];
        persist();
        // Re-render the row's class only — cheap
        var $row = $('#objective-list .objective-row[data-idx="' + idx + '"]');
        $row.toggleClass('done', doneFlags[idx]);

        // If all done, auto-advance after a short pause for visual feedback
        if (doneFlags.length > 0 && doneFlags.every(Boolean)) {
            setTimeout(advanceAct, 350);
        }
    }

    function advanceAct() {
        var acts = mission.parsed.acts || [];
        if (state.currentAct + 1 >= acts.length) {
            finishVictory();
            return;
        }

        var $fade = $('#act-header, #objective-list');
        $fade.addClass('fading');

        // After the fade-out completes, swap in the next act's content while
        // still invisible, force a reflow, then drop the class to fade in.
        setTimeout(function () {
            state.currentAct += 1;
            persist();
            renderActHeader();
            renderObjectives();
            renderActStrip();

            // Reflow so the browser registers the swapped content as the new
            // baseline for the next transition.
            void $fade[0].offsetHeight;

            $fade.removeClass('fading');
        }, 300);
    }

    function finishVictory() {
        EndView.show({ mission: mission, state: state, outcome: 'win' });
    }

    function finishDefeat() {
        state.defeated = true;
        persist();
        EndView.show({ mission: mission, state: state, outcome: 'loss' });
    }

    // ----------------- Event wiring -----------------

    // Action chip: decrement, or confirm defeat at zero
    $(document).on('click', '#action-chip', function () {
        if (!state) return;
        if (state.actionsRemaining <= 0) {
            finishDefeat();
            return;
        }
        state.actionsRemaining = Math.max(0, state.actionsRemaining - 1);
        persist();
        renderActionCounter();
    });

    // Plus button: increment (no upper bound — undo cases happen)
    $(document).on('click', '#action-plus', function () {
        if (!state) return;
        state.actionsRemaining += 1;
        persist();
        renderActionCounter();
    });

    // Minus button: same effect as tapping the chip — decrement. Unlike
    // the chip it does NOT confirm defeat at zero; that stays a single
    // intentional tap on the center chip.
    $(document).on('click', '#action-minus', function () {
        if (!state) return;
        if (state.actionsRemaining <= 0) return;
        state.actionsRemaining = Math.max(0, state.actionsRemaining - 1);
        persist();
        renderActionCounter();
    });

    // Objective tap: toggle done
    $(document).on('click', '#objective-list .objective-row', function () {
        var idx = parseInt($(this).data('idx'), 10);
        if (isNaN(idx)) return;
        toggleObjective(idx);
    });

    // When the game view appears with no in-memory state (page refresh,
    // deep link to #game), rehydrate from localStorage. If predefined
    // missions haven't finished loading yet, wait for app:ready.
    function rehydrateOrRedirect() {
        var saved = Storage.getCurrentGame();
        if (!saved) {
            App.showView('missions');
            return;
        }
        if (!App.ready) {
            $(document).one('app:ready', rehydrateOrRedirect);
            return;
        }
        var m = App.findMissionById(saved.missionId);
        if (!m) {
            // Mission disappeared (e.g. uploaded mission was erased)
            Storage.clearCurrentGame();
            App.toast('Saved mission no longer exists');
            App.showView('missions');
            return;
        }
        resume(m, saved);
    }

    $(document).on('view:show', function (e, name) {
        if (name !== 'game') return;
        if (state && mission) return; // already running
        rehydrateOrRedirect();
    });

    global.GameView = {
        start: start,
        resume: resume
    };

})(window);
