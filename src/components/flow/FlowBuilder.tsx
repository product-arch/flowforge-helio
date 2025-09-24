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
import { FloatingNodePalette } from './FloatingNodePalette';
import { ConfigurationSidebar } from './ConfigurationSidebar';
import { FlowNavbar } from './FlowNavbar';
import { StartNode } from './nodes/StartNode';
import { TerminalNode } from './nodes/TerminalNode';
import { SMSNode } from './nodes/SMSNode';
import { WhatsAppNode } from './nodes/WhatsAppNode';
import { EmailNode } from './nodes/EmailNode';
import { VoiceNode } from './nodes/VoiceNode';
import { RCSNode } from './nodes/RCSNode';
import { ConditionalNode } from './nodes/ConditionalNode';
import { DecisionsNode } from './nodes/DecisionsNode';
import { AuditNode } from './nodes/AuditNode';
import { PathMixNode } from './nodes/PathMixNode';
import { FilterNode } from './nodes/FilterNode';
import { RateLimitNode } from './nodes/RateLimitNode';
import { SwitchNode } from './nodes/SwitchNode';
import { ThrottleNode } from './nodes/ThrottleNode';
import { VendorRoutingNode } from './nodes/VendorRoutingNode';
import { WebhookNode } from './nodes/WebhookNode';
import { DatabaseNode } from './nodes/DatabaseNode';
import { TransformNode } from './nodes/TransformNode';
import { APICallNode } from './nodes/APICallNode';
import { AnalyticsNode } from './nodes/AnalyticsNode';
import { AlertNode } from './nodes/AlertNode';
import { CustomEdge } from './edges/CustomEdge';
import { ZoomControls } from './ZoomControls';
import { TimerNode } from './nodes/TimerNode';
import { DoEventNode } from './nodes/DoEventNode';
import { FallbackNode } from './nodes/FallbackNode';
import { PriorityRouteNode } from './nodes/PriorityRouteNode';
import { NewRoundRobinNode } from './nodes/NewRoundRobinNode';
import { NewLeastCostNode } from './nodes/NewLeastCostNode';
import { NewLoadBalancerNode } from './nodes/NewLoadBalancerNode';
import { GeolocationRoutingNode } from './nodes/GeolocationRoutingNode';
import { FailoverNode } from './nodes/FailoverNode';
import { WeightedDistributionNode } from './nodes/WeightedDistributionNode';

const nodeTypes = {
  start: StartNode,
  terminal: TerminalNode,
  sms: SMSNode,
  whatsapp: WhatsAppNode,
  email: EmailNode,
  voice: VoiceNode,
  rcs: RCSNode,
  conditional: ConditionalNode,
  decisions: DecisionsNode,
  audit: AuditNode,
  delay: TimerNode, // Legacy support
  timer: TimerNode,
  pathmix: PathMixNode,
  converge: PathMixNode, // Legacy support
  diverge: PathMixNode, // Legacy support
  filter: FilterNode,
  ratelimit: RateLimitNode,
  switch: SwitchNode,
  throttle: ThrottleNode,
  vendorrouting: VendorRoutingNode,
  webhook: WebhookNode,
  database: DatabaseNode,
  transform: TransformNode,
  api: APICallNode,
  analytics: AnalyticsNode,
  alert: AlertNode,
  doevent: DoEventNode,
  fallback: FallbackNode,
  'priority-route': PriorityRouteNode,
  'round-robin': NewRoundRobinNode,
  'least-cost': NewLeastCostNode,
  'load-balancer': NewLoadBalancerNode,
  'geolocation': GeolocationRoutingNode,
  'failover': FailoverNode,
  'weighted-distribution': WeightedDistributionNode,
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
    <div className="h-screen w-full flex flex-col">
      <FlowNavbar />
      
      <div className="flex-1 flex overflow-hidden">        
        <div className={`flex-1 relative ${configModalOpen ? 'blur-sm' : ''}`}>
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
            className="bg-background"
            proOptions={{ hideAttribution: true }}
          >
            <Background 
              color="hsl(var(--border))" 
              gap={20} 
              size={1.8}
              style={{ opacity: 0.8 }}
            />
            <Panel position="bottom-left">
              <MiniMap 
                nodeColor="hsl(var(--primary))"
                maskColor="rgba(0,0,0,0.2)"
                className="bg-card border border-border rounded-lg shadow-lg"
              />
            </Panel>
            <Panel position="bottom-right">
              <ZoomControls />
            </Panel>
          </ReactFlow>
          
          <FloatingNodePalette />
        </div>
      </div>
      
      {configNodeId && (
        <ConfigurationSidebar
          isOpen={configModalOpen}
          onClose={closeConfigModal}
          nodeId={configNodeId}
        />
      )}
    </div>
  );
};