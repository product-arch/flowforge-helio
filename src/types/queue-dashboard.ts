export type QueueType = 'otp' | 'promo' | 'transactional' | 'whatsapp' | 'email' | 'voice';

export type QueueStatus = 'healthy' | 'warning' | 'critical';

export interface QueueMetrics {
  id: string;
  name: string;
  type: QueueType;
  depth: number;
  pendingMessages: number;
  retryingMessages: number;
  dlqMessages: number;
  avgLatency: number;
  p50Latency: number;
  p95Latency: number;
  p99Latency: number;
  enqueueRate: number;
  dequeueRate: number;
  status: QueueStatus;
  lastUpdated: Date;
}

export interface TimeSeriesQueueData {
  timestamp: string;
  queueId: string;
  depth: number;
  pendingMessages: number;
  retryingMessages: number;
  dlqMessages: number;
  p50Latency: number;
  p95Latency: number;
  p99Latency: number;
  enqueueRate: number;
  dequeueRate: number;
}

export interface RetryReason {
  id: string;
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface DLQMessage {
  id: string;
  queueId: string;
  timestamp: Date;
  errorCode: string;
  errorMessage: string;
  retryCount: number;
  lastAttemptVendor: string;
  messageContent?: string;
  originalChannel: string;
}

export interface QueueAlert {
  id: string;
  queueId: string;
  queueName: string;
  timestamp: Date;
  severity: 'success' | 'warning' | 'error';
  message: string;
  metric: string;
  value: number;
  threshold?: number;
  acknowledged: boolean;
  acknowledgedAt?: Date;
  details?: string;
}

export type TimeRange = '60s' | '15m' | '1h' | '24h' | '7d';

export interface FilterOptions {
  channels?: QueueType[];
  vendors?: string[];
  clients?: string[];
  severities?: ('success' | 'warning' | 'error')[];
}

export interface ExportFormat {
  format: 'pdf' | 'csv' | 'json';
  timeRange: TimeRange;
  includeAlerts: boolean;
  includeMetrics: boolean;
  includeRetryAnalysis: boolean;
  includeDLQ: boolean;
}

export interface QueueDrilldownState {
  isOpen: boolean;
  queueId: string | null;
  queueName: string | null;
}