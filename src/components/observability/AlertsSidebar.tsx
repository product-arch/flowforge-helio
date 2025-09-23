import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Bell, AlertTriangle, Check, ExternalLink } from 'lucide-react';
import { TimeRange, FilterOptions, ObservabilityAlert } from '@/types/observability';

interface AlertsSidebarProps {
  timeRange: TimeRange;
  filters: FilterOptions;
}

export const AlertsSidebar: React.FC<AlertsSidebarProps> = ({
  timeRange,
  filters
}) => {
  const [alerts, setAlerts] = useState<ObservabilityAlert[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 120000),
      type: 'database',
      severity: 'critical',
      title: 'High Query Latency',
      message: 'Template Validation queries p95 latency > 500ms',
      source: 'Database Monitor',
      acknowledged: false,
      drilldownPath: 'database.latency'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 300000),
      type: 'api',
      severity: 'warning',
      title: 'API Endpoint Slowdown',
      message: '/template/submit endpoint p95 latency > 1000ms',
      source: 'API Gateway',
      acknowledged: false,
      drilldownPath: 'api.latency'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 480000),
      type: 'database',
      severity: 'warning',
      title: 'Connection Pool Usage High',
      message: 'Node-3 connection pool usage at 92%',
      source: 'Connection Monitor',
      acknowledged: false,
      drilldownPath: 'database.connections'
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 600000),
      type: 'service',
      severity: 'info',
      title: 'Service Restart',
      message: 'Template Service restarted successfully',
      source: 'Service Monitor',
      acknowledged: true,
      acknowledgedAt: new Date(Date.now() - 580000)
    },
    {
      id: '5',
      timestamp: new Date(Date.now() - 780000),
      type: 'api',
      severity: 'critical',
      title: 'API Error Rate Spike',
      message: 'API Gateway error rate increased to 12%',
      source: 'Error Monitor',
      acknowledged: true,
      acknowledgedAt: new Date(Date.now() - 720000)
    }
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'warning': return 'bg-status-warning/10 text-status-warning border-status-warning/20';
      case 'critical': return 'bg-status-error/10 text-status-error border-status-error/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return '🔴';
      case 'warning': return '🟡';
      case 'info': return '🔵';
      default: return '⚪';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'database': return '💾';
      case 'api': return '🌐';
      case 'service': return '⚙️';
      default: return '📊';
    }
  };

  const handleAcknowledge = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, acknowledged: true, acknowledgedAt: new Date() }
        : alert
    ));
  };

  const handleDrillDown = (alert: ObservabilityAlert) => {
    console.log('Drilling down into alert:', alert);
    // In real app, this would navigate to the specific chart/metric
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filters.severity && filters.severity.length > 0) {
      return filters.severity.includes(alert.severity as any);
    }
    return true;
  });

  const unacknowledgedCount = filteredAlerts.filter(alert => !alert.acknowledged).length;

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Live Alerts
          <Badge variant="secondary" className="ml-auto">
            {unacknowledgedCount} active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[600px] px-6">
          <div className="space-y-3">
            {filteredAlerts.map((alert, index) => (
              <div key={alert.id}>
                <div 
                  className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                    alert.acknowledged 
                      ? 'bg-muted/5 border-muted/20 opacity-60' 
                      : 'bg-card border-border/50 hover:border-border'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{getSeverityIcon(alert.severity)}</span>
                      <span className="text-xs">{getTypeIcon(alert.type)}</span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getSeverityColor(alert.severity)}`}
                      >
                        {alert.severity}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(alert.timestamp)}
                    </span>
                  </div>

                  <h4 className="font-medium text-sm text-foreground mb-1">
                    {alert.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    {alert.message}
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Source: {alert.source}
                  </p>

                  {alert.acknowledged ? (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="w-3 h-3" />
                      Acknowledged {alert.acknowledgedAt && formatTimeAgo(alert.acknowledgedAt)}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleAcknowledge(alert.id)}
                        className="h-6 px-2 text-xs"
                      >
                        <Check className="w-3 h-3 mr-1" />
                        Acknowledge
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDrillDown(alert)}
                        className="h-6 px-2 text-xs"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Drill Down
                      </Button>
                    </div>
                  )}
                </div>
                {index < filteredAlerts.length - 1 && <Separator className="my-3" />}
              </div>
            ))}
          </div>

          {filteredAlerts.length === 0 && (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              <div className="text-center">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No alerts match current filters</p>
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Alert Summary */}
        <div className="p-4 border-t border-border/50 bg-muted/5">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-status-error">
                {filteredAlerts.filter(a => a.severity === 'critical' && !a.acknowledged).length}
              </div>
              <div className="text-xs text-muted-foreground">Critical</div>
            </div>
            <div>
              <div className="text-lg font-bold text-status-warning">
                {filteredAlerts.filter(a => a.severity === 'warning' && !a.acknowledged).length}
              </div>
              <div className="text-xs text-muted-foreground">Warning</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-500">
                {filteredAlerts.filter(a => a.severity === 'info' && !a.acknowledged).length}
              </div>
              <div className="text-xs text-muted-foreground">Info</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};