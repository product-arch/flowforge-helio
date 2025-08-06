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
  const displayText = criteriaCount > 0 
    ? `Filter: ${criteriaCount} rule${criteriaCount > 1 ? 's' : ''}`
    : 'Message Filter';

  return (
    <div className={`
      relative bg-card border-2 rounded-lg p-3 min-w-[140px] transition-all duration-200
      ${selected ? 'border-primary shadow-lg' : 'border-node-filter shadow-sm'}
      hover:shadow-md group
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
        <div className="p-1.5 rounded-md bg-node-filter/10">
          <Filter className="w-4 h-4 text-node-filter" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{displayText}</div>
          <div className="text-xs text-muted-foreground capitalize">
            Action: {data.action || 'allow'}
          </div>
        </div>
      </div>

      {/* Node Body - Configuration Blocks */}
      <div className="space-y-2">
        {criteriaCount > 0 && (
          <div className="text-xs text-muted-foreground">
            {data.criteria.slice(0, 2).map((criterion, index) => (
              <div key={index} className="flex items-center gap-1 bg-accent/50 rounded px-2 py-1 mb-1">
                <span className="font-medium">{criterion.field}</span>
                <span className="text-muted-foreground">{criterion.operator}</span>
                <span className="truncate max-w-12">{criterion.value}</span>
              </div>
            ))}
            {criteriaCount > 2 && (
              <div className="text-center text-muted-foreground">
                +{criteriaCount - 2} more
              </div>
            )}
          </div>
        )}
        
        {criteriaCount === 0 && (
          <div className="text-xs text-muted-foreground text-center py-2">
            <Plus className="w-3 h-3 mx-auto mb-1" />
            Add filter criteria
          </div>
        )}
      </div>

      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 border-2 border-node-filter bg-background"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 border-2 border-node-filter bg-background"
      />
    </div>
  );
};