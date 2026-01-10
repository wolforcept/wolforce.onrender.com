// Data Persistence Service
// Centralizes all localStorage operations for clean data management
// Each data type has its own localStorage key for organization

// ============================================================================
// Storage Keys - All localStorage keys in one place
// ============================================================================
const STORAGE_KEYS = {
  // Desktop icons - stores the complete icon state (id, x, y, and metadata)
  DESKTOP_ICONS: 'win98:desktop:icons',
  
  // User folder contents - only the user folder is persisted
  USER_FOLDER: 'win98:user-folder',
  
  // Legacy keys for migration
  FILE_SYSTEM_LEGACY: 'win98:filesystem',
  DESKTOP_ICONS_LEGACY: 'win98:desktop:custom-icons',
  DESKTOP_POSITIONS_LEGACY: 'win98:desktop:icon-positions',
  
  // Window state (for future use)
  WINDOW_POSITIONS: 'win98:windows:positions',
  
  // User preferences (for future use)
  USER_PREFERENCES: 'win98:preferences',
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Deep clone an object using JSON serialization
 * @param {*} obj - Object to clone
 * @returns {*} Cloned object
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Safely get an item from localStorage
 * @param {string} key - Storage key
 * @returns {*} Parsed value or null
 */
function getItem(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`Error reading from localStorage [${key}]:`, error);
    return null;
  }
}

/**
 * Safely set an item in localStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} Success status
 */
function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage [${key}]:`, error);
    return false;
  }
}

/**
 * Safely remove an item from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} Success status
 */
function removeItem(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage [${key}]:`, error);
    return false;
  }
}

// ============================================================================
// Desktop Icon Persistence
// ============================================================================

/**
 * Migrate from legacy split storage (positions + custom icons) to unified storage
 */
function migrateDesktopIcons() {
  const existing = getItem(STORAGE_KEYS.DESKTOP_ICONS);
  if (existing) return; // Already migrated or using new format
  
  // Try to load from legacy storage
  const legacyIcons = getItem(STORAGE_KEYS.DESKTOP_ICONS_LEGACY);
  const legacyPositions = getItem(STORAGE_KEYS.DESKTOP_POSITIONS_LEGACY);
  
  if (legacyIcons) {
    // Apply positions if available
    let icons = legacyIcons;
    if (legacyPositions) {
      icons = legacyIcons.map((icon) => {
        const pos = legacyPositions[icon.id];
        return pos ? { ...icon, x: pos.x, y: pos.y } : icon;
      });
    }
    // Save to new unified storage
    setItem(STORAGE_KEYS.DESKTOP_ICONS, icons);
    console.log('Migrated desktop icons to unified storage');
  }
  
  // Clean up legacy storage
  removeItem(STORAGE_KEYS.DESKTOP_ICONS_LEGACY);
  removeItem(STORAGE_KEYS.DESKTOP_POSITIONS_LEGACY);
}

/**
 * Load desktop icons from localStorage
 * @returns {Array|null} Array of icon objects or null if not set
 */
export function loadDesktopIcons() {
  // Migrate from legacy storage if needed
  migrateDesktopIcons();
  return getItem(STORAGE_KEYS.DESKTOP_ICONS);
}

/**
 * Save desktop icons to localStorage
 * @param {Array} icons - Array of icon objects with id, x, y, and other properties
 */
export function saveDesktopIcons(icons) {
  setItem(STORAGE_KEYS.DESKTOP_ICONS, icons);
}

/**
 * Clear all desktop icon data
 */
export function clearDesktopData() {
  removeItem(STORAGE_KEYS.DESKTOP_ICONS);
}

// ============================================================================
// User Folder Persistence
// Only the user folder contents are persisted - the rest of the file system
// is always loaded fresh from defaults
// ============================================================================

/**
 * Load user folder contents from localStorage
 * @returns {Array|null} User folder contents or null if not saved
 */
export function loadUserFolderContents() {
  return getItem(STORAGE_KEYS.USER_FOLDER);
}

/**
 * Save user folder contents to localStorage
 * @param {Array} contents - User folder contents array
 */
export function saveUserFolderContents(contents) {
  setItem(STORAGE_KEYS.USER_FOLDER, contents);
}

/**
 * Reset user folder to defaults
 */
export function resetUserFolderContents() {
  removeItem(STORAGE_KEYS.USER_FOLDER);
}

/**
 * Migrate from old file system storage to new user folder storage
 * This extracts the user folder contents from the old format
 * @param {string} userFolderId - The ID of the user folder
 */
export function migrateFromLegacyFileSystem(userFolderId) {
  const legacy = getItem(STORAGE_KEYS.FILE_SYSTEM_LEGACY);
  if (legacy && legacy[userFolderId]) {
    // Check if we haven't already migrated
    const existing = getItem(STORAGE_KEYS.USER_FOLDER);
    if (!existing) {
      // Migrate user folder contents
      saveUserFolderContents(legacy[userFolderId].contents || []);
      console.log('Migrated user folder from legacy file system storage');
    }
    // Clean up legacy storage
    removeItem(STORAGE_KEYS.FILE_SYSTEM_LEGACY);
  }
}

// ============================================================================
// User Preferences Persistence (for future use)
// ============================================================================

/**
 * Load user preferences
 * @returns {Object} User preferences object
 */
export function loadPreferences() {
  return getItem(STORAGE_KEYS.USER_PREFERENCES) || {};
}

/**
 * Save user preferences
 * @param {Object} preferences - Preferences to save
 */
export function savePreferences(preferences) {
  setItem(STORAGE_KEYS.USER_PREFERENCES, preferences);
}

/**
 * Update a single preference
 * @param {string} key - Preference key
 * @param {*} value - Preference value
 */
export function updatePreference(key, value) {
  const prefs = loadPreferences();
  prefs[key] = value;
  savePreferences(prefs);
}

// ============================================================================
// Global Operations
// ============================================================================

/**
 * Clear all Win98 data from localStorage
 */
export function clearAllData() {
  Object.values(STORAGE_KEYS).forEach(removeItem);
}

// ============================================================================
// Raw Data Access (for system file editing)
// ============================================================================

/**
 * Read raw data from a storage key as formatted JSON string
 * @param {string} key - Storage key
 * @returns {string} Formatted JSON string
 */
export function readRawData(key) {
  const data = getItem(key);
  if (data === null) {
    return '{\n  \n}';
  }
  return JSON.stringify(data, null, 2);
}

/**
 * Write raw JSON data to a storage key
 * @param {string} key - Storage key
 * @param {string} jsonString - JSON string to parse and save
 * @returns {{ success: boolean, error?: string }}
 */
export function writeRawData(key, jsonString) {
  try {
    const data = JSON.parse(jsonString);
    const success = setItem(key, data);
    return { success };
  } catch (error) {
    return { success: false, error: `Invalid JSON: ${error.message}` };
  }
}

/**
 * Validate JSON string without saving
 * @param {string} jsonString - JSON string to validate
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateJson(jsonString) {
  try {
    JSON.parse(jsonString);
    return { valid: true };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

/**
 * Export all data as a single object (for backup)
 * @returns {Object} All persisted data
 */
export function exportAllData() {
  const data = {};
  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    data[name] = getItem(key);
  });
  return data;
}

/**
 * Import data from a backup object
 * @param {Object} data - Data object from exportAllData
 */
export function importAllData(data) {
  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    if (data[name] !== undefined) {
      setItem(key, data[name]);
    }
  });
}

// Export storage keys for reference
export { STORAGE_KEYS };

// Export utility for deep cloning
export { deepClone };

