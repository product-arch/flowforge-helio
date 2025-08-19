import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Phone, Trash2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useFlow } from '@/contexts/FlowContext';

export const VoiceNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const { deleteNode } = useFlow();

  const callerId = (data.callerId as string) || '';
  const voiceType = (data.voiceType as string) || 'text-to-speech';
  const language = (data.language as string) || 'en';

  const voiceTypeColors = {
    'text-to-speech': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    'pre-recorded': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    'interactive': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
  };

  return (
    <TooltipProvider>
      <div className={`
        relative group bg-card border-2 rounded-lg p-3 shadow-lg min-w-[160px] max-w-[200px]
        ${selected ? 'border-primary shadow-primary/20' : 'border-primary/50'}
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
          <div className="p-2 bg-primary/10 rounded-lg">
            <Phone className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-primary truncate">Voice</h3>
            <p className="text-xs text-muted-foreground truncate">
              {callerId || 'No caller ID'}
            </p>
          </div>
        </div>

        {/* Configuration Blocks */}
        <div className="space-y-2 mb-3">
          <div className="bg-accent/30 rounded p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Type</span>
              <Badge className={`text-xs ${voiceTypeColors[voiceType as keyof typeof voiceTypeColors] || voiceTypeColors['text-to-speech']}`}>
                {(voiceType as string).replace('-', ' ')}
              </Badge>
            </div>
          </div>

          <div className="bg-accent/30 rounded p-2">
            <div className="flex items-center gap-2">
              <Phone className="w-3 h-3 text-primary" />
              <span className="text-xs font-medium">Caller ID</span>
              {callerId && <CheckCircle className="w-3 h-3 text-green-500" />}
            </div>
            <div className="text-xs text-muted-foreground mt-1 truncate">
              {callerId || 'Not configured'}
            </div>
          </div>

          <div className="bg-accent/30 rounded p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Language</span>
              <span className="text-xs text-muted-foreground uppercase">
                {language}
              </span>
            </div>
          </div>

          {!callerId && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-1">
              <span className="text-xs text-yellow-700 dark:text-yellow-400 font-medium">⚠ Configure caller ID</span>
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
              <div className="font-medium">Voice Channel</div>
              <div className="text-muted-foreground">
                Make voice calls with caller ID and language settings
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};