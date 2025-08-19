import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Mail, Trash2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useFlow } from '@/contexts/FlowContext';

export const EmailNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const { deleteNode } = useFlow();

  const fromAddress = (data.fromAddress as string) || '';
  const messageType = (data.messageType as string) || 'transactional';
  const template = (data.template as string) || '';

  const messageTypeColors = {
    transactional: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    promotional: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    utility: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    authentication: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    service: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
  };

  return (
    <TooltipProvider>
      <div className={`
        relative group bg-card border-2 rounded-lg p-3 shadow-lg min-w-[160px] max-w-[200px]
        ${selected ? 'border-primary' : 'border-node-email'}
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
          <div className="p-2 bg-node-email/10 rounded-lg">
            <Mail className="w-4 h-4 text-node-email" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">Email</h3>
            <p className="text-xs text-muted-foreground truncate">
              {fromAddress || 'No sender set'}
            </p>
          </div>
        </div>

        {/* Configuration Blocks */}
        <div className="space-y-2 mb-3">
          <div className="bg-accent/30 rounded p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Type</span>
              <Badge className={`text-xs ${messageTypeColors[messageType as keyof typeof messageTypeColors] || messageTypeColors.transactional}`}>
                {messageType}
              </Badge>
            </div>
          </div>

          <div className="bg-accent/30 rounded p-2">
            <div className="flex items-center gap-2">
              <Mail className="w-3 h-3 text-node-email" />
              <span className="text-xs font-medium">From Address</span>
              {fromAddress && <CheckCircle className="w-3 h-3 text-green-500" />}
            </div>
            <div className="text-xs text-muted-foreground mt-1 truncate">
              {fromAddress || 'Not configured'}
            </div>
          </div>

          <div className="bg-accent/30 rounded p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Template</span>
              <span className="text-xs text-muted-foreground truncate max-w-16">
                {template || 'None'}
              </span>
            </div>
          </div>

          {!fromAddress && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-1">
              <span className="text-xs text-yellow-700 dark:text-yellow-400 font-medium">⚠ Configure sender</span>
            </div>
          )}
        </div>

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
              <div className="font-medium">Email Channel</div>
              <div className="text-muted-foreground">
                Send emails with sender address and template configuration
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};