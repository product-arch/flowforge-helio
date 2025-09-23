import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { QueueMetrics, TimeSeriesQueueData, TimeRange } from '@/types/queue-dashboard';
import QueuePerformanceCharts from './QueuePerformanceCharts';

interface QueueDrilldownViewProps {
  queue: QueueMetrics | null;
  timeSeriesData: TimeSeriesQueueData[];
  timeRange: TimeRange;
  onBack: () => void;
}

const QueueDrilldownView: React.FC<QueueDrilldownViewProps> = ({
  queue,
  timeSeriesData,
  timeRange,
  onBack
}) => {
  if (!queue) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Queue not found</p>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatLatency = (ms: number) => {
    if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`;
    return `${ms.toFixed(0)}ms`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'critical':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTrendData = () => {
    if (timeSeriesData.length < 2) return null;
    
    const recent = timeSeriesData.slice(-10);
    const older = timeSeriesData.slice(-20, -10);
    
    const recentAvgDepth = recent.reduce((sum, d) => sum + d.depth, 0) / recent.length;
    const olderAvgDepth = older.reduce((sum, d) => sum + d.depth, 0) / older.length;
    
    const recentAvgLatency = recent.reduce((sum, d) => sum + d.p95Latency, 0) / recent.length;
    const olderAvgLatency = older.reduce((sum, d) => sum + d.p95Latency, 0) / older.length;
    
    return {
      depthTrend: ((recentAvgDepth - olderAvgDepth) / olderAvgDepth) * 100,
      latencyTrend: ((recentAvgLatency - olderAvgLatency) / olderAvgLatency) * 100
    };
  };

  const trendData = getTrendData();

  const getLatencyHealthBand = (latency: number) => {
    if (latency < 1000) return { color: 'text-green-600', label: 'Healthy' };
    if (latency < 3000) return { color: 'text-amber-600', label: 'Warning' };
    return { color: 'text-red-600', label: 'Critical' };
  };

  const latencyHealth = getLatencyHealthBand(queue.p95Latency);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Overview
          </Button>
          <div className="flex items-center gap-3">
            {getStatusIcon(queue.status)}
            <div>
              <h1 className="text-2xl font-bold">{queue.name}</h1>
              <p className="text-muted-foreground">Detailed Queue Metrics</p>
            </div>
          </div>
        </div>
        <Badge 
          variant={queue.status === 'healthy' ? 'default' : queue.status === 'warning' ? 'secondary' : 'destructive'}
          className="text-sm px-3 py-1"
        >
          {queue.status.toUpperCase()}
        </Badge>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Queue Depth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(queue.depth)}</div>
            <div className="text-xs text-muted-foreground mt-1">
              P: {formatNumber(queue.pendingMessages)} | 
              R: {formatNumber(queue.retryingMessages)} | 
              DLQ: {formatNumber(queue.dlqMessages)}
            </div>
            {trendData && (
              <div className={`text-xs mt-1 ${trendData.depthTrend > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {trendData.depthTrend > 0 ? '↗' : '↘'} {Math.abs(trendData.depthTrend).toFixed(1)}% vs prev period
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">p95 Latency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${latencyHealth.color}`}>
              {formatLatency(queue.p95Latency)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              p50: {formatLatency(queue.p50Latency)} | 
              p99: {formatLatency(queue.p99Latency)}
            </div>
            <div className={`text-xs mt-1 ${latencyHealth.color}`}>
              {latencyHealth.label}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Throughput</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(queue.dequeueRate)}/s</div>
            <div className="text-xs text-muted-foreground mt-1">
              In: {formatNumber(queue.enqueueRate)}/s | 
              Out: {formatNumber(queue.dequeueRate)}/s
            </div>
            <div className={`text-xs mt-1 ${queue.enqueueRate > queue.dequeueRate ? 'text-amber-600' : 'text-green-600'}`}>
              {queue.enqueueRate > queue.dequeueRate ? 'Backlog growing' : 'Backlog stable'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Dead Letters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatNumber(queue.dlqMessages)}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {((queue.dlqMessages / queue.depth) * 100).toFixed(1)}% of total
            </div>
            <div className="text-xs mt-1 text-muted-foreground">
              Last updated: {queue.lastUpdated.toLocaleTimeString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Performance Charts */}
      <QueuePerformanceCharts 
        data={timeSeriesData}
        timeRange={timeRange}
      />

      {/* Queue Health Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Queue Health Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-semibold">Healthy Periods</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Latency &lt; 1s, Normal queue depth, No critical errors
                </p>
              </div>
              
              <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="font-semibold">Warning Periods</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Latency 1-3s, Elevated queue depth, Increased retries
                </p>
              </div>
              
              <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="font-semibold">Critical Periods</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Latency &gt; 3s, High queue depth, DLQ accumulation
                </p>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              <p>💡 <strong>Optimization Tips:</strong></p>
              <ul className="list-disc list-inside space-y-1 mt-1">
                <li>Monitor p95 latency closely - it's often the first indicator of issues</li>
                <li>High retry rates may indicate vendor issues or configuration problems</li>
                <li>DLQ accumulation requires immediate attention to prevent message loss</li>
                <li>Compare enqueue vs dequeue rates to identify bottlenecks</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QueueDrilldownView;