import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Bug, Trash2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFlow } from '@/contexts/FlowContext';

export const AuditNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const { deleteNode } = useFlow();
  const onConfigClick = data.onConfigClick as ((nodeId: string) => void) | undefined;

  const eventCount = Array.isArray(data.events) ? data.events.length : 0;
  const logLevel = String(data.logLevel || 'info');
  
  // Check if node has configuration
  const hasConfiguration = logLevel !== 'info' || eventCount > 0;

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
          <Bug className={`${hasConfiguration ? 'w-4 h-4' : 'w-3 h-3'} text-primary`} />
        </div>
        {hasConfiguration && (
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-primary truncate">Audit</h3>
            <p className="text-xs text-muted-foreground truncate">
              {logLevel.toUpperCase()} • {eventCount} events
            </p>
          </div>
        )}
        {!hasConfiguration && (
          <div className="flex-1 text-center">
            <h3 className="font-medium text-xs text-primary">Audit</h3>
          </div>
        )}
      </div>

      {/* Configuration Blocks - Only show when configured */}
      {hasConfiguration && (
        <div className="space-y-2 mb-3">
          <div className="bg-accent/30 rounded p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Log Level</span>
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  logLevel === 'error' ? 'text-red-600 border-red-600' :
                  logLevel === 'warn' ? 'text-yellow-600 border-yellow-600' :
                  'text-blue-600 border-blue-600'
                }`}
              >
                {logLevel.toUpperCase()}
              </Badge>
            </div>
          </div>

          <div className="bg-accent/30 rounded p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Events</span>
              <span className="text-xs text-muted-foreground">
                {eventCount} logged
              </span>
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