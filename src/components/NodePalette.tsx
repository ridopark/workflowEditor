import React from 'react';
import './NodePalette.less';

interface NodePaletteProps {
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
}

const NodePalette: React.FC<NodePaletteProps> = ({ onDragStart }) => {
  const nodeTypes = [
    {
      type: 'start',
      label: 'Start',
      icon: '🚀',
      description: 'Begin workflow'
    },
    {
      type: 'action',
      label: 'Action',
      icon: '⚙️',
      description: 'Execute task'
    },
    {
      type: 'decision',
      label: 'Decision',
      icon: '🤔',
      description: 'Conditional branch'
    },
    {
      type: 'end',
      label: 'End',
      icon: '🏁',
      description: 'Complete workflow'
    }
  ];

  return (
    <div className="node-palette">
      <h3>Node Palette</h3>
      <p className="palette-description">
        Drag nodes to the canvas to build your workflow
      </p>
      
      <div className="node-list">
        {nodeTypes.map((node) => (
          <div
            key={node.type}
            className="palette-node"
            draggable
            onDragStart={(event) => onDragStart(event, node.type)}
          >
            <div className="palette-node-icon">{node.icon}</div>
            <div className="palette-node-content">
              <div className="palette-node-label">{node.label}</div>
              <div className="palette-node-description">{node.description}</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="palette-tips">
        <h4>💡 Tips</h4>
        <ul>
          <li>Drag nodes from palette to canvas</li>
          <li>Connect nodes by dragging from handles</li>
          <li>Click nodes to edit properties</li>
          <li>Use scroll wheel to zoom</li>
        </ul>
      </div>
    </div>
  );
};

export default NodePalette;
