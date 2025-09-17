import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Node, Edge, addEdge, Connection, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from '@xyflow/react';
import { useSearchParams } from 'react-router-dom';

interface FlowContextType {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  simulationMode: boolean;
  simulationResults: any[];
  currentFlowId: string | null;
  channelRoutingMap: Map<string, string[]>;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  setSelectedNode: (node: Node | null) => void;
  addNode: (type: string, position: { x: number; y: number }) => void;
  deleteNode: (nodeId: string) => void;
  updateNodeData: (nodeId: string, data: any) => void;
  setSimulationMode: (mode: boolean) => void;
  runSimulation: (testParams: any) => void;
  loadFlow: (flowId: string) => void;
  saveCurrentFlow: () => void;
  getConnectedChannelNode: (routingNodeId: string) => Node | null;
  resetRoutingNodeConfiguration: (routingNodeId: string) => void;
}

const FlowContext = createContext<FlowContextType | undefined>(undefined);

export const useFlow = () => {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error('useFlow must be used within a FlowProvider');
  }
  return context;
};

const initialNodes: Node[] = [
  {
    id: 'start-1',
    type: 'start',
    position: { x: 100, y: 100 },
    data: { 
      label: 'Start',
      channel: 'SMS',
      appId: 'HELO_BROADCAST_001',
      businessUnit: 'Marketing'
    },
    deletable: false,
  },
];

// Predefined flow configurations
const flowConfigurations: Record<string, { nodes: Node[], edges: Edge[] }> = {
  'flow-1': {
    // Welcome Onboarding Campaign - Modern multi-channel flow with advanced routing and analytics
    nodes: [
      {
        id: 'start-1',
        type: 'start',
        position: { x: 100, y: 200 },
        data: { 
          label: 'Start',
          channel: 'SMS',
          appId: 'WELCOME_ONBOARD_001',
          businessUnit: 'Marketing'
        },
        deletable: false,
      },
      {
        id: 'rate-limit-1',
        type: 'ratelimit',
        position: { x: 280, y: 200 },
        data: {
          label: 'Rate Limiter',
          maxRequests: 1000,
          timeWindow: 60,
          unit: 'minute',
          strategy: 'sliding_window'
        }
      },
      {
        id: 'user-data-api',
        type: 'api',
        position: { x: 460, y: 200 },
        data: {
          label: 'Fetch User Profile',
          url: 'https://api.company.com/users/{userId}',
          method: 'GET',
          headers: { 'Authorization': 'Bearer {{token}}' },
          timeout: 5000
        }
      },
      {
        id: 'user-analytics',
        type: 'analytics',
        position: { x: 640, y: 120 },
        data: {
          label: 'Track User Event',
          eventName: 'onboarding_started',
          properties: ['userId', 'channel', 'timestamp'],
          destination: 'mixpanel'
        }
      },
      {
        id: 'preference-conditional',
        type: 'conditional',
        position: { x: 640, y: 280 },
        data: {
          label: 'Check Preferences',
          conditions: [
            { field: 'channel_preference', operator: 'equals', value: 'sms' },
            { field: 'email_verified', operator: 'equals', value: 'true' }
          ],
          operator: 'OR'
        }
      },
      {
        id: 'sms-welcome',
        type: 'sms',
        position: { x: 860, y: 180 },
        data: {
          label: 'Welcome SMS',
          senderId: 'WELCOME',
          messageType: 'transactional',
          encoding: 'utf8',
          template: 'Hi {{name}}, welcome to our platform! 🎉'
        }
      },
      {
        id: 'sms-routing',
        type: 'priority-route',
        position: { x: 1040, y: 120 },
        data: {
          label: 'SMS Priority Routing',
          routes: [
            { vendorId: 'twilio', priority: 1, weight: 70 },
            { vendorId: 'textlocal', priority: 2, weight: 30 }
          ],
          fallbackStrategy: 'next_priority'
        }
      },
      {
        id: 'email-welcome',
        type: 'email',
        position: { x: 860, y: 340 },
        data: {
          label: 'Welcome Email',
          fromAddress: 'welcome@company.com',
          messageType: 'transactional',
          template: 'welcome-email-v2',
          subject: 'Welcome to our platform, {{name}}!'
        }
      },
      {
        id: 'email-routing',
        type: 'load-balancer',
        position: { x: 1040, y: 280 },
        data: {
          label: 'Email Load Balancer',
          algorithm: 'round_robin',
          targets: [
            { vendorId: 'sendgrid', weight: 60, healthCheck: true },
            { vendorId: 'mailgun', weight: 40, healthCheck: true }
          ],
          healthCheckInterval: 30
        }
      },
      {
        id: 'delay-follow-up',
        type: 'delay',
        position: { x: 1220, y: 200 },
        data: {
          label: 'Wait 24 Hours',
          duration: 24,
          unit: 'hours'
        }
      },
      {
        id: 'engagement-check',
        type: 'conditional',
        position: { x: 1400, y: 200 },
        data: {
          label: 'Check Engagement',
          conditions: [
            { field: 'email_opened', operator: 'equals', value: 'true' },
            { field: 'app_opened', operator: 'equals', value: 'true' }
          ],
          operator: 'OR'
        }
      },
      {
        id: 'whatsapp-follow-up',
        type: 'whatsapp',
        position: { x: 1580, y: 120 },
        data: {
          label: 'WhatsApp Follow-up',
          businessId: 'FOLLOW_UP_WA',
          wabaNumber: '+1234567890',
          templateType: 'interactive',
          botName: 'OnboardingBot'
        }
      },
      {
        id: 'whatsapp-routing',
        type: 'failover',
        position: { x: 1760, y: 120 },
        data: {
          label: 'WhatsApp Failover',
          primaryVendor: 'whatsapp_business',
          secondaryVendors: ['gupshup', 'twilio_whatsapp'],
          failoverDelay: 30,
          maxRetries: 2
        }
      },
      {
        id: 'voice-call',
        type: 'voice',
        position: { x: 1580, y: 280 },
        data: {
          label: 'Welcome Call',
          callerId: '+1800WELCOME',
          voiceType: 'text-to-speech',
          message: 'Hello {{name}}, thank you for joining our platform!',
          language: 'en-US'
        }
      },
      {
        id: 'voice-routing',
        type: 'weighted-distribution',
        position: { x: 1760, y: 280 },
        data: {
          label: 'Voice Distribution',
          distribution: [
            { vendorId: 'twilio_voice', weight: 50 },
            { vendorId: 'plivo', weight: 30 },
            { vendorId: 'vonage', weight: 20 }
          ],
          strategy: 'weighted_random'
        }
      },
      {
        id: 'completion-analytics',
        type: 'analytics',
        position: { x: 1940, y: 200 },
        data: {
          label: 'Track Completion',
          eventName: 'onboarding_completed',
          properties: ['userId', 'completion_time', 'channels_used'],
          destination: 'amplitude'
        }
      },
      {
        id: 'database-update',
        type: 'database',
        position: { x: 2120, y: 200 },
        data: {
          label: 'Update User Status',
          operation: 'UPDATE',
          table: 'users',
          conditions: 'user_id = {{userId}}',
          fields: { onboarding_completed: true, completed_at: '{{timestamp}}' }
        }
      },
      {
        id: 'terminal-success',
        type: 'terminal',
        position: { x: 2300, y: 200 },
        data: {
          label: 'Onboarding Complete',
          state: 'completed',
          reason: 'Multi-channel onboarding flow completed successfully'
        }
      },
      {
        id: 'audit-log',
        type: 'audit',
        position: { x: 1220, y: 350 },
        data: {
          label: 'Audit Trail',
          eventType: 'onboarding_flow',
          logLevel: 'INFO',
          includeFields: ['userId', 'timestamp', 'channel', 'status']
        }
      }
    ],
    edges: [
      {
        id: 'e1',
        source: 'start-1',
        target: 'rate-limit-1',
        type: 'custom',
        style: { stroke: 'hsl(var(--primary))' }
      },
      {
        id: 'e2',
        source: 'rate-limit-1',
        target: 'user-data-api',
        type: 'custom',
        style: { stroke: 'hsl(var(--primary))' }
      },
      {
        id: 'e3',
        source: 'user-data-api',
        target: 'user-analytics',
        type: 'custom',
        style: { stroke: 'hsl(var(--primary))' }
      },
      {
        id: 'e4',
        source: 'user-data-api',
        target: 'preference-conditional',
        type: 'custom',
        style: { stroke: 'hsl(var(--primary))' }
      },
      {
        id: 'e5',
        source: 'preference-conditional',
        target: 'sms-welcome',
        type: 'custom',
        label: 'SMS Preferred',
        style: { stroke: 'hsl(var(--primary))' }
      },
      {
        id: 'e6',
        source: 'preference-conditional',
        target: 'email-welcome',
        type: 'custom',
        label: 'Email Preferred',
        style: { stroke: 'hsl(var(--primary))' }
      },
      {
        id: 'e7',
        source: 'sms-welcome',
        target: 'sms-routing',
        type: 'custom',
        style: { strokeDasharray: '5,5', stroke: 'hsl(var(--primary))', opacity: 0.6 }
      },
      {
        id: 'e8',
        source: 'email-welcome',
        target: 'email-routing',
        type: 'custom',
        style: { strokeDasharray: '5,5', stroke: 'hsl(var(--primary))', opacity: 0.6 }
      },
      {
        id: 'e9',
        source: 'sms-routing',
        target: 'delay-follow-up',
        type: 'custom',
        style: { stroke: 'hsl(var(--primary))' }
      },
      {
        id: 'e10',
        source: 'email-routing',
        target: 'delay-follow-up',
        type: 'custom',
        style: { stroke: 'hsl(var(--primary))' }
      },
      {
        id: 'e11',
        source: 'delay-follow-up',
        target: 'engagement-check',
        type: 'custom',
        style: { stroke: 'hsl(var(--primary))' }
      },
      {
        id: 'e12',
        source: 'engagement-check',
        target: 'whatsapp-follow-up',
        type: 'custom',
        label: 'Engaged',
        style: { stroke: 'hsl(var(--primary))' }
      },
      {
        id: 'e13',
        source: 'engagement-check',
        target: 'voice-call',
        type: 'custom',
        label: 'Not Engaged',
        style: { stroke: 'hsl(var(--primary))' }
      },
      {
        id: 'e14',
        source: 'whatsapp-follow-up',
        target: 'whatsapp-routing',
        type: 'custom',
        style: { strokeDasharray: '5,5', stroke: 'hsl(var(--primary))', opacity: 0.6 }
      },
      {
        id: 'e15',
        source: 'voice-call',
        target: 'voice-routing',
        type: 'custom',
        style: { strokeDasharray: '5,5', stroke: 'hsl(var(--primary))', opacity: 0.6 }
      },
      {
        id: 'e16',
        source: 'whatsapp-routing',
        target: 'completion-analytics',
        type: 'custom',
        style: { stroke: 'hsl(var(--primary))' }
      },
      {
        id: 'e17',
        source: 'voice-routing',
        target: 'completion-analytics',
        type: 'custom',
        style: { stroke: 'hsl(var(--primary))' }
      },
      {
        id: 'e18',
        source: 'completion-analytics',
        target: 'database-update',
        type: 'custom',
        style: { stroke: 'hsl(var(--primary))' }
      },
      {
        id: 'e19',
        source: 'database-update',
        target: 'terminal-success',
        type: 'custom',
        style: { stroke: 'hsl(var(--primary))' }
      },
      {
        id: 'e20',
        source: 'delay-follow-up',
        target: 'audit-log',
        type: 'custom',
        style: { strokeDasharray: '5,5', stroke: 'hsl(var(--muted-foreground))', opacity: 0.4 }
      }
    ]
  }
};

export const FlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchParams] = useSearchParams();
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [simulationMode, setSimulationMode] = useState(false);
  const [simulationResults, setSimulationResults] = useState<any[]>([]);
  const [currentFlowId, setCurrentFlowId] = useState<string | null>(null);
  const [channelRoutingMap, setChannelRoutingMap] = useState<Map<string, string[]>>(new Map());

  // Load flow when URL parameter changes
  useEffect(() => {
    const flowId = searchParams.get('id');
    if (flowId && flowId !== currentFlowId) {
      loadFlow(flowId);
    } else if (!flowId && currentFlowId) {
      // Reset to default when no flow ID
      setCurrentFlowId(null);
      setNodes(initialNodes);
      setEdges([]);
    }
  }, [searchParams]);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const addNode = useCallback((type: string, position: { x: number; y: number }) => {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: { 
        label: type.charAt(0).toUpperCase() + type.slice(1),
        ...getDefaultNodeData(type)
      },
    };
    
    setNodes((nds) => [...nds, newNode]);
  }, []);

  const deleteNode = useCallback((nodeId: string) => {
    // Prevent deletion of start node
    if (nodeId === 'start-1') {
      return;
    }
    
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    
    // Clean up channel-routing relationships
    setChannelRoutingMap(prev => {
      const newMap = new Map(prev);
      // Remove if node is a channel
      newMap.delete(nodeId);
      // Remove if node is a routing strategy
      for (const [channelId, routingNodes] of newMap.entries()) {
        const updatedRoutingNodes = routingNodes.filter(id => id !== nodeId);
        if (updatedRoutingNodes.length === 0) {
          newMap.delete(channelId);
        } else {
          newMap.set(channelId, updatedRoutingNodes);
        }
      }
      return newMap;
    });
    
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  }, [selectedNode]);

  const updateNodeData = useCallback((nodeId: string, data: any) => {
    setNodes((nds) => 
      nds.map((node) => {
        if (node.id === nodeId) {
          const updatedNode = { ...node, data: { ...node.data, ...data } };
          
          // If this is a channel node and vendors changed, reset connected routing nodes
          if (['sms', 'whatsapp', 'email', 'voice', 'rcs'].includes(node.type) && 
              data.selectedVendors && 
              JSON.stringify(data.selectedVendors) !== JSON.stringify(node.data.selectedVendors)) {
            const connectedRoutingNodes = channelRoutingMap.get(nodeId) || [];
            connectedRoutingNodes.forEach(routingNodeId => {
              resetRoutingNodeConfiguration(routingNodeId);
            });
          }
          
          return updatedNode;
        }
        return node;
      })
    );
  }, [channelRoutingMap]);

  const runSimulation = useCallback((testParams: any) => {
    // Simulate routing logic
    const results = [
      {
        timestamp: new Date().toISOString(),
        nodeId: 'start-1',
        status: 'success',
        message: 'Flow started successfully',
        data: testParams
      },
      // Add more simulation steps based on flow
    ];
    setSimulationResults(results);
  }, [nodes, edges]);

  const loadFlow = useCallback((flowId: string) => {
    const flowConfig = flowConfigurations[flowId];
    if (flowConfig) {
      setCurrentFlowId(flowId);
      setNodes(flowConfig.nodes);
      setEdges(flowConfig.edges);
      setSelectedNode(null);
    } else {
      // Flow not found, load default
      setCurrentFlowId(null);
      setNodes(initialNodes);
      setEdges([]);
    }
  }, []);

  const saveCurrentFlow = useCallback(() => {
    if (currentFlowId) {
      // Save current flow state to localStorage or backend
      localStorage.setItem(`flow-${currentFlowId}`, JSON.stringify({
        nodes,
        edges,
        lastModified: new Date().toISOString()
      }));
    }
  }, [currentFlowId, nodes, edges]);

  const getConnectedChannelNode = useCallback((routingNodeId: string) => {
    // Find ALL edges where routing node is the target
    const incomingEdges = edges.filter(edge => edge.target === routingNodeId);
    if (incomingEdges.length === 0) return null;
    
    // Find edges coming from channel nodes (prioritize direct channel connections)
    const channelEdges = incomingEdges.filter(edge => {
      const sourceNode = nodes.find(node => node.id === edge.source);
      return sourceNode && ['sms', 'whatsapp', 'email', 'voice', 'rcs'].includes(sourceNode.type);
    });
    
    if (channelEdges.length === 0) return null;
    
    // Return the first channel node found (prefer most recent connection)
    const channelEdge = channelEdges[channelEdges.length - 1]; // Get latest connection
    const channelNode = nodes.find(node => node.id === channelEdge.source);
    
    return channelNode || null;
  }, [edges, nodes]);

  // Enhanced connection validation with debouncing
  const [connectionChangeTimeout, setConnectionChangeTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const debouncedConnectionUpdate = useCallback((callback: () => void) => {
    if (connectionChangeTimeout) {
      clearTimeout(connectionChangeTimeout);
    }
    
    const timeout = setTimeout(callback, 100); // 100ms debounce
    setConnectionChangeTimeout(timeout);
  }, [connectionChangeTimeout]);

  // Enhanced onConnect function with multi-connection support
  const onConnect = useCallback(
    (connection: Connection) => {
      const { source, target, sourceHandle, targetHandle } = connection;
      
      // Validate connection types
      const sourceNode = nodes.find(n => n.id === source);
      const targetNode = nodes.find(n => n.id === target);
      
      if (!sourceNode || !targetNode) return;
      
      const newEdge: Edge = {
        id: `${source}-${target}-${Date.now()}`,
        source,
        target,
        sourceHandle,
        targetHandle,
        type: 'custom',
        animated: simulationMode,
        style: { strokeWidth: 2 },
      };

      setEdges((eds) => {
        const newEdges = addEdge(newEdge, eds);
        
        // Update channel-routing relationships
        if (sourceNode && targetNode && 
            ['sms', 'whatsapp', 'email', 'voice', 'rcs'].includes(sourceNode.type) &&
            ['priority-route', 'round-robin', 'least-cost', 'load-balancer', 'geolocation', 'failover', 'weighted-distribution'].includes(targetNode.type)) {
          setChannelRoutingMap(prev => {
            const newMap = new Map(prev);
            const currentRoutingNodes = newMap.get(sourceNode.id) || [];
            if (!currentRoutingNodes.includes(targetNode.id)) {
              newMap.set(sourceNode.id, [...currentRoutingNodes, targetNode.id]);
            }
            return newMap;
          });
        }
        
        return newEdges;
      });
      
      // Debounced update for routing node states
      debouncedConnectionUpdate(() => {
        // Force re-render of routing nodes by triggering a state update
        setNodes((nds) => [...nds]);
      });
    },
    [nodes, simulationMode, debouncedConnectionUpdate]
  );

  // Enhanced onEdgesChange to handle disconnections
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
      
      // Check for edge removals and update affected routing nodes
      const hasRemovals = changes.some(change => change.type === 'remove');
      if (hasRemovals) {
        debouncedConnectionUpdate(() => {
          setNodes((nds) => [...nds]);
        });
      }
    },
    [debouncedConnectionUpdate]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (connectionChangeTimeout) {
        clearTimeout(connectionChangeTimeout);
      }
    };
  }, [connectionChangeTimeout]);

  const resetRoutingNodeConfiguration = useCallback((routingNodeId: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === routingNodeId
          ? { ...node, data: { ...getDefaultNodeData(node.type), label: node.data.label } }
          : node
      )
    );
  }, []);

  return (
    <FlowContext.Provider value={{
      nodes,
      edges,
      selectedNode,
      simulationMode,
      simulationResults,
      currentFlowId,
      channelRoutingMap,
      onNodesChange,
      onEdgesChange,
      onConnect,
      setSelectedNode,
      addNode,
      deleteNode,
      updateNodeData,
      setSimulationMode,
      runSimulation,
      loadFlow,
      saveCurrentFlow,
      getConnectedChannelNode,
      resetRoutingNodeConfiguration,
    }}>
      {children}
    </FlowContext.Provider>
  );
};

function getDefaultNodeData(type: string) {
  switch (type) {
    // Vendor Routing Node (attached to channels)
    case 'vendorrouting':
      return {
        label: 'Vendor Routing',
        parentChannelId: '',
        configType: 'default',
        selectedVendors: [],
        routingConfig: null,
        strategy: 'priority',
        strategyConfig: {}
      };

    // Channel Nodes
    case 'sms':
      return {
        senderId: '',
        messageType: 'transactional',
        encoding: 'utf8',
        label: 'SMS Channel'
      };
    case 'whatsapp':
      return {
        businessId: '',
        templateType: 'text',
        botName: '',
        label: 'WhatsApp Channel'
      };
    case 'email':
      return {
        fromAddress: '',
        messageType: 'transactional',
        template: '',
        label: 'Email Channel'
      };
    case 'voice':
      return {
        callerId: '',
        voiceType: 'text-to-speech',
        language: 'en',
        label: 'Voice Channel'
      };
    case 'rcs':
      return {
        botName: '',
        agentId: '',
        messageType: 'text',
        label: 'RCS Channel'
      };

    // Control Nodes
    case 'pathmix':
    case 'converge': // Legacy support
    case 'diverge': // Legacy support
      return {
        operation: 'diverge',
        strategy: 'clone_all',
        outputs: 3,
        maxInputs: 3,
        mergeStrategy: 'wait_all',
        timeout: 30,
        preserveOrder: false,
        enableBatching: false,
        label: 'Path Mix'
      };
    case 'timer':
    case 'delay': // Legacy support
      return {
        timerType: 'simple_delay',
        duration: 30,
        timeUnit: 'seconds',
        repeatCount: 1,
        persistTimer: false,
        enableCancellation: true,
        label: 'Timer Control'
      };
    case 'doevent':
      return {
        eventType: 'custom',
        eventData: {},
        async: false,
        label: 'Do Event'
      };

    // Logic Nodes
    case 'conditional':
      return {
        conditions: [],
        operator: 'AND',
        label: 'If-Then Logic'
      };
    case 'switch':
      return {
        cases: [],
        defaultPath: null,
        label: 'Multi-Path Switch'
      };
    case 'filter':
      return {
        criteria: [],
        action: 'allow',
        label: 'Message Filter'
      };

    // Constraint Nodes
    case 'tpslimit':
      return {
        maxTPS: 1000,
        timeWindow: 60,
        action: 'queue',
        label: 'TPS Limit'
      };
    case 'costcap':
      return {
        maxCost: 0.05,
        currency: 'INR',
        action: 'reject',
        label: 'Cost Cap'
      };
    case 'timewindow':
      return {
        startTime: '00:00',
        endTime: '23:59',
        timezone: 'UTC',
        label: 'Time Window'
      };
    case 'geofence':
      return {
        allowedRegions: [],
        blockedRegions: [],
        action: 'reject',
        label: 'Geo Fence'
      };

    // Vendor Nodes
    case 'vendor':
      return {
        vendorId: '',
        priority: 1,
        config: {},
        label: 'Vendor Config'
      };
    case 'healthcheck':
      return {
        interval: 30,
        timeout: 5,
        retries: 3,
        label: 'Health Check'
      };

    // Routing Strategy Nodes
    case 'priority-route':
      return {
        label: 'Priority Routing',
        parentChannelId: null,
        vendors: [],
        priorityOrder: [],
        healthCheck: true,
        retryAttempts: 3
      };
    case 'round-robin':
      return {
        label: 'Round Robin',
        parentChannelId: null,
        vendors: [],
        type: 'weighted',
        healthCheck: true,
        resetOnFailure: false
      };
    case 'least-cost':
      return {
        label: 'Least Cost',
        parentChannelId: null,
        vendors: [],
        costThreshold: 0.05,
        fallbackToHigherCost: true,
        currency: 'INR'
      };
    case 'load-balancer':
      return {
        label: 'Load Balancer',
        parentChannelId: null,
        vendors: [],
        algorithm: 'round_robin',
        targets: [],
        healthCheck: true
      };
    case 'geolocation':
      return {
        label: 'Geolocation Routing',
        parentChannelId: null,
        vendors: [],
        strategy: 'proximity',
        regions: [],
        fallbackRegion: 'global'
      };
    case 'failover':
      return {
        label: 'Failover',
        parentChannelId: null,
        vendors: [],
        primaryVendor: null,
        backupVendors: [],
        failoverCriteria: 'response_time'
      };
    case 'weighted-distribution':
      return {
        label: 'Weighted Distribution',
        parentChannelId: null,
        vendors: [],
        weights: {},
        autoNormalize: true
      };

    // Control Logic Nodes  
    case 'timer':
    case 'delay': // Legacy support
      return {
        label: type === 'delay' ? 'Delay' : 'Timer',
        timerType: type === 'delay' ? 'delay' : 'countdown',
        duration: null,
        unit: type === 'delay' ? 'ms' : 's',
        onConfigClick: (nodeId: string) => console.log('Config clicked for node:', nodeId)
      };
    case 'pathmix':
    case 'converge': // Legacy support
    case 'diverge': // Legacy support
      return {
        label: type === 'converge' ? 'Converge' : type === 'diverge' ? 'Diverge' : 'Path Mix',
        operation: type === 'converge' ? 'converge' : type === 'diverge' ? 'diverge' : 'both',
        outputs: type === 'diverge' ? 2 : null,
        maxInputs: type === 'converge' ? 2 : null,
        onConfigClick: (nodeId: string) => console.log('Config clicked for node:', nodeId)
      };
    case 'doevent':
      return {
        label: 'Do Event',
        eventType: null,
        eventData: {},
        onConfigClick: (nodeId: string) => console.log('Config clicked for node:', nodeId)
      };
    case 'filter':
      return {
        label: 'Filter',
        filterCondition: null,
        filterValue: null,
        onConfigClick: (nodeId: string) => console.log('Config clicked for node:', nodeId)
      };
    case 'fallback':
      return {
        label: 'Fallback',
        primaryVendor: null,
        fallbackVendors: [],
        failureThreshold: 3,
        onConfigClick: (nodeId: string) => console.log('Config clicked for node:', nodeId)
      };
    case 'load-balancer':
      return {
        label: 'Load Balancer',
        parentChannelId: null,
        vendors: [],
        algorithm: 'round_robin',
        targets: [],
        healthCheck: true
      };
    case 'geolocation':
      return {
        label: 'Geolocation Routing',
        parentChannelId: null,
        vendors: [],
        strategy: 'proximity',
        regions: [],
        fallbackRegion: 'global'
      };
    case 'failover':
      return {
        label: 'Failover',
        parentChannelId: null,
        vendors: [],
        primaryVendor: null,
        backupVendors: [],
        failoverCriteria: 'response_time'
      };
    case 'weighted-distribution':
      return {
        label: 'Weighted Distribution',
        parentChannelId: null,
        vendors: [],
        weights: {},
        normalizeWeights: true
      };

    // Core Nodes
    case 'terminal':
      return {
        state: 'sent',
        reason: '',
        label: 'Sent'
      };
    default:
      return {
        label: 'Unknown Node'
      };
  }
}