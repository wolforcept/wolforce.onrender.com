import { useState } from 'react';
import { uiSettings } from '../data/config';
import { getContentComponent } from './windowContent';

export default function Window({
  id,
  title: initialTitle,
  icon,
  url,
  contentType,         // Type of content to render (iframe, folder, editor, etc.)
  folderContents,      // For folder content type
  folderId,            // The folder ID for navigation
  textFileId,          // For text file editing
  textFileContent,     // Initial content of text file
  systemFileId,        // For system file editing
  systemDataKey,       // localStorage key for system file
  systemLanguage,      // Language for syntax highlighting
  onItemOpen,          // Callback when item is opened from folder
  onItemContextMenu,   // Callback for right-click on items in folder view
  fileSystem,          // The file system for resolving folder contents
  onFileSystemChange,  // Callback when file system changes (for saving)
  onSystemFileSave,    // Callback when system file is saved (to refresh data)
  x,
  y,
  width,
  height,
  isMinimized,
  isMaximized,
  isActive,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onDragStart,
  onResizeStart,
}) {
  // Dynamic title for folder navigation
  const [displayTitle, setDisplayTitle] = useState(initialTitle);

  // Handle titlebar drag start
  const handleTitlebarMouseDown = (e) => {
    if (e.target.closest('.window-controls')) return;
    if (isMaximized) return;
    
    e.preventDefault();
    e.stopPropagation();
    onDragStart(id, e.clientX, e.clientY, x, y);
  };

  // Handle resize start
  const handleResizeMouseDown = (e) => {
    if (isMaximized) return;
    
    e.preventDefault();
    e.stopPropagation();
    onResizeStart(id, e.clientX, e.clientY, width, height);
  };

  const handleWindowMouseDown = (e) => {
    if (!e.target.closest('.window-titlebar') && !e.target.closest('.window-resize-handle')) {
      onFocus(id);
    }
  };

  // Handle title change from folder navigation
  const handleTitleChange = (newTitle) => {
    setDisplayTitle(newTitle);
  };

  // Determine content type if not explicitly set
  const resolvedContentType = contentType || (folderContents ? 'folder' : 'iframe');

  // Get the content component for this type
  const ContentComponent = getContentComponent(resolvedContentType);

  // Build class names
  const classNames = [
    'window',
    isMaximized ? 'maximized' : '',
    !isActive ? 'inactive' : '',
    isMinimized ? 'minimized' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classNames}
      style={{
        left: isMaximized ? 0 : x,
        top: isMaximized ? 0 : y,
        width: isMaximized ? '100vw' : width,
        height: isMaximized ? `calc(100vh - ${28 * uiSettings.scale}px)` : height,
        zIndex: isActive ? 100 : 10,
        // Hide window when minimized but keep it in DOM to preserve state
        display: isMinimized ? 'none' : undefined,
      }}
      onMouseDown={handleWindowMouseDown}
    >
      <div className="window-titlebar" onMouseDown={handleTitlebarMouseDown}>
        <div className="window-title">
          <img src={icon} alt="" className="window-title-icon" />
          <span>{displayTitle}</span>
        </div>
        <div className="window-controls">
          <button className="window-control-btn" onClick={() => onMinimize(id)} title="Minimize">
            <span>_</span>
          </button>
          <button className="window-control-btn" onClick={() => onMaximize(id)} title="Maximize">
            <span>□</span>
          </button>
          <button className="window-control-btn" onClick={() => onClose(id)} title="Close">
            <span>×</span>
          </button>
        </div>
      </div>
      <div className="window-content">
        <ContentComponent
          // Common props
          windowId={id}
          title={displayTitle}
          isActive={isActive}
          onFocus={onFocus}
          // Iframe props
          url={url}
          // Folder props
          folderContents={folderContents}
          folderId={folderId}
          onItemOpen={onItemOpen}
          onItemContextMenu={onItemContextMenu}
          // File system props
          fileSystem={fileSystem}
          onFileSystemChange={onFileSystemChange}
          onTitleChange={handleTitleChange}
          // Text file props
          textFileId={textFileId}
          initialContent={textFileContent}
          fileName={initialTitle}
          // System file props
          systemFileId={systemFileId}
          systemDataKey={systemDataKey}
          systemLanguage={systemLanguage}
          onSystemFileSave={onSystemFileSave}
        />
      </div>
      {!isMaximized && (
        <div 
          className="window-resize-handle" 
          onMouseDown={handleResizeMouseDown}
        />
      )}
    </div>
  );
}
