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
            {selectedNode.type === 'priorityroute' && (
              <PriorityRouteConfiguration 
                node={selectedNode} 
                onUpdate={handleUpdateData} 
              />
            )}
            {selectedNode.type === 'spillover' && (
              <SpilloverConfiguration 
                node={selectedNode} 
                onUpdate={handleUpdateData} 
              />
            )}
            {selectedNode.type === 'roundrobin' && (
              <RoundRobinConfiguration 
                node={selectedNode} 
                onUpdate={handleUpdateData} 
              />
            )}
            {selectedNode.type === 'geolocation' && (
              <GeolocationConfiguration 
                node={selectedNode} 
                onUpdate={handleUpdateData} 
              />
            )}
            {selectedNode.type === 'loadbalancer' && (
              <LoadBalancerConfiguration 
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

// Enhanced Routing Configuration Components with More Strategies

const LeastCostConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({
  node,
  onUpdate,
}) => {
  const [vendorCosts, setVendorCosts] = useState(node.data.vendorCosts || []);
  const [strategy, setStrategy] = useState(node.data.strategy || 'absolute_cost');

  const addVendorCost = () => {
    const newVendor = {
      id: `vendor-${Date.now()}`,
      vendorId: '',
      cost: 0,
      currency: 'INR',
      region: 'global',
      priority: vendorCosts.length + 1
    };
    const updated = [...vendorCosts, newVendor];
    setVendorCosts(updated);
    onUpdate({ ...node.data, vendorCosts: updated });
  };

  const removeVendorCost = (index: number) => {
    const updated = vendorCosts.filter((_: any, i: number) => i !== index);
    setVendorCosts(updated);
    onUpdate({ ...node.data, vendorCosts: updated });
  };

  const updateVendorCost = (index: number, field: string, value: any) => {
    const updated = vendorCosts.map((vendor: any, i: number) =>
      i === index ? { ...vendor, [field]: value } : vendor
    );
    setVendorCosts(updated);
    onUpdate({ ...node.data, vendorCosts: updated });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Least Cost Strategy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Cost Strategy</Label>
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
                <SelectItem value="absolute_cost">Absolute Lowest Cost</SelectItem>
                <SelectItem value="cost_per_region">Cost Per Region</SelectItem>
                <SelectItem value="cost_with_quality">Cost with Quality Score</SelectItem>
                <SelectItem value="dynamic_pricing">Dynamic Pricing</SelectItem>
                <SelectItem value="bulk_discount">Bulk Discount Aware</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Cost Threshold (₹)</Label>
            <Input
              type="number"
              step="0.001"
              value={node.data.costThreshold || ''}
              onChange={(e) => onUpdate({ ...node.data, costThreshold: parseFloat(e.target.value) })}
              placeholder="0.050"
              className="nodrag"
            />
          </div>

          {strategy === 'cost_with_quality' && (
            <div>
              <Label>Quality Weight (%)</Label>
              <Slider
                value={[node.data.qualityWeight || 30]}
                onValueChange={(value) => onUpdate({ ...node.data, qualityWeight: value[0] })}
                max={100}
                step={5}
                className="w-full"
              />
              <div className="text-xs text-center mt-1">{node.data.qualityWeight || 30}% quality, {100 - (node.data.qualityWeight || 30)}% cost</div>
            </div>
          )}

          {strategy === 'dynamic_pricing' && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={node.data.enableTimeBasedPricing || false}
                  onCheckedChange={(checked) => onUpdate({ ...node.data, enableTimeBasedPricing: checked })}
                />
                <Label>Time-based Pricing</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={node.data.enableVolumeDiscounts || false}
                  onCheckedChange={(checked) => onUpdate({ ...node.data, enableVolumeDiscounts: checked })}
                />
                <Label>Volume Discounts</Label>
              </div>
            </div>
          )}

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
                <SelectItem value="twilio">Twilio</SelectItem>
                <SelectItem value="messagebird">MessageBird</SelectItem>
                <SelectItem value="gupshup">Gupshup</SelectItem>
                <SelectItem value="kaleyra">Kaleyra</SelectItem>
                <SelectItem value="msg91">MSG91</SelectItem>
                <SelectItem value="infobip">Infobip</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            Vendor Cost Configuration
            <Button size="sm" onClick={addVendorCost}>
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {vendorCosts.map((vendor: any, index: number) => (
            <div key={vendor.id} className="p-3 border border-border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Vendor {index + 1}</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeVendorCost(index)}
                  className="w-6 h-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
              
              <Select
                value={vendor.vendorId}
                onValueChange={(value) => updateVendorCost(index, 'vendorId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twilio">Twilio</SelectItem>
                  <SelectItem value="messagebird">MessageBird</SelectItem>
                  <SelectItem value="gupshup">Gupshup</SelectItem>
                  <SelectItem value="kaleyra">Kaleyra</SelectItem>
                  <SelectItem value="msg91">MSG91</SelectItem>
                  <SelectItem value="infobip">Infobip</SelectItem>
                  <SelectItem value="sinch">Sinch</SelectItem>
                  <SelectItem value="netcore">Netcore</SelectItem>
                  <SelectItem value="textlocal">Textlocal</SelectItem>
                  <SelectItem value="valueFirst">ValueFirst</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Cost per Message</Label>
                  <Input
                    type="number"
                    step="0.001"
                    value={vendor.cost}
                    onChange={(e) => updateVendorCost(index, 'cost', parseFloat(e.target.value))}
                    placeholder="0.045"
                    className="nodrag"
                  />
                </div>
                <div>
                  <Label className="text-xs">Currency</Label>
                  <Select
                    value={vendor.currency}
                    onValueChange={(value) => updateVendorCost(index, 'currency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {strategy === 'cost_per_region' && (
                <div>
                  <Label className="text-xs">Region</Label>
                  <Select
                    value={vendor.region}
                    onValueChange={(value) => updateVendorCost(index, 'region', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="global">Global</SelectItem>
                      <SelectItem value="india">India</SelectItem>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="europe">Europe</SelectItem>
                      <SelectItem value="apac">APAC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
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
  const [strategy, setStrategy] = useState(node.data.strategy || 'static_weights');

  const addWeight = () => {
    const newWeight = {
      id: `weight-${Date.now()}`,
      vendorId: '',
      weight: 0,
      conditions: [],
      timeBasedWeight: false
    };
    const updated = [...weights, newWeight];
    setWeights(updated);
    onUpdate({ ...node.data, weights: updated });
  };

  const removeWeight = (index: number) => {
    const updated = weights.filter((_: any, i: number) => i !== index);
    setWeights(updated);
    onUpdate({ ...node.data, weights: updated });
  };

  const updateWeight = (index: number, field: string, value: any) => {
    const updated = weights.map((weight: any, i: number) =>
      i === index ? { ...weight, [field]: value } : weight
    );
    setWeights(updated);
    onUpdate({ ...node.data, weights: updated });
  };

  const totalWeight = weights.reduce((sum: number, w: any) => sum + (w.weight || 0), 0);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Weighted Split Strategy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Weight Strategy</Label>
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
                <SelectItem value="static_weights">Static Weights</SelectItem>
                <SelectItem value="dynamic_weights">Dynamic Weights</SelectItem>
                <SelectItem value="performance_based">Performance Based</SelectItem>
                <SelectItem value="time_based">Time Based</SelectItem>
                <SelectItem value="cost_weighted">Cost Weighted</SelectItem>
                <SelectItem value="adaptive">Adaptive Learning</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {strategy === 'dynamic_weights' && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={node.data.autoAdjustWeights || false}
                  onCheckedChange={(checked) => onUpdate({ ...node.data, autoAdjustWeights: checked })}
                />
                <Label>Auto-adjust based on performance</Label>
              </div>
              <div>
                <Label>Adjustment Interval (minutes)</Label>
                <Input
                  type="number"
                  value={node.data.adjustmentInterval || ''}
                  onChange={(e) => onUpdate({ ...node.data, adjustmentInterval: parseInt(e.target.value) })}
                  placeholder="15"
                  className="nodrag"
                />
              </div>
            </div>
          )}

          {strategy === 'performance_based' && (
            <div className="space-y-2">
              <div>
                <Label>Success Rate Weight (%)</Label>
                <Slider
                  value={[node.data.successRateWeight || 60]}
                  onValueChange={(value) => onUpdate({ ...node.data, successRateWeight: value[0] })}
                  max={100}
                  step={5}
                />
                <div className="text-xs text-center mt-1">{node.data.successRateWeight || 60}%</div>
              </div>
              <div>
                <Label>Response Time Weight (%)</Label>
                <Slider
                  value={[node.data.responseTimeWeight || 40]}
                  onValueChange={(value) => onUpdate({ ...node.data, responseTimeWeight: value[0] })}
                  max={100}
                  step={5}
                />
                <div className="text-xs text-center mt-1">{node.data.responseTimeWeight || 40}%</div>
              </div>
            </div>
          )}

          {strategy === 'adaptive' && (
            <div className="space-y-2">
              <div>
                <Label>Learning Rate</Label>
                <Select
                  value={node.data.learningRate || 'medium'}
                  onValueChange={(value) => onUpdate({ ...node.data, learningRate: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slow">Slow (Conservative)</SelectItem>
                    <SelectItem value="medium">Medium (Balanced)</SelectItem>
                    <SelectItem value="fast">Fast (Aggressive)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Minimum Sample Size</Label>
                <Input
                  type="number"
                  value={node.data.minSampleSize || ''}
                  onChange={(e) => onUpdate({ ...node.data, minSampleSize: parseInt(e.target.value) })}
                  placeholder="100"
                  className="nodrag"
                />
              </div>
            </div>
          )}

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
              <div className="flex items-center justify-between">
                <Label className="text-xs">Vendor {index + 1}</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeWeight(index)}
                  className="w-6 h-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
              
              <Select
                value={weight.vendorId}
                onValueChange={(value) => updateWeight(index, 'vendorId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twilio">Twilio</SelectItem>
                  <SelectItem value="messagebird">MessageBird</SelectItem>
                  <SelectItem value="gupshup">Gupshup</SelectItem>
                  <SelectItem value="kaleyra">Kaleyra</SelectItem>
                  <SelectItem value="msg91">MSG91</SelectItem>
                  <SelectItem value="infobip">Infobip</SelectItem>
                  <SelectItem value="sinch">Sinch</SelectItem>
                  <SelectItem value="netcore">Netcore</SelectItem>
                  <SelectItem value="textlocal">Textlocal</SelectItem>
                  <SelectItem value="valueFirst">ValueFirst</SelectItem>
                </SelectContent>
              </Select>
              
              <div>
                <Label className="text-xs">Weight (%)</Label>
                <Input
                  type="number"
                  value={weight.weight}
                  onChange={(e) => updateWeight(index, 'weight', parseInt(e.target.value))}
                  placeholder="25"
                  className="nodrag"
                />
              </div>

              {strategy === 'time_based' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Peak Hours Weight</Label>
                    <Input
                      type="number"
                      value={weight.peakWeight || weight.weight}
                      onChange={(e) => updateWeight(index, 'peakWeight', parseInt(e.target.value))}
                      placeholder="30"
                      className="nodrag"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Off-peak Weight</Label>
                    <Input
                      type="number"
                      value={weight.offPeakWeight || weight.weight}
                      onChange={(e) => updateWeight(index, 'offPeakWeight', parseInt(e.target.value))}
                      placeholder="20"
                      className="nodrag"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {weights.length > 0 && (
            <div className="text-sm text-muted-foreground text-center">
              Total weight: {totalWeight}%
              {totalWeight !== 100 && (
                <span className="text-destructive ml-2">Must equal 100%</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const FallbackConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({
  node,
  onUpdate,
}) => {
  const [triggers, setTriggers] = useState(node.data.triggers || ['timeout']);

  const addTrigger = (trigger: string) => {
    if (!triggers.includes(trigger)) {
      const updated = [...triggers, trigger];
      setTriggers(updated);
      onUpdate({ ...node.data, triggers: updated });
    }
  };

  const removeTrigger = (trigger: string) => {
    const updated = triggers.filter((t: string) => t !== trigger);
    setTriggers(updated);
    onUpdate({ ...node.data, triggers: updated });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Fallback Strategy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Fallback Type</Label>
            <Select
              value={node.data.fallbackType || 'vendor_fallback'}
              onValueChange={(value) => onUpdate({ ...node.data, fallbackType: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vendor_fallback">Vendor Fallback</SelectItem>
                <SelectItem value="channel_fallback">Channel Fallback</SelectItem>
                <SelectItem value="queue_fallback">Queue Fallback</SelectItem>
                <SelectItem value="hybrid_fallback">Hybrid Fallback</SelectItem>
                <SelectItem value="intelligent_fallback">Intelligent Fallback</SelectItem>
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
                <SelectItem value="twilio">Twilio</SelectItem>
                <SelectItem value="messagebird">MessageBird</SelectItem>
                <SelectItem value="gupshup">Gupshup</SelectItem>
                <SelectItem value="kaleyra">Kaleyra</SelectItem>
                <SelectItem value="msg91">MSG91</SelectItem>
                <SelectItem value="infobip">Infobip</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Max Retries</Label>
              <Input
                type="number"
                value={node.data.maxRetries || ''}
                onChange={(e) => onUpdate({ ...node.data, maxRetries: parseInt(e.target.value) })}
                placeholder="3"
                className="nodrag"
              />
            </div>
            <div>
              <Label>Retry Delay (seconds)</Label>
              <Input
                type="number"
                value={node.data.retryDelay || ''}
                onChange={(e) => onUpdate({ ...node.data, retryDelay: parseInt(e.target.value) })}
                placeholder="5"
                className="nodrag"
              />
            </div>
          </div>

          {node.data.fallbackType === 'intelligent_fallback' && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={node.data.enableMLPrediction || false}
                  onCheckedChange={(checked) => onUpdate({ ...node.data, enableMLPrediction: checked })}
                />
                <Label>Enable ML Prediction</Label>
              </div>
              <div>
                <Label>Prediction Confidence Threshold (%)</Label>
                <Slider
                  value={[node.data.confidenceThreshold || 80]}
                  onValueChange={(value) => onUpdate({ ...node.data, confidenceThreshold: value[0] })}
                  max={100}
                  step={5}
                />
                <div className="text-xs text-center mt-1">{node.data.confidenceThreshold || 80}%</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Fallback Triggers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'timeout', label: 'Timeout' },
              { value: '5xxError', label: '5xx Error' },
              { value: 'rejection', label: 'Rejection' },
              { value: 'capacity', label: 'Capacity Exceeded' },
              { value: 'cost_limit', label: 'Cost Limit' },
              { value: 'quota_exceeded', label: 'Quota Exceeded' },
              { value: 'rate_limit', label: 'Rate Limit' },
              { value: 'maintenance', label: 'Maintenance Mode' }
            ].map((trigger) => (
              <div key={trigger.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={triggers.includes(trigger.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      addTrigger(trigger.value);
                    } else {
                      removeTrigger(trigger.value);
                    }
                  }}
                  className="w-4 h-4"
                />
                <Label className="text-xs">{trigger.label}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// New Routing Strategy Components

const PriorityRouteConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({
  node,
  onUpdate,
}) => {
  const [vendors, setVendors] = useState(node.data.vendors || []);

  const addVendor = () => {
    const newVendor = {
      id: `vendor-${Date.now()}`,
      vendorId: '',
      priority: vendors.length + 1,
      conditions: [],
      healthThreshold: 95
    };
    const updated = [...vendors, newVendor];
    setVendors(updated);
    onUpdate({ ...node.data, vendors: updated });
  };

  const removeVendor = (index: number) => {
    const updated = vendors.filter((_: any, i: number) => i !== index);
    setVendors(updated);
    onUpdate({ ...node.data, vendors: updated });
  };

  const updateVendor = (index: number, field: string, value: any) => {
    const updated = vendors.map((vendor: any, i: number) =>
      i === index ? { ...vendor, [field]: value } : vendor
    );
    setVendors(updated);
    onUpdate({ ...node.data, vendors: updated });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Priority Routing Strategy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Priority Mode</Label>
            <Select
              value={node.data.priorityMode || 'strict'}
              onValueChange={(value) => onUpdate({ ...node.data, priorityMode: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="strict">Strict Priority</SelectItem>
                <SelectItem value="weighted_priority">Weighted Priority</SelectItem>
                <SelectItem value="conditional_priority">Conditional Priority</SelectItem>
                <SelectItem value="health_aware">Health Aware Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={node.data.strictPriority || true}
              onCheckedChange={(checked) => onUpdate({ ...node.data, strictPriority: checked })}
            />
            <Label>Strict Priority (no fallback to lower priority)</Label>
          </div>

          {node.data.priorityMode === 'health_aware' && (
            <div>
              <Label>Minimum Health Score (%)</Label>
              <Slider
                value={[node.data.minHealthScore || 90]}
                onValueChange={(value) => onUpdate({ ...node.data, minHealthScore: value[0] })}
                max={100}
                step={5}
              />
              <div className="text-xs text-center mt-1">{node.data.minHealthScore || 90}%</div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            Priority Vendors
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
                <Label className="text-xs">Priority {vendor.priority}</Label>
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
                  <SelectItem value="twilio">Twilio</SelectItem>
                  <SelectItem value="messagebird">MessageBird</SelectItem>
                  <SelectItem value="gupshup">Gupshup</SelectItem>
                  <SelectItem value="kaleyra">Kaleyra</SelectItem>
                  <SelectItem value="msg91">MSG91</SelectItem>
                  <SelectItem value="infobip">Infobip</SelectItem>
                </SelectContent>
              </Select>
              
              <div>
                <Label className="text-xs">Priority Level</Label>
                <Input
                  type="number"
                  value={vendor.priority}
                  onChange={(e) => updateVendor(index, 'priority', parseInt(e.target.value))}
                  placeholder="1"
                  className="nodrag"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

const SpilloverConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({
  node,
  onUpdate,
}) => {
  const [vendors, setVendors] = useState(node.data.vendors || []);

  const addVendor = () => {
    const newVendor = {
      id: `vendor-${Date.now()}`,
      vendorId: '',
      capacity: 1000,
      currentLoad: 0,
      spilloverThreshold: 80
    };
    const updated = [...vendors, newVendor];
    setVendors(updated);
    onUpdate({ ...node.data, vendors: updated });
  };

  const removeVendor = (index: number) => {
    const updated = vendors.filter((_: any, i: number) => i !== index);
    setVendors(updated);
    onUpdate({ ...node.data, vendors: updated });
  };

  const updateVendor = (index: number, field: string, value: any) => {
    const updated = vendors.map((vendor: any, i: number) =>
      i === index ? { ...vendor, [field]: value } : vendor
    );
    setVendors(updated);
    onUpdate({ ...node.data, vendors: updated });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Spillover Strategy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Spillover Mode</Label>
            <Select
              value={node.data.spilloverMode || 'capacity_based'}
              onValueChange={(value) => onUpdate({ ...node.data, spilloverMode: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="capacity_based">Capacity Based</SelectItem>
                <SelectItem value="performance_based">Performance Based</SelectItem>
                <SelectItem value="cost_based">Cost Based</SelectItem>
                <SelectItem value="geographic">Geographic</SelectItem>
                <SelectItem value="time_based">Time Based</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Global Spillover Threshold (%)</Label>
            <Slider
              value={[node.data.globalThreshold || 80]}
              onValueChange={(value) => onUpdate({ ...node.data, globalThreshold: value[0] })}
              max={100}
              step={5}
            />
            <div className="text-xs text-center mt-1">{node.data.globalThreshold || 80}%</div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={node.data.enablePreemptiveSpillover || false}
              onCheckedChange={(checked) => onUpdate({ ...node.data, enablePreemptiveSpillover: checked })}
            />
            <Label>Enable Preemptive Spillover</Label>
          </div>

          {node.data.spilloverMode === 'geographic' && (
            <div>
              <Label>Primary Region</Label>
              <Select
                value={node.data.primaryRegion || 'india'}
                onValueChange={(value) => onUpdate({ ...node.data, primaryRegion: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="india">India</SelectItem>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="europe">Europe</SelectItem>
                  <SelectItem value="apac">APAC</SelectItem>
                  <SelectItem value="global">Global</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            Vendor Capacity Limits
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
                  <SelectItem value="twilio">Twilio</SelectItem>
                  <SelectItem value="messagebird">MessageBird</SelectItem>
                  <SelectItem value="gupshup">Gupshup</SelectItem>
                  <SelectItem value="kaleyra">Kaleyra</SelectItem>
                  <SelectItem value="msg91">MSG91</SelectItem>
                  <SelectItem value="infobip">Infobip</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Max Capacity</Label>
                  <Input
                    type="number"
                    value={vendor.capacity}
                    onChange={(e) => updateVendor(index, 'capacity', parseInt(e.target.value))}
                    placeholder="1000"
                    className="nodrag"
                  />
                </div>
                <div>
                  <Label className="text-xs">Spillover at (%)</Label>
                  <Input
                    type="number"
                    value={vendor.spilloverThreshold}
                    onChange={(e) => updateVendor(index, 'spilloverThreshold', parseInt(e.target.value))}
                    placeholder="80"
                    className="nodrag"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

const RoundRobinConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({
  node,
  onUpdate,
}) => {
  const [vendors, setVendors] = useState(node.data.vendors || []);

  const addVendor = () => {
    const newVendor = {
      id: `vendor-${Date.now()}`,
      vendorId: '',
      enabled: true,
      weight: 1
    };
    const updated = [...vendors, newVendor];
    setVendors(updated);
    onUpdate({ ...node.data, vendors: updated });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Round Robin Strategy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Round Robin Type</Label>
            <Select
              value={node.data.roundRobinType || 'simple'}
              onValueChange={(value) => onUpdate({ ...node.data, roundRobinType: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simple">Simple Round Robin</SelectItem>
                <SelectItem value="weighted">Weighted Round Robin</SelectItem>
                <SelectItem value="sticky">Sticky Round Robin</SelectItem>
                <SelectItem value="health_aware">Health Aware</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={node.data.skipUnhealthyVendors || true}
              onCheckedChange={(checked) => onUpdate({ ...node.data, skipUnhealthyVendors: checked })}
            />
            <Label>Skip Unhealthy Vendors</Label>
          </div>

          {node.data.roundRobinType === 'sticky' && (
            <div>
              <Label>Stickiness Duration (minutes)</Label>
              <Input
                type="number"
                value={node.data.stickinessDuration || ''}
                onChange={(e) => onUpdate({ ...node.data, stickinessDuration: parseInt(e.target.value) })}
                placeholder="60"
                className="nodrag"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            Vendor Pool
            <Button size="sm" onClick={addVendor}>
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {vendors.map((vendor: any, index: number) => (
            <div key={vendor.id} className="p-3 border border-border rounded-lg space-y-2">
              <Select
                value={vendor.vendorId}
                onValueChange={(value) => {
                  const updated = vendors.map((v: any, i: number) =>
                    i === index ? { ...v, vendorId: value } : v
                  );
                  setVendors(updated);
                  onUpdate({ ...node.data, vendors: updated });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twilio">Twilio</SelectItem>
                  <SelectItem value="messagebird">MessageBird</SelectItem>
                  <SelectItem value="gupshup">Gupshup</SelectItem>
                  <SelectItem value="kaleyra">Kaleyra</SelectItem>
                  <SelectItem value="msg91">MSG91</SelectItem>
                  <SelectItem value="infobip">Infobip</SelectItem>
                </SelectContent>
              </Select>
              
              {node.data.roundRobinType === 'weighted' && (
                <div>
                  <Label className="text-xs">Weight</Label>
                  <Input
                    type="number"
                    value={vendor.weight}
                    onChange={(e) => {
                      const updated = vendors.map((v: any, i: number) =>
                        i === index ? { ...v, weight: parseInt(e.target.value) } : v
                      );
                      setVendors(updated);
                      onUpdate({ ...node.data, vendors: updated });
                    }}
                    placeholder="1"
                    className="nodrag"
                  />
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

const GeolocationConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({
  node,
  onUpdate,
}) => {
  const [regions, setRegions] = useState(node.data.regions || []);

  const addRegion = () => {
    const newRegion = {
      id: `region-${Date.now()}`,
      name: '',
      countries: [],
      vendors: [],
      fallbackRegion: ''
    };
    const updated = [...regions, newRegion];
    setRegions(updated);
    onUpdate({ ...node.data, regions: updated });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Geolocation Routing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Routing Strategy</Label>
            <Select
              value={node.data.geoStrategy || 'country_based'}
              onValueChange={(value) => onUpdate({ ...node.data, geoStrategy: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="country_based">Country Based</SelectItem>
                <SelectItem value="region_based">Region Based</SelectItem>
                <SelectItem value="timezone_based">Timezone Based</SelectItem>
                <SelectItem value="latency_based">Latency Based</SelectItem>
                <SelectItem value="compliance_based">Compliance Based</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Default Region</Label>
            <Select
              value={node.data.defaultRegion || 'global'}
              onValueChange={(value) => onUpdate({ ...node.data, defaultRegion: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="global">Global</SelectItem>
                <SelectItem value="india">India</SelectItem>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="europe">Europe</SelectItem>
                <SelectItem value="apac">APAC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={node.data.enableGeoFencing || false}
              onCheckedChange={(checked) => onUpdate({ ...node.data, enableGeoFencing: checked })}
            />
            <Label>Enable Geo-fencing</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            Regional Configuration
            <Button size="sm" onClick={addRegion}>
              <Plus className="w-4 h-4 mr-1" />
              Add Region
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {regions.map((region: any, index: number) => (
            <div key={region.id} className="p-3 border border-border rounded-lg space-y-2">
              <Input
                value={region.name}
                onChange={(e) => {
                  const updated = regions.map((r: any, i: number) =>
                    i === index ? { ...r, name: e.target.value } : r
                  );
                  setRegions(updated);
                  onUpdate({ ...node.data, regions: updated });
                }}
                placeholder="Region name"
                className="nodrag"
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

const LoadBalancerConfiguration: React.FC<{ node: any; onUpdate: (data: any) => void }> = ({
  node,
  onUpdate,
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Load Balancer Strategy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Algorithm</Label>
            <Select
              value={node.data.algorithm || 'round_robin'}
              onValueChange={(value) => onUpdate({ ...node.data, algorithm: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="round_robin">Round Robin</SelectItem>
                <SelectItem value="least_connections">Least Connections</SelectItem>
                <SelectItem value="least_response_time">Least Response Time</SelectItem>
                <SelectItem value="weighted_round_robin">Weighted Round Robin</SelectItem>
                <SelectItem value="ip_hash">IP Hash</SelectItem>
                <SelectItem value="random">Random</SelectItem>
                <SelectItem value="consistent_hash">Consistent Hash</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={node.data.healthCheck || true}
              onCheckedChange={(checked) => onUpdate({ ...node.data, healthCheck: checked })}
            />
            <Label>Enable Health Checks</Label>
          </div>

          {node.data.healthCheck && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Check Interval (seconds)</Label>
                <Input
                  type="number"
                  value={node.data.healthCheckInterval || ''}
                  onChange={(e) => onUpdate({ ...node.data, healthCheckInterval: parseInt(e.target.value) })}
                  placeholder="30"
                  className="nodrag"
                />
              </div>
              <div>
                <Label className="text-xs">Timeout (seconds)</Label>
                <Input
                  type="number"
                  value={node.data.healthCheckTimeout || ''}
                  onChange={(e) => onUpdate({ ...node.data, healthCheckTimeout: parseInt(e.target.value) })}
                  placeholder="5"
                  className="nodrag"
                />
              </div>
            </div>
          )}

          <div>
            <Label>Session Persistence</Label>
            <Select
              value={node.data.sessionPersistence || 'none'}
              onValueChange={(value) => onUpdate({ ...node.data, sessionPersistence: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="source_ip">Source IP</SelectItem>
                <SelectItem value="cookie">Cookie Based</SelectItem>
                <SelectItem value="header">Header Based</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Existing configuration components (unchanged)
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
    const updated = [...conditions, newCondition];
    setConditions(updated);
    onUpdate({ ...node.data, conditions: updated });
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
              className="nodrag"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

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
              className="nodrag"
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
                className="nodrag"
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
                className="nodrag"
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
              className="nodrag"
            />
          </div>
          <div>
            <Label>Time Window (seconds)</Label>
            <Input
              type="number"
              value={node.data.timeWindow || ''}
              onChange={(e) => onUpdate({ ...node.data, timeWindow: parseInt(e.target.value) })}
              placeholder="60"
              className="nodrag"
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
              className="nodrag"
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
              className="nodrag"
            />
          </div>
          <div>
            <Label>Burst Size</Label>
            <Input
              type="number"
              value={node.data.burstSize || ''}
              onChange={(e) => onUpdate({ ...node.data, burstSize: parseInt(e.target.value) })}
              placeholder="10"
              className="nodrag"
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