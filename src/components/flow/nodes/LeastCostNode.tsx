import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { DollarSign, Trash2, Edit3, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useFlow } from '@/contexts/FlowContext';

export const LeastCostNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const { deleteNode } = useFlow();
  const onConfigClick = data.onConfigClick as ((nodeId: string) => void) | undefined;

  const costThreshold = (data.costThreshold as number) || 0.05;
  const vendorCosts = (data.vendorCosts as any[]) || [];
  
  // Check if node has configuration
  const hasConfiguration = Array.isArray(vendorCosts) && vendorCosts.length > 0;

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
          <Plus className="w-3 h-3" />
        </Button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className={`${hasConfiguration ? 'p-2' : 'p-1.5'} bg-primary/10 rounded-lg`}>
            <DollarSign className={`${hasConfiguration ? 'w-4 h-4' : 'w-3 h-3'} text-primary`} />
          </div>
          {hasConfiguration && (
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-primary truncate">Least Cost</h3>
              <p className="text-xs text-muted-foreground truncate">
                Auto-routing
              </p>
            </div>
          )}
          {!hasConfiguration && (
            <div className="flex-1 text-center">
              <h3 className="font-medium text-xs text-primary">Least Cost</h3>
            </div>
          )}
        </div>

        {/* Configuration Blocks - Only show when configured */}
        {hasConfiguration && (
          <div className="space-y-2 mb-3">
            <div className="bg-accent/30 rounded p-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Max Cost</span>
                <Badge variant="outline" className="text-xs">
                  ₹{costThreshold.toFixed(3)}
                </Badge>
              </div>
            </div>

            <div className="bg-accent/30 rounded p-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Vendors</span>
                <span className="text-xs text-muted-foreground">
                  {vendorCosts.length} configured
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Unconfigured state notice */}
        {!hasConfiguration && (
          <div className="text-center mb-2">
            <span className="text-xs text-muted-foreground">Not configured</span>
          </div>
        )}

        {/* Invisible Connection Handles for full 4-side connectivity */}
        <Handle type="target" position={Position.Left} id="left-in" className="w-3 h-3 opacity-0" />
        <Handle type="target" position={Position.Top} id="top-in" className="w-3 h-3 opacity-0" />
        <Handle type="target" position={Position.Bottom} id="bottom-in" className="w-3 h-3 opacity-0" />
        <Handle type="target" position={Position.Right} id="right-in" className="w-3 h-3 opacity-0" />
        <Handle type="source" position={Position.Left} id="left-out" className="w-3 h-3 opacity-0" />
        <Handle type="source" position={Position.Right} id="right-out" className="w-3 h-3 opacity-0" />
        <Handle type="source" position={Position.Top} id="top-out" className="w-3 h-3 opacity-0" />
        <Handle type="source" position={Position.Bottom} id="bottom-out" className="w-3 h-3 opacity-0" />

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="absolute inset-0 pointer-events-none" />
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm">
              <div className="font-medium">Least Cost Routing</div>
              <div className="text-muted-foreground">
                Automatically routes messages through the cheapest available vendor
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};