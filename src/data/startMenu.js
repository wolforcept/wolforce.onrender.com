// Windows 98 Desktop - Start Menu Special Items Configuration
// Only special items that are NOT part of the file system go here
// The main menu structure is generated from the default file system

// Special menu items (actions, separators, etc.)
export const specialMenuItems = [
  { type: 'divider' },
  {
    id: 'shutdown',
    label: 'Shut Down...',
    icon: '/icons/shutdown.svg',
    action: 'shutdown',
  },
];

// Items from the file system to exclude from the start menu
// (e.g., system folder is for advanced users only)
export const excludedFromStartMenu = [
];
