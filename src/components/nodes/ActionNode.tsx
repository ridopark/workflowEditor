import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import './ActionNode.less';

interface ActionNodeData {
  label: string;
  description?: string;
}

const ActionNode: React.FC<NodeProps> = ({ data, isConnectable }) => {
  // Type guard for data
  const nodeData = data as unknown as ActionNodeData;
  
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
        <div className="node-label">{nodeData.label}</div>
        {nodeData.description && (
          <div className="node-description">{nodeData.description}</div>
        )}
      </div>
    </div>
  );
};

export default ActionNode;
