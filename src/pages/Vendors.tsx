import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Store, ArrowLeft, Activity, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, Plus, ExternalLink, Settings } from 'lucide-react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { ALL_VENDORS, getVendorsByType, Vendor } from '@/constants/vendors';

// Types for vendor data
interface VendorHealth {
  id: string;
  vendorName: string;
  channel: 'sms' | 'email' | 'rcs' | 'voice' | 'whatsapp';
  uptimePercentage: number;
  errorRate: number;
  avgLatency: number;
  incidents: number;
  lastIncident?: Date;
  status: 'healthy' | 'warning' | 'critical';
}

interface VendorOnboardingData {
  vendorId: string;
  businessName: string;
  contactEmail: string;
  contactPhone: string;
  useCases: string;
  expectedVolume: string;
  additionalNotes: string;
}

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
  const [onboardingData, setOnboardingData] = useState<VendorOnboardingData>({
    vendorId: '',
    businessName: '',
    contactEmail: '',
    contactPhone: '',
    useCases: '',
    expectedVolume: '',
    additionalNotes: ''
  });
  
  // Data state
  const [vendorHealthData, setVendorHealthData] = useState<VendorHealth[]>([]);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetricData[]>([]);

  // Generate vendor health data
  const generateVendorHealthData = (): VendorHealth[] => {
    return ALL_VENDORS.slice(0, 8).map((vendor, index) => ({
      id: `health-${index}`,
      vendorName: vendor.name,
      channel: vendor.type,
      uptimePercentage: 95 + Math.random() * 4.5, // 95-99.5%
      errorRate: Math.random() * 2, // 0-2%
      avgLatency: 100 + Math.random() * 150, // 100-250ms
      incidents: Math.floor(Math.random() * 3),
      lastIncident: Math.random() > 0.7 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : undefined,
      status: Math.random() > 0.8 ? 'warning' : Math.random() > 0.95 ? 'critical' : 'healthy'
    }));
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
    setVendorHealthData(generateVendorHealthData());
    setHealthMetrics(generateHealthMetrics());
  }, [dateFilter]);

  // Handle vendor onboarding
  const handleVendorOnboarding = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setOnboardingData(prev => ({ ...prev, vendorId: vendor.id }));
    setOnboardingModalOpen(true);
  };

  const handleOnboardingSubmit = () => {
    if (!onboardingData.businessName || !onboardingData.contactEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Onboarding Request Submitted",
      description: `Your request for ${selectedVendor?.name} has been submitted successfully`,
      className: "border-status-success bg-status-success/10 text-status-success"
    });

    setOnboardingModalOpen(false);
    setOnboardingData({
      vendorId: '',
      businessName: '',
      contactEmail: '',
      contactPhone: '',
      useCases: '',
      expectedVolume: '',
      additionalNotes: ''
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

  const filteredHealthData = channelFilter === 'all'
    ? vendorHealthData
    : vendorHealthData.filter(v => v.channel === channelFilter);

  // Calculate summary metrics
  const avgUptime = filteredHealthData.reduce((sum, v) => sum + v.uptimePercentage, 0) / filteredHealthData.length || 0;
  const avgErrorRate = filteredHealthData.reduce((sum, v) => sum + v.errorRate, 0) / filteredHealthData.length || 0;
  const avgLatency = filteredHealthData.reduce((sum, v) => sum + v.avgLatency, 0) / filteredHealthData.length || 0;
  const totalIncidents = filteredHealthData.reduce((sum, v) => sum + v.incidents, 0);

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
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <Store className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                      Vendors
                    </h1>
                  </div>
                  
                  <nav className="hidden md:flex items-center gap-6">
                    <Button variant="ghost" className="text-sm" onClick={() => navigate('/')}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Home
                    </Button>
                  </nav>
                </div>

                <div className="flex items-center gap-3">
                  {/* Channel Filter */}
                  <Select value={channelFilter} onValueChange={setChannelFilter}>
                    <SelectTrigger className="w-32">
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

                  {/* Date Filter */}
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
            </div>
          </div>
        </header>

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
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Store className="w-5 h-5" />
                      Vendor Marketplace
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {filteredVendors.map((vendor) => (
                        <Card key={vendor.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <img 
                                  src={vendor.logo} 
                                  alt={vendor.name}
                                  className="w-8 h-8 rounded object-contain"
                                />
                                <div className="flex-1">
                                  <h3 className="font-semibold text-sm">{vendor.name}</h3>
                                  <Badge variant={getChannelColor(vendor.type)} className="text-xs">
                                    {vendor.type.toUpperCase()}
                                  </Badge>
                                </div>
                              </div>
                              
                              {vendor.description && (
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {vendor.description}
                                </p>
                              )}
                              
                              <Button 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleVendorOnboarding(vendor)}
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                Get Started
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* My Vendors Tab */}
            <TabsContent value="my-vendors" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      My Configured Vendors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Store className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Vendors Configured</h3>
                      <p className="text-muted-foreground mb-4">
                        Start by adding vendors from the marketplace to manage your integrations.
                      </p>
                      <Button onClick={() => setActiveTab('marketplace')}>
                        Browse Marketplace
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Health Tab */}
            <TabsContent value="health" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
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
                        {filteredHealthData.map((vendor) => (
                          <TableRow key={vendor.id}>
                            <TableCell className="font-medium">{vendor.vendorName}</TableCell>
                            <TableCell>
                              <Badge variant={getChannelColor(vendor.channel)}>
                                {vendor.channel.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell>{vendor.uptimePercentage.toFixed(2)}%</TableCell>
                            <TableCell>{vendor.errorRate.toFixed(2)}%</TableCell>
                            <TableCell>{Math.round(vendor.avgLatency)}ms</TableCell>
                            <TableCell>{vendor.incidents}</TableCell>
                            <TableCell>
                              <Badge variant={getStatusColor(vendor.status)}>
                                {vendor.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </main>

        {/* Onboarding Modal */}
        <Dialog open={onboardingModalOpen} onOpenChange={setOnboardingModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Store className="w-5 h-5" />
                Vendor Onboarding - {selectedVendor?.name}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={onboardingData.businessName}
                    onChange={(e) => setOnboardingData(prev => ({ ...prev, businessName: e.target.value }))}
                    placeholder="Your business name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={onboardingData.contactEmail}
                    onChange={(e) => setOnboardingData(prev => ({ ...prev, contactEmail: e.target.value }))}
                    placeholder="contact@company.com"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={onboardingData.contactPhone}
                    onChange={(e) => setOnboardingData(prev => ({ ...prev, contactPhone: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expectedVolume">Expected Volume</Label>
                  <Select value={onboardingData.expectedVolume} onValueChange={(value) => setOnboardingData(prev => ({ ...prev, expectedVolume: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select volume" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (&lt; 1K/month)</SelectItem>
                      <SelectItem value="medium">Medium (1K-10K/month)</SelectItem>
                      <SelectItem value="high">High (10K-100K/month)</SelectItem>
                      <SelectItem value="enterprise">Enterprise (&gt; 100K/month)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="useCases">Use Cases</Label>
                <Textarea
                  id="useCases"
                  value={onboardingData.useCases}
                  onChange={(e) => setOnboardingData(prev => ({ ...prev, useCases: e.target.value }))}
                  placeholder="Describe your use cases..."
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="additionalNotes">Additional Notes</Label>
                <Textarea
                  id="additionalNotes"
                  value={onboardingData.additionalNotes}
                  onChange={(e) => setOnboardingData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                  placeholder="Any additional information..."
                  rows={2}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOnboardingModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleOnboardingSubmit}>
                Submit Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ThemeProvider>
  );
};

export default Vendors;