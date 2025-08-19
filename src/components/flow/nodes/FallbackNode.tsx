import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { RotateCcw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useFlow } from '@/contexts/FlowContext';

export const FallbackNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const { deleteNode } = useFlow();

  const triggers = (data.triggers as string[]) || [];
  const fallbackVendor = (data.fallbackVendor as string) || '';
  const maxRetries = (data.maxRetries as number) || 3;

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
            <RotateCcw className="w-4 h-4 text-node-routing" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">Fallback</h3>
            <p className="text-xs text-muted-foreground">Backup Route</p>
          </div>
        </div>

        {/* Configuration Blocks */}
        <div className="space-y-2 mb-3">
          <div className="bg-accent/30 rounded p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Fallback Vendor</span>
              <span className="text-xs text-muted-foreground truncate max-w-16">
                {fallbackVendor || 'Not set'}
              </span>
            </div>
          </div>

          <div className="bg-accent/30 rounded p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Max Retries</span>
              <Badge variant="outline" className="text-xs">
                {maxRetries}
              </Badge>
            </div>
          </div>

          <div className="bg-accent/30 rounded p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Triggers</span>
              <span className="text-xs text-muted-foreground">
                {triggers.length || 0} set
              </span>
            </div>
          </div>

          {!fallbackVendor && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-1">
              <span className="text-xs text-yellow-700 dark:text-yellow-400 font-medium">⚠ No fallback vendor</span>
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
              <div className="font-medium">Fallback Routing</div>
              <div className="text-muted-foreground">
                Switch to backup vendor when primary fails
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};