import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SystemMetrics, ServiceType } from '@/types/dashboard';
import { SystemChart } from './SystemChart';
import { Server, Activity, Database, Zap, GitBranch } from 'lucide-react';

interface ServiceDrilldownProps {
  selectedService: ServiceType;
  onServiceChange: (service: ServiceType) => void;
  metrics: SystemMetrics;
}

export const ServiceDrilldown: React.FC<ServiceDrilldownProps> = ({
  selectedService,
  onServiceChange,
  metrics
}) => {
  const [compareMode, setCompareMode] = useState(false);
  const [compareService, setCompareService] = useState<ServiceType>('routing_engine');

  const serviceConfig = {
    all: { name: 'All Services', icon: Server, color: 'bg-primary/10 text-primary' },
    routing_engine: { name: 'Routing Engine', icon: GitBranch, color: 'bg-status-success/10 text-status-success' },
    template_service: { name: 'Template Service', icon: Activity, color: 'bg-status-warning/10 text-status-warning' },
    vendor_connector: { name: 'Vendor Connector', icon: Zap, color: 'bg-purple-500/10 text-purple-500' },
    db_layer: { name: 'Database Layer', icon: Database, color: 'bg-status-error/10 text-status-error' }
  };

  const getServiceMetrics = (service: ServiceType) => {
    if (service === 'all') {
      return {
        avgCpu: 65,
        peakCpu: 89,
        avgMemory: 72,
        errors: 12
      };
    }
    
    // Mock service-specific metrics
    const serviceMetrics = {
      routing_engine: { avgCpu: 58, peakCpu: 82, avgMemory: 65, errors: 3 },
      template_service: { avgCpu: 71, peakCpu: 94, avgMemory: 78, errors: 5 },
      vendor_connector: { avgCpu: 45, peakCpu: 67, avgMemory: 56, errors: 2 },
      db_layer: { avgCpu: 83, peakCpu: 96, avgMemory: 89, errors: 7 }
    };

    return serviceMetrics[service] || serviceMetrics.routing_engine;
  };

  const currentMetrics = getServiceMetrics(selectedService);
  const currentConfig = serviceConfig[selectedService];
  const IconComponent = currentConfig.icon;

  return (
    <Card className="bg-card/30 border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-3">
            <IconComponent className="w-6 h-6" />
            Service Performance Analysis
          </CardTitle>
          <div className="flex items-center gap-3">
            <Button
              variant={compareMode ? "default" : "outline"}
              size="sm"
              onClick={() => setCompareMode(!compareMode)}
            >
              {compareMode ? 'Exit Compare' : 'Compare Services'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Service Selector */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Primary Service
            </label>
            <Select value={selectedService} onValueChange={onServiceChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(serviceConfig).map(([value, config]) => (
                  <SelectItem key={value} value={value}>
                    <div className="flex items-center gap-2">
                      <config.icon className="w-4 h-4" />
                      {config.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {compareMode && (
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Compare With
              </label>
              <Select value={compareService} onValueChange={(value) => setCompareService(value as ServiceType)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(serviceConfig)
                    .filter(([value]) => value !== selectedService && value !== 'all')
                    .map(([value, config]) => (
                    <SelectItem key={value} value={value}>
                      <div className="flex items-center gap-2">
                        <config.icon className="w-4 h-4" />
                        {config.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Service KPIs */}
        <div className={`grid grid-cols-2 ${compareMode ? 'lg:grid-cols-4' : 'lg:grid-cols-4'} gap-4`}>
          <div className="bg-card/50 rounded-lg p-4 border border-border/50">
            <div className="text-sm text-muted-foreground mb-1">Avg CPU (24h)</div>
            <div className="text-2xl font-bold text-foreground">{currentMetrics.avgCpu}%</div>
          </div>
          <div className="bg-card/50 rounded-lg p-4 border border-border/50">
            <div className="text-sm text-muted-foreground mb-1">Peak CPU</div>
            <div className="text-2xl font-bold text-foreground">{currentMetrics.peakCpu}%</div>
          </div>
          <div className="bg-card/50 rounded-lg p-4 border border-border/50">
            <div className="text-sm text-muted-foreground mb-1">Avg Memory</div>
            <div className="text-2xl font-bold text-foreground">{currentMetrics.avgMemory}%</div>
          </div>
          <div className="bg-card/50 rounded-lg p-4 border border-border/50">
            <div className="text-sm text-muted-foreground mb-1">Recent Errors</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-foreground">{currentMetrics.errors}</div>
              <Badge variant={currentMetrics.errors > 5 ? "destructive" : "secondary"} className="text-xs">
                {currentMetrics.errors > 5 ? 'High' : 'Normal'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Service-specific Charts */}
        <div className={`grid grid-cols-1 ${compareMode ? 'lg:grid-cols-2' : 'lg:grid-cols-1'} gap-6`}>
          <div>
            <div className={`px-3 py-2 rounded-lg mb-4 ${currentConfig.color}`}>
              <div className="flex items-center gap-2">
                <IconComponent className="w-4 h-4" />
                <span className="font-medium">{currentConfig.name}</span>
              </div>
            </div>
            <SystemChart
              title={`${currentConfig.name} Performance`}
              type="line"
              data={metrics.serviceData}
              timeRange="1h"
            />
          </div>

          {compareMode && (
            <div>
              <div className={`px-3 py-2 rounded-lg mb-4 ${serviceConfig[compareService].color}`}>
                <div className="flex items-center gap-2">
                  {React.createElement(serviceConfig[compareService].icon, { className: "w-4 h-4" })}
                  <span className="font-medium">{serviceConfig[compareService].name}</span>
                </div>
              </div>
              <SystemChart
                title={`${serviceConfig[compareService].name} Performance`}
                type="line"
                data={metrics.serviceData}
                timeRange="1h"
              />
            </div>
          )}
        </div>

        {/* Service Health Summary */}
        <div className="bg-muted/30 rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-3">Service Health Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Status:</span>
              <Badge className="ml-2" variant={currentMetrics.avgCpu > 80 ? "destructive" : "secondary"}>
                {currentMetrics.avgCpu > 80 ? 'Critical' : 'Healthy'}
              </Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Response Time:</span>
              <span className="ml-2 text-foreground">~{Math.round(Math.random() * 200 + 50)}ms</span>
            </div>
            <div>
              <span className="text-muted-foreground">Uptime:</span>
              <span className="ml-2 text-foreground">99.{Math.floor(Math.random() * 10)}%</span>
            </div>
            <div>
              <span className="text-muted-foreground">Throughput:</span>
              <span className="ml-2 text-foreground">{Math.round(Math.random() * 1000 + 500)} req/min</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};