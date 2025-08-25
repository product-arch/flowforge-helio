import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { GitBranch, Trash2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useFlow } from '@/contexts/FlowContext';

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

export const VendorRoutingNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const { deleteNode } = useFlow();
  const onConfigClick = data.onConfigClick as ((nodeId: string) => void) | undefined;

  const routingConfig = data.routingConfig as RoutingConfig | undefined;
  const selectedVendors = (data.selectedVendors as string[]) || [];
  const configType = (data.configType as string) || 'default';
  const parentChannelId = data.parentChannelId as string;
  const fallbackTrigger = data.fallbackTrigger as string;
  const fallbackDelay = data.fallbackDelay as number;
  const maxRetryAttempts = data.maxRetryAttempts as number;
  
  // Check if parent channel is configured
  const { nodes } = useFlow();
  const parentChannel = nodes.find(node => node.id === parentChannelId);
  const channelConfigured = parentChannel?.data?.selectedVendors && Array.isArray(parentChannel.data.selectedVendors) && parentChannel.data.selectedVendors.length > 0;
  
  // Check if node has configuration
  const hasConfiguration = configType === 'custom' ? (routingConfig && routingConfig.vendors.length > 0) : configType === 'default';

  return (
    <TooltipProvider>
      <div className={`
        relative group bg-card border-2 rounded-lg shadow-lg transition-all duration-200
        ${selected ? 'border-primary shadow-primary/20' : 'border-primary/50'}
        hover:shadow-xl
        ${hasConfiguration ? 'p-3 min-w-[160px] max-w-[200px]' : 'p-2 w-[120px]'}
      `}>
        {/* Delete Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => deleteNode(id)}
          className="absolute -top-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-destructive-foreground hover:bg-destructive/90"
        >
          <Trash2 className="w-3 h-3" />
        </Button>

        {/* Config Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onConfigClick?.(id)}
          className="absolute -bottom-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
        >
          <Settings className="w-3 h-3" />
        </Button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className={`${hasConfiguration ? 'p-2' : 'p-1.5'} bg-primary/10 rounded-lg`}>
            <GitBranch className={`${hasConfiguration ? 'w-4 h-4' : 'w-3 h-3'} text-primary`} />
          </div>
          {hasConfiguration && (
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-primary truncate">Routing</h3>
              <p className="text-xs text-muted-foreground truncate">
                {configType === 'custom' ? routingConfig?.mode || 'priority' : 'default'}
              </p>
            </div>
          )}
          {!hasConfiguration && (
            <div className="flex-1 text-center">
              <h3 className="font-medium text-xs text-primary">Routing</h3>
            </div>
          )}
        </div>

        {/* Configuration Blocks - Only show when configured */}
        {hasConfiguration && (
          <div className="space-y-2 mb-3">
            <div className="bg-accent/30 rounded p-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Config Type</span>
                <Badge variant={configType === 'custom' ? 'default' : 'secondary'} className="text-xs">
                  {configType}
                </Badge>
              </div>
            </div>

            {configType === 'custom' && routingConfig && (
              <>
                <div className="bg-accent/30 rounded p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">Strategy</span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {routingConfig.mode}
                    </span>
                  </div>
                </div>

                <div className="bg-accent/30 rounded p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">Vendors</span>
                    <span className="text-xs text-muted-foreground">
                      {routingConfig.vendors.length} configured
                    </span>
                  </div>
                  {routingConfig.vendors.slice(0, 3).map((vendor, index) => (
                    <div key={index} className="flex items-center justify-between mt-1">
                      <span className="text-xs truncate max-w-20">{vendor.id}</span>
                      <div className="flex items-center gap-1">
                        {routingConfig.mode === 'weighted' && (
                          <span className="text-xs text-muted-foreground">{vendor.weight}%</span>
                        )}
                        {routingConfig.mode === 'priority' && (
                          <Badge variant="outline" className="text-xs px-1 py-0">#{vendor.priority}</Badge>
                        )}
                        {vendor.tpsCap && (
                          <span className="text-xs text-blue-600 dark:text-blue-400">{vendor.tpsCap}TPS</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {routingConfig.vendors.length > 3 && (
                    <div className="text-xs text-muted-foreground text-center mt-1">
                      +{routingConfig.vendors.length - 3} more
                    </div>
                  )}
                </div>

                {routingConfig.fallbackEnabled && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-green-700 dark:text-green-400 font-medium">✓ Fallback Enabled</span>
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-300 mt-1 space-y-1">
                      <div>Trigger: {fallbackTrigger}</div>
                      <div>Delay: {fallbackDelay}s</div>
                      <div>Max Retries: {maxRetryAttempts}</div>
                    </div>
                  </div>
                )}

                {/* Weight validation for weighted mode */}
                {routingConfig.mode === 'weighted' && (
                  <div className="bg-accent/30 rounded p-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">Total Weight</span>
                      <span className={`text-xs ${
                        routingConfig.vendors.reduce((sum, v) => sum + v.weight, 0) === 100 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-destructive'
                      }`}>
                        {routingConfig.vendors.reduce((sum, v) => sum + v.weight, 0)}%
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}

            {configType === 'default' && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-2">
                <span className="text-xs text-blue-700 dark:text-blue-400 font-medium">Using System Defaults</span>
                <div className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                  Automatic load balancing across available vendors
                </div>
              </div>
            )}
          </div>
        )}

        {/* Unconfigured state notice */}
        {!hasConfiguration && (
          <div className="text-center mb-2">
            <span className="text-xs text-muted-foreground">
              {!channelConfigured ? 'Configure channel block first' : 'Not configured'}
            </span>
          </div>
        )}

        {/* Invisible Connection Handles for full connectivity */}
        <Handle type="target" position={Position.Left} id="left" className="w-3 h-3 opacity-0" />
        <Handle type="target" position={Position.Top} id="top-in" className="w-3 h-3 opacity-0" />
        <Handle type="target" position={Position.Bottom} id="bottom-in" className="w-3 h-3 opacity-0" />
        <Handle type="source" position={Position.Right} id="right" className="w-3 h-3 opacity-0" />
        <Handle type="source" position={Position.Top} id="top-out" className="w-3 h-3 opacity-0" />
        <Handle type="source" position={Position.Bottom} id="bottom-out" className="w-3 h-3 opacity-0" />

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="absolute inset-0 pointer-events-none" />
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm">
              <div className="font-medium">Vendor Routing Node</div>
              <div className="text-muted-foreground">
                Configure vendor selection strategy and routing logic
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};