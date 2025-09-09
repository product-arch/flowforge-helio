export interface FallbackConfig {
  channel: string;
  vendors: string[];
}

export interface RouteConfig {
  type: 'priority' | 'round_robin' | 'weighted' | 'least_cost';
  vendors: string[];
  weights?: Record<string, number>;
  priorities?: Record<string, number>;
}

export interface NodeData {
  // Common properties
  selectedVendors?: string[];
  routingConfig?: RouteConfig;
  fallback?: FallbackConfig;
  
  // SMS/Email specific
  template?: string;
  templateType?: string;
  
  // Voice specific
  callerId?: string;
  voiceType?: string;
  language?: string;
  
  // WhatsApp specific
  businessId?: string;
  wabaNumber?: string;
  
  // RCS specific
  brandId?: string;
  agentId?: string;
  
  // Routing specific
  threshold?: number;
  globalThreshold?: number;
  spilloverMode?: string;
  
  // Callbacks
  onConfigClick?: (nodeId: string) => void;
}

export interface BusinessProfile {
  name: string;
  code: string;
  status: 'active' | 'inactive';
  channels: string[];
}