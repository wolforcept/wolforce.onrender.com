export default function ContextMenu({ x, y, options, onClose }) {
  return (
    <>
      {/* Backdrop to close menu when clicking outside */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10001,
        }}
        onClick={onClose}
        onContextMenu={(e) => {
          e.preventDefault();
          onClose();
        }}
      />
      {/* Context menu */}
      <div
        className="context-menu"
        style={{
          position: 'fixed',
          left: x,
          top: y,
          zIndex: 10002,
        }}
      >
        {options.map((option, index) => {
          if (option.type === 'divider') {
            return <div key={index} className="context-menu-divider" />;
          }
          return (
            <div
              key={option.id || index}
              className={`context-menu-item ${option.disabled ? 'disabled' : ''}`}
              onClick={() => {
                if (!option.disabled) {
                  option.onClick();
                  onClose();
                }
              }}
            >
              {option.label}
            </div>
          );
        })}
      </div>
    </>
  );
}

