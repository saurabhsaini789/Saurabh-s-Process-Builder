import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { BPMNNodeData } from '../store/useStore';

export const StartNode = memo(({ data, selected }: NodeProps<BPMNNodeData>) => {
  return (
    <div className={`custom-node event-node start-event ${selected ? 'selected' : ''}`}>
      <Handle type="source" position={Position.Right} />
      <div className="node-label">{data.label || 'Start'}</div>
    </div>
  );
});

export const EndNode = memo(({ data, selected }: NodeProps<BPMNNodeData>) => {
  return (
    <div className={`custom-node event-node end-event ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Left} />
      <div className="node-label">{data.label || 'End'}</div>
    </div>
  );
});

export const TaskNode = memo(({ data, selected }: NodeProps<BPMNNodeData>) => {
  return (
    <div className={`custom-node task-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Left} />
      <div className="node-label">{data.label || 'Task'}</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
});

export const GatewayNode = memo(({ data, selected }: NodeProps<BPMNNodeData>) => {
  return (
    <div className={`custom-node gateway-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Top} style={{ top: 0 }} />
      <Handle type="target" position={Position.Left} style={{ left: 0 }} />
      <div className="gateway-content">
        <div className="node-label">{data.label || 'X'}</div>
      </div>
      <Handle type="source" position={Position.Right} style={{ right: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ bottom: 0 }} />
    </div>
  );
});

export const PoolNode = memo(({ data, selected }: NodeProps<BPMNNodeData>) => {
  return (
    <div className={`custom-node pool-node ${selected ? 'selected' : ''}`}>
      <div className="pool-header">{data.label || 'Pool'}</div>
      <div style={{ height: '100%', width: '100%' }}>
        {/* React Flow handles children automatically if properly configured */}
      </div>
    </div>
  );
});
