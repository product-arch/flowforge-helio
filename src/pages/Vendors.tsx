import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Store, ArrowLeft, Activity, TrendingUp, TrendingDown, AlertTriangle, Settings, CheckCircle } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { 
  PersonalInfoModal, 
  AccountSettingsModal, 
  BillingModal
} from '@/components/flow/AccountModals';
import { SupportModal } from '@/components/flow/SupportModal';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { ALL_VENDORS, getVendorsByType, Vendor } from '@/constants/vendors';
import { VendorOnboardingModal } from '@/components/vendor/VendorOnboardingModal';
import { MyVendorsSection } from '@/components/vendor/MyVendorsSection';
import type { VendorIntegration, VendorHealth } from '@/types/vendor-integration';

interface HealthMetricData {
  timestamp: string;
  uptime: number;
  errorRate: number;
  latency: number;
}

const Vendors: React.FC = () => {
  const navigate = useNavigate();
  const { theme, mode, setTheme, setMode } = useTheme();
  const { toast } = useToast();
  
  // State management
  const [activeTab, setActiveTab] = useState('marketplace');
  const [dateFilter, setDateFilter] = useState('7d');
  const [channelFilter, setChannelFilter] = useState('all');
  const [onboardingModalOpen, setOnboardingModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  
  // Modal states for navigation
  const [personalInfoOpen, setPersonalInfoOpen] = useState(false);
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(false);
  const [billingOpen, setBillingOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  
  // Data state
  const [vendorIntegrations, setVendorIntegrations] = useState<VendorIntegration[]>([]);
  const [vendorHealthData, setVendorHealthData] = useState<VendorHealth[]>([]);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetricData[]>([]);

  // Generate sample vendor integrations
  const generateSampleIntegrations = (): VendorIntegration[] => {
    return [
      {
        id: 'int-1',
        vendor: ALL_VENDORS.find(v => v.id === 'twilio')!,
        channel: 'sms',
        status: 'active',
        credentials: { apiKey: '***', apiSecret: '***' },
        configuration: { tpsLimit: 100, priority: 1 },
        healthMetrics: {
          id: 'health-1',
          vendorIntegrationId: 'int-1',
          uptimePercentage: 99.2,
          errorRate: 0.5,
          avgLatency: 120,
          incidents: 0,
          status: 'healthy',
          lastUpdated: new Date()
        },
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date()
      },
      {
        id: 'int-2',
        vendor: ALL_VENDORS.find(v => v.id === 'meta')!,
        channel: 'whatsapp',
        status: 'active',
        credentials: { accessToken: '***', phoneNumberId: '***' },
        configuration: { tpsLimit: 50, priority: 1 },
        healthMetrics: {
          id: 'health-2',
          vendorIntegrationId: 'int-2',
          uptimePercentage: 98.8,
          errorRate: 1.2,
          avgLatency: 180,
          incidents: 1,
          status: 'healthy',
          lastUpdated: new Date()
        },
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date()
      }
    ];
  };

  // Generate vendor health data from integrations
  const generateVendorHealthData = (): VendorHealth[] => {
    return vendorIntegrations.filter(integration => integration.healthMetrics)
      .map(integration => integration.healthMetrics!);
  };

  // Generate health metrics timeline
  const generateHealthMetrics = (): HealthMetricData[] => {
    const now = new Date();
    const days = dateFilter === '24h' ? 1 : dateFilter === '7d' ? 7 : 30;
    const intervals = dateFilter === '24h' ? 24 : days;
    
    return Array.from({ length: intervals }, (_, i) => {
      const time = new Date(now.getTime() - (intervals - 1 - i) * (dateFilter === '24h' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000));
      return {
        timestamp: dateFilter === '24h' 
          ? time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          : time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        uptime: 95 + Math.random() * 4,
        errorRate: Math.random() * 2,
        latency: 120 + Math.random() * 80
      };
    });
  };

  // Initialize data
  useEffect(() => {
    const integrations = generateSampleIntegrations();
    setVendorIntegrations(integrations);
    setHealthMetrics(generateHealthMetrics());
  }, [dateFilter]);

  useEffect(() => {
    setVendorHealthData(generateVendorHealthData());
  }, [vendorIntegrations]);

  // Handle vendor onboarding
  const handleVendorOnboarding = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setOnboardingModalOpen(true);
  };

  const handleOnboardingComplete = (integrationData: any) => {
    // Create new integration
    const newIntegration: VendorIntegration = {
      id: `int-${Date.now()}`,
      vendor: integrationData.vendor,
      channel: integrationData.channel,
      status: 'configuring',
      credentials: {},
      configuration: {},
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setVendorIntegrations(prev => [...prev, newIntegration]);
  };

  // Integration management handlers
  const handleConfigure = (integration: VendorIntegration) => {
    toast({
      title: "Configuration",
      description: `Opening configuration for ${integration.vendor.name} ${integration.channel.toUpperCase()}`,
    });
  };

  const handleTest = (integration: VendorIntegration) => {
    toast({
      title: "Testing Integration",
      description: `Testing ${integration.vendor.name} ${integration.channel.toUpperCase()} connection`,
    });
  };

  const handleViewHealth = (integration: VendorIntegration) => {
    toast({
      title: "Health Dashboard",
      description: `Viewing health metrics for ${integration.vendor.name}`,
    });
  };

  const handleToggleStatus = (integration: VendorIntegration) => {
    const newStatus = integration.status === 'active' ? 'suspended' : 'active';
    setVendorIntegrations(prev => 
      prev.map(int => 
        int.id === integration.id 
          ? { ...int, status: newStatus, updatedAt: new Date() }
          : int
      )
    );
    
    toast({
      title: `Integration ${newStatus}`,
      description: `${integration.vendor.name} ${integration.channel.toUpperCase()} has been ${newStatus}`,
      className: newStatus === 'active' ? "border-status-success bg-status-success/10 text-status-success" : ""
    });
  };

  const handleDelete = (integration: VendorIntegration) => {
    setVendorIntegrations(prev => prev.filter(int => int.id !== integration.id));
    toast({
      title: "Integration Deleted",
      description: `${integration.vendor.name} ${integration.channel.toUpperCase()} has been removed`,
      variant: "destructive"
    });
  };

  const getStatusColor = (status: VendorHealth['status']) => {
    switch (status) {
      case 'healthy': return 'default';
      case 'warning': return 'secondary';
      case 'critical': return 'destructive';
      default: return 'outline';
    }
  };

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'sms': return 'default';
      case 'email': return 'secondary';
      case 'rcs': return 'outline';
      case 'voice': return 'destructive';
      case 'whatsapp': return 'default';
      default: return 'outline';
    }
  };

  const filteredVendors = channelFilter === 'all' 
    ? ALL_VENDORS 
    : getVendorsByType(channelFilter as Vendor['type']);

  // Group vendors by channel
  const vendorsByChannel = React.useMemo(() => {
    const grouped: Record<string, Vendor[]> = {};
    
    if (channelFilter === 'all') {
      // Group all vendors by their type
      ALL_VENDORS.forEach(vendor => {
        if (!grouped[vendor.type]) {
          grouped[vendor.type] = [];
        }
        grouped[vendor.type].push(vendor);
      });
    } else {
      // Show only the selected channel
      grouped[channelFilter] = filteredVendors;
    }
    
    return grouped;
  }, [channelFilter, filteredVendors]);

  const channelOrder = ['sms', 'email', 'whatsapp', 'voice', 'rcs'];
  const channelLabels = {
    sms: 'SMS',
    email: 'Email',
    whatsapp: 'WhatsApp',
    voice: 'Voice',
    rcs: 'RCS'
  };

  const filteredHealthData = channelFilter === 'all'
    ? vendorHealthData
    : vendorHealthData.filter(v => {
        // Find the integration this health data belongs to
        const integration = vendorIntegrations.find(int => int.healthMetrics?.id === v.id);
        return integration?.channel === channelFilter;
      });

  // Calculate summary metrics
  const avgUptime = filteredHealthData.reduce((sum, v) => sum + v.uptimePercentage, 0) / filteredHealthData.length || 0;
  const avgErrorRate = filteredHealthData.reduce((sum, v) => sum + v.errorRate, 0) / filteredHealthData.length || 0;
  const avgLatency = filteredHealthData.reduce((sum, v) => sum + v.avgLatency, 0) / filteredHealthData.length || 0;
  const totalIncidents = filteredHealthData.reduce((sum, v) => sum + v.incidents, 0);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <PageHeader
          title="Vendors"
          subtitle="Manage your communication vendor integrations and health monitoring"
          icon={<Store className="w-5 h-5 text-white" />}
          onPersonalInfoClick={() => setPersonalInfoOpen(true)}
          onAccountSettingsClick={() => setAccountSettingsOpen(true)}
          onBillingClick={() => setBillingOpen(true)}
          onSupportClick={() => setSupportOpen(true)}
        >
          {/* Date Filter - Only show in Health tab */}
          {activeTab === 'health' && (
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24H</SelectItem>
                <SelectItem value="7d">Last 7D</SelectItem>
                <SelectItem value="30d">Last 30D</SelectItem>
              </SelectContent>
            </Select>
          )}
        </PageHeader>

        {/* Content */}
        <main className="container mx-auto px-6 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
              <TabsTrigger value="my-vendors">My Vendors</TabsTrigger>
              <TabsTrigger value="health">Health</TabsTrigger>
            </TabsList>

            {/* Marketplace Tab */}
            <TabsContent value="marketplace" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* Filters above vendors */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Vendor Marketplace</h2>
                  <Select value={channelFilter} onValueChange={setChannelFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Channels</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="voice">Voice</SelectItem>
                      <SelectItem value="rcs">RCS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Channel Sections */}
                {channelOrder.map(channel => {
                  const vendors = vendorsByChannel[channel];
                  if (!vendors || vendors.length === 0) return null;
                  
                  return (
                    <motion.div
                      key={channel}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Card>
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-3">
                              <Badge variant={getChannelColor(channel)} className="px-3 py-1">
                                {channelLabels[channel as keyof typeof channelLabels]}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {vendors.length} vendor{vendors.length !== 1 ? 's' : ''}
                              </span>
                            </CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {vendors.map((vendor) => (
                              <Card 
                                key={vendor.id} 
                                className="group cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200 border-2 hover:border-primary/50"
                                onClick={() => handleVendorOnboarding(vendor)}
                              >
                                <CardContent className="p-4">
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                      <img 
                                        src={vendor.logo} 
                                        alt={vendor.name}
                                        className="w-10 h-10 rounded object-contain"
                                      />
                                      <div className="flex-1">
                                        <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                                          {vendor.name}
                                        </h3>
                                        <p className="text-xs text-muted-foreground">
                                          Click to get started
                                        </p>
                                      </div>
                                    </div>
                                    
                                    {vendor.description && (
                                      <p className="text-xs text-muted-foreground line-clamp-2">
                                        {vendor.description}
                                      </p>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}

                {/* No vendors message */}
                {Object.keys(vendorsByChannel).length === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Store className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Vendors Found</h3>
                      <p className="text-muted-foreground">
                        Try selecting a different channel filter to see available vendors.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </TabsContent>

            {/* My Vendors Tab */}
            <TabsContent value="my-vendors" className="space-y-6">
              <MyVendorsSection
                integrations={vendorIntegrations}
                onConfigure={handleConfigure}
                onTest={handleTest}
                onViewHealth={handleViewHealth}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
              />
            </TabsContent>

            {/* Health Tab */}
            <TabsContent value="health" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* Filters above health content */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Vendor Health Dashboard</h2>
                  <div className="flex items-center gap-3">
                    <Select value={channelFilter} onValueChange={setChannelFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Channels</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="voice">Voice</SelectItem>
                        <SelectItem value="rcs">RCS</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24h">Last 24H</SelectItem>
                        <SelectItem value="7d">Last 7D</SelectItem>
                        <SelectItem value="30d">Last 30D</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {/* Health KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Avg Uptime</p>
                          <p className="text-2xl font-bold text-green-600">
                            {avgUptime.toFixed(1)}%
                          </p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Avg Error Rate</p>
                          <p className="text-2xl font-bold text-red-600">
                            {avgErrorRate.toFixed(2)}%
                          </p>
                        </div>
                        <TrendingDown className="w-8 h-8 text-red-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Avg Latency</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {Math.round(avgLatency)}ms
                          </p>
                        </div>
                        <Activity className="w-8 h-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Incidents</p>
                          <p className="text-2xl font-bold text-orange-600">
                            {totalIncidents}
                          </p>
                        </div>
                        <AlertTriangle className="w-8 h-8 text-orange-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Health Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Uptime Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={healthMetrics}>
                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                            <XAxis dataKey="timestamp" className="text-xs" />
                            <YAxis domain={[90, 100]} className="text-xs" />
                            <Tooltip />
                            <Line type="monotone" dataKey="uptime" stroke="#10b981" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Latency Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={healthMetrics}>
                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                            <XAxis dataKey="timestamp" className="text-xs" />
                            <YAxis className="text-xs" />
                            <Tooltip />
                            <Line type="monotone" dataKey="latency" stroke="#3b82f6" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Vendor Health Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Vendor Health Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Vendor</TableHead>
                          <TableHead>Channel</TableHead>
                          <TableHead>Uptime</TableHead>
                          <TableHead>Error Rate</TableHead>
                          <TableHead>Avg Latency</TableHead>
                          <TableHead>Incidents</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredHealthData.map((healthData) => {
                          const integration = vendorIntegrations.find(int => int.healthMetrics?.id === healthData.id);
                          if (!integration) return null;
                          
                          return (
                            <TableRow key={healthData.id}>
                              <TableCell className="font-medium">{integration.vendor.name}</TableCell>
                              <TableCell>
                                <Badge variant={getChannelColor(integration.channel)}>
                                  {integration.channel.toUpperCase()}
                                </Badge>
                              </TableCell>
                              <TableCell>{healthData.uptimePercentage.toFixed(2)}%</TableCell>
                              <TableCell>{healthData.errorRate.toFixed(2)}%</TableCell>
                              <TableCell>{Math.round(healthData.avgLatency)}ms</TableCell>
                              <TableCell>{healthData.incidents}</TableCell>
                              <TableCell>
                                <Badge variant={getStatusColor(healthData.status)}>
                                  {healthData.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </main>

        {/* Enhanced Onboarding Modal */}
        <VendorOnboardingModal
          isOpen={onboardingModalOpen}
          onClose={() => setOnboardingModalOpen(false)}
          vendor={selectedVendor}
          onComplete={handleOnboardingComplete}
        />
        
        {/* Navigation Modals */}
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

export default Vendors;