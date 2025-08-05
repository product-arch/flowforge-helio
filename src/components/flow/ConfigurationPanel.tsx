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

  if (!selectedNode) {
    return (
      <div className="w-80 bg-card border-l border-border flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <Settings className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Select a node to configure</p>
        </div>
      </div>
    );
  }

  if (collapsed) {
    return (
      <div className="w-12 bg-card border-l border-border flex flex-col items-center py-4">
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
    <div className="w-80 bg-card border-l border-border flex flex-col">
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
            {selectedNode.type === 'start' && (
              <StartConfiguration 
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

const StartConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({
  node,
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Start Node Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Channel</Label>
            <Input value={node.data.channel || 'SMS'} disabled />
          </div>
          <div>
            <Label>App ID</Label>
            <Input value={node.data.appId || 'N/A'} disabled />
          </div>
          <div>
            <Label>Business Unit</Label>
            <Input value={node.data.businessUnit || 'N/A'} disabled />
          </div>
          <p className="text-xs text-muted-foreground">
            Start node configuration is read-only and inherited from the campaign.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};