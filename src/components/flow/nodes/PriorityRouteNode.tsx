import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { ArrowUpDown, Trash2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFlow } from '@/contexts/FlowContext';

export const PriorityRouteNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const { deleteNode } = useFlow();
  const onConfigClick = data.onConfigClick as ((nodeId: string) => void) | undefined;

  const vendors = (data.vendors as any[]) || [];
  const priorityMode = (data.priorityMode as string) || 'strict';
  const strictPriority = data.strictPriority as boolean;
  
  // Check if node has configuration
  const hasConfiguration = vendors.length > 0;

  const modeColors = {
    strict: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    weighted_priority: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    conditional_priority: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    health_aware: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
  };

  return (
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
        <div className={`${hasConfiguration ? 'p-1.5' : 'p-1'} rounded-md bg-primary/10`}>
          <ArrowUpDown className={`${hasConfiguration ? 'w-4 h-4' : 'w-3 h-3'} text-primary`} />
        </div>
        {hasConfiguration && (
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate text-primary">Priority Route</div>
            <div className="text-xs text-muted-foreground truncate">
              {vendors.length} vendor{vendors.length > 1 ? 's' : ''}
            </div>
          </div>
        )}
        {!hasConfiguration && (
          <div className="flex-1 text-center">
            <h3 className="font-medium text-xs text-primary">Priority Route</h3>
          </div>
        )}
      </div>

      {/* Configuration Details - Only show when configured */}
      {hasConfiguration && (
        <div className="space-y-2 mb-3">
          {/* Priority Mode Block */}
          <div className="bg-accent/30 rounded p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Mode</span>
              <Badge 
                variant="secondary"
                className={`text-xs ${modeColors[priorityMode as keyof typeof modeColors] || modeColors.strict}`}
              >
                {priorityMode.replace('_', ' ')}
              </Badge>
            </div>
          </div>

          {/* Vendors Block */}
          <div className="bg-accent/30 rounded p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Vendors</span>
              <span className="text-xs text-muted-foreground">
                {vendors.length} configured
              </span>
            </div>
          </div>

          {strictPriority && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-1">
              <span className="text-xs text-red-700 dark:text-red-400 font-medium">
                ⚠ Strict Priority Mode
              </span>
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
    </div>
  );
};