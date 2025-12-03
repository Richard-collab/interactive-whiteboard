import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Node,
  Edge,
  Connection,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
} from 'reactflow';
import {
  MindmapNode,
  MindmapEdge,
  HistoryState,
  ExportData,
  getNodeColor,
} from '../types';
import { defaultNodes, defaultEdges } from '../data/defaultMindmap';

const STORAGE_KEY = 'interactive-whiteboard-data';
const MAX_HISTORY_SIZE = 50;
const SAVE_DEBOUNCE_MS = 500;

// UI text constants
const UI_TEXT = {
  NEW_NODE_LABEL: '新节点',
  IMPORT_ERROR: '导入数据格式错误',
} as const;

export const useWhiteboard = () => {
  // Initialize state from localStorage or default data
  const initializeState = (): HistoryState => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        return {
          past: [],
          present: { nodes: parsed.nodes, edges: parsed.edges },
          future: [],
        };
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
    return {
      past: [],
      present: { nodes: defaultNodes, edges: defaultEdges },
      future: [],
    };
  };

  const [history, setHistory] = useState<HistoryState>(initializeState);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const isUpdatingRef = useRef(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { nodes, edges } = history.present;

  // Debounced save to localStorage whenever state changes
  useEffect(() => {
    if (!isUpdatingRef.current) {
      // Clear any pending save
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      // Schedule a new debounced save
      saveTimeoutRef.current = setTimeout(() => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(history.present));
        } catch (error) {
          console.error('Failed to save to localStorage:', error);
        }
      }, SAVE_DEBOUNCE_MS);
    }
    // Cleanup timeout on unmount or before next effect
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [history.present]);

  // Push current state to history for undo/redo
  const pushToHistory = useCallback((newState: { nodes: MindmapNode[]; edges: MindmapEdge[] }) => {
    setHistory((prev) => {
      const newPast = [...prev.past, prev.present].slice(-MAX_HISTORY_SIZE);
      return {
        past: newPast,
        present: newState,
        future: [],
      };
    });
  }, []);

  // Handle node changes (drag, select, etc.)
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const hasPositionChange = changes.some(
        (change) => change.type === 'position' && change.dragging === false
      );

      setHistory((prev) => {
        const newNodes = applyNodeChanges(changes, prev.present.nodes) as MindmapNode[];
        
        if (hasPositionChange) {
          const newPast = [...prev.past, prev.present].slice(-MAX_HISTORY_SIZE);
          return {
            past: newPast,
            present: { nodes: newNodes, edges: prev.present.edges },
            future: [],
          };
        }
        
        return {
          ...prev,
          present: { nodes: newNodes, edges: prev.present.edges },
        };
      });
    },
    []
  );

  // Handle edge changes
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setHistory((prev) => {
        const newEdges = applyEdgeChanges(changes, prev.present.edges) as MindmapEdge[];
        return {
          ...prev,
          present: { nodes: prev.present.nodes, edges: newEdges },
        };
      });
    },
    []
  );

  // Handle new connections
  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        const newEdge: MindmapEdge = {
          id: `e-${connection.source}-${connection.target}`,
          source: connection.source,
          target: connection.target,
          type: 'smoothstep',
          style: { stroke: '#64748b', strokeWidth: 2 },
        };
        
        setHistory((prev) => {
          const newEdges = addEdge(newEdge, prev.present.edges) as MindmapEdge[];
          const newPast = [...prev.past, prev.present].slice(-MAX_HISTORY_SIZE);
          return {
            past: newPast,
            present: { nodes: prev.present.nodes, edges: newEdges },
            future: [],
          };
        });
      }
    },
    []
  );

  // Update node label
  const updateNodeLabel = useCallback(
    (nodeId: string, newLabel: string) => {
      setHistory((prev) => {
        const newNodes = prev.present.nodes.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, label: newLabel } }
            : node
        );
        const newPast = [...prev.past, prev.present].slice(-MAX_HISTORY_SIZE);
        return {
          past: newPast,
          present: { nodes: newNodes, edges: prev.present.edges },
          future: [],
        };
      });
      setEditingNodeId(null);
    },
    []
  );

  // Delete a node and its connected edges
  const deleteNode = useCallback(
    (nodeId: string) => {
      setHistory((prev) => {
        const newNodes = prev.present.nodes.filter((node) => node.id !== nodeId);
        const newEdges = prev.present.edges.filter(
          (edge) => edge.source !== nodeId && edge.target !== nodeId
        );
        const newPast = [...prev.past, prev.present].slice(-MAX_HISTORY_SIZE);
        return {
          past: newPast,
          present: { nodes: newNodes, edges: newEdges },
          future: [],
        };
      });
    },
    []
  );

  // Add a new node
  const addNode = useCallback(
    (parentId?: string) => {
      const newNodeId = `node-${Date.now()}`;
      let newNode: MindmapNode;
      let newEdge: MindmapEdge | null = null;

      if (parentId) {
        const parentNode = nodes.find((n) => n.id === parentId);
        if (parentNode) {
          const level = parentNode.data.level + 1;
          newNode = {
            id: newNodeId,
            type: 'mindmapNode',
            position: {
              x: parentNode.position.x + 150,
              y: parentNode.position.y + 80,
            },
            data: {
              label: UI_TEXT.NEW_NODE_LABEL,
              level,
              color: getNodeColor(level),
            },
          };
          newEdge = {
            id: `e-${parentId}-${newNodeId}`,
            source: parentId,
            target: newNodeId,
            type: 'smoothstep',
            style: { stroke: '#64748b', strokeWidth: 2 },
          };
        } else {
          return;
        }
      } else {
        // Add root-level node
        const maxX = Math.max(...nodes.map((n) => n.position.x), 0);
        newNode = {
          id: newNodeId,
          type: 'mindmapNode',
          position: { x: maxX + 200, y: 180 },
          data: {
            label: UI_TEXT.NEW_NODE_LABEL,
            level: 1,
            color: getNodeColor(1),
          },
        };
        newEdge = {
          id: `e-root-${newNodeId}`,
          source: 'root',
          target: newNodeId,
          type: 'smoothstep',
          style: { stroke: '#64748b', strokeWidth: 2 },
        };
      }

      setHistory((prev) => {
        const newNodes = [...prev.present.nodes, newNode];
        const newEdges = newEdge
          ? [...prev.present.edges, newEdge]
          : prev.present.edges;
        const newPast = [...prev.past, prev.present].slice(-MAX_HISTORY_SIZE);
        return {
          past: newPast,
          present: { nodes: newNodes, edges: newEdges },
          future: [],
        };
      });

      // Start editing the new node
      setTimeout(() => setEditingNodeId(newNodeId), 100);
    },
    [nodes]
  );

  // Undo action
  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;
      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, -1);
      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future].slice(0, MAX_HISTORY_SIZE),
      };
    });
  }, []);

  // Redo action
  const redo = useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;
      const next = prev.future[0];
      const newFuture = prev.future.slice(1);
      return {
        past: [...prev.past, prev.present].slice(-MAX_HISTORY_SIZE),
        present: next,
        future: newFuture,
      };
    });
  }, []);

  // Export data to JSON
  const exportData = useCallback((): ExportData => {
    return {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      nodes: history.present.nodes,
      edges: history.present.edges,
    };
  }, [history.present]);

  // Import data from JSON
  const importData = useCallback((data: ExportData) => {
    try {
      if (data.nodes && data.edges) {
        isUpdatingRef.current = true;
        pushToHistory({ nodes: data.nodes, edges: data.edges });
        setTimeout(() => {
          isUpdatingRef.current = false;
        }, 100);
      }
    } catch (error) {
      console.error('Failed to import data:', error);
      throw new Error(UI_TEXT.IMPORT_ERROR);
    }
  }, [pushToHistory]);

  // Reset to default data
  const resetToDefault = useCallback(() => {
    pushToHistory({ nodes: defaultNodes, edges: defaultEdges });
  }, [pushToHistory]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if editing a node
      if (editingNodeId) return;

      if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
        event.preventDefault();
      }
      if ((event.ctrlKey || event.metaKey) && event.key === 'y') {
        redo();
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, editingNodeId]);

  return {
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
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    exportData,
    importData,
    resetToDefault,
    editingNodeId,
    setEditingNodeId,
  };
};
