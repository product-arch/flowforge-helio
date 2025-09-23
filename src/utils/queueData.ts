import { 
  QueueMetrics, 
  QueueType, 
  QueueStatus, 
  TimeSeriesQueueData, 
  RetryReason, 
  DLQMessage, 
  QueueAlert,
  TimeRange 
} from '@/types/queue-dashboard';

const QUEUE_TYPES: { type: QueueType; name: string }[] = [
  { type: 'otp', name: 'OTP Queue' },
  { type: 'promo', name: 'Promo Queue' },
  { type: 'transactional', name: 'Transactional Queue' },
  { type: 'whatsapp', name: 'WhatsApp Queue' },
  { type: 'email', name: 'Email Queue' },
  { type: 'voice', name: 'Voice Queue' }
];

const VENDORS = ['Twilio', 'Infobip', 'MessageBird', 'Vonage', 'Plivo', 'MSG91', 'Exotel'];
const ERROR_CODES = ['VENDOR_TIMEOUT', 'INVALID_TEMPLATE', 'NETWORK_ERROR', 'INTERNAL_ERROR', 'RATE_LIMIT', 'AUTH_FAILED'];

function getRandomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getQueueStatus(depth: number, latency: number): QueueStatus {
  if (depth > 50000 || latency > 5000) return 'critical';
  if (depth > 20000 || latency > 2000) return 'warning';
  return 'healthy';
}

export function generateQueueMetrics(): QueueMetrics[] {
  return QUEUE_TYPES.map((queue, index) => {
    const depth = getRandomInt(1000, 100000);
    const pendingMessages = Math.floor(depth * getRandomFloat(0.7, 0.9));
    const retryingMessages = Math.floor(depth * getRandomFloat(0.05, 0.15));
    const dlqMessages = depth - pendingMessages - retryingMessages;
    
    const p50Latency = getRandomFloat(200, 1500);
    const p95Latency = p50Latency * getRandomFloat(2, 4);
    const p99Latency = p95Latency * getRandomFloat(1.2, 2);
    const avgLatency = (p50Latency + p95Latency + p99Latency) / 3;
    
    const enqueueRate = getRandomFloat(100, 3000);
    const dequeueRate = enqueueRate * getRandomFloat(0.8, 1.2);
    
    return {
      id: `queue-${index + 1}`,
      name: queue.name,
      type: queue.type,
      depth,
      pendingMessages,
      retryingMessages,
      dlqMessages,
      avgLatency,
      p50Latency,
      p95Latency,
      p99Latency,
      enqueueRate,
      dequeueRate,
      status: getQueueStatus(depth, avgLatency),
      lastUpdated: new Date()
    };
  });
}

export function generateTimeSeriesData(queueId: string, timeRange: TimeRange): TimeSeriesQueueData[] {
  const now = new Date();
  let points: number;
  let intervalMs: number;

  switch (timeRange) {
    case '60s':
      points = 60;
      intervalMs = 1000;
      break;
    case '15m':
      points = 30;
      intervalMs = 30 * 1000;
      break;
    case '1h':
      points = 60;
      intervalMs = 60 * 1000;
      break;
    case '24h':
      points = 96;
      intervalMs = 15 * 60 * 1000;
      break;
    case '7d':
      points = 168;
      intervalMs = 60 * 60 * 1000;
      break;
    default:
      points = 60;
      intervalMs = 1000;
  }

  return Array.from({ length: points }, (_, i) => {
    const timestamp = new Date(now.getTime() - (points - i - 1) * intervalMs);
    const baseDepth = getRandomInt(10000, 80000);
    const variation = Math.sin(i / 10) * 5000 + getRandomFloat(-2000, 2000);
    const depth = Math.max(0, baseDepth + variation);
    
    return {
      timestamp: timestamp.toISOString(),
      queueId,
      depth,
      pendingMessages: Math.floor(depth * 0.8),
      retryingMessages: Math.floor(depth * 0.1),
      dlqMessages: Math.floor(depth * 0.1),
      p50Latency: getRandomFloat(200, 1000),
      p95Latency: getRandomFloat(1000, 3000),
      p99Latency: getRandomFloat(3000, 8000),
      enqueueRate: getRandomFloat(100, 2000),
      dequeueRate: getRandomFloat(80, 1800)
    };
  });
}

export function generateRetryReasons(): RetryReason[] {
  const reasons = [
    { name: 'Vendor Timeout', color: 'hsl(var(--chart-1))' },
    { name: 'Invalid Template', color: 'hsl(var(--chart-2))' },
    { name: 'Network Error', color: 'hsl(var(--chart-3))' },
    { name: 'Internal Error', color: 'hsl(var(--chart-4))' },
    { name: 'Rate Limit', color: 'hsl(var(--chart-5))' }
  ];

  const total = getRandomInt(10000, 50000);
  let remaining = total;
  
  return reasons.map((reason, index) => {
    const isLast = index === reasons.length - 1;
    const count = isLast ? remaining : getRandomInt(1000, remaining / 2);
    remaining -= count;
    
    return {
      id: `retry-${index + 1}`,
      name: reason.name,
      count,
      percentage: Math.round((count / total) * 100),
      color: reason.color
    };
  });
}

export function generateDLQMessages(): DLQMessage[] {
  return Array.from({ length: getRandomInt(50, 500) }, (_, i) => {
    const timestamp = new Date(Date.now() - getRandomInt(0, 7 * 24 * 60 * 60 * 1000));
    
    return {
      id: `dlq-msg-${i + 1}`,
      queueId: `queue-${getRandomInt(1, 6)}`,
      timestamp,
      errorCode: ERROR_CODES[getRandomInt(0, ERROR_CODES.length - 1)],
      errorMessage: `Failed to deliver message: ${ERROR_CODES[getRandomInt(0, ERROR_CODES.length - 1)].toLowerCase().replace('_', ' ')}`,
      retryCount: getRandomInt(1, 5),
      lastAttemptVendor: VENDORS[getRandomInt(0, VENDORS.length - 1)],
      originalChannel: QUEUE_TYPES[getRandomInt(0, QUEUE_TYPES.length - 1)].type
    };
  });
}

export function generateQueueAlerts(): QueueAlert[] {
  const severities: ('success' | 'warning' | 'error')[] = ['success', 'warning', 'error'];
  const metrics = ['Queue Depth', 'Latency', 'DLQ Size', 'Throughput', 'Error Rate'];
  
  return Array.from({ length: getRandomInt(5, 20) }, (_, i) => {
    const queueIndex = getRandomInt(0, QUEUE_TYPES.length - 1);
    const queue = QUEUE_TYPES[queueIndex];
    const severity = severities[getRandomInt(0, severities.length - 1)];
    const metric = metrics[getRandomInt(0, metrics.length - 1)];
    const value = getRandomFloat(1000, 100000);
    
    return {
      id: `alert-${i + 1}`,
      queueId: `queue-${queueIndex + 1}`,
      queueName: queue.name,
      timestamp: new Date(Date.now() - getRandomInt(0, 60 * 60 * 1000)),
      severity,
      message: `${queue.name} ${metric.toLowerCase()} ${severity === 'error' ? 'exceeded' : 'approaching'} threshold`,
      metric,
      value,
      threshold: value * (severity === 'error' ? 0.9 : 1.1),
      acknowledged: Math.random() > 0.7,
      acknowledgedAt: Math.random() > 0.5 ? new Date(Date.now() - getRandomInt(0, 30 * 60 * 1000)) : undefined
    };
  });
}