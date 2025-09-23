import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert } from '@/types/dashboard';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Check, 
  Eye,
  Bell,
  Activity
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AlertsFeedProps {
  alerts: Alert[];
  onAcknowledge: (alertId: string) => void;
  onDrillDown: (alertId: string) => void;
}

export const AlertsFeed: React.FC<AlertsFeedProps> = ({
  alerts,
  onAcknowledge,
  onDrillDown
}) => {
  const getSeverityIcon = (severity: Alert['severity']) => {
    switch (severity) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-status-success" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-status-warning" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-status-error" />;
    }
  };

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'success':
        return 'bg-status-success/10 border-status-success/20';
      case 'warning':
        return 'bg-status-warning/10 border-status-warning/20';
      case 'error':
        return 'bg-status-error/10 border-status-error/20';
    }
  };

  const getSeverityDot = (severity: Alert['severity']) => {
    switch (severity) {
      case 'success':
        return 'bg-status-success';
      case 'warning':
        return 'bg-status-warning';
      case 'error':
        return 'bg-status-error';
    }
  };

  const activeAlerts = alerts.filter(alert => !alert.acknowledged);
  const acknowledgedAlerts = alerts.filter(alert => alert.acknowledged);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border bg-card/50">
        <div className="flex items-center gap-2 mb-2">
          <Bell className="w-5 h-5 text-foreground" />
          <h3 className="font-semibold text-foreground">Live Alerts</h3>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-status-error animate-pulse" />
            <span className="text-muted-foreground">
              {activeAlerts.filter(a => a.severity === 'error').length} Critical
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-status-warning" />
            <span className="text-muted-foreground">
              {activeAlerts.filter(a => a.severity === 'warning').length} Warning
            </span>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {/* Active Alerts */}
          {activeAlerts.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Active ({activeAlerts.length})
              </h4>
              {activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`relative p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${getSeverityColor(alert.severity)}`}
                >
                  {/* Severity indicator */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${getSeverityDot(alert.severity)}`} />
                  
                  <div className="pl-2">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getSeverityIcon(alert.severity)}
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {alert.node}
                      </Badge>
                    </div>
                    
                    <p className="text-sm font-medium text-foreground mb-2">
                      {alert.message}
                    </p>
                    
                    <div className="text-xs text-muted-foreground mb-3">
                      {alert.metric}: {alert.value}%
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onAcknowledge(alert.id)}
                        className="text-xs h-7"
                      >
                        <Check className="w-3 h-3 mr-1" />
                        Acknowledge
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDrillDown(alert.id)}
                        className="text-xs h-7"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Drill Down
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Acknowledged Alerts */}
          {acknowledgedAlerts.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Check className="w-4 h-4" />
                Acknowledged ({acknowledgedAlerts.length})
              </h4>
              {acknowledgedAlerts.slice(0, 5).map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 rounded-lg border border-border/30 bg-muted/20 opacity-60"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-status-success" />
                      <span className="text-xs text-muted-foreground">
                        Acknowledged {alert.acknowledgedAt && formatDistanceToNow(alert.acknowledgedAt, { addSuffix: true })}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs opacity-60">
                      {alert.node}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {alert.message}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {alerts.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 text-status-success mx-auto mb-4 opacity-50" />
              <p className="text-sm text-muted-foreground">
                All systems operational
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                No active alerts
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};