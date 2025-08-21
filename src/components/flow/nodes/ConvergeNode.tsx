import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Split, Trash2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFlow } from '@/contexts/FlowContext';

export const ConvergeNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const { deleteNode } = useFlow();
  const onConfigClick = data.onConfigClick as ((nodeId: string) => void) | undefined;

  // Check if node has configuration
  const hasConfiguration = data.strategy || data.timeout || data.maxInputs;

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
          <Split className={`${hasConfiguration ? 'w-4 h-4' : 'w-3 h-3'} text-primary rotate-180`} />
        </div>
        {hasConfiguration && (
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate text-primary">Converge</div>
            <div className="text-xs text-muted-foreground truncate">
              {String(data.strategy || 'Merge paths')}
            </div>
          </div>
        )}
        {!hasConfiguration && (
          <div className="flex-1 text-center">
            <h3 className="font-medium text-xs text-primary">Converge</h3>
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
          
          {data.maxInputs && (
            <div className="bg-accent/30 rounded p-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Max Inputs</span>
                <span className="text-xs text-muted-foreground">
                  {String(data.maxInputs)}
                </span>
              </div>
            </div>
          )}

          {data.timeout && (
            <div className="bg-accent/30 rounded p-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Timeout</span>
                <span className="text-xs text-muted-foreground">
                  {String(data.timeout)}ms
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

      {/* Multiple input handles */}
      <Handle type="target" position={Position.Left} id="input1" className="w-3 h-3 opacity-0" style={{ top: '30%' }} />
      <Handle type="target" position={Position.Left} id="input2" className="w-3 h-3 opacity-0" style={{ top: '50%' }} />
      <Handle type="target" position={Position.Left} id="input3" className="w-3 h-3 opacity-0" style={{ top: '70%' }} />
      <Handle type="target" position={Position.Top} id="top-in" className="w-3 h-3 opacity-0" />
      <Handle type="target" position={Position.Bottom} id="bottom-in" className="w-3 h-3 opacity-0" />
      
      {/* Single output handle */}
      <Handle type="source" position={Position.Right} id="output" className="w-3 h-3 opacity-0" />
    </div>
  );
};