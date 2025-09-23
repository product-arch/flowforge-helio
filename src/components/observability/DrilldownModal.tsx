import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Clock, Database, AlertTriangle, Code, Copy, ArrowLeft } from 'lucide-react';

interface DrilldownModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  type?: string;
  data?: any;
}

export const DrilldownModal: React.FC<DrilldownModalProps> = ({
  isOpen,
  onClose,
  title,
  type,
  data
}) => {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const renderContent = () => {
    switch (type) {
      case 'latency-timeline':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-status-success">{data?.p50}ms</div>
                    <div className="text-sm text-muted-foreground">p50 Latency</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-status-warning">{data?.p95}ms</div>
                    <div className="text-sm text-muted-foreground">p95 Latency</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-status-error">{data?.p99}ms</div>
                    <div className="text-sm text-muted-foreground">p99 Latency</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">{data?.avg}ms</div>
                    <div className="text-sm text-muted-foreground">Average</div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Query Type Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { type: 'Template Validation', latency: 280, count: 1240 },
                      { type: 'DLR Lookup', latency: 150, count: 890 },
                      { type: 'Campaign Write', latency: 420, count: 560 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis dataKey="type" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="latency" fill="hsl(var(--primary))" name="Avg Latency (ms)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'connection-details':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">{data?.used}</div>
                    <div className="text-sm text-muted-foreground">Active Connections</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-muted-foreground">{data?.total}</div>
                    <div className="text-sm text-muted-foreground">Total Pool Size</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-status-warning">{data?.percentage}%</div>
                    <div className="text-sm text-muted-foreground">Pool Usage</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Service Connection Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { service: 'Template Service', connections: 45, percentage: 34 },
                    { service: 'Routing Engine', connections: 38, percentage: 28 },
                    { service: 'Message Queue', connections: 32, percentage: 24 },
                    { service: 'Delivery Processor', connections: 19, percentage: 14 }
                  ].map(service => (
                    <div key={service.service} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{service.service}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{service.connections} conn</span>
                        <Badge variant="outline">{service.percentage}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'error-detail':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Timestamp</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {data?.timestamp?.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Error Code</span>
                    </div>
                    <Badge variant="outline" className="text-sm">
                      {data?.errorCode}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Full Query
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleCopy(data?.fullQuery || data?.query)}
                    className="h-6 px-2"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted/50 p-3 rounded-lg overflow-x-auto">
                  {data?.fullQuery || data?.query}
                </pre>
              </CardContent>
            </Card>

            {data?.bindParameters && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Bind Parameters</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-muted/50 p-3 rounded-lg overflow-x-auto">
                    {JSON.stringify(data.bindParameters, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}

            {data?.stackTrace && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Stack Trace</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-muted/50 p-3 rounded-lg overflow-x-auto max-h-40">
                    {data.stackTrace}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Detailed metrics view</p>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="mr-2 h-6 w-6 p-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            {title || 'Metric Details'}
          </DialogTitle>
        </DialogHeader>
        
        <Separator />
        
        <div className="py-4">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};