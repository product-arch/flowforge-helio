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
import { ConfigurationModal } from './ConfigurationModal';
import { SimulationPanel } from './SimulationPanel';
import { FlowNavbar } from './FlowNavbar';
import { StartNode } from './nodes/StartNode';
import { TerminalNode } from './nodes/TerminalNode';
import { LeastCostNode } from './nodes/LeastCostNode';
import { WeightedSplitNode } from './nodes/WeightedSplitNode';
import { FallbackNode } from './nodes/FallbackNode';
import { SMSNode } from './nodes/SMSNode';
import { WhatsAppNode } from './nodes/WhatsAppNode';
import { EmailNode } from './nodes/EmailNode';
import { VoiceNode } from './nodes/VoiceNode';
import { RCSNode } from './nodes/RCSNode';
import { ConditionalNode } from './nodes/ConditionalNode';
import { AuditNode } from './nodes/AuditNode';
import { DelayNode } from './nodes/DelayNode';
import { FilterNode } from './nodes/FilterNode';
import { RateLimitNode } from './nodes/RateLimitNode';
import { SwitchNode } from './nodes/SwitchNode';
import { ThrottleNode } from './nodes/ThrottleNode';
import { RoutingNode } from './nodes/RoutingNode';
import { WebhookNode } from './nodes/WebhookNode';
import { DatabaseNode } from './nodes/DatabaseNode';
import { TransformNode } from './nodes/TransformNode';
import { APICallNode } from './nodes/APICallNode';
import { AnalyticsNode } from './nodes/AnalyticsNode';
import { AlertNode } from './nodes/AlertNode';
import { CustomEdge } from './edges/CustomEdge';
import { ZoomControls } from './ZoomControls';
import { ConvergeNode } from './nodes/ConvergeNode';
import { DivergeNode } from './nodes/DivergeNode';
import { TimerNode } from './nodes/TimerNode';
import { DoEventNode } from './nodes/DoEventNode';

const nodeTypes = {
  start: StartNode,
  terminal: TerminalNode,
  leastcost: LeastCostNode,
  weightedsplit: WeightedSplitNode,
  fallback: FallbackNode,
  sms: SMSNode,
  whatsapp: WhatsAppNode,
  email: EmailNode,
  voice: VoiceNode,
  rcs: RCSNode,
  conditional: ConditionalNode,
  audit: AuditNode,
  delay: DelayNode,
  filter: FilterNode,
  ratelimit: RateLimitNode,
  switch: SwitchNode,
  throttle: ThrottleNode,
  routing: RoutingNode,
  webhook: WebhookNode,
  database: DatabaseNode,
  transform: TransformNode,
  api: APICallNode,
  analytics: AnalyticsNode,
  alert: AlertNode,
  converge: ConvergeNode,
  diverge: DivergeNode,
  timer: TimerNode,
  doevent: DoEventNode,
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
  
  const [configModalOpen, setConfigModalOpen] = React.useState(false);
  const [configNodeId, setConfigNodeId] = React.useState<string | null>(null);

  const { setViewport } = useReactFlow();

  const onNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    setSelectedNode(node);
  }, [setSelectedNode]);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  const openConfigModal = useCallback((nodeId: string) => {
    setConfigNodeId(nodeId);
    setConfigModalOpen(true);
  }, []);

  const closeConfigModal = useCallback(() => {
    setConfigModalOpen(false);
    setConfigNodeId(null);
  }, []);

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
        
        <div className={`flex-1 relative ${configModalOpen ? 'blur-sm' : ''} transition-all duration-200`}>
          <ReactFlow
            nodes={nodes.map(node => ({
              ...node,
              data: {
                ...node.data,
                onConfigClick: () => openConfigModal(node.id)
              }
            }))}
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
              gap={24} 
              size={0.8}
              style={{ opacity: 0.4 }}
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
      </div>
      
      <SimulationPanel />
      
      {configNodeId && (
        <ConfigurationModal
          isOpen={configModalOpen}
          onClose={closeConfigModal}
          nodeId={configNodeId}
        />
      )}
    </div>
  );
};