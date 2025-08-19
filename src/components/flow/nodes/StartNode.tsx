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
        relative bg-card border-2 rounded-lg p-4 shadow-lg min-w-[180px]
        ${selected ? 'border-primary' : 'border-node-start'}
        hover:shadow-xl transition-all duration-200
      `}>
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-node-start/10 rounded-lg">
            <Play className="w-5 h-5 text-node-start" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Start</h3>
            <p className="text-xs text-muted-foreground">Flow Entry Point</p>
          </div>
        </div>

        {/* Output Handle */}
        <Handle
          type="source"
          position={Position.Right}
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
                Entry point for the routing flow with read-only metadata
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};