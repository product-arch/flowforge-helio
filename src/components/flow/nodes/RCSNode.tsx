import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Radio, Trash2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useFlow } from '@/contexts/FlowContext';

export const RCSNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const { deleteNode } = useFlow();

  const botName = (data.botName as string) || '';
  const agentId = (data.agentId as string) || '';
  const messageType = (data.messageType as string) || 'text';

  const messageTypeColors = {
    text: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    rich: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    media: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    interactive: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
  };

  return (
    <TooltipProvider>
      <div className={`
        relative group bg-card border-2 rounded-lg p-3 shadow-lg min-w-[160px] max-w-[200px]
        ${selected ? 'border-primary' : 'border-node-rcs'}
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
          <div className="p-2 bg-node-rcs/10 rounded-lg">
            <Radio className="w-4 h-4 text-node-rcs" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">RCS</h3>
            <p className="text-xs text-muted-foreground truncate">
              {botName || 'No bot name'}
            </p>
          </div>
        </div>

        {/* Configuration Blocks */}
        <div className="space-y-2 mb-3">
          <div className="bg-accent/30 rounded p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Type</span>
              <Badge className={`text-xs ${messageTypeColors[messageType as keyof typeof messageTypeColors] || messageTypeColors.text}`}>
                {messageType}
              </Badge>
            </div>
          </div>

          <div className="bg-accent/30 rounded p-2">
            <div className="flex items-center gap-2">
              <Radio className="w-3 h-3 text-node-rcs" />
              <span className="text-xs font-medium">Bot Name</span>
              {botName && <CheckCircle className="w-3 h-3 text-green-500" />}
            </div>
            <div className="text-xs text-muted-foreground mt-1 truncate">
              {botName || 'Not configured'}
            </div>
          </div>

          <div className="bg-accent/30 rounded p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Agent ID</span>
              <span className="text-xs text-muted-foreground truncate max-w-16">
                {agentId || 'None'}
              </span>
            </div>
          </div>

          {!botName && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-1">
              <span className="text-xs text-yellow-700 dark:text-yellow-400 font-medium">⚠ Configure bot name</span>
            </div>
          )}
        </div>

        {/* Connection Handles */}
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-node-rcs border-2 border-background"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-node-rcs border-2 border-background"
        />

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="absolute inset-0 pointer-events-none" />
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm">
              <div className="font-medium">RCS Channel</div>
              <div className="text-muted-foreground">
                Send rich communication services messages with bot configuration
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};