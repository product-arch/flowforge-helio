import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Shuffle, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFlow } from '@/contexts/FlowContext';

interface SwitchNodeProps {
  id: string;
  data: {
    label: string;
    cases: Array<{
      condition: string;
      path: string;
    }>;
    defaultPath: string | null;
    onConfigClick?: (nodeId: string) => void;
  };
  selected?: boolean;
}

export const SwitchNode: React.FC<SwitchNodeProps> = ({ id, data, selected }) => {
  const { deleteNode } = useFlow();
  const onConfigClick = data.onConfigClick as ((nodeId: string) => void) | undefined;

  const casesCount = data.cases?.length || 0;
  const hasDefault = !!data.defaultPath;

  return (
    <div className={`
      relative bg-card border-2 rounded-lg p-3 min-w-[160px] transition-all duration-200
      ${selected ? 'border-primary shadow-lg' : 'border-node-switch shadow-sm'}
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

      {/* Config Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onConfigClick?.(id)}
        className="absolute -bottom-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
      >
        <Plus className="w-3 h-3" />
      </Button>

      {/* Node Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-md bg-node-switch/10">
          <Shuffle className="w-4 h-4 text-node-switch" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">Multi-Path Switch</div>
          <div className="text-xs text-muted-foreground">
            {casesCount} case{casesCount !== 1 ? 's' : ''} + {hasDefault ? 'default' : 'no default'}
          </div>
        </div>
      </div>

      {/* Cases Display */}
      <div className="space-y-1 mb-3">
        {data.cases?.slice(0, 3).map((caseItem, index) => (
          <div key={index} className="flex items-center justify-between bg-accent/30 rounded px-2 py-1">
            <span className="text-xs font-medium">Case {index + 1}</span>
            <div className="w-2 h-2 rounded-full bg-node-switch"></div>
          </div>
        ))}
        
        {casesCount > 3 && (
          <div className="text-xs text-muted-foreground text-center">
            +{casesCount - 3} more cases
          </div>
        )}

        {hasDefault && (
          <div className="flex items-center justify-between bg-accent/50 rounded px-2 py-1">
            <span className="text-xs font-medium">Default</span>
            <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
          </div>
        )}

        {casesCount === 0 && (
          <div className="text-xs text-muted-foreground text-center py-2">
            <Plus className="w-3 h-3 mx-auto mb-1" />
            Add switch cases
          </div>
        )}
      </div>

      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 border-2 border-node-switch bg-background"
      />
      
      {/* Multiple output handles for different cases */}
      {[...Array(Math.max(3, casesCount + (hasDefault ? 1 : 0)))].map((_, index) => (
        <Handle
          key={index}
          type="source"
          position={Position.Right}
          id={`case-${index}`}
          style={{ top: `${20 + (index * 15)}%` }}
          className="w-3 h-3 border-2 border-node-switch bg-background"
        />
      ))}
    </div>
  );
};