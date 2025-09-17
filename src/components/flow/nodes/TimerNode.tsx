import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Clock, Trash2, Settings, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFlow } from '@/contexts/FlowContext';
import { handleClasses } from '@/styles/nodeClasses';

export const TimerNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const { deleteNode } = useFlow();
  const onConfigClick = data.onConfigClick as ((nodeId: string) => void) | undefined;

  const formatDuration = () => {
    const { duration, timeUnit } = data;
    if (!duration) return 'No timer';
    
    const unitLabels: Record<string, string> = { 
      milliseconds: 'ms', 
      seconds: 'sec', 
      minutes: 'min', 
      hours: 'hr',
      days: 'days'
    };
    return `${duration}${unitLabels[String(timeUnit)] || 's'}`;
  };

  // Check if node has configuration
  const hasConfiguration = data.duration && data.timeUnit;

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
          <Clock className={`${hasConfiguration ? 'w-4 h-4' : 'w-3 h-3'} text-primary`} />
        </div>
        {hasConfiguration && (
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate text-primary">
              {data.timerType === 'simple_delay' ? 'Delay' : 'Timer'}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {formatDuration()}
            </div>
          </div>
        )}
        {!hasConfiguration && (
          <div className="flex-1 text-center">
            <h3 className="font-medium text-xs text-primary">Timer</h3>
          </div>
        )}
      </div>

      {/* Configuration Details - Only show when configured */}
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

          {data.timerType && (
            <div className="bg-accent/30 rounded p-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Type</span>
                <span className="text-xs text-muted-foreground truncate max-w-20">
                  {String(data.timerType)}
                </span>
              </div>
            </div>
          )}

          {data.mode && (
            <div className="bg-accent/30 rounded p-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Mode</span>
                <span className="text-xs text-muted-foreground truncate max-w-20">
                  {String(data.mode)}
                </span>
              </div>
            </div>
          )}

          {data.timerType === 'recurring' && data.repeatCount && (
            <div className="bg-accent/30 rounded p-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Repeat</span>
                <span className="text-xs text-muted-foreground">
                  {data.repeatCount === -1 ? 'Forever' : String(data.repeatCount)}
                </span>
              </div>
            </div>
          )}

          {data.timerType === 'scheduled' && data.scheduleExpression && (
            <div className="bg-accent/30 rounded p-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Schedule</span>
                <span className="text-xs text-muted-foreground truncate max-w-20">
                  {String(data.scheduleExpression)}
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

      {/* Connection Handles */}
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