import React from 'react';
import { Circle, Square, Diamond, Layout } from 'lucide-react';
import type { BPMNNodeType } from '../store/useStore';

const Sidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: BPMNNodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">Saurabh's</h1>
        <p className="sidebar-subtitle">Process Builder</p>
      </div>

      <div className="palette-section">
        <span className="palette-label">Events</span>
        <div
          className="dndnode"
          onDragStart={(event) => onDragStart(event, 'start')}
          draggable
        >
          <div className="dndnode-icon" style={{ color: 'var(--color-event)' }}>
            <Circle size={20} />
          </div>
          Start Event
        </div>
        <div
          className="dndnode"
          onDragStart={(event) => onDragStart(event, 'end')}
          draggable
        >
          <div className="dndnode-icon" style={{ color: '#ef4444' }}>
            <Circle size={20} strokeWidth={3} />
          </div>
          End Event
        </div>
      </div>

      <div className="palette-section">
        <span className="palette-label">Activities</span>
        <div
          className="dndnode"
          onDragStart={(event) => onDragStart(event, 'task')}
          draggable
        >
          <div className="dndnode-icon" style={{ color: 'var(--color-task)' }}>
            <Square size={20} />
          </div>
          Task
        </div>
      </div>

      <div className="palette-section">
        <span className="palette-label">Gateways</span>
        <div
          className="dndnode"
          onDragStart={(event) => onDragStart(event, 'gateway')}
          draggable
        >
          <div className="dndnode-icon" style={{ color: 'var(--color-gateway)' }}>
            <Diamond size={20} />
          </div>
          Exclusive Gateway
        </div>
      </div>

      <div className="palette-section">
        <span className="palette-label">Layout</span>
        <div
          className="dndnode"
          onDragStart={(event) => onDragStart(event, 'pool')}
          draggable
        >
          <div className="dndnode-icon">
            <Layout size={20} />
          </div>
          Pool / Lane
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
