import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DesktopIcon from '../components/DesktopIcon';
import { gridSettings } from '../data/config';

describe('DesktopIcon', () => {
  const defaultProps = {
    id: 'test-icon',
    label: 'Test Icon',
    icon: '/icons/test.svg',
    gridX: 0,
    gridY: 0,
    selected: false,
    onSelect: vi.fn(),
    onDoubleClick: vi.fn(),
    onMove: vi.fn(),
    onContextMenu: vi.fn(),
    occupiedPositions: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render with label and icon', () => {
      render(<DesktopIcon {...defaultProps} />);
      
      expect(screen.getByText('Test Icon')).toBeInTheDocument();
      expect(screen.getByAltText('Test Icon')).toBeInTheDocument();
    });

    it('should position icon based on grid coordinates', () => {
      const { container } = render(<DesktopIcon {...defaultProps} gridX={2} gridY={3} />);
      
      const icon = container.querySelector('.desktop-icon');
      const expectedLeft = 2 * gridSettings.cellWidth + gridSettings.padding;
      const expectedTop = 3 * gridSettings.cellHeight + gridSettings.padding;
      
      expect(icon.style.left).toBe(`${expectedLeft}px`);
      expect(icon.style.top).toBe(`${expectedTop}px`);
    });

    it('should apply selected class when selected', () => {
      const { container } = render(<DesktopIcon {...defaultProps} selected={true} />);
      
      const icon = container.querySelector('.desktop-icon');
      expect(icon).toHaveClass('selected');
    });

    it('should not apply selected class when not selected', () => {
      const { container } = render(<DesktopIcon {...defaultProps} selected={false} />);
      
      const icon = container.querySelector('.desktop-icon');
      expect(icon).not.toHaveClass('selected');
    });
  });

  describe('Selection', () => {
    it('should call onSelect when clicked', () => {
      render(<DesktopIcon {...defaultProps} />);
      
      fireEvent.mouseDown(screen.getByText('Test Icon').closest('.desktop-icon'), { button: 0 });
      
      expect(defaultProps.onSelect).toHaveBeenCalledWith('test-icon');
    });

    it('should not call onSelect on right-click', () => {
      render(<DesktopIcon {...defaultProps} />);
      
      fireEvent.mouseDown(screen.getByText('Test Icon').closest('.desktop-icon'), { button: 2 });
      
      expect(defaultProps.onSelect).not.toHaveBeenCalled();
    });
  });

  describe('Double Click', () => {
    it('should call onDoubleClick when double-clicked', () => {
      render(<DesktopIcon {...defaultProps} />);
      
      fireEvent.doubleClick(screen.getByText('Test Icon').closest('.desktop-icon'));
      
      expect(defaultProps.onDoubleClick).toHaveBeenCalledWith('test-icon');
    });
  });

  describe('Context Menu', () => {
    it('should call onContextMenu on right-click', () => {
      render(<DesktopIcon {...defaultProps} />);
      
      const iconElement = screen.getByText('Test Icon').closest('.desktop-icon');
      fireEvent.contextMenu(iconElement, { clientX: 100, clientY: 200 });
      
      expect(defaultProps.onContextMenu).toHaveBeenCalledWith('test-icon', expect.any(Object));
    });
  });

  describe('Drag and Drop', () => {
    it('should show ghost image when dragging starts', () => {
      const { container } = render(<DesktopIcon {...defaultProps} />);
      
      const icon = container.querySelector('.desktop-icon');
      fireEvent.mouseDown(icon, { button: 0, clientX: 50, clientY: 50 });
      
      // Should have two desktop-icon elements (original + ghost)
      const icons = container.querySelectorAll('.desktop-icon');
      expect(icons.length).toBe(2);
    });

    it('should reduce opacity of original icon when dragging', () => {
      const { container } = render(<DesktopIcon {...defaultProps} />);
      
      const icon = container.querySelector('.desktop-icon');
      fireEvent.mouseDown(icon, { button: 0, clientX: 50, clientY: 50 });
      
      expect(icon.style.opacity).toBe('0.5');
    });

    it('should call onMove when dropped in new position', () => {
      const { container } = render(
        <div style={{ width: 500, height: 500 }}>
          <DesktopIcon {...defaultProps} />
        </div>
      );
      
      const icon = container.querySelector('.desktop-icon');
      
      // Start drag
      fireEvent.mouseDown(icon, { button: 0, clientX: 50, clientY: 50 });
      
      // Move mouse to new position (simulating grid position 1, 1)
      fireEvent.mouseMove(window, { 
        clientX: gridSettings.cellWidth + gridSettings.padding + 50, 
        clientY: gridSettings.cellHeight + gridSettings.padding + 50 
      });
      
      // Release
      fireEvent.mouseUp(window, { 
        clientX: gridSettings.cellWidth + gridSettings.padding + 50, 
        clientY: gridSettings.cellHeight + gridSettings.padding + 50 
      });
      
      expect(defaultProps.onMove).toHaveBeenCalledWith('test-icon', expect.any(Number), expect.any(Number));
    });

    it('should not call onMove when dropped in same position', () => {
      const { container } = render(
        <div style={{ width: 500, height: 500 }}>
          <DesktopIcon {...defaultProps} gridX={0} gridY={0} />
        </div>
      );
      
      const icon = container.querySelector('.desktop-icon');
      
      // Start drag
      fireEvent.mouseDown(icon, { button: 0, clientX: 20, clientY: 20 });
      
      // Release at same position
      fireEvent.mouseUp(window, { clientX: 20, clientY: 20 });
      
      expect(defaultProps.onMove).not.toHaveBeenCalled();
    });
  });

  describe('Grid Collision Detection', () => {
    it('should show preview when dragging to a different position', () => {
      const { container } = render(
        <div style={{ width: 500, height: 500 }}>
          <DesktopIcon {...defaultProps} occupiedPositions={[]} />
        </div>
      );
      
      const icon = container.querySelector('.desktop-icon');
      
      // Start drag
      fireEvent.mouseDown(icon, { button: 0, clientX: 20, clientY: 20 });
      
      // Move to new position (1, 0)
      fireEvent.mouseMove(window, { 
        clientX: gridSettings.cellWidth + gridSettings.padding + 20, 
        clientY: gridSettings.padding + 20 
      });
      
      const preview = container.querySelector('.desktop-icon-preview');
      expect(preview).toBeInTheDocument();
    });

    it('should not show preview when staying at original position', () => {
      const { container } = render(
        <div style={{ width: 500, height: 500 }}>
          <DesktopIcon {...defaultProps} gridX={0} gridY={0} />
        </div>
      );
      
      const icon = container.querySelector('.desktop-icon');
      
      // Start drag but stay at same grid position
      fireEvent.mouseDown(icon, { button: 0, clientX: 20, clientY: 20 });
      fireEvent.mouseMove(window, { clientX: 25, clientY: 25 });
      
      const preview = container.querySelector('.desktop-icon-preview');
      expect(preview).not.toBeInTheDocument();
    });
  });

  describe('Grid Snapping', () => {
    it('should snap to nearest grid position when released', () => {
      const { container } = render(
        <div style={{ width: 500, height: 500 }}>
          <DesktopIcon {...defaultProps} gridX={0} gridY={0} />
        </div>
      );
      
      const icon = container.querySelector('.desktop-icon');
      
      // Start drag
      fireEvent.mouseDown(icon, { button: 0, clientX: 20, clientY: 20 });
      
      // Move to middle of grid cell (1, 1) - should snap to grid
      const targetX = gridSettings.cellWidth * 1.5 + gridSettings.padding;
      const targetY = gridSettings.cellHeight * 1.5 + gridSettings.padding;
      
      fireEvent.mouseUp(window, { clientX: targetX, clientY: targetY });
      
      // Should have called onMove with grid-snapped coordinates
      expect(defaultProps.onMove).toHaveBeenCalled();
    });
  });
});
