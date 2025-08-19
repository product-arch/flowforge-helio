import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Shield, Trash2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useFlow } from '@/contexts/FlowContext';

export const ConstraintNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const { deleteNode, setSelectedNode, nodes } = useFlow();
  const currentNode = nodes.find(n => n.id === id);

  const hasConstraints = data.maxTPS || data.maxCost || data.timeWindow;

  return (
    <TooltipProvider>
      <div className={`
        relative group bg-card border-2 rounded-lg p-4 shadow-lg min-w-[200px]
        ${selected ? 'border-primary' : 'border-node-constraint'}
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
          <div className="p-2 bg-node-constraint/10 rounded-lg">
            <Shield className="w-5 h-5 text-node-constraint" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">Constraint Node</h3>
            <p className="text-xs text-muted-foreground">Rate & Cost Limits</p>
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
            hasConstraints ? 'bg-status-success' : 'bg-status-warning'
          }`} />
          <span className="text-xs text-muted-foreground">
            {hasConstraints ? 'Active Constraints' : 'No Constraints'}
          </span>
        </div>

        {/* Content */}
        <div className="space-y-2">
          {data.maxTPS && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Max TPS:</span>
              <Badge variant="outline" className="text-xs">
                {String(data.maxTPS)}
              </Badge>
            </div>
          )}
          {data.maxCost && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Max Cost:</span>
              <Badge variant="outline" className="text-xs">
                ₹{String(data.maxCost)}
              </Badge>
            </div>
          )}
          {data.timeWindow && typeof data.timeWindow === 'object' && data.timeWindow !== null && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Time Window:</span>
              <Badge variant="outline" className="text-xs">
                {String((data.timeWindow as any).start || '00:00')}-{String((data.timeWindow as any).end || '23:59')}
              </Badge>
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
              <div className="font-medium">Constraint Node</div>
              <div className="text-muted-foreground">
                Apply TPS, cost, and time-based limitations
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};