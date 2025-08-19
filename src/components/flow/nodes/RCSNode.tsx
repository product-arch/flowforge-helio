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
  
  // Check if node has any configuration
  const hasConfiguration = botName;

  const messageTypeColors = {
    text: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    rich: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    media: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    interactive: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
  };

  return (
    <TooltipProvider>
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

        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className={`${hasConfiguration ? 'p-2' : 'p-1.5'} bg-primary/10 rounded-lg`}>
            <Radio className={`${hasConfiguration ? 'w-4 h-4' : 'w-3 h-3'} text-primary`} />
          </div>
          {hasConfiguration && (
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-primary truncate">RCS</h3>
              <p className="text-xs text-muted-foreground truncate">
                {botName}
              </p>
            </div>
          )}
          {!hasConfiguration && (
            <div className="flex-1 text-center">
              <h3 className="font-medium text-xs text-primary">RCS</h3>
            </div>
          )}
        </div>

        {/* Configuration Blocks - Only show when configured */}
        {hasConfiguration && (
          <div className="space-y-2 mb-3">
            <div className="bg-accent/30 rounded p-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Type</span>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${messageTypeColors[messageType as keyof typeof messageTypeColors] || messageTypeColors.text}`}
                >
                  {messageType}
                </Badge>
              </div>
            </div>

            <div className="bg-accent/30 rounded p-2">
              <div className="flex items-center gap-2">
                <Radio className="w-3 h-3 text-primary" />
                <span className="text-xs font-medium">Bot Name</span>
                <CheckCircle className="w-3 h-3 text-green-500" />
              </div>
              <div className="text-xs text-muted-foreground mt-1 truncate">
                {botName}
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