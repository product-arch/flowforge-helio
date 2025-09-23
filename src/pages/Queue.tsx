import React, { useState, useEffect } from 'react';
import { QueueNavbar } from '@/components/navigation/QueueNavbar';
import QueueHealthCards from "@/components/queue/QueueHealthCards";
import QueueDepthChart from "@/components/queue/QueueDepthChart";
import QueuePerformanceCharts from "@/components/queue/QueuePerformanceCharts";
import RetryAnalysisPanel from "@/components/queue/RetryAnalysisPanel";
import DLQTable from "@/components/queue/DLQTable";
import QueueAlertsSidebar from "@/components/queue/QueueAlertsSidebar";

import QueueDrilldownView from "@/components/queue/QueueDrilldownView";
import { useToast } from "@/hooks/use-toast";
import { 
  generateQueueMetrics, 
  generateTimeSeriesData, 
  generateQueueAlerts, 
  generateRetryReasons, 
  generateDLQMessages 
} from "@/utils/queueData";
import type { 
  QueueMetrics, 
  TimeSeriesQueueData, 
  QueueAlert, 
  RetryReason, 
  DLQMessage, 
  TimeRange,
  FilterOptions 
} from "@/types/queue-dashboard";

const Queue = () => {
  const { toast } = useToast();
  
  // Core state
  const [queues, setQueues] = useState<QueueMetrics[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesQueueData[]>([]);
  const [alerts, setAlerts] = useState<QueueAlert[]>([]);
  const [retryReasons, setRetryReasons] = useState<RetryReason[]>([]);
  const [dlqMessages, setDlqMessages] = useState<DLQMessage[]>([]);
  
  // UI state
  const [timeRange, setTimeRange] = useState<TimeRange>('60s');
  const [selectedRetryReason, setSelectedRetryReason] = useState<string | null>(null);
  const [selectedQueue, setSelectedQueue] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});

  // Initialize data
  useEffect(() => {
    const initializeData = () => {
      const queueData = generateQueueMetrics();
      const alertData = generateQueueAlerts();
      const retryData = generateRetryReasons();
      const dlqData = generateDLQMessages();
      
      setQueues(queueData);
      setAlerts(alertData);
      setRetryReasons(retryData);
      setDlqMessages(dlqData);
      
      // Generate initial time series data for all queues
      const allTimeSeriesData: TimeSeriesQueueData[] = [];
      queueData.forEach(queue => {
        const queueTimeSeriesData = generateTimeSeriesData(queue.id, timeRange);
        allTimeSeriesData.push(...queueTimeSeriesData);
      });
      setTimeSeriesData(allTimeSeriesData);
    };

    initializeData();
  }, []);

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedQueues = generateQueueMetrics();
      setQueues(updatedQueues);
      
      const allTimeSeriesData: TimeSeriesQueueData[] = [];
      updatedQueues.forEach(queue => {
        const queueTimeSeriesData = generateTimeSeriesData(queue.id, timeRange);
        allTimeSeriesData.push(...queueTimeSeriesData);
      });
      setTimeSeriesData(allTimeSeriesData);
    }, 3000);

    return () => clearInterval(interval);
  }, [timeRange]);

  // Update time series data when time range changes
  useEffect(() => {
    const allTimeSeriesData: TimeSeriesQueueData[] = [];
    queues.forEach(queue => {
      const queueTimeSeriesData = generateTimeSeriesData(queue.id, timeRange);
      allTimeSeriesData.push(...queueTimeSeriesData);
    });
    setTimeSeriesData(allTimeSeriesData);
  }, [timeRange, queues]);

  // Event handlers
  const handleQueueDrilldown = (queueId: string) => {
    setSelectedQueue(queueId);
    toast({
      title: "Queue Selected",
      description: `Drilling down into queue ${queueId}`,
    });
  };

  const handleBackToOverview = () => {
    setSelectedQueue(null);
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
    });
  };

  const handleDrillDownFromAlert = (queueId: string, queueName: string, alertId: string) => {
    setSelectedQueue(queueId);
    toast({
      title: "Navigating to Queue",
      description: `Opening detailed view for ${queueName}`,
    });
  };

  const handleRetryFilterSelect = (reason: string | null) => {
    setSelectedRetryReason(reason);
  };

  const handleDLQReplayMessage = (messageId: string) => {
    setDlqMessages(prev => prev.filter(msg => msg.id !== messageId));
    toast({
      title: "Message Replayed",
      description: `Message ${messageId} has been replayed successfully`,
    });
  };

  const handleDLQDiscardMessage = (messageId: string) => {
    setDlqMessages(prev => prev.filter(msg => msg.id !== messageId));
    toast({
      title: "Message Discarded",
      description: `Message ${messageId} has been permanently discarded`,
    });
  };

  const handleDLQReplayAll = () => {
    const count = filteredDLQMessages.length;
    setDlqMessages(prev => prev.filter(msg => !filteredDLQMessages.includes(msg)));
    toast({
      title: "All Messages Replayed",
      description: `${count} message(s) moved back to queue`,
    });
  };

  const handleDLQPurgeAll = () => {
    const count = dlqMessages.length;
    setDlqMessages([]);
    toast({
      title: "Queue Purged",
      description: `All ${count} DLQ messages have been cleared`,
    });
  };

  const handleExport = (exportFormat: any) => {
    toast({
      title: "Export Started",
      description: `Generating ${exportFormat.format.toUpperCase()} report...`,
    });
  };

  // Data filtering
  const filteredDLQMessages = selectedRetryReason 
    ? dlqMessages.filter(msg => msg.errorCode === selectedRetryReason)
    : dlqMessages;

  // Get current queue and its time series data for drilldown
  const currentQueue = selectedQueue ? queues.find(q => q.id === selectedQueue) : null;
  const currentQueueTimeSeriesData = selectedQueue 
    ? timeSeriesData.filter(data => data.queueId === selectedQueue)
    : [];

  return (
    <div className="min-h-screen bg-background">
      <QueueNavbar
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        filters={filters}
        onFiltersChange={setFilters}
        onExport={handleExport}
      />
      
      <div className="container mx-auto px-6 py-6">
        {selectedQueue && (
          <h2 className="text-xl font-semibold mb-6 text-foreground">
            Queue Details - {currentQueue?.name}
          </h2>
        )}

        {selectedQueue && currentQueue ? (
          <QueueDrilldownView
            queue={currentQueue}
            timeSeriesData={currentQueueTimeSeriesData}
            timeRange={timeRange}
            onBack={handleBackToOverview}
          />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Main Content Area - 3 columns */}
            <div className="xl:col-span-3 space-y-6">
              {/* Queue Health Overview */}
              <QueueHealthCards 
                queues={queues}
                onViewDetails={handleQueueDrilldown}
              />

              {/* Queue Depth Chart */}
              <QueueDepthChart 
                queues={queues}
                onQueueClick={handleQueueDrilldown}
              />

              {/* Performance Charts */}
              <QueuePerformanceCharts 
                data={timeSeriesData}
                timeRange={timeRange}
              />

              {/* Bottom Row - Retry Analysis and DLQ */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RetryAnalysisPanel 
                  retryReasons={retryReasons}
                  selectedFilter={selectedRetryReason}
                  onFilterSelect={handleRetryFilterSelect}
                />
                
                <DLQTable 
                  messages={filteredDLQMessages}
                  selectedFilter={selectedRetryReason}
                  onReplayMessage={handleDLQReplayMessage}
                  onDiscardMessage={handleDLQDiscardMessage}
                  onReplayAll={handleDLQReplayAll}
                  onPurgeAll={handleDLQPurgeAll}
                />
              </div>
            </div>

            {/* Right Sidebar - 1 column */}
            <div className="xl:col-span-1">
              <QueueAlertsSidebar 
                alerts={alerts}
                onAcknowledge={handleAcknowledgeAlert}
                onDrillDown={handleDrillDownFromAlert}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Queue;