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
            <p className="text-xs text-muted-foreground">{String(data.strategy || 'weightedSplit')}</p>
          </div>
        </div>

        {/* Configuration Info */}
        <div className="space-y-2 mb-3">
          <div className="bg-accent/30 rounded p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Strategy</span>
              <span className="text-xs text-muted-foreground capitalize">
                {String(data.strategy || 'weightedSplit')}
              </span>
            </div>
          </div>

          <div className="bg-accent/30 rounded p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Vendors</span>
              <span className="text-xs text-muted-foreground">
                {(Array.isArray(data.vendors) ? data.vendors.length : 0)} configured
              </span>
            </div>
            {Array.isArray(data.vendors) && data.vendors.slice(0, 2).map((vendor: any, index: number) => (
              <div key={index} className="flex items-center justify-between mt-1">
                <span className="text-xs truncate max-w-16">{vendor.name}</span>
                <span className="text-xs text-muted-foreground">{vendor.weight}%</span>
              </div>
            ))}
          </div>

          {data.fallbackEnabled && (
            <div className="bg-green-50 border border-green-200 rounded p-1">
              <span className="text-xs text-green-700 font-medium">✓ Fallback Enabled</span>
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