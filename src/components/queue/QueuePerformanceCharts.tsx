import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TimeSeriesQueueData, TimeRange } from '@/types/queue-dashboard';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface QueuePerformanceChartsProps {
  data: TimeSeriesQueueData[];
  timeRange: TimeRange;
  onPointClick?: (timestamp: string, data: any) => void;
}

const QueuePerformanceCharts: React.FC<QueuePerformanceChartsProps> = ({ 
  data, 
  timeRange, 
  onPointClick 
}) => {
  const [zoomedData, setZoomedData] = useState<TimeSeriesQueueData[] | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const chartData = (zoomedData || data).map(item => ({
    ...item,
    time: new Date(item.timestamp).toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    })
  }));

  const handleZoomIn = (startIndex: number, endIndex: number) => {
    if (startIndex !== endIndex) {
      const zoomed = data.slice(startIndex, endIndex + 1);
      setZoomedData(zoomed);
      setIsZoomed(true);
    }
  };

  const handleResetZoom = () => {
    setZoomedData(null);
    setIsZoomed(false);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(entry.name.includes('Latency') ? 0 : 1)}
              {entry.name.includes('Latency') ? 'ms' : entry.name.includes('Rate') ? ' msg/s' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Latency Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Queue Latency Metrics</CardTitle>
            {isZoomed && (
              <Button variant="outline" size="sm" onClick={handleResetZoom}>
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--foreground))"
                fontSize={10}
                tick={{ fill: 'hsl(var(--foreground))' }}
              />
              <YAxis 
                stroke="hsl(var(--foreground))"
                fontSize={10}
                tick={{ fill: 'hsl(var(--foreground))' }}
                tickFormatter={(value) => `${value}ms`}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Threshold bands */}
              <ReferenceLine y={1000} stroke="hsl(var(--chart-1))" strokeDasharray="2 2" opacity={0.5} />
              <ReferenceLine y={3000} stroke="hsl(var(--chart-3))" strokeDasharray="2 2" opacity={0.5} />
              <ReferenceLine y={5000} stroke="hsl(var(--chart-5))" strokeDasharray="2 2" opacity={0.5} />
              
              <Line 
                type="monotone" 
                dataKey="p50Latency" 
                stroke="hsl(var(--chart-1))" 
                strokeWidth={2}
                name="p50 Latency"
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="p95Latency" 
                stroke="hsl(var(--chart-3))" 
                strokeWidth={2}
                name="p95 Latency"
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="p99Latency" 
                stroke="hsl(var(--chart-5))" 
                strokeWidth={2}
                name="p99 Latency"
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
          
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-chart-1 rounded"></div>
              {"< 1s: Healthy"}
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-chart-3 rounded"></div>
              {"1-3s: Warning"}
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-chart-5 rounded"></div>
              {"> 3s: Critical"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Throughput Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Queue Throughput</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--foreground))"
                fontSize={10}
                tick={{ fill: 'hsl(var(--foreground))' }}
              />
              <YAxis 
                stroke="hsl(var(--foreground))"
                fontSize={10}
                tick={{ fill: 'hsl(var(--foreground))' }}
                tickFormatter={(value) => `${value}/s`}
              />
              <Tooltip content={<CustomTooltip />} />
              
              <Line 
                type="monotone" 
                dataKey="enqueueRate" 
                stroke="hsl(var(--chart-2))" 
                strokeWidth={2}
                name="Enqueue Rate"
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="dequeueRate" 
                stroke="hsl(var(--chart-4))" 
                strokeWidth={2}
                name="Dequeue Rate"
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
          
          <div className="flex justify-center gap-6 text-xs text-muted-foreground mt-2">
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-chart-2 rounded"></div>
              Enqueue Rate
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-chart-4 rounded"></div>
              Dequeue Rate
            </span>
          </div>
          
          {chartData.length > 0 && (
            <div className="mt-2 text-xs text-muted-foreground text-center">
              {chartData.some(d => d.enqueueRate > d.dequeueRate) && (
                <span className="text-amber-600">⚠️ Backlog may be growing</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QueuePerformanceCharts;