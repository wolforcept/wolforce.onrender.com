import { useState, useEffect } from 'react';

export default function Taskbar({ 
  windows, 
  activeWindowId, 
  onWindowClick, 
  onStartClick, 
  isStartMenuOpen 
}) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="taskbar">
      <button 
        className={`start-button ${isStartMenuOpen ? 'active' : ''}`}
        onClick={onStartClick}
      >
        <img src="/icons/windows-logo.svg" alt="Start" />
        <span>Start</span>
      </button>

      <div className="taskbar-divider" />

      <div className="taskbar-windows">
        {windows.map((window) => (
          <button
            key={window.id}
            className={`taskbar-window-btn ${
              window.id === activeWindowId && !window.isMinimized ? 'active' : ''
            }`}
            onClick={() => onWindowClick(window.id)}
          >
            <img src={window.icon} alt="" />
            <span>{window.title}</span>
          </button>
        ))}
      </div>

      <div className="taskbar-clock">
        <img src="/icons/speaker.svg" alt="Volume" />
        <span>{formatTime(time)}</span>
      </div>
    </div>
  );
}



