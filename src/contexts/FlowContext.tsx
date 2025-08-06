import React, { createContext, useContext, useState, useCallback } from 'react';
import { Node, Edge, addEdge, Connection, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from '@xyflow/react';

interface FlowContextType {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  simulationMode: boolean;
  simulationResults: any[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  setSelectedNode: (node: Node | null) => void;
  addNode: (type: string, position: { x: number; y: number }) => void;
  deleteNode: (nodeId: string) => void;
  updateNodeData: (nodeId: string, data: any) => void;
  setSimulationMode: (mode: boolean) => void;
  runSimulation: (testParams: any) => void;
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

export const FlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [simulationMode, setSimulationMode] = useState(false);
  const [simulationResults, setSimulationResults] = useState<any[]>([]);

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
    setNodes((nds) => [...nds, newNode]);
  }, []);

  const deleteNode = useCallback((nodeId: string) => {
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

  return (
    <FlowContext.Provider value={{
      nodes,
      edges,
      selectedNode,
      simulationMode,
      simulationResults,
      onNodesChange,
      onEdgesChange,
      onConnect,
      setSelectedNode,
      addNode,
      deleteNode,
      updateNodeData,
      setSimulationMode,
      runSimulation,
    }}>
      {children}
    </FlowContext.Provider>
  );
};

function getDefaultNodeData(type: string) {
  switch (type) {
    case 'routing':
      return {
        strategy: 'weightedSplit',
        vendors: [],
        fallbackEnabled: false,
        label: 'Routing Logic'
      };
    case 'constraint':
      return {
        maxTPS: 1000,
        maxCost: 0.05,
        timeWindow: { start: '00:00', end: '23:59' },
        label: 'TPS: 1000/s'
      };
    case 'conditional':
      return {
        conditions: [],
        operator: 'AND',
        label: 'If-Then Logic'
      };
    case 'terminal':
      return {
        state: 'sent',
        reason: '',
        label: 'Sent'
      };
    case 'audit':
      return {
        logLevel: 'info',
        events: [],
        label: 'Debug Log'
      };
    case 'filter':
      return {
        criteria: [],
        action: 'allow',
        label: 'Message Filter'
      };
    case 'switch':
      return {
        cases: [],
        defaultPath: null,
        label: 'Multi-Path Switch'
      };
    case 'ratelimit':
      return {
        maxRate: 100,
        timeWindow: 60,
        strategy: 'sliding',
        label: 'Rate: 100/min'
      };
    case 'delay':
      return {
        duration: 1000,
        unit: 'ms',
        label: 'Delay: 1s'
      };
    case 'throttle':
      return {
        maxConcurrent: 10,
        queueSize: 100,
        label: 'Max: 10 concurrent'
      };
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
    case 'vendor':
      return {
        vendorId: '',
        priority: 1,
        config: {},
        label: 'Vendor Config'
      };
    case 'loadbalancer':
      return {
        algorithm: 'round_robin',
        healthCheck: true,
        targets: [],
        label: 'Load Balancer'
      };
    default:
      return {
        label: 'Unknown Node'
      };
  }
}