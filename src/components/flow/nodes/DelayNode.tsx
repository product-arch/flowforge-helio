import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Clock, X, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFlow } from '@/contexts/FlowContext';

interface DelayNodeProps {
  id: string;
  data: {
    label: string;
    duration: number;
    unit: 'ms' | 's' | 'm' | 'h';
  };
  selected?: boolean;
}

export const DelayNode: React.FC<DelayNodeProps> = ({ id, data, selected }) => {
  const { deleteNode } = useFlow();

  const formatDuration = () => {
    const { duration, unit } = data;
    if (!duration) return 'No delay';
    
    const unitLabels = { ms: 'ms', s: 'sec', m: 'min', h: 'hr' };
    return `${duration}${unitLabels[unit] || 's'}`;
  };

  return (
    <div className={`
      relative bg-card border-2 rounded-lg p-3 min-w-[130px] transition-all duration-200
      ${selected ? 'border-primary shadow-lg' : 'border-node-delay shadow-sm'}
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

      {/* Node Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-md bg-node-delay/10">
          <Clock className="w-4 h-4 text-node-delay" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">Delay</div>
          <div className="text-xs text-muted-foreground">{formatDuration()}</div>
        </div>
      </div>

      {/* Delay Visualization */}
      <div className="bg-accent/30 rounded p-2 mb-2">
        <div className="flex items-center justify-center gap-2">
          <Timer className="w-4 h-4 text-node-delay animate-pulse" />
          <div className="text-lg font-mono font-bold text-node-delay">
            {formatDuration()}
          </div>
        </div>
      </div>

      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 border-2 border-node-delay bg-background"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 border-2 border-node-delay bg-background"
      />
    </div>
  );
};