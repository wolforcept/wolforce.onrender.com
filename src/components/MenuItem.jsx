import { useRef } from 'react';
import Submenu from './Submenu';

export default function MenuItem({ item, activeSubmenu, setActiveSubmenu, onItemClick, onItemContextMenu }) {
  const itemRef = useRef(null);

  if (item.type === 'divider') {
    return <div className="start-menu-divider" />;
  }

  const hasSubmenu = item.submenu && item.submenu.length > 0;
  const isActive = activeSubmenu === item.id;

  const handleMouseEnter = () => {
    // Set this item as active (will show its submenu if it has one)
    setActiveSubmenu(hasSubmenu ? item.id : null);
  };

  const handleClick = () => {
    // Always allow clicking items that are openable (folders, pages, apps, etc.)
    // Even if they have a submenu, clicking should open them
    if (item.type === 'folder' || item.url || item.contentType || item.opensFolder || item.type === 'textFile' || item.type === 'systemFile') {
      onItemClick(item);
    } else if (!hasSubmenu) {
      // For items without submenu that aren't explicitly openable
      onItemClick(item);
    }
    // If it only has a submenu and nothing to open, clicking does nothing (hover shows submenu)
  };

  const handleContextMenu = (e) => {
    // Allow context menu for any item with an id
    if (item.id && onItemContextMenu) {
      onItemContextMenu(item, e);
    }
  };

  // Show submenu if this item has a submenu AND is active
  const showSubmenu = hasSubmenu && isActive;

  return (
    <div 
      ref={itemRef}
      className="start-menu-item-wrapper" 
      onMouseEnter={handleMouseEnter}
    >
      <div
        className="start-menu-item"
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        <img src={item.icon} alt="" />
        <span>{item.label}</span>
        {hasSubmenu && <span className="start-menu-item-arrow">▶</span>}
      </div>
      
      {showSubmenu && (
        <Submenu 
          items={item.submenu} 
          onItemClick={onItemClick}
          onItemContextMenu={onItemContextMenu}
          parentRef={itemRef}
        />
      )}
    </div>
  );
}
