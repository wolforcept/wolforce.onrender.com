// RecycleBinContent - Shows items missing from user's file system
// Allows users to restore items that exist in defaults but not in their system

import { useMemo } from 'react';
import { findMissingItems } from '../../services/FileSystem';

export default function RecycleBinContent({ 
  fileSystem,
  onItemContextMenu,
  onItemRestore,  // Callback to restore an item
}) {
  // Find all missing items
  const missingItems = useMemo(() => {
    return findMissingItems(fileSystem);
  }, [fileSystem]);

  const handleItemContextMenu = (item, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Pass to parent with special 'recycleBin' source
    if (onItemContextMenu) {
      onItemContextMenu(item, e, 'recycleBin');
    }
  };

  const handleItemDoubleClick = (item) => {
    // In recycle bin, double-click could restore or just show info
    // For now, we'll just show an alert
    alert(`"${item.label}" is in the Recycle Bin.\n\nRight-click and select "Restore" to add it back to your file system.`);
  };

  return (
    <div className="recycle-bin-content">
      <div className="recycle-bin-header">
        <span className="recycle-bin-title">
          {missingItems.length === 0 
            ? 'Recycle Bin is empty' 
            : `${missingItems.length} item${missingItems.length === 1 ? '' : 's'} available to restore`
          }
        </span>
      </div>
      
      <div className="folder-view">
        <div className="folder-view-grid">
          {missingItems.map((item) => (
            <div
              key={item.id}
              className="folder-view-item recycle-bin-item"
              onDoubleClick={() => handleItemDoubleClick(item)}
              onContextMenu={(e) => handleItemContextMenu(item, e)}
            >
              <div className="recycle-bin-icon-wrapper">
                <img
                  src={item.icon}
                  alt={item.label}
                  className="folder-view-icon"
                  draggable={false}
                  style={{ opacity: 0.6 }}
                />
              </div>
              <span className="folder-view-label">{item.label}</span>
              <span className="recycle-bin-location">
                from: {item.defaultLocation === 'root' ? 'My Computer' : item.defaultLocation}
              </span>
            </div>
          ))}
        </div>
        
        {missingItems.length === 0 && (
          <div className="folder-view-empty">
            No items to restore. Your file system is up to date!
          </div>
        )}
      </div>
    </div>
  );
}

