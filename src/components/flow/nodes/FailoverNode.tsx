import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Shield, Trash2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFlow } from '@/contexts/FlowContext';

export const FailoverNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const { deleteNode, getConnectedChannelNode } = useFlow();
  const onConfigClick = data.onConfigClick as ((nodeId: string) => void) | undefined;
  
  const connectedChannel = getConnectedChannelNode(id);
  const hasChannelConnection = !!connectedChannel;
  const hasVendorsConfigured = connectedChannel && connectedChannel.data.selectedVendors && 
    (connectedChannel.data.selectedVendors as string[]).length > 0;

  const primaryVendor = data.primaryVendor;
  const backupVendors = (data.backupVendors as string[]) || [];
  const hasConfiguration = primaryVendor && backupVendors.length > 0;

  const getDisplayMessage = () => {
    if (!hasChannelConnection) {
      return 'Attach to a channel block';
    }
    if (!hasVendorsConfigured) {
      return 'Configure vendors in the channel block first';
    }
    return null;
  };

  const displayMessage = getDisplayMessage();
  const isConfigEnabled = hasChannelConnection && hasVendorsConfigured;

  return (
    <div className={`
      relative group bg-card border-2 rounded-lg shadow-lg transition-all duration-200
      ${selected ? 'border-primary shadow-primary/20' : 'border-primary/50'}
      hover:shadow-xl p-3 min-w-[180px] max-w-[220px]
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
        onClick={() => isConfigEnabled && onConfigClick?.(id)}
        disabled={!isConfigEnabled}
        className={`absolute -bottom-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full ${
          isConfigEnabled 
            ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
            : 'bg-muted text-muted-foreground cursor-not-allowed'
        }`}
      >
        <Settings className="w-3 h-3" />
      </Button>

      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-md" style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)' }}>
          <Shield className="w-4 h-4" style={{ color: 'rgb(168, 85, 247)' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate text-primary">Failover</div>
          {connectedChannel && (
            <div className="text-xs text-muted-foreground truncate">
              {(connectedChannel.data.label as string) || connectedChannel.type.toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* Display Message or Configuration */}
      {displayMessage ? (
        <div className="text-center py-2">
          <span className="text-xs text-muted-foreground italic">{displayMessage}</span>
        </div>
      ) : hasConfiguration ? (
        <div className="space-y-2">
          <div className="bg-accent/30 rounded p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Primary</span>
              <span className="text-xs text-muted-foreground">
                1 vendor
              </span>
            </div>
          </div>
          
          <div className="bg-accent/30 rounded p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Backups</span>
              <span className="text-xs text-muted-foreground">
                {backupVendors.length} vendors
              </span>
            </div>
          </div>

          <div className="bg-status-warning/10 rounded p-1">
            <span className="text-xs text-status-warning font-medium">
              ⚡ Criteria: {(data.failoverCriteria as string) || 'response_time'}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center py-2">
          <span className="text-xs text-muted-foreground">Ready to configure</span>
        </div>
      )}

      {/* Connection Handles */}
      <Handle type="target" position={Position.Left} id="left" className="w-3 h-3 opacity-0" />
      <Handle type="target" position={Position.Top} id="top-in" className="w-3 h-3 opacity-0" />
      <Handle type="target" position={Position.Bottom} id="bottom-in" className="w-3 h-3 opacity-0" />
      <Handle type="source" position={Position.Right} id="right" className="w-3 h-3 opacity-0" />
      <Handle type="source" position={Position.Top} id="top-out" className="w-3 h-3 opacity-0" />
      <Handle type="source" position={Position.Bottom} id="bottom-out" className="w-3 h-3 opacity-0" />
    </div>
  );
};