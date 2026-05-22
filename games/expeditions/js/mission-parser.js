/* =====================================================================
   mission-parser.js
   Reads a plain-text mission file and returns a structured JSON object.

   File format:
       # comments start with #
       key=value         property of the current section
       * objective text  list item (also accepts "- " prefix)
       ----              divider (4+ dashes) starts a new section

   First section = mission properties (name, description, difficulty, actions, ...)
   Every subsequent section = an act (name, flavor, rules, ..., objectives[])

   Returns:
       {
         name, description, difficulty, actions: number,
         extra: { ...any other props from the header },
         acts: [
           { name, flavor, rules, extra: {...}, objectives: ['...', '...'] },
           ...
         ]
       }

   Unknown header/act properties are kept in `extra` so authors can use
   their own fields without losing data.
   ===================================================================== */

(function (global) {
  'use strict';

  var KNOWN_MISSION = ['name', 'description', 'difficulty', 'actions', 'author'];
  var KNOWN_ACT     = ['name', 'flavor', 'rules'];

  function parse(text) {
    if (typeof text !== 'string') {
      throw new TypeError('MissionParser.parse expects a string');
    }

    var lines = text.split(/\r?\n/);
    var sections = [[]]; // start with one empty section
    var idx = 0;

    lines.forEach(function (raw) {
      var line = raw.replace(/\s+$/g, ''); // trim trailing whitespace
      if (/^\s*#/.test(line)) return;       // skip comments
      if (/^\s*$/.test(line)) {              // blank → keep section, just skip
        return;
      }
      if (/^\s*-{4,}\s*$/.test(line)) {
        sections.push([]);
        idx++;
        return;
      }
      sections[idx].push(line);
    });

    // First section = mission. Drop trailing empty sections (trailing ----).
    while (sections.length > 1 && sections[sections.length - 1].length === 0) {
      sections.pop();
    }

    var missionLines = sections[0] || [];
    var actSections  = sections.slice(1);

    var mission = parseSection(missionLines, KNOWN_MISSION);
    // Normalize numeric field
    var actionsNum = parseInt(mission.actions, 10);
    mission.actions = isNaN(actionsNum) ? 0 : actionsNum;

    mission.acts = actSections.map(function (lines) {
      var act = parseSection(lines, KNOWN_ACT);
      return act;
    });

    return mission;
  }

  // Parse a single section's lines into { knownProps..., extra: {}, objectives: [] }
  function parseSection(lines, knownKeys) {
    var out = { extra: {}, objectives: [] };
    knownKeys.forEach(function (k) { out[k] = ''; });

    lines.forEach(function (line) {
      var ltrim = line.replace(/^\s+/, '');

      // Objective: "* foo" or "- foo"
      var objMatch = ltrim.match(/^[\*\-]\s+(.*)$/);
      if (objMatch) {
        out.objectives.push(objMatch[1]);
        return;
      }

      // key=value
      var kv = ltrim.match(/^([A-Za-z_][\w\-]*)\s*=\s*(.*)$/);
      if (kv) {
        var key = kv[1].toLowerCase();
        var value = kv[2];
        if (knownKeys.indexOf(key) !== -1) {
          out[key] = value;
        } else {
          out.extra[key] = value;
        }
        return;
      }

      // Loose objective text without bullet — append to the most recent objective
      // (lets long objectives wrap across lines in the source file)
      if (out.objectives.length > 0) {
        out.objectives[out.objectives.length - 1] += ' ' + ltrim;
      }
    });

    return out;
  }

  global.MissionParser = { parse: parse };

})(window);
