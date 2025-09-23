import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DatabaseGauge } from './DatabaseGauge';
import { LatencyChart } from './LatencyChart';
import { ConnectionHeatmap } from './ConnectionHeatmap';
import { ErrorLogTable } from './ErrorLogTable';
import { DrilldownModal } from './DrilldownModal';
import { 
  Database, 
  Zap, 
  Users, 
  AlertTriangle,
  Activity,
  Clock,
  Server
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TimeRange, FilterOptions, DatabaseMetrics as DBMetrics, DatabaseError, ReplicaLag } from '@/types/observability';

interface DatabaseMetricsProps {
  timeRange: TimeRange;
  filters: FilterOptions;
  isLive: boolean;
}

export const DatabaseMetrics: React.FC<DatabaseMetricsProps> = ({
  timeRange,
  filters,
  isLive
}) => {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [drilldownData, setDrilldownData] = useState<any>(null);

  // Mock data - in real app, this would come from API
  const [metrics, setMetrics] = useState<DBMetrics>({
    queryLatency: {
      avg: 247,
      p50: 180,
      p95: 420,
      p99: 850,
      trend: [220, 240, 260, 245, 230, 247, 255, 248, 242, 247]
    },
    activeConnections: {
      percentage: 67,
      used: 134,
      total: 200,
      trend: [60, 62, 65, 68, 70, 67, 69, 66, 64, 67]
    },
    replicationLag: {
      avg: 125,
      replicas: [
        { name: 'Replica-1', lag: 95, status: 'healthy' },
        { name: 'Replica-2', lag: 140, status: 'warning' },
        { name: 'Replica-3', lag: 340, status: 'critical' }
      ],
      trend: [110, 115, 120, 125, 130, 125, 128, 122, 120, 125]
    },
    errorRate: {
      percentage: 2.3,
      count: 23,
      total: 1000,
      trend: [1.8, 2.1, 2.5, 2.3, 2.0, 2.3, 2.6, 2.4, 2.1, 2.3]
    }
  });

  const [errors] = useState<DatabaseError[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 300000),
      query: 'SELECT * FROM templates WHERE user_id = ? AND status = ?',
      errorCode: 'TIMEOUT_ERROR',
      service: 'Template Service',
      retryCount: 2,
      severity: 'warning',
      acknowledged: false
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 600000),
      query: 'INSERT INTO message_queue (recipient, content, priority) VALUES (?, ?, ?)',
      errorCode: 'CONSTRAINT_VIOLATION',
      service: 'Message Queue',
      retryCount: 0,
      severity: 'critical',
      acknowledged: false
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 900000),
      query: 'UPDATE delivery_status SET status = ? WHERE message_id = ?',
      errorCode: 'DEADLOCK_DETECTED',
      service: 'Delivery Processor',
      retryCount: 3,
      severity: 'critical',
      acknowledged: true
    }
  ]);

  // Auto-refresh for live data
  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        // Simulate real-time updates
        setMetrics(prev => ({
          ...prev,
          queryLatency: {
            ...prev.queryLatency,
            avg: prev.queryLatency.avg + (Math.random() - 0.5) * 20,
            trend: [...prev.queryLatency.trend.slice(1), prev.queryLatency.avg + (Math.random() - 0.5) * 20]
          },
          activeConnections: {
            ...prev.activeConnections,
            percentage: Math.max(0, Math.min(100, prev.activeConnections.percentage + (Math.random() - 0.5) * 5)),
          }
        }));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isLive]);

  const handleGaugeClick = (metric: string) => {
    setSelectedMetric(metric);
    // Set drilldown data based on metric
    switch (metric) {
      case 'latency':
        setDrilldownData({
          title: 'Query Latency Breakdown',
          type: 'latency-timeline',
          data: metrics.queryLatency
        });
        break;
      case 'connections':
        setDrilldownData({
          title: 'Connection Pool Details',
          type: 'connection-details',
          data: metrics.activeConnections
        });
        break;
      case 'replication':
        setDrilldownData({
          title: 'Replication Status',
          type: 'replication-timeline',
          data: metrics.replicationLag
        });
        break;
      case 'errors':
        setDrilldownData({
          title: 'Error Rate Analysis',
          type: 'error-analysis',
          data: metrics.errorRate
        });
        break;
    }
  };

  const getReplicaColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'hsl(var(--status-success))';
      case 'warning': return 'hsl(var(--status-warning))';
      case 'critical': return 'hsl(var(--status-error))';
      default: return 'hsl(var(--muted))';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Row: Status Gauges */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <DatabaseGauge
            title="Query Latency"
            value={metrics.queryLatency.avg}
            unit="ms"
            icon={Zap}
            onClick={() => handleGaugeClick('latency')}
            thresholds={{ good: 200, warning: 500 }}
            trend={metrics.queryLatency.trend}
            subtitle={`p95: ${metrics.queryLatency.p95}ms`}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <DatabaseGauge
            title="Active Connections"
            value={metrics.activeConnections.percentage}
            unit="%"
            icon={Users}
            onClick={() => handleGaugeClick('connections')}
            thresholds={{ good: 70, warning: 85 }}
            trend={metrics.activeConnections.trend}
            subtitle={`${metrics.activeConnections.used}/${metrics.activeConnections.total}`}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <DatabaseGauge
            title="Replication Lag"
            value={metrics.replicationLag.avg}
            unit="ms"
            icon={Database}
            onClick={() => handleGaugeClick('replication')}
            thresholds={{ good: 100, warning: 500 }}
            trend={metrics.replicationLag.trend}
            subtitle={`${metrics.replicationLag.replicas.length} replicas`}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <DatabaseGauge
            title="Error Rate"
            value={metrics.errorRate.percentage}
            unit="%"
            icon={AlertTriangle}
            onClick={() => handleGaugeClick('errors')}
            thresholds={{ good: 1, warning: 5 }}
            trend={metrics.errorRate.trend}
            subtitle={`${metrics.errorRate.count} errors`}
          />
        </motion.div>
      </motion.div>

      {/* Middle Row: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <LatencyChart timeRange={timeRange} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <ConnectionHeatmap timeRange={timeRange} />
        </motion.div>
      </div>

      {/* Bottom Row: Replication & Errors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Replication Lag Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Server className="w-5 h-5" />
                Replication Lag by Replica
                <Badge variant="secondary" className="ml-auto">
                  {timeRange === 'live' ? 'Live' : timeRange}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics.replicationLag.replicas} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      width={80}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value: any, name: string) => [`${value}ms`, 'Lag']}
                    />
                    <Bar dataKey="lag" name="Replication Lag (ms)">
                      {metrics.replicationLag.replicas.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getReplicaColor(entry.status)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Error Log Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <ErrorLogTable 
            errors={errors}
            onErrorClick={(error) => {
              setSelectedMetric('error-detail');
              setDrilldownData({
                title: 'Error Details',
                type: 'error-detail',
                data: error
              });
            }}
          />
        </motion.div>
      </div>

      {/* Drilldown Modal */}
      <DrilldownModal
        isOpen={!!selectedMetric}
        onClose={() => {
          setSelectedMetric(null);
          setDrilldownData(null);
        }}
        title={drilldownData?.title}
        type={drilldownData?.type}
        data={drilldownData?.data}
      />
    </div>
  );
};