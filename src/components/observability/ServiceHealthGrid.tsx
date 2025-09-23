import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ServiceMetrics, ServiceHealth } from '@/types/observability';
import { Server, Zap, TrendingUp, AlertTriangle } from 'lucide-react';

interface ServiceHealthGridProps {
  services: ServiceMetrics;
  onServiceClick: (serviceName: string) => void;
}

export const ServiceHealthGrid: React.FC<ServiceHealthGridProps> = ({
  services,
  onServiceClick
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-status-success/10 text-status-success border-status-success/20';
      case 'warning': return 'bg-status-warning/10 text-status-warning border-status-warning/20';
      case 'critical': return 'bg-status-error/10 text-status-error border-status-error/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getGradient = (status: string) => {
    switch (status) {
      case 'healthy': return 'from-status-success/20 to-status-success/5';
      case 'warning': return 'from-status-warning/20 to-status-warning/5';
      case 'critical': return 'from-status-error/20 to-status-error/5';
      default: return 'from-muted/20 to-muted/5';
    }
  };

  const renderSparkline = (trend: number[]) => {
    const points = trend.map((value, index) => {
      const x = (index / (trend.length - 1)) * 60;
      const maxValue = Math.max(...trend);
      const minValue = Math.min(...trend);
      const range = maxValue - minValue || 1;
      const y = 16 - ((value - minValue) / range) * 16;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width="60" height="16" className="opacity-70">
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  const ServiceTile: React.FC<{ serviceKey: string; service: ServiceHealth }> = ({ serviceKey, service }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className={`cursor-pointer transition-all duration-300 hover:shadow-lg bg-gradient-to-br ${getGradient(service.status)} border-border/50 hover:border-border`}
        onClick={() => onServiceClick(serviceKey)}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-background/50">
                <Server className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{service.name}</h3>
                <p className="text-xs text-muted-foreground">Service Health</p>
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={getStatusColor(service.status)}
            >
              {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
            </Badge>
          </div>

          <div className="space-y-4">
            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Zap className="w-3 h-3 text-muted-foreground mr-1" />
                </div>
                <div className="text-lg font-bold text-foreground">{service.latency}ms</div>
                <div className="text-xs text-muted-foreground">Latency</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <TrendingUp className="w-3 h-3 text-muted-foreground mr-1" />
                </div>
                <div className="text-lg font-bold text-foreground">{service.throughput.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">RPS</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <AlertTriangle className="w-3 h-3 text-muted-foreground mr-1" />
                </div>
                <div className="text-lg font-bold text-foreground">{service.errorRate}%</div>
                <div className="text-xs text-muted-foreground">Errors</div>
              </div>
            </div>

            {/* Trend Sparkline */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Trend</span>
              <div className="text-muted-foreground">
                {renderSparkline(service.trend)}
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center justify-center pt-2 border-t border-border/30">
              <div 
                className="w-2 h-2 rounded-full mr-2"
                style={{ 
                  backgroundColor: service.status === 'healthy' ? 'hsl(var(--status-success))' :
                    service.status === 'warning' ? 'hsl(var(--status-warning))' :
                    'hsl(var(--status-error))'
                }}
              />
              <span className="text-xs text-muted-foreground">
                {service.status === 'healthy' ? 'All systems operational' :
                 service.status === 'warning' ? 'Performance degraded' :
                 'Critical issues detected'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <ServiceTile serviceKey="apiGateway" service={services.apiGateway} />
      <ServiceTile serviceKey="routingEngine" service={services.routingEngine} />
      <ServiceTile serviceKey="templateService" service={services.templateService} />
      <ServiceTile serviceKey="deliveryProcessor" service={services.deliveryProcessor} />
    </div>
  );
};