import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function Submenu({ items, onItemClick, onItemContextMenu, parentRef }) {
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const submenuRef = useRef(null);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [isPositioned, setIsPositioned] = useState(false);

  // Calculate position based on parent element
  useEffect(() => {
    if (parentRef?.current) {
      const parentRect = parentRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const taskbarHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--taskbar-height')) || 35;
      const availableHeight = viewportHeight - taskbarHeight;

      let left = parentRect.right - 2;
      let top = parentRect.top;

      // After initial render, check if submenu goes off-screen and adjust
      if (submenuRef.current) {
        const submenuRect = submenuRef.current.getBoundingClientRect();
        
        // If submenu extends below the available area, shift it up
        if (top + submenuRect.height > availableHeight) {
          top = Math.max(0, availableHeight - submenuRect.height);
        }

        // If submenu extends beyond right edge, show on left side
        if (left + submenuRect.width > window.innerWidth) {
          left = parentRect.left - submenuRect.width + 2;
        }
      }

      setPosition({ left, top });
      setIsPositioned(true);
    }
  }, [parentRef]);

  // When hovering inside the submenu, ensure parent stays active
  const handleSubmenuMouseEnter = () => {
    // Parent stays open since we're inside it
  };

  // Don't close parent when leaving submenu to context menu
  const handleSubmenuMouseLeave = () => {
    // Only clear nested submenus, not the parent
    setActiveSubmenu(null);
  };

  const submenuContent = (
    <div 
      ref={submenuRef}
      className="submenu"
      style={{ 
        left: position.left, 
        top: position.top,
        visibility: isPositioned ? 'visible' : 'hidden'
      }}
      onMouseEnter={handleSubmenuMouseEnter}
      onMouseLeave={handleSubmenuMouseLeave}
    >
      <div className="start-menu-items">
        {items.map((item) => (
          <SubmenuItem
            key={item.id}
            item={item}
            activeSubmenu={activeSubmenu}
            setActiveSubmenu={setActiveSubmenu}
            onItemClick={onItemClick}
            onItemContextMenu={onItemContextMenu}
          />
        ))}
      </div>
    </div>
  );

  // Render submenu in a portal to avoid parent overflow clipping
  return createPortal(submenuContent, document.body);
}

function SubmenuItem({ item, activeSubmenu, setActiveSubmenu, onItemClick, onItemContextMenu }) {
  const itemRef = useRef(null);

  if (item.type === 'divider') {
    return <div className="start-menu-divider" />;
  }

  const hasSubmenu = item.submenu && item.submenu.length > 0;
  const isActive = activeSubmenu === item.id;

  const handleMouseEnter = () => {
    // Set this item as active (will show its nested submenu if it has one)
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
