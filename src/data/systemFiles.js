// System Files Configuration
// These are special files that allow direct editing of persisted data
// When opened in the editor, they show the JSON of the stored data
// When saved, they update the actual stored data

import { STORAGE_KEYS } from '../services/DataPersistence';

/**
 * System files that can be edited to modify stored data
 * Each file maps to a localStorage key
 */
export const systemFiles = {
  'sys-desktop-icons': {
    id: 'sys-desktop-icons',
    type: 'systemFile',
    label: 'desktop-icons.json',
    icon: '/icons/config.svg',
    description: 'Desktop icons with positions (unified storage)',
    dataKey: STORAGE_KEYS.DESKTOP_ICONS,
    language: 'json',
  },
  'sys-user-folder': {
    id: 'sys-user-folder',
    type: 'systemFile',
    label: 'user-folder.json',
    icon: '/icons/config.svg',
    description: 'User folder contents (only user data is persisted)',
    dataKey: STORAGE_KEYS.USER_FOLDER,
    language: 'json',
  },
  'sys-preferences': {
    id: 'sys-preferences',
    type: 'systemFile',
    label: 'preferences.json',
    icon: '/icons/config.svg',
    description: 'User preferences',
    dataKey: STORAGE_KEYS.USER_PREFERENCES,
    language: 'json',
  },
};

/**
 * Get a system file by ID
 * @param {string} id - System file ID
 * @returns {Object|null} System file object or null
 */
export function getSystemFile(id) {
  return systemFiles[id] || null;
}

/**
 * Check if an ID is a system file
 * @param {string} id - ID to check
 * @returns {boolean}
 */
export function isSystemFile(id) {
  return id in systemFiles;
}

