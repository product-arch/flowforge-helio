import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Percent, Trash2, Plus } from 'lucide-react';
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
  const onConfigClick = data.onConfigClick as ((nodeId: string) => void) | undefined;

  const weights = Array.isArray(data.weights) ? data.weights : [];
  const totalWeight = weights.reduce((sum: number, w: any) => sum + (w.weight || 0), 0);
  const isValidTotal = totalWeight === 100;
  
  // Check if node has configuration
  const hasConfiguration = weights.length > 0;

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
            <Percent className={`${hasConfiguration ? 'w-4 h-4' : 'w-3 h-3'} text-primary`} />
          </div>
          {hasConfiguration && (
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-primary truncate">Weighted Split</h3>
              <p className="text-xs text-muted-foreground truncate">
                {totalWeight}% total
              </p>
            </div>
          )}
          {!hasConfiguration && (
            <div className="flex-1 text-center">
              <h3 className="font-medium text-xs text-primary">Weighted Split</h3>
            </div>
          )}
        </div>

        {/* Configuration Blocks - Only show when configured */}
        {hasConfiguration && (
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
          </div>
        )}

        {/* Unconfigured state notice */}
        {!hasConfiguration && (
          <div className="text-center mb-2">
            <span className="text-xs text-muted-foreground">Not configured</span>
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