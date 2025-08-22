import React, { useState, useCallback, useMemo } from 'react';
import { ChevronDown, ChevronUp, GripVertical, RefreshCw, Play, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';

interface Vendor {
  id: string;
  name: string;
  logo: string;
  type: string;
}

interface RoutingConfig {
  mode: 'priority' | 'weighted' | 'fixed';
  vendors: Array<{
    id: string;
    weight: number;
    tpsCap?: number;
    costCap?: number;
    priority: number;
  }>;
  fallbackEnabled: boolean;
  fallbackOrder: string[];
}

interface VendorRoutingSubBlockProps {
  vendors: Vendor[];
  selectedVendors: string[];
  routingConfig?: RoutingConfig | undefined | any;
  onConfigChange: (config: RoutingConfig) => void;
  isAdvancedMode?: boolean;
  className?: string;
}

const defaultRoutingConfig = (selectedVendors: string[]): RoutingConfig => ({
  mode: 'priority',
  vendors: selectedVendors.map((id, index) => ({
    id,
    weight: Math.floor(100 / selectedVendors.length),
    priority: index + 1,
    tpsCap: 100,
    costCap: 1000
  })),
  fallbackEnabled: true,
  fallbackOrder: [...selectedVendors]
});

export const VendorRoutingSubBlock: React.FC<VendorRoutingSubBlockProps> = ({
  vendors,
  selectedVendors,
  routingConfig,
  onConfigChange,
  isAdvancedMode = false,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [draggedVendor, setDraggedVendor] = useState<string | null>(null);

  const config = useMemo(() => {
    if (routingConfig && typeof routingConfig === 'object' && 'mode' in routingConfig) {
      return routingConfig;
    }
    return defaultRoutingConfig(selectedVendors);
  }, [routingConfig, selectedVendors]);

  const selectedVendorData = useMemo(() =>
    selectedVendors.map(id => vendors.find(v => v.id === id)).filter(Boolean) as Vendor[],
    [selectedVendors, vendors]
  );

  // No vendors selected - empty state
  if (selectedVendors.length === 0) {
    return (
      <div className={`mt-2 p-3 bg-muted/30 border border-dashed border-muted-foreground/30 rounded-lg ${className}`}>
        <div className="text-center">
          <AlertTriangle className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Select vendors to configure routing</span>
        </div>
      </div>
    );
  }

  // Single vendor - read-only summary
  if (selectedVendors.length === 1) {
    const vendor = selectedVendorData[0];
    return (
      <div className={`mt-2 p-2 bg-accent/20 border border-accent/30 rounded-lg ${className}`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-foreground">Routing:</span>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-primary/10 px-2 py-0.5 rounded">
              {vendor?.logo} Direct to {vendor?.name}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Multiple vendors - full routing configuration
  const handleModeChange = (mode: string) => {
    const newConfig = { ...config, mode: mode as 'priority' | 'weighted' | 'fixed' };
    if (mode === 'weighted') {
      // Auto-balance weights
      const equalWeight = Math.floor(100 / selectedVendors.length);
      newConfig.vendors = newConfig.vendors.map(v => ({ ...v, weight: equalWeight }));
    }
    onConfigChange(newConfig);
  };

  const handleWeightChange = (vendorId: string, weight: number) => {
    const newVendors = config.vendors.map(v =>
      v.id === vendorId ? { ...v, weight } : v
    );
    onConfigChange({ ...config, vendors: newVendors });
  };

  const handleReset = () => {
    onConfigChange(defaultRoutingConfig(selectedVendors));
  };

  const handleSimulation = () => {
    // Placeholder for simulation functionality
    console.log('Simulating routing with config:', config);
  };

  const totalWeight = config.vendors.reduce((sum, v) => sum + v.weight, 0);
  const isWeightValid = totalWeight === 100;

  return (
    <div className={`mt-2 bg-card border border-border rounded-lg shadow-sm ${className}`}>
      {/* Connection line */}
      <div className="w-px h-2 bg-border mx-auto -mt-1" />
      
      {/* Collapsed state */}
      <div 
        className="p-3 cursor-pointer hover:bg-accent/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-foreground">Routing:</span>
            <Badge variant="secondary" className="text-xs">
              {config.mode} mode
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {selectedVendorData.slice(0, 3).map(vendor => (
                <span key={vendor.id} className="text-xs bg-primary/10 px-1 py-0.5 rounded">
                  {vendor.logo}
                </span>
              ))}
              {selectedVendors.length > 3 && (
                <span className="text-xs text-muted-foreground">+{selectedVendors.length - 3}</span>
              )}
            </div>
            {isExpanded ? (
              <ChevronUp className="w-3 h-3 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded state */}
      {isExpanded && (
        <div className="px-3 pb-3 border-t border-border">
          <div className="space-y-3 mt-3">
            
            {/* Routing Mode Selection */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Mode:</span>
              <Select value={config.mode} onValueChange={handleModeChange}>
                <SelectTrigger className="w-32 h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="weighted">Weighted</SelectItem>
                  <SelectItem value="fixed">Fixed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Vendor Configuration */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Vendors:</span>
                {config.mode === 'weighted' && (
                  <span className={`text-xs ${isWeightValid ? 'text-green-600' : 'text-red-600'}`}>
                    Total: {totalWeight}%
                  </span>
                )}
              </div>
              
              {config.vendors.map((vendorConfig, index) => {
                const vendor = vendors.find(v => v.id === vendorConfig.id);
                if (!vendor) return null;

                return (
                  <Card key={vendor.id} className="p-2 bg-accent/20">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-3 h-3 text-muted-foreground cursor-grab" />
                      <span className="text-xs font-medium flex items-center gap-1">
                        {vendor.logo} {vendor.name}
                      </span>
                      
                      {config.mode === 'priority' && (
                        <Badge variant="outline" className="text-xs ml-auto">
                          #{vendorConfig.priority}
                        </Badge>
                      )}
                      
                      {config.mode === 'weighted' && (
                        <div className="flex items-center gap-2 ml-auto">
                          <span className="text-xs w-8">{vendorConfig.weight}%</span>
                          <Slider
                            value={[vendorConfig.weight]}
                            onValueChange={([value]) => handleWeightChange(vendor.id, value)}
                            max={100}
                            step={1}
                            className="w-16"
                          />
                        </div>
                      )}
                    </div>

                    {/* Advanced controls for TPS/Cost caps */}
                    {isAdvancedMode && (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-muted-foreground">TPS Cap</label>
                          <input
                            type="number"
                            value={vendorConfig.tpsCap || 100}
                            className="w-full h-6 px-2 text-xs border border-border rounded"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Cost Cap</label>
                          <input
                            type="number"
                            value={vendorConfig.costCap || 1000}
                            className="w-full h-6 px-2 text-xs border border-border rounded"
                          />
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>

            {/* Fallback Configuration */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Auto Fallback:</span>
              <Switch
                checked={config.fallbackEnabled}
                onCheckedChange={(enabled) => 
                  onConfigChange({ ...config, fallbackEnabled: enabled })
                }
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleReset}
                className="h-7 px-2 text-xs"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Reset
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSimulation}
                className="h-7 px-2 text-xs"
              >
                <Play className="w-3 h-3 mr-1" />
                Simulate
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};