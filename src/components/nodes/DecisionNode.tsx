import React from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import './DecisionNode.less';

interface DecisionNodeData {
  label: string;
  condition?: string;
}

const DecisionNode: React.FC<NodeProps<DecisionNodeData>> = ({ data, isConnectable }) => {
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
        <div className="node-label">{data.label}</div>
        {data.condition && (
          <div className="node-condition">{data.condition}</div>
        )}
      </div>
    </div>
  );
};

export default DecisionNode;
