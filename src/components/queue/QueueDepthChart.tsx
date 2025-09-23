import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QueueMetrics } from '@/types/queue-dashboard';

interface QueueDepthChartProps {
  queues: QueueMetrics[];
  onQueueClick: (queueId: string, queueName: string) => void;
}

const QueueDepthChart: React.FC<QueueDepthChartProps> = ({ queues, onQueueClick }) => {
  const chartData = queues.map(queue => ({
    name: queue.name.replace(' Queue', ''),
    pending: queue.pendingMessages,
    retrying: queue.retryingMessages,
    dlq: queue.dlqMessages,
    queueId: queue.id,
    fullName: queue.name,
    status: queue.status
  }));

  const getBarColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'hsl(var(--chart-1))';
      case 'warning':
        return 'hsl(var(--chart-3))';
      case 'critical':
        return 'hsl(var(--chart-5))';
      default:
        return 'hsl(var(--chart-2))';
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-semibold mb-2">{data.fullName}</p>
          <div className="space-y-1 text-sm">
            <p className="flex justify-between gap-4">
              <span className="text-green-600">Pending:</span>
              <span className="font-mono">{data.pending.toLocaleString()}</span>
            </p>
            <p className="flex justify-between gap-4">
              <span className="text-amber-600">Retrying:</span>
              <span className="font-mono">{data.retrying.toLocaleString()}</span>
            </p>
            <p className="flex justify-between gap-4">
              <span className="text-red-600">DLQ:</span>
              <span className="font-mono">{data.dlq.toLocaleString()}</span>
            </p>
            <div className="border-t pt-1 mt-2">
              <p className="flex justify-between gap-4 font-semibold">
                <span>Total:</span>
                <span className="font-mono">{(data.pending + data.retrying + data.dlq).toLocaleString()}</span>
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Click to drill down</p>
        </div>
      );
    }
    return null;
  };

  const handleBarClick = (data: any) => {
    if (data && data.queueId) {
      onQueueClick(data.queueId, data.fullName);
    }
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Queue Depth Overview
          <span className="text-sm font-normal text-muted-foreground">
            (Pending + Retrying + DLQ)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--foreground))"
              fontSize={12}
              tick={{ fill: 'hsl(var(--foreground))' }}
            />
            <YAxis 
              stroke="hsl(var(--foreground))"
              fontSize={12}
              tick={{ fill: 'hsl(var(--foreground))' }}
              tickFormatter={(value) => value >= 1000 ? `${(value/1000).toFixed(0)}K` : value}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="pending" 
              stackId="a" 
              fill="hsl(var(--chart-1))" 
              name="Pending"
              onClick={handleBarClick}
              className="cursor-pointer"
            />
            <Bar 
              dataKey="retrying" 
              stackId="a" 
              fill="hsl(var(--chart-3))" 
              name="Retrying"
              onClick={handleBarClick}
              className="cursor-pointer"
            />
            <Bar 
              dataKey="dlq" 
              stackId="a" 
              fill="hsl(var(--chart-5))" 
              name="DLQ"
              onClick={handleBarClick}
              className="cursor-pointer"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default QueueDepthChart;