import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Desktop from '../components/Desktop';

// Mock the config to have predictable test data
vi.mock('../data/config', () => ({
  desktopIcons: [
    { id: 'my-computer', label: 'My Computer', icon: '/icons/my-computer.svg', url: 'https://example.com', x: 0, y: 0 },
    { id: 'recycle-bin', label: 'Recycle Bin', icon: '/icons/recycle-bin.svg', url: 'https://recyclebin.com', x: 0, y: 1 },
  ],
  startMenuItems: [
    { id: 'help', label: 'Help', icon: '/icons/help.svg', url: 'https://help.com' },
  ],
  pages: {
    'my-computer': { label: 'My Computer', icon: '/icons/my-computer.svg', url: 'https://example.com' },
    'recycle-bin': { label: 'Recycle Bin', icon: '/icons/recycle-bin.svg', url: 'https://recyclebin.com' },
    'help': { label: 'Help', icon: '/icons/help.svg', url: 'https://help.com' },
  },
  gridSettings: { cellWidth: 75, cellHeight: 85, padding: 10 },
  defaultWindowSettings: { width: 640, height: 480, minWidth: 200, minHeight: 150 },
  uiSettings: { scale: 1 },
}));

describe('Desktop Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.getItem.mockReturnValue(null);
  });

  describe('Initial Rendering', () => {
    it('should render desktop with icons', () => {
      render(<Desktop />);
      
      expect(screen.getByText('My Computer')).toBeInTheDocument();
      expect(screen.getByText('Recycle Bin')).toBeInTheDocument();
    });

    it('should render taskbar', () => {
      const { container } = render(<Desktop />);
      
      expect(container.querySelector('.taskbar')).toBeInTheDocument();
    });

    it('should not show start menu initially', () => {
      const { container } = render(<Desktop />);
      
      expect(container.querySelector('.start-menu')).not.toBeInTheDocument();
    });

    it('should not show any windows initially', () => {
      const { container } = render(<Desktop />);
      
      expect(container.querySelector('.window')).not.toBeInTheDocument();
    });
  });

  describe('Icon Selection', () => {
    it('should select icon on click', () => {
      render(<Desktop />);
      
      const icon = screen.getByText('My Computer').closest('.desktop-icon');
      fireEvent.mouseDown(icon, { button: 0 });
      
      expect(icon).toHaveClass('selected');
    });

    it('should deselect icon when clicking desktop background', () => {
      const { container } = render(<Desktop />);
      
      // First select an icon
      const icon = screen.getByText('My Computer').closest('.desktop-icon');
      fireEvent.mouseDown(icon, { button: 0 });
      expect(icon).toHaveClass('selected');
      
      // Click on desktop background
      const desktop = container.querySelector('.desktop');
      fireEvent.click(desktop);
      
      expect(icon).not.toHaveClass('selected');
    });
  });

  describe('Opening Windows', () => {
    it('should open window on icon double-click', () => {
      const { container } = render(<Desktop />);
      
      const icon = screen.getByText('My Computer').closest('.desktop-icon');
      fireEvent.doubleClick(icon);
      
      expect(container.querySelector('.window')).toBeInTheDocument();
    });

    it('should stack multiple windows', () => {
      const { container } = render(<Desktop />);
      
      // Open first window
      fireEvent.doubleClick(screen.getByText('My Computer').closest('.desktop-icon'));
      expect(container.querySelectorAll('.window').length).toBe(1);
      
      // Open second window
      fireEvent.doubleClick(screen.getByText('Recycle Bin').closest('.desktop-icon'));
      expect(container.querySelectorAll('.window').length).toBe(2);
    });
  });

  describe('Start Menu', () => {
    it('should toggle start menu on Start button click', () => {
      const { container } = render(<Desktop />);
      
      // Open
      fireEvent.click(screen.getByText('Start'));
      expect(container.querySelector('.start-menu')).toBeInTheDocument();
      
      // Close
      fireEvent.click(screen.getByText('Start'));
      expect(container.querySelector('.start-menu')).not.toBeInTheDocument();
    });

    it('should close start menu when clicking on desktop', () => {
      const { container } = render(<Desktop />);
      
      // Open
      fireEvent.click(screen.getByText('Start'));
      expect(container.querySelector('.start-menu')).toBeInTheDocument();
      
      // Click desktop
      fireEvent.click(container.querySelector('.desktop'));
      expect(container.querySelector('.start-menu')).not.toBeInTheDocument();
    });
  });

  describe('Window Actions', () => {
    it('should close window when clicking close button', () => {
      const { container } = render(<Desktop />);
      
      // Open window
      fireEvent.doubleClick(screen.getByText('My Computer').closest('.desktop-icon'));
      expect(container.querySelector('.window')).toBeInTheDocument();
      
      // Close
      fireEvent.click(screen.getByTitle('Close'));
      expect(container.querySelector('.window')).not.toBeInTheDocument();
    });

    it('should maximize window when clicking maximize button', () => {
      const { container } = render(<Desktop />);
      
      // Open window
      fireEvent.doubleClick(screen.getByText('My Computer').closest('.desktop-icon'));
      
      // Maximize
      fireEvent.click(screen.getByTitle('Maximize'));
      expect(container.querySelector('.window')).toHaveClass('maximized');
    });

    it('should minimize window when clicking minimize button', () => {
      const { container } = render(<Desktop />);
      
      // Open window
      fireEvent.doubleClick(screen.getByText('My Computer').closest('.desktop-icon'));
      expect(container.querySelector('.window')).toBeInTheDocument();
      
      // Minimize - window is hidden but still in DOM
      fireEvent.click(screen.getByTitle('Minimize'));
      const window = container.querySelector('.window');
      expect(window).toBeInTheDocument();
      expect(window.style.display).toBe('none');
    });
  });

  describe('Taskbar Window Buttons', () => {
    it('should show window buttons in taskbar', () => {
      const { container } = render(<Desktop />);
      
      // Open window
      fireEvent.doubleClick(screen.getByText('My Computer').closest('.desktop-icon'));
      
      const taskbarButton = container.querySelector('.taskbar-window-btn');
      expect(taskbarButton).toBeInTheDocument();
    });

    it('should restore minimized window when clicking taskbar button', () => {
      const { container } = render(<Desktop />);
      
      // Open window
      fireEvent.doubleClick(screen.getByText('My Computer').closest('.desktop-icon'));
      
      // Minimize via window control
      fireEvent.click(screen.getByTitle('Minimize'));
      const window = container.querySelector('.window');
      expect(window.style.display).toBe('none');
      
      // Restore via taskbar
      const taskbarButton = container.querySelector('.taskbar-window-btn');
      fireEvent.click(taskbarButton);
      expect(window.style.display).not.toBe('none');
    });
  });

  describe('Context Menu', () => {
    it('should show context menu on icon right-click', () => {
      const { container } = render(<Desktop />);
      
      const icon = screen.getByText('My Computer').closest('.desktop-icon');
      fireEvent.contextMenu(icon, { clientX: 100, clientY: 100 });
      
      expect(container.querySelector('.context-menu')).toBeInTheDocument();
      expect(screen.getByText('Open')).toBeInTheDocument();
    });

    it('should close context menu when clicking elsewhere', () => {
      const { container } = render(<Desktop />);
      
      // Open context menu
      const icon = screen.getByText('My Computer').closest('.desktop-icon');
      fireEvent.contextMenu(icon, { clientX: 100, clientY: 100 });
      expect(container.querySelector('.context-menu')).toBeInTheDocument();
      
      // Click on desktop
      fireEvent.click(container.querySelector('.desktop'));
      expect(container.querySelector('.context-menu')).not.toBeInTheDocument();
    });
  });

  describe('LocalStorage', () => {
    it('should call localStorage.getItem on init', () => {
      render(<Desktop />);
      
      expect(window.localStorage.getItem).toHaveBeenCalled();
    });

    it('should save positions when icon is moved', () => {
      const { container } = render(<Desktop />);
      
      const icon = screen.getByText('My Computer').closest('.desktop-icon');
      
      // Simulate drag
      fireEvent.mouseDown(icon, { button: 0, clientX: 50, clientY: 50 });
      fireEvent.mouseUp(window, { clientX: 200, clientY: 200 });
      
      expect(window.localStorage.setItem).toHaveBeenCalled();
    });
  });
});
