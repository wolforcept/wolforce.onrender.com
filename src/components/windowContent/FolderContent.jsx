// FolderContent - Displays folder contents with navigation
// Shows breadcrumb path and allows navigating to parent folder

import { useState, useCallback, useMemo } from 'react';
import FolderView from '../FolderView';

export default function FolderContent({ 
  folderContents, 
  folderId,           // The initial folder ID (e.g., 'root')
  onItemOpen,         // Called for non-folder items (pages, apps)
  onItemContextMenu,  // Called for right-click on items
  fileSystem,
  onTitleChange,      // Callback to update window title
}) {
  // Path from root to current folder - array of { id, label, contents } objects
  // We store contents because inline folders aren't in fileSystem as top-level keys
  const [path, setPath] = useState(() => {
    // Initialize with the starting folder
    const folder = fileSystem?.[folderId];
    return [{
      id: folderId || 'root',
      label: folder?.label || 'My Computer',
      contents: folder?.contents || folderContents || [],
    }];
  });

  // Current folder is the last item in path
  const currentFolder = path[path.length - 1];
  
  // Get current folder contents - stored directly in path for inline folder support
  const currentContents = currentFolder.contents || [];

  // Check if we can go back (not at root of navigation)
  const canGoBack = path.length > 1;

  // Navigate to a subfolder
  const navigateToFolder = useCallback((folder) => {
    // Add folder to path - store its contents for inline folder support
    setPath((prev) => [...prev, {
      id: folder.id,
      label: folder.label,
      contents: folder.contents || [],
    }]);
    
    // Update window title
    if (onTitleChange) {
      onTitleChange(folder.label);
    }
  }, [onTitleChange]);

  // Go back to parent folder
  const goBack = useCallback(() => {
    if (path.length <= 1) return;
    
    setPath((prev) => {
      const newPath = prev.slice(0, -1);
      const parentFolder = newPath[newPath.length - 1];
      
      // Update window title
      if (onTitleChange) {
        onTitleChange(parentFolder.label);
      }
      
      return newPath;
    });
  }, [path.length, onTitleChange]);

  // Navigate to a specific path index (for breadcrumb clicks)
  const navigateToPathIndex = useCallback((index) => {
    if (index >= path.length - 1) return; // Already at or beyond this point
    
    setPath((prev) => {
      const newPath = prev.slice(0, index + 1);
      const targetFolder = newPath[newPath.length - 1];
      
      // Update window title
      if (onTitleChange) {
        onTitleChange(targetFolder.label);
      }
      
      return newPath;
    });
  }, [path.length, onTitleChange]);

  // Handle item double-click
  const handleItemOpen = useCallback((item) => {
    if (item.type === 'folder') {
      // Navigate to subfolder in-place
      navigateToFolder(item);
    } else {
      // Open non-folder items (pages, apps) normally
      onItemOpen(item);
    }
  }, [navigateToFolder, onItemOpen]);

  return (
    <div className="folder-content">
      {/* Navigation toolbar with breadcrumbs */}
      <div className="folder-toolbar">
        <button 
          className="folder-back-btn"
          onClick={goBack}
          disabled={!canGoBack}
          title={canGoBack ? 'Go to parent folder' : 'Already at root'}
        >
          ↑
        </button>
        
        {/* Breadcrumb path */}
        <div className="folder-breadcrumbs">
          {path.map((item, index) => (
            <span key={`${item.id}-${index}`} className="folder-breadcrumb-item">
              {index > 0 && <span className="folder-breadcrumb-separator"> › </span>}
              {index < path.length - 1 ? (
                <button
                  className="folder-breadcrumb-link"
                  onClick={() => navigateToPathIndex(index)}
                  title={`Go to ${item.label}`}
                >
                  {item.label}
                </button>
              ) : (
                <span className="folder-breadcrumb-current">{item.label}</span>
              )}
            </span>
          ))}
        </div>
      </div>
      
      {/* Folder contents */}
      <FolderView
        contents={currentContents}
        onItemOpen={handleItemOpen}
        onItemContextMenu={onItemContextMenu}
        fileSystem={fileSystem}
      />
    </div>
  );
}
