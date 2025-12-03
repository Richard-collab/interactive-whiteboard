import React, { useRef } from 'react';
import './styles/whiteboard.css';

interface ToolbarProps {
  onAddNode: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onReset: () => void;
  onFitView: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onAddNode,
  onUndo,
  onRedo,
  onExport,
  onImport,
  onReset,
  onFitView,
  canUndo,
  canRedo,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      // Reset input value to allow importing the same file again
      e.target.value = '';
    }
  };

  return (
    <div className="toolbar">
      <div className="toolbar-group">
        <button
          onClick={onAddNode}
          className="toolbar-button"
          title="添加节点"
        >
          <span className="toolbar-icon">➕</span>
          <span className="toolbar-text">添加节点</span>
        </button>
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-group">
        <button
          onClick={onUndo}
          className="toolbar-button"
          disabled={!canUndo}
          title="撤销 (Ctrl+Z)"
        >
          <span className="toolbar-icon">↩️</span>
          <span className="toolbar-text">撤销</span>
        </button>
        <button
          onClick={onRedo}
          className="toolbar-button"
          disabled={!canRedo}
          title="重做 (Ctrl+Y)"
        >
          <span className="toolbar-icon">↪️</span>
          <span className="toolbar-text">重做</span>
        </button>
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-group">
        <button
          onClick={onFitView}
          className="toolbar-button"
          title="适应视图"
        >
          <span className="toolbar-icon">🔍</span>
          <span className="toolbar-text">适应视图</span>
        </button>
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-group">
        <button
          onClick={onExport}
          className="toolbar-button"
          title="导出 JSON"
        >
          <span className="toolbar-icon">📤</span>
          <span className="toolbar-text">导出</span>
        </button>
        <button
          onClick={handleImportClick}
          className="toolbar-button"
          title="导入 JSON"
        >
          <span className="toolbar-icon">📥</span>
          <span className="toolbar-text">导入</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-group">
        <button
          onClick={onReset}
          className="toolbar-button reset"
          title="重置为默认"
        >
          <span className="toolbar-icon">🔄</span>
          <span className="toolbar-text">重置</span>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
