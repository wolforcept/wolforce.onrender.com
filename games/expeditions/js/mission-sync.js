/* =====================================================================
   mission-sync.js
   Keeps the locally-cached set of "official" missions in sync with the
   server-hosted index. Designed to:

     - render instantly from localStorage on app load (no network wait)
     - fetch updates in the background when online
     - degrade silently when offline (cached missions remain usable)

   Server contract — `missions/index.json`:
       {
         "version": <number>,                  // optional, for whole-index versioning
         "missions": [
           { "id": "...", "url": "...", "version": <number> },
           ...
         ]
       }

   Per-mission `version` controls re-fetch: a higher version on the
   server triggers re-fetching that one mission's text file. URLs may
   be absolute or relative to the app root.

   The service worker uses **network-first** for paths under `missions/`
   so this layer always sees the freshest index when online; on offline,
   the SW serves the most recent successful fetch from its own cache.
   ===================================================================== */

(function (global) {
  'use strict';

  var INDEX_URL = 'missions/index.json';
  var inFlight  = null; // shared promise so multiple callers don't double-fetch

  function fetchJson(url) {
    return fetch(url, { cache: 'no-cache' }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status + ' for ' + url);
      return res.json();
    });
  }

  function fetchText(url) {
    return fetch(url, { cache: 'no-cache' }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status + ' for ' + url);
      return res.text();
    });
  }

  // Build the synced-mission record shape that the rest of the app expects.
  function buildRecord(meta, raw) {
    return {
      id:      'synced:' + meta.id,    // namespaced so it doesn't collide with uploaded:
      syncId:  meta.id,                // the raw id from the server's index
      source:  'synced',
      url:     meta.url,
      version: meta.version,
      raw:     raw,
      parsed:  MissionParser.parse(raw),
      syncedAt: new Date().toISOString()
    };
  }

  /**
   * Pull the latest index and any new/updated mission files.
   * Returns a promise that resolves with a summary object:
   *   { added: [...ids], updated: [...ids], removed: [...ids], failed: [...ids] }
   * If anything fails (offline, server error), resolves with an empty
   * summary rather than rejecting — sync is always best-effort.
   */
  function sync() {
    if (inFlight) return inFlight;

    inFlight = fetchJson(INDEX_URL).then(function (remoteIndex) {
      var cache = Storage.getSyncedMissions();
      var remoteMissions = (remoteIndex && remoteIndex.missions) || [];
      var remoteIds = {};
      remoteMissions.forEach(function (m) { remoteIds[m.id] = true; });

      var summary = { added: [], updated: [], removed: [], failed: [] };

      // Drop missions that no longer appear in the index.
      Object.keys(cache).forEach(function (key) {
        var rec = cache[key];
        var sid = rec && rec.syncId;
        if (sid && !remoteIds[sid]) {
          Storage.removeSyncedMission(key);
          summary.removed.push(sid);
        }
      });

      // Refresh the local copy of the index even before mission fetches
      // complete — that way next launch knows what was last advertised.
      Storage.setSyncedIndex({
        version:   remoteIndex.version,
        missions:  remoteMissions,
        fetchedAt: new Date().toISOString()
      });

      // Fetch each mission that's missing or stale.
      var jobs = remoteMissions.map(function (meta) {
        var key = 'synced:' + meta.id;
        var cached = cache[key];
        if (cached && cached.version === meta.version) {
          return Promise.resolve();
        }
        return fetchText(meta.url)
          .then(function (raw) {
            var record = buildRecord(meta, raw);
            Storage.setSyncedMission(record.id, record);
            (cached ? summary.updated : summary.added).push(meta.id);
          })
          .catch(function (err) {
            console.warn('[mission-sync] failed to fetch', meta.url, err);
            summary.failed.push(meta.id);
          });
      });

      return Promise.all(jobs).then(function () {
        if (summary.added.length || summary.updated.length || summary.removed.length) {
          $(document).trigger('missions:changed');
        }
        return summary;
      });
    }).catch(function (err) {
      console.log('[mission-sync] sync skipped (offline or server error):', err.message);
      return { added: [], updated: [], removed: [], failed: [] };
    });

    // Reset inFlight when done so the next sync() actually runs
    inFlight.then(function () { inFlight = null; },
                  function () { inFlight = null; });

    return inFlight;
  }

  function syncedMissionsAsArray() {
    var map = Storage.getSyncedMissions();
    var idx = Storage.getSyncedIndex();
    // Order by position in the cached index.json so the list matches
    // what the catalog publishes, regardless of fetch-resolution order.
    if (idx && Array.isArray(idx.missions)) {
      return idx.missions
        .map(function (meta) { return map['synced:' + meta.id]; })
        .filter(Boolean);
    }
    // No index cached yet (first ever launch, mid-sync) — fall back to
    // whatever insertion order localStorage has.
    return Object.keys(map).map(function (k) { return map[k]; });
  }

  global.MissionSync = {
    sync: sync,
    all:  syncedMissionsAsArray
  };

})(window);
