import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Square, CheckCircle, XCircle, AlertTriangle, Clock, Trash2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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

  return (
    <TooltipProvider>
      <div className={`
        relative group bg-card border-2 rounded-lg p-4 shadow-lg min-w-[180px]
        ${selected ? 'border-primary' : `border-node-terminal-${state === 'sent' ? 'success' : state === 'dropped' ? 'error' : 'warning'}`}
        hover:shadow-xl transition-all duration-200
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

        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className={`p-2 ${config.bg} rounded-lg`}>
            <Icon className={`w-5 h-5 ${config.color}`} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">Terminal Node</h3>
            <p className="text-xs text-muted-foreground">Final State</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedNode(currentNode)}
            className="w-6 h-6 p-0"
          >
            <Settings className="w-3 h-3" />
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">State:</span>
            <Badge 
              variant="outline" 
              className={`text-xs ${config.color} border-current`}
            >
              {config.label}
            </Badge>
          </div>
          {data.reason && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Reason:</span>
              <span className="text-xs truncate max-w-20">{String(data.reason)}</span>
            </div>
          )}
        </div>

        {/* Handle */}
        <Handle
          type="target"
          position={Position.Left}
          className={`w-3 h-3 border-2 border-background ${
            state === 'sent' ? 'bg-node-terminal-success' :
            state === 'dropped' ? 'bg-node-terminal-error' :
            'bg-node-terminal-warning'
          }`}
        />

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="absolute inset-0 pointer-events-none" />
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm">
              <div className="font-medium">Terminal Node</div>
              <div className="text-muted-foreground">
                Final endpoint for routing flow with state: {config.label}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};