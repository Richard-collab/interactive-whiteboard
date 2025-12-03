import { Node, Edge } from 'reactflow';

// Node data type for custom mind map nodes
export interface MindmapNodeData {
  label: string;
  level: number;
  color?: string;
}

// Custom node type
export type MindmapNode = Node<MindmapNodeData>;

// Custom edge type
export type MindmapEdge = Edge;

// State for the whiteboard hook
export interface WhiteboardState {
  nodes: MindmapNode[];
  edges: MindmapEdge[];
}

// History state for undo/redo
export interface HistoryState {
  past: WhiteboardState[];
  present: WhiteboardState;
  future: WhiteboardState[];
}

// Export data format
export interface ExportData {
  version: string;
  timestamp: string;
  nodes: MindmapNode[];
  edges: MindmapEdge[];
}

// Context menu position
export interface ContextMenuPosition {
  x: number;
  y: number;
  nodeId: string;
}

// Node level color mapping
export const NODE_COLORS: Record<number, string> = {
  0: '#6366f1', // Root - Indigo
  1: '#8b5cf6', // Level 1 - Violet
  2: '#a855f7', // Level 2 - Purple
  3: '#d946ef', // Level 3 - Fuchsia
  4: '#ec4899', // Level 4 - Pink
  5: '#f43f5e', // Level 5 - Rose
};

// Get color by node level
export const getNodeColor = (level: number): string => {
  return NODE_COLORS[level] || NODE_COLORS[5];
};
