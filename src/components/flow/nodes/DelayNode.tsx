import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Clock, Trash2, Timer, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFlow } from '@/contexts/FlowContext';
import { handleClasses } from '@/styles/nodeClasses';

interface DelayNodeProps {
  id: string;
  data: {
    label: string;
    duration: number;
    unit: 'ms' | 's' | 'm' | 'h';
    onConfigClick?: (nodeId: string) => void;
  };
  selected?: boolean;
}

export const DelayNode: React.FC<DelayNodeProps> = ({ id, data, selected }) => {
  const { deleteNode } = useFlow();
  const onConfigClick = data.onConfigClick as ((nodeId: string) => void) | undefined;

  const formatDuration = () => {
    const { duration, unit } = data;
    if (!duration) return 'No delay';
    
    const unitLabels = { ms: 'ms', s: 'sec', m: 'min', h: 'hr' };
    return `${duration}${unitLabels[unit] || 's'}`;
  };

  // Check if node has configuration
  const hasConfiguration = data.duration && data.unit;

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
        <Trash2 className="h-3 w-3" />
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

      {/* Node Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className={`${hasConfiguration ? 'p-2' : 'p-1.5'} bg-primary/10 rounded-lg`}>
          <Clock className={`${hasConfiguration ? 'w-4 h-4' : 'w-3 h-3'} text-primary`} />
        </div>
        {hasConfiguration && (
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-primary truncate">Delay</h3>
            <p className="text-xs text-muted-foreground truncate">
              {formatDuration()}
            </p>
          </div>
        )}
        {!hasConfiguration && (
          <div className="flex-1 text-center">
            <h3 className="font-medium text-xs text-primary">Delay</h3>
          </div>
        )}
      </div>

      {/* Configuration Blocks - Only show when configured */}
      {hasConfiguration && (
        <div className="space-y-2 mb-3">
          <div className="bg-accent/30 rounded p-2">
            <div className="flex items-center justify-center gap-2">
              <Timer className="w-4 h-4 text-primary animate-pulse" />
              <div className="text-lg font-mono font-bold text-primary">
                {formatDuration()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Unconfigured state notice */}
      {!hasConfiguration && (
        <div className="text-center mb-2">
          <span className="text-xs text-muted-foreground">Not configured</span>
        </div>
      )}

      {/* Visible Connection Handles for user guidance */}
      <Handle 
        type="target" 
        position={Position.Left} 
        id="left" 
        className={handleClasses.connectionDot}
        style={{ left: -4, top: '50%', transform: 'translateY(-50%)' }}
      />
      <Handle 
        type="target" 
        position={Position.Top} 
        id="top-in" 
        className={handleClasses.connectionDot}
        style={{ top: -4, left: '50%', transform: 'translateX(-50%)' }}
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        id="right" 
        className={handleClasses.connectionDot}
        style={{ right: -4, top: '50%', transform: 'translateY(-50%)' }}
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="bottom-out" 
        className={handleClasses.connectionDot}
        style={{ bottom: -4, left: '50%', transform: 'translateX(-50%)' }}
      />
    </div>
  );
};