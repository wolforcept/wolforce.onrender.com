import { useState, useRef, useEffect } from 'react';
import { gridSettings } from '../data/config';

export default function DesktopIcon({ 
  id, 
  label, 
  icon, 
  gridX, 
  gridY, 
  selected, 
  onSelect, 
  onDoubleClick, 
  onMove,
  onContextMenu,
  occupiedPositions // Array of {x, y} for all icons except this one
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [ghostPosition, setGhostPosition] = useState({ x: 0, y: 0 });
  const [previewGrid, setPreviewGrid] = useState({ x: gridX, y: gridY });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const iconRef = useRef(null);

  // Calculate pixel position from grid position
  const pixelX = gridX * gridSettings.cellWidth + gridSettings.padding;
  const pixelY = gridY * gridSettings.cellHeight + gridSettings.padding;

  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left click
    
    onSelect(id);
    
    const rect = iconRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    setDragOffset({ x: offsetX, y: offsetY });
    setGhostPosition({ x: e.clientX - offsetX, y: e.clientY - offsetY });
    setPreviewGrid({ x: gridX, y: gridY });
    setIsDragging(true);

    e.preventDefault();
  };

  // Check if a grid position is occupied
  const isPositionOccupied = (x, y) => {
    return occupiedPositions?.some(pos => pos.x === x && pos.y === y);
  };

  // Find nearest available grid position
  const findAvailablePosition = (targetX, targetY) => {
    // If target is available, use it
    if (!isPositionOccupied(targetX, targetY)) {
      return { x: targetX, y: targetY };
    }
    
    // Search in expanding squares for nearest available spot
    for (let radius = 1; radius < 20; radius++) {
      for (let dx = -radius; dx <= radius; dx++) {
        for (let dy = -radius; dy <= radius; dy++) {
          if (Math.abs(dx) === radius || Math.abs(dy) === radius) {
            const newX = Math.max(0, targetX + dx);
            const newY = Math.max(0, targetY + dy);
            if (!isPositionOccupied(newX, newY)) {
              return { x: newX, y: newY };
            }
          }
        }
      }
    }
    
    // Fallback to original position
    return { x: gridX, y: gridY };
  };

  // Attach global mouse events when dragging
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      // Update ghost position to follow mouse
      setGhostPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });

      // Calculate preview grid position
      const desktopRect = iconRef.current.parentElement.getBoundingClientRect();
      const newX = e.clientX - desktopRect.left - dragOffset.x;
      const newY = e.clientY - desktopRect.top - dragOffset.y;

      const newGridX = Math.max(0, Math.round((newX - gridSettings.padding) / gridSettings.cellWidth));
      const newGridY = Math.max(0, Math.round((newY - gridSettings.padding) / gridSettings.cellHeight));

      setPreviewGrid({ x: newGridX, y: newGridY });
    };

    const handleMouseUp = (e) => {
      // Calculate final grid position
      const desktopRect = iconRef.current.parentElement.getBoundingClientRect();
      const newX = e.clientX - desktopRect.left - dragOffset.x;
      const newY = e.clientY - desktopRect.top - dragOffset.y;

      const targetGridX = Math.max(0, Math.round((newX - gridSettings.padding) / gridSettings.cellWidth));
      const targetGridY = Math.max(0, Math.round((newY - gridSettings.padding) / gridSettings.cellHeight));

      // Find available position (handles collision)
      const availablePos = findAvailablePosition(targetGridX, targetGridY);
      
      // Only move if position changed
      if (availablePos.x !== gridX || availablePos.y !== gridY) {
        onMove(id, availablePos.x, availablePos.y);
      }
      
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, id, gridX, gridY, onMove, occupiedPositions]);

  // Calculate preview position pixels
  const previewPixelX = previewGrid.x * gridSettings.cellWidth + gridSettings.padding;
  const previewPixelY = previewGrid.y * gridSettings.cellHeight + gridSettings.padding;
  const isPreviewOccupied = isPositionOccupied(previewGrid.x, previewGrid.y);

  return (
    <>
      {/* Original icon stays in place */}
      <div
        ref={iconRef}
        className={`desktop-icon ${selected ? 'selected' : ''}`}
        style={{
          left: pixelX,
          top: pixelY,
          opacity: isDragging ? 0.5 : 1,
        }}
        onMouseDown={handleMouseDown}
        onDoubleClick={() => onDoubleClick(id)}
        onContextMenu={(e) => onContextMenu(id, e)}
      >
        <div className="desktop-icon-image-wrapper">
          <img src={icon} alt={label} className="desktop-icon-image" draggable={false} />
          <span className="shortcut-arrow">↗</span>
        </div>
        <span className="desktop-icon-label">{label}</span>
      </div>

      {/* Ghost image following mouse */}
      {isDragging && (
        <div
          className="desktop-icon selected"
          style={{
            position: 'fixed',
            left: ghostPosition.x,
            top: ghostPosition.y,
            opacity: 0.7,
            pointerEvents: 'none',
            zIndex: 10000,
          }}
        >
          <div className="desktop-icon-image-wrapper">
            <img src={icon} alt={label} className="desktop-icon-image" draggable={false} />
            <span className="shortcut-arrow">↗</span>
          </div>
          <span className="desktop-icon-label">{label}</span>
        </div>
      )}

      {/* Grid preview indicator - only show if position will change */}
      {isDragging && (previewGrid.x !== gridX || previewGrid.y !== gridY) && (
        <div
          className="desktop-icon-preview"
          style={{
            position: 'absolute',
            left: previewPixelX,
            top: previewPixelY,
            width: gridSettings.cellWidth - 4,
            height: gridSettings.cellHeight - 4,
            border: `2px dashed ${isPreviewOccupied ? '#ff0000' : '#ffffff'}`,
            borderRadius: 2,
            pointerEvents: 'none',
            zIndex: 999,
            backgroundColor: isPreviewOccupied ? 'rgba(255, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)',
          }}
        />
      )}
    </>
  );
}
