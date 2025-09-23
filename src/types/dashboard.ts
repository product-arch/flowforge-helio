export interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  cpuHistory: number[];
  memoryHistory: number[];
  diskHistory: number[];
  networkHistory: number[];
  timeSeriesData: TimeSeriesData[];
  networkData: NetworkData[];
  diskData: DiskData[];
  serviceData: ServiceData[];
  nodeBreakdown: NodeBreakdown[];
}

export interface TimeSeriesData {
  timestamp: string;
  cpu: number;
  memory: number;
  node1_cpu: number;
  node1_memory: number;
  node2_cpu: number;
  node2_memory: number;
  node3_cpu: number;
  node3_memory: number;
}

export interface NetworkData {
  timestamp: string;
  inbound: number;
  outbound: number;
  packets_in: number;
  packets_out: number;
}

export interface DiskData {
  partition: string;
  used: number;
  total: number;
  percentage: number;
  iops: number;
  latency: number;
}

export interface ServiceData {
  timestamp: string;
  routing_engine: number;
  template_service: number;
  vendor_connector: number;
  db_layer: number;
}

export interface NodeBreakdown {
  node: string;
  cpu: number;
  memory: number;
  disk: number;
  network: number;
}

export interface Alert {
  id: string;
  timestamp: Date;
  severity: 'success' | 'warning' | 'error';
  message: string;
  node: string;
  metric: string;
  value: number;
  acknowledged: boolean;
  acknowledgedAt?: Date;
  details?: string;
}

export type TimeRange = '60s' | '15m' | '1h' | '24h' | '7d';

export type ServiceType = 'all' | 'routing_engine' | 'template_service' | 'vendor_connector' | 'db_layer';

export interface ExportFormat {
  format: 'pdf' | 'csv' | 'json';
  timeRange: TimeRange;
  includeAlerts: boolean;
  includeMetrics: boolean;
}

export interface FilterOptions {
  geography?: string[];
  client?: string[];
  vendor?: string[];
  severity?: ('success' | 'warning' | 'error')[];
}