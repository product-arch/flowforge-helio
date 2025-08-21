import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Route, Trash2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFlow } from '@/contexts/FlowContext';

export const DivergeNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const { deleteNode } = useFlow();
  const onConfigClick = data.onConfigClick as ((nodeId: string) => void) | undefined;

  // Check if node has configuration
  const hasConfiguration = data.strategy || data.outputs || data.balanceType;

  return (
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
        className="absolute -top-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full"
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
        <Settings className="w-3 h-3" />
      </Button>

      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className={`${hasConfiguration ? 'p-1.5' : 'p-1'} rounded-md bg-primary/10`}>
          <Route className={`${hasConfiguration ? 'w-4 h-4' : 'w-3 h-3'} text-primary`} />
        </div>
        {hasConfiguration && (
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate text-primary">Diverge</div>
            <div className="text-xs text-muted-foreground truncate">
              {String(data.strategy || 'Split paths')}
            </div>
          </div>
        )}
        {!hasConfiguration && (
          <div className="flex-1 text-center">
            <h3 className="font-medium text-xs text-primary">Diverge</h3>
          </div>
        )}
      </div>

      {/* Configuration Details - Only show when configured */}
      {hasConfiguration && (
        <div className="space-y-2 mb-3">
          {data.strategy && (
            <div className="bg-accent/30 rounded p-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Strategy</span>
                <span className="text-xs text-muted-foreground truncate max-w-20">
                  {String(data.strategy)}
                </span>
              </div>
            </div>
          )}
          
          {data.outputs && (
            <div className="bg-accent/30 rounded p-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Outputs</span>
                <span className="text-xs text-muted-foreground">
                  {String(data.outputs)}
                </span>
              </div>
            </div>
          )}

          {data.balanceType && (
            <div className="bg-accent/30 rounded p-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Balance</span>
                <span className="text-xs text-muted-foreground truncate max-w-20">
                  {String(data.balanceType)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Unconfigured state notice */}
      {!hasConfiguration && (
        <div className="text-center mb-2">
          <span className="text-xs text-muted-foreground">Not configured</span>
        </div>
      )}

      {/* Single input handle */}
      <Handle type="target" position={Position.Left} id="input" className="w-3 h-3 opacity-0" />
      <Handle type="target" position={Position.Top} id="top-in" className="w-3 h-3 opacity-0" />
      <Handle type="target" position={Position.Bottom} id="bottom-in" className="w-3 h-3 opacity-0" />
      
      {/* Multiple output handles */}
      <Handle type="source" position={Position.Right} id="output1" className="w-3 h-3 opacity-0" style={{ top: '30%' }} />
      <Handle type="source" position={Position.Right} id="output2" className="w-3 h-3 opacity-0" style={{ top: '50%' }} />
      <Handle type="source" position={Position.Right} id="output3" className="w-3 h-3 opacity-0" style={{ top: '70%' }} />
      <Handle type="source" position={Position.Bottom} id="bottom-out" className="w-3 h-3 opacity-0" />
    </div>
  );
};