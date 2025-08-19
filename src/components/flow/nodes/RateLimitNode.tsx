import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Timer, X, Activity, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFlow } from '@/contexts/FlowContext';

interface RateLimitNodeProps {
  id: string;
  data: {
    label: string;
    maxRate: number;
    timeWindow: number;
    strategy: 'sliding' | 'fixed';
    onConfigClick?: (nodeId: string) => void;
  };
  selected?: boolean;
}

export const RateLimitNode: React.FC<RateLimitNodeProps> = ({ id, data, selected }) => {
  const { deleteNode } = useFlow();
  const onConfigClick = data.onConfigClick as ((nodeId: string) => void) | undefined;

  const displayText = data.maxRate 
    ? `${data.maxRate}/${data.timeWindow}s`
    : 'Rate: Not Set';

  return (
    <div className={`
      relative bg-card border-2 rounded-lg p-3 min-w-[140px] transition-all duration-200
      ${selected ? 'border-primary shadow-lg' : 'border-node-ratelimit shadow-sm'}
      hover:shadow-md group
    `}>
      {/* Delete Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => deleteNode(id)}
        className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full"
      >
        <X className="h-3 w-3" />
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

      {/* Node Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-md bg-node-ratelimit/10">
          <Timer className="w-4 h-4 text-node-ratelimit" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">Rate Limit</div>
          <div className="text-xs text-muted-foreground">{displayText}</div>
        </div>
      </div>

      {/* Rate Display */}
      <div className="space-y-2">
        <div className="bg-accent/30 rounded p-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Strategy</span>
            <span className="text-xs capitalize">{data.strategy || 'sliding'}</span>
          </div>
          
          <div className="mt-1 flex items-center gap-1">
            <Activity className="w-3 h-3 text-node-ratelimit" />
            <div className="flex-1 bg-accent rounded-full h-1">
              <div 
                className="bg-node-ratelimit h-full rounded-full transition-all"
                style={{ width: '60%' }}
              ></div>
            </div>
            <span className="text-xs">60%</span>
          </div>
        </div>
      </div>

      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 border-2 border-node-ratelimit bg-background"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 border-2 border-node-ratelimit bg-background"
      />
    </div>
  );
};