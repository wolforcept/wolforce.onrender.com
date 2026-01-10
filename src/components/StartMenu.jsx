import { useState, useMemo } from 'react';
import MenuItem from './MenuItem';

export default function StartMenu({ items, onItemClick, onItemContextMenu, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  // Flatten all items for search
  const flattenItems = (items, path = []) => {
    let result = [];
    for (const item of items) {
      if (item.type === 'divider') continue;
      
      const currentPath = [...path, item.label];
      
      // Include folders, pages, apps, text files, system files - anything openable
      if (item.type === 'folder' || item.url || item.action || item.contentType || 
          item.opensFolder || item.type === 'textFile' || item.type === 'systemFile') {
        result.push({
          ...item,
          path: currentPath,
          pathString: currentPath.join(' > '),
        });
      }
      
      // Also recurse into submenus to find nested items
      if (item.submenu) {
        result = [...result, ...flattenItems(item.submenu, currentPath)];
      }
    }
    return result;
  };

  const allItems = useMemo(() => flattenItems(items), [items]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return allItems.filter(
      (item) =>
        item.label.toLowerCase().includes(query) ||
        item.pathString.toLowerCase().includes(query)
    );
  }, [searchQuery, allItems]);

  const handleItemClick = (item) => {
    if (item.action === 'shutdown') {
      alert('It is now safe to turn off your computer.');
      onClose();
      return;
    }
    // Let the Launcher service handle all launchable items
    // (url, contentType, folder, etc.)
    onItemClick(item);
    onClose();
  };

  return (
    <div className="start-menu" onClick={(e) => e.stopPropagation()}>
      <div className="start-menu-sidebar">
        <span className="start-menu-sidebar-text">Windows 98</span>
      </div>
      <div className="start-menu-content">
        <div className="start-menu-search">
          <input
            type="text"
            className="win98-input"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>

        {searchQuery.trim() ? (
          <div className="start-menu-items search-results">
            {searchResults.length > 0 ? (
              <>
                <div className="search-results-title">Search Results</div>
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    className="start-menu-item"
                    onClick={() => handleItemClick(item)}
                    onContextMenu={(e) => onItemContextMenu && onItemContextMenu(item, e)}
                  >
                    <img src={item.icon} alt="" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </>
            ) : (
              <div className="start-menu-item">
                <span>No results found</span>
              </div>
            )}
          </div>
        ) : (
          <div className="start-menu-items">
            {items.map((item) => (
              <MenuItem
                key={item.id}
                item={item}
                activeSubmenu={activeSubmenu}
                setActiveSubmenu={setActiveSubmenu}
                onItemClick={handleItemClick}
                onItemContextMenu={onItemContextMenu}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
