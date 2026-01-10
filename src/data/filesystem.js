// Windows 98 Desktop - Default File System Configuration
// This is the system file structure - always loaded fresh from here.
// Only the "user" folder contents are persisted to localStorage.

// Folder structure - each folder has an id, label, icon, and contents
// Contents can be:
// - String: reference to a page ID from pages.js
// - Object with type: 'folder': a nested folder
// - Object with type: 'textFile': a text file with content

// The ID of the user folder - only this folder's contents are persisted
export const USER_FOLDER_ID = 'user';

export const defaultFileSystem = {
  // Root folder - opened by "My Computer"
  'root': {
    label: 'My Computer',
    icon: '/icons/my-computer.svg',
    contents: [
      'user',            // User folder - ONLY this is persisted
      'system',          // System configuration folder
      'my-links',        // Reference to folder
      'all-games',       // Reference to folder
      'applications',    // Applications folder
    ],
  },
  // User folder - this is the ONLY folder whose contents are persisted
  // User can create files and folders here
  'user': {
    label: 'User',
    icon: '/icons/user-folder.svg',
    contents: [
      // Default contents for new users
      // User-created files and folders will be added here
    ],
  },
  // System folder - contains editable configuration files
  'system': {
    label: 'System',
    icon: '/icons/folder.svg',
    contents: [
      'sys-desktop-icons',   // Desktop icons (with positions)
      'sys-user-folder',     // User folder contents
      'sys-preferences',     // User preferences
    ],
  },
  // Applications folder - contains usable applications
  'applications': {
    label: 'Applications',
    icon: '/icons/folder.svg',
    contents: [
      'code-editor',
    ],
  },
  'board-games-folder': {
    label: 'Board Games',
    icon: '/icons/folder.svg',
    contents: [
      'ecogenesis',
      'projectelite',
      'cryptid',
      'spacecaptain',
    ],
  },
  'my-links': {
    label: 'Links',
    icon: '/icons/folder.svg',
    contents: [
      'homepage',
      'patreon',
    ],
  },
  'all-games': {
    label: 'Games',
    icon: '/icons/folder.svg',
    contents: [
      {
        type: 'folder',
        id: 'web-games-folder',
        label: 'Web Games',
        icon: '/icons/folder.svg',
        contents: [
          'seedmix2',
          'pokegene2',
          'pokeidler',
          'elementalpixel',
          'concept',
          'angelsvsdemons',
          'worddish',
          'cobra2',
          'mover',
          'lolblurs',
          'lolquiz',
          'pokeblurs',
        ],
      },
      {
        type: 'folder',
        id: 'board-games-inner',
        label: 'Board Games',
        icon: '/icons/folder.svg',
        contents: [
          'ecogenesis',
          'projectelite',
          'cryptid',
          'spacecaptain',
        ],
      },
      {
        type: 'folder',
        id: 'mobile-games-folder',
        label: 'Mobile Games',
        icon: '/icons/folder.svg',
        contents: [
          'wordaria',
        ],
      },
    ],
  },
};
