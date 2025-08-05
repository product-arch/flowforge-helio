import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { GitBranch, Trash2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useFlow } from '@/contexts/FlowContext';

export const RoutingNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const { deleteNode, setSelectedNode, nodes } = useFlow();
  const currentNode = nodes.find(n => n.id === id);

  const vendorCount = Array.isArray(data.vendors) ? data.vendors.length : 0;
  const hasConfig = data.strategy && vendorCount > 0;

  return (
    <TooltipProvider>
      <div className={`
        relative group bg-card border-2 rounded-lg p-4 shadow-lg min-w-[220px]
        ${selected ? 'border-primary' : 'border-node-routing'}
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
          <div className="p-2 bg-node-routing/10 rounded-lg">
            <GitBranch className="w-5 h-5 text-node-routing" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">Routing Node</h3>
            <p className="text-xs text-muted-foreground">Vendor Selection</p>
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
            hasConfig ? 'bg-status-success' : 'bg-status-warning'
          }`} />
          <span className="text-xs text-muted-foreground">
            {hasConfig ? 'Configured' : 'Needs Configuration'}
          </span>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Strategy:</span>
            <Badge variant={data.strategy ? "default" : "secondary"} className="text-xs">
              {String(data.strategy || 'Not Set')}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Vendors:</span>
            <Badge variant={vendorCount > 0 ? "default" : "secondary"} className="text-xs">
              {vendorCount} vendors
            </Badge>
          </div>
          {data.fallbackEnabled && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Fallback:</span>
              <Badge variant="outline" className="text-xs text-status-success">
                Enabled
              </Badge>
            </div>
          )}
        </div>

        {/* Handles */}
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-node-routing border-2 border-background"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-node-routing border-2 border-background"
        />

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="absolute inset-0 pointer-events-none" />
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm">
              <div className="font-medium">Routing Node</div>
              <div className="text-muted-foreground">
                Configure vendor selection strategy and routing logic
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};