import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MenuItem from '../components/MenuItem';

describe('MenuItem', () => {
  const defaultProps = {
    item: {
      id: 'test-item',
      label: 'Test Item',
      icon: '/icons/test.svg',
      url: 'https://test.com',
    },
    activeSubmenu: null,
    setActiveSubmenu: vi.fn(),
    onItemClick: vi.fn(),
    onItemContextMenu: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render menu item with label', () => {
      render(<MenuItem {...defaultProps} />);
      
      expect(screen.getByText('Test Item')).toBeInTheDocument();
    });

    it('should render menu item with icon', () => {
      const { container } = render(<MenuItem {...defaultProps} />);
      
      const img = container.querySelector('.start-menu-item img');
      expect(img).toHaveAttribute('src', '/icons/test.svg');
    });

    it('should render divider for divider type', () => {
      const { container } = render(
        <MenuItem {...defaultProps} item={{ type: 'divider' }} />
      );
      
      expect(container.querySelector('.start-menu-divider')).toBeInTheDocument();
    });

    it('should show arrow for items with submenu', () => {
      const itemWithSubmenu = {
        ...defaultProps.item,
        submenu: [
          { id: 'sub1', label: 'Sub Item', icon: '/icons/sub.svg', url: 'https://sub.com' },
        ],
      };
      
      render(<MenuItem {...defaultProps} item={itemWithSubmenu} />);
      
      expect(screen.getByText('▶')).toBeInTheDocument();
    });

    it('should not show arrow for items without submenu', () => {
      render(<MenuItem {...defaultProps} />);
      
      expect(screen.queryByText('▶')).not.toBeInTheDocument();
    });
  });

  describe('Click Behavior', () => {
    it('should call onItemClick when clicking non-folder item', () => {
      render(<MenuItem {...defaultProps} />);
      
      fireEvent.click(screen.getByText('Test Item').closest('.start-menu-item'));
      
      expect(defaultProps.onItemClick).toHaveBeenCalledWith(defaultProps.item);
    });

    it('should call onItemClick when clicking folder item (folders are openable)', () => {
      const folderItem = {
        id: 'test-folder',
        type: 'folder',
        label: 'Test Folder',
        icon: '/icons/folder.svg',
        contents: [],
        submenu: [{ id: 'sub1', label: 'Sub Item', icon: '/icons/sub.svg' }],
      };
      
      render(<MenuItem {...defaultProps} item={folderItem} />);
      
      fireEvent.click(screen.getByText('Test Folder').closest('.start-menu-item'));
      
      // Folders should be clickable to open them
      expect(defaultProps.onItemClick).toHaveBeenCalledWith(folderItem);
    });

    it('should not call onItemClick when clicking submenu-only item (no type)', () => {
      // An item that only has a submenu but is not a folder type
      const submenuOnlyItem = {
        id: 'submenu-only',
        label: 'Submenu Only',
        icon: '/icons/menu.svg',
        submenu: [{ id: 'sub1', label: 'Sub Item', icon: '/icons/sub.svg' }],
      };
      
      render(<MenuItem {...defaultProps} item={submenuOnlyItem} />);
      
      fireEvent.click(screen.getByText('Submenu Only').closest('.start-menu-item'));
      
      // Items that are just containers for submenus should not trigger onClick
      expect(defaultProps.onItemClick).not.toHaveBeenCalled();
    });
  });

  describe('Hover Behavior', () => {
    it('should call setActiveSubmenu with item id on hover for folder', () => {
      const itemWithSubmenu = {
        ...defaultProps.item,
        submenu: [{ id: 'sub1', label: 'Sub Item', icon: '/icons/sub.svg' }],
      };
      
      render(<MenuItem {...defaultProps} item={itemWithSubmenu} />);
      
      const wrapper = screen.getByText('Test Item').closest('.start-menu-item-wrapper');
      fireEvent.mouseEnter(wrapper);
      
      expect(defaultProps.setActiveSubmenu).toHaveBeenCalledWith('test-item');
    });

    it('should call setActiveSubmenu with null on hover for non-folder', () => {
      render(<MenuItem {...defaultProps} />);
      
      const wrapper = screen.getByText('Test Item').closest('.start-menu-item-wrapper');
      fireEvent.mouseEnter(wrapper);
      
      expect(defaultProps.setActiveSubmenu).toHaveBeenCalledWith(null);
    });
  });

  describe('Submenu Display', () => {
    it('should show submenu when activeSubmenu matches item id', async () => {
      const itemWithSubmenu = {
        id: 'folder',
        label: 'Folder',
        icon: '/icons/folder.svg',
        submenu: [
          { id: 'sub1', label: 'Sub Item One', icon: '/icons/sub.svg', url: 'https://sub1.com' },
          { id: 'sub2', label: 'Sub Item Two', icon: '/icons/sub.svg', url: 'https://sub2.com' },
        ],
      };
      
      render(
        <MenuItem 
          {...defaultProps} 
          item={itemWithSubmenu} 
          activeSubmenu="folder"
        />
      );
      
      await waitFor(() => {
        expect(screen.getByText('Sub Item One')).toBeInTheDocument();
        expect(screen.getByText('Sub Item Two')).toBeInTheDocument();
      });
    });

    it('should not show submenu when activeSubmenu does not match', () => {
      const itemWithSubmenu = {
        id: 'folder',
        label: 'Folder',
        icon: '/icons/folder.svg',
        submenu: [
          { id: 'sub1', label: 'Sub Item One', icon: '/icons/sub.svg' },
        ],
      };
      
      render(
        <MenuItem 
          {...defaultProps} 
          item={itemWithSubmenu} 
          activeSubmenu="other-folder"
        />
      );
      
      expect(screen.queryByText('Sub Item One')).not.toBeInTheDocument();
    });
  });

  describe('Context Menu', () => {
    it('should call onItemContextMenu on right-click for non-folder', () => {
      render(<MenuItem {...defaultProps} />);
      
      const item = screen.getByText('Test Item').closest('.start-menu-item');
      fireEvent.contextMenu(item, { clientX: 100, clientY: 200 });
      
      expect(defaultProps.onItemContextMenu).toHaveBeenCalledWith(
        defaultProps.item,
        expect.any(Object)
      );
    });

    it('should call onItemContextMenu for folder items (folders have context menus)', () => {
      const folderItem = {
        id: 'test-folder',
        type: 'folder',
        label: 'Test Folder',
        icon: '/icons/folder.svg',
        contents: [],
        submenu: [{ id: 'sub1', label: 'Sub Item', icon: '/icons/sub.svg' }],
      };
      
      render(<MenuItem {...defaultProps} item={folderItem} />);
      
      const item = screen.getByText('Test Folder').closest('.start-menu-item');
      fireEvent.contextMenu(item, { clientX: 100, clientY: 200 });
      
      // Folders should have context menus (add to desktop, etc.)
      expect(defaultProps.onItemContextMenu).toHaveBeenCalledWith(
        folderItem,
        expect.any(Object)
      );
    });
  });

  describe('Divider', () => {
    it('should render only a divider element for divider type', () => {
      const { container } = render(
        <MenuItem {...defaultProps} item={{ type: 'divider' }} />
      );
      
      expect(container.querySelector('.start-menu-divider')).toBeInTheDocument();
      expect(container.querySelector('.start-menu-item')).not.toBeInTheDocument();
    });
  });
});

