import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from '@/components/common/PageHeader';
import { DatabaseMetrics } from '@/components/observability/DatabaseMetrics';
import { APIServiceMetrics } from '@/components/observability/APIServiceMetrics';
import { AlertsSidebar } from '@/components/observability/AlertsSidebar';
import { ObservabilityNavbar } from '@/components/observability/ObservabilityNavbar';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { 
  PersonalInfoModal, 
  AccountSettingsModal, 
  BillingModal
} from '@/components/flow/AccountModals';
import { SupportModal } from '@/components/flow/SupportModal';
import { 
  Activity, 
  Database, 
  Server, 
  BarChart3,
  Zap
} from 'lucide-react';
import { TimeRange, FilterOptions, ExportOptions } from '@/types/observability';

const Observability = () => {
  // Modal states
  const [personalInfoOpen, setPersonalInfoOpen] = useState(false);
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(false);
  const [billingOpen, setBillingOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  // Dashboard state
  const [activeTab, setActiveTab] = useState('database');
  const [timeRange, setTimeRange] = useState<TimeRange>('1h');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isLive, setIsLive] = useState(false);

  // Auto-refresh for live data
  useEffect(() => {
    if (timeRange === 'live') {
      setIsLive(true);
      const interval = setInterval(() => {
        // Trigger data refresh
        console.log('Refreshing live data...');
      }, 5000);
      return () => clearInterval(interval);
    } else {
      setIsLive(false);
    }
  }, [timeRange]);

  const handleExport = (options: ExportOptions) => {
    console.log('Exporting data:', options);
    // Implementation for export functionality
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <PageHeader
          title="Real-time Observability"
          subtitle="Comprehensive database and API monitoring with real-time insights"
          icon={<Activity className="w-5 h-5 text-white" />}
          backTo="/monitoring"
          onPersonalInfoClick={() => setPersonalInfoOpen(true)}
          onAccountSettingsClick={() => setAccountSettingsOpen(true)}
          onBillingClick={() => setBillingOpen(true)}
          onSupportClick={() => setSupportOpen(true)}
        />

        <ObservabilityNavbar
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          filters={filters}
          onFiltersChange={handleFilterChange}
          onExport={handleExport}
          isLive={isLive}
        />

        <main className="container mx-auto px-6 py-6">
          <div className="flex gap-6">
            {/* Main Content */}
            <div className="flex-1">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="database" className="flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Database Metrics
                  </TabsTrigger>
                  <TabsTrigger value="api" className="flex items-center gap-2">
                    <Server className="w-4 h-4" />
                    API & Services
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="database">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <DatabaseMetrics 
                      timeRange={timeRange}
                      filters={filters}
                      isLive={isLive}
                    />
                  </motion.div>
                </TabsContent>

                <TabsContent value="api">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <APIServiceMetrics 
                      timeRange={timeRange}
                      filters={filters}
                      isLive={isLive}
                    />
                  </motion.div>
                </TabsContent>
              </Tabs>

              {/* Quick Stats Bar */}
              <div className="mt-6">
                <Card className="bg-card/50 border-border/50">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-status-success/10">
                          <Zap className="w-4 h-4 text-status-success" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">System Health</p>
                          <p className="text-lg font-semibold text-status-success">98.7%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Activity className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Avg Response</p>
                          <p className="text-lg font-semibold">247ms</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-status-warning/10">
                          <BarChart3 className="w-4 h-4 text-status-warning" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Active Alerts</p>
                          <p className="text-lg font-semibold">3</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-secondary/10">
                          <Database className="w-4 h-4 text-secondary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">DB Load</p>
                          <p className="text-lg font-semibold">67%</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Alerts Sidebar */}
            <div className="w-80">
              <AlertsSidebar 
                timeRange={timeRange}
                filters={filters}
              />
            </div>
          </div>
        </main>

        {/* Modals */}
        <PersonalInfoModal 
          isOpen={personalInfoOpen} 
          onClose={() => setPersonalInfoOpen(false)} 
        />
        <AccountSettingsModal 
          isOpen={accountSettingsOpen} 
          onClose={() => setAccountSettingsOpen(false)} 
        />
        <BillingModal 
          isOpen={billingOpen} 
          onClose={() => setBillingOpen(false)} 
        />
        <SupportModal 
          isOpen={supportOpen} 
          onClose={() => setSupportOpen(false)} 
        />
      </div>
    </ThemeProvider>
  );
};

export default Observability;