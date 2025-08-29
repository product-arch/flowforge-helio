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
    // Welcome Onboarding Campaign - Complex multi-channel flow
    nodes: [
      {
        id: 'start-1',
        type: 'start',
        position: { x: 100, y: 100 },
        data: { 
          label: 'Start',
          channel: 'SMS',
          appId: 'WELCOME_ONBOARD_001',
          businessUnit: 'Marketing'
        },
        deletable: false,
      },
      {
        id: 'sms-welcome',
        type: 'sms',
        position: { x: 300, y: 100 },
        data: {
          label: 'Welcome SMS',
          senderId: 'WELCOME',
          messageType: 'transactional',
          encoding: 'utf8'
        }
      },
      {
        id: 'routing-sms',
        type: 'vendorrouting',
        position: { x: 300, y: 220 },
        data: {
          label: 'SMS Routing',
          parentChannelId: 'sms-welcome',
          configType: 'priority',
          selectedVendors: ['TextLocal', 'Twilio'],
          strategy: 'priority'
        }
      },
      {
        id: 'conditional-email',
        type: 'conditional',
        position: { x: 550, y: 100 },
        data: {
          label: 'Check Email Preference',
          conditions: [{ field: 'emailOptIn', operator: 'equals', value: 'true' }],
          operator: 'AND'
        }
      },
      {
        id: 'email-follow',
        type: 'email',
        position: { x: 800, y: 50 },
        data: {
          label: 'Follow-up Email',
          fromAddress: 'welcome@company.com',
          messageType: 'transactional',
          template: 'welcome-email-template'
        }
      },
      {
        id: 'routing-email',
        type: 'vendorrouting',
        position: { x: 800, y: 170 },
        data: {
          label: 'Email Routing',
          parentChannelId: 'email-follow',
          configType: 'priority',
          selectedVendors: ['SendGrid', 'Mailgun'],
          strategy: 'priority'
        }
      },
      {
        id: 'whatsapp-welcome',
        type: 'whatsapp',
        position: { x: 800, y: 300 },
        data: {
          label: 'WhatsApp Welcome',
          businessId: 'WELCOME_WA',
          templateType: 'text',
          botName: 'WelcomeBot'
        }
      },
      {
        id: 'routing-whatsapp',
        type: 'vendorrouting',
        position: { x: 800, y: 420 },
        data: {
          label: 'WhatsApp Routing',
          parentChannelId: 'whatsapp-welcome',
          configType: 'priority',
          selectedVendors: ['WhatsApp Business', 'Gupshup'],
          strategy: 'priority'
        }
      },
      {
        id: 'terminal-success',
        type: 'terminal',
        position: { x: 1050, y: 200 },
        data: {
          label: 'Campaign Complete',
          state: 'sent',
          reason: 'Onboarding flow completed successfully'
        }
      }
    ],
    edges: [
      {
        id: 'e1',
        source: 'start-1',
        target: 'sms-welcome',
        type: 'custom',
        style: { stroke: 'hsl(var(--primary))' }
      },
      {
        id: 'e2',
        source: 'sms-welcome',
        target: 'routing-sms',
        type: 'custom',
        style: { strokeDasharray: '5,5', stroke: 'hsl(var(--primary))', opacity: 0.6 }
      },
      {
        id: 'e3',
        source: 'sms-welcome',
        target: 'conditional-email',
        type: 'custom',
        style: { stroke: 'hsl(var(--primary))' }
      },
      {
        id: 'e4',
        source: 'conditional-email',
        target: 'email-follow',
        type: 'custom',
        label: 'Email Opted In',
        style: { stroke: 'hsl(var(--primary))' }
      },
      {
        id: 'e5',
        source: 'email-follow',
        target: 'routing-email',
        type: 'custom',
        style: { strokeDasharray: '5,5', stroke: 'hsl(var(--primary))', opacity: 0.6 }
      },
      {
        id: 'e6',
        source: 'conditional-email',
        target: 'whatsapp-welcome',
        type: 'custom',
        label: 'WhatsApp Preferred',
        style: { stroke: 'hsl(var(--primary))' }
      },
      {
        id: 'e7',
        source: 'whatsapp-welcome',
        target: 'routing-whatsapp',
        type: 'custom',
        style: { strokeDasharray: '5,5', stroke: 'hsl(var(--primary))', opacity: 0.6 }
      },
      {
        id: 'e8',
        source: 'email-follow',
        target: 'terminal-success',
        type: 'custom',
        style: { stroke: 'hsl(var(--primary))' }
      },
      {
        id: 'e9',
        source: 'whatsapp-welcome',
        target: 'terminal-success',
        type: 'custom',
        style: { stroke: 'hsl(var(--primary))' }
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

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge({ ...connection, type: 'custom' }, eds));
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
    
    // For channel nodes, also create an attached routing node
    const isChannelNode = ['sms', 'whatsapp', 'email', 'voice', 'rcs'].includes(type);
    
    if (isChannelNode) {
      const routingNode: Node = {
        id: `vendorrouting-${Date.now()}`,
        type: 'vendorrouting',
        position: { x: position.x, y: position.y + 120 },
        data: {
          label: 'Vendor Routing',
          parentChannelId: newNode.id,
          configType: 'default',
          selectedVendors: [],
          routingConfig: null,
          ...getDefaultNodeData('vendorrouting')
        },
      };
      
      setNodes((nds) => [...nds, newNode, routingNode]);
      
      // Auto-connect channel to routing node
      setTimeout(() => {
        setEdges((eds) => addEdge({
          id: `edge-${newNode.id}-${routingNode.id}`,
          source: newNode.id,
          target: routingNode.id,
          type: 'custom',
          style: { strokeDasharray: '5,5', stroke: 'hsl(var(--primary))', opacity: 0.6 }
        }, eds));
      }, 100);
    } else {
      setNodes((nds) => [...nds, newNode]);
    }
  }, []);

  const deleteNode = useCallback((nodeId: string) => {
    // Prevent deletion of start node
    if (nodeId === 'start-1') {
      return;
    }
    
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  }, [selectedNode]);

  const updateNodeData = useCallback((nodeId: string, data: any) => {
    setNodes((nds) => 
      nds.map((node) => 
        node.id === nodeId 
          ? { ...node, data: { ...node.data, ...data } }
          : node
      )
    );
  }, []);

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

  return (
    <FlowContext.Provider value={{
      nodes,
      edges,
      selectedNode,
      simulationMode,
      simulationResults,
      currentFlowId,
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
    case 'converge':
      return {
        inputCount: 2,
        strategy: 'merge',
        label: 'Converge Point'
      };
    case 'diverge':
      return {
        outputCount: 2,
        strategy: 'split',
        label: 'Diverge Point'
      };
    case 'timer':
      return {
        duration: 5000,
        unit: 'ms',
        action: 'delay',
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

    // Monitoring Nodes
    case 'audit':
      return {
        logLevel: 'info',
        events: [],
        label: 'Debug Log'
      };
    case 'analytics':
      return {
        metrics: ['delivery_rate', 'latency'],
        interval: '1m',
        label: 'Analytics Tracker'
      };
    case 'alert':
      return {
        conditions: [],
        recipients: [],
        severity: 'medium',
        label: 'Alert System'
      };

    // Integration Nodes
    case 'webhook':
      return {
        url: '',
        method: 'POST',
        headers: {},
        label: 'Webhook Call'
      };
    case 'database':
      return {
        operation: 'insert',
        table: '',
        fields: [],
        label: 'Database Op'
      };
    case 'transform':
      return {
        transformations: [],
        outputFormat: 'json',
        label: 'Data Transform'
      };
    case 'api':
      return {
        url: '',
        method: 'GET',
        headers: {},
        label: 'API Call'
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