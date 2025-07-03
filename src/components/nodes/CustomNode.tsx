import React from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import './CustomNode.less';

interface CustomNodeData {
  label: string;
  description?: string;
}

const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data, isConnectable }) => {
  return (
    <div className="custom-node start-node">
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
      <div className="node-content">
        <div className="node-icon">🚀</div>
        <div className="node-label">{data.label}</div>
        {data.description && (
          <div className="node-description">{data.description}</div>
        )}
      </div>
    </div>
  );
};

export default CustomNode;
