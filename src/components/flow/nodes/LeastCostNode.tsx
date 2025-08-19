import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { DollarSign, Trash2, Edit3 } from 'lucide-react';
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
  const { deleteNode, setSelectedNode } = useFlow();

  const costThreshold = (data.costThreshold as number) || 0.05;
  const vendorCosts = (data.vendorCosts as any[]) || [];
  const hasVendorCosts = Array.isArray(vendorCosts) && vendorCosts.length > 0;

  return (
    <TooltipProvider>
      <div className={`
        relative group bg-card border-2 rounded-lg p-3 shadow-lg min-w-[160px] max-w-[200px]
        ${selected ? 'border-primary' : 'border-node-routing'}
        hover:shadow-xl transition-all duration-200
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

        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-node-routing/10 rounded-lg">
            <DollarSign className="w-4 h-4 text-node-routing" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">Least Cost</h3>
            <p className="text-xs text-muted-foreground">Auto-routing</p>
          </div>
        </div>

        {/* Configuration Blocks */}
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
                {hasVendorCosts ? vendorCosts.length : 0} configured
              </span>
            </div>
          </div>

          {!hasVendorCosts && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-1">
              <span className="text-xs text-yellow-700 dark:text-yellow-400 font-medium">⚠ No vendor costs set</span>
            </div>
          )}
        </div>

        {/* Connection Handles */}
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-node-routing border-2 border-background"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-node-routing border-2 border-background"
        />

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