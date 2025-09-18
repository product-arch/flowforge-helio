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
        relative bg-card border rounded-lg p-2 w-[80px]
        ${selected ? 'border-primary shadow-sm' : 'border-border hover:border-border/60'}
        transition-all duration-200
        flex items-center justify-center
      `}>
        {/* Icon and Label */}
        <div className="flex flex-col items-center gap-1">
          <div className="rounded bg-primary/10 p-0.5 flex items-center justify-center">
            <Play className="w-2.5 h-2.5 text-primary" />
          </div>
          <span className="text-[10px] font-medium text-foreground">START</span>
        </div>

        {/* Connection Handles */}
        <Handle
          type="source"
          position={Position.Right}
          id="right"
          className="w-1.5 h-1.5 bg-primary border border-background rounded-full opacity-40 hover:opacity-100 hover:scale-110 transition-all duration-200"
          style={{ right: -3, top: '50%', transform: 'translateY(-50%)' }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="bottom"
          className="w-1.5 h-1.5 bg-primary border border-background rounded-full opacity-40 hover:opacity-100 hover:scale-110 transition-all duration-200"
          style={{ bottom: -3, left: '50%', transform: 'translateX(-50%)' }}
        />
        <Handle
          type="source"
          position={Position.Top}
          id="top"
          className="w-1.5 h-1.5 bg-primary border border-background rounded-full opacity-40 hover:opacity-100 hover:scale-110 transition-all duration-200"
          style={{ top: -3, left: '50%', transform: 'translateX(-50%)' }}
        />

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="absolute inset-0 pointer-events-none" />
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-xs">
              <div className="font-medium">Start Node</div>
              <div className="text-muted-foreground text-[10px]">
                Entry point for the routing flow
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};