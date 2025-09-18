import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { CheckCircle, XCircle, AlertTriangle, Clock, Trash2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFlow } from '@/contexts/FlowContext';

const stateConfig = {
  sent: { icon: CheckCircle, iconColor: 'text-green-600', backgroundColor: 'bg-green-50 dark:bg-green-900/20', label: 'Sent' },
  dropped: { icon: XCircle, iconColor: 'text-red-600', backgroundColor: 'bg-red-50 dark:bg-red-900/20', label: 'Dropped' },
  alerted: { icon: AlertTriangle, iconColor: 'text-yellow-600', backgroundColor: 'bg-yellow-50 dark:bg-yellow-900/20', label: 'Alerted' },
  queued: { icon: Clock, iconColor: 'text-gray-600', backgroundColor: 'bg-gray-50 dark:bg-gray-900/20', label: 'Queued' },
};

export const TerminalNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const { deleteNode, setSelectedNode, nodes } = useFlow();
  const currentNode = nodes.find(n => n.id === id);

  const state = data.state || 'sent';
  const config = stateConfig[state as keyof typeof stateConfig] || stateConfig.sent;
  const Icon = config.icon;

  // Check if node has any configuration
  const hasConfiguration = data.state || data.reason;

  const onConfigClick = data.onConfigClick as ((nodeId: string) => void) | undefined;
  const reason = data.reason as string | undefined;

  return (
    <div className={`
      relative group bg-card border rounded-lg p-2 w-[80px] transition-all duration-200
      ${selected ? 'border-primary shadow-sm' : 'border-border hover:border-border/60'}
    `}>
      {/* Delete Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => deleteNode(id)}
        className="absolute -top-1 -right-1 w-4 h-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full text-xs"
      >
        <Trash2 className="w-2 h-2" />
      </Button>

      {/* Config Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onConfigClick?.(id)}
        className="absolute -bottom-1 -right-1 w-4 h-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground hover:bg-primary/90 rounded-full text-xs"
      >
        <Settings className="w-2 h-2" />
      </Button>

      {/* Content */}
      <div className="flex flex-col items-center gap-1">
        <div className={`rounded p-0.5 flex items-center justify-center ${config.backgroundColor}`}>
          <Icon className={`w-2.5 h-2.5 ${config.iconColor}`} />
        </div>
        <span className="text-[10px] font-medium text-foreground">{config.label}</span>
        {reason && (
          <span className="text-[9px] text-muted-foreground truncate max-w-full">{reason}</span>
        )}
      </div>

      {/* Connection Handles - only input */}
      <Handle 
        type="target" 
        position={Position.Left} 
        id="left-in" 
        className="w-1.5 h-1.5 bg-primary border border-background rounded-full opacity-40 hover:opacity-100 hover:scale-110 transition-all duration-200"
        style={{ left: -3, top: '50%', transform: 'translateY(-50%)' }}
      />
      <Handle 
        type="target" 
        position={Position.Top} 
        id="top-in" 
        className="w-1.5 h-1.5 bg-primary border border-background rounded-full opacity-40 hover:opacity-100 hover:scale-110 transition-all duration-200"
        style={{ top: -3, left: '50%', transform: 'translateX(-50%)' }}
      />
      <Handle 
        type="target" 
        position={Position.Bottom} 
        id="bottom-in" 
        className="w-1.5 h-1.5 bg-primary border border-background rounded-full opacity-40 hover:opacity-100 hover:scale-110 transition-all duration-200"
        style={{ bottom: -3, left: '50%', transform: 'translateX(-50%)' }}
      />
    </div>
  );
};