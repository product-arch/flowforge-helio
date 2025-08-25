import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface VendorRoutingConfigurationProps {
  node: any;
  onUpdate: (data: any) => void;
}

interface Vendor {
  id: string;
  weight: number;
  priority: number;
  tpsCap?: number;
  costCap?: number;
}

interface RoutingConfig {
  mode: 'priority' | 'weighted' | 'fixed';
  vendors: Vendor[];
  fallbackEnabled: boolean;
  fallbackOrder: string[];
}

const SortableVendorItem: React.FC<{
  vendor: Vendor;
  index: number;
  routingMode: string;
  onUpdate: (index: number, field: string, value: any) => void;
  onRemove: (index: number) => void;
}> = ({ vendor, index, routingMode, onUpdate, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: vendor.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 border border-border rounded-lg bg-card"
    >
      <div {...attributes} {...listeners} className="cursor-grab">
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>
      
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <Label className="text-xs">Vendor</Label>
          <Select
            value={vendor.id}
            onValueChange={(value) => onUpdate(index, 'id', value)}
          >
            <SelectTrigger className="h-8 nodrag">
              <SelectValue placeholder="Select vendor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="twilio">Twilio</SelectItem>
              <SelectItem value="messagebird">MessageBird</SelectItem>
              <SelectItem value="kaleyra">Kaleyra</SelectItem>
              <SelectItem value="gupshup">Gupshup</SelectItem>
              <SelectItem value="msg91">MSG91</SelectItem>
              <SelectItem value="infobip">Infobip</SelectItem>
              <SelectItem value="sinch">Sinch</SelectItem>
              <SelectItem value="netcore">Netcore</SelectItem>
              <SelectItem value="valueFirst">ValueFirst</SelectItem>
              <SelectItem value="textlocal">Textlocal</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {routingMode === 'weighted' && (
          <div>
            <Label className="text-xs">Weight (%)</Label>
            <div className="space-y-2">
              <Slider
                value={[vendor.weight]}
                onValueChange={(value) => onUpdate(index, 'weight', value[0])}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="text-xs text-center">{vendor.weight}%</div>
            </div>
          </div>
        )}
        
        {routingMode === 'priority' && (
          <div>
            <Label className="text-xs">Priority</Label>
            <Input
              type="number"
              value={vendor.priority}
              onChange={(e) => onUpdate(index, 'priority', parseInt(e.target.value))}
              className="h-8 nodrag"
              min="1"
            />
          </div>
        )}
        
        <div>
          <Label className="text-xs">TPS Cap</Label>
          <Input
            type="number"
            value={vendor.tpsCap || ''}
            onChange={(e) => onUpdate(index, 'tpsCap', parseInt(e.target.value))}
            placeholder="100"
            className="h-8 nodrag"
          />
        </div>
        
        <div>
          <Label className="text-xs">Cost Cap (₹)</Label>
          <Input
            type="number"
            step="0.001"
            value={vendor.costCap || ''}
            onChange={(e) => onUpdate(index, 'costCap', parseFloat(e.target.value))}
            placeholder="1.000"
            className="h-8 nodrag"
          />
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(index)}
        className="text-destructive hover:text-destructive"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};

export const VendorRoutingConfiguration: React.FC<VendorRoutingConfigurationProps> = ({
  node,
  onUpdate,
}) => {
  const [configType, setConfigType] = useState(node.data.configType || 'default');
  const [routingConfig, setRoutingConfig] = useState<RoutingConfig>(node.data.routingConfig || {
    mode: 'priority',
    vendors: [],
    fallbackEnabled: true,
    fallbackOrder: []
  });

  // Fallback configuration state
  const [fallbackTrigger, setFallbackTrigger] = useState(node.data.fallbackTrigger || 'failure');
  const [fallbackDelay, setFallbackDelay] = useState(node.data.fallbackDelay || 30);
  const [maxRetryAttempts, setMaxRetryAttempts] = useState(node.data.maxRetryAttempts || 3);

  // Update parent component state without saving to node
  React.useEffect(() => {
    onUpdate({ 
      configType, 
      routingConfig,
      fallbackTrigger,
      fallbackDelay,
      maxRetryAttempts
    });
  }, [configType, routingConfig, fallbackTrigger, fallbackDelay, maxRetryAttempts, onUpdate]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleConfigTypeChange = (type: string) => {
    setConfigType(type);
  };

  const handleRoutingConfigChange = (config: RoutingConfig) => {
    setRoutingConfig(config);
  };

  const addVendor = () => {
    const newVendor: Vendor = {
      id: `vendor-${Date.now()}`,
      weight: Math.floor(100 / (routingConfig.vendors.length + 1)),
      priority: routingConfig.vendors.length + 1,
      tpsCap: 100,
      costCap: 1.0
    };
    
    const updatedVendors = [...routingConfig.vendors, newVendor];
    const updatedConfig = { ...routingConfig, vendors: updatedVendors };
    handleRoutingConfigChange(updatedConfig);
  };

  const removeVendor = (index: number) => {
    const updatedVendors = routingConfig.vendors.filter((_, i) => i !== index);
    const updatedConfig = { ...routingConfig, vendors: updatedVendors };
    handleRoutingConfigChange(updatedConfig);
  };

  const updateVendor = (index: number, field: string, value: any) => {
    const updatedVendors = routingConfig.vendors.map((vendor, i) =>
      i === index ? { ...vendor, [field]: value } : vendor
    );
    const updatedConfig = { ...routingConfig, vendors: updatedVendors };
    handleRoutingConfigChange(updatedConfig);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = routingConfig.vendors.findIndex((vendor) => vendor.id === active.id);
      const newIndex = routingConfig.vendors.findIndex((vendor) => vendor.id === over.id);
      
      const updatedVendors = arrayMove(routingConfig.vendors, oldIndex, newIndex);
      const updatedConfig = { ...routingConfig, vendors: updatedVendors };
      handleRoutingConfigChange(updatedConfig);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Routing Configuration Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Switch
              id="configType"
              checked={configType === 'custom'}
              onCheckedChange={(checked) => handleConfigTypeChange(checked ? 'custom' : 'default')}
            />
            <Label htmlFor="configType">Custom Configuration</Label>
          </div>

          {configType === 'custom' && (
            <>
              <div className="space-y-2">
                <Label>Routing Strategy</Label>
                <Select
                  value={routingConfig.mode}
                  onValueChange={(value: 'priority' | 'weighted' | 'fixed') =>
                    handleRoutingConfigChange({ ...routingConfig, mode: value })
                  }
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

              <Tabs defaultValue="main" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="main">Main Vendors</TabsTrigger>
                  <TabsTrigger value="fallback">Fallback Vendors</TabsTrigger>
                </TabsList>
                
                <TabsContent value="main" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Primary Vendor Configuration</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addVendor}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Vendor
                      </Button>
                    </div>

                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={routingConfig.vendors}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-2">
                          {routingConfig.vendors.map((vendor, index) => (
                            <SortableVendorItem
                              key={vendor.id}
                              vendor={vendor}
                              index={index}
                              routingMode={routingConfig.mode}
                              onUpdate={updateVendor}
                              onRemove={removeVendor}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>

                    {routingConfig.mode === 'weighted' && (
                      <div className="text-sm text-muted-foreground">
                        Total weight: {routingConfig.vendors.reduce((sum, v) => sum + v.weight, 0)}%
                        {routingConfig.vendors.reduce((sum, v) => sum + v.weight, 0) !== 100 && (
                          <span className="text-destructive ml-2">Must equal 100%</span>
                        )}
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="fallback" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="fallback"
                        checked={routingConfig.fallbackEnabled}
                        onCheckedChange={(checked) =>
                          handleRoutingConfigChange({ ...routingConfig, fallbackEnabled: checked })
                        }
                      />
                      <Label htmlFor="fallback">Enable Fallback Routing</Label>
                    </div>

                    {routingConfig.fallbackEnabled && (
                      <div className="space-y-4">
                        <div className="p-4 border border-border rounded-lg bg-accent/20">
                          <h4 className="font-medium mb-2">Fallback Configuration</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            Configure backup vendors to handle traffic when primary vendors fail or reach capacity.
                          </p>
                          
                          <div className="space-y-3">
                            <div>
                              <Label>Fallback Trigger</Label>
                              <Select value={fallbackTrigger} onValueChange={setFallbackTrigger}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="failure">On Primary Failure</SelectItem>
                                  <SelectItem value="capacity">On Capacity Limit</SelectItem>
                                  <SelectItem value="both">Both Conditions</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label>Fallback Delay (seconds)</Label>
                              <Input 
                                type="number" 
                                value={fallbackDelay}
                                onChange={(e) => setFallbackDelay(parseInt(e.target.value) || 30)}
                                placeholder="Seconds before fallback"
                                className="nodrag"
                              />
                            </div>
                            
                            <div>
                              <Label>Max Retry Attempts</Label>
                              <Input 
                                type="number" 
                                value={maxRetryAttempts}
                                onChange={(e) => setMaxRetryAttempts(parseInt(e.target.value) || 3)}
                                placeholder="Maximum retries"
                                className="nodrag"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};