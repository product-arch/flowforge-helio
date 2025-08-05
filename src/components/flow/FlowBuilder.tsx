import React, { useCallback, useMemo } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap,
  useReactFlow,
  Panel
} from '@xyflow/react';
import { useFlow } from '@/contexts/FlowContext';
import { NodePalette } from './NodePalette';
import { ConfigurationPanel } from './ConfigurationPanel';
import { SimulationPanel } from './SimulationPanel';
import { FlowNavbar } from './FlowNavbar';
import { StartNode } from './nodes/StartNode';
import { RoutingNode } from './nodes/RoutingNode';
import { ConstraintNode } from './nodes/ConstraintNode';
import { ConditionalNode } from './nodes/ConditionalNode';
import { TerminalNode } from './nodes/TerminalNode';
import { AuditNode } from './nodes/AuditNode';
import { CustomEdge } from './edges/CustomEdge';
import { ZoomControls } from './ZoomControls';

const nodeTypes = {
  start: StartNode,
  routing: RoutingNode,
  constraint: ConstraintNode,
  conditional: ConditionalNode,
  terminal: TerminalNode,
  audit: AuditNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

export const FlowBuilder: React.FC = () => {
  const { 
    nodes, 
    edges, 
    selectedNode,
    simulationMode,
    onNodesChange, 
    onEdgesChange, 
    onConnect,
    setSelectedNode
  } = useFlow();

  const { setViewport } = useReactFlow();

  const onNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    setSelectedNode(node);
  }, [setSelectedNode]);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  const defaultEdgeOptions = useMemo(() => ({
    type: 'custom',
    animated: simulationMode,
    style: { strokeWidth: 2 }
  }), [simulationMode]);

  return (
    <div className="h-screen w-full flex flex-col bg-background">
      <FlowNavbar />
      
      <div className="flex-1 flex overflow-hidden">
        <NodePalette />
        
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            defaultEdgeOptions={defaultEdgeOptions}
            fitView
            className="bg-flow-canvas"
            proOptions={{ hideAttribution: true }}
          >
            <Background 
              color="hsl(var(--flow-grid))" 
              gap={20} 
              size={1}
            />
            <Panel position="bottom-left">
              <MiniMap 
                nodeColor="hsl(var(--node-routing))"
                maskColor="rgba(0,0,0,0.1)"
                className="bg-card border border-border rounded-lg"
                style={{ backgroundColor: 'hsl(var(--card))' }}
              />
            </Panel>
            <Panel position="bottom-right">
              <ZoomControls />
            </Panel>
          </ReactFlow>
        </div>
        
        <ConfigurationPanel />
      </div>
      
      <SimulationPanel />
    </div>
  );
};