import React from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import './ActionNode.less';

interface ActionNodeData {
  label: string;
  description?: string;
}

const ActionNode: React.FC<NodeProps<ActionNodeData>> = ({ data, isConnectable }) => {
  return (
    <div className="custom-node action-node">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
      <div className="node-content">
        <div className="node-icon">⚙️</div>
        <div className="node-label">{data.label}</div>
        {data.description && (
          <div className="node-description">{data.description}</div>
        )}
      </div>
    </div>
  );
};

export default ActionNode;
