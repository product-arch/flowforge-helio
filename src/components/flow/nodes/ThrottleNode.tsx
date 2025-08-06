import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Zap, X, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFlow } from '@/contexts/FlowContext';

interface ThrottleNodeProps {
  id: string;
  data: {
    label: string;
    maxConcurrent: number;
    queueSize: number;
  };
  selected?: boolean;
}

export const ThrottleNode: React.FC<ThrottleNodeProps> = ({ id, data, selected }) => {
  const { deleteNode } = useFlow();

  const currentConcurrent = Math.floor(Math.random() * (data.maxConcurrent || 10));
  const currentQueue = Math.floor(Math.random() * (data.queueSize || 100));

  return (
    <div className={`
      relative bg-card border-2 rounded-lg p-3 min-w-[150px] transition-all duration-200
      ${selected ? 'border-primary shadow-lg' : 'border-node-throttle shadow-sm'}
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
        <div className="p-1.5 rounded-md bg-node-throttle/10">
          <Zap className="w-4 h-4 text-node-throttle" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">Throttle</div>
          <div className="text-xs text-muted-foreground">
            Max: {data.maxConcurrent || 10} concurrent
          </div>
        </div>
      </div>

      {/* Throttle Status */}
      <div className="space-y-2">
        <div className="bg-accent/30 rounded p-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium flex items-center gap-1">
              <Users className="w-3 h-3" />
              Active
            </span>
            <span className="text-xs">{currentConcurrent}/{data.maxConcurrent || 10}</span>
          </div>
          <div className="bg-accent rounded-full h-1.5">
            <div 
              className="bg-node-throttle h-full rounded-full transition-all"
              style={{ width: `${(currentConcurrent / (data.maxConcurrent || 10)) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-accent/30 rounded p-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium">Queue</span>
            <span className="text-xs">{currentQueue}/{data.queueSize || 100}</span>
          </div>
          <div className="bg-accent rounded-full h-1.5">
            <div 
              className="bg-yellow-500 h-full rounded-full transition-all"
              style={{ width: `${(currentQueue / (data.queueSize || 100)) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 border-2 border-node-throttle bg-background"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 border-2 border-node-throttle bg-background"
      />
    </div>
  );
};