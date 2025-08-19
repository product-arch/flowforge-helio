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

interface ConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodeId: string;
}

export const ConfigurationModal: React.FC<ConfigurationModalProps> = ({ 
  isOpen, 
  onClose, 
  nodeId 
}) => {
  const { nodes, updateNodeData } = useFlow();
  const { toast } = useToast();

  const selectedNode = nodes.find(node => node.id === nodeId);

  if (!selectedNode) {
    return null;
  }

  const handleUpdateData = (newData: any) => {
    updateNodeData(selectedNode.id, newData);
    toast({
      title: "Node Updated",
      description: "Configuration saved successfully.",
      className: "border-status-success bg-status-success/10 text-status-success"
    });
  };

  const renderConfiguration = () => {
    switch (selectedNode.type) {
      case 'routing':
        return <RoutingConfiguration node={selectedNode} onUpdate={handleUpdateData} />;
      case 'constraint':
        return <ConstraintConfiguration node={selectedNode} onUpdate={handleUpdateData} />;
      case 'conditional':
        return <ConditionalConfiguration node={selectedNode} onUpdate={handleUpdateData} />;
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
      default:
        return <div className="text-center text-muted-foreground">No configuration available for this node type.</div>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
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
            >
              {renderConfiguration()}
            </motion.div>
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
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
            <Label>From Address</Label>
            <Input
              value={node.data.fromAddress || ''}
              onChange={(e) => onUpdate({ ...node.data, fromAddress: e.target.value })}
              placeholder="Enter sender email"
            />
          </div>
          <div>
            <Label>Template</Label>
            <Input
              value={node.data.template || ''}
              onChange={(e) => onUpdate({ ...node.data, template: e.target.value })}
              placeholder="Enter template name"
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
        </CardContent>
      </Card>
    </div>
  );
};

const LeastCostConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({ node, onUpdate }) => {
  const [vendorCosts, setVendorCosts] = useState(node.data.vendorCosts || []);

  const addVendorCost = () => {
    const newVendorCost = {
      id: `vendor-${Date.now()}`,
      vendorId: '',
      cost: 0
    };
    const updatedVendorCosts = [...vendorCosts, newVendorCost];
    setVendorCosts(updatedVendorCosts);
    onUpdate({ ...node.data, vendorCosts: updatedVendorCosts });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Cost Threshold</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Max Cost (₹)</Label>
            <Input
              type="number"
              step="0.001"
              value={node.data.costThreshold || ''}
              onChange={(e) => onUpdate({ ...node.data, costThreshold: parseFloat(e.target.value) })}
              placeholder="0.05"
            />
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
                step="0.001"
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

const WeightedSplitConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({ node, onUpdate }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Weighted Split Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Split Strategy</Label>
            <Select
              value={node.data.strategy || 'percentage'}
              onValueChange={(value) => onUpdate({ ...node.data, strategy: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="ratio">Ratio</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
            <Label>Trigger Condition</Label>
            <Select
              value={node.data.trigger || 'failure'}
              onValueChange={(value) => onUpdate({ ...node.data, trigger: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="failure">On Failure</SelectItem>
                <SelectItem value="timeout">On Timeout</SelectItem>
                <SelectItem value="error">On Error</SelectItem>
              </SelectContent>
            </Select>
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
            <Label>Filter Action</Label>
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
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Filter Criteria</Label>
            <Input
              value={node.data.criteria || ''}
              onChange={(e) => onUpdate({ ...node.data, criteria: e.target.value })}
              placeholder="Enter filter criteria"
            />
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
            <Label>Default Path</Label>
            <Input
              value={node.data.defaultPath || ''}
              onChange={(e) => onUpdate({ ...node.data, defaultPath: e.target.value })}
              placeholder="Enter default path"
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
            <Label>Max Rate (TPS)</Label>
            <Input
              type="number"
              value={node.data.maxRate || ''}
              onChange={(e) => onUpdate({ ...node.data, maxRate: parseInt(e.target.value) })}
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
            <Label>Duration</Label>
            <Input
              type="number"
              value={node.data.duration || ''}
              onChange={(e) => onUpdate({ ...node.data, duration: parseInt(e.target.value) })}
              placeholder="5"
            />
          </div>
          <div>
            <Label>Unit</Label>
            <Select
              value={node.data.unit || 's'}
              onValueChange={(value) => onUpdate({ ...node.data, unit: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ms">Milliseconds</SelectItem>
                <SelectItem value="s">Seconds</SelectItem>
                <SelectItem value="m">Minutes</SelectItem>
                <SelectItem value="h">Hours</SelectItem>
              </SelectContent>
            </Select>
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
            <Label>Max Rate</Label>
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
            <Label>Logging Level</Label>
            <Select
              value={node.data.loggingLevel || 'info'}
              onValueChange={(value) => onUpdate({ ...node.data, loggingLevel: value })}
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
