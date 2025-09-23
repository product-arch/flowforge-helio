import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QueueMetrics } from '@/types/queue-dashboard';
import { AlertTriangle, CheckCircle, XCircle, Eye } from 'lucide-react';

interface QueueHealthCardsProps {
  queues: QueueMetrics[];
  onViewDetails: (queueId: string, queueName: string) => void;
}

const QueueHealthCards: React.FC<QueueHealthCardsProps> = ({ queues, onViewDetails }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'critical':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'border-green-500 bg-green-50 dark:bg-green-950';
      case 'warning':
        return 'border-amber-500 bg-amber-50 dark:bg-amber-950';
      case 'critical':
        return 'border-red-500 bg-red-50 dark:bg-red-950';
      default:
        return 'border-gray-300';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatLatency = (ms: number) => {
    if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`;
    return `${ms.toFixed(0)}ms`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {queues.map((queue) => (
        <Card 
          key={queue.id} 
          className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${getStatusColor(queue.status)}`}
          onClick={() => onViewDetails(queue.id, queue.name)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">{queue.name}</CardTitle>
              <div className="flex items-center gap-2">
                {getStatusIcon(queue.status)}
                <Badge variant={queue.status === 'healthy' ? 'default' : queue.status === 'warning' ? 'secondary' : 'destructive'}>
                  {queue.status}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Queue Depth</p>
                <p className="font-semibold text-lg">{formatNumber(queue.depth)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">p95 Latency</p>
                <p className="font-semibold text-lg">{formatLatency(queue.p95Latency)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Dead Letters</p>
                <p className="font-semibold text-lg text-red-600">{formatNumber(queue.dlqMessages)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Throughput</p>
                <p className="font-semibold text-lg">{formatNumber(queue.dequeueRate)}/s</p>
              </div>
            </div>
            
            <div className="pt-2 border-t">
              <Button variant="outline" size="sm" className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QueueHealthCards;