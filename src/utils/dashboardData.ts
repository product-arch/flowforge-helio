import { SystemMetrics, Alert, TimeSeriesData, NetworkData, DiskData, ServiceData, NodeBreakdown } from '@/types/dashboard';

// Generate realistic system metrics
export const generateSystemMetrics = (): SystemMetrics => {
  const now = new Date();
  const timePoints = 20;
  
  // Generate time series data
  const timeSeriesData: TimeSeriesData[] = [];
  for (let i = timePoints - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 30000).toLocaleTimeString();
    timeSeriesData.push({
      timestamp,
      cpu: Math.random() * 30 + 50, // 50-80%
      memory: Math.random() * 25 + 60, // 60-85%
      node1_cpu: Math.random() * 20 + 45,
      node1_memory: Math.random() * 20 + 55,
      node2_cpu: Math.random() * 25 + 50,
      node2_memory: Math.random() * 30 + 50,
      node3_cpu: Math.random() * 15 + 60,
      node3_memory: Math.random() * 25 + 65,
    });
  }

  // Generate network data
  const networkData: NetworkData[] = [];
  for (let i = timePoints - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 30000).toLocaleTimeString();
    networkData.push({
      timestamp,
      inbound: Math.random() * 100 + 200, // 200-300 Mbps
      outbound: Math.random() * 80 + 150, // 150-230 Mbps
      packets_in: Math.random() * 10000 + 5000,
      packets_out: Math.random() * 8000 + 4000,
    });
  }

  // Generate disk data
  const diskData: DiskData[] = [
    {
      partition: '/var/logs',
      used: 145,
      total: 200,
      percentage: 72,
      iops: 1250,
      latency: 4.2
    },
    {
      partition: '/var/data',
      used: 380,
      total: 500,
      percentage: 76,
      iops: 2100,
      latency: 2.8
    },
    {
      partition: '/tmp',
      used: 12,
      total: 50,
      percentage: 24,
      iops: 450,
      latency: 1.2
    },
    {
      partition: '/opt/apps',
      used: 89,
      total: 100,
      percentage: 89,
      iops: 1800,
      latency: 6.1
    }
  ];

  // Generate service data
  const serviceData: ServiceData[] = [];
  for (let i = timePoints - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 30000).toLocaleTimeString();
    serviceData.push({
      timestamp,
      routing_engine: Math.random() * 100 + 150, // Response time in ms
      template_service: Math.random() * 80 + 100,
      vendor_connector: Math.random() * 120 + 200,
      db_layer: Math.random() * 60 + 80,
    });
  }

  // Generate current values
  const cpu = Math.round(Math.random() * 30 + 50);
  const memory = Math.round(Math.random() * 25 + 60);
  const disk = Math.round(Math.random() * 20 + 65);
  const network = Math.round(Math.random() * 15 + 70);

  // Generate sparkline history (last 60 seconds)
  const generateSparkline = (base: number) => {
    return Array.from({ length: 60 }, () => 
      Math.max(0, Math.min(100, base + (Math.random() - 0.5) * 20))
    );
  };

  const nodeBreakdown: NodeBreakdown[] = [
    { node: 'Node-1', cpu: 62, memory: 71, disk: 68, network: 74 },
    { node: 'Node-2', cpu: 58, memory: 65, disk: 72, network: 69 },
    { node: 'Node-3', cpu: 75, memory: 82, disk: 59, network: 77 },
  ];

  return {
    cpu,
    memory,
    disk,
    network,
    cpuHistory: generateSparkline(cpu),
    memoryHistory: generateSparkline(memory),
    diskHistory: generateSparkline(disk),
    networkHistory: generateSparkline(network),
    timeSeriesData,
    networkData,
    diskData,
    serviceData,
    nodeBreakdown
  };
};

// Generate realistic alerts
export const generateAlerts = (count: number = 10): Alert[] => {
  const alertTemplates = [
    { metric: 'CPU', message: 'High CPU usage detected', nodes: ['Node-1', 'Node-2', 'Node-3'] },
    { metric: 'Memory', message: 'Memory usage above threshold', nodes: ['Node-1', 'Node-2', 'Node-3'] },
    { metric: 'Disk', message: 'Disk space running low', nodes: ['Node-1', 'Node-2', 'Node-3'] },
    { metric: 'Network', message: 'Network latency spike detected', nodes: ['Node-1', 'Node-2', 'Node-3'] },
    { metric: 'Service', message: 'Service response time degraded', nodes: ['Routing-Engine', 'Template-Service', 'Vendor-Connector'] },
    { metric: 'Database', message: 'Database connection timeout', nodes: ['DB-Primary', 'DB-Replica'] },
    { metric: 'API', message: 'API rate limit exceeded', nodes: ['API-Gateway'] },
    { metric: 'Storage', message: 'Storage I/O bottleneck', nodes: ['Storage-Cluster'] }
  ];

  const alerts: Alert[] = [];
  
  for (let i = 0; i < count; i++) {
    const template = alertTemplates[Math.floor(Math.random() * alertTemplates.length)];
    const node = template.nodes[Math.floor(Math.random() * template.nodes.length)];
    const severity = Math.random() < 0.2 ? 'error' : Math.random() < 0.5 ? 'warning' : 'success';
    const value = severity === 'error' ? Math.random() * 15 + 85 : 
                  severity === 'warning' ? Math.random() * 15 + 70 : 
                  Math.random() * 70 + 10;
    
    const timestamp = new Date(Date.now() - Math.random() * 3600000); // Last hour
    
    alerts.push({
      id: `alert-${i}-${Date.now()}`,
      timestamp,
      severity,
      message: `${template.message} on ${node}`,
      node,
      metric: template.metric,
      value: Math.round(value),
      acknowledged: Math.random() < 0.3, // 30% chance of being acknowledged
      acknowledgedAt: Math.random() < 0.3 ? new Date(timestamp.getTime() + Math.random() * 1800000) : undefined,
      details: `${template.metric} utilization reached ${Math.round(value)}% at ${timestamp.toLocaleTimeString()}`
    });
  }

  // Sort by timestamp (newest first)
  return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};