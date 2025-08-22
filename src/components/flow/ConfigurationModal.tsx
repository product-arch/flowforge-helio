import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, X } from 'lucide-react';
import { useFlow } from '@/contexts/FlowContext';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

interface ConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodeId: string;
}

interface Vendor {
  id: string;
  name: string;
  logo: string;
  type: 'sms' | 'email' | 'voice' | 'whatsapp' | 'rcs';
}

const VENDORS: Vendor[] = [
  { id: 'twilio', name: 'Twilio', logo: '🔴', type: 'sms' },
  { id: 'textlocal', name: 'TextLocal', logo: '🟢', type: 'sms' },
  { id: 'msg91', name: 'MSG91', logo: '🔵', type: 'sms' },
  { id: 'sendgrid', name: 'SendGrid', logo: '🟦', type: 'email' },
  { id: 'mailgun', name: 'Mailgun', logo: '🟨', type: 'email' },
  { id: 'ses', name: 'AWS SES', logo: '🟧', type: 'email' },
  { id: 'plivo', name: 'Plivo', logo: '🟣', type: 'voice' },
  { id: 'exotel', name: 'Exotel', logo: '⚫', type: 'voice' },
  { id: 'whatsapp-business', name: 'WhatsApp Business', logo: '🟢', type: 'whatsapp' },
  { id: 'gupshup', name: 'Gupshup', logo: '🔵', type: 'whatsapp' },
  { id: 'google-rcs', name: 'Google RCS', logo: '🔴', type: 'rcs' },
  { id: 'samsung-rcs', name: 'Samsung RCS', logo: '🔵', type: 'rcs' },
];

interface FallbackConfig {
  channel: string;
  vendors: string[];
}

export const ConfigurationModal: React.FC<ConfigurationModalProps> = ({
  isOpen,
  onClose,
  nodeId
}) => {
  const { nodes, updateNodeData } = useFlow();
  const { toast } = useToast();

  const selectedNode = nodes.find(node => node.id === nodeId);
  const [selectedVendors, setSelectedVendors] = useState<string[]>((selectedNode?.data?.selectedVendors as string[]) || []);
  const [fallbackConfig, setFallbackConfig] = useState<FallbackConfig | null>((selectedNode?.data?.fallback as FallbackConfig) || null);

  if (!selectedNode) {
    return null;
  }

  const getChannelVendors = (channelType: string) => {
    const channelMap: Record<string, string> = {
      'sms': 'sms',
      'whatsapp': 'whatsapp', 
      'email': 'email',
      'voice': 'voice',
      'rcs': 'rcs'
    };
    return VENDORS.filter(vendor => vendor.type === channelMap[channelType]);
  };
  
  const toggleVendor = (vendorId: string) => {
    setSelectedVendors(prev =>
      prev.includes(vendorId) 
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    );
  };
  
  const addFallback = () => {
    setFallbackConfig({ channel: '', vendors: [] });
  };
  
  const removeFallback = () => {
    setFallbackConfig(null);
  };
  
  const updateFallbackChannel = (channel: string) => {
    setFallbackConfig(prev => prev ? { ...prev, channel, vendors: [] } : null);
  };
  
  const toggleFallbackVendor = (vendorId: string) => {
    setFallbackConfig(prev => {
      if (!prev) return null;
      return {
        ...prev,
        vendors: prev.vendors.includes(vendorId) 
          ? prev.vendors.filter(id => id !== vendorId)
          : [...prev.vendors, vendorId]
      };
    });
  };

  const handleUpdateData = (newData: any) => {
    const updatedData = {
      ...selectedNode.data,
      ...newData,
      selectedVendors,
      fallback: fallbackConfig,
    };
    updateNodeData(selectedNode.id, updatedData);
    toast({
      title: "Node Updated",
      description: "Configuration saved successfully.",
      className: "border-status-success bg-status-success/10 text-status-success"
    });
  };

  const renderConfiguration = () => {
    switch (selectedNode.type) {
      case 'vendorrouting':
        return <VendorRoutingConfiguration node={selectedNode} onUpdate={handleUpdateData} />;
      case 'conditional':
        return <ConditionalConfiguration node={selectedNode} onUpdate={handleUpdateData} />;
      case 'converge':
      case 'diverge':
      case 'timer':
      case 'doevent':
      case 'switch':
      case 'filter':
        return <ControlsLogicConfiguration node={selectedNode} onUpdate={handleUpdateData} />;
      case 'terminal':
        return <TerminalConfiguration node={selectedNode} onUpdate={handleUpdateData} />;
      case 'audit':
        return <AuditConfiguration node={selectedNode} onUpdate={handleUpdateData} />;
      case 'sms':
        return <SMSConfiguration node={selectedNode} onUpdate={handleUpdateData} />;
      case 'whatsapp':
        return <WhatsAppConfiguration node={selectedNode} onUpdate={handleUpdateData} />;
      case 'email':
        return <EmailConfiguration node={selectedNode} onUpdate={handleUpdateData} />;
      case 'voice':
        return <VoiceConfiguration node={selectedNode} onUpdate={handleUpdateData} />;
      case 'rcs':
        return <RCSConfiguration node={selectedNode} onUpdate={handleUpdateData} />;
      case 'leastcost':
        return <LeastCostConfiguration node={selectedNode} onUpdate={handleUpdateData} />;
      case 'weightedsplit':
        return <WeightedSplitConfiguration node={selectedNode} onUpdate={handleUpdateData} />;
      case 'fallback':
        return <FallbackConfiguration node={selectedNode} onUpdate={handleUpdateData} />;
      case 'filter':
        return <FilterConfiguration node={selectedNode} onUpdate={handleUpdateData} />;
      case 'switch':
        return <SwitchConfiguration node={selectedNode} onUpdate={handleUpdateData} />;
      case 'ratelimit':
        return <RateLimitConfiguration node={selectedNode} onUpdate={handleUpdateData} />;
      case 'delay':
        return <DelayConfiguration node={selectedNode} onUpdate={handleUpdateData} />;
      case 'throttle':
        return <ThrottleConfiguration node={selectedNode} onUpdate={handleUpdateData} />;
      case 'webhook':
        return <IntegrationMonitoringConfiguration node={selectedNode} onUpdate={handleUpdateData} />;
      case 'database':
        return <IntegrationMonitoringConfiguration node={selectedNode} onUpdate={handleUpdateData} />;
      case 'transform':
        return <IntegrationMonitoringConfiguration node={selectedNode} onUpdate={handleUpdateData} />;
      case 'api':
        return <IntegrationMonitoringConfiguration node={selectedNode} onUpdate={handleUpdateData} />;
      case 'analytics':
        return <IntegrationMonitoringConfiguration node={selectedNode} onUpdate={handleUpdateData} />;
      case 'alert':
        return <IntegrationMonitoringConfiguration node={selectedNode} onUpdate={handleUpdateData} />;
      default:
        return <div className="text-center text-muted-foreground">No configuration available for this node type.</div>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Configuration
            <Badge variant="secondary">{selectedNode.type}</Badge>
            <span className="text-sm text-muted-foreground truncate">
              {String(selectedNode.data.label || selectedNode.type)}
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto pr-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedNode.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Vendor Selection for Channel Nodes */}
              {['sms', 'email', 'voice', 'whatsapp', 'rcs'].includes(selectedNode.type || '') && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Select Vendors</Label>
                    <p className="text-xs text-muted-foreground mb-3">Choose one or more vendors for this channel</p>
                    <div className="grid grid-cols-2 gap-3">
                      {getChannelVendors(selectedNode.type || '').map(vendor => (
                        <div 
                          key={vendor.id}
                          className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                            selectedVendors.includes(vendor.id) 
                              ? 'border-primary bg-primary/5' 
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => toggleVendor(vendor.id)}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{vendor.logo}</span>
                            <span className="font-medium text-sm">{vendor.name}</span>
                            {selectedVendors.includes(vendor.id) && (
                              <Badge variant="default" className="ml-auto text-xs">Selected</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Fallback Configuration */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <Label className="text-sm font-medium">Fallback Channel</Label>
                        <p className="text-xs text-muted-foreground">Configure backup channel if primary fails</p>
                      </div>
                      {!fallbackConfig ? (
                        <Button variant="outline" size="sm" onClick={addFallback}>
                          <Plus className="w-4 h-4 mr-1" />
                          Add Fallback
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" onClick={removeFallback}>
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remove
                        </Button>
                      )}
                    </div>

                    {fallbackConfig && (
                      <div className="space-y-3 border rounded-lg p-4 bg-accent/20">
                        <div>
                          <Label className="text-xs">Fallback Channel</Label>
                          <Select value={fallbackConfig.channel} onValueChange={updateFallbackChannel}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select fallback channel" />
                            </SelectTrigger>
                            <SelectContent>
                              {['sms', 'email', 'voice', 'whatsapp', 'rcs']
                                .filter(ch => ch !== selectedNode.type)
                                .map(channel => (
                                  <SelectItem key={channel} value={channel}>
                                    {channel.toUpperCase()}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {fallbackConfig.channel && (
                          <div>
                            <Label className="text-xs">Fallback Vendors</Label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              {getChannelVendors(fallbackConfig.channel).map(vendor => (
                                <div 
                                  key={vendor.id}
                                  className={`border rounded-lg p-2 cursor-pointer transition-colors ${
                                    fallbackConfig.vendors.includes(vendor.id) 
                                      ? 'border-primary bg-primary/5' 
                                      : 'border-border hover:border-primary/50'
                                  }`}
                                  onClick={() => toggleFallbackVendor(vendor.id)}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm">{vendor.logo}</span>
                                    <span className="text-xs font-medium">{vendor.name}</span>
                                    {fallbackConfig.vendors.includes(vendor.id) && (
                                      <Badge variant="secondary" className="ml-auto text-xs px-1 py-0">✓</Badge>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <Separator />
                </div>
              )}

              {renderConfiguration()}
            </motion.div>
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Import vendor routing configuration
import { VendorRoutingConfiguration } from './VendorRoutingConfiguration';

// Configuration components for each node type
const OldVendorRoutingConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({
  node,
  onUpdate,
}) => {
  const [configType, setConfigType] = useState(node.data.configType || 'default');
  const [routingConfig, setRoutingConfig] = useState(node.data.routingConfig || {
    mode: 'priority',
    vendors: [],
    fallbackEnabled: true,
    fallbackOrder: []
  });

  const handleConfigTypeChange = (type: string) => {
    setConfigType(type);
    onUpdate({ ...node.data, configType: type });
  };

  const handleRoutingConfigChange = (config: any) => {
    setRoutingConfig(config);
    onUpdate({ ...node.data, routingConfig: config });
  };

  const AVAILABLE_VENDORS = [
    { id: 'twilio', name: 'Twilio', logo: '🔴' },
    { id: 'sendgrid', name: 'SendGrid', logo: '🟦' },
    { id: 'plivo', name: 'Plivo', logo: '🟣' },
    { id: 'gupshup', name: 'Gupshup', logo: '🔵' },
    { id: 'karix', name: 'Karix', logo: '🟢' },
    { id: 'msg91', name: 'MSG91', logo: '🟡' },
  ];

  const addVendor = () => {
    const newVendor = {
      id: `vendor-${Date.now()}`,
      weight: 100 / (routingConfig.vendors.length + 1),
      priority: routingConfig.vendors.length + 1,
      tpsCap: 100,
      costCap: 1000
    };
    
    const updatedVendors = [...routingConfig.vendors, newVendor];
    const updatedConfig = { ...routingConfig, vendors: updatedVendors };
    handleRoutingConfigChange(updatedConfig);
  };

  const removeVendor = (index: number) => {
    const updatedVendors = routingConfig.vendors.filter((_: any, i: number) => i !== index);
    const updatedConfig = { ...routingConfig, vendors: updatedVendors };
    handleRoutingConfigChange(updatedConfig);
  };

  const updateVendor = (index: number, field: string, value: any) => {
    const updatedVendors = routingConfig.vendors.map((vendor: any, i: number) =>
      i === index ? { ...vendor, [field]: value } : vendor
    );
    const updatedConfig = { ...routingConfig, vendors: updatedVendors };
    handleRoutingConfigChange(updatedConfig);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Routing Configuration Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div 
              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                configType === 'default' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => handleConfigTypeChange('default')}
            >
              <div className="flex items-center gap-2">
                <Badge variant={configType === 'default' ? 'default' : 'secondary'} className="text-xs">
                  Default
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Use system default routing
              </p>
            </div>
            
            <div 
              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                configType === 'custom' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => handleConfigTypeChange('custom')}
            >
              <div className="flex items-center gap-2">
                <Badge variant={configType === 'custom' ? 'default' : 'secondary'} className="text-xs">
                  Custom
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Configure custom routing logic
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {configType === 'custom' && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Routing Strategy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label>Mode</Label>
                <Select
                  value={routingConfig.mode}
                  onValueChange={(value) => handleRoutingConfigChange({ ...routingConfig, mode: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="priority">Priority Based</SelectItem>
                    <SelectItem value="weighted">Weighted Distribution</SelectItem>
                    <SelectItem value="fixed">Fixed Assignment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center justify-between">
                Vendor Configuration
                <Button size="sm" onClick={addVendor}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Vendor
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {routingConfig.vendors.map((vendor: any, index: number) => (
                <div key={vendor.id || index} className="p-3 border border-border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Vendor {index + 1}</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeVendor(index)}
                      className="w-6 h-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <div>
                    <Label className="text-xs">Vendor</Label>
                    <Select
                      value={vendor.id}
                      onValueChange={(value) => updateVendor(index, 'id', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_VENDORS.map(v => (
                          <SelectItem key={v.id} value={v.id}>
                            {v.logo} {v.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {routingConfig.mode === 'weighted' && (
                    <div>
                      <Label className="text-xs">Weight (%)</Label>
                      <Slider
                        value={[vendor.weight || 0]}
                        onValueChange={([value]) => updateVendor(index, 'weight', value)}
                        max={100}
                        step={1}
                        className="mt-2"
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        {vendor.weight || 0}%
                      </div>
                    </div>
                  )}

                  {routingConfig.mode === 'priority' && (
                    <div>
                      <Label className="text-xs">Priority</Label>
                      <Input
                        type="number"
                        value={vendor.priority || 1}
                        onChange={(e) => updateVendor(index, 'priority', parseInt(e.target.value))}
                        min={1}
                        className="mt-1"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">TPS Cap</Label>
                      <Input
                        type="number"
                        value={vendor.tpsCap || ''}
                        onChange={(e) => updateVendor(index, 'tpsCap', parseInt(e.target.value))}
                        placeholder="100"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Cost Cap (₹)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={vendor.costCap || ''}
                        onChange={(e) => updateVendor(index, 'costCap', parseFloat(e.target.value))}
                        placeholder="1000"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {routingConfig.vendors.length === 0 && (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  No vendors configured. Click "Add Vendor" to get started.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Fallback Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={routingConfig.fallbackEnabled}
                  onCheckedChange={(checked) => 
                    handleRoutingConfigChange({ ...routingConfig, fallbackEnabled: checked })
                  }
                />
                <Label>Enable automatic fallback</Label>
              </div>
              
              {routingConfig.fallbackEnabled && (
                <div>
                  <Label className="text-xs">Fallback Order</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Vendors will be tried in priority order if primary fails
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

const RoutingConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({
  node,
  onUpdate,
}) => {
  const [strategy, setStrategy] = useState(node.data.strategy || 'weightedSplit');
  const [vendors, setVendors] = useState(node.data.vendors || []);
  const [fallbackEnabled, setFallbackEnabled] = useState(node.data.fallbackEnabled || false);

  const addVendor = () => {
    const newVendor = {
      id: `vendor-${Date.now()}`,
      vendorId: '',
      weight: 0,
      priority: vendors.length + 1,
      tpsLimit: '',
      costCap: '',
      quotaLimit: '',
      activeWindow: { start: '00:00', end: '23:59' }
    };
    const updatedVendors = [...vendors, newVendor];
    setVendors(updatedVendors);
    onUpdate({ ...node.data, vendors: updatedVendors });
  };

  const updateVendor = (index: number, field: string, value: any) => {
    const updatedVendors = vendors.map((vendor: any, i: number) =>
      i === index ? { ...vendor, [field]: value } : vendor
    );
    setVendors(updatedVendors);
    onUpdate({ ...node.data, vendors: updatedVendors });
  };

  const removeVendor = (index: number) => {
    const updatedVendors = vendors.filter((_: any, i: number) => i !== index);
    setVendors(updatedVendors);
    onUpdate({ ...node.data, vendors: updatedVendors });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Routing Strategy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label htmlFor="strategy">Strategy</Label>
            <Select
              value={strategy}
              onValueChange={(value) => {
                setStrategy(value);
                onUpdate({ ...node.data, strategy: value });
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weightedSplit">Weighted Split</SelectItem>
                <SelectItem value="spillover">Spillover</SelectItem>
                <SelectItem value="firstAvailable">First Available</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            Vendors
            <Button size="sm" onClick={addVendor}>
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {vendors.map((vendor: any, index: number) => (
            <div key={vendor.id} className="p-3 border border-border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Vendor {index + 1}</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeVendor(index)}
                  className="w-6 h-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
              <Select
                value={vendor.vendorId}
                onValueChange={(value) => updateVendor(index, 'vendorId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gupshup">Gupshup</SelectItem>
                  <SelectItem value="karix">Karix</SelectItem>
                  <SelectItem value="kaleyra">Kaleyra</SelectItem>
                </SelectContent>
              </Select>
              
              {strategy === 'weightedSplit' && (
                <div>
                  <Label className="text-xs">Weight (%)</Label>
                  <Input
                    type="number"
                    value={vendor.weight}
                    onChange={(e) => updateVendor(index, 'weight', parseInt(e.target.value))}
                    placeholder="0"
                  />
                </div>
              )}
              
              {strategy === 'spillover' && (
                <div>
                  <Label className="text-xs">Priority</Label>
                  <Input
                    type="number"
                    value={vendor.priority}
                    onChange={(e) => updateVendor(index, 'priority', parseInt(e.target.value))}
                    placeholder="1"
                  />
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Fallback Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Switch
              checked={fallbackEnabled}
              onCheckedChange={(checked) => {
                setFallbackEnabled(checked);
                onUpdate({ ...node.data, fallbackEnabled: checked });
              }}
            />
            <Label>Enable Fallback</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


const ConditionalConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({
  node,
  onUpdate,
}) => {
  const [conditions, setConditions] = useState(node.data.conditions || []);

  const addCondition = () => {
    const newCondition = {
      id: `condition-${Date.now()}`,
      field: '',
      operator: 'equals',
      value: ''
    };
    const updatedConditions = [...conditions, newCondition];
    setConditions(updatedConditions);
    onUpdate({ ...node.data, conditions: updatedConditions });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            Conditions
            <Button size="sm" onClick={addCondition}>
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {conditions.map((condition: any, index: number) => (
            <div key={condition.id} className="p-3 border border-border rounded-lg space-y-2">
              <Select
                value={condition.field}
                onValueChange={(value) => {
                  const updated = conditions.map((c: any, i: number) =>
                    i === index ? { ...c, field: value } : c
                  );
                  setConditions(updated);
                  onUpdate({ ...node.data, conditions: updated });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="messageType">Message Type</SelectItem>
                  <SelectItem value="userType">User Type</SelectItem>
                  <SelectItem value="cost">Cost</SelectItem>
                  <SelectItem value="time">Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

const TerminalConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({
  node,
  onUpdate,
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Terminal State</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>State</Label>
            <Select
              value={node.data.state || 'sent'}
              onValueChange={(value) => onUpdate({ ...node.data, state: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="dropped">Dropped</SelectItem>
                <SelectItem value="alerted">Alerted</SelectItem>
                <SelectItem value="queued">Queued</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Reason</Label>
            <Textarea
              value={node.data.reason || ''}
              onChange={(e) => onUpdate({ ...node.data, reason: e.target.value })}
              placeholder="Enter reason..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const SMSConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({ node, onUpdate }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">SMS Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Sender ID</Label>
            <Input
              value={node.data.senderId || ''}
              onChange={(e) => onUpdate({ ...node.data, senderId: e.target.value })}
              placeholder="Enter sender ID"
            />
          </div>
          <div>
            <Label>Message Type</Label>
            <Select
              value={node.data.messageType || 'transactional'}
              onValueChange={(value) => onUpdate({ ...node.data, messageType: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transactional">Transactional</SelectItem>
                <SelectItem value="promotional">Promotional</SelectItem>
                <SelectItem value="utility">Utility</SelectItem>
                <SelectItem value="authentication">Authentication</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Encoding</Label>
            <Select
              value={node.data.encoding || 'utf8'}
              onValueChange={(value) => onUpdate({ ...node.data, encoding: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utf8">UTF-8</SelectItem>
                <SelectItem value="unicode">Unicode</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const WhatsAppConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({ node, onUpdate }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">WhatsApp Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Business ID</Label>
            <Input
              value={node.data.businessId || ''}
              onChange={(e) => onUpdate({ ...node.data, businessId: e.target.value })}
              placeholder="Enter business ID"
            />
          </div>
          <div>
            <Label>Bot Name</Label>
            <Input
              value={node.data.botName || ''}
              onChange={(e) => onUpdate({ ...node.data, botName: e.target.value })}
              placeholder="Enter bot name"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const EmailConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({ node, onUpdate }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Email Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>From Email</Label>
            <Input
              value={node.data.fromEmail || ''}
              onChange={(e) => onUpdate({ ...node.data, fromEmail: e.target.value })}
              placeholder="noreply@example.com"
            />
          </div>
          <div>
            <Label>Template ID</Label>
            <Input
              value={node.data.templateId || ''}
              onChange={(e) => onUpdate({ ...node.data, templateId: e.target.value })}
              placeholder="Enter template ID"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const VoiceConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({ node, onUpdate }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Voice Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Caller ID</Label>
            <Input
              value={node.data.callerId || ''}
              onChange={(e) => onUpdate({ ...node.data, callerId: e.target.value })}
              placeholder="Enter caller ID"
            />
          </div>
          <div>
            <Label>Voice Type</Label>
            <Select
              value={node.data.voiceType || 'automated'}
              onValueChange={(value) => onUpdate({ ...node.data, voiceType: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="automated">Automated</SelectItem>
                <SelectItem value="human">Human</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const RCSConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({ node, onUpdate }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">RCS Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Bot ID</Label>
            <Input
              value={node.data.botId || ''}
              onChange={(e) => onUpdate({ ...node.data, botId: e.target.value })}
              placeholder="Enter bot ID"
            />
          </div>
          <div>
            <Label>Agent Name</Label>
            <Input
              value={node.data.agentName || ''}
              onChange={(e) => onUpdate({ ...node.data, agentName: e.target.value })}
              placeholder="Enter agent name"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AuditConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({ node, onUpdate }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Audit Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Log Level</Label>
            <Select
              value={node.data.logLevel || 'info'}
              onValueChange={(value) => onUpdate({ ...node.data, logLevel: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="debug">Debug</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warn">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={node.data.capturePayload || false}
              onCheckedChange={(checked) => onUpdate({ ...node.data, capturePayload: checked })}
            />
            <Label>Capture Payload</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const LeastCostConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({ node, onUpdate }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Least Cost Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Cost Threshold (₹)</Label>
            <Input
              type="number"
              step="0.001"
              value={node.data.costThreshold || ''}
              onChange={(e) => onUpdate({ ...node.data, costThreshold: parseFloat(e.target.value) })}
              placeholder="0.050"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const WeightedSplitConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({ node, onUpdate }) => {
  const [weights, setWeights] = useState(node.data.weights || []);

  const addWeight = () => {
    const newWeight = { vendor: '', weight: 0 };
    const updatedWeights = [...weights, newWeight];
    setWeights(updatedWeights);
    onUpdate({ ...node.data, weights: updatedWeights });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            Weighted Split Configuration
            <Button size="sm" onClick={addWeight}>
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {weights.map((weight: any, index: number) => (
            <div key={index} className="p-3 border border-border rounded-lg space-y-2">
              <div>
                <Label className="text-xs">Vendor</Label>
                <Input
                  value={weight.vendor}
                  onChange={(e) => {
                    const updated = weights.map((w: any, i: number) =>
                      i === index ? { ...w, vendor: e.target.value } : w
                    );
                    setWeights(updated);
                    onUpdate({ ...node.data, weights: updated });
                  }}
                  placeholder="Vendor name"
                />
              </div>
              <div>
                <Label className="text-xs">Weight (%)</Label>
                <Input
                  type="number"
                  value={weight.weight}
                  onChange={(e) => {
                    const updated = weights.map((w: any, i: number) =>
                      i === index ? { ...w, weight: parseInt(e.target.value) } : w
                    );
                    setWeights(updated);
                    onUpdate({ ...node.data, weights: updated });
                  }}
                  placeholder="0"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

const FallbackConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({ node, onUpdate }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Fallback Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Retry Count</Label>
            <Input
              type="number"
              value={node.data.retryCount || ''}
              onChange={(e) => onUpdate({ ...node.data, retryCount: parseInt(e.target.value) })}
              placeholder="3"
            />
          </div>
          <div>
            <Label>Retry Delay (seconds)</Label>
            <Input
              type="number"
              value={node.data.retryDelay || ''}
              onChange={(e) => onUpdate({ ...node.data, retryDelay: parseInt(e.target.value) })}
              placeholder="5"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const FilterConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({ node, onUpdate }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Filter Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Filter Field</Label>
            <Select
              value={node.data.filterField || ''}
              onValueChange={(value) => onUpdate({ ...node.data, filterField: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="messageType">Message Type</SelectItem>
                <SelectItem value="userType">User Type</SelectItem>
                <SelectItem value="cost">Cost</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const SwitchConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({ node, onUpdate }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Switch Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Switch Variable</Label>
            <Input
              value={node.data.switchVariable || ''}
              onChange={(e) => onUpdate({ ...node.data, switchVariable: e.target.value })}
              placeholder="Enter variable name"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const RateLimitConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({ node, onUpdate }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Rate Limit Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Max Requests</Label>
            <Input
              type="number"
              value={node.data.maxRequests || ''}
              onChange={(e) => onUpdate({ ...node.data, maxRequests: parseInt(e.target.value) })}
              placeholder="100"
            />
          </div>
          <div>
            <Label>Time Window (seconds)</Label>
            <Input
              type="number"
              value={node.data.timeWindow || ''}
              onChange={(e) => onUpdate({ ...node.data, timeWindow: parseInt(e.target.value) })}
              placeholder="60"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const DelayConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({ node, onUpdate }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Delay Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Delay (seconds)</Label>
            <Input
              type="number"
              value={node.data.delay || ''}
              onChange={(e) => onUpdate({ ...node.data, delay: parseInt(e.target.value) })}
              placeholder="5"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ThrottleConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({ node, onUpdate }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Throttle Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Throttle Rate (req/sec)</Label>
            <Input
              type="number"
              value={node.data.throttleRate || ''}
              onChange={(e) => onUpdate({ ...node.data, throttleRate: parseInt(e.target.value) })}
              placeholder="10"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ControlsLogicConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({ node, onUpdate }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{node.type.charAt(0).toUpperCase() + node.type.slice(1)} Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Basic Configuration */}
          <div>
            <Label>Description</Label>
            <Textarea
              value={node.data.description || ''}
              onChange={(e) => onUpdate({ ...node.data, description: e.target.value })}
              placeholder="Enter description..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Constraints Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Constraints</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* TPS Limit */}
          <div>
            <Label>Max TPS (Transactions Per Second)</Label>
            <Input
              type="number"
              placeholder="100"
              value={node.data.maxTPS || ''}
              onChange={(e) => onUpdate({ ...node.data, maxTPS: Number(e.target.value) || undefined })}
            />
          </div>

          {/* Cost Cap */}
          <div>
            <Label>Max Cost (₹)</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="10.00"
              value={node.data.maxCost || ''}
              onChange={(e) => onUpdate({ ...node.data, maxCost: Number(e.target.value) || undefined })}
            />
          </div>

          {/* Time Window */}
          <div>
            <Label>Time Window</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="timeWindowStart">Start Time</Label>
                <Input
                  id="timeWindowStart"
                  type="time"
                  value={node.data.timeWindow?.start || ''}
                  onChange={(e) => onUpdate({ 
                    ...node.data, 
                    timeWindow: { ...node.data.timeWindow, start: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="timeWindowEnd">End Time</Label>
                <Input
                  id="timeWindowEnd"
                  type="time"
                  value={node.data.timeWindow?.end || ''}
                  onChange={(e) => onUpdate({ 
                    ...node.data, 
                    timeWindow: { ...node.data.timeWindow, end: e.target.value }
                  })}
                />
              </div>
            </div>
          </div>

          {/* Geo Fence */}
          <div>
            <Label>Geographic Restrictions</Label>
            <Select
              value={node.data.geoFence || ''}
              onValueChange={(value) => onUpdate({ ...node.data, geoFence: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select geographic restriction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Restrictions</SelectItem>
                <SelectItem value="domestic">Domestic Only</SelectItem>
                <SelectItem value="international">International Only</SelectItem>
                <SelectItem value="specific">Specific Countries</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {node.data.geoFence === 'specific' && (
            <div>
              <Label>Allowed Countries</Label>
              <Input
                placeholder="IN, US, UK (comma separated)"
                value={node.data.allowedCountries || ''}
                onChange={(e) => onUpdate({ ...node.data, allowedCountries: e.target.value })}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const IntegrationMonitoringConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({ node, onUpdate }) => {
  const getNodeSpecificConfig = () => {
    switch (node.type) {
      case 'webhook':
        return (
          <>
            <div>
              <Label>URL</Label>
              <Input
                value={node.data.url || ''}
                onChange={(e) => onUpdate({ ...node.data, url: e.target.value })}
                placeholder="https://api.example.com/webhook"
              />
            </div>
            <div>
              <Label>Method</Label>
              <Select
                value={node.data.method || 'POST'}
                onValueChange={(value) => onUpdate({ ...node.data, method: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      case 'database':
        return (
          <>
            <div>
              <Label>Connection String</Label>
              <Input
                value={node.data.connectionString || ''}
                onChange={(e) => onUpdate({ ...node.data, connectionString: e.target.value })}
                placeholder="mongodb://localhost:27017/mydb"
              />
            </div>
            <div>
              <Label>Operation</Label>
              <Select
                value={node.data.operation || 'select'}
                onValueChange={(value) => onUpdate({ ...node.data, operation: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="select">SELECT</SelectItem>
                  <SelectItem value="insert">INSERT</SelectItem>
                  <SelectItem value="update">UPDATE</SelectItem>
                  <SelectItem value="delete">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Table/Collection</Label>
              <Input
                value={node.data.table || ''}
                onChange={(e) => onUpdate({ ...node.data, table: e.target.value })}
                placeholder="users"
              />
            </div>
          </>
        );
      case 'transform':
        return (
          <>
            <div>
              <Label>Transform Type</Label>
              <Select
                value={node.data.transformType || 'format'}
                onValueChange={(value) => onUpdate({ ...node.data, transformType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="format">Format</SelectItem>
                  <SelectItem value="validate">Validate</SelectItem>
                  <SelectItem value="enrich">Enrich</SelectItem>
                  <SelectItem value="filter">Filter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Script</Label>
              <Textarea
                value={node.data.script || ''}
                onChange={(e) => onUpdate({ ...node.data, script: e.target.value })}
                placeholder="Enter transformation script..."
              />
            </div>
          </>
        );
      case 'api':
        return (
          <>
            <div>
              <Label>Endpoint</Label>
              <Input
                value={node.data.endpoint || ''}
                onChange={(e) => onUpdate({ ...node.data, endpoint: e.target.value })}
                placeholder="https://api.example.com/v1/users"
              />
            </div>
            <div>
              <Label>Method</Label>
              <Select
                value={node.data.method || 'GET'}
                onValueChange={(value) => onUpdate({ ...node.data, method: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Authentication</Label>
              <Select
                value={node.data.authentication || 'none'}
                onValueChange={(value) => onUpdate({ ...node.data, authentication: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="basic">Basic Auth</SelectItem>
                  <SelectItem value="bearer">Bearer Token</SelectItem>
                  <SelectItem value="apikey">API Key</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      case 'analytics':
        return (
          <>
            <div>
              <Label>Dashboard</Label>
              <Input
                value={node.data.dashboard || ''}
                onChange={(e) => onUpdate({ ...node.data, dashboard: e.target.value })}
                placeholder="Main Analytics Dashboard"
              />
            </div>
            <div>
              <Label>Reporting Interval</Label>
              <Select
                value={node.data.reportingInterval || 'hourly'}
                onValueChange={(value) => onUpdate({ ...node.data, reportingInterval: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Real-time</SelectItem>
                  <SelectItem value="minutely">Every Minute</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      case 'alert':
        return (
          <>
            <div>
              <Label>Alert Type</Label>
              <Select
                value={node.data.alertType || 'threshold'}
                onValueChange={(value) => onUpdate({ ...node.data, alertType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="threshold">Threshold</SelectItem>
                  <SelectItem value="anomaly">Anomaly</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Severity</Label>
              <Select
                value={node.data.severity || 'medium'}
                onValueChange={(value) => onUpdate({ ...node.data, severity: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Condition</Label>
              <Input
                value={node.data.condition || ''}
                onChange={(e) => onUpdate({ ...node.data, condition: e.target.value })}
                placeholder="error_rate > 5%"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{node.type.charAt(0).toUpperCase() + node.type.slice(1)} Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {getNodeSpecificConfig()}
        </CardContent>
      </Card>
    </div>
  );
};
