import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  ArrowLeft, 
  Settings, 
  Download, 
  Filter,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Bell,
  Activity,
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  Server,
  AlertCircle
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { THEMES, Theme } from '@/constants/themes';

// Components
import { CircularGauge } from '@/components/dashboard/CircularGauge';
import { SystemChart } from '@/components/dashboard/SystemChart';
import { ServiceDrilldown } from '@/components/dashboard/ServiceDrilldown';
import { AlertsFeed } from '@/components/dashboard/AlertsFeed';
import { ExportModal } from '@/components/dashboard/ExportModal';
import { FilterModal } from '@/components/dashboard/FilterModal';

// Types
import { SystemMetrics, Alert, TimeRange, ServiceType } from '@/types/dashboard';

// Mock data generators
import { generateSystemMetrics, generateAlerts } from '@/utils/dashboardData';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { theme, mode, setTheme, setMode } = useTheme();
  const { toast } = useToast();

  // State management
  const [metrics, setMetrics] = useState<SystemMetrics>(generateSystemMetrics());
  const [alerts, setAlerts] = useState<Alert[]>(generateAlerts());
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('60s');
  const [selectedService, setSelectedService] = useState<ServiceType>('all');
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [gaugeModalOpen, setGaugeModalOpen] = useState<string | null>(null);

  // Real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(generateSystemMetrics());
      // Add new alerts occasionally
      if (Math.random() < 0.1) {
        setAlerts(prev => [generateAlerts(1)[0], ...prev.slice(0, 19)]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    const themeName = THEMES.find(t => t.value === newTheme)?.name || 'Unknown';
    toast({
      title: "Theme Changed",
      description: `Switched to ${themeName}`,
      className: "border-status-success bg-status-success/10 text-status-success"
    });
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, acknowledged: true, acknowledgedAt: new Date() }
          : alert
      )
    );
    toast({
      title: "Alert Acknowledged",
      description: "Alert has been marked as acknowledged",
    });
  };

  const drillDownFromAlert = (alertId: string) => {
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      // Focus on the relevant metric/chart
      toast({
        title: "Drilling Down",
        description: `Focusing on ${alert.metric} for ${alert.node}`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">
                  System Health Dashboard
                </h1>
              </div>
              
              <Button variant="ghost" size="sm" onClick={() => navigate('/monitoring')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Monitoring
              </Button>
            </div>

            <div className="flex items-center gap-3">
              {/* Time Range Selector */}
              <Select value={selectedTimeRange} onValueChange={(value) => setSelectedTimeRange(value as TimeRange)}>
                <SelectTrigger className="w-24">
                  <Clock className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="60s">Live</SelectItem>
                  <SelectItem value="15m">15m</SelectItem>
                  <SelectItem value="1h">1h</SelectItem>
                  <SelectItem value="24h">24h</SelectItem>
                  <SelectItem value="7d">7d</SelectItem>
                </SelectContent>
              </Select>

              {/* Export Button */}
              <Button variant="outline" size="sm" onClick={() => setExportModalOpen(true)}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>

              {/* Filter Button */}
              <Button variant="outline" size="sm" onClick={() => setFilterModalOpen(true)}>
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>

              {/* Theme Toggle */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
              >
                {mode === 'dark' ? '🌙' : '☀️'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex w-full">
        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Top Row: Status Gauges */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <CircularGauge
              title="CPU"
              value={metrics.cpu}
              icon={Cpu}
              onClick={() => setGaugeModalOpen('cpu')}
              sparklineData={metrics.cpuHistory}
            />
            <CircularGauge
              title="Memory"
              value={metrics.memory}
              icon={MemoryStick}
              onClick={() => setGaugeModalOpen('memory')}
              sparklineData={metrics.memoryHistory}
            />
            <CircularGauge
              title="Disk"
              value={metrics.disk}
              icon={HardDrive}
              onClick={() => setGaugeModalOpen('disk')}
              sparklineData={metrics.diskHistory}
            />
            <CircularGauge
              title="Network"
              value={metrics.network}
              icon={Network}
              onClick={() => setGaugeModalOpen('network')}
              sparklineData={metrics.networkHistory}
            />
          </div>

          {/* Center: Real-time Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <SystemChart
              title="CPU & Memory Usage"
              type="line"
              data={metrics.timeSeriesData}
              timeRange={selectedTimeRange}
            />
            <SystemChart
              title="Network Throughput"
              type="area"
              data={metrics.networkData}
              timeRange={selectedTimeRange}
            />
            <SystemChart
              title="Disk Usage by Partition"
              type="bar"
              data={metrics.diskData}
              timeRange={selectedTimeRange}
            />
            <SystemChart
              title="Service Response Times"
              type="line"
              data={metrics.serviceData}
              timeRange={selectedTimeRange}
            />
          </div>

          {/* Service Drilldown Panel */}
          <ServiceDrilldown
            selectedService={selectedService}
            onServiceChange={setSelectedService}
            metrics={metrics}
          />
        </div>

        {/* Right Sidebar: Alerts */}
        <div className="w-80 border-l border-border bg-card/30">
          <AlertsFeed
            alerts={alerts}
            onAcknowledge={acknowledgeAlert}
            onDrillDown={drillDownFromAlert}
          />
        </div>
      </div>

      {/* Modals */}
      <ExportModal
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
        onExport={(format) => {
          toast({
            title: "Export Started",
            description: `Downloading dashboard data as ${format.toUpperCase()}`,
          });
        }}
      />

      <FilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        onApplyFilters={(filters) => {
          toast({
            title: "Filters Applied",
            description: `Applied ${Object.keys(filters).length} filter(s)`,
          });
        }}
      />

      {/* Gauge Drilldown Modal */}
      <Dialog open={!!gaugeModalOpen} onOpenChange={() => setGaugeModalOpen(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {gaugeModalOpen === 'cpu' && <Cpu className="w-5 h-5" />}
              {gaugeModalOpen === 'memory' && <MemoryStick className="w-5 h-5" />}
              {gaugeModalOpen === 'disk' && <HardDrive className="w-5 h-5" />}
              {gaugeModalOpen === 'network' && <Network className="w-5 h-5" />}
              {gaugeModalOpen?.toUpperCase()} Usage Details
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {gaugeModalOpen && (
              <SystemChart
                title={`${gaugeModalOpen.toUpperCase()} by Node`}
                type="line"
                data={metrics.timeSeriesData}
                timeRange={selectedTimeRange}
                detailed
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;