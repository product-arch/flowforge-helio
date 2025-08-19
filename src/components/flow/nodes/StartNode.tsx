import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Play, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useFlow } from '@/contexts/FlowContext';

export const StartNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  return (
    <TooltipProvider>
      <div className={`
        relative bg-gradient-to-br from-node-start/20 to-node-start/10 
        border-2 rounded-full p-6 shadow-lg w-32 h-20 
        ${selected ? 'border-primary shadow-primary/20' : 'border-node-start'}
        hover:shadow-xl hover:scale-105 transition-all duration-300
        flex items-center justify-center
      `}>
        {/* Icon and Label */}
        <div className="flex flex-col items-center gap-1">
          <div className="p-2 bg-node-start/20 rounded-full">
            <Play className="w-4 h-4 text-node-start fill-node-start" />
          </div>
          <span className="text-xs font-semibold text-node-start">START</span>
        </div>

        {/* Multiple Output Handles for flexible connectivity */}
        <Handle
          type="source"
          position={Position.Right}
          id="right"
          className="w-3 h-3 bg-node-start border-2 border-background"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="bottom"
          className="w-3 h-3 bg-node-start border-2 border-background"
        />
        <Handle
          type="source"
          position={Position.Top}
          id="top"
          className="w-3 h-3 bg-node-start border-2 border-background"
        />

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="absolute inset-0 pointer-events-none" />
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm">
              <div className="font-medium">Start Node</div>
              <div className="text-muted-foreground">
                Entry point for the routing flow - connect to any node
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};