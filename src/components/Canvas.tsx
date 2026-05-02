import React, { useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import useStore from '../store/useStore';
import type { BPMNNodeType } from '../store/useStore';
import { StartNode, EndNode, TaskNode, GatewayNode, PoolNode } from './CustomNodes';
import Toolbar from './Toolbar';
import { AlertCircle } from 'lucide-react';

const nodeTypes = {
  start: StartNode,
  end: EndNode,
  task: TaskNode,
  gateway: GatewayNode,
  pool: PoolNode,
};

const Canvas = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    setSelectedNode,
  } = useStore();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow') as BPMNNodeType;

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode = {
        id: `${type}_${Date.now()}`,
        type,
        position,
        data: { label: `${type.charAt(0).toUpperCase() + type.slice(1)}`, type },
      };

      addNode(newNode);
    },
    [addNode]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: any) => {
    setSelectedNode(node.id);
  }, [setSelectedNode]);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  // Validation Logic
  const hasStart = nodes.some(n => n.type === 'start');
  const hasEnd = nodes.some(n => n.type === 'end');
  const unconnectedNodes = nodes.filter(n => 
    !edges.some(e => e.source === n.id || e.target === n.id)
  );

  return (
    <div className="canvas-container" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={() => console.log('flow loaded')}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background color="var(--glass-border)" gap={20} />
        <Controls />
        <MiniMap />
        <Toolbar />
        
        <Panel position="top-left">
          {( !hasStart || !hasEnd || unconnectedNodes.length > 0) && nodes.length > 0 && (
            <div className="validation-toast">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                <AlertCircle size={18} />
                Diagram Warnings
              </div>
              <ul style={{ fontSize: '0.8rem', paddingLeft: '1.2rem' }}>
                {!hasStart && <li>Missing Start Event</li>}
                {!hasEnd && <li>Missing End Event</li>}
                {unconnectedNodes.length > 0 && <li>{unconnectedNodes.length} unconnected elements</li>}
              </ul>
            </div>
          )}
        </Panel>
      </ReactFlow>
    </div>
  );
};

const CanvasWrapper = () => (
  <ReactFlowProvider>
    <Canvas />
  </ReactFlowProvider>
);

export default CanvasWrapper;
