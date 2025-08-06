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
  const { deleteNode } = useFlow();

  return (
    <TooltipProvider>
      <div className={`
        relative group bg-card border-2 rounded-lg p-4 shadow-lg min-w-[200px]
        ${selected ? 'border-primary' : 'border-node-start'}
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
          <div className="p-2 bg-node-start/10 rounded-lg">
            <Play className="w-5 h-5 text-node-start" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Start Node</h3>
            <p className="text-xs text-muted-foreground">{String(data.channel || 'SMS')}</p>
          </div>
        </div>

        {/* Configuration Info */}
        <div className="space-y-2 mb-3">
          <div className="bg-accent/30 rounded p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Channel</span>
              <span className="text-xs text-muted-foreground">{String(data.channel || 'SMS')}</span>
            </div>
          </div>
          <div className="bg-accent/30 rounded p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">App ID</span>
              <span className="text-xs font-mono text-muted-foreground truncate max-w-20">
                {String(data.appId || 'HELO_001')}
              </span>
            </div>
          </div>
          <div className="bg-accent/30 rounded p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Business Unit</span>
              <span className="text-xs text-muted-foreground">{String(data.businessUnit || 'Marketing')}</span>
            </div>
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