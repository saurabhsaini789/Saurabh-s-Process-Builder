import { create } from 'zustand';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import type {
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from 'reactflow';

export type BPMNNodeType = 'start' | 'end' | 'task' | 'gateway' | 'pool' | 'lane';

export interface BPMNNodeData {
  label: string;
  type: BPMNNodeType;
}

interface DiagramState {
  nodes: Node<BPMNNodeData>[];
  edges: Edge[];
  selectedNodeId: string | null;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: Node) => void;
  updateNodeLabel: (id: string, label: string) => void;
  deleteNode: (id: string) => void;
  setSelectedNode: (id: string | null) => void;
  setEdges: (edges: Edge[]) => void;
  setNodes: (nodes: Node[]) => void;
}

const useStore = create<DiagramState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,

  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection: any) => {
    set({
      edges: addEdge({ ...connection, type: 'smoothstep', animated: true }, get().edges),
    });
  },

  addNode: (node: Node) => {
    set({
      nodes: [...get().nodes, node],
    });
  },

  updateNodeLabel: (id: string, label: string) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, label } };
        }
        return node;
      }),
    });
  },

  deleteNode: (id: string) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== id),
      edges: get().edges.filter((edge) => edge.source !== id && edge.target !== id),
      selectedNodeId: get().selectedNodeId === id ? null : get().selectedNodeId,
    });
  },

  setSelectedNode: (id: string | null) => {
    set({ selectedNodeId: id });
  },

  setEdges: (edges: Edge[]) => {
    set({ edges });
  },

  setNodes: (nodes: Node[]) => {
    set({ nodes });
  },
}));

export default useStore;
