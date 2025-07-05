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
} from '@xyflow/react';
import type { Connection, Edge, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './WorkflowEditor.less';

// Define custom node types
import CustomNode from './nodes/CustomNode';
import DecisionNode from './nodes/DecisionNode';
import ActionNode from './nodes/ActionNode';
import NodePalette from './NodePalette';
import StatusBar from './StatusBar';

// Import custom hooks
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useUndoRedo } from '../hooks/useUndoRedo';

// Define custom node types outside of component to avoid React Flow warnings
const nodeTypes = {
  start: CustomNode,
  action: ActionNode,
  decision: DecisionNode,
};

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
  { id: 'e3-4', source: '3', target: '4', sourceHandle: 'yes', label: 'Yes', type: 'smoothstep' },
  { id: 'e3-5', source: '3', target: '5', sourceHandle: 'no', label: 'No', type: 'smoothstep' },
];

// Workflow Editor Flow Component (needs to be inside ReactFlowProvider)
const WorkflowEditorFlow: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  
  // Track if the component has been initialized to prevent early undo/redo interference
  const isInitializedRef = useRef(false);

  // Use standard React Flow state management
  const [nodes, setNodes, onNodesChangeBase] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChangeBase] = useEdgesState(initialEdges);

  // Undo/Redo functionality
  const { takeSnapshot, undo, redo, canUndo, canRedo, historySize, currentIndex } = useUndoRedo();

  // Hash-based change detection - logs when workflow changes but waits for drag to end
  const workflowHash = useMemo(() => {
    if (!nodes || !edges) return null;

    // Check if any node is currently being dragged
    const isDragging = nodes.some(node => node.dragging === true);
    
    // If dragging, return previous hash without logging
    if (isDragging) {
      return 'dragging'; // Return a placeholder to prevent logging during drag
    }

    // Create a structural fingerprint including positions (after drag ends)
    const structure = {
      nodeStructure: nodes.map(n => ({ 
        id: n.id, 
        type: n.type,
        x: Math.round(n.position.x), // Include position but rounded
        y: Math.round(n.position.y)
      })).sort((a, b) => a.id.localeCompare(b.id)),
      edgeStructure: edges.map(e => ({ 
        id: e.id, 
        source: e.source, 
        target: e.target 
      })).sort((a, b) => a.id.localeCompare(b.id))
    };

    // Create hash of the structure
    const structureString = JSON.stringify(structure);
    const hash = btoa(structureString).slice(0, 16); // Short hash for efficiency

    // Only log when hash changes (structure changed) and not dragging
    const workflow = {
      timestamp: new Date().toISOString(),
      hash,
      summary: {
        nodeTypes: nodes.reduce((acc, node) => {
          acc[node.type || 'default'] = (acc[node.type || 'default'] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        connections: edges.map(edge => `${edge.source} → ${edge.target}`),
        nodeCount: nodes.length,
        edgeCount: edges.length
      },
      nodes,
      edges
    };

    console.group('🔄 Workflow Structure Changed');
    console.log('🔑 Hash:', hash);
    console.log('📊 Summary:', workflow.summary);
    console.groupEnd();

    // Take snapshot for undo/redo
    takeSnapshot(nodes, edges);

    return hash;
  }, [
    // Include positions but useMemo will skip logging during drag
    nodes.length,
    edges.length,
    JSON.stringify(nodes.map(n => ({ 
      id: n.id, 
      type: n.type, 
      x: Math.round(n.position.x), 
      y: Math.round(n.position.y),
      dragging: n.dragging 
    }))),
    JSON.stringify(edges.map(e => ({ id: e.id, source: e.source, target: e.target })))
  ]);

  // Explicitly use workflowHash to suppress "unused variable" warning
  void workflowHash;

  const handleConnect = useCallback((params: Connection) => {
    console.log('➕ New Connection:', params);
    const newEdges = addEdge(params, edges);
    setEdges(newEdges);
  }, [edges, setEdges]);

  // Undo/Redo handlers
  const handleUndo = useCallback(() => {
    const previousState = undo();
    if (previousState) {
      setNodes(previousState.nodes);
      setEdges(previousState.edges);
    }
  }, [undo, setNodes, setEdges]);

  const handleRedo = useCallback(() => {
    const nextState = redo();
    if (nextState) {
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
    }
  }, [redo, setNodes, setEdges]);

  // Save workflow handler
  const handleSave = useCallback(() => {
    const workflow = { nodes, edges };
    console.log('Saving workflow:', workflow);
    // Here you can implement actual save functionality
    alert('Workflow saved! (Check console for details)');
  }, [nodes, edges]);

  // Delete selected nodes/edges
  const handleDelete = useCallback(() => {
    const selectedNodes = nodes.filter(node => node.selected);
    const selectedEdges = edges.filter(edge => edge.selected);
    
    if (selectedNodes.length > 0 || selectedEdges.length > 0) {
      console.log('🗑️ Deleting:', { 
        nodes: selectedNodes.map(n => ({ id: n.id, type: n.type, label: n.data.label })),
        edges: selectedEdges.map(e => ({ id: e.id, source: e.source, target: e.target }))
      });
      
      const newNodes = nodes.filter(node => !node.selected);
      const newEdges = edges.filter(edge => !edge.selected);
      
      setNodes(newNodes);
      setEdges(newEdges);
    }
  }, [nodes, edges, setNodes, setEdges]);

  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    onUndo: handleUndo,
    onRedo: handleRedo,
    onSave: handleSave,
    onDelete: handleDelete,
  });

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    console.log('Node clicked:', node);
    // Here you can implement node editing functionality
  }, []);

  const onEdgeClick = useCallback((_event: React.MouseEvent, edge: Edge) => {
    console.log('Edge clicked:', edge);
    // Here you can implement edge editing functionality
  }, []);

  // ReactFlow initialization handler
  const onInit = useCallback(() => {
    // Mark as initialized for any future functionality
    isInitializedRef.current = true;
    console.log('✅ Workflow Editor Initialized');
  }, []);

  // Calculate selected items count
  const selectedNodesCount = useMemo(() => 
    nodes.filter(node => node.selected).length, [nodes]
  );
  
  const selectedEdgesCount = useMemo(() => 
    edges.filter(edge => edge.selected).length, [edges]
  );

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
        data: { 
          label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
          ...(type === 'action' ? { description: 'New action step' } : {}),
          ...(type === 'decision' ? { condition: 'condition here' } : {})
        },
      };

      const newNodes = [...nodes, newNode];
      setNodes(newNodes);
      
      console.log('🎯 New node dropped:', { id: newNode.id, type: newNode.type, position: newNode.position });
    },
    [screenToFlowPosition, setNodes, nodes, edges],
  );

  return (
    <div className="workflow-editor">
      <div className="workflow-header">
        <h2>Workflow Editor</h2>
        <div className="workflow-controls">
          <div className="control-group">
            <button 
              className={`btn-icon ${!canUndo ? 'disabled' : ''}`}
              onClick={handleUndo}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
            >
              ↶
            </button>
            <button 
              className={`btn-icon ${!canRedo ? 'disabled' : ''}`}
              onClick={handleRedo}
              disabled={!canRedo}
              title="Redo (Ctrl+Y)"
            >
              ↷
            </button>
            <span className="history-info">
              {currentIndex + 1}/{historySize}
            </span>
          </div>
          <div className="control-group">
            <button className="btn-primary" onClick={handleSave} title="Save (Ctrl+S)">
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
            onNodesChange={onNodesChangeBase}
            onEdgesChange={onEdgesChangeBase}
            onConnect={handleConnect}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            onInit={onInit}
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
      
      <StatusBar 
        nodeCount={nodes.length}
        edgeCount={edges.length}
        selectedNodes={selectedNodesCount}
        selectedEdges={selectedEdgesCount}
        canUndo={canUndo}
        canRedo={canRedo}
        historyPosition={`${currentIndex + 1}/${historySize}`}
      />
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
