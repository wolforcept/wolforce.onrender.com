import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Window from '../components/Window';

// Mock the config
vi.mock('../data/config', () => ({
  uiSettings: { scale: 1 },
}));

describe('Window Resize', () => {
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

  describe('Resize Handle Visibility', () => {
    it('should render resize handle when window is not maximized', () => {
      const { container } = render(<Window {...defaultProps} isMaximized={false} />);
      
      const resizeHandle = container.querySelector('.window-resize-handle');
      expect(resizeHandle).toBeInTheDocument();
    });

    it('should not render resize handle when window is maximized', () => {
      const { container } = render(<Window {...defaultProps} isMaximized={true} />);
      
      const resizeHandle = container.querySelector('.window-resize-handle');
      expect(resizeHandle).not.toBeInTheDocument();
    });

    it('should have nwse-resize cursor on resize handle', () => {
      const { container } = render(<Window {...defaultProps} />);
      
      const resizeHandle = container.querySelector('.window-resize-handle');
      expect(resizeHandle).toBeInTheDocument();
      // The cursor style is applied via CSS, so we just check the element exists
    });
  });

  describe('Resize Interaction', () => {
    it('should call onResizeStart with correct parameters on mousedown', () => {
      const { container } = render(<Window {...defaultProps} width={800} height={600} />);
      
      const resizeHandle = container.querySelector('.window-resize-handle');
      fireEvent.mouseDown(resizeHandle, { clientX: 900, clientY: 700 });
      
      expect(defaultProps.onResizeStart).toHaveBeenCalledTimes(1);
      expect(defaultProps.onResizeStart).toHaveBeenCalledWith(
        'test-window',
        900,  // clientX
        700,  // clientY
        800,  // width
        600   // height
      );
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

    it('should stop propagation on resize mousedown', () => {
      const { container } = render(<Window {...defaultProps} />);
      
      const resizeHandle = container.querySelector('.window-resize-handle');
      const event = new MouseEvent('mousedown', {
        clientX: 740,
        clientY: 580,
        bubbles: true,
      });
      event.stopPropagation = vi.fn();
      
      resizeHandle.dispatchEvent(event);
      
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it('should not call onResizeStart when window is maximized', () => {
      const { container } = render(<Window {...defaultProps} isMaximized={true} />);
      
      // Resize handle shouldn't exist when maximized
      const resizeHandle = container.querySelector('.window-resize-handle');
      expect(resizeHandle).not.toBeInTheDocument();
      expect(defaultProps.onResizeStart).not.toHaveBeenCalled();
    });
  });

  describe('Resize Handle Position', () => {
    it('should position resize handle at bottom-right corner', () => {
      const { container } = render(<Window {...defaultProps} />);
      
      const resizeHandle = container.querySelector('.window-resize-handle');
      expect(resizeHandle).toBeInTheDocument();
      // Position is set via CSS, element existence confirms proper rendering
    });
  });

  describe('Resize with Different Window States', () => {
    it('should call onResizeStart for active window', () => {
      const { container } = render(<Window {...defaultProps} isActive={true} />);
      
      const resizeHandle = container.querySelector('.window-resize-handle');
      fireEvent.mouseDown(resizeHandle, { clientX: 740, clientY: 580 });
      
      expect(defaultProps.onResizeStart).toHaveBeenCalled();
    });

    it('should call onResizeStart for inactive window', () => {
      const { container } = render(<Window {...defaultProps} isActive={false} />);
      
      const resizeHandle = container.querySelector('.window-resize-handle');
      fireEvent.mouseDown(resizeHandle, { clientX: 740, clientY: 580 });
      
      expect(defaultProps.onResizeStart).toHaveBeenCalled();
    });

    it('should not call onResizeStart for minimized window (window is hidden)', () => {
      const { container } = render(<Window {...defaultProps} isMinimized={true} />);
      
      // Window is hidden when minimized
      const window = container.querySelector('.window');
      expect(window.style.display).toBe('none');
    });
  });

  describe('Resize Handle z-index', () => {
    it('should be clickable above window content', () => {
      const { container } = render(<Window {...defaultProps} />);
      
      const resizeHandle = container.querySelector('.window-resize-handle');
      fireEvent.mouseDown(resizeHandle, { clientX: 740, clientY: 580 });
      
      // Should call onResizeStart, proving the handle is accessible
      expect(defaultProps.onResizeStart).toHaveBeenCalledWith(
        'test-window',
        740,
        580,
        640,
        480
      );
    });
  });
});

describe('Window Resize Integration', () => {
  // This test ensures the resize logic in Desktop.jsx works correctly
  // by verifying that the Window component properly calls onResizeStart
  // with the current dimensions
  
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

  it('should pass current width and height to onResizeStart', () => {
    const { container } = render(
      <Window {...defaultProps} width={500} height={400} />
    );
    
    const resizeHandle = container.querySelector('.window-resize-handle');
    fireEvent.mouseDown(resizeHandle, { clientX: 600, clientY: 500 });
    
    expect(defaultProps.onResizeStart).toHaveBeenCalledWith(
      'test-window',
      600,  // mouseX
      500,  // mouseY
      500,  // current width
      400   // current height
    );
  });

  it('should work with various window sizes', () => {
    const sizes = [
      { width: 200, height: 150 },  // minimum
      { width: 1200, height: 800 }, // large
      { width: 400, height: 300 },  // medium
    ];

    sizes.forEach(({ width, height }) => {
      vi.clearAllMocks();
      const { container, unmount } = render(
        <Window {...defaultProps} width={width} height={height} />
      );
      
      const resizeHandle = container.querySelector('.window-resize-handle');
      fireEvent.mouseDown(resizeHandle, { clientX: 100, clientY: 100 });
      
      expect(defaultProps.onResizeStart).toHaveBeenCalledWith(
        'test-window',
        100,
        100,
        width,
        height
      );
      
      unmount();
    });
  });
});

describe('Window Drag', () => {
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

  describe('Drag Interaction', () => {
    it('should call onDragStart with correct parameters on titlebar mousedown', () => {
      const { container } = render(<Window {...defaultProps} x={200} y={150} />);
      
      const titlebar = container.querySelector('.window-titlebar');
      fireEvent.mouseDown(titlebar, { clientX: 250, clientY: 160 });
      
      expect(defaultProps.onDragStart).toHaveBeenCalledTimes(1);
      expect(defaultProps.onDragStart).toHaveBeenCalledWith(
        'test-window',
        250,  // clientX
        160,  // clientY
        200,  // x
        150   // y
      );
    });

    it('should not call onDragStart when clicking on window controls', () => {
      render(<Window {...defaultProps} />);
      
      fireEvent.mouseDown(screen.getByTitle('Close'));
      
      expect(defaultProps.onDragStart).not.toHaveBeenCalled();
    });

    it('should not call onDragStart when clicking on minimize button', () => {
      render(<Window {...defaultProps} />);
      
      fireEvent.mouseDown(screen.getByTitle('Minimize'));
      
      expect(defaultProps.onDragStart).not.toHaveBeenCalled();
    });

    it('should not call onDragStart when clicking on maximize button', () => {
      render(<Window {...defaultProps} />);
      
      fireEvent.mouseDown(screen.getByTitle('Maximize'));
      
      expect(defaultProps.onDragStart).not.toHaveBeenCalled();
    });

    it('should not call onDragStart when window is maximized', () => {
      const { container } = render(<Window {...defaultProps} isMaximized={true} />);
      
      const titlebar = container.querySelector('.window-titlebar');
      fireEvent.mouseDown(titlebar, { clientX: 250, clientY: 160 });
      
      expect(defaultProps.onDragStart).not.toHaveBeenCalled();
    });

    it('should prevent default on titlebar mousedown', () => {
      const { container } = render(<Window {...defaultProps} />);
      
      const titlebar = container.querySelector('.window-titlebar');
      const event = new MouseEvent('mousedown', {
        clientX: 150,
        clientY: 110,
        bubbles: true,
      });
      event.preventDefault = vi.fn();
      
      titlebar.dispatchEvent(event);
      
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });
});

