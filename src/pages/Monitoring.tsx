import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ArrowLeft, BarChart3, Home, HelpCircle, Settings, User, Bell, Moon, Sun, Globe, Shield, Database, Keyboard, LogOut } from 'lucide-react';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { THEMES, Theme } from '@/constants/themes';
import { QueueMetrics, TimeSeriesQueueData, QueueAlert, RetryReason, DLQMessage, TimeRange, FilterOptions, QueueDrilldownState } from '@/types/queue-dashboard';
import { generateQueueMetrics, generateTimeSeriesData, generateQueueAlerts, generateRetryReasons, generateDLQMessages } from '@/utils/queueData';

// Import all queue dashboard components
import QueueHealthCards from '@/components/queue/QueueHealthCards';
import QueueDepthChart from '@/components/queue/QueueDepthChart';
import QueuePerformanceCharts from '@/components/queue/QueuePerformanceCharts';
import RetryAnalysisPanel from '@/components/queue/RetryAnalysisPanel';
import DLQTable from '@/components/queue/DLQTable';
import QueueAlertsSidebar from '@/components/queue/QueueAlertsSidebar';
import QueueDashboardControls from '@/components/queue/QueueDashboardControls';
import QueueDrilldownView from '@/components/queue/QueueDrilldownView';

const Monitoring: React.FC = () => {
  const navigate = useNavigate();
  const { theme, mode, setTheme, setMode } = useTheme();
  const { toast } = useToast();

  // Core dashboard state
  const [queues, setQueues] = useState<QueueMetrics[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesQueueData[]>([]);
  const [alerts, setAlerts] = useState<QueueAlert[]>([]);
  const [retryReasons, setRetryReasons] = useState<RetryReason[]>([]);
  const [dlqMessages, setDLQMessages] = useState<DLQMessage[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>('1h');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [selectedRetryFilter, setSelectedRetryFilter] = useState<string | null>(null);
  
  // Queue drilldown state
  const [drilldownState, setDrilldownState] = useState<QueueDrilldownState>({
    isOpen: false,
    queueId: null,
    queueName: null
  });

  // Modal states
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  // Initialize data
  useEffect(() => {
    const initializeData = () => {
      const queueData = generateQueueMetrics();
      // Generate time series data for all queues
      const allTimeData: TimeSeriesQueueData[] = [];
      queueData.forEach(queue => {
        const queueTimeData = generateTimeSeriesData(queue.id, timeRange);
        allTimeData.push(...queueTimeData);
      });
      
      setQueues(queueData);
      setTimeSeriesData(allTimeData);
      setAlerts(generateQueueAlerts());
      setRetryReasons(generateRetryReasons());
      setDLQMessages(generateDLQMessages());
    };

    initializeData();
  }, [timeRange]);

  // Real-time data updates every 2-3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const queueData = generateQueueMetrics();
      // Generate time series data for all queues
      const allTimeData: TimeSeriesQueueData[] = [];
      queueData.forEach(queue => {
        const queueTimeData = generateTimeSeriesData(queue.id, timeRange);
        allTimeData.push(...queueTimeData);
      });
      
      setQueues(queueData);
      setTimeSeriesData(allTimeData);
      setAlerts(generateQueueAlerts());
    }, 2500);

    return () => clearInterval(interval);
  }, [timeRange]);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    const themeName = THEMES.find(t => t.value === newTheme)?.name || 'Unknown';
    toast({
      title: "Theme Changed",
      description: `Switched to ${themeName}`,
      className: "border-status-success bg-status-success/10 text-status-success"
    });
  };

  const handleQueueDrilldown = (queueId: string, queueName: string) => {
    setDrilldownState({
      isOpen: true,
      queueId,
      queueName
    });
    
    toast({
      title: "Queue Drilldown",
      description: `Viewing detailed metrics for ${queueName}`,
    });
  };

  const handleBackToOverview = () => {
    setDrilldownState({
      isOpen: false,
      queueId: null,
      queueName: null
    });
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, acknowledged: true, acknowledgedAt: new Date() }
        : alert
    ));
    
    toast({
      title: "Alert Acknowledged",
      description: "Alert has been marked as acknowledged",
      className: "border-status-success bg-status-success/10 text-status-success"
    });
  };

  const handleDrillDownFromAlert = (queueId: string, queueName: string, alertId: string) => {
    handleQueueDrilldown(queueId, queueName);
    
    toast({
      title: "Drilling into Queue",
      description: `Focused on ${queueName} from alert`,
    });
  };

  const handleRetryFilterSelect = (reason: string | null) => {
    setSelectedRetryFilter(reason);
    
    if (reason) {
      toast({
        title: "Filter Applied",
        description: `Showing DLQ messages for: ${reason}`,
      });
    } else {
      toast({
        title: "Filter Cleared",
        description: "Showing all DLQ messages",
      });
    }
  };

  const handleDLQReplayMessage = (messageId: string) => {
    setDLQMessages(prev => prev.filter(msg => msg.id !== messageId));
    
    toast({
      title: "Message Replayed",
      description: "Message moved back to queue",
      className: "border-status-success bg-status-success/10 text-status-success"
    });
  };

  const handleDLQDiscardMessage = (messageId: string) => {
    setDLQMessages(prev => prev.filter(msg => msg.id !== messageId));
    
    toast({
      title: "Message Discarded",
      description: "Message permanently removed",
      className: "border-status-warning bg-status-warning/10 text-status-warning"
    });
  };

  const handleDLQReplayAll = () => {
    const count = filteredDLQMessages.length;
    setDLQMessages(prev => prev.filter(msg => !filteredDLQMessages.includes(msg)));
    
    toast({
      title: "All Messages Replayed",
      description: `${count} message(s) moved back to queue`,
      className: "border-status-success bg-status-success/10 text-status-success"
    });
  };

  const handleDLQPurgeAll = () => {
    const count = dlqMessages.length;
    setDLQMessages([]);
    
    toast({
      title: "Queue Purged",
      description: `All ${count} DLQ messages have been cleared`,
      className: "border-status-error bg-status-error/10 text-status-error"
    });
  };

  const handleExport = (exportFormat: any) => {
    toast({
      title: "Export Started",
      description: `Generating ${exportFormat.format.toUpperCase()} report...`,
    });
    
    // Simulate export delay
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `Dashboard report downloaded as ${exportFormat.format.toUpperCase()}`,
        className: "border-status-success bg-status-success/10 text-status-success"
      });
    }, 2000);
  };

  // Filter DLQ messages based on selected retry reason
  const filteredDLQMessages = selectedRetryFilter 
    ? dlqMessages.filter(msg => msg.errorMessage.toLowerCase().includes(selectedRetryFilter.toLowerCase()))
    : dlqMessages;

  // Get current queue for drilldown
  const currentQueue = drilldownState.queueId 
    ? queues.find(q => q.id === drilldownState.queueId)
    : null;

  const currentTimeSeriesData = drilldownState.queueId
    ? timeSeriesData.filter(d => d.queueId === drilldownState.queueId)
    : timeSeriesData;

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 pt-4">
          <div className="container mx-auto px-6">
            <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-lg shadow-black/5 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                      {drilldownState.isOpen ? `${drilldownState.queueName} - Queue Details` : 'Queue Monitoring Dashboard'}
                    </h1>
                  </div>

                  <nav className="hidden md:flex items-center gap-6">
                    {drilldownState.isOpen ? (
                      <Button
                        variant="ghost"
                        className="text-sm"
                        onClick={handleBackToOverview}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Overview
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        className="text-sm"
                        onClick={() => navigate("/home")}
                      >
                        <Home className="w-4 h-4 mr-2" />
                        Home
                      </Button>
                    )}
                  </nav>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setHelpModalOpen(true)}
                  >
                    <HelpCircle className="w-4 h-4" />
                  </Button>

                  {/* Settings Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64">
                      <div className="px-2 py-1">
                        <div className="text-xs font-medium text-muted-foreground mb-2">
                          Themes
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          {THEMES.map((themeOption) => (
                            <button
                              key={themeOption.value}
                              onClick={() => handleThemeChange(themeOption.value)}
                              className={`w-6 h-6 rounded-full ${themeOption.preview} hover:scale-110 transition-transform ${
                                theme === themeOption.value
                                  ? "ring-2 ring-ring ring-offset-2 ring-offset-background"
                                  : ""
                              }`}
                              title={themeOption.name}
                            />
                          ))}
                        </div>
                        <div className="mt-2 flex gap-1">
                          <button
                            onClick={() => setMode("light")}
                            className={`px-2 py-1 text-xs rounded ${
                              mode === "light"
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-accent"
                            }`}
                          >
                            Light
                          </button>
                          <button
                            onClick={() => setMode("dark")}
                            className={`px-2 py-1 text-xs rounded ${
                              mode === "dark"
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-accent"
                            }`}
                          >
                            Dark
                          </button>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setMode(mode === "light" ? "dark" : "light")}
                      >
                        {mode === "light" ? (
                          <Moon className="w-4 h-4 mr-2" />
                        ) : (
                          <Sun className="w-4 h-4 mr-2" />
                        )}
                        {mode === "light" ? "Dark Mode" : "Light Mode"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Account Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <User className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem>
                        <User className="w-4 h-4 mr-2" />
                        Personal Info
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="w-4 h-4 mr-2" />
                        Account Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Badge className="w-4 h-4 mr-2" />
                        Billing
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive">
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="container mx-auto px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
            {/* Main Content Area - 3 columns */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              {/* Queue Drilldown View or Overview */}
              {drilldownState.isOpen && currentQueue ? (
                <QueueDrilldownView
                  queue={currentQueue}
                  timeSeriesData={currentTimeSeriesData}
                  timeRange={timeRange}
                  onBack={handleBackToOverview}
                />
              ) : (
                <>
                  {/* Top Summary Panel - Queue Health Cards */}
                  <QueueHealthCards
                    queues={queues}
                    onViewDetails={handleQueueDrilldown}
                  />

                  {/* Center Visualization Area */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <QueueDepthChart
                      queues={queues}
                      onQueueClick={handleQueueDrilldown}
                    />
                    <QueuePerformanceCharts
                      data={timeSeriesData}
                      timeRange={timeRange}
                    />
                  </div>

                  {/* Bottom Panels - Retry Analysis & DLQ Management */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <RetryAnalysisPanel
                      retryReasons={retryReasons}
                      selectedFilter={selectedRetryFilter}
                      onFilterSelect={handleRetryFilterSelect}
                    />
                    <DLQTable
                      messages={filteredDLQMessages}
                      selectedFilter={selectedRetryFilter}
                      onReplayMessage={handleDLQReplayMessage}
                      onDiscardMessage={handleDLQDiscardMessage}
                      onReplayAll={handleDLQReplayAll}
                      onPurgeAll={handleDLQPurgeAll}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Right Sidebar - Alerts - 1 column */}
            <div className="lg:col-span-1">
              <QueueAlertsSidebar
                alerts={alerts}
                onAcknowledge={handleAcknowledgeAlert}
                onDrillDown={handleDrillDownFromAlert}
              />
            </div>
          </div>

          {/* Footer Controls */}
          <div className="mt-6">
            <QueueDashboardControls
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
              filters={filters}
              onFiltersChange={setFilters}
              onExport={handleExport}
            />
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Monitoring;