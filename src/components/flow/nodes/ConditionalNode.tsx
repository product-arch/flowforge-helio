import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { GitMerge, Trash2, Settings } from 'lucide-react';
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
  const { deleteNode, setSelectedNode, nodes } = useFlow();
  const currentNode = nodes.find(n => n.id === id);

  const conditionCount = Array.isArray(data.conditions) ? data.conditions.length : 0;
  const hasConditions = conditionCount > 0;

  return (
    <TooltipProvider>
      <div className={`
        relative group bg-card border-2 rounded-lg p-4 shadow-lg min-w-[200px]
        ${selected ? 'border-primary' : 'border-node-conditional'}
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
          <div className="p-2 bg-node-conditional/10 rounded-lg">
            <GitMerge className="w-5 h-5 text-node-conditional" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">Conditional Node</h3>
            <p className="text-xs text-muted-foreground">If-Else Logic</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedNode(currentNode)}
            className="w-6 h-6 p-0"
          >
            <Settings className="w-3 h-3" />
          </Button>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-2 h-2 rounded-full ${
            hasConditions ? 'bg-status-success' : 'bg-status-warning'
          }`} />
          <span className="text-xs text-muted-foreground">
            {hasConditions ? 'Configured' : 'No Conditions'}
          </span>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Conditions:</span>
            <Badge variant={hasConditions ? "default" : "secondary"} className="text-xs">
              {conditionCount} rules
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Operator:</span>
            <Badge variant="outline" className="text-xs">
              {String(data.operator || 'AND')}
            </Badge>
          </div>
        </div>

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