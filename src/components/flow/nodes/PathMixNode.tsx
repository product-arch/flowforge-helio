import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { GitBranch, Trash2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFlow } from '@/contexts/FlowContext';
import { handleClasses } from '@/styles/nodeClasses';

export const PathMixNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const { deleteNode } = useFlow();
  const onConfigClick = data.onConfigClick as ((nodeId: string) => void) | undefined;

  // Check if node has configuration
  const hasConfiguration = data.operation || data.strategy || data.mergeStrategy || data.outputs || data.maxInputs;

  const getOperationLabel = () => {
    if (data.operation === 'diverge') return 'Diverge';
    if (data.operation === 'converge') return 'Converge';
    if (data.operation === 'both') return 'Path Mix';
    return 'Path Mix';
  };

  const getSubLabel = () => {
    if (data.operation === 'diverge') {
      return data.strategy || 'Split paths';
    }
    if (data.operation === 'converge') {
      return data.strategy || 'Merge paths';
    }
    return data.strategy || 'Mix paths';
  };

  // Dynamic handle generation based on configuration
  const renderHandles = () => {
    const handles = [];
    const operation = data.operation || 'both';
    
    if (operation === 'diverge' || operation === 'both') {
      // Input handles for diverge
      handles.push(
        <Handle 
          key="input-left"
          type="target" 
          position={Position.Left} 
          id="input" 
          className={handleClasses.connectionDot}
          style={{ left: -4, top: '50%', transform: 'translateY(-50%)' }}
        />,
        <Handle 
          key="input-top"
          type="target" 
          position={Position.Top} 
          id="top-in" 
          className={handleClasses.connectionDot}
          style={{ top: -4, left: '50%', transform: 'translateX(-50%)' }}
        />
      );

      // Multiple output handles for diverge
      const outputCount = Number(data.outputs) || 3;
      for (let i = 1; i <= Math.min(outputCount, 4); i++) {
        const topPosition = (30 + (i - 1) * 20) + '%';
        handles.push(
          <Handle 
            key={`output-${i}`}
            type="source" 
            position={Position.Right} 
            id={`output${i}`} 
            className={handleClasses.connectionDot}
            style={{ right: -4, top: topPosition, transform: 'translateY(-50%)' }}
          />
        );
      }
    }
    
    if (operation === 'converge' || operation === 'both') {
      // Multiple input handles for converge
      const inputCount = Number(data.maxInputs) || 3;
      for (let i = 1; i <= Math.min(inputCount, 4); i++) {
        const topPosition = (30 + (i - 1) * 20) + '%';
        handles.push(
          <Handle 
            key={`input-${i}`}
            type="target" 
            position={Position.Left} 
            id={`input${i}`} 
            className={handleClasses.connectionDot}
            style={{ left: -4, top: topPosition, transform: 'translateY(-50%)' }}
          />
        );
      }

      // Output handle for converge
      handles.push(
        <Handle 
          key="output-right"
          type="source" 
          position={Position.Right} 
          id="output" 
          className={handleClasses.connectionDot}
          style={{ right: -4, top: '50%', transform: 'translateY(-50%)' }}
        />
      );
    }

    // Common bottom handles
    handles.push(
      <Handle 
        key="bottom-in"
        type="target" 
        position={Position.Bottom} 
        id="bottom-in" 
        className={handleClasses.connectionDot}
        style={{ bottom: -4, left: '30%', transform: 'translateX(-50%)' }}
      />,
      <Handle 
        key="bottom-out"
        type="source" 
        position={Position.Bottom} 
        id="bottom-out" 
        className={handleClasses.connectionDot}
        style={{ bottom: -4, left: '70%', transform: 'translateX(-50%)' }}
      />
    );

    return handles;
  };

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
          <GitBranch className={`${hasConfiguration ? 'w-4 h-4' : 'w-3 h-3'} text-primary`} />
        </div>
        {hasConfiguration && (
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate text-primary">{getOperationLabel()}</div>
            <div className="text-xs text-muted-foreground truncate">
              {String(getSubLabel())}
            </div>
          </div>
        )}
        {!hasConfiguration && (
          <div className="flex-1 text-center">
            <h3 className="font-medium text-xs text-primary">Path Mix</h3>
          </div>
        )}
      </div>

      {/* Configuration Details - Only show when configured */}
      {hasConfiguration && (
        <div className="space-y-2 mb-3">
          {data.operation && (
            <div className="bg-accent/30 rounded p-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Operation</span>
                <span className="text-xs text-muted-foreground truncate max-w-20">
                  {String(data.operation)}
                </span>
              </div>
            </div>
          )}

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

          {data.mergeStrategy && (
            <div className="bg-accent/30 rounded p-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Merge</span>
                <span className="text-xs text-muted-foreground truncate max-w-20">
                  {String(data.mergeStrategy).replace('_', ' ')}
                </span>
              </div>
            </div>
          )}

          {data.timeout && (
            <div className="bg-accent/30 rounded p-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Timeout</span>
                <span className="text-xs text-muted-foreground">
                  {String(data.timeout)}s
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

      {/* Dynamic Connection Handles */}
      {renderHandles() as React.ReactNode}
    </div>
  );
};