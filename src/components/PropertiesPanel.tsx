import useStore from '../store/useStore';
import { Trash2, Settings2 } from 'lucide-react';

const PropertiesPanel = () => {
  const { nodes, selectedNodeId, updateNodeLabel, deleteNode } = useStore();
  
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  if (!selectedNode) {
    return (
      <aside className="properties-panel">
        <div className="panel-header">
          <h2 className="panel-title">Properties</h2>
          <Settings2 size={18} color="var(--text-secondary)" />
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', marginTop: '2rem' }}>
          Select an element to view and edit its properties.
        </p>
      </aside>
    );
  }

  return (
    <aside className="properties-panel">
      <div className="panel-header">
        <h2 className="panel-title">Properties</h2>
        <Settings2 size={18} color="var(--accent-primary)" />
      </div>

      <div className="form-group">
        <label className="form-label">Element ID</label>
        <input className="form-input" value={selectedNode.id} disabled />
      </div>

      <div className="form-group">
        <label className="form-label">Label</label>
        <input
          className="form-input"
          value={selectedNode.data.label}
          onChange={(e) => updateNodeLabel(selectedNode.id, e.target.value)}
          placeholder="Enter label..."
          autoFocus
        />
      </div>

      <div className="form-group">
        <label className="form-label">Type</label>
        <input className="form-input" value={selectedNode.data.type.toUpperCase()} disabled />
      </div>

      <div style={{ marginTop: 'auto' }}>
        <button className="btn btn-danger" style={{ width: '100%' }} onClick={() => deleteNode(selectedNode.id)}>
          <Trash2 size={18} />
          Delete Element
        </button>
      </div>
    </aside>
  );
};

export default PropertiesPanel;
