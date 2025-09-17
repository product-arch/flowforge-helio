import React, { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, 
  X, 
  ChevronDown,
  ChevronUp, 
  ChevronRight,
  Save,
  RotateCcw,
  Settings,
  Zap,
  Shield,
  Clock,
  DollarSign,
  Globe,
  AlertTriangle,
  GitBranch,
  Shuffle,
  Merge,
  Split,
  Filter
} from 'lucide-react';
import { useFlow } from '@/contexts/FlowContext';
import { useToast } from '@/hooks/use-toast';
import { VendorRoutingConfiguration } from './VendorRoutingConfiguration';

interface ConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodeId: string;
}

// Comprehensive vendor lists for each channel
const VENDORS = {
  sms: [
    { id: 'twilio', name: 'Twilio', logo: '🔴', region: 'Global', tier: 'Premium' },
    { id: 'messagebird', name: 'MessageBird', logo: '🔵', region: 'Global', tier: 'Premium' },
    { id: 'msg91', name: 'MSG91', logo: '🟢', region: 'India', tier: 'Standard' },
    { id: 'textlocal', name: 'Textlocal', logo: '🟡', region: 'India', tier: 'Standard' },
    { id: 'gupshup', name: 'Gupshup', logo: '🟠', region: 'India', tier: 'Premium' },
    { id: 'kaleyra', name: 'Kaleyra', logo: '🟣', region: 'Global', tier: 'Premium' },
    { id: 'infobip', name: 'Infobip', logo: '🔷', region: 'Global', tier: 'Premium' },
    { id: 'sinch', name: 'Sinch', logo: '🟦', region: 'Global', tier: 'Premium' },
    { id: 'netcore', name: 'Netcore Cloud', logo: '⚫', region: 'India', tier: 'Standard' },
    { id: 'valueFirst', name: 'ValueFirst', logo: '🟤', region: 'India', tier: 'Standard' },
    { id: 'route_mobile', name: 'Route Mobile', logo: '🔶', region: 'India', tier: 'Premium' },
    { id: 'clickatell', name: 'Clickatell', logo: '🟨', region: 'Global', tier: 'Standard' },
    { id: 'plivo', name: 'Plivo', logo: '🟪', region: 'Global', tier: 'Premium' },
    { id: 'nexmo', name: 'Vonage (Nexmo)', logo: '⚪', region: 'Global', tier: 'Premium' },
    { id: 'aws_sns', name: 'AWS SNS', logo: '🟧', region: 'Global', tier: 'Premium' }
  ],
  whatsapp: [
    { id: 'meta', name: 'Meta (WhatsApp)', logo: '🟢', region: 'Global', tier: 'Official' },
    { id: 'twilio', name: 'Twilio WhatsApp', logo: '🔴', region: 'Global', tier: 'Premium' },
    { id: 'messagebird', name: 'MessageBird WhatsApp', logo: '🔵', region: 'Global', tier: 'Premium' },
    { id: 'gupshup', name: 'Gupshup WhatsApp', logo: '🟠', region: 'India', tier: 'Premium' },
    { id: 'kaleyra', name: 'Kaleyra WhatsApp', logo: '🟣', region: 'Global', tier: 'Premium' },
    { id: 'infobip', name: 'Infobip WhatsApp', logo: '🔷', region: 'Global', tier: 'Premium' },
    { id: 'sinch', name: 'Sinch WhatsApp', logo: '🟦', region: 'Global', tier: 'Premium' },
    { id: 'netcore', name: 'Netcore WhatsApp', logo: '⚫', region: 'India', tier: 'Standard' },
    { id: 'interakt', name: 'Interakt', logo: '🟨', region: 'India', tier: 'Standard' },
    { id: 'wati', name: 'WATI', logo: '🟥', region: 'Global', tier: 'Standard' }
  ],
  email: [
    { id: 'sendgrid', name: 'SendGrid', logo: '🔵', region: 'Global', tier: 'Premium' },
    { id: 'mailgun', name: 'Mailgun', logo: '🔴', region: 'Global', tier: 'Premium' },
    { id: 'ses', name: 'Amazon SES', logo: '🟧', region: 'Global', tier: 'Premium' },
    { id: 'postmark', name: 'Postmark', logo: '🟡', region: 'Global', tier: 'Premium' },
    { id: 'sparkpost', name: 'SparkPost', logo: '🟠', region: 'Global', tier: 'Premium' },
    { id: 'mandrill', name: 'Mandrill', logo: '🟤', region: 'Global', tier: 'Premium' },
    { id: 'mailjet', name: 'Mailjet', logo: '🟢', region: 'Global', tier: 'Standard' },
    { id: 'pepipost', name: 'Pepipost', logo: '🟣', region: 'India', tier: 'Standard' },
    { id: 'netcore_email', name: 'Netcore Email', logo: '⚫', region: 'India', tier: 'Standard' }
  ],
  voice: [
    { id: 'twilio_voice', name: 'Twilio Voice', logo: '🔴', region: 'Global', tier: 'Premium' },
    { id: 'plivo_voice', name: 'Plivo Voice', logo: '🟪', region: 'Global', tier: 'Premium' },
    { id: 'exotel', name: 'Exotel', logo: '🟢', region: 'India', tier: 'Premium' },
    { id: 'knowlarity', name: 'Knowlarity', logo: '🟡', region: 'India', tier: 'Standard' },
    { id: 'ozonetel', name: 'Ozonetel', logo: '🔵', region: 'India', tier: 'Premium' },
    { id: 'sinch_voice', name: 'Sinch Voice', logo: '🟦', region: 'Global', tier: 'Premium' },
    { id: 'vonage_voice', name: 'Vonage Voice', logo: '⚪', region: 'Global', tier: 'Premium' }
  ],
  rcs: [
    { id: 'google_rcs', name: 'Google RCS', logo: '🟢', region: 'Global', tier: 'Official' },
    { id: 'infobip_rcs', name: 'Infobip RCS', logo: '🔷', region: 'Global', tier: 'Premium' },
    { id: 'sinch_rcs', name: 'Sinch RCS', logo: '🟦', region: 'Global', tier: 'Premium' },
    { id: 'mavenir_rcs', name: 'Mavenir RCS', logo: '🟣', region: 'Global', tier: 'Premium' },
    { id: 'twilio_rcs', name: 'Twilio RCS', logo: '🔴', region: 'Global', tier: 'Premium' },
    { id: 'messagebird_rcs', name: 'MessageBird RCS', logo: '🔵', region: 'Global', tier: 'Premium' },
    { id: 'kaleyra_rcs', name: 'Kaleyra RCS', logo: '🟣', region: 'Global', tier: 'Premium' },
    { id: 'gupshup_rcs', name: 'Gupshup RCS', logo: '🟠', region: 'India', tier: 'Premium' },
    { id: 'vodafone_rcs', name: 'Vodafone RCS', logo: '🔴', region: 'Europe', tier: 'Premium' },
    { id: 'orange_rcs', name: 'Orange RCS', logo: '🟧', region: 'Europe', tier: 'Standard' },
    { id: 'telstra_rcs', name: 'Telstra RCS', logo: '🟦', region: 'Australia', tier: 'Standard' },
    { id: 'jio_rcs', name: 'Jio RCS', logo: '🔵', region: 'India', tier: 'Standard' },
    { id: 'airtel_rcs', name: 'Airtel RCS', logo: '🔴', region: 'India', tier: 'Standard' }
  ]
};

export default function ConfigurationModal({ isOpen, onClose, nodeId }: ConfigurationModalProps) {
  const { nodes, updateNodeData } = useFlow();
  const { toast } = useToast();
  
  const node = nodes.find(n => n.id === nodeId);
  
  const [formData, setFormData] = useState<any>({});
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [slaExpanded, setSlaExpanded] = useState(false);

  useEffect(() => {
    if (node) {
      setFormData({ ...node.data });
      setSelectedVendors((node.data?.selectedVendors as string[]) || []);
    }
  }, [node]);

  if (!node) return null;

  const handleSave = () => {
    const updatedData = {
      ...formData,
      selectedVendors,
    };

    updateNodeData(nodeId, updatedData);
    
    toast({
      title: "Configuration saved",
      description: "Node configuration has been updated successfully.",
    });
    
    onClose();
  };

  const handleReset = () => {
    if (node) {
      setFormData({ ...node.data });
      setSelectedVendors((node.data?.selectedVendors as string[]) || []);
    }
  };

  const getVendorsByChannel = (channelType: string) => {
    switch (channelType) {
      case 'sms': return VENDORS.sms;
      case 'whatsapp': return VENDORS.whatsapp;
      case 'email': return VENDORS.email;
      case 'voice': return VENDORS.voice;
      case 'rcs': return VENDORS.rcs;
      default: return [];
    }
  };

  // Routing Strategy Configuration Renderers
  const renderWeightedDistributionConfig = () => {
    const { getConnectedChannelNode } = useFlow();
    const channelNode = getConnectedChannelNode(nodeId);
    const availableVendors = (channelNode?.data?.selectedVendors as string[]) || [];

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Traffic Distribution Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <Label className="text-base font-medium">Vendor Weight Distribution</Label>
              {availableVendors.map((vendorId: string) => {
                const vendor = VENDORS.sms.find(v => v.id === vendorId);
                const currentWeight = formData.vendorWeights?.[vendorId] || 0;
                
                return (
                  <div key={vendorId} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">{vendor?.name || vendorId}</Label>
                      <span className="text-sm font-medium">{currentWeight}%</span>
                    </div>
                    <Slider
                      value={[currentWeight]}
                      onValueChange={([value]) => {
                        setFormData(prev => ({
                          ...prev,
                          vendorWeights: {
                            ...prev.vendorWeights,
                            [vendorId]: value
                          }
                        }));
                      }}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                );
              })}
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <Label>Auto-normalize weights</Label>
                <Switch
                  checked={formData.autoNormalize !== false}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, autoNormalize: checked }))}
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <Label className="text-base font-medium">Advanced Settings</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minAllocation">Minimum Allocation per Vendor (%)</Label>
                  <Input
                    id="minAllocation"
                    type="number"
                    value={formData.minAllocation || 5}
                    onChange={(e) => setFormData(prev => ({ ...prev, minAllocation: parseInt(e.target.value) }))}
                    min="0"
                    max="50"
                  />
                </div>
                <div>
                  <Label htmlFor="expectedThroughput">Expected Throughput (msgs/min)</Label>
                  <Input
                    id="expectedThroughput"
                    type="number"
                    value={formData.expectedThroughput || 1000}
                    onChange={(e) => setFormData(prev => ({ ...prev, expectedThroughput: parseInt(e.target.value) }))}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.enableOverflow || false}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enableOverflow: checked }))}
                />
                <Label>Overflow to Available Vendors</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderPriorityRouteConfig = () => {
    const { getConnectedChannelNode } = useFlow();
    const channelNode = getConnectedChannelNode(nodeId);
    const availableVendors = (channelNode?.data?.selectedVendors as string[]) || [];

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Priority Hierarchy Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label className="text-base font-medium">Vendor Priority Order</Label>
              {availableVendors.map((vendorId: string, index: number) => {
                const vendor = VENDORS.sms.find(v => v.id === vendorId);
                
                return (
                  <div key={vendorId} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">#{index + 1}</span>
                      <span>{vendor?.name || vendorId}</span>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <Label className="text-sm">Priority Level:</Label>
                      <Select
                        value={formData.vendorPriorities?.[vendorId]?.toString() || '1'}
                        onValueChange={(value) => setFormData(prev => ({
                          ...prev,
                          vendorPriorities: {
                            ...prev.vendorPriorities,
                            [vendorId]: parseInt(value)
                          }
                        }))}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1,2,3,4,5,6,7,8,9,10].map(level => (
                            <SelectItem key={level} value={level.toString()}>{level}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="space-y-3">
              <Label className="text-base font-medium">Conditional Priority Settings</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.timeBasedPriority || false}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, timeBasedPriority: checked }))}
                  />
                  <Label>Time-based Priority Switching</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.volumeBasedPriority || false}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, volumeBasedPriority: checked }))}
                  />
                  <Label>Volume-based Priority</Label>
                </div>
              </div>
              
              <div>
                <Label htmlFor="capacityThreshold">Capacity Threshold (%)</Label>
                <Input
                  id="capacityThreshold"
                  type="number"
                  value={formData.capacityThreshold || 80}
                  onChange={(e) => setFormData(prev => ({ ...prev, capacityThreshold: parseInt(e.target.value) }))}
                  min="0"
                  max="100"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.autoFailover !== false}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, autoFailover: checked }))}
                />
                <Label>Auto-demote Unhealthy Vendors</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderRoundRobinConfig = () => {
    const { getConnectedChannelNode } = useFlow();
    const channelNode = getConnectedChannelNode(nodeId);
    const availableVendors = (channelNode?.data?.selectedVendors as string[]) || [];

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Round Robin Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label className="text-base font-medium">Distribution Type</Label>
              <Select
                value={formData.distributionType || 'simple'}
                onValueChange={(value) => setFormData(prev => ({ ...prev, distributionType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Simple Round Robin</SelectItem>
                  <SelectItem value="weighted">Weighted Round Robin</SelectItem>
                  <SelectItem value="sticky">Sticky Round Robin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {formData.distributionType === 'weighted' && (
              <div className="space-y-3">
                <Label className="text-base font-medium">Vendor Weights</Label>
                {availableVendors.map((vendorId: string) => {
                  const vendor = VENDORS.sms.find(v => v.id === vendorId);
                  
                  return (
                    <div key={vendorId} className="flex items-center gap-3">
                      <Label className="w-32">{vendor?.name || vendorId}</Label>
                      <Input
                        type="number"
                        value={formData.roundRobinWeights?.[vendorId] || 1}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          roundRobinWeights: {
                            ...prev.roundRobinWeights,
                            [vendorId]: parseInt(e.target.value) || 1
                          }
                        }))}
                        min="1"
                        className="w-20"
                      />
                    </div>
                  );
                })}
              </div>
            )}
            
            <div className="space-y-3">
              <Label className="text-base font-medium">Session Affinity & Rotation</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rotationInterval">Rotation Interval (seconds)</Label>
                  <Input
                    id="rotationInterval"
                    type="number"
                    value={formData.rotationInterval || 60}
                    onChange={(e) => setFormData(prev => ({ ...prev, rotationInterval: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="stickyDuration">Sticky Duration (minutes)</Label>
                  <Input
                    id="stickyDuration"
                    type="number"
                    value={formData.stickyDuration || 30}
                    onChange={(e) => setFormData(prev => ({ ...prev, stickyDuration: parseInt(e.target.value) }))}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.skipFailedVendors !== false}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, skipFailedVendors: checked }))}
                />
                <Label>Skip Failed Vendors in Rotation</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.enableStickySession || false}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enableStickySession: checked }))}
                />
                <Label>Sticky Sessions (Phone Number Based)</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderLeastCostConfig = () => {
    const { getConnectedChannelNode } = useFlow();
    const channelNode = getConnectedChannelNode(nodeId);
    const availableVendors = (channelNode?.data?.selectedVendors as string[]) || [];

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Cost Matrix Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label className="text-base font-medium">Vendor Pricing (per message)</Label>
              {availableVendors.map((vendorId: string) => {
                const vendor = VENDORS.sms.find(v => v.id === vendorId);
                
                return (
                  <div key={vendorId} className="grid grid-cols-4 gap-3 items-center">
                    <Label>{vendor?.name || vendorId}</Label>
                    <div>
                      <Label className="text-xs text-muted-foreground">Domestic</Label>
                      <Input
                        type="number"
                        step="0.001"
                        value={formData.vendorCosts?.[vendorId]?.domestic || 0.02}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          vendorCosts: {
                            ...prev.vendorCosts,
                            [vendorId]: {
                              ...prev.vendorCosts?.[vendorId],
                              domestic: parseFloat(e.target.value) || 0
                            }
                          }
                        }))}
                        placeholder="0.02"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">International</Label>
                      <Input
                        type="number"
                        step="0.001"
                        value={formData.vendorCosts?.[vendorId]?.international || 0.05}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          vendorCosts: {
                            ...prev.vendorCosts,
                            [vendorId]: {
                              ...prev.vendorCosts?.[vendorId],
                              international: parseFloat(e.target.value) || 0
                            }
                          }
                        }))}
                        placeholder="0.05"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Premium</Label>
                      <Input
                        type="number"
                        step="0.001"
                        value={formData.vendorCosts?.[vendorId]?.premium || 0.08}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          vendorCosts: {
                            ...prev.vendorCosts,
                            [vendorId]: {
                              ...prev.vendorCosts?.[vendorId],
                              premium: parseFloat(e.target.value) || 0
                            }
                          }
                        }))}
                        placeholder="0.08"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="space-y-3">
              <Label className="text-base font-medium">Cost Thresholds & Quality</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxCostPerMessage">Max Cost per Message</Label>
                  <Input
                    id="maxCostPerMessage"
                    type="number"
                    step="0.001"
                    value={formData.maxCostPerMessage || 0.10}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxCostPerMessage: parseFloat(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="minQualityScore">Min Quality Score (%)</Label>
                  <Input
                    id="minQualityScore"
                    type="number"
                    value={formData.minQualityScore || 95}
                    onChange={(e) => setFormData(prev => ({ ...prev, minQualityScore: parseInt(e.target.value) }))}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.enableDynamicPricing || false}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enableDynamicPricing: checked }))}
                />
                <Label>Dynamic Pricing Updates</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.enableTimeOfDayPricing || false}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enableTimeOfDayPricing: checked }))}
                />
                <Label>Time-of-Day Pricing</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.realTimePricingUpdates || false}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, realTimePricingUpdates: checked }))}
                />
                <Label>Real-time Pricing Updates</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderLoadBalancerConfig = () => {
    const { getConnectedChannelNode } = useFlow();
    const channelNode = getConnectedChannelNode(nodeId);
    const availableVendors = (channelNode?.data?.selectedVendors as string[]) || [];

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Load Balancer Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label className="text-base font-medium">Load Balancing Algorithm</Label>
              <Select
                value={formData.loadBalancingAlgorithm || 'round_robin'}
                onValueChange={(value) => setFormData(prev => ({ ...prev, loadBalancingAlgorithm: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="round_robin">Round Robin</SelectItem>
                  <SelectItem value="least_connections">Least Connections</SelectItem>
                  <SelectItem value="weighted">Weighted</SelectItem>
                  <SelectItem value="ip_hash">IP Hash</SelectItem>
                  <SelectItem value="consistent_hash">Consistent Hash</SelectItem>
                  <SelectItem value="least_response_time">Least Response Time</SelectItem>
                  <SelectItem value="power_of_two">Power of Two Choices</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <Label className="text-base font-medium">Health Monitoring</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="healthCheckInterval">Health Check Interval (seconds)</Label>
                  <Input
                    id="healthCheckInterval"
                    type="number"
                    value={formData.healthCheckInterval || 30}
                    onChange={(e) => setFormData(prev => ({ ...prev, healthCheckInterval: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="healthCheckTimeout">Health Check Timeout (seconds)</Label>
                  <Input
                    id="healthCheckTimeout"
                    type="number"
                    value={formData.healthCheckTimeout || 5}
                    onChange={(e) => setFormData(prev => ({ ...prev, healthCheckTimeout: parseInt(e.target.value) }))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="healthCheckPath">Health Check Endpoint</Label>
                <Input
                  id="healthCheckPath"
                  value={formData.healthCheckPath || '/health'}
                  onChange={(e) => setFormData(prev => ({ ...prev, healthCheckPath: e.target.value }))}
                  placeholder="/health"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <Label className="text-base font-medium">Circuit Breaker Settings</Label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="failureThreshold">Failure Threshold</Label>
                  <Input
                    id="failureThreshold"
                    type="number"
                    value={formData.failureThreshold || 5}
                    onChange={(e) => setFormData(prev => ({ ...prev, failureThreshold: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="recoveryTimeout">Recovery Timeout (seconds)</Label>
                  <Input
                    id="recoveryTimeout"
                    type="number"
                    value={formData.recoveryTimeout || 60}
                    onChange={(e) => setFormData(prev => ({ ...prev, recoveryTimeout: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="maxResponseTime">Max Response Time (ms)</Label>
                  <Input
                    id="maxResponseTime"
                    type="number"
                    value={formData.maxResponseTime || 1000}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxResponseTime: parseInt(e.target.value) }))}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.enableAutoScaling || false}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enableAutoScaling: checked }))}
                />
                <Label>Auto-scaling Based on Load</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderGeolocationRoutingConfig = () => {
    const { getConnectedChannelNode } = useFlow();
    const channelNode = getConnectedChannelNode(nodeId);
    const availableVendors = (channelNode?.data?.selectedVendors as string[]) || [];

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Geographic Routing Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Geographic Routing Rules</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newRule = {
                      id: `rule-${Date.now()}`,
                      region: '',
                      vendors: [],
                      priority: 1
                    };
                    setFormData(prev => ({
                      ...prev,
                      geographicRules: [...(prev.geographicRules || []), newRule]
                    }));
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Geographic Rule
                </Button>
              </div>

              {((formData.geographicRules as any[]) || []).map((rule: any, index: number) => (
                <div key={rule.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="font-medium">Rule {index + 1}</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          geographicRules: prev.geographicRules?.filter((r: any) => r.id !== rule.id) || []
                        }));
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Region/Country</Label>
                      <Input
                        value={rule.region || ''}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            geographicRules: prev.geographicRules?.map((r: any) =>
                              r.id === rule.id ? { ...r, region: e.target.value } : r
                            ) || []
                          }));
                        }}
                        placeholder="e.g., IN, US, EU"
                      />
                    </div>
                    <div>
                      <Label>Priority</Label>
                      <Input
                        type="number"
                        value={rule.priority || 1}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            geographicRules: prev.geographicRules?.map((r: any) =>
                              r.id === rule.id ? { ...r, priority: parseInt(e.target.value) } : r
                            ) || []
                          }));
                        }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Assigned Vendors</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {availableVendors.map((vendorId: string) => {
                        const vendor = VENDORS.sms.find(v => v.id === vendorId);
                        const isSelected = rule.vendors?.includes(vendorId) || false;
                        
                        return (
                          <div key={vendorId} className="flex items-center space-x-2">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => {
                                setFormData(prev => ({
                                  ...prev,
                                  geographicRules: prev.geographicRules?.map((r: any) =>
                                    r.id === rule.id
                                      ? {
                                          ...r,
                                          vendors: checked
                                            ? [...(r.vendors || []), vendorId]
                                            : (r.vendors || []).filter((v: string) => v !== vendorId)
                                        }
                                      : r
                                  ) || []
                                }));
                              }}
                            />
                            <Label className="text-sm">{vendor?.name || vendorId}</Label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Advanced Settings */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.enableDataResidency || false}
                  onCheckedChange={(checked) => setFormData({ ...formData, enableDataResidency: checked })}
                />
                <Label>Enforce Data Residency Requirements</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.enableLatencyOptimization || true}
                  onCheckedChange={(checked) => setFormData({ ...formData, enableLatencyOptimization: checked })}
                />
                <Label>Latency-based Optimization</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderSLAMonitoringConfig = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              SLA & Monitoring Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="successRateThreshold">Success Rate Threshold (%)</Label>
                <Input
                  id="successRateThreshold"
                  type="number"
                  value={formData.successRateThreshold || 99}
                  onChange={(e) => setFormData({ ...formData, successRateThreshold: parseInt(e.target.value) })}
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <Label htmlFor="responseTimeThreshold">Response Time Threshold (ms)</Label>
                <Input
                  id="responseTimeThreshold"
                  type="number"
                  value={formData.responseTimeThreshold || 5000}
                  onChange={(e) => setFormData({ ...formData, responseTimeThreshold: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="errorRateThreshold">Max Error Rate (%)</Label>
                <Input
                  id="errorRateThreshold"
                  type="number"
                  value={formData.errorRateThreshold || 1}
                  onChange={(e) => setFormData({ ...formData, errorRateThreshold: parseInt(e.target.value) })}
                  min="0"
                  max="100"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="alertWebhookUrl">Alert Webhook URL</Label>
                <Input
                  id="alertWebhookUrl"
                  value={formData.alertWebhookUrl || ''}
                  onChange={(e) => setFormData({ ...formData, alertWebhookUrl: e.target.value })}
                  placeholder="https://your-webhook-url.com/alerts"
                />
              </div>
              <div>
                <Label htmlFor="monitoringInterval">Monitoring Interval (seconds)</Label>
                <Input
                  id="monitoringInterval"
                  type="number"
                  value={formData.monitoringInterval || 60}
                  onChange={(e) => setFormData({ ...formData, monitoringInterval: parseInt(e.target.value) })}
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <Label className="text-base font-medium">Monitoring Features</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.enableRealTimeAlerts !== false}
                    onCheckedChange={(checked) => setFormData({ ...formData, enableRealTimeAlerts: checked })}
                  />
                  <Label>Real-time Alerts</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.enablePerformanceTracking !== false}
                    onCheckedChange={(checked) => setFormData({ ...formData, enablePerformanceTracking: checked })}
                  />
                  <Label>Performance Tracking</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.enableAutoFailover !== false}
                    onCheckedChange={(checked) => setFormData({ ...formData, enableAutoFailover: checked })}
                  />
                  <Label>Auto Failover</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.enableDetailedLogging || false}
                    onCheckedChange={(checked) => setFormData({ ...formData, enableDetailedLogging: checked })}
                  />
                  <Label>Detailed Logging</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderVendorSelection = () => {
    const channelVendors = getVendorsByChannel(node.type);
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Vendor Selection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {channelVendors.map(vendor => (
                <div 
                  key={vendor.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedVendors.includes(vendor.id) 
                      ? 'border-primary bg-primary/5 shadow-sm' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => {
                    setSelectedVendors(prev => 
                      prev.includes(vendor.id)
                        ? prev.filter(id => id !== vendor.id)
                        : [...prev, vendor.id]
                    );
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{vendor.logo}</span>
                      <div>
                        <div className="font-medium text-sm">{vendor.name}</div>
                        <div className="text-xs text-muted-foreground">{vendor.region}</div>
                      </div>
                    </div>
                    <Badge variant={vendor.tier === 'Premium' ? 'default' : 'secondary'} className="text-xs">
                      {vendor.tier}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderChannelConfiguration = () => {
    switch (node.type) {
      case 'vendorrouting':
        return (
          <VendorRoutingConfiguration
            node={node}
            onUpdate={(data) => setFormData(prev => ({ ...prev, ...data }))}
          />
        );

      // Routing Strategy Nodes
      case 'weighted-distribution':
        return renderWeightedDistributionConfig();
      
      case 'priority-route':
        return renderPriorityRouteConfig();
      
      case 'round-robin':
        return renderRoundRobinConfig();
      
      case 'least-cost':
        return renderLeastCostConfig();
      
      case 'load-balancer':
        return renderLoadBalancerConfig();
      
      case 'geolocation':
        return renderGeolocationRoutingConfig();

      // Control Logic Nodes
      case 'conditional':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-primary" />
                  Conditional Logic Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-base font-medium">Condition Rules</Label>
                  <div className="space-y-2">
                    {((formData.conditions as any[]) || []).map((condition: any, index: number) => (
                      <div key={index} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="font-medium">Condition {index + 1}</Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const conditions = [...(formData.conditions as any[] || [])];
                              conditions.splice(index, 1);
                              setFormData({ ...formData, conditions });
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <Label>Field</Label>
                            <Select
                              value={condition.field || ''}
                              onValueChange={(value) => {
                                const conditions = [...(formData.conditions as any[] || [])];
                                conditions[index] = { ...condition, field: value };
                                setFormData({ ...formData, conditions });
                              }}
                            >
                              <SelectTrigger className="nodrag">
                                <SelectValue placeholder="Select field" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="message.content">Message Content</SelectItem>
                                <SelectItem value="user.country">User Country</SelectItem>
                                <SelectItem value="user.segment">User Segment</SelectItem>
                                <SelectItem value="campaign.type">Campaign Type</SelectItem>
                                <SelectItem value="timestamp">Timestamp</SelectItem>
                                <SelectItem value="priority">Priority Level</SelectItem>
                                <SelectItem value="cost">Cost Threshold</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Operator</Label>
                            <Select
                              value={condition.operator || ''}
                              onValueChange={(value) => {
                                const conditions = [...(formData.conditions as any[] || [])];
                                conditions[index] = { ...condition, operator: value };
                                setFormData({ ...formData, conditions });
                              }}
                            >
                              <SelectTrigger className="nodrag">
                                <SelectValue placeholder="Select operator" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="equals">Equals</SelectItem>
                                <SelectItem value="not_equals">Not Equals</SelectItem>
                                <SelectItem value="contains">Contains</SelectItem>
                                <SelectItem value="starts_with">Starts With</SelectItem>
                                <SelectItem value="greater_than">Greater Than</SelectItem>
                                <SelectItem value="less_than">Less Than</SelectItem>
                                <SelectItem value="in_list">In List</SelectItem>
                                <SelectItem value="regex">Regex Match</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Value</Label>
                            <Input
                              value={condition.value || ''}
                              onChange={(e) => {
                                const conditions = [...(formData.conditions as any[] || [])];
                                conditions[index] = { ...condition, value: e.target.value };
                                setFormData({ ...formData, conditions });
                              }}
                              placeholder="Enter value"
                              className="nodrag"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const newCondition = { field: '', operator: '', value: '' };
                        setFormData({ 
                          ...formData, 
                          conditions: [...(formData.conditions as any[] || []), newCondition] 
                        });
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Condition
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Logic Operator</Label>
                    <Select
                      value={formData.logicOperator || 'AND'}
                      onValueChange={(value) => setFormData({ ...formData, logicOperator: value })}
                    >
                      <SelectTrigger className="nodrag">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AND">AND (All conditions must match)</SelectItem>
                        <SelectItem value="OR">OR (Any condition can match)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Evaluation Mode</Label>
                    <Select
                      value={formData.evaluationMode || 'strict'}
                      onValueChange={(value) => setFormData({ ...formData, evaluationMode: value })}
                    >
                      <SelectTrigger className="nodrag">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="strict">Strict Evaluation</SelectItem>
                        <SelectItem value="fuzzy">Fuzzy Logic</SelectItem>
                        <SelectItem value="probabilistic">Probabilistic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.enableCaching || false}
                    onCheckedChange={(checked) => setFormData({ ...formData, enableCaching: checked })}
                  />
                  <Label>Cache Evaluation Results</Label>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'switch':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shuffle className="w-5 h-5 text-primary" />
                  Switch Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-base font-medium">Switch Cases</Label>
                  <div className="space-y-2">
                    {((formData.switchCases as any[]) || []).map((switchCase: any, index: number) => (
                      <div key={index} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="font-medium">Case {index + 1}</Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const cases = [...(formData.switchCases as any[] || [])];
                              cases.splice(index, 1);
                              setFormData({ ...formData, switchCases: cases });
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>Case Value</Label>
                            <Input
                              value={switchCase.value || ''}
                              onChange={(e) => {
                                const cases = [...(formData.switchCases as any[] || [])];
                                cases[index] = { ...switchCase, value: e.target.value };
                                setFormData({ ...formData, switchCases: cases });
                              }}
                              placeholder="Case value"
                              className="nodrag"
                            />
                          </div>
                          <div>
                            <Label>Priority</Label>
                            <Input
                              type="number"
                              value={switchCase.priority || 1}
                              onChange={(e) => {
                                const cases = [...(formData.switchCases as any[] || [])];
                                cases[index] = { ...switchCase, priority: parseInt(e.target.value) };
                                setFormData({ ...formData, switchCases: cases });
                              }}
                              className="nodrag"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label>Description</Label>
                          <Textarea
                            value={switchCase.description || ''}
                            onChange={(e) => {
                              const cases = [...(formData.switchCases as any[] || [])];
                              cases[index] = { ...switchCase, description: e.target.value };
                              setFormData({ ...formData, switchCases: cases });
                            }}
                            placeholder="Case description"
                            className="nodrag"
                          />
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const newCase = { value: '', priority: 1, description: '' };
                        setFormData({ 
                          ...formData, 
                          switchCases: [...(formData.switchCases as any[] || []), newCase] 
                        });
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Case
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Switch Variable</Label>
                    <Input
                      value={formData.switchVariable || ''}
                      onChange={(e) => setFormData({ ...formData, switchVariable: e.target.value })}
                      placeholder="e.g., user.segment"
                      className="nodrag"
                    />
                  </div>
                  <div>
                    <Label>Default Action</Label>
                    <Select
                      value={formData.defaultAction || 'block'}
                      onValueChange={(value) => setFormData({ ...formData, defaultAction: value })}
                    >
                      <SelectTrigger className="nodrag">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="block">Block Execution</SelectItem>
                        <SelectItem value="continue">Continue to Default Path</SelectItem>
                        <SelectItem value="error">Throw Error</SelectItem>
                        <SelectItem value="log">Log and Continue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.enableFallthrough || false}
                    onCheckedChange={(checked) => setFormData({ ...formData, enableFallthrough: checked })}
                  />
                  <Label>Enable Case Fall-through</Label>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'pathmix':
      case 'converge': // Legacy support  
      case 'diverge': // Legacy support
        return renderPathMixConfig();

      case 'timer':
      case 'delay': // Legacy support
        return renderTimerConfig();
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Divergence Strategy</Label>
                    <Select
                      value={formData.strategy || 'clone_all'}
                      onValueChange={(value) => setFormData({ ...formData, strategy: value })}
                    >
                      <SelectTrigger className="nodrag">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clone_all">Clone to All Outputs</SelectItem>
                        <SelectItem value="round_robin">Round Robin Distribution</SelectItem>
                        <SelectItem value="weighted_split">Weighted Split</SelectItem>
                        <SelectItem value="conditional_split">Conditional Split</SelectItem>
                        <SelectItem value="load_balanced">Load Balanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Max Output Paths</Label>
                    <Input
                      type="number"
                      value={formData.maxOutputs || 3}
                      onChange={(e) => setFormData({ ...formData, maxOutputs: parseInt(e.target.value) })}
                      min="2"
                      max="20"
                      className="nodrag"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Balance Type</Label>
                    <Select
                      value={formData.balanceType || 'equal'}
                      onValueChange={(value) => setFormData({ ...formData, balanceType: value })}
                    >
                      <SelectTrigger className="nodrag">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equal">Equal Distribution</SelectItem>
                        <SelectItem value="weighted">Weighted Distribution</SelectItem>
                        <SelectItem value="capacity_based">Capacity Based</SelectItem>
                        <SelectItem value="performance_based">Performance Based</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Failure Handling</Label>
                    <Select
                      value={formData.failureHandling || 'continue_others'}
                      onValueChange={(value) => setFormData({ ...formData, failureHandling: value })}
                    >
                      <SelectTrigger className="nodrag">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="continue_others">Continue with Other Paths</SelectItem>
                        <SelectItem value="fail_all">Fail All Paths</SelectItem>
                        <SelectItem value="retry_failed">Retry Failed Paths</SelectItem>
                        <SelectItem value="redirect_failed">Redirect to Backup</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-base font-medium">Advanced Options</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.preserveOrder || false}
                      onCheckedChange={(checked) => setFormData({ ...formData, preserveOrder: checked })}
                    />
                    <Label>Preserve Message Order</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.enableBatching || false}
                      onCheckedChange={(checked) => setFormData({ ...formData, enableBatching: checked })}
                    />
                    <Label>Enable Batch Processing</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.enableParallelExecution || true}
                      onCheckedChange={(checked) => setFormData({ ...formData, enableParallelExecution: checked })}
                    />
                    <Label>Parallel Execution</Label>
                  </div>
                </div>
                
                {formData.enableBatching && (
                  <div>
                    <Label>Batch Size</Label>
                    <Input
                      type="number"
                      value={formData.batchSize || 100}
                      onChange={(e) => setFormData({ ...formData, batchSize: parseInt(e.target.value) })}
                      min="1"
                      max="10000"
                      className="nodrag"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 'timer':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Timer Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Timer Type</Label>
                    <Select
                      value={formData.timerType || 'delay'}
                      onValueChange={(value) => setFormData({ ...formData, timerType: value })}
                    >
                      <SelectTrigger className="nodrag">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="delay">Simple Delay</SelectItem>
                        <SelectItem value="scheduled">Scheduled Execution</SelectItem>
                        <SelectItem value="recurring">Recurring Timer</SelectItem>
                        <SelectItem value="countdown">Countdown Timer</SelectItem>
                        <SelectItem value="watchdog">Watchdog Timer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Duration</Label>
                    <Input
                      type="number"
                      value={formData.duration || 30}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                      min="1"
                      className="nodrag"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Time Unit</Label>
                    <Select
                      value={formData.unit || 'seconds'}
                      onValueChange={(value) => setFormData({ ...formData, unit: value })}
                    >
                      <SelectTrigger className="nodrag">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="milliseconds">Milliseconds</SelectItem>
                        <SelectItem value="seconds">Seconds</SelectItem>
                        <SelectItem value="minutes">Minutes</SelectItem>
                        <SelectItem value="hours">Hours</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Max Wait Time</Label>
                    <Input
                      type="number"
                      value={formData.maxWait || 3600}
                      onChange={(e) => setFormData({ ...formData, maxWait: parseInt(e.target.value) })}
                      min="1"
                      className="nodrag"
                    />
                  </div>
                </div>
                
                {formData.timerType === 'scheduled' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Schedule Time</Label>
                      <Input
                        type="time"
                        value={formData.scheduleTime || ''}
                        onChange={(e) => setFormData({ ...formData, scheduleTime: e.target.value })}
                        className="nodrag"
                      />
                    </div>
                    <div>
                      <Label>Time Zone</Label>
                      <Select
                        value={formData.timezone || 'UTC'}
                        onValueChange={(value) => setFormData({ ...formData, timezone: value })}
                      >
                        <SelectTrigger className="nodrag">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="America/New_York">Eastern Time</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                          <SelectItem value="Europe/London">London</SelectItem>
                          <SelectItem value="Asia/Kolkata">India Standard Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
                
                {formData.timerType === 'recurring' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Recurrence Pattern</Label>
                      <Select
                        value={formData.recurrencePattern || 'daily'}
                        onValueChange={(value) => setFormData({ ...formData, recurrencePattern: value })}
                      >
                        <SelectTrigger className="nodrag">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="custom">Custom Cron</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Max Executions</Label>
                      <Input
                        type="number"
                        value={formData.maxExecutions || 0}
                        onChange={(e) => setFormData({ ...formData, maxExecutions: parseInt(e.target.value) })}
                        min="0"
                        className="nodrag"
                        placeholder="0 = unlimited"
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-3">
                  <Label className="text-base font-medium">Advanced Timer Options</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.enableRetry || false}
                      onCheckedChange={(checked) => setFormData({ ...formData, enableRetry: checked })}
                    />
                    <Label>Enable Retry on Failure</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.enableJitter || false}
                      onCheckedChange={(checked) => setFormData({ ...formData, enableJitter: checked })}
                    />
                    <Label>Add Random Jitter</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.persistTimer || false}
                      onCheckedChange={(checked) => setFormData({ ...formData, persistTimer: checked })}
                    />
                    <Label>Persist Timer State</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'doevent':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Do Event Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Event Type</Label>
                    <Select
                      value={formData.eventType || 'webhook'}
                      onValueChange={(value) => setFormData({ ...formData, eventType: value })}
                    >
                      <SelectTrigger className="nodrag">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="webhook">Webhook Call</SelectItem>
                        <SelectItem value="database">Database Operation</SelectItem>
                        <SelectItem value="email">Send Email</SelectItem>
                        <SelectItem value="sms">Send SMS</SelectItem>
                        <SelectItem value="api_call">API Call</SelectItem>
                        <SelectItem value="file_operation">File Operation</SelectItem>
                        <SelectItem value="custom_script">Custom Script</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Event Priority</Label>
                    <Select
                      value={formData.eventPriority || 'normal'}
                      onValueChange={(value) => setFormData({ ...formData, eventPriority: value })}
                    >
                      <SelectTrigger className="nodrag">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label>Event Configuration</Label>
                  <Textarea
                    value={formData.eventConfig || ''}
                    onChange={(e) => setFormData({ ...formData, eventConfig: e.target.value })}
                    placeholder="JSON configuration for the event"
                    rows={4}
                    className="nodrag font-mono"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Timeout (seconds)</Label>
                    <Input
                      type="number"
                      value={formData.eventTimeout || 30}
                      onChange={(e) => setFormData({ ...formData, eventTimeout: parseInt(e.target.value) })}
                      min="1"
                      max="3600"
                      className="nodrag"
                    />
                  </div>
                  <div>
                    <Label>Retry Attempts</Label>
                    <Input
                      type="number"
                      value={formData.retryAttempts || 3}
                      onChange={(e) => setFormData({ ...formData, retryAttempts: parseInt(e.target.value) })}
                      min="0"
                      max="10"
                      className="nodrag"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-base font-medium">Event Options</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.enableAsync || false}
                      onCheckedChange={(checked) => setFormData({ ...formData, enableAsync: checked })}
                    />
                    <Label>Execute Asynchronously</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.enableLogging || true}
                      onCheckedChange={(checked) => setFormData({ ...formData, enableLogging: checked })}
                    />
                    <Label>Enable Event Logging</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.enableMetrics || false}
                      onCheckedChange={(checked) => setFormData({ ...formData, enableMetrics: checked })}
                    />
                    <Label>Collect Performance Metrics</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.enableCircuitBreaker || false}
                      onCheckedChange={(checked) => setFormData({ ...formData, enableCircuitBreaker: checked })}
                    />
                    <Label>Enable Circuit Breaker</Label>
                  </div>
                </div>
                
                {formData.enableCircuitBreaker && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Failure Threshold</Label>
                      <Input
                        type="number"
                        value={formData.failureThreshold || 5}
                        onChange={(e) => setFormData({ ...formData, failureThreshold: parseInt(e.target.value) })}
                        min="1"
                        className="nodrag"
                      />
                    </div>
                    <div>
                      <Label>Recovery Timeout (seconds)</Label>
                      <Input
                        type="number"
                        value={formData.recoveryTimeout || 60}
                        onChange={(e) => setFormData({ ...formData, recoveryTimeout: parseInt(e.target.value) })}
                        min="1"
                        className="nodrag"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 'filter':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="w-5 h-5 text-primary" />
                  Filter Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-base font-medium">Filter Rules</Label>
                  <div className="space-y-2">
                    {((formData.filterRules as any[]) || []).map((rule: any, index: number) => (
                      <div key={index} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="font-medium">Rule {index + 1}</Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const rules = [...(formData.filterRules as any[] || [])];
                              rules.splice(index, 1);
                              setFormData({ ...formData, filterRules: rules });
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <Label>Field</Label>
                            <Select
                              value={rule.field || ''}
                              onValueChange={(value) => {
                                const rules = [...(formData.filterRules as any[] || [])];
                                rules[index] = { ...rule, field: value };
                                setFormData({ ...formData, filterRules: rules });
                              }}
                            >
                              <SelectTrigger className="nodrag">
                                <SelectValue placeholder="Select field" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="message.content">Message Content</SelectItem>
                                <SelectItem value="user.email">User Email</SelectItem>
                                <SelectItem value="user.phone">User Phone</SelectItem>
                                <SelectItem value="user.country">User Country</SelectItem>
                                <SelectItem value="campaign.id">Campaign ID</SelectItem>
                                <SelectItem value="priority">Priority Level</SelectItem>
                                <SelectItem value="timestamp">Timestamp</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Operator</Label>
                            <Select
                              value={rule.operator || ''}
                              onValueChange={(value) => {
                                const rules = [...(formData.filterRules as any[] || [])];
                                rules[index] = { ...rule, operator: value };
                                setFormData({ ...formData, filterRules: rules });
                              }}
                            >
                              <SelectTrigger className="nodrag">
                                <SelectValue placeholder="Select operator" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="equals">Equals</SelectItem>
                                <SelectItem value="not_equals">Not Equals</SelectItem>
                                <SelectItem value="contains">Contains</SelectItem>
                                <SelectItem value="not_contains">Does Not Contain</SelectItem>
                                <SelectItem value="starts_with">Starts With</SelectItem>
                                <SelectItem value="ends_with">Ends With</SelectItem>
                                <SelectItem value="regex">Regex Match</SelectItem>
                                <SelectItem value="in_list">In List</SelectItem>
                                <SelectItem value="not_in_list">Not In List</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Value</Label>
                            <Input
                              value={rule.value || ''}
                              onChange={(e) => {
                                const rules = [...(formData.filterRules as any[] || [])];
                                rules[index] = { ...rule, value: e.target.value };
                                setFormData({ ...formData, filterRules: rules });
                              }}
                              placeholder="Enter filter value"
                              className="nodrag"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>Action on Match</Label>
                            <Select
                              value={rule.action || 'allow'}
                              onValueChange={(value) => {
                                const rules = [...(formData.filterRules as any[] || [])];
                                rules[index] = { ...rule, action: value };
                                setFormData({ ...formData, filterRules: rules });
                              }}
                            >
                              <SelectTrigger className="nodrag">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="allow">Allow Through</SelectItem>
                                <SelectItem value="block">Block</SelectItem>
                                <SelectItem value="quarantine">Quarantine</SelectItem>
                                <SelectItem value="transform">Transform</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Priority</Label>
                            <Input
                              type="number"
                              value={rule.priority || 1}
                              onChange={(e) => {
                                const rules = [...(formData.filterRules as any[] || [])];
                                rules[index] = { ...rule, priority: parseInt(e.target.value) };
                                setFormData({ ...formData, filterRules: rules });
                              }}
                              className="nodrag"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const newRule = { field: '', operator: '', value: '', action: 'allow', priority: 1 };
                        setFormData({ 
                          ...formData, 
                          filterRules: [...(formData.filterRules as any[] || []), newRule] 
                        });
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Filter Rule
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Filter Mode</Label>
                    <Select
                      value={formData.filterMode || 'whitelist'}
                      onValueChange={(value) => setFormData({ ...formData, filterMode: value })}
                    >
                      <SelectTrigger className="nodrag">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="whitelist">Whitelist (Allow Only Matches)</SelectItem>
                        <SelectItem value="blacklist">Blacklist (Block Matches)</SelectItem>
                        <SelectItem value="content_filter">Content Filter</SelectItem>
                        <SelectItem value="compliance_filter">Compliance Filter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Case Sensitivity</Label>
                    <Select
                      value={formData.caseSensitive || 'false'}
                      onValueChange={(value) => setFormData({ ...formData, caseSensitive: value })}
                    >
                      <SelectTrigger className="nodrag">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Case Sensitive</SelectItem>
                        <SelectItem value="false">Case Insensitive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-base font-medium">Advanced Filter Options</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.enableContentScanning || false}
                      onCheckedChange={(checked) => setFormData({ ...formData, enableContentScanning: checked })}
                    />
                    <Label>Enable Content Scanning</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.enableMLFiltering || false}
                      onCheckedChange={(checked) => setFormData({ ...formData, enableMLFiltering: checked })}
                    />
                    <Label>Enable ML-based Filtering</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.enableRealTimeUpdates || false}
                      onCheckedChange={(checked) => setFormData({ ...formData, enableRealTimeUpdates: checked })}
                    />
                    <Label>Real-time Rule Updates</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'delay':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Delay Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Delay Duration</Label>
                    <Input
                      type="number"
                      value={formData.duration || 5}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                      min="1"
                      className="nodrag"
                    />
                  </div>
                  <div>
                    <Label>Time Unit</Label>
                    <Select
                      value={formData.unit || 'seconds'}
                      onValueChange={(value) => setFormData({ ...formData, unit: value })}
                    >
                      <SelectTrigger className="nodrag">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="milliseconds">Milliseconds</SelectItem>
                        <SelectItem value="seconds">Seconds</SelectItem>
                        <SelectItem value="minutes">Minutes</SelectItem>
                        <SelectItem value="hours">Hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Delay Type</Label>
                    <Select
                      value={formData.delayType || 'fixed'}
                      onValueChange={(value) => setFormData({ ...formData, delayType: value })}
                    >
                      <SelectTrigger className="nodrag">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed Delay</SelectItem>
                        <SelectItem value="random">Random Delay</SelectItem>
                        <SelectItem value="exponential">Exponential Backoff</SelectItem>
                        <SelectItem value="linear">Linear Increase</SelectItem>
                        <SelectItem value="conditional">Conditional Delay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Max Delay (for random/conditional)</Label>
                    <Input
                      type="number"
                      value={formData.maxDelay || 60}
                      onChange={(e) => setFormData({ ...formData, maxDelay: parseInt(e.target.value) })}
                      min="1"
                      className="nodrag"
                    />
                  </div>
                </div>
                
                {formData.delayType === 'conditional' && (
                  <div>
                    <Label>Delay Condition</Label>
                    <Textarea
                      value={formData.delayCondition || ''}
                      onChange={(e) => setFormData({ ...formData, delayCondition: e.target.value })}
                      placeholder="Condition expression for dynamic delay"
                      className="nodrag"
                    />
                  </div>
                )}
                
                <div className="space-y-3">
                  <Label className="text-base font-medium">Delay Options</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.enableJitter || false}
                      onCheckedChange={(checked) => setFormData({ ...formData, enableJitter: checked })}
                    />
                    <Label>Add Random Jitter</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.enableCancellation || false}
                      onCheckedChange={(checked) => setFormData({ ...formData, enableCancellation: checked })}
                    />
                    <Label>Allow Delay Cancellation</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.preserveOrder || true}
                      onCheckedChange={(checked) => setFormData({ ...formData, preserveOrder: checked })}
                    />
                    <Label>Preserve Message Order</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.enableBatching || false}
                      onCheckedChange={(checked) => setFormData({ ...formData, enableBatching: checked })}
                    />
                    <Label>Batch Similar Delays</Label>
                  </div>
                </div>
                
                {formData.enableJitter && (
                  <div>
                    <Label>Jitter Percentage</Label>
                    <Slider
                      value={[formData.jitterPercentage || 10]}
                      onValueChange={(value) => setFormData({ ...formData, jitterPercentage: value[0] })}
                      max={50}
                      min={1}
                      step={1}
                      className="nodrag"
                    />
                    <div className="text-sm text-muted-foreground mt-1">
                      Current: ±{formData.jitterPercentage || 10}%
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 'fallback':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-primary" />
                  Fallback Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Fallback Strategy</Label>
                    <Select
                      value={formData.fallbackStrategy || 'sequential'}
                      onValueChange={(value) => setFormData({ ...formData, fallbackStrategy: value })}
                    >
                      <SelectTrigger className="nodrag">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sequential">Sequential Fallback</SelectItem>
                        <SelectItem value="priority_based">Priority Based</SelectItem>
                        <SelectItem value="load_based">Load Based</SelectItem>
                        <SelectItem value="cost_based">Cost Based</SelectItem>
                        <SelectItem value="geographic">Geographic Fallback</SelectItem>
                        <SelectItem value="intelligent">Intelligent Fallback</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Trigger Condition</Label>
                    <Select
                      value={formData.triggerCondition || 'failure'}
                      onValueChange={(value) => setFormData({ ...formData, triggerCondition: value })}
                    >
                      <SelectTrigger className="nodrag">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="failure">On Failure</SelectItem>
                        <SelectItem value="timeout">On Timeout</SelectItem>
                        <SelectItem value="capacity">Capacity Exceeded</SelectItem>
                        <SelectItem value="quality">Quality Degradation</SelectItem>
                        <SelectItem value="cost">Cost Threshold</SelectItem>
                        <SelectItem value="manual">Manual Trigger</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-base font-medium">Fallback Targets</Label>
                  <div className="space-y-2">
                    {((formData.fallbackTargets as any[]) || []).map((target: any, index: number) => (
                      <div key={index} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="font-medium">Target {index + 1}</Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const targets = [...(formData.fallbackTargets as any[] || [])];
                              targets.splice(index, 1);
                              setFormData({ ...formData, fallbackTargets: targets });
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <Label>Target Type</Label>
                            <Select
                              value={target.type || 'vendor'}
                              onValueChange={(value) => {
                                const targets = [...(formData.fallbackTargets as any[] || [])];
                                targets[index] = { ...target, type: value };
                                setFormData({ ...formData, fallbackTargets: targets });
                              }}
                            >
                              <SelectTrigger className="nodrag">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="vendor">Vendor</SelectItem>
                                <SelectItem value="channel">Channel</SelectItem>
                                <SelectItem value="endpoint">Endpoint</SelectItem>
                                <SelectItem value="queue">Queue</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Target ID</Label>
                            <Input
                              value={target.id || ''}
                              onChange={(e) => {
                                const targets = [...(formData.fallbackTargets as any[] || [])];
                                targets[index] = { ...target, id: e.target.value };
                                setFormData({ ...formData, fallbackTargets: targets });
                              }}
                              placeholder="Target identifier"
                              className="nodrag"
                            />
                          </div>
                          <div>
                            <Label>Priority</Label>
                            <Input
                              type="number"
                              value={target.priority || 1}
                              onChange={(e) => {
                                const targets = [...(formData.fallbackTargets as any[] || [])];
                                targets[index] = { ...target, priority: parseInt(e.target.value) };
                                setFormData({ ...formData, fallbackTargets: targets });
                              }}
                              className="nodrag"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const newTarget = { type: 'vendor', id: '', priority: 1 };
                        setFormData({ 
                          ...formData, 
                          fallbackTargets: [...(formData.fallbackTargets as any[] || []), newTarget] 
                        });
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Fallback Target
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Max Retry Attempts</Label>
                    <Input
                      type="number"
                      value={formData.maxRetries || 3}
                      onChange={(e) => setFormData({ ...formData, maxRetries: parseInt(e.target.value) })}
                      min="1"
                      max="10"
                      className="nodrag"
                    />
                  </div>
                  <div>
                    <Label>Retry Delay (seconds)</Label>
                    <Input
                      type="number"
                      value={formData.retryDelay || 5}
                      onChange={(e) => setFormData({ ...formData, retryDelay: parseInt(e.target.value) })}
                      min="1"
                      className="nodrag"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-base font-medium">Fallback Options</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.enableAutoRecovery || false}
                      onCheckedChange={(checked) => setFormData({ ...formData, enableAutoRecovery: checked })}
                    />
                    <Label>Auto-recovery to Primary</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.enableHealthCheck || true}
                      onCheckedChange={(checked) => setFormData({ ...formData, enableHealthCheck: checked })}
                    />
                    <Label>Health Check Monitoring</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.enableCircuitBreaker || false}
                      onCheckedChange={(checked) => setFormData({ ...formData, enableCircuitBreaker: checked })}
                    />
                    <Label>Circuit Breaker Protection</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.preserveMessageOrder || true}
                      onCheckedChange={(checked) => setFormData({ ...formData, preserveMessageOrder: checked })}
                    />
                    <Label>Preserve Message Order</Label>
                  </div>
                </div>
                
                {formData.enableAutoRecovery && (
                  <div>
                    <Label>Recovery Check Interval (seconds)</Label>
                    <Input
                      type="number"
                      value={formData.recoveryInterval || 60}
                      onChange={(e) => setFormData({ ...formData, recoveryInterval: parseInt(e.target.value) })}
                      min="10"
                      className="nodrag"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      // Channel nodes return null - no channel-specific configuration
      case 'sms':
      case 'whatsapp':
      case 'email':
      case 'voice':
      case 'rcs':
        return null;

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            {['sms', 'whatsapp', 'email', 'voice', 'rcs'].includes(node.type) 
              ? `Select Vendors for ${node.type.charAt(0).toUpperCase() + node.type.slice(1)} Channel`
              : `Configure ${node.type.charAt(0).toUpperCase() + node.type.slice(1)} Node`
            }
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 min-h-0">
          <div className="space-y-6 p-6">
            {/* Configuration Content */}
            {['sms', 'whatsapp', 'email', 'voice', 'rcs'].includes(node.type) ? (
              // For channel nodes, show only vendor selection
              renderVendorSelection()
            ) : (
              // For other nodes, show their specific configuration
              renderChannelConfiguration()
            )}

            {/* SLA & Monitoring for Routing Strategy Nodes */}
            {['weighted-distribution', 'priority-route', 'round-robin', 'least-cost', 'load-balancer', 'geolocation'].includes(node.type) && (
              <>
                <Separator />
                <Collapsible open={slaExpanded} onOpenChange={setSlaExpanded}>
                  <CollapsibleTrigger className="flex w-full items-center justify-between p-4 hover:bg-muted/50 rounded-lg transition-colors">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      <span className="font-medium text-lg">SLA & Monitoring Configuration</span>
                    </div>
                    {slaExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-4 pb-4">
                      {renderSLAMonitoringConfig()}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </>
            )}
          </div>
        </ScrollArea>
        
        <Separator className="flex-shrink-0" />
        
        <div className="flex justify-between items-center p-6 flex-shrink-0">
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-primary">
              <Save className="w-4 h-4 mr-2" />
              Save Configuration
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
