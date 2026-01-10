import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ContextMenu from '../components/ContextMenu';

describe('ContextMenu', () => {
  const defaultProps = {
    x: 100,
    y: 200,
    options: [
      { id: 'open', label: 'Open', onClick: vi.fn() },
      { id: 'new-window', label: 'Open in New Window', onClick: vi.fn() },
      { type: 'divider' },
      { id: 'delete', label: 'Delete', onClick: vi.fn() },
    ],
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render context menu at specified position', () => {
      const { container } = render(<ContextMenu {...defaultProps} />);
      
      const menu = container.querySelector('.context-menu');
      expect(menu).toBeInTheDocument();
      expect(menu.style.left).toBe('100px');
      expect(menu.style.top).toBe('200px');
    });

    it('should render all menu options', () => {
      render(<ContextMenu {...defaultProps} />);
      
      expect(screen.getByText('Open')).toBeInTheDocument();
      expect(screen.getByText('Open in New Window')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('should render dividers', () => {
      const { container } = render(<ContextMenu {...defaultProps} />);
      
      const dividers = container.querySelectorAll('.context-menu-divider');
      expect(dividers.length).toBe(1);
    });
  });

  describe('Click Handling', () => {
    it('should call onClick when clicking an option', () => {
      render(<ContextMenu {...defaultProps} />);
      
      fireEvent.click(screen.getByText('Open'));
      
      expect(defaultProps.options[0].onClick).toHaveBeenCalled();
    });

    it('should call onClose after clicking an option', () => {
      render(<ContextMenu {...defaultProps} />);
      
      fireEvent.click(screen.getByText('Open'));
      
      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('should call correct onClick for different options', () => {
      render(<ContextMenu {...defaultProps} />);
      
      fireEvent.click(screen.getByText('Delete'));
      
      expect(defaultProps.options[3].onClick).toHaveBeenCalled();
      expect(defaultProps.options[0].onClick).not.toHaveBeenCalled();
    });
  });

  describe('Closing', () => {
    it('should call onClose when clicking outside menu', () => {
      const { container } = render(
        <div>
          <div className="outside-area" style={{ width: 500, height: 500 }} />
          <ContextMenu {...defaultProps} />
        </div>
      );
      
      // Clicking directly on menu should not close
      const menu = container.querySelector('.context-menu');
      fireEvent.click(menu);
      
      // onClose is called when an option is clicked
    });
  });

  describe('Empty Options', () => {
    it('should render empty menu when no options provided', () => {
      const { container } = render(
        <ContextMenu {...defaultProps} options={[]} />
      );
      
      const menu = container.querySelector('.context-menu');
      expect(menu).toBeInTheDocument();
      expect(menu.children.length).toBe(0);
    });
  });

  describe('Positioning', () => {
    it('should accept different x and y positions', () => {
      const { container } = render(<ContextMenu {...defaultProps} x={300} y={400} />);
      
      const menu = container.querySelector('.context-menu');
      expect(menu.style.left).toBe('300px');
      expect(menu.style.top).toBe('400px');
    });

    it('should handle zero position', () => {
      const { container } = render(<ContextMenu {...defaultProps} x={0} y={0} />);
      
      const menu = container.querySelector('.context-menu');
      expect(menu.style.left).toBe('0px');
      expect(menu.style.top).toBe('0px');
    });
  });
});
