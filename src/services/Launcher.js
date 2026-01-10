// Launcher Service
// Centralized logic for launching/opening items (pages, folders, external links, apps)
// This handles all the different ways an item can be opened

import { defaultWindowSettings } from '../data/config';

/**
 * Determines how an item should be launched
 * @param {Object} item - The item to launch (page, folder, app, etc.)
 * @param {Object} fileSystem - Optional file system for resolving opensFolder
 * @returns {Object} Launch configuration with type and params
 */
export function getLaunchConfig(item, fileSystem = null) {
  if (!item) {
    return { type: 'none', reason: 'No item provided' };
  }

  // Folder - opens in a window with FolderView
  if (item.type === 'folder') {
    return {
      type: 'folder',
      title: item.label,
      icon: item.icon,
      size: item.size,
      contents: item.contents || [],
    };
  }

  // Opens a folder from the file system (like My Computer opens root)
  if (item.opensFolder && fileSystem) {
    const folder = fileSystem[item.opensFolder];
    if (folder) {
      return {
        type: 'folder',
        title: item.label || folder.label,
        icon: item.icon || folder.icon,
        size: item.size,
        contents: folder.contents || [],
        folderId: item.opensFolder, // Store the folder ID for reference
      };
    }
  }

  // opensFolder without fileSystem - return a special type that Desktop can handle
  if (item.opensFolder) {
    return {
      type: 'opensFolder',
      folderId: item.opensFolder,
      title: item.label,
      icon: item.icon,
      size: item.size,
    };
  }

  // Text file - opens in the code editor
  if (item.type === 'textFile') {
    return {
      type: 'textFile',
      title: item.label,
      icon: item.icon || '/icons/textfile.svg',
      size: item.size || { width: 800, height: 600 },
      textFileId: item.id,
      textFileContent: item.content || '',
    };
  }

  // System file - opens in the code editor with data from localStorage
  if (item.type === 'systemFile') {
    return {
      type: 'systemFile',
      title: item.label,
      icon: item.icon || '/icons/config.svg',
      size: item.size || { width: 900, height: 600 },
      systemFileId: item.id,
      dataKey: item.dataKey,
      language: item.language || 'json',
    };
  }

  // Force external - opens in a new browser tab
  if (item.forceExternal && item.url) {
    return {
      type: 'external',
      url: item.url,
    };
  }

  // Custom content type (editor, etc.) - opens in a window with custom component
  if (item.contentType) {
    return {
      type: 'app',
      contentType: item.contentType,
      title: item.label,
      icon: item.icon,
      url: item.url, // May be undefined for apps that don't need it
      size: item.size,
    };
  }

  // Regular page with URL - opens in a window with iframe
  if (item.url) {
    return {
      type: 'iframe',
      title: item.label,
      icon: item.icon,
      url: item.url,
      size: item.size,
    };
  }

  // Action items (like shutdown) - handled separately
  if (item.action) {
    return {
      type: 'action',
      action: item.action,
    };
  }

  return { type: 'none', reason: 'Item has no launchable content' };
}

/**
 * Creates a window configuration object
 * @param {string} windowId - Unique window ID
 * @param {Object} launchConfig - Configuration from getLaunchConfig
 * @param {number} offset - Position offset for cascading windows
 * @returns {Object} Window state object
 */
export function createWindowState(windowId, launchConfig, offset = 0) {
  const { 
    type, title, icon, url, size, contents, contentType, folderId,
    textFileId, textFileContent, systemFileId, dataKey, language 
  } = launchConfig;

  // Determine the content type for the window
  let resolvedContentType = 'iframe';
  if (type === 'folder') {
    resolvedContentType = 'folder';
  } else if (type === 'app') {
    resolvedContentType = contentType;
  } else if (type === 'textFile') {
    resolvedContentType = 'editor'; // Text files open in the editor
  } else if (type === 'systemFile') {
    resolvedContentType = 'editor'; // System files also open in the editor
  }

  return {
    id: windowId,
    title: title || 'Untitled',
    icon: icon || '/icons/document.svg',
    url: url || null,
    contentType: resolvedContentType,
    folderContents: type === 'folder' ? contents : null,
    folderId: folderId || null, // Track which folder this window shows
    textFileId: textFileId || null, // Track which text file is being edited
    textFileContent: textFileContent || null, // Initial content of text file
    systemFileId: systemFileId || null, // Track which system file is being edited
    systemDataKey: dataKey || null, // The localStorage key for system file
    systemLanguage: language || 'json', // Language for syntax highlighting
    x: 50 + offset,
    y: 50 + offset,
    width: size?.width || defaultWindowSettings.width,
    height: size?.height || defaultWindowSettings.height,
    isMinimized: false,
    isMaximized: false,
  };
}

/**
 * Check if an item can be launched in a window
 * @param {Object} item - The item to check
 * @param {Object} fileSystem - Optional file system for resolving opensFolder
 * @returns {boolean} True if item can be opened in a window
 */
export function canOpenInWindow(item, fileSystem = null) {
  const config = getLaunchConfig(item, fileSystem);
  return ['folder', 'app', 'iframe', 'opensFolder', 'textFile', 'systemFile'].includes(config.type);
}

/**
 * Check if an item should open externally
 * @param {Object} item - The item to check
 * @returns {boolean} True if item should open in new browser tab
 */
export function shouldOpenExternal(item) {
  const config = getLaunchConfig(item);
  return config.type === 'external';
}

/**
 * Check if an item is an action (like shutdown)
 * @param {Object} item - The item to check
 * @returns {boolean} True if item is an action
 */
export function isAction(item) {
  const config = getLaunchConfig(item);
  return config.type === 'action';
}

/**
 * Check if an item opens a folder from the file system
 * @param {Object} item - The item to check
 * @returns {boolean} True if item opens a folder
 */
export function opensFileSystemFolder(item) {
  return !!(item && item.opensFolder);
}
