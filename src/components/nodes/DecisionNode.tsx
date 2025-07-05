import React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import './DecisionNode.less';

interface DecisionNodeData {
  label: string;
  condition?: string;
}

const DecisionNode: React.FC<NodeProps> = ({ data, isConnectable }) => {
  // Type guard for data
  const nodeData = data as unknown as DecisionNodeData;
  
  return (
    <div className="custom-node decision-node">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="yes"
        style={{ left: '25%' }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="no"
        style={{ left: '75%' }}
        isConnectable={isConnectable}
      />
      <div className="node-content">
        <div className="node-icon">🤔</div>
        <div className="node-label">{nodeData.label}</div>
        {nodeData.condition && (
          <div className="node-condition">{nodeData.condition}</div>
        )}
      </div>
    </div>
  );
};

export default DecisionNode;
