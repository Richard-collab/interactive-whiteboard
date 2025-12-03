import React, { useCallback, useMemo, useRef } from 'react';
import ReactFlow, {
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  ReactFlowProvider,
  ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';

import MindmapNode from './MindmapNode';
import Toolbar from './Toolbar';
import { useWhiteboard } from '../hooks/useWhiteboard';
import { ExportData, MindmapNodeData } from '../types';
import './styles/whiteboard.css';

const Whiteboard: React.FC = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    updateNodeLabel,
    deleteNode,
    addNode,
    undo,
    redo,
    canUndo,
    canRedo,
    exportData,
    importData,
    resetToDefault,
    editingNodeId,
    setEditingNodeId,
  } = useWhiteboard();

  const reactFlowRef = useRef<ReactFlowInstance | null>(null);

  // Create custom node types with callbacks
  const nodeTypes = useMemo(
    () => ({
      mindmapNode: (props: any) => (
        <MindmapNode
          {...props}
          onLabelChange={updateNodeLabel}
          onDelete={deleteNode}
          onAddChild={addNode}
          isEditing={editingNodeId === props.id}
          onStartEdit={setEditingNodeId}
          onStopEdit={() => setEditingNodeId(null)}
        />
      ),
    }),
    [updateNodeLabel, deleteNode, addNode, editingNodeId, setEditingNodeId]
  );

  // Handle export
  const handleExport = useCallback(() => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindmap-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [exportData]);

  // Handle import
  const handleImport = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data: ExportData = JSON.parse(content);
          importData(data);
        } catch (error) {
          alert('导入失败：文件格式不正确');
        }
      };
      reader.readAsText(file);
    },
    [importData]
  );

  // Handle reset
  const handleReset = useCallback(() => {
    if (window.confirm('确定要重置为默认思维导图吗？当前更改将丢失。')) {
      resetToDefault();
    }
  }, [resetToDefault]);

  // Handle fit view
  const handleFitView = useCallback(() => {
    reactFlowRef.current?.fitView({ padding: 0.2 });
  }, []);

  // Mini map node color
  const nodeColor = useCallback((node: { data: MindmapNodeData }) => {
    return node.data.color || '#6366f1';
  }, []);

  // Handle React Flow initialization
  const onInit = useCallback((instance: ReactFlowInstance) => {
    reactFlowRef.current = instance;
    instance.fitView({ padding: 0.2 });
  }, []);

  return (
    <div className="whiteboard-container">
      <div className="whiteboard-wrapper">
        <Toolbar
          onAddNode={() => addNode()}
          onUndo={undo}
          onRedo={redo}
          onExport={handleExport}
          onImport={handleImport}
          onReset={handleReset}
          onFitView={handleFitView}
          canUndo={canUndo}
          canRedo={canRedo}
        />
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={onInit}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.1}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
          proOptions={{ hideAttribution: true }}
        >
          <Controls showInteractive={false} />
          <MiniMap
            nodeColor={nodeColor}
            nodeStrokeWidth={3}
            zoomable
            pannable
          />
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        </ReactFlow>
        <div className="help-text">
          双击节点编辑 | 右键节点查看菜单 | 拖拽移动 | 滚轮缩放
        </div>
      </div>
    </div>
  );
};

// Wrap with ReactFlowProvider
const WhiteboardWithProvider: React.FC = () => (
  <ReactFlowProvider>
    <Whiteboard />
  </ReactFlowProvider>
);

export default WhiteboardWithProvider;
