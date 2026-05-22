/* =====================================================================
   storage.js
   Namespaced local-storage helpers. All keys live under "expeditions:".
   Each top-level slot is a self-contained JSON blob so the granular
   "erase X" buttons in Settings can wipe one without touching the rest.
   ===================================================================== */

(function (global) {
  'use strict';

  var NS = 'expeditions:';

  var KEYS = {
    settings:          NS + 'settings',
    uploadedMissions:  NS + 'uploadedMissions',
    syncedIndex:       NS + 'syncedIndex',     // last fetched missions/index.json
    syncedMissions:    NS + 'syncedMissions',  // map: id -> { id, version, url, raw, parsed }
    currentGame:       NS + 'currentGame',
    plays:             NS + 'plays'
  };

  function get(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (raw === null || raw === undefined) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      console.warn('[storage] failed to parse', key, e);
      return fallback;
    }
  }

  function set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('[storage] failed to set', key, e);
    }
  }

  function remove(key) {
    localStorage.removeItem(key);
  }

  // ----- Settings -----
  var DEFAULT_SETTINGS = { theme: 'dark', players: 1 };

  function getSettings() {
    var s = get(KEYS.settings, {}) || {};
    return Object.assign({}, DEFAULT_SETTINGS, s);
  }
  function setSettings(patch) {
    var merged = Object.assign({}, getSettings(), patch);
    set(KEYS.settings, merged);
    return merged;
  }
  function resetSettings() { remove(KEYS.settings); }

  // ----- Uploaded missions -----
  function getUploadedMissions() {
    return get(KEYS.uploadedMissions, []) || [];
  }
  function addUploadedMission(entry) {
    var list = getUploadedMissions();
    list.push(entry);
    set(KEYS.uploadedMissions, list);
    return list;
  }
  function removeUploadedMission(id) {
    var list = getUploadedMissions().filter(function (m) { return m.id !== id; });
    set(KEYS.uploadedMissions, list);
    return list;
  }
  function clearUploadedMissions() { remove(KEYS.uploadedMissions); }

  // ----- Synced (remote) missions -----
  function getSyncedIndex() { return get(KEYS.syncedIndex, null); }
  function setSyncedIndex(idx) { set(KEYS.syncedIndex, idx); }

  function getSyncedMissions() { return get(KEYS.syncedMissions, {}) || {}; }
  function setSyncedMission(id, mission) {
    var map = getSyncedMissions();
    map[id] = mission;
    set(KEYS.syncedMissions, map);
    return map;
  }
  function removeSyncedMission(id) {
    var map = getSyncedMissions();
    delete map[id];
    set(KEYS.syncedMissions, map);
    return map;
  }
  function clearSyncedMissions() {
    remove(KEYS.syncedIndex);
    remove(KEYS.syncedMissions);
  }

  // ----- Current game -----
  function getCurrentGame() { return get(KEYS.currentGame, null); }
  function setCurrentGame(state) { set(KEYS.currentGame, state); }
  function clearCurrentGame() { remove(KEYS.currentGame); }

  // ----- Plays history -----
  function getPlays() { return get(KEYS.plays, []) || []; }
  function addPlay(record) {
    var list = getPlays();
    list.push(record);
    set(KEYS.plays, list);
    return list;
  }
  function clearPlays() { remove(KEYS.plays); }

  // ----- Bulk -----
  function clearAll() {
    Object.keys(KEYS).forEach(function (k) { remove(KEYS[k]); });
  }

  global.Storage = {
    KEYS: KEYS,
    getSettings: getSettings,
    setSettings: setSettings,
    resetSettings: resetSettings,
    getUploadedMissions: getUploadedMissions,
    addUploadedMission: addUploadedMission,
    removeUploadedMission: removeUploadedMission,
    clearUploadedMissions: clearUploadedMissions,
    getSyncedIndex: getSyncedIndex,
    setSyncedIndex: setSyncedIndex,
    getSyncedMissions: getSyncedMissions,
    setSyncedMission: setSyncedMission,
    removeSyncedMission: removeSyncedMission,
    clearSyncedMissions: clearSyncedMissions,
    getCurrentGame: getCurrentGame,
    setCurrentGame: setCurrentGame,
    clearCurrentGame: clearCurrentGame,
    getPlays: getPlays,
    addPlay: addPlay,
    clearPlays: clearPlays,
    clearAll: clearAll
  };

})(window);
