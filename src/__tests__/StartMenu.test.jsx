import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StartMenu from '../components/StartMenu';

describe('StartMenu', () => {
  const mockItems = [
    {
      id: 'folder1',
      label: 'Games',
      icon: '/icons/folder.svg',
      submenu: [
        { id: 'game1', label: 'Game One', icon: '/icons/game.svg', url: 'https://game1.com' },
        { id: 'game2', label: 'Game Two', icon: '/icons/game.svg', url: 'https://game2.com' },
      ],
    },
    { type: 'divider' },
    { id: 'help', label: 'Help', icon: '/icons/help.svg', url: 'https://help.com' },
  ];

  const defaultProps = {
    items: mockItems,
    onItemClick: vi.fn(),
    onItemContextMenu: vi.fn(),
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the start menu with sidebar', () => {
      render(<StartMenu {...defaultProps} />);
      
      expect(screen.getByText('Windows 98')).toBeInTheDocument();
    });

    it('should render top-level menu items', () => {
      render(<StartMenu {...defaultProps} />);
      
      expect(screen.getByText('Games')).toBeInTheDocument();
      expect(screen.getByText('Help')).toBeInTheDocument();
    });

    it('should render search input', () => {
      render(<StartMenu {...defaultProps} />);
      
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('should show arrow indicator for folders with submenus', () => {
      render(<StartMenu {...defaultProps} />);
      
      const arrows = screen.getAllByText('▶');
      expect(arrows.length).toBe(1); // Games folder
    });
  });

  describe('Item Click', () => {
    it('should call onItemClick when clicking non-folder item', () => {
      render(<StartMenu {...defaultProps} />);
      
      const helpItem = screen.getByText('Help').closest('.start-menu-item');
      fireEvent.click(helpItem);
      
      expect(defaultProps.onItemClick).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'help', label: 'Help' })
      );
    });

    it('should not call onItemClick when clicking folder', () => {
      render(<StartMenu {...defaultProps} />);
      
      const gamesFolder = screen.getByText('Games').closest('.start-menu-item');
      fireEvent.click(gamesFolder);
      
      expect(defaultProps.onItemClick).not.toHaveBeenCalled();
    });
  });

  describe('Context Menu', () => {
    it('should call onItemContextMenu on right-click of non-folder item', () => {
      render(<StartMenu {...defaultProps} />);
      
      const helpItem = screen.getByText('Help').closest('.start-menu-item');
      fireEvent.contextMenu(helpItem, { clientX: 100, clientY: 200 });
      
      expect(defaultProps.onItemContextMenu).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'help' }),
        expect.any(Object)
      );
    });
  });

  describe('Search Functionality', () => {
    it('should filter items when typing in search box', () => {
      render(<StartMenu {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search...');
      fireEvent.change(searchInput, { target: { value: 'Game' } });
      
      expect(screen.getByText('Search Results')).toBeInTheDocument();
    });

    it('should show "No results found" when search has no matches', () => {
      render(<StartMenu {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search...');
      fireEvent.change(searchInput, { target: { value: 'ZZZZZZZ' } });
      
      expect(screen.getByText('No results found')).toBeInTheDocument();
    });
  });
});
