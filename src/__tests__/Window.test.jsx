import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Window from '../components/Window';

describe('Window', () => {
  const defaultProps = {
    id: 'test-window',
    title: 'Test Window',
    icon: '/icons/test.svg',
    url: 'https://example.com',
    x: 100,
    y: 100,
    width: 640,
    height: 480,
    isMinimized: false,
    isMaximized: false,
    isActive: true,
    onClose: vi.fn(),
    onMinimize: vi.fn(),
    onMaximize: vi.fn(),
    onFocus: vi.fn(),
    onDragStart: vi.fn(),
    onResizeStart: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render window with title', () => {
      render(<Window {...defaultProps} />);
      
      expect(screen.getByText('Test Window')).toBeInTheDocument();
    });

    it('should render window controls (minimize, maximize, close)', () => {
      render(<Window {...defaultProps} />);
      
      expect(screen.getByTitle('Minimize')).toBeInTheDocument();
      expect(screen.getByTitle('Maximize')).toBeInTheDocument();
      expect(screen.getByTitle('Close')).toBeInTheDocument();
    });

    it('should render iframe with correct src', () => {
      render(<Window {...defaultProps} />);
      
      const iframe = screen.getByTitle('Test Window');
      expect(iframe).toHaveAttribute('src', 'https://example.com');
    });

    it('should position window at specified coordinates', () => {
      const { container } = render(<Window {...defaultProps} x={200} y={150} />);
      
      const window = container.querySelector('.window');
      expect(window.style.left).toBe('200px');
      expect(window.style.top).toBe('150px');
    });

    it('should set window dimensions', () => {
      const { container } = render(<Window {...defaultProps} width={800} height={600} />);
      
      const window = container.querySelector('.window');
      expect(window.style.width).toBe('800px');
      expect(window.style.height).toBe('600px');
    });
  });

  describe('Minimized State', () => {
    it('should be hidden when minimized but still in DOM', () => {
      const { container } = render(<Window {...defaultProps} isMinimized={true} />);
      
      const window = container.querySelector('.window');
      expect(window).toBeInTheDocument();
      expect(window).toHaveClass('minimized');
      expect(window.style.display).toBe('none');
    });

    it('should be visible when not minimized', () => {
      const { container } = render(<Window {...defaultProps} isMinimized={false} />);
      
      expect(container.querySelector('.window')).toBeInTheDocument();
    });
  });

  describe('Maximized State', () => {
    it('should have maximized class when maximized', () => {
      const { container } = render(<Window {...defaultProps} isMaximized={true} />);
      
      const window = container.querySelector('.window');
      expect(window).toHaveClass('maximized');
    });

    it('should not have maximized class when not maximized', () => {
      const { container } = render(<Window {...defaultProps} isMaximized={false} />);
      
      const window = container.querySelector('.window');
      expect(window).not.toHaveClass('maximized');
    });

    it('should position at 0,0 when maximized', () => {
      const { container } = render(<Window {...defaultProps} isMaximized={true} x={200} y={150} />);
      
      const window = container.querySelector('.window');
      expect(window.style.left).toBe('0px');
      expect(window.style.top).toBe('0px');
    });

    it('should not show resize handle when maximized', () => {
      const { container } = render(<Window {...defaultProps} isMaximized={true} />);
      
      expect(container.querySelector('.window-resize-handle')).not.toBeInTheDocument();
    });

    it('should show resize handle when not maximized', () => {
      const { container } = render(<Window {...defaultProps} isMaximized={false} />);
      
      expect(container.querySelector('.window-resize-handle')).toBeInTheDocument();
    });
  });

  describe('Active State', () => {
    it('should have higher z-index when active', () => {
      const { container } = render(<Window {...defaultProps} isActive={true} />);
      
      const window = container.querySelector('.window');
      expect(window.style.zIndex).toBe('100');
    });

    it('should have lower z-index when inactive', () => {
      const { container } = render(<Window {...defaultProps} isActive={false} />);
      
      const window = container.querySelector('.window');
      expect(window.style.zIndex).toBe('10');
    });

    it('should have inactive class when not active', () => {
      const { container } = render(<Window {...defaultProps} isActive={false} />);
      
      const window = container.querySelector('.window');
      expect(window).toHaveClass('inactive');
    });

    it('should show invisible overlay when inactive', () => {
      const { container } = render(<Window {...defaultProps} isActive={false} />);
      
      expect(container.querySelector('.window-inactive-overlay')).toBeInTheDocument();
    });

    it('should not show overlay when active', () => {
      const { container } = render(<Window {...defaultProps} isActive={true} />);
      
      expect(container.querySelector('.window-inactive-overlay')).not.toBeInTheDocument();
    });

    it('should call onFocus when clicking inactive overlay', () => {
      const { container } = render(<Window {...defaultProps} isActive={false} />);
      
      const overlay = container.querySelector('.window-inactive-overlay');
      fireEvent.mouseDown(overlay);
      
      expect(defaultProps.onFocus).toHaveBeenCalledWith('test-window');
    });
  });

  describe('Window Controls', () => {
    it('should call onMinimize when clicking minimize button', () => {
      render(<Window {...defaultProps} />);
      
      fireEvent.click(screen.getByTitle('Minimize'));
      
      expect(defaultProps.onMinimize).toHaveBeenCalledWith('test-window');
    });

    it('should call onMaximize when clicking maximize button', () => {
      render(<Window {...defaultProps} />);
      
      fireEvent.click(screen.getByTitle('Maximize'));
      
      expect(defaultProps.onMaximize).toHaveBeenCalledWith('test-window');
    });

    it('should call onClose when clicking close button', () => {
      render(<Window {...defaultProps} />);
      
      fireEvent.click(screen.getByTitle('Close'));
      
      expect(defaultProps.onClose).toHaveBeenCalledWith('test-window');
    });
  });

  describe('Dragging', () => {
    it('should call onDragStart when mousedown on titlebar', () => {
      const { container } = render(<Window {...defaultProps} />);
      
      const titlebar = container.querySelector('.window-titlebar');
      fireEvent.mouseDown(titlebar, { clientX: 150, clientY: 110 });
      
      expect(defaultProps.onDragStart).toHaveBeenCalledWith(
        'test-window',
        150,
        110,
        100, // x
        100  // y
      );
    });

    it('should not call onDragStart when clicking on window controls', () => {
      render(<Window {...defaultProps} />);
      
      // Click on close button
      fireEvent.mouseDown(screen.getByTitle('Close'));
      
      expect(defaultProps.onDragStart).not.toHaveBeenCalled();
    });

    it('should not call onDragStart when window is maximized', () => {
      const { container } = render(<Window {...defaultProps} isMaximized={true} />);
      
      const titlebar = container.querySelector('.window-titlebar');
      fireEvent.mouseDown(titlebar, { clientX: 150, clientY: 110 });
      
      expect(defaultProps.onDragStart).not.toHaveBeenCalled();
    });
  });

  describe('Resizing', () => {
    it('should call onResizeStart when mousedown on resize handle', () => {
      const { container } = render(<Window {...defaultProps} />);
      
      const resizeHandle = container.querySelector('.window-resize-handle');
      fireEvent.mouseDown(resizeHandle, { clientX: 740, clientY: 580 });
      
      expect(defaultProps.onResizeStart).toHaveBeenCalledWith(
        'test-window',
        740,
        580,
        640, // width
        480  // height
      );
    });

    it('should not call onResizeStart when window is maximized', () => {
      const { container } = render(<Window {...defaultProps} isMaximized={true} />);
      
      // Resize handle shouldn't exist when maximized
      expect(container.querySelector('.window-resize-handle')).not.toBeInTheDocument();
    });

    it('should prevent default on resize mousedown', () => {
      const { container } = render(<Window {...defaultProps} />);
      
      const resizeHandle = container.querySelector('.window-resize-handle');
      const event = new MouseEvent('mousedown', {
        clientX: 740,
        clientY: 580,
        bubbles: true,
      });
      event.preventDefault = vi.fn();
      
      resizeHandle.dispatchEvent(event);
      
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  describe('Focus Behavior', () => {
    it('should call onFocus when clicking inside window content', () => {
      const { container } = render(<Window {...defaultProps} />);
      
      const content = container.querySelector('.window-content');
      fireEvent.mouseDown(content);
      
      expect(defaultProps.onFocus).toHaveBeenCalledWith('test-window');
    });

    it('should not call onFocus when clicking titlebar (drag handles it)', () => {
      const { container } = render(<Window {...defaultProps} />);
      
      const titlebar = container.querySelector('.window-titlebar');
      fireEvent.mouseDown(titlebar);
      
      // onFocus should not be called because titlebar mousedown is for dragging
      expect(defaultProps.onFocus).not.toHaveBeenCalled();
    });
  });

  describe('IFrame Sandbox', () => {
    it('should have sandbox attribute on iframe', () => {
      render(<Window {...defaultProps} />);
      
      const iframe = screen.getByTitle('Test Window');
      expect(iframe).toHaveAttribute('sandbox');
      expect(iframe.getAttribute('sandbox')).toContain('allow-scripts');
      expect(iframe.getAttribute('sandbox')).toContain('allow-same-origin');
    });
  });
});
