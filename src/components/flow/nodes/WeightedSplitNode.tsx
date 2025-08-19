import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Percent, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useFlow } from '@/contexts/FlowContext';

export const WeightedSplitNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const { deleteNode } = useFlow();

  const weights = Array.isArray(data.weights) ? data.weights : [];
  const totalWeight = weights.reduce((sum: number, w: any) => sum + (w.weight || 0), 0);
  const isValidTotal = totalWeight === 100;

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
            <Percent className="w-4 h-4 text-node-routing" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">Weighted Split</h3>
            <p className="text-xs text-muted-foreground">% Distribution</p>
          </div>
        </div>

        {/* Configuration Blocks */}
        <div className="space-y-2 mb-3">
          <div className="bg-accent/30 rounded p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Total Weight</span>
              <Badge variant={isValidTotal ? "default" : "destructive"} className="text-xs">
                {totalWeight}%
              </Badge>
            </div>
          </div>

          {weights.slice(0, 2).map((weight: any, index: number) => (
            <div key={index} className="bg-accent/30 rounded p-2">
              <div className="flex items-center justify-between">
                <span className="text-xs truncate max-w-16">{weight.vendor || `Vendor ${index + 1}`}</span>
                <span className="text-xs text-muted-foreground">{weight.weight || 0}%</span>
              </div>
            </div>
          ))}

          {weights.length > 2 && (
            <div className="text-xs text-muted-foreground text-center">
              +{weights.length - 2} more
            </div>
          )}

          {weights.length === 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-1">
              <span className="text-xs text-yellow-700 dark:text-yellow-400 font-medium">⚠ No weights configured</span>
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
              <div className="font-medium">Weighted Split Routing</div>
              <div className="text-muted-foreground">
                Distribute traffic based on percentage weights across vendors
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};