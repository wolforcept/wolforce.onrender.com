// FolderView - Displays contents of a folder as clickable icons
// Used inside Window component when opening a folder

import { resolveFolderContents } from '../services/FileSystem';

export default function FolderView({ contents, onItemOpen, onItemContextMenu, fileSystem }) {
  // Resolve contents to get full page/folder data using the file system
  const resolvedContents = resolveFolderContents(fileSystem, contents);

  const handleItemDoubleClick = (item) => {
    onItemOpen(item);
  };

  const handleItemContextMenu = (item, e) => {
    if (onItemContextMenu) {
      onItemContextMenu(item, e);
    }
  };

  return (
    <div className="folder-view">
      <div className="folder-view-grid">
        {resolvedContents.map((item) => (
          <div
            key={item.id}
            className="folder-view-item"
            onDoubleClick={() => handleItemDoubleClick(item)}
            onContextMenu={(e) => handleItemContextMenu(item, e)}
          >
            <img
              src={item.icon}
              alt={item.label}
              className="folder-view-icon"
              draggable={false}
            />
            <span className="folder-view-label">{item.label}</span>
          </div>
        ))}
      </div>
      {resolvedContents.length === 0 && (
        <div className="folder-view-empty">
          This folder is empty.
        </div>
      )}
    </div>
  );
}
