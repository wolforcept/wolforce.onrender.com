// File System Service
// Handles loading, saving, and managing the file system structure
// Only the "user" folder contents are persisted - the rest uses defaults

import { defaultFileSystem, USER_FOLDER_ID } from '../data/filesystem';
import { pages } from '../data/pages';
import { systemFiles, isSystemFile, getSystemFile } from '../data/systemFiles';
import { 
  loadUserFolderContents, 
  saveUserFolderContents, 
  resetUserFolderContents,
  migrateFromLegacyFileSystem,
  deepClone 
} from './DataPersistence';

/**
 * Load the file system - always starts with defaults, then merges persisted user folder
 * @returns {Object} The file system object
 */
export function loadFileSystem() {
  // Try to migrate from legacy storage first
  migrateFromLegacyFileSystem(USER_FOLDER_ID);
  
  // Start with a fresh copy of defaults
  const fileSystem = deepClone(defaultFileSystem);
  
  // Load persisted user folder contents
  const savedUserContents = loadUserFolderContents();
  if (savedUserContents && fileSystem[USER_FOLDER_ID]) {
    fileSystem[USER_FOLDER_ID].contents = savedUserContents;
  }
  
  return fileSystem;
}

/**
 * Save the file system - only saves the user folder contents
 * @param {Object} fileSystem - The file system object
 */
export function saveFileSystem(fileSystem) {
  // Only save the user folder contents
  if (fileSystem[USER_FOLDER_ID]) {
    saveUserFolderContents(fileSystem[USER_FOLDER_ID].contents || []);
  }
}

/**
 * Reset the file system to defaults
 * @returns {Object} Fresh file system with default user folder
 */
export function resetFileSystem() {
  resetUserFolderContents();
  return deepClone(defaultFileSystem);
}

/**
 * Check if a folder is the user folder (the only editable folder)
 * @param {string} folderId - The folder ID to check
 * @returns {boolean} True if this is the user folder
 */
export function isUserFolder(folderId) {
  return folderId === USER_FOLDER_ID;
}

/**
 * Get a folder by ID from the file system
 * @param {Object} fileSystem - The file system object
 * @param {string} folderId - The folder ID to find
 * @returns {Object|null} The folder object or null
 */
export function getFolder(fileSystem, folderId) {
  const folder = fileSystem[folderId];
  if (!folder) {
    return null;
  }
  return {
    id: folderId,
    type: 'folder',
    ...folder,
  };
}

/**
 * Get the root folder (My Computer)
 * @param {Object} fileSystem - The file system object
 * @returns {Object} The root folder
 */
export function getRootFolder(fileSystem) {
  return getFolder(fileSystem, 'root');
}

/**
 * Resolve folder contents to include full data for pages, folders, and system files
 * @param {Object} fileSystem - The file system object
 * @param {Array} contents - Array of content items (strings or inline folders)
 * @returns {Array} Resolved contents with full data
 */
export function resolveFolderContents(fileSystem, contents) {
  if (!contents) return [];
  
  return contents.map((item) => {
    // String ID - could be a page, folder, or system file
    if (typeof item === 'string') {
      // Check if it's a system file
      if (isSystemFile(item)) {
        return getSystemFile(item);
      }
      
      // Check if it's a folder in the file system
      const folder = fileSystem[item];
      if (folder) {
        return {
          id: item,
          type: 'folder',
          ...folder,
        };
      }
      
      // Check if it's a page
      const page = pages[item];
      if (page) {
        return {
          id: item,
          ...page,
        };
      }
      
      console.warn(`Item not found: ${item}`);
      return null;
    }
    
    // Inline folder definition
    if (item && item.type === 'folder') {
      return {
        ...item,
        // Don't recursively resolve here - let FolderView handle it when opened
      };
    }
    
    return item;
  }).filter(Boolean);
}

/**
 * Add an item to a folder
 * @param {Object} fileSystem - The file system object
 * @param {string} folderId - The folder to add to
 * @param {string|Object} item - The item to add (page ID or inline folder)
 * @returns {Object} Updated file system
 */
export function addItemToFolder(fileSystem, folderId, item) {
  const updated = deepClone(fileSystem);
  const folder = updated[folderId];
  
  if (!folder) {
    console.error(`Folder not found: ${folderId}`);
    return fileSystem;
  }
  
  if (!folder.contents) {
    folder.contents = [];
  }
  
  // Check if item already exists
  const itemId = typeof item === 'string' ? item : item.id;
  const exists = folder.contents.some((existing) => {
    if (typeof existing === 'string') return existing === itemId;
    return existing.id === itemId;
  });
  
  if (!exists) {
    folder.contents.push(item);
    saveFileSystem(updated);
  }
  
  return updated;
}

/**
 * Remove an item from a folder
 * @param {Object} fileSystem - The file system object
 * @param {string} folderId - The folder to remove from
 * @param {string} itemId - The ID of the item to remove
 * @returns {Object} Updated file system
 */
export function removeItemFromFolder(fileSystem, folderId, itemId) {
  const updated = deepClone(fileSystem);
  const folder = updated[folderId];
  
  if (!folder || !folder.contents) {
    return fileSystem;
  }
  
  folder.contents = folder.contents.filter((item) => {
    if (typeof item === 'string') return item !== itemId;
    return item.id !== itemId;
  });
  
  saveFileSystem(updated);
  return updated;
}

/**
 * Create a new folder in the file system
 * @param {Object} fileSystem - The file system object
 * @param {string} id - Unique ID for the new folder
 * @param {string} label - Display name
 * @param {string} icon - Icon path
 * @param {Array} contents - Initial contents
 * @returns {Object} Updated file system
 */
export function createFolder(fileSystem, id, label, icon = '/icons/folder.svg', contents = []) {
  if (fileSystem[id]) {
    console.error(`Folder already exists: ${id}`);
    return fileSystem;
  }
  
  const updated = deepClone(fileSystem);
  updated[id] = {
    label,
    icon,
    contents,
  };
  
  saveFileSystem(updated);
  return updated;
}

/**
 * Delete a folder from the file system
 * @param {Object} fileSystem - The file system object
 * @param {string} folderId - The folder ID to delete
 * @returns {Object} Updated file system
 */
export function deleteFolder(fileSystem, folderId) {
  if (folderId === 'root') {
    console.error('Cannot delete root folder');
    return fileSystem;
  }
  
  const updated = deepClone(fileSystem);
  delete updated[folderId];
  
  saveFileSystem(updated);
  return updated;
}

// ============================================================================
// Text File Operations
// ============================================================================

/**
 * Generate a unique ID for a new text file
 * @returns {string} Unique file ID
 */
export function generateFileId() {
  return `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a new text file in a folder
 * @param {Object} fileSystem - The file system object
 * @param {string} folderId - The folder to create the file in (default: 'documents')
 * @param {string} fileName - The file name (will have .txt added if not present)
 * @param {string} content - The file content
 * @returns {Object} { fileSystem, file } - Updated file system and the created file
 */
export function createTextFile(fileSystem, folderId = 'documents', fileName, content = '') {
  const updated = deepClone(fileSystem);
  
  // Ensure the folder exists
  if (!updated[folderId]) {
    console.error(`Folder not found: ${folderId}`);
    return { fileSystem, file: null };
  }
  
  // Generate file ID
  const fileId = generateFileId();
  
  // Ensure .txt extension
  const label = fileName.endsWith('.txt') ? fileName : `${fileName}.txt`;
  
  // Create the text file object
  const file = {
    type: 'textFile',
    id: fileId,
    label,
    icon: '/icons/textfile.svg',
    content,
  };
  
  // Add to folder
  if (!updated[folderId].contents) {
    updated[folderId].contents = [];
  }
  updated[folderId].contents.push(file);
  
  saveFileSystem(updated);
  return { fileSystem: updated, file };
}

/**
 * Update the content of an existing text file
 * @param {Object} fileSystem - The file system object
 * @param {string} fileId - The ID of the file to update
 * @param {string} newContent - The new content
 * @returns {Object} Updated file system
 */
export function updateTextFile(fileSystem, fileId, newContent) {
  const updated = deepClone(fileSystem);
  
  // Search for the file in all folders
  for (const folderId of Object.keys(updated)) {
    const folder = updated[folderId];
    if (!folder.contents) continue;
    
    const fileIndex = folder.contents.findIndex(
      (item) => item && item.type === 'textFile' && item.id === fileId
    );
    
    if (fileIndex !== -1) {
      folder.contents[fileIndex].content = newContent;
      saveFileSystem(updated);
      return updated;
    }
  }
  
  console.error(`Text file not found: ${fileId}`);
  return fileSystem;
}

/**
 * Find a text file by ID
 * @param {Object} fileSystem - The file system object
 * @param {string} fileId - The ID of the file to find
 * @returns {Object|null} The file object or null
 */
export function findTextFile(fileSystem, fileId) {
  for (const folderId of Object.keys(fileSystem)) {
    const folder = fileSystem[folderId];
    if (!folder.contents) continue;
    
    const file = folder.contents.find(
      (item) => item && item.type === 'textFile' && item.id === fileId
    );
    
    if (file) {
      return { ...file, folderId };
    }
  }
  
  return null;
}

/**
 * Delete a text file
 * @param {Object} fileSystem - The file system object
 * @param {string} fileId - The ID of the file to delete
 * @returns {Object} Updated file system
 */
export function deleteTextFile(fileSystem, fileId) {
  const updated = deepClone(fileSystem);
  
  for (const folderId of Object.keys(updated)) {
    const folder = updated[folderId];
    if (!folder.contents) continue;
    
    const initialLength = folder.contents.length;
    folder.contents = folder.contents.filter(
      (item) => !(item && item.type === 'textFile' && item.id === fileId)
    );
    
    if (folder.contents.length !== initialLength) {
      saveFileSystem(updated);
      return updated;
    }
  }
  
  return fileSystem;
}

// ============================================================================
// Recycle Bin / Missing Items Operations
// ============================================================================

/**
 * Get all item IDs that exist in a folder's contents (recursively for inline folders)
 * @param {Array} contents - Folder contents array
 * @returns {Set} Set of item IDs
 */
function getContentIds(contents) {
  const ids = new Set();
  if (!contents) return ids;
  
  for (const item of contents) {
    if (typeof item === 'string') {
      ids.add(item);
    } else if (item && item.id) {
      ids.add(item.id);
      // For inline folders, also get their contents
      if (item.type === 'folder' && item.contents) {
        const nestedIds = getContentIds(item.contents);
        nestedIds.forEach(id => ids.add(id));
      }
    }
  }
  return ids;
}

/**
 * Find items that exist in the default file system but not in the user's file system
 * This is used for the "Recycle Bin" to show items users might have removed or are new
 * @param {Object} userFileSystem - The user's current file system
 * @returns {Array} Array of missing items with their default location info
 */
export function findMissingItems(userFileSystem) {
  const missingItems = [];
  
  // Collect all item IDs in the user's file system
  const userItemIds = new Set();
  
  // Add folder IDs
  Object.keys(userFileSystem).forEach(id => userItemIds.add(id));
  
  // Add contents of each folder
  for (const folderId of Object.keys(userFileSystem)) {
    const folder = userFileSystem[folderId];
    const contentIds = getContentIds(folder.contents);
    contentIds.forEach(id => userItemIds.add(id));
  }
  
  // Now check the default file system for items not in user's system
  for (const folderId of Object.keys(defaultFileSystem)) {
    // Check if this folder exists in user's system
    if (!userFileSystem[folderId]) {
      // Entire folder is missing - add it
      const folder = defaultFileSystem[folderId];
      if (folderId !== 'root') { // Don't add root as missing
        missingItems.push({
          id: folderId,
          type: 'folder',
          label: folder.label,
          icon: folder.icon,
          defaultLocation: 'root', // Top-level folders go in root
          contents: folder.contents,
        });
      }
    }
    
    // Check contents of each folder in default
    const folder = defaultFileSystem[folderId];
    if (!folder.contents) continue;
    
    for (const item of folder.contents) {
      const itemId = typeof item === 'string' ? item : item?.id;
      if (!itemId) continue;
      
      // Check if this item is in the user's file system anywhere
      if (!userItemIds.has(itemId)) {
        // Item is missing - resolve its full data
        if (typeof item === 'string') {
          // It's a reference to a page or folder
          const page = pages[item];
          if (page) {
            missingItems.push({
              id: item,
              label: page.label,
              icon: page.icon,
              url: page.url,
              size: page.size,
              contentType: page.contentType,
              forceExternal: page.forceExternal,
              opensFolder: page.opensFolder,
              defaultLocation: folderId,
            });
          } else if (defaultFileSystem[item]) {
            // It's a folder reference
            const refFolder = defaultFileSystem[item];
            missingItems.push({
              id: item,
              type: 'folder',
              label: refFolder.label,
              icon: refFolder.icon,
              contents: refFolder.contents,
              defaultLocation: folderId,
            });
          }
        } else if (item.type === 'folder') {
          // Inline folder definition
          missingItems.push({
            ...item,
            defaultLocation: folderId,
          });
        }
      }
    }
  }
  
  // Remove duplicates by ID
  const seen = new Set();
  return missingItems.filter(item => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

/**
 * Restore an item to its default location in the file system
 * @param {Object} fileSystem - The user's file system
 * @param {Object} item - The item to restore (from findMissingItems)
 * @returns {Object} Updated file system
 */
export function restoreItem(fileSystem, item) {
  const updated = deepClone(fileSystem);
  const targetFolderId = item.defaultLocation || 'root';
  
  // Ensure target folder exists
  if (!updated[targetFolderId]) {
    // If target folder doesn't exist, add it from defaults
    if (defaultFileSystem[targetFolderId]) {
      updated[targetFolderId] = deepClone(defaultFileSystem[targetFolderId]);
      updated[targetFolderId].contents = []; // Start with empty contents
    } else {
      // Create a basic folder
      updated[targetFolderId] = {
        label: targetFolderId,
        icon: '/icons/folder.svg',
        contents: [],
      };
    }
  }
  
  // Add item to folder contents
  if (!updated[targetFolderId].contents) {
    updated[targetFolderId].contents = [];
  }
  
  // Check if already exists
  const exists = updated[targetFolderId].contents.some(existing => {
    if (typeof existing === 'string') return existing === item.id;
    return existing?.id === item.id;
  });
  
  if (!exists) {
    // For folder references and pages, just add the ID
    // For inline folders, add the full object
    if (item.type === 'folder' && !defaultFileSystem[item.id]) {
      // Inline folder - add full object
      updated[targetFolderId].contents.push({
        type: 'folder',
        id: item.id,
        label: item.label,
        icon: item.icon,
        contents: item.contents || [],
      });
    } else {
      // Reference to page or top-level folder - just add ID
      updated[targetFolderId].contents.push(item.id);
    }
    
    // If it's a top-level folder, also add the folder itself
    if (item.type === 'folder' && defaultFileSystem[item.id] && !updated[item.id]) {
      updated[item.id] = deepClone(defaultFileSystem[item.id]);
    }
    
    saveFileSystem(updated);
  }
  
  return updated;
}
