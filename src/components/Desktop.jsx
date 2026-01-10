import { useState, useCallback, useEffect, useRef } from 'react';
import DesktopIcon from './DesktopIcon';
import Window from './Window';
import Taskbar from './Taskbar';
import StartMenu from './StartMenu';
import ContextMenu from './ContextMenu';
import { desktopIcons as configIcons, startMenuItems, pages, defaultWindowSettings } from '../data/config';
import { getLaunchConfig, createWindowState, shouldOpenExternal, canOpenInWindow } from '../services/Launcher';
import { loadFileSystem, saveFileSystem, getFolder, resolveFolderContents, restoreItem } from '../services/FileSystem';
import { 
  loadDesktopIcons as loadSavedDesktopIcons, 
  saveDesktopIcons,
  STORAGE_KEYS,
} from '../services/DataPersistence';

// Icons that are permanently on the desktop and cannot be removed
const PERMANENT_DESKTOP_ICONS = ['my-computer', 'recycle-bin'];

// Resolve page or folder data from config and file system
const resolveItemData = (id, fileSystem) => {
  // Try pages first
  const page = pages[id];
  if (page) {
    return { id, ...page };
  }
  // Try folders from file system
  const folder = fileSystem?.[id];
  if (folder) {
    return { id, type: 'folder', ...folder };
  }
  return null;
};

// Load saved icon data from localStorage using DataPersistence service
const loadDesktopIcons = () => {
  try {
    // Load saved icons (unified storage with positions included)
    const savedIcons = loadSavedDesktopIcons();
    
    let icons;
    if (savedIcons) {
      // Use saved icons list, but refresh page/folder data from config
      icons = savedIcons.map((savedIcon) => {
        // Get latest item data from config (page or folder)
        const latestData = resolveItemData(savedIcon.id);
        if (latestData) {
          // Merge: use latest data but keep saved position
          return { ...latestData, x: savedIcon.x, y: savedIcon.y };
        }
        // Fallback to saved data if not found in config
        return savedIcon;
      });
      
      // Ensure permanent icons are always present
      for (const permanentId of PERMANENT_DESKTOP_ICONS) {
        if (!icons.some((icon) => icon.id === permanentId)) {
          const permanentData = resolveItemData(permanentId);
          if (permanentData) {
            // Find next available position for the permanent icon
            const occupied = new Set(icons.map((i) => `${i.x},${i.y}`));
            let pos = { x: 0, y: 0 };
            outer: for (let x = 0; x < 20; x++) {
              for (let y = 0; y < 20; y++) {
                if (!occupied.has(`${x},${y}`)) {
                  pos = { x, y };
                  break outer;
                }
              }
            }
            icons.push({ ...permanentData, x: pos.x, y: pos.y });
          }
        }
      }
    } else {
      // Use default config icons
      icons = configIcons;
    }
    
    return icons;
  } catch (e) {
    console.error('Failed to load desktop icons:', e);
  }
  return configIcons;
};

// Find next available grid position
const findNextAvailablePosition = (icons) => {
  const occupied = new Set(icons.map((i) => `${i.x},${i.y}`));
  // Search column by column
  for (let x = 0; x < 20; x++) {
    for (let y = 0; y < 20; y++) {
      if (!occupied.has(`${x},${y}`)) {
        return { x, y };
      }
    }
  }
  return { x: 0, y: 0 };
};

export default function Desktop() {
  // File system state - persisted to localStorage
  const [fileSystem, setFileSystem] = useState(loadFileSystem);

  // Desktop icons state - load from localStorage on init
  const [icons, setIcons] = useState(loadDesktopIcons);
  const [selectedIconId, setSelectedIconId] = useState(null);

  // Windows state
  const [windows, setWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);
  const nextWindowIdRef = useRef(1);

  // Start menu state
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

  // Context menu state
  const [contextMenu, setContextMenu] = useState(null);

  // Window drag/resize state (managed centrally)
  const dragStateRef = useRef(null);
  const [isDraggingWindow, setIsDraggingWindow] = useState(false);

  // Close context menu
  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  // Launch an item using the centralized Launcher service
  const launchItem = useCallback((item) => {
    if (!item) return;

    // Get launch configuration from the Launcher service (pass fileSystem for opensFolder resolution)
    const launchConfig = getLaunchConfig(item, fileSystem);

    // Handle external links - open in new browser tab
    if (shouldOpenExternal(item)) {
      window.open(launchConfig.url, '_blank');
      setIsStartMenuOpen(false);
      closeContextMenu();
      return;
    }

    // Handle items that open in a window (folder, app, iframe)
    if (canOpenInWindow(item, fileSystem)) {
      const windowId = `window-${nextWindowIdRef.current}`;
      nextWindowIdRef.current += 1;

      setWindows((prev) => {
        const offset = (prev.length % 10) * 30;
        const newWindow = createWindowState(windowId, launchConfig, offset);
        return [...prev, newWindow];
      });

      setActiveWindowId(windowId);
      setIsStartMenuOpen(false);
      closeContextMenu();
      return;
    }

    // Handle action items (like shutdown) - can be extended later
    if (launchConfig.type === 'action') {
      console.log('Action:', launchConfig.action);
      setIsStartMenuOpen(false);
      closeContextMenu();
    }
  }, [closeContextMenu, fileSystem]);

  // Alias for backward compatibility and clarity
  const openItem = launchItem;

  // Handle icon selection
  const handleIconSelect = useCallback((id) => {
    setSelectedIconId(id);
    setIsStartMenuOpen(false);
    closeContextMenu();
  }, [closeContextMenu]);

  // Handle icon double click - open window or external tab
  const handleIconDoubleClick = useCallback((id) => {
    const icon = icons.find((i) => i.id === id);
    if (!icon) return;

    openItem(icon);
  }, [icons, openItem]);

  // Handle icon move
  const handleIconMove = useCallback((id, newGridX, newGridY) => {
    setIcons((prev) => {
      const newIcons = prev.map((icon) =>
        icon.id === id ? { ...icon, x: newGridX, y: newGridY } : icon
      );
      // Save to localStorage
      saveDesktopIcons(newIcons);
      return newIcons;
    });
  }, []);

  // Check if item is on desktop
  const isOnDesktop = useCallback((id) => {
    return icons.some((icon) => icon.id === id);
  }, [icons]);

  // Remove icon from desktop (permanent icons cannot be removed)
  const removeIconFromDesktop = useCallback((id) => {
    // Don't allow removing permanent icons
    if (PERMANENT_DESKTOP_ICONS.includes(id)) {
      return;
    }
    setIcons((prev) => {
      const newIcons = prev.filter((icon) => icon.id !== id);
      saveDesktopIcons(newIcons);
      return newIcons;
    });
  }, []);

  // Add icon to desktop
  const addIconToDesktop = useCallback((item) => {
    setIcons((prev) => {
      // Check if already on desktop
      if (prev.some((icon) => icon.id === item.id)) {
        return prev;
      }
      
      const position = findNextAvailablePosition(prev);
      // Preserve all relevant properties from the item
      const newIcon = {
        id: item.id,
        label: item.label,
        icon: item.icon,
        x: position.x,
        y: position.y,
        // Preserve type-specific properties
        type: item.type,               // 'folder', 'textFile', 'systemFile', etc.
        url: item.url,                 // For pages with URLs
        size: item.size,               // Window size
        contentType: item.contentType, // For apps like 'editor'
        opensFolder: item.opensFolder, // For items that open a folder
        contents: item.contents,       // For folders
      };
      const newIcons = [...prev, newIcon];
      saveDesktopIcons(newIcons);
      return newIcons;
    });
  }, []);

  // Restore an item from the recycle bin to its default location
  const restoreItemToFileSystem = useCallback((item) => {
    setFileSystem((prevFs) => restoreItem(prevFs, item));
    closeContextMenu();
  }, [closeContextMenu]);

  // Handle system file save - reload the affected data immediately
  const handleSystemFileSave = useCallback((storageKey) => {
    switch (storageKey) {
      case STORAGE_KEYS.DESKTOP_ICONS:
        // Reload desktop icons from localStorage
        setIcons(loadDesktopIcons());
        break;
      case STORAGE_KEYS.USER_FOLDER:
        // Reload file system from localStorage
        setFileSystem(loadFileSystem());
        break;
      case STORAGE_KEYS.USER_PREFERENCES:
        // Preferences could be handled here in the future
        break;
      default:
        console.warn(`Unknown storage key: ${storageKey}`);
    }
  }, []);

  // Unified context menu builder for any item (desktop icon, start menu, folder view, recycle bin)
  const buildContextMenuOptions = useCallback((item, source = 'desktop') => {
    const options = [];
    
    // For recycle bin, show different options
    if (source === 'recycleBin') {
      options.push({
        id: 'restore',
        label: 'Restore',
        onClick: () => {
          restoreItemToFileSystem(item);
        },
      });
      
      options.push({
        id: 'restore-to-desktop',
        label: 'Restore to Desktop',
        onClick: () => {
          restoreItemToFileSystem(item);
          addIconToDesktop(item);
        },
      });
      
      return options;
    }
    
    // Open option - always available
    options.push({
      id: 'open',
      label: 'Open',
      onClick: () => {
        openItem(item);
        if (source === 'startMenu') {
          setIsStartMenuOpen(false);
        }
      },
    });
    
    // Open in New Browser Window - for items with URLs (not folders or apps)
    if (item.url && item.type !== 'folder' && item.type !== 'textFile' && !item.contentType) {
      options.push({
        id: 'open-new-window',
        label: 'Open in New Browser Window',
        onClick: () => {
          window.open(item.url, '_blank');
          if (source === 'startMenu') {
            setIsStartMenuOpen(false);
          }
        },
      });
    }
    
    options.push({ type: 'divider' });
    
    // Desktop add/remove options (permanent icons cannot be removed)
    const onDesktop = isOnDesktop(item.id);
    const isPermanent = PERMANENT_DESKTOP_ICONS.includes(item.id);
    
    if (source === 'desktop') {
      // If on desktop, show remove (unless permanent)
      if (!isPermanent) {
        options.push({
          id: 'remove-from-desktop',
          label: 'Remove from Desktop',
          onClick: () => removeIconFromDesktop(item.id),
        });
      }
    } else {
      // For start menu and folder view, show add or remove based on state
      if (onDesktop && !isPermanent) {
        options.push({
          id: 'remove-from-desktop',
          label: 'Remove from Desktop',
          onClick: () => removeIconFromDesktop(item.id),
        });
      } else if (!onDesktop) {
        options.push({
          id: 'add-to-desktop',
          label: 'Add to Desktop',
          onClick: () => addIconToDesktop(item),
        });
      }
      // If permanent and on desktop, don't show any add/remove option
    }
    
    return options;
  }, [openItem, isOnDesktop, addIconToDesktop, removeIconFromDesktop, restoreItemToFileSystem]);

  // Unified context menu handler
  const showContextMenu = useCallback((item, e, source = 'desktop') => {
    e.preventDefault();
    e.stopPropagation();
    
    // Skip items without an id (dividers, etc.) - all valid items have an id
    if (!item || !item.id) {
      return;
    }
    
    if (source === 'desktop') {
      setSelectedIconId(item.id);
    }
    setIsStartMenuOpen(false);
    
    const options = buildContextMenuOptions(item, source);
    
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      options,
    });
  }, [buildContextMenuOptions]);

  // Handle icon right-click (wrapper for backward compatibility)
  const handleIconContextMenu = useCallback((id, e) => {
    const icon = icons.find((i) => i.id === id);
    if (icon) {
      showContextMenu(icon, e, 'desktop');
    }
  }, [icons, showContextMenu]);

  // Handle start menu item right-click (uses unified context menu)
  const handleStartMenuItemContextMenu = useCallback((item, e) => {
    showContextMenu(item, e, 'startMenu');
  }, [showContextMenu]);

  // Handle folder view item right-click (uses unified context menu)
  // Supports optional source parameter for special content types like recycleBin
  const handleFolderItemContextMenu = useCallback((item, e, source = 'folderView') => {
    showContextMenu(item, e, source);
  }, [showContextMenu]);

  // Window actions
  const handleWindowClose = useCallback((id) => {
    setWindows((prev) => {
      const remaining = prev.filter((w) => w.id !== id);
      return remaining;
    });
    setActiveWindowId((prevActive) => {
      if (prevActive === id) {
        const remaining = windows.filter((w) => w.id !== id);
        return remaining.length > 0 ? remaining[remaining.length - 1].id : null;
      }
      return prevActive;
    });
  }, [windows]);

  const handleWindowMinimize = useCallback((id) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
    setActiveWindowId((prevActive) => {
      if (prevActive === id) {
        const nonMinimized = windows.filter((w) => w.id !== id && !w.isMinimized);
        return nonMinimized.length > 0 ? nonMinimized[nonMinimized.length - 1].id : null;
      }
      return prevActive;
    });
  }, [windows]);

  const handleWindowMaximize = useCallback((id) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w))
    );
  }, []);

  const handleWindowFocus = useCallback((id) => {
    setActiveWindowId(id);
    setIsStartMenuOpen(false);
  }, []);

  // Central drag handling
  const handleWindowDragStart = useCallback((id, mouseX, mouseY, windowX, windowY) => {
    setActiveWindowId(id);
    setIsStartMenuOpen(false);
    setIsDraggingWindow(true);
    closeContextMenu();
    dragStateRef.current = {
      type: 'drag',
      windowId: id,
      startMouseX: mouseX,
      startMouseY: mouseY,
      startWindowX: windowX,
      startWindowY: windowY,
    };
  }, [closeContextMenu]);

  const handleWindowResizeStart = useCallback((id, mouseX, mouseY, windowWidth, windowHeight) => {
    setActiveWindowId(id);
    setIsStartMenuOpen(false);
    setIsDraggingWindow(true);
    closeContextMenu();
    dragStateRef.current = {
      type: 'resize',
      windowId: id,
      startMouseX: mouseX,
      startMouseY: mouseY,
      startWidth: windowWidth,
      startHeight: windowHeight,
    };
  }, [closeContextMenu]);

  // Global mouse handlers for window drag/resize
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragStateRef.current) return;

      const { type, windowId, startMouseX, startMouseY } = dragStateRef.current;

      if (type === 'drag') {
        const { startWindowX, startWindowY } = dragStateRef.current;
        const deltaX = e.clientX - startMouseX;
        const deltaY = e.clientY - startMouseY;
        const newX = Math.max(0, startWindowX + deltaX);
        const newY = Math.max(0, startWindowY + deltaY);

        setWindows((prev) =>
          prev.map((w) => (w.id === windowId ? { ...w, x: newX, y: newY } : w))
        );
      } else if (type === 'resize') {
        const { startWidth, startHeight } = dragStateRef.current;
        const deltaX = e.clientX - startMouseX;
        const deltaY = e.clientY - startMouseY;
        const newWidth = Math.max(defaultWindowSettings.minWidth, startWidth + deltaX);
        const newHeight = Math.max(defaultWindowSettings.minHeight, startHeight + deltaY);

        setWindows((prev) =>
          prev.map((w) => (w.id === windowId ? { ...w, width: newWidth, height: newHeight } : w))
        );
      }
    };

    const handleMouseUp = () => {
      dragStateRef.current = null;
      setIsDraggingWindow(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Taskbar window click - toggle minimize/restore
  const handleTaskbarWindowClick = useCallback((id) => {
    setWindows((prev) => {
      const win = prev.find((w) => w.id === id);
      if (!win) return prev;

      if (win.isMinimized) {
        setActiveWindowId(id);
        return prev.map((w) => (w.id === id ? { ...w, isMinimized: false } : w));
      } else if (activeWindowId === id) {
        const nonMinimized = prev.filter((w) => w.id !== id && !w.isMinimized);
        setActiveWindowId(nonMinimized.length > 0 ? nonMinimized[nonMinimized.length - 1].id : null);
        return prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w));
      } else {
        setActiveWindowId(id);
        return prev;
      }
    });
  }, [activeWindowId]);

  // Start menu toggle
  const handleStartClick = useCallback(() => {
    setIsStartMenuOpen((prev) => !prev);
    setSelectedIconId(null);
    closeContextMenu();
  }, [closeContextMenu]);

  // Start menu item click
  const handleStartMenuItemClick = useCallback((item) => {
    openItem(item);
  }, [openItem]);

  // Click on desktop background
  const handleDesktopClick = useCallback((e) => {
    if (e.target.classList.contains('desktop')) {
      setSelectedIconId(null);
      setIsStartMenuOpen(false);
      closeContextMenu();
    }
  }, [closeContextMenu]);

  // Get occupied positions for collision detection
  const getOccupiedPositions = useCallback((excludeId) => {
    return icons
      .filter((i) => i.id !== excludeId)
      .map((i) => ({ x: i.x, y: i.y }));
  }, [icons]);

  return (
    <div className="desktop" onClick={handleDesktopClick}>
      {/* Desktop Icons */}
      {icons.map((icon) => (
        <DesktopIcon
          key={icon.id}
          id={icon.id}
          label={icon.label}
          icon={icon.icon}
          gridX={icon.x}
          gridY={icon.y}
          selected={selectedIconId === icon.id}
          onSelect={handleIconSelect}
          onDoubleClick={handleIconDoubleClick}
          onMove={handleIconMove}
          onContextMenu={handleIconContextMenu}
          occupiedPositions={getOccupiedPositions(icon.id)}
        />
      ))}

      {/* Windows */}
      {windows.map((win) => (
        <Window
          key={win.id}
          id={win.id}
          title={win.title}
          icon={win.icon}
          url={win.url}
          contentType={win.contentType}
          folderContents={win.folderContents}
          folderId={win.folderId}
          textFileId={win.textFileId}
          textFileContent={win.textFileContent}
          systemFileId={win.systemFileId}
          systemDataKey={win.systemDataKey}
          systemLanguage={win.systemLanguage}
          onItemOpen={openItem}
          onItemContextMenu={handleFolderItemContextMenu}
          fileSystem={fileSystem}
          onFileSystemChange={setFileSystem}
          onSystemFileSave={handleSystemFileSave}
          x={win.x}
          y={win.y}
          width={win.width}
          height={win.height}
          isMinimized={win.isMinimized}
          isMaximized={win.isMaximized}
          isActive={activeWindowId === win.id}
          onClose={handleWindowClose}
          onMinimize={handleWindowMinimize}
          onMaximize={handleWindowMaximize}
          onFocus={handleWindowFocus}
          onDragStart={handleWindowDragStart}
          onResizeStart={handleWindowResizeStart}
        />
      ))}

      {/* Drag overlay */}
      {isDraggingWindow && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9998,
            cursor: dragStateRef.current?.type === 'resize' ? 'nwse-resize' : 'move',
          }}
          onMouseUp={() => {
            dragStateRef.current = null;
            setIsDraggingWindow(false);
          }}
        />
      )}

      {/* Taskbar */}
      <Taskbar
        windows={windows}
        activeWindowId={activeWindowId}
        onWindowClick={handleTaskbarWindowClick}
        onStartClick={handleStartClick}
        isStartMenuOpen={isStartMenuOpen}
      />

      {/* Start Menu */}
      {isStartMenuOpen && (
        <StartMenu
          items={startMenuItems}
          onItemClick={handleStartMenuItemClick}
          onItemContextMenu={handleStartMenuItemContextMenu}
          onClose={() => setIsStartMenuOpen(false)}
        />
      )}

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          options={contextMenu.options}
          onClose={closeContextMenu}
        />
      )}
    </div>
  );
}
