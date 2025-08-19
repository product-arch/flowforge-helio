import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { GitMerge, Trash2, Settings, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useFlow } from '@/contexts/FlowContext';

export const ConditionalNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const { deleteNode } = useFlow();
  const onConfigClick = data.onConfigClick as ((nodeId: string) => void) | undefined;

  const conditionCount = Array.isArray(data.conditions) ? data.conditions.length : 0;
  
  // Check if node has configuration
  const hasConfiguration = conditionCount > 0;

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

        {/* Config Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onConfigClick?.(id)}
          className="absolute -bottom-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
        >
          <Plus className="w-3 h-3" />
        </Button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className={`${hasConfiguration ? 'p-2' : 'p-1.5'} bg-primary/10 rounded-lg`}>
            <GitMerge className={`${hasConfiguration ? 'w-4 h-4' : 'w-3 h-3'} text-primary`} />
          </div>
          {hasConfiguration && (
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-primary truncate">Conditional</h3>
              <p className="text-xs text-muted-foreground truncate">
                {conditionCount} rule{conditionCount > 1 ? 's' : ''}
              </p>
            </div>
          )}
          {!hasConfiguration && (
            <div className="flex-1 text-center">
              <h3 className="font-medium text-xs text-primary">Conditional</h3>
            </div>
          )}
        </div>

        {/* Configuration Blocks - Only show when configured */}
        {hasConfiguration && (
          <div className="space-y-2 mb-3">
            <div className="bg-accent/30 rounded p-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Conditions</span>
                <Badge variant="default" className="text-xs">
                  {conditionCount} rules
                </Badge>
              </div>
            </div>
            
            <div className="bg-accent/30 rounded p-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Operator</span>
                <Badge variant="outline" className="text-xs">
                  {String(data.operator || 'AND')}
                </Badge>
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
        <Handle type="source" position={Position.Right} id="true" className="w-3 h-3 opacity-0" style={{ top: '40%' }} />
        <Handle type="source" position={Position.Right} id="false" className="w-3 h-3 opacity-0" style={{ top: '60%' }} />
        <Handle type="source" position={Position.Top} id="top-out" className="w-3 h-3 opacity-0" />
        <Handle type="source" position={Position.Bottom} id="bottom-out" className="w-3 h-3 opacity-0" />

        {/* Labels for True/False outputs */}
        <div className="absolute right-4 top-1/2 transform translate-x-full text-xs text-muted-foreground">
          <div className="mb-1">True</div>
          <div>False</div>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="absolute inset-0 pointer-events-none" />
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm">
              <div className="font-medium">Conditional Node</div>
              <div className="text-muted-foreground">
                Create if-else logic with custom conditions
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};