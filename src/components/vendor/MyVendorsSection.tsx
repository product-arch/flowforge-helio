import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, TestTube, Activity, Trash2, MoreVertical, Play, Pause, AlertTriangle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { VendorConfigurationModal } from './VendorConfigurationModal';
import { VendorTestModal } from './VendorTestModal';
import { VendorDeleteDialog } from './VendorDeleteDialog';
import type { VendorIntegration, TestResult } from '@/types/vendor-integration';
import { useToast } from '@/hooks/use-toast';

interface MyVendorsSectionProps {
  integrations: VendorIntegration[];
  onConfigure: (integration: VendorIntegration) => void;
  onTest: (integration: VendorIntegration) => void;
  onViewHealth: (integration: VendorIntegration) => void;
  onToggleStatus: (integration: VendorIntegration) => void;
  onDelete: (integration: VendorIntegration) => void;
}

export const MyVendorsSection: React.FC<MyVendorsSectionProps> = ({
  integrations,
  onConfigure,
  onTest,
  onViewHealth,
  onToggleStatus,
  onDelete
}) => {
  const [groupBy, setGroupBy] = useState<'channel' | 'vendor' | 'status'>('channel');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [configurationModalOpen, setConfigurationModalOpen] = useState(false);
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<VendorIntegration | null>(null);
  const { toast } = useToast();

  const getStatusColor = (status: VendorIntegration['status']) => {
    switch (status) {
      case 'active': return 'default';
      case 'testing': return 'secondary';
      case 'configuring': return 'outline';
      case 'suspended': return 'destructive';
      case 'error': return 'destructive';
      case 'inactive': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: VendorIntegration['status']) => {
    switch (status) {
      case 'active': return <Play className="w-3 h-3" />;
      case 'suspended': return <Pause className="w-3 h-3" />;
      case 'error': return <AlertTriangle className="w-3 h-3" />;
      default: return null;
    }
  };

  const filteredIntegrations = filterStatus === 'all' 
    ? integrations 
    : integrations.filter(integration => integration.status === filterStatus);

  const groupedIntegrations = React.useMemo(() => {
    const grouped: Record<string, VendorIntegration[]> = {};
    
    filteredIntegrations.forEach(integration => {
      let key: string;
      
      switch (groupBy) {
        case 'channel':
          key = integration.channel.toUpperCase();
          break;
        case 'vendor':
          key = integration.vendor.name;
          break;
        case 'status':
          key = integration.status.charAt(0).toUpperCase() + integration.status.slice(1);
          break;
        default:
          key = 'Other';
      }
      
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(integration);
    });
    
    return grouped;
  }, [filteredIntegrations, groupBy]);

  const handleConfigure = (integration: VendorIntegration) => {
    setSelectedIntegration(integration);
    setConfigurationModalOpen(true);
  };

  const handleTest = (integration: VendorIntegration) => {
    setSelectedIntegration(integration);
    setTestModalOpen(true);
  };

  const handleDelete = (integration: VendorIntegration) => {
    setSelectedIntegration(integration);
    setDeleteDialogOpen(true);
  };

  const handleToggleStatus = async (integration: VendorIntegration) => {
    const newStatus = integration.status === 'active' ? 'suspended' : 'active';
    
    toast({
      title: "Status Updated",
      description: `${integration.vendor.name} ${integration.channel} is now ${newStatus}`,
      className: "border-status-info bg-status-info/10 text-status-info"
    });
    
    onToggleStatus(integration);
  };

  const handleConfigurationSave = (integration: VendorIntegration, changes: Partial<VendorIntegration>) => {
    onConfigure(integration);
  };

  const handleTestComplete = (integration: VendorIntegration, result: TestResult) => {
    onTest(integration);
  };

  const handleDeleteConfirm = (integration: VendorIntegration) => {
    onDelete(integration);
  };

  if (integrations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            My Configured Vendors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Vendors Configured</h3>
            <p className="text-muted-foreground mb-4">
              Start by adding vendors from the marketplace to manage your integrations.
            </p>
            <Button onClick={() => window.location.reload()}>
              Browse Marketplace
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">My Configured Vendors</h2>
        <div className="flex items-center gap-3">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="testing">Testing</SelectItem>
              <SelectItem value="configuring">Configuring</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={groupBy} onValueChange={(value: any) => setGroupBy(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="channel">Group by Channel</SelectItem>
              <SelectItem value="vendor">Group by Vendor</SelectItem>
              <SelectItem value="status">Group by Status</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grouped Integrations */}
      {Object.entries(groupedIntegrations).map(([groupKey, groupIntegrations]) => (
        <Card key={groupKey}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <span>{groupKey}</span>
              <Badge variant="outline">
                {groupIntegrations.length} integration{groupIntegrations.length !== 1 ? 's' : ''}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupIntegrations.map((integration) => (
                <Card 
                  key={integration.id} 
                  className="group relative hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <img 
                            src={integration.vendor.logo} 
                            alt={integration.vendor.name}
                            className="w-8 h-8 rounded object-contain"
                          />
                          <div>
                            <h3 className="font-semibold text-sm">{integration.vendor.name}</h3>
                            <p className="text-xs text-muted-foreground uppercase">
                              {integration.channel}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {/* Quick Action Buttons */}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleConfigure(integration)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Settings className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleTest(integration)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <TestTube className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => onViewHealth(integration)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Activity className="w-4 h-4" />
                          </Button>
                          
                          {/* More Actions Dropdown */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-background border-border">
                              <DropdownMenuItem onClick={() => handleConfigure(integration)}>
                                <Settings className="w-4 h-4 mr-2" />
                                Configure
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleTest(integration)}>
                                <TestTube className="w-4 h-4 mr-2" />
                                Test Integration
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onViewHealth(integration)}>
                                <Activity className="w-4 h-4 mr-2" />
                                View Health
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleToggleStatus(integration)}
                                className={integration.status === 'active' ? 'text-orange-600' : 'text-green-600'}
                              >
                                {integration.status === 'active' ? (
                                  <>
                                    <Pause className="w-4 h-4 mr-2" />
                                    Suspend
                                  </>
                                ) : (
                                  <>
                                    <Play className="w-4 h-4 mr-2" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDelete(integration)}
                                className="text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusColor(integration.status)} className="flex items-center gap-1">
                          {getStatusIcon(integration.status)}
                          {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                        </Badge>
                      </div>

                      {/* Health Metrics */}
                      {integration.healthMetrics && (
                        <div className="space-y-2">
                          <Separator />
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-muted-foreground">Uptime:</span>
                              <span className="ml-1 font-medium">
                                {integration.healthMetrics.uptimePercentage.toFixed(1)}%
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Latency:</span>
                              <span className="ml-1 font-medium">
                                {integration.healthMetrics.avgLatency.toFixed(0)}ms
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Configuration Status */}
                      <div className="text-xs text-muted-foreground">
                        {integration.configuration.tpsLimit && (
                          <span>TPS Limit: {integration.configuration.tpsLimit}</span>
                        )}
                        {integration.testResults && (
                          <div className="mt-1">
                            Last tested: {integration.testResults.lastTested.toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Modals */}
      <VendorConfigurationModal
        isOpen={configurationModalOpen}
        onClose={() => setConfigurationModalOpen(false)}
        integration={selectedIntegration}
        onSave={handleConfigurationSave}
      />
      
      <VendorTestModal
        isOpen={testModalOpen}
        onClose={() => setTestModalOpen(false)}
        integration={selectedIntegration}
        onTestComplete={handleTestComplete}
      />
      
      <VendorDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        integration={selectedIntegration}
        onDelete={handleDeleteConfirm}
      />
    </motion.div>
  );
};