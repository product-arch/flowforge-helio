import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { CheckCircle, XCircle, AlertTriangle, Clock, Trash2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFlow } from '@/contexts/FlowContext';

const stateConfig = {
  sent: { icon: CheckCircle, color: 'text-status-success', bg: 'bg-status-success/10', label: 'Sent' },
  dropped: { icon: XCircle, color: 'text-status-error', bg: 'bg-status-error/10', label: 'Dropped' },
  alerted: { icon: AlertTriangle, color: 'text-status-warning', bg: 'bg-status-warning/10', label: 'Alerted' },
  queued: { icon: Clock, color: 'text-muted-foreground', bg: 'bg-muted/10', label: 'Queued' },
};

export const TerminalNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const { deleteNode, setSelectedNode, nodes } = useFlow();
  const currentNode = nodes.find(n => n.id === id);

  const state = data.state || 'sent';
  const config = stateConfig[state as keyof typeof stateConfig] || stateConfig.sent;
  const Icon = config.icon;

  // Check if node has any configuration
  const hasConfiguration = data.state || data.reason;

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
        className="absolute -top-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-destructive-foreground hover:bg-destructive/90"
      >
        <Trash2 className="w-3 h-3" />
      </Button>

      {/* Config Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setSelectedNode(currentNode)}
        className="absolute -bottom-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
      >
        <Settings className="w-3 h-3" />
      </Button>

      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className={`${hasConfiguration ? 'p-1.5' : 'p-1'} rounded-md ${config.bg}`}>
          <Icon className={`${hasConfiguration ? 'w-4 h-4' : 'w-3 h-3'} ${config.color}`} />
        </div>
        {hasConfiguration && (
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate text-primary">Terminal</div>
            <div className="text-xs text-muted-foreground truncate">
              {config.label}
            </div>
          </div>
        )}
        {!hasConfiguration && (
          <div className="flex-1 text-center">
            <h3 className="font-medium text-xs text-primary">Terminal</h3>
          </div>
        )}
      </div>

      {/* Configuration Details - Only show when configured */}
      {hasConfiguration && (
        <div className="space-y-2 mb-3">
          {/* State Block */}
          <div className="bg-accent/30 rounded p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">State</span>
              <Badge 
                variant="secondary"
                className={`text-xs ${config.color}`}
              >
                {config.label}
              </Badge>
            </div>
          </div>

          {data.reason && (
            <div className="bg-accent/30 rounded p-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Reason</span>
                <span className="text-xs text-muted-foreground truncate max-w-20">
                  {String(data.reason)}
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

      {/* Invisible Connection Handles for input only */}
      <Handle type="target" position={Position.Left} id="left" className="w-3 h-3 opacity-0" />
      <Handle type="target" position={Position.Top} id="top" className="w-3 h-3 opacity-0" />
      <Handle type="target" position={Position.Bottom} id="bottom" className="w-3 h-3 opacity-0" />
    </div>
  );
};