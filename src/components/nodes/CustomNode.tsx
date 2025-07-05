import React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import './CustomNode.less';

interface CustomNodeData {
  label: string;
  description?: string;
}

const CustomNode: React.FC<NodeProps> = ({ data, isConnectable }) => {
  // Type guard for data
  const nodeData = data as unknown as CustomNodeData;
  
  return (
    <div className="custom-node start-node">
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
      <div className="node-content">
        <div className="node-icon">🚀</div>
        <div className="node-label">{nodeData.label}</div>
        {nodeData.description && (
          <div className="node-description">{nodeData.description}</div>
        )}
      </div>
    </div>
  );
};

export default CustomNode;
