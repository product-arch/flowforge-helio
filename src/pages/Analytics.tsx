import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Area, AreaChart, ResponsiveContainer } from 'recharts';
import { BarChart3, ArrowLeft, HelpCircle, Settings, User, Bell, Moon, Sun, Globe, Shield, Database, Keyboard, LogOut, AlertTriangle, Server, TrendingUp, Users } from 'lucide-react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { THEMES, Theme } from '@/constants/themes';
import { ALL_VENDORS } from '@/constants/vendors';

// Types for analytics data
interface AlarmAlert {
  id: string;
  timestamp: Date;
  severity: 'critical' | 'high' | 'medium' | 'low';
  vendorConnection: string;
  alertType: string;
}

interface ServiceMonitor {
  id: string;
  serviceName: string;
  status: 'active' | 'inactive' | 'warning' | 'error';
  serverId: string;
}

interface TrafficData {
  timestamp: string;
  messages: number;
}

interface VendorTrafficReport {
  id: string;
  vendorName: string;
  channel: 'sms' | 'email' | 'rcs' | 'voice' | 'whatsapp';
  totalMessages: number;
  delivered: number;
  failed: number;
  successPercentage: number;
}

const Analytics: React.FC = () => {
  const navigate = useNavigate();
  const { theme, mode, setTheme, setMode } = useTheme();
  const { toast } = useToast();
  const [helpModalOpen, setHelpModalOpen] = React.useState(false);
  const [personalInfoOpen, setPersonalInfoOpen] = React.useState(false);
  const [accountSettingsOpen, setAccountSettingsOpen] = React.useState(false);
  const [billingOpen, setBillingOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [languageOpen, setLanguageOpen] = React.useState(false);
  const [privacyOpen, setPrivacyOpen] = React.useState(false);
  const [dataManagementOpen, setDataManagementOpen] = React.useState(false);
  const [keyboardShortcutsOpen, setKeyboardShortcutsOpen] = React.useState(false);
  
  // Analytics state
  const [dateFilter, setDateFilter] = useState('24h');
  const [alarmAlerts, setAlarmAlerts] = useState<AlarmAlert[]>([]);
  const [serviceMonitors, setServiceMonitors] = useState<ServiceMonitor[]>([]);
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [vendorReports, setVendorReports] = useState<VendorTrafficReport[]>([]);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    const themeName = THEMES.find(t => t.value === newTheme)?.name || 'Unknown';
    toast({
      title: "Theme Changed",
      description: `Switched to ${themeName}`,
      className: "border-status-success bg-status-success/10 text-status-success"
    });
  };

  // Generate dummy data
  const generateAlarmAlerts = () => {
    const severities: AlarmAlert['severity'][] = ['critical', 'high', 'medium', 'low'];
    const alertTypes = ['Connection Timeout', 'Rate Limit Exceeded', 'Service Unavailable', 'Authentication Failed', 'Delivery Failed'];
    const vendors = ['Twilio SMS', 'SendGrid Email', 'Meta WhatsApp', 'Plivo Voice', 'Google RCS'];
    
    return Array.from({ length: 50 }, (_, i) => ({
      id: `alert-${i}`,
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      severity: severities[Math.floor(Math.random() * severities.length)],
      vendorConnection: vendors[Math.floor(Math.random() * vendors.length)],
      alertType: alertTypes[Math.floor(Math.random() * alertTypes.length)]
    })).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const generateServiceMonitors = () => {
    const services = [
      'Message Router Service', 'Authentication Service', 'Rate Limiter Service', 
      'SMS Gateway', 'Email Gateway', 'WhatsApp Gateway', 'Voice Gateway', 'RCS Gateway',
      'Analytics Engine', 'Webhook Service', 'Database Service', 'Cache Service'
    ];
    const statuses: ServiceMonitor['status'][] = ['active', 'inactive', 'warning', 'error'];
    
    return services.map((service, i) => ({
      id: `service-${i}`,
      serviceName: service,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      serverId: Math.random() > 0.5 
        ? `192.168.1.${Math.floor(Math.random() * 255)}`
        : `2001:db8::${Math.floor(Math.random() * 255)}`
    }));
  };

  const generateTrafficData = () => {
    const now = new Date();
    return Array.from({ length: 24 }, (_, i) => {
      const time = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
      return {
        timestamp: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        messages: Math.floor(Math.random() * 1000) + 500
      };
    });
  };

  const generateVendorReports = () => {
    const channels: VendorTrafficReport['channel'][] = ['sms', 'email', 'rcs', 'voice', 'whatsapp'];
    
    return ALL_VENDORS.map((vendor, i) => {
      const channel = channels[Math.floor(Math.random() * channels.length)];
      const totalMessages = Math.floor(Math.random() * 10000) + 1000;
      const delivered = Math.floor(totalMessages * (0.8 + Math.random() * 0.15));
      const failed = totalMessages - delivered;
      
      return {
        id: `vendor-${i}`,
        vendorName: vendor.name,
        channel,
        totalMessages,
        delivered,
        failed,
        successPercentage: Math.round((delivered / totalMessages) * 100)
      };
    });
  };

  // Initialize data
  useEffect(() => {
    setAlarmAlerts(generateAlarmAlerts());
    setServiceMonitors(generateServiceMonitors());
    setTrafficData(generateTrafficData());
    setVendorReports(generateVendorReports());
  }, []);

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Add new alarm/alert
      if (Math.random() > 0.8) {
        const newAlert = generateAlarmAlerts()[0];
        setAlarmAlerts(prev => [newAlert, ...prev.slice(0, 49)]);
      }
      
      // Update traffic data
      setTrafficData(prev => {
        const newData = [...prev.slice(1)];
        const now = new Date();
        newData.push({
          timestamp: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          messages: Math.floor(Math.random() * 1000) + 500
        });
        return newData;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: AlarmAlert['severity']) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: ServiceMonitor['status']) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'warning': return 'secondary';
      case 'error': return 'destructive';
      default: return 'outline';
    }
  };

  const getChannelColor = (channel: VendorTrafficReport['channel']) => {
    switch (channel) {
      case 'sms': return 'default';
      case 'email': return 'secondary';
      case 'rcs': return 'outline';
      case 'voice': return 'destructive';
      case 'whatsapp': return 'default';
      default: return 'outline';
    }
  };

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
                      Analytics
                    </h1>
                  </div>
                  
                  <nav className="hidden md:flex items-center gap-6">
                    <Button variant="ghost" className="text-sm" onClick={() => navigate('/monitoring')}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Monitoring
                    </Button>
                  </nav>
                </div>

                <div className="flex items-center gap-3">
                  {/* Date Filter */}
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">Last Hour</SelectItem>
                      <SelectItem value="24h">Last 24H</SelectItem>
                      <SelectItem value="7d">Last 7D</SelectItem>
                      <SelectItem value="30d">Last 30D</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="ghost" size="sm" onClick={() => setHelpModalOpen(true)}>
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
                      <DropdownMenuItem onClick={() => setNotificationsOpen(true)}>
                        <Bell className="w-4 h-4 mr-2" />
                        Notifications
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setLanguageOpen(true)}>
                        <Globe className="w-4 h-4 mr-2" />
                        Language & Region
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setPrivacyOpen(true)}>
                        <Shield className="w-4 h-4 mr-2" />
                        Privacy & Security
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDataManagementOpen(true)}>
                        <Database className="w-4 h-4 mr-2" />
                        Data Management
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setKeyboardShortcutsOpen(true)}>
                        <Keyboard className="w-4 h-4 mr-2" />
                        Keyboard Shortcuts
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      
                      <div className="px-2 py-1">
                        <div className="text-xs font-medium text-muted-foreground mb-2">Themes</div>
                        <div className="grid grid-cols-3 gap-1">
                          {THEMES.map((themeOption) => (
                            <button
                              key={themeOption.value}
                              onClick={() => handleThemeChange(themeOption.value)}
                              className={`w-6 h-6 rounded-full ${themeOption.preview} hover:scale-110 transition-transform ${
                                theme === themeOption.value ? 'ring-2 ring-ring ring-offset-2 ring-offset-background' : ''
                              }`}
                              title={themeOption.name}
                            />
                          ))}
                        </div>
                        <div className="mt-2 flex gap-1">
                          <button
                            onClick={() => setMode('light')}
                            className={`px-2 py-1 text-xs rounded ${
                              mode === 'light' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                            }`}
                          >
                            Light
                          </button>
                          <button
                            onClick={() => setMode('dark')}
                            className={`px-2 py-1 text-xs rounded ${
                              mode === 'dark' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                            }`}
                          >
                            Dark
                          </button>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
                        {mode === 'light' ? <Moon className="w-4 h-4 mr-2" /> : <Sun className="w-4 h-4 mr-2" />}
                        {mode === 'light' ? 'Dark Mode' : 'Light Mode'}
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
                      <DropdownMenuItem onClick={() => setPersonalInfoOpen(true)}>
                        <User className="w-4 h-4 mr-2" />
                        Personal Info
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setAccountSettingsOpen(true)}>
                        <Settings className="w-4 h-4 mr-2" />
                        Account Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setBillingOpen(true)}>
                        <Badge className="w-4 h-4 mr-2" />
                        Billing
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      
                      <div className="px-2 py-1">
                        <div className="text-xs font-medium text-muted-foreground mb-2">Themes</div>
                        <div className="grid grid-cols-3 gap-1">
                          {THEMES.map((themeOption) => (
                            <button
                              key={themeOption.value}
                              onClick={() => handleThemeChange(themeOption.value)}
                              className={`w-6 h-6 rounded-full ${themeOption.preview} hover:scale-110 transition-transform ${
                                theme === themeOption.value ? 'ring-2 ring-ring ring-offset-2 ring-offset-background' : ''
                              }`}
                              title={themeOption.name}
                            />
                          ))}
                        </div>
                        <div className="mt-2 flex gap-1">
                          <button
                            onClick={() => setMode('light')}
                            className={`px-2 py-1 text-xs rounded ${
                              mode === 'light' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                            }`}
                          >
                            Light
                          </button>
                          <button
                            onClick={() => setMode('dark')}
                            className={`px-2 py-1 text-xs rounded ${
                              mode === 'dark' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                            }`}
                          >
                            Dark
                          </button>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
                        {mode === 'light' ? <Moon className="w-4 h-4 mr-2" /> : <Sun className="w-4 h-4 mr-2" />}
                        {mode === 'light' ? 'Dark Mode' : 'Light Mode'}
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

        {/* Content */}
        <main className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* 1. Real-time Alarm/Alert Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    Real-time Alarms/Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>Severity</TableHead>
                          <TableHead>Vendor</TableHead>
                          <TableHead>Alert Type</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {alarmAlerts.slice(0, 10).map((alert) => (
                          <TableRow key={alert.id}>
                            <TableCell className="text-xs">
                              {alert.timestamp.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Badge variant={getSeverityColor(alert.severity)}>
                                {alert.severity}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">{alert.vendorConnection}</TableCell>
                            <TableCell className="text-sm">{alert.alertType}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* 2. Service Monitor */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="w-5 h-5 text-blue-500" />
                    Service Monitor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Service Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Server ID</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {serviceMonitors.map((service) => (
                          <TableRow key={service.id}>
                            <TableCell className="font-medium">{service.serviceName}</TableCell>
                            <TableCell>
                              <Badge variant={getStatusColor(service.status)}>
                                {service.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-sm">{service.serverId}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* 3. Live Traffic Stream */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    Live Traffic Stream
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trafficData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area 
                          type="monotone" 
                          dataKey="messages" 
                          stroke="hsl(var(--primary))" 
                          fill="hsl(var(--primary))" 
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* 4. Vendor Traffic Count Report */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-500" />
                    Vendor Traffic Report
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Vendor Name</TableHead>
                          <TableHead>Channel</TableHead>
                          <TableHead>Total Messages</TableHead>
                          <TableHead>Delivered</TableHead>
                          <TableHead>Failed</TableHead>
                          <TableHead>Success %</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {vendorReports.map((report) => (
                          <TableRow key={report.id}>
                            <TableCell className="font-medium">{report.vendorName}</TableCell>
                            <TableCell>
                              <Badge variant={getChannelColor(report.channel)}>
                                {report.channel.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell>{report.totalMessages.toLocaleString()}</TableCell>
                            <TableCell className="text-green-600">
                              {report.delivered.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-red-600">
                              {report.failed.toLocaleString()}
                            </TableCell>
                            <TableCell className="font-semibold">
                              {report.successPercentage}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

          </div>
        </main>

        {/* Help Modal - Analytics specific content */}
        <Dialog open={helpModalOpen} onOpenChange={setHelpModalOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-500" />
                About Analytics Dashboard
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Analytics Features</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Real-time Monitoring:</strong> Live tracking of 
                    alarms, alerts, service health, and traffic patterns across all communication channels.
                  </p>
                  <p>
                    <strong className="text-foreground">Performance Insights:</strong> Comprehensive 
                    vendor performance metrics including delivery rates, failure analysis, and success percentages.
                  </p>
                  <p>
                    <strong className="text-foreground">Live Data Streams:</strong> Real-time message 
                    flow visualization with automated updates and trend analysis.
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Data Components</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Alarm/Alert Table:</strong> Real-time alerts 
                    from all vendor connections with severity levels and automatic refresh.
                  </p>
                  <p>
                    <strong className="text-foreground">Service Monitor:</strong> Live status tracking 
                    of all platform services including servers, gateways, and microservices.
                  </p>
                  <p>
                    <strong className="text-foreground">Traffic Analytics:</strong> Live message flow 
                    visualization with time-series data and trend analysis.
                  </p>
                  <p>
                    <strong className="text-foreground">Vendor Reports:</strong> Comprehensive 
                    performance analytics for all configured vendors across different channels.
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ThemeProvider>
  );
};

export default Analytics;