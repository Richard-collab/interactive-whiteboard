import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { MindmapNodeData } from '../types';
import './styles/whiteboard.css';

interface MindmapNodeProps extends NodeProps<MindmapNodeData> {
  onLabelChange?: (id: string, label: string) => void;
  onDelete?: (id: string) => void;
  onAddChild?: (id: string) => void;
  isEditing?: boolean;
  onStartEdit?: (id: string) => void;
  onStopEdit?: () => void;
}

const MindmapNode: React.FC<MindmapNodeProps> = ({
  id,
  data,
  selected,
  onLabelChange,
  onDelete,
  onAddChild,
  isEditing,
  onStartEdit,
  onStopEdit,
}) => {
  const [localLabel, setLocalLabel] = useState(data.label);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);

  const { level, color } = data;
  const isRoot = level === 0;

  // Update local label when data changes
  useEffect(() => {
    setLocalLabel(data.label);
  }, [data.label]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (nodeRef.current && !nodeRef.current.contains(event.target as Node)) {
        setShowContextMenu(false);
      }
    };

    if (showContextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showContextMenu]);

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onStartEdit?.(id);
    },
    [id, onStartEdit]
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setContextMenuPos({ x: e.clientX, y: e.clientY });
      setShowContextMenu(true);
    },
    []
  );

  const handleLabelChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalLabel(e.target.value);
  }, []);

  const handleLabelSubmit = useCallback(() => {
    if (localLabel.trim()) {
      onLabelChange?.(id, localLabel.trim());
    } else {
      setLocalLabel(data.label);
    }
    onStopEdit?.();
  }, [id, localLabel, data.label, onLabelChange, onStopEdit]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleLabelSubmit();
      } else if (e.key === 'Escape') {
        setLocalLabel(data.label);
        onStopEdit?.();
      }
    },
    [handleLabelSubmit, data.label, onStopEdit]
  );

  const handleDelete = useCallback(() => {
    setShowContextMenu(false);
    onDelete?.(id);
  }, [id, onDelete]);

  const handleAddChild = useCallback(() => {
    setShowContextMenu(false);
    onAddChild?.(id);
  }, [id, onAddChild]);

  // Calculate styles based on level
  const nodeStyle: React.CSSProperties = {
    backgroundColor: color || '#6366f1',
    padding: isRoot ? '16px 24px' : level === 1 ? '12px 20px' : '8px 16px',
    fontSize: isRoot ? '18px' : level === 1 ? '14px' : '12px',
    fontWeight: isRoot ? 700 : level === 1 ? 600 : 500,
    borderRadius: isRoot ? '12px' : '8px',
    boxShadow: selected
      ? `0 0 0 2px ${color}, 0 4px 12px rgba(0, 0, 0, 0.15)`
      : '0 2px 8px rgba(0, 0, 0, 0.1)',
    minWidth: isRoot ? '200px' : level === 1 ? '120px' : '80px',
  };

  return (
    <div
      ref={nodeRef}
      className="mindmap-node"
      style={nodeStyle}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
    >
      {/* Input handles */}
      {!isRoot && (
        <Handle
          type="target"
          position={Position.Top}
          className="node-handle"
          style={{ background: color }}
        />
      )}

      {/* Node content */}
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={localLabel}
          onChange={handleLabelChange}
          onBlur={handleLabelSubmit}
          onKeyDown={handleKeyDown}
          className="node-input"
          style={{
            fontSize: 'inherit',
            fontWeight: 'inherit',
          }}
        />
      ) : (
        <span className="node-label">{data.label}</span>
      )}

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="node-handle"
        style={{ background: color }}
      />

      {/* Context menu */}
      {showContextMenu && (
        <div
          className="context-menu"
          style={{
            position: 'fixed',
            left: contextMenuPos.x,
            top: contextMenuPos.y,
          }}
        >
          <button onClick={handleAddChild} className="context-menu-item">
            <span className="context-menu-icon">➕</span>
            添加子节点
          </button>
          {!isRoot && (
            <button onClick={handleDelete} className="context-menu-item delete">
              <span className="context-menu-icon">🗑️</span>
              删除节点
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MindmapNode;
