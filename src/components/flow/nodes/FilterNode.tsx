import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Filter, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFlow } from '@/contexts/FlowContext';

interface FilterNodeProps {
  id: string;
  data: {
    label: string;
    criteria: Array<{
      field: string;
      operator: string;
      value: string;
    }>;
    action: 'allow' | 'block';
  };
  selected?: boolean;
}

export const FilterNode: React.FC<FilterNodeProps> = ({ id, data, selected }) => {
  const { deleteNode } = useFlow();

  const criteriaCount = data.criteria?.length || 0;
  
  // Check if node has configuration
  const hasConfiguration = criteriaCount > 0;

  return (
    <div className={`
      relative bg-card border-2 rounded-lg shadow-lg transition-all duration-200 group
      ${selected ? 'border-primary shadow-primary/20' : 'border-primary/50'}
      hover:shadow-xl
      ${hasConfiguration ? 'p-3 min-w-[160px] max-w-[200px]' : 'p-2 w-[120px]'}
    `}>
      {/* Delete Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => deleteNode(id)}
        className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full"
      >
        <X className="h-3 w-3" />
      </Button>

      {/* Node Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className={`${hasConfiguration ? 'p-2' : 'p-1.5'} bg-primary/10 rounded-lg`}>
          <Filter className={`${hasConfiguration ? 'w-4 h-4' : 'w-3 h-3'} text-primary`} />
        </div>
        {hasConfiguration && (
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-primary truncate">Filter</h3>
            <p className="text-xs text-muted-foreground truncate">
              {criteriaCount} rule{criteriaCount > 1 ? 's' : ''}
            </p>
          </div>
        )}
        {!hasConfiguration && (
          <div className="flex-1 text-center">
            <h3 className="font-medium text-xs text-primary">Filter</h3>
          </div>
        )}
      </div>

      {/* Configuration Blocks - Only show when configured */}
      {hasConfiguration && (
        <div className="space-y-2 mb-3">
          <div className="bg-accent/30 rounded p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Action</span>
              <span className="text-xs text-muted-foreground capitalize">
                {data.action || 'allow'}
              </span>
            </div>
          </div>

          <div className="bg-accent/30 rounded p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Rules</span>
              <span className="text-xs text-muted-foreground">
                {criteriaCount} configured
              </span>
            </div>
            {data.criteria.slice(0, 2).map((criterion, index) => (
              <div key={index} className="flex items-center gap-1 mt-1 text-xs">
                <span className="font-medium truncate max-w-12">{criterion.field}</span>
                <span className="text-muted-foreground">{criterion.operator}</span>
                <span className="truncate max-w-12">{criterion.value}</span>
              </div>
            ))}
            {criteriaCount > 2 && (
              <div className="text-center text-muted-foreground text-xs mt-1">
                +{criteriaCount - 2} more
              </div>
            )}
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
    </div>
  );
};