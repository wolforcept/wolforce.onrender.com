import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Taskbar from '../components/Taskbar';

describe('Taskbar', () => {
  const defaultProps = {
    windows: [],
    activeWindowId: null,
    onWindowClick: vi.fn(),
    onStartClick: vi.fn(),
    isStartMenuOpen: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the taskbar', () => {
      const { container } = render(<Taskbar {...defaultProps} />);
      
      expect(container.querySelector('.taskbar')).toBeInTheDocument();
    });

    it('should render Start button', () => {
      render(<Taskbar {...defaultProps} />);
      
      expect(screen.getByText('Start')).toBeInTheDocument();
    });

    it('should render Windows logo in Start button', () => {
      render(<Taskbar {...defaultProps} />);
      
      expect(screen.getByAltText('Start')).toBeInTheDocument();
    });

    it('should render clock area', () => {
      const { container } = render(<Taskbar {...defaultProps} />);
      
      expect(container.querySelector('.taskbar-clock')).toBeInTheDocument();
    });

    it('should render speaker icon', () => {
      render(<Taskbar {...defaultProps} />);
      
      expect(screen.getByAltText('Volume')).toBeInTheDocument();
    });
  });

  describe('Start Button', () => {
    it('should call onStartClick when Start button is clicked', () => {
      render(<Taskbar {...defaultProps} />);
      
      fireEvent.click(screen.getByText('Start'));
      
      expect(defaultProps.onStartClick).toHaveBeenCalled();
    });

    it('should have active class when Start menu is open', () => {
      const { container } = render(<Taskbar {...defaultProps} isStartMenuOpen={true} />);
      
      const startButton = container.querySelector('.start-button');
      expect(startButton).toHaveClass('active');
    });

    it('should not have active class when Start menu is closed', () => {
      const { container } = render(<Taskbar {...defaultProps} isStartMenuOpen={false} />);
      
      const startButton = container.querySelector('.start-button');
      expect(startButton).not.toHaveClass('active');
    });
  });

  describe('Window Buttons', () => {
    const windowsProps = {
      ...defaultProps,
      windows: [
        { id: 'win1', title: 'Window One', icon: '/icons/app1.svg', isMinimized: false },
        { id: 'win2', title: 'Window Two', icon: '/icons/app2.svg', isMinimized: false },
        { id: 'win3', title: 'Minimized Window', icon: '/icons/app3.svg', isMinimized: true },
      ],
      activeWindowId: 'win1',
    };

    it('should render a button for each window', () => {
      render(<Taskbar {...windowsProps} />);
      
      expect(screen.getByText('Window One')).toBeInTheDocument();
      expect(screen.getByText('Window Two')).toBeInTheDocument();
      expect(screen.getByText('Minimized Window')).toBeInTheDocument();
    });

    it('should show window icons', () => {
      const { container } = render(<Taskbar {...windowsProps} />);
      
      const windowButtons = container.querySelectorAll('.taskbar-window-btn img');
      expect(windowButtons.length).toBe(3);
    });

    it('should call onWindowClick when window button is clicked', () => {
      render(<Taskbar {...windowsProps} />);
      
      fireEvent.click(screen.getByText('Window Two'));
      
      expect(defaultProps.onWindowClick).toHaveBeenCalledWith('win2');
    });

    it('should have active class on button of active window', () => {
      const { container } = render(<Taskbar {...windowsProps} />);
      
      const buttons = container.querySelectorAll('.taskbar-window-btn');
      const activeButton = Array.from(buttons).find(btn => 
        btn.textContent.includes('Window One')
      );
      
      expect(activeButton).toHaveClass('active');
    });

    it('should not have active class on button of inactive window', () => {
      const { container } = render(<Taskbar {...windowsProps} />);
      
      const buttons = container.querySelectorAll('.taskbar-window-btn');
      const inactiveButton = Array.from(buttons).find(btn => 
        btn.textContent.includes('Window Two')
      );
      
      expect(inactiveButton).not.toHaveClass('active');
    });

    it('should not have active class on button of minimized window', () => {
      const propsWithMinimizedActive = {
        ...windowsProps,
        windows: [
          { id: 'win1', title: 'Window One', icon: '/icons/app1.svg', isMinimized: true },
        ],
        activeWindowId: 'win1',
      };
      
      const { container } = render(<Taskbar {...propsWithMinimizedActive} />);
      
      const button = container.querySelector('.taskbar-window-btn');
      expect(button).not.toHaveClass('active');
    });
  });

  describe('Layout', () => {
    it('should have divider between start button and windows', () => {
      const { container } = render(<Taskbar {...defaultProps} />);
      
      expect(container.querySelector('.taskbar-divider')).toBeInTheDocument();
    });

    it('should have windows area', () => {
      const { container } = render(<Taskbar {...defaultProps} />);
      
      expect(container.querySelector('.taskbar-windows')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should render correctly with no windows', () => {
      const { container } = render(<Taskbar {...defaultProps} />);
      
      const windowButtons = container.querySelectorAll('.taskbar-window-btn');
      expect(windowButtons.length).toBe(0);
    });
  });

  describe('Many Windows', () => {
    it('should handle many windows', () => {
      const manyWindows = Array.from({ length: 10 }, (_, i) => ({
        id: `win${i}`,
        title: `Window ${i + 1}`,
        icon: `/icons/app${i}.svg`,
        isMinimized: false,
      }));
      
      const { container } = render(
        <Taskbar {...defaultProps} windows={manyWindows} activeWindowId="win5" />
      );
      
      const windowButtons = container.querySelectorAll('.taskbar-window-btn');
      expect(windowButtons.length).toBe(10);
    });
  });
});
