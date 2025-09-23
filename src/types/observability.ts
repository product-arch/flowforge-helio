export interface DatabaseMetrics {
  queryLatency: {
    avg: number;
    p50: number;
    p95: number;
    p99: number;
    trend: number[];
  };
  activeConnections: {
    percentage: number;
    used: number;
    total: number;
    trend: number[];
  };
  replicationLag: {
    avg: number;
    replicas: ReplicaLag[];
    trend: number[];
  };
  errorRate: {
    percentage: number;
    count: number;
    total: number;
    trend: number[];
  };
}

export interface ReplicaLag {
  name: string;
  lag: number;
  status: 'healthy' | 'warning' | 'critical';
}

export interface DatabaseError {
  id: string;
  timestamp: Date;
  query: string;
  errorCode: string;
  service: string;
  retryCount: number;
  severity: 'info' | 'warning' | 'critical';
  acknowledged: boolean;
  fullQuery?: string;
  bindParameters?: Record<string, any>;
  stackTrace?: string;
}

export interface ConnectionHeatmapData {
  node: string;
  time: string;
  usage: number;
  connections: number;
}

export interface LatencyTimelineData {
  timestamp: string;
  p50: number;
  p95: number;
  p99: number;
  queryType?: string;
}

export interface ServiceMetrics {
  apiGateway: ServiceHealth;
  routingEngine: ServiceHealth;
  templateService: ServiceHealth;
  deliveryProcessor: ServiceHealth;
}

export interface ServiceHealth {
  name: string;
  latency: number;
  throughput: number;
  errorRate: number;
  status: 'healthy' | 'warning' | 'critical';
  trend: number[];
}

export interface APILatencyData {
  timestamp: string;
  '/send': number;
  '/template/submit': number;
  '/delivery/report': number;
}

export interface ErrorDistribution {
  endpoint: string;
  '4xx': number;
  '5xx': number;
  total: number;
}

export interface APIError {
  id: string;
  timestamp: Date;
  endpoint: string;
  clientId: string;
  statusCode: number;
  errorMessage: string;
  severity: 'info' | 'warning' | 'critical';
  acknowledged: boolean;
  requestPayload?: string;
  responsePayload?: string;
}

export interface ObservabilityAlert {
  id: string;
  timestamp: Date;
  type: 'database' | 'api' | 'service';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  source: string;
  acknowledged: boolean;
  acknowledgedAt?: Date;
  drilldownPath?: string;
}

export type TimeRange = '15m' | '1h' | '24h' | '7d' | 'live';

export interface ExportOptions {
  format: 'pdf' | 'csv' | 'json';
  timeRange: TimeRange;
  includeAlerts: boolean;
  includeMetrics: boolean;
  includeErrors: boolean;
}

export interface FilterOptions {
  services?: string[];
  endpoints?: string[];
  nodes?: string[];
  severity?: ('info' | 'warning' | 'critical')[];
  clientIds?: string[];
}