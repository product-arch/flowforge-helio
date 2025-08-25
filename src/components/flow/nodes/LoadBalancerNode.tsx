import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Gauge, Trash2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFlow } from '@/contexts/FlowContext';

export const LoadBalancerNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const { deleteNode } = useFlow();
  const onConfigClick = data.onConfigClick as ((nodeId: string) => void) | undefined;

  const algorithm = (data.algorithm as string) || 'round_robin';
  const healthCheck = data.healthCheck as boolean;
  const targets = (data.targets as any[]) || [];
  
  // Check if node has configuration
  const hasConfiguration = targets.length > 0 || algorithm !== 'round_robin';

  const algorithmColors = {
    round_robin: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    least_connections: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    least_response_time: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    weighted_round_robin: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
    ip_hash: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    random: 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400',
    consistent_hash: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400'
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
          <Gauge className={`${hasConfiguration ? 'w-4 h-4' : 'w-3 h-3'} text-primary`} />
        </div>
        {hasConfiguration && (
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate text-primary">Load Balancer</div>
            <div className="text-xs text-muted-foreground truncate">
              {algorithm.replace('_', ' ')}
            </div>
          </div>
        )}
        {!hasConfiguration && (
          <div className="flex-1 text-center">
            <h3 className="font-medium text-xs text-primary">Load Balancer</h3>
          </div>
        )}
      </div>

      {/* Configuration Details - Only show when configured */}
      {hasConfiguration && (
        <div className="space-y-2 mb-3">
          {/* Algorithm Block */}
          <div className="bg-accent/30 rounded p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Algorithm</span>
              <Badge 
                variant="secondary"
                className={`text-xs ${algorithmColors[algorithm as keyof typeof algorithmColors] || algorithmColors.round_robin}`}
              >
                {algorithm.replace('_', ' ')}
              </Badge>
            </div>
          </div>

          {/* Targets Block */}
          <div className="bg-accent/30 rounded p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Targets</span>
              <span className="text-xs text-muted-foreground">
                {targets.length} configured
              </span>
            </div>
          </div>

          {healthCheck && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-1">
              <span className="text-xs text-green-700 dark:text-green-400 font-medium">
                ✓ Health Monitoring
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