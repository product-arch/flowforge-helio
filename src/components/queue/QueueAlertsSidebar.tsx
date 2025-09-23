import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { QueueAlert } from '@/types/queue-dashboard';
import { AlertCircle, CheckCircle, Info, Eye, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QueueAlertsSidebarProps {
  alerts: QueueAlert[];
  onAcknowledge: (alertId: string) => void;
  onDrillDown: (queueId: string, queueName: string, alertId: string) => void;
}

const QueueAlertsSidebar: React.FC<QueueAlertsSidebarProps> = ({
  alerts,
  onAcknowledge,
  onDrillDown
}) => {
  const { toast } = useToast();

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: string, acknowledged: boolean) => {
    const opacity = acknowledged ? 'opacity-50' : '';
    switch (severity) {
      case 'error':
        return `border-red-500 bg-red-50 dark:bg-red-950 ${opacity}`;
      case 'warning':
        return `border-amber-500 bg-amber-50 dark:bg-amber-950 ${opacity}`;
      case 'success':
        return `border-green-500 bg-green-50 dark:bg-green-950 ${opacity}`;
      default:
        return `border-blue-500 bg-blue-50 dark:bg-blue-950 ${opacity}`;
    }
  };

  const handleAcknowledge = (alertId: string, queueName: string) => {
    onAcknowledge(alertId);
    toast({
      title: "Alert Acknowledged",
      description: `${queueName} alert has been acknowledged`,
      className: "border-status-success bg-status-success/10 text-status-success"
    });
  };

  const handleDrillDown = (alert: QueueAlert) => {
    onDrillDown(alert.queueId, alert.queueName, alert.id);
    toast({
      title: "Queue Focus",
      description: `Viewing detailed metrics for ${alert.queueName}`,
      className: "border-status-info bg-status-info/10 text-status-info"
    });
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const formatValue = (value: number, metric: string) => {
    if (metric.toLowerCase().includes('latency')) {
      return value >= 1000 ? `${(value / 1000).toFixed(1)}s` : `${value.toFixed(0)}ms`;
    }
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  const activeAlerts = alerts.filter(alert => !alert.acknowledged);
  const acknowledgedAlerts = alerts.filter(alert => alert.acknowledged);

  return (
    <div className="w-80 space-y-4">
      {/* Active Alerts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            Live Alerts
            {activeAlerts.length > 0 && (
              <Badge variant="destructive" className="ml-auto">
                {activeAlerts.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            {activeAlerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <p className="text-sm">No active alerts</p>
                <p className="text-xs">All systems healthy</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border-2 transition-all hover:shadow-md ${getSeverityColor(alert.severity, false)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getSeverityIcon(alert.severity)}
                        <span className="text-sm font-semibold">{alert.queueName}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(alert.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-sm mb-2">{alert.message}</p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span>{alert.metric}: {formatValue(alert.value, alert.metric)}</span>
                      {alert.threshold && (
                        <span>Threshold: {formatValue(alert.threshold, alert.metric)}</span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleAcknowledge(alert.id, alert.queueName)}
                      >
                        <Check className="w-3 h-3 mr-1" />
                        Ack
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDrillDown(alert)}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Drill
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Acknowledged Alerts */}
      {acknowledgedAlerts.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Check className="w-4 h-4" />
              Acknowledged ({acknowledgedAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-32">
              <div className="space-y-2">
                {acknowledgedAlerts.slice(0, 5).map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-2 rounded border ${getSeverityColor(alert.severity, true)}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">{alert.queueName}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(alert.acknowledgedAt || alert.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {alert.message}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QueueAlertsSidebar;