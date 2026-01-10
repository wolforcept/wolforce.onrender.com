// Windows 98 Desktop - Configuration Index
// Re-exports all configuration with resolved data

import { pages } from './pages.js';
import { defaultFileSystem } from './filesystem.js';
import { defaultDesktopIconIds } from './desktop.js';
import { specialMenuItems, excludedFromStartMenu } from './startMenu.js';
import { gridSettings, defaultWindowSettings, uiSettings } from './settings.js';
import { systemFiles, isSystemFile, getSystemFile } from './systemFiles.js';

// For backward compatibility, export defaultFileSystem as folders
export const folders = defaultFileSystem;

// ============================================================================
// Helper function to resolve page by ID
// ============================================================================
const resolvePage = (id) => {
  const page = pages[id];
  if (!page) {
    console.warn(`Page not found: ${id}`);
    return null;
  }
  return { id, ...page };
};

// ============================================================================
// Helper function to resolve folder by ID from a file system
// ============================================================================
export const resolveFolder = (id, fileSystem = defaultFileSystem) => {
  const folder = fileSystem[id];
  if (!folder) {
    console.warn(`Folder not found: ${id}`);
    return null;
  }
  return { id, type: 'folder', ...folder };
};

// ============================================================================
// Helper to resolve folder contents (pages and nested folders)
// Now accepts a fileSystem parameter for dynamic resolution
// ============================================================================
export const resolveFolderContents = (contents, fileSystem = defaultFileSystem) => {
  if (!contents) return [];
  
  return contents.map((item) => {
    // String ID - could be a page or a folder
    if (typeof item === 'string') {
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
        return { id: item, ...page };
      }
      
      console.warn(`Item not found: ${item}`);
      return null;
    }
    
    // Inline folder definition
    if (item && item.type === 'folder') {
      return {
        ...item,
        // Keep contents as-is, will be resolved when opened
      };
    }
    
    return item;
  }).filter(Boolean);
};

// ============================================================================
// Resolved desktop icons with full page data
// ============================================================================
export const desktopIcons = defaultDesktopIconIds
  .map(({ id, x, y }) => {
    // Try to resolve as page first, then as folder
    const page = resolvePage(id);
    if (page) {
      return { ...page, x, y };
    }
    
    const folder = resolveFolder(id);
    if (folder) {
      return { ...folder, x, y };
    }
    
    return null;
  })
  .filter(Boolean);

// ============================================================================
// Helper to convert file system contents to menu items recursively
// Folders become clickable items with submenus showing their contents
// Clicking a folder opens it, hovering shows submenu with contents
// ============================================================================
const convertFolderContentsToMenu = (contents, fileSystem = defaultFileSystem) => {
  if (!contents) return [];
  
  return contents.map((item) => {
    // String ID - could be a page, folder, or system file
    if (typeof item === 'string') {
      // Skip excluded items
      if (excludedFromStartMenu.includes(item)) {
        return null;
      }
      
      // Check if it's a system file
      if (isSystemFile(item)) {
        return getSystemFile(item);
      }
      
      // Check if it's a folder in the file system
      // Make it clickable (type: 'folder') AND have a submenu
      const folder = fileSystem[item];
      if (folder) {
        return {
          id: item,
          type: 'folder',  // Makes it clickable to open folder
          label: folder.label,
          icon: folder.icon,
          contents: folder.contents,  // Keep contents for opening
          submenu: convertFolderContentsToMenu(folder.contents, fileSystem),
        };
      }
      
      // Check if it's a page
      const page = pages[item];
      if (page) {
        return { id: item, ...page };
      }
      
      console.warn(`Start menu item not found: ${item}`);
      return null;
    }
    
    // Inline folder definition - make clickable with submenu
    if (item && item.type === 'folder') {
      return {
        id: item.id,
        type: 'folder',  // Makes it clickable to open folder
        label: item.label,
        icon: item.icon,
        contents: item.contents,  // Keep contents for opening
        submenu: convertFolderContentsToMenu(item.contents, fileSystem),
      };
    }
    
    // Text file or other item
    if (item && item.type === 'textFile') {
      return item;
    }
    
    return item;
  }).filter(Boolean);
};

// ============================================================================
// Helper to resolve special menu items (dividers, actions like shutdown)
// ============================================================================
const resolveSpecialItems = (items) => {
  return items.map((item, index) => {
    if (item.type === 'divider') {
      return { id: `divider-${index}`, type: 'divider' };
    }
    return item;
  });
};

// ============================================================================
// Generate start menu from file system root + special items
// ============================================================================
const generateStartMenu = () => {
  // Get root folder contents
  const rootFolder = defaultFileSystem['root'];
  if (!rootFolder) {
    console.error('Root folder not found in file system');
    return resolveSpecialItems(specialMenuItems);
  }
  
  // Convert file system to menu structure
  const fileSystemMenu = convertFolderContentsToMenu(rootFolder.contents, defaultFileSystem);
  
  // Add special items (dividers, shutdown, etc.)
  const specialItems = resolveSpecialItems(specialMenuItems);
  
  return [...fileSystemMenu, ...specialItems];
};

// ============================================================================
// Resolved start menu items - mirrors the file system structure
// ============================================================================
export const startMenuItems = generateStartMenu();

// ============================================================================
// Re-export everything
// ============================================================================
export {
  pages,
  defaultFileSystem,
  defaultDesktopIconIds,
  specialMenuItems,
  excludedFromStartMenu,
  gridSettings,
  defaultWindowSettings,
  uiSettings,
};
