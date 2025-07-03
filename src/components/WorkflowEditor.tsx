import React, { useCallback, useMemo, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  useReactFlow,
} from 'reactflow';
import type { Connection, Edge, Node } from 'reactflow';
import 'reactflow/dist/style.css';
import './WorkflowEditor.less';

// Define custom node types
import CustomNode from './nodes/CustomNode';
import DecisionNode from './nodes/DecisionNode';
import ActionNode from './nodes/ActionNode';
import NodePalette from './NodePalette';

// Initial nodes for the workflow
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'start',
    position: { x: 250, y: 25 },
    data: { label: 'Start' },
  },
  {
    id: '2',
    type: 'action',
    position: { x: 100, y: 125 },
    data: { label: 'Process Data', description: 'Initial data processing step' },
  },
  {
    id: '3',
    type: 'decision',
    position: { x: 400, y: 125 },
    data: { label: 'Valid Data?', condition: 'data.isValid === true' },
  },
  {
    id: '4',
    type: 'action',
    position: { x: 250, y: 250 },
    data: { label: 'Save Results', description: 'Save processed data to database' },
  },
  {
    id: '5',
    type: 'action',
    position: { x: 500, y: 250 },
    data: { label: 'Handle Error', description: 'Log error and notify user' },
  },
];

// Initial edges connecting the nodes
const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4', label: 'Yes', type: 'smoothstep' },
  { id: 'e3-5', source: '3', target: '5', label: 'No', type: 'smoothstep' },
];

// Workflow Editor Flow Component (needs to be inside ReactFlowProvider)
const WorkflowEditorFlow: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // Define custom node types
  const nodeTypes = useMemo(
    () => ({
      start: CustomNode,
      action: ActionNode,
      decision: DecisionNode,
    }),
    [],
  );

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    console.log('Node clicked:', node);
    // Here you can implement node editing functionality
  }, []);

  const onEdgeClick = useCallback((_event: React.MouseEvent, edge: Edge) => {
    console.log('Edge clicked:', edge);
    // Here you can implement edge editing functionality
  }, []);

  // Drag and drop functionality
  const onDragStart = useCallback((event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes],
  );

  return (
    <div className="workflow-editor">
      <div className="workflow-header">
        <h2>Workflow Editor</h2>
        <div className="workflow-controls">
          <button className="btn-primary">
            Save Workflow
          </button>
          <button className="btn-secondary">
            Export
          </button>
          <button className="btn-secondary">
            Import
          </button>
        </div>
      </div>
      
      <div className="workflow-content">
        <NodePalette onDragStart={onDragStart} />
        
        <div 
          className="workflow-canvas"
          ref={reactFlowWrapper}
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-left"
          >
            <Controls />
            <MiniMap 
              nodeColor={(node) => {
                switch (node.type) {
                  case 'start': return '#646cff';
                  case 'action': return '#42b883';
                  case 'decision': return '#ff6b6b';
                  default: return '#eee';
                }
              }}
              nodeStrokeWidth={3}
              zoomable
              pannable
            />
            <Background 
              variant={BackgroundVariant.Dots} 
              gap={20} 
              size={1}
              color="#333"
            />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

// Main WorkflowEditor component with ReactFlowProvider
const WorkflowEditor: React.FC = () => {
  return (
    <ReactFlowProvider>
      <WorkflowEditorFlow />
    </ReactFlowProvider>
  );
};

export default WorkflowEditor;
