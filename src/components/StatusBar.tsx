import React from 'react';
import './StatusBar.less';

interface StatusBarProps {
  nodeCount: number;
  edgeCount: number;
  selectedNodes: number;
  selectedEdges: number;
  canUndo?: boolean;
  canRedo?: boolean;
  historyPosition?: string;
}

const StatusBar: React.FC<StatusBarProps> = ({
  nodeCount,
  edgeCount,
  selectedNodes,
  selectedEdges,
  canUndo,
  canRedo,
  historyPosition
}) => {
  return (
    <div className="status-bar">
      <div className="status-section">
        <span className="status-item">
          <span className="status-label">Nodes:</span>
          <span className="status-value">{nodeCount}</span>
        </span>
        <span className="status-item">
          <span className="status-label">Edges:</span>
          <span className="status-value">{edgeCount}</span>
        </span>
      </div>
      
      {(selectedNodes > 0 || selectedEdges > 0) && (
        <div className="status-section">
          <span className="status-item selected">
            <span className="status-label">Selected:</span>
            <span className="status-value">
              {selectedNodes > 0 && `${selectedNodes} node${selectedNodes > 1 ? 's' : ''}`}
              {selectedNodes > 0 && selectedEdges > 0 && ', '}
              {selectedEdges > 0 && `${selectedEdges} edge${selectedEdges > 1 ? 's' : ''}`}
            </span>
          </span>
        </div>
      )}
      
      {historyPosition && (
        <div className="status-section">
          <span className="status-item">
            <span className="status-label">History:</span>
            <span className="status-value">{historyPosition}</span>
          </span>
          <div className="status-indicators">
            <span className={`status-indicator ${canUndo ? 'active' : 'inactive'}`} title="Can Undo">
              ↶
            </span>
            <span className={`status-indicator ${canRedo ? 'active' : 'inactive'}`} title="Can Redo">
              ↷
            </span>
          </div>
        </div>
      )}
      
      <div className="status-section">
        <span className="status-item">
          <span className="status-label">Workflow Editor</span>
          <span className="status-dot"></span>
        </span>
      </div>
    </div>
  );
};

export default StatusBar;
