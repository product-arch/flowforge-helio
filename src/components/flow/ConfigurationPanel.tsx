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
import { ChevronLeft, ChevronRight, Plus, Trash2, Settings, X } from 'lucide-react';
import { useFlow } from '@/contexts/FlowContext';
import { useToast } from '@/hooks/use-toast';

export const ConfigurationPanel: React.FC = () => {
  const { selectedNode, updateNodeData } = useFlow();
  const [collapsed, setCollapsed] = useState(false);
  const { toast } = useToast();

  // Auto-collapse when no node is selected or start node is selected
  if (!selectedNode || selectedNode.type === 'start') {
    return (
      <div className="w-12 bg-card border-l border-border flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            // Only show expand option if there's a configurable node selected
            if (selectedNode && selectedNode.type !== 'start') {
              setCollapsed(false);
            }
          }}
          disabled={!selectedNode || selectedNode.type === 'start'}
          className={!selectedNode || selectedNode.type === 'start' ? 'opacity-30' : ''}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  if (collapsed) {
    return (
      <div className="w-12 bg-card/80 backdrop-blur-sm border-l border-border flex flex-col items-center py-4 transition-colors duration-300">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(false)}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  const handleUpdateData = (newData: any) => {
    updateNodeData(selectedNode.id, newData);
    toast({
      title: "Node Updated",
      description: "Configuration saved successfully.",
      className: "border-status-success bg-status-success/10 text-status-success"
    });
  };

  return (
    <div className="w-80 bg-card/80 backdrop-blur-sm border-l border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Configuration</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(true)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="secondary">{selectedNode.type}</Badge>
            <span className="text-sm text-muted-foreground truncate">
              {String(selectedNode.data.label || selectedNode.type)}
            </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedNode.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {selectedNode.type === 'routing' && (
              <RoutingConfiguration 
                node={selectedNode} 
                onUpdate={handleUpdateData} 
              />
            )}
            {selectedNode.type === 'constraint' && (
              <ConstraintConfiguration 
                node={selectedNode} 
                onUpdate={handleUpdateData} 
              />
            )}
            {selectedNode.type === 'conditional' && (
              <ConditionalConfiguration 
                node={selectedNode} 
                onUpdate={handleUpdateData} 
              />
            )}
            {selectedNode.type === 'terminal' && (
              <TerminalConfiguration 
                node={selectedNode} 
                onUpdate={handleUpdateData} 
              />
            )}
            {selectedNode.type === 'audit' && (
              <AuditConfiguration 
                node={selectedNode} 
                onUpdate={handleUpdateData} 
              />
            )}
            {selectedNode.type === 'sms' && (
              <SMSConfiguration 
                node={selectedNode} 
                onUpdate={handleUpdateData} 
              />
            )}
            {selectedNode.type === 'whatsapp' && (
              <WhatsAppConfiguration 
                node={selectedNode} 
                onUpdate={handleUpdateData} 
              />
            )}
            {selectedNode.type === 'email' && (
              <EmailConfiguration 
                node={selectedNode} 
                onUpdate={handleUpdateData} 
              />
            )}
            {selectedNode.type === 'voice' && (
              <VoiceConfiguration 
                node={selectedNode} 
                onUpdate={handleUpdateData} 
              />
            )}
            {selectedNode.type === 'rcs' && (
              <RCSConfiguration 
                node={selectedNode} 
                onUpdate={handleUpdateData} 
              />
            )}
            {selectedNode.type === 'leastcost' && (
              <LeastCostConfiguration 
                node={selectedNode} 
                onUpdate={handleUpdateData} 
              />
            )}
            {selectedNode.type === 'weightedsplit' && (
              <WeightedSplitConfiguration 
                node={selectedNode} 
                onUpdate={handleUpdateData} 
              />
            )}
            {selectedNode.type === 'fallback' && (
              <FallbackConfiguration 
                node={selectedNode} 
                onUpdate={handleUpdateData} 
              />
            )}
            {selectedNode.type === 'filter' && (
              <FilterConfiguration 
                node={selectedNode} 
                onUpdate={handleUpdateData} 
              />
            )}
            {selectedNode.type === 'switch' && (
              <SwitchConfiguration 
                node={selectedNode} 
                onUpdate={handleUpdateData} 
              />
            )}
            {selectedNode.type === 'ratelimit' && (
              <RateLimitConfiguration 
                node={selectedNode} 
                onUpdate={handleUpdateData} 
              />
            )}
            {selectedNode.type === 'delay' && (
              <DelayConfiguration 
                node={selectedNode} 
                onUpdate={handleUpdateData} 
              />
            )}
            {selectedNode.type === 'throttle' && (
              <ThrottleConfiguration 
                node={selectedNode} 
                onUpdate={handleUpdateData} 
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Configuration components for each node type
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

const ConstraintConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({
  node,
  onUpdate,
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Rate Limits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Max TPS</Label>
            <Input
              type="number"
              value={node.data.maxTPS || ''}
              onChange={(e) => onUpdate({ ...node.data, maxTPS: parseInt(e.target.value) })}
              placeholder="1000"
            />
          </div>
          <div>
            <Label>Max Cost per Message (₹)</Label>
            <Input
              type="number"
              step="0.01"
              value={node.data.maxCost || ''}
              onChange={(e) => onUpdate({ ...node.data, maxCost: parseFloat(e.target.value) })}
              placeholder="0.05"
            />
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
              placeholder="Optional reason for this state"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Channel Configuration Components
const SMSConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({
  node,
  onUpdate,
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">SMS Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Sender ID</Label>
            <Input
              value={node.data.senderId || ''}
              onChange={(e) => onUpdate({ ...node.data, senderId: e.target.value })}
              placeholder="Enter sender ID"
              className="nodrag"
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
                <SelectItem value="gsm7">GSM 7-bit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const WhatsAppConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({
  node,
  onUpdate,
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">WhatsApp Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Business ID</Label>
            <Input
              value={node.data.businessId || ''}
              onChange={(e) => onUpdate({ ...node.data, businessId: e.target.value })}
              placeholder="Enter business ID"
              className="nodrag"
            />
          </div>
          <div>
            <Label>Template Type</Label>
            <Select
              value={node.data.templateType || 'text'}
              onValueChange={(value) => onUpdate({ ...node.data, templateType: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="media">Media</SelectItem>
                <SelectItem value="interactive">Interactive</SelectItem>
                <SelectItem value="location">Location</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>WABA Number</Label>
            <Input
              value={node.data.wabaNumber || ''}
              onChange={(e) => onUpdate({ ...node.data, wabaNumber: e.target.value })}
              placeholder="Enter WABA number"
              className="nodrag"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const EmailConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({
  node,
  onUpdate,
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Email Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>From Address</Label>
            <Input
              value={node.data.fromAddress || ''}
              onChange={(e) => onUpdate({ ...node.data, fromAddress: e.target.value })}
              placeholder="sender@example.com"
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
                <SelectItem value="service">Service</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Template</Label>
            <Input
              value={node.data.template || ''}
              onChange={(e) => onUpdate({ ...node.data, template: e.target.value })}
              placeholder="Template ID or name"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const VoiceConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({
  node,
  onUpdate,
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Voice Settings</CardTitle>
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
              value={node.data.voiceType || 'text-to-speech'}
              onValueChange={(value) => onUpdate({ ...node.data, voiceType: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text-to-speech">Text-to-Speech</SelectItem>
                <SelectItem value="pre-recorded">Pre-recorded</SelectItem>
                <SelectItem value="live">Live</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Language</Label>
            <Select
              value={node.data.language || 'en'}
              onValueChange={(value) => onUpdate({ ...node.data, language: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">Hindi</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const RCSConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({
  node,
  onUpdate,
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">RCS Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Bot Name</Label>
            <Input
              value={node.data.botName || ''}
              onChange={(e) => onUpdate({ ...node.data, botName: e.target.value })}
              placeholder="Enter bot name"
            />
          </div>
          <div>
            <Label>Agent ID</Label>
            <Input
              value={node.data.agentId || ''}
              onChange={(e) => onUpdate({ ...node.data, agentId: e.target.value })}
              placeholder="Enter agent ID"
            />
          </div>
          <div>
            <Label>Message Type</Label>
            <Select
              value={node.data.messageType || 'text'}
              onValueChange={(value) => onUpdate({ ...node.data, messageType: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="rich">Rich</SelectItem>
                <SelectItem value="media">Media</SelectItem>
                <SelectItem value="interactive">Interactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Routing Configuration Components
const LeastCostConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({
  node,
  onUpdate,
}) => {
  const [vendorCosts, setVendorCosts] = useState(node.data.vendorCosts || []);

  const addVendorCost = () => {
    const newVendor = {
      id: `vendor-${Date.now()}`,
      vendorId: '',
      cost: 0,
      currency: 'INR'
    };
    const updated = [...vendorCosts, newVendor];
    setVendorCosts(updated);
    onUpdate({ ...node.data, vendorCosts: updated });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Least Cost Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Cost Threshold</Label>
            <Input
              type="number"
              step="0.01"
              value={node.data.costThreshold || ''}
              onChange={(e) => onUpdate({ ...node.data, costThreshold: parseFloat(e.target.value) })}
              placeholder="0.05"
            />
          </div>
          <div>
            <Label>Fallback Vendor</Label>
            <Select
              value={node.data.fallbackVendor || ''}
              onValueChange={(value) => onUpdate({ ...node.data, fallbackVendor: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select fallback vendor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gupshup">Gupshup</SelectItem>
                <SelectItem value="karix">Karix</SelectItem>
                <SelectItem value="kaleyra">Kaleyra</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            Vendor Costs
            <Button size="sm" onClick={addVendorCost}>
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {vendorCosts.map((vendor: any, index: number) => (
            <div key={vendor.id} className="p-3 border border-border rounded-lg space-y-2">
              <Select
                value={vendor.vendorId}
                onValueChange={(value) => {
                  const updated = vendorCosts.map((v: any, i: number) =>
                    i === index ? { ...v, vendorId: value } : v
                  );
                  setVendorCosts(updated);
                  onUpdate({ ...node.data, vendorCosts: updated });
                }}
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
              <Input
                type="number"
                step="0.01"
                value={vendor.cost}
                onChange={(e) => {
                  const updated = vendorCosts.map((v: any, i: number) =>
                    i === index ? { ...v, cost: parseFloat(e.target.value) } : v
                  );
                  setVendorCosts(updated);
                  onUpdate({ ...node.data, vendorCosts: updated });
                }}
                placeholder="Cost per message"
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

const WeightedSplitConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({
  node,
  onUpdate,
}) => {
  const [weights, setWeights] = useState(node.data.weights || []);

  const addWeight = () => {
    const newWeight = {
      id: `weight-${Date.now()}`,
      vendorId: '',
      weight: 0
    };
    const updated = [...weights, newWeight];
    setWeights(updated);
    onUpdate({ ...node.data, weights: updated });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Weighted Split Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Switch
              checked={node.data.fallbackEnabled || false}
              onCheckedChange={(checked) => onUpdate({ ...node.data, fallbackEnabled: checked })}
            />
            <Label>Enable Fallback</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            Vendor Weights
            <Button size="sm" onClick={addWeight}>
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {weights.map((weight: any, index: number) => (
            <div key={weight.id} className="p-3 border border-border rounded-lg space-y-2">
              <Select
                value={weight.vendorId}
                onValueChange={(value) => {
                  const updated = weights.map((w: any, i: number) =>
                    i === index ? { ...w, vendorId: value } : w
                  );
                  setWeights(updated);
                  onUpdate({ ...node.data, weights: updated });
                }}
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
                placeholder="Weight %"
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

const FallbackConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({
  node,
  onUpdate,
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Fallback Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Triggers</Label>
            <Select
              value={node.data.triggers?.[0] || 'timeout'}
              onValueChange={(value) => onUpdate({ ...node.data, triggers: [value] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="timeout">Timeout</SelectItem>
                <SelectItem value="5xxError">5xx Error</SelectItem>
                <SelectItem value="rejection">Rejection</SelectItem>
                <SelectItem value="capacity">Capacity Exceeded</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Fallback Vendor</Label>
            <Select
              value={node.data.fallbackVendor || ''}
              onValueChange={(value) => onUpdate({ ...node.data, fallbackVendor: value })}
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
          </div>
          <div>
            <Label>Max Retries</Label>
            <Input
              type="number"
              value={node.data.maxRetries || ''}
              onChange={(e) => onUpdate({ ...node.data, maxRetries: parseInt(e.target.value) })}
              placeholder="3"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Control Flow Configuration Components
const FilterConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({
  node,
  onUpdate,
}) => {
  const [criteria, setCriteria] = useState(node.data.criteria || []);

  const addCriteria = () => {
    const newCriteria = {
      id: `criteria-${Date.now()}`,
      field: '',
      operator: 'equals',
      value: ''
    };
    const updated = [...criteria, newCriteria];
    setCriteria(updated);
    onUpdate({ ...node.data, criteria: updated });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Filter Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Action</Label>
            <Select
              value={node.data.action || 'allow'}
              onValueChange={(value) => onUpdate({ ...node.data, action: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="allow">Allow</SelectItem>
                <SelectItem value="block">Block</SelectItem>
                <SelectItem value="queue">Queue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            Filter Criteria
            <Button size="sm" onClick={addCriteria}>
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {criteria.map((criterion: any, index: number) => (
            <div key={criterion.id} className="p-3 border border-border rounded-lg space-y-2">
              <Select
                value={criterion.field}
                onValueChange={(value) => {
                  const updated = criteria.map((c: any, i: number) =>
                    i === index ? { ...c, field: value } : c
                  );
                  setCriteria(updated);
                  onUpdate({ ...node.data, criteria: updated });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="messageType">Message Type</SelectItem>
                  <SelectItem value="userType">User Type</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
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

const SwitchConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({
  node,
  onUpdate,
}) => {
  const [cases, setCases] = useState(node.data.cases || []);

  const addCase = () => {
    const newCase = {
      id: `case-${Date.now()}`,
      condition: '',
      value: '',
      output: ''
    };
    const updated = [...cases, newCase];
    setCases(updated);
    onUpdate({ ...node.data, cases: updated });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Switch Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Default Path</Label>
            <Input
              value={node.data.defaultPath || ''}
              onChange={(e) => onUpdate({ ...node.data, defaultPath: e.target.value })}
              placeholder="Default output path"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            Switch Cases
            <Button size="sm" onClick={addCase}>
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {cases.map((switchCase: any, index: number) => (
            <div key={switchCase.id} className="p-3 border border-border rounded-lg space-y-2">
              <Input
                value={switchCase.condition}
                onChange={(e) => {
                  const updated = cases.map((c: any, i: number) =>
                    i === index ? { ...c, condition: e.target.value } : c
                  );
                  setCases(updated);
                  onUpdate({ ...node.data, cases: updated });
                }}
                placeholder="Condition"
              />
              <Input
                value={switchCase.value}
                onChange={(e) => {
                  const updated = cases.map((c: any, i: number) =>
                    i === index ? { ...c, value: e.target.value } : c
                  );
                  setCases(updated);
                  onUpdate({ ...node.data, cases: updated });
                }}
                placeholder="Value to match"
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

const RateLimitConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({
  node,
  onUpdate,
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Rate Limit Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Max TPS</Label>
            <Input
              type="number"
              value={node.data.maxTPS || ''}
              onChange={(e) => onUpdate({ ...node.data, maxTPS: parseInt(e.target.value) })}
              placeholder="1000"
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
          <div>
            <Label>Action on Limit</Label>
            <Select
              value={node.data.action || 'queue'}
              onValueChange={(value) => onUpdate({ ...node.data, action: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="queue">Queue</SelectItem>
                <SelectItem value="drop">Drop</SelectItem>
                <SelectItem value="reject">Reject</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const DelayConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({
  node,
  onUpdate,
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Delay Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Duration</Label>
            <Input
              type="number"
              value={node.data.duration || ''}
              onChange={(e) => onUpdate({ ...node.data, duration: parseInt(e.target.value) })}
              placeholder="5000"
            />
          </div>
          <div>
            <Label>Unit</Label>
            <Select
              value={node.data.unit || 'ms'}
              onValueChange={(value) => onUpdate({ ...node.data, unit: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ms">Milliseconds</SelectItem>
                <SelectItem value="s">Seconds</SelectItem>
                <SelectItem value="m">Minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Action</Label>
            <Select
              value={node.data.action || 'delay'}
              onValueChange={(value) => onUpdate({ ...node.data, action: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="delay">Delay</SelectItem>
                <SelectItem value="schedule">Schedule</SelectItem>
                <SelectItem value="throttle">Throttle</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ThrottleConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({
  node,
  onUpdate,
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Throttle Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Max Rate (per second)</Label>
            <Input
              type="number"
              value={node.data.maxRate || ''}
              onChange={(e) => onUpdate({ ...node.data, maxRate: parseInt(e.target.value) })}
              placeholder="100"
            />
          </div>
          <div>
            <Label>Burst Size</Label>
            <Input
              type="number"
              value={node.data.burstSize || ''}
              onChange={(e) => onUpdate({ ...node.data, burstSize: parseInt(e.target.value) })}
              placeholder="10"
            />
          </div>
          <div>
            <Label>Algorithm</Label>
            <Select
              value={node.data.algorithm || 'token_bucket'}
              onValueChange={(value) => onUpdate({ ...node.data, algorithm: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="token_bucket">Token Bucket</SelectItem>
                <SelectItem value="sliding_window">Sliding Window</SelectItem>
                <SelectItem value="fixed_window">Fixed Window</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AuditConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({
  node,
  onUpdate,
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Audit Settings</CardTitle>
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
        </CardContent>
      </Card>
    </div>
  );
};
