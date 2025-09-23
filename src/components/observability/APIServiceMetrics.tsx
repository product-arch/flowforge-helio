import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ServiceHealthGrid } from './ServiceHealthGrid';
import { ErrorLogTable } from './ErrorLogTable';
import { DrilldownModal } from './DrilldownModal';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Server, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { TimeRange, FilterOptions, ServiceMetrics, APIError } from '@/types/observability';

interface APIServiceMetricsProps {
  timeRange: TimeRange;
  filters: FilterOptions;
  isLive: boolean;
}

export const APIServiceMetrics: React.FC<APIServiceMetricsProps> = ({
  timeRange,
  filters,
  isLive
}) => {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [drilldownData, setDrilldownData] = useState<any>(null);

  // Mock data
  const [serviceMetrics] = useState<ServiceMetrics>({
    apiGateway: {
      name: 'API Gateway',
      latency: 185,
      throughput: 2340,
      errorRate: 1.2,
      status: 'healthy',
      trend: [180, 185, 190, 185, 182, 185, 188, 185]
    },
    routingEngine: {
      name: 'Routing Engine',
      latency: 247,
      throughput: 1890,
      errorRate: 2.8,
      status: 'warning',
      trend: [240, 245, 250, 247, 252, 247, 249, 247]
    },
    templateService: {
      name: 'Template Service',
      latency: 456,
      throughput: 1240,
      errorRate: 5.2,
      status: 'critical',
      trend: [420, 440, 460, 456, 470, 456, 465, 456]
    },
    deliveryProcessor: {
      name: 'Delivery Processor',
      latency: 198,
      throughput: 3120,
      errorRate: 0.8,
      status: 'healthy',
      trend: [195, 200, 205, 198, 202, 198, 201, 198]
    }
  });

  const [apiLatencyData] = useState([
    { timestamp: '14:30', '/send': 150, '/template/submit': 420, '/delivery/report': 180 },
    { timestamp: '14:31', '/send': 165, '/template/submit': 450, '/delivery/report': 195 },
    { timestamp: '14:32', '/send': 180, '/template/submit': 520, '/delivery/report': 210 },
    { timestamp: '14:33', '/send': 175, '/template/submit': 480, '/delivery/report': 205 },
    { timestamp: '14:34', '/send': 190, '/template/submit': 560, '/delivery/report': 220 },
    { timestamp: '14:35', '/send': 185, '/template/submit': 510, '/delivery/report': 215 },
    { timestamp: '14:36', '/send': 170, '/template/submit': 470, '/delivery/report': 200 },
    { timestamp: '14:37', '/send': 160, '/template/submit': 440, '/delivery/report': 190 }
  ]);

  const [throughputData] = useState([
    { timestamp: '14:30', 'API Gateway': 2200, 'Routing Engine': 1800, 'Template Service': 1200, 'Delivery Processor': 3000 },
    { timestamp: '14:31', 'API Gateway': 2300, 'Routing Engine': 1850, 'Template Service': 1220, 'Delivery Processor': 3100 },
    { timestamp: '14:32', 'API Gateway': 2400, 'Routing Engine': 1900, 'Template Service': 1250, 'Delivery Processor': 3150 },
    { timestamp: '14:33', 'API Gateway': 2350, 'Routing Engine': 1890, 'Template Service': 1240, 'Delivery Processor': 3120 },
    { timestamp: '14:34', 'API Gateway': 2380, 'Routing Engine': 1920, 'Template Service': 1260, 'Delivery Processor': 3180 },
    { timestamp: '14:35', 'API Gateway': 2340, 'Routing Engine': 1890, 'Template Service': 1240, 'Delivery Processor': 3120 }
  ]);

  const [errorDistribution] = useState([
    { endpoint: '/send', '4xx': 15, '5xx': 8, total: 23 },
    { endpoint: '/template/submit', '4xx': 32, '5xx': 18, total: 50 },
    { endpoint: '/delivery/report', '4xx': 8, '5xx': 4, total: 12 }
  ]);

  const [apiErrors] = useState<APIError[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 180000),
      endpoint: '/template/submit',
      clientId: 'client-123',
      statusCode: 500,
      errorMessage: 'Database connection timeout',
      severity: 'critical',
      acknowledged: false,
      requestPayload: '{"template_id": "temp_456", "data": {...}}',
      responsePayload: '{"error": "Database timeout after 30s"}'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 360000),
      endpoint: '/send',
      clientId: 'client-789',
      statusCode: 429,
      errorMessage: 'Rate limit exceeded',
      severity: 'warning',
      acknowledged: false
    }
  ]);

  const handleServiceClick = (serviceName: string) => {
    setSelectedService(serviceName);
    setDrilldownData({
      title: `${serviceName} Details`,
      type: 'service-detail',
      data: serviceMetrics[serviceName as keyof ServiceMetrics]
    });
  };

  const getEndpointColor = (endpoint: string) => {
    switch (endpoint) {
      case '/send': return 'hsl(var(--status-success))';
      case '/template/submit': return 'hsl(var(--status-warning))';
      case '/delivery/report': return 'hsl(var(--primary))';
      default: return 'hsl(var(--muted))';
    }
  };

  return (
    <div className="space-y-6">
      {/* Service Health Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ServiceHealthGrid 
          services={serviceMetrics}
          onServiceClick={handleServiceClick}
        />
      </motion.div>

      {/* API Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Latency Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Activity className="w-5 h-5" />
                API Endpoint Latency
                <Badge variant="secondary" className="ml-2">
                  {timeRange === 'live' ? 'Live' : timeRange}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={apiLatencyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="timestamp" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      label={{ value: 'Latency (ms)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="/send" 
                      stroke={getEndpointColor('/send')} 
                      strokeWidth={2} 
                      dot={{ r: 4 }}
                      name="/send"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="/template/submit" 
                      stroke={getEndpointColor('/template/submit')} 
                      strokeWidth={2} 
                      dot={{ r: 4 }}
                      name="/template/submit"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="/delivery/report" 
                      stroke={getEndpointColor('/delivery/report')} 
                      strokeWidth={2} 
                      dot={{ r: 4 }}
                      name="/delivery/report"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Request Throughput Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Request Throughput
                <Badge variant="secondary" className="ml-2">RPS</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={throughputData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="timestamp" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="API Gateway" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2} 
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Routing Engine" 
                      stroke="hsl(var(--status-warning))" 
                      strokeWidth={2} 
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Template Service" 
                      stroke="hsl(var(--status-error))" 
                      strokeWidth={2} 
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Delivery Processor" 
                      stroke="hsl(var(--status-success))" 
                      strokeWidth={2} 
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row: Error Distribution & Error Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Error Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Error Distribution by Endpoint
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={errorDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis dataKey="endpoint" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="4xx" stackId="errors" fill="hsl(var(--status-warning))" name="4xx Errors" />
                    <Bar dataKey="5xx" stackId="errors" fill="hsl(var(--status-error))" name="5xx Errors" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* API Error Log */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <ErrorLogTable 
            errors={apiErrors}
            onErrorClick={(error) => {
              setSelectedService('api-error');
              setDrilldownData({
                title: 'API Error Details',
                type: 'error-detail',
                data: error
              });
            }}
          />
        </motion.div>
      </div>

      {/* Drilldown Modal */}
      <DrilldownModal
        isOpen={!!selectedService}
        onClose={() => {
          setSelectedService(null);
          setDrilldownData(null);
        }}
        title={drilldownData?.title}
        type={drilldownData?.type}
        data={drilldownData?.data}
      />
    </div>
  );
};