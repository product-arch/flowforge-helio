import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { MessageSquare, Phone, Trash2, CheckCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFlow } from '@/contexts/FlowContext';
import { VendorRoutingSubBlock } from '../VendorRoutingSubBlock';

const VENDORS = [
  { id: 'twilio', name: 'Twilio', logo: '🔴', type: 'sms' },
  { id: 'textlocal', name: 'TextLocal', logo: '🟢', type: 'sms' },
  { id: 'msg91', name: 'MSG91', logo: '🔵', type: 'sms' },
];

interface FallbackConfig {
  channel: string;
  vendors: string[];
}

export const SMSNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const { deleteNode } = useFlow();
  const onConfigClick = data.onConfigClick as ((nodeId: string) => void) | undefined;
  
  const senderId = (data.senderId as string) || '';
  const messageType = (data.messageType as string) || 'transactional';
  const encoding = (data.encoding as string) || 'utf8';
  const selectedVendors = (data.selectedVendors as string[]) || [];
  const fallback = data.fallback as FallbackConfig | undefined;
  const routingConfig = data.routingConfig;
  
  // Check if node has any configuration
  const hasConfiguration = selectedVendors.length > 0 || senderId;

  const messageTypeColors = {
    transactional: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    promotional: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    utility: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    authentication: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
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
          className="absolute -top-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
          <MessageSquare className={`${hasConfiguration ? 'w-4 h-4' : 'w-3 h-3'} text-primary`} />
        </div>
        {hasConfiguration && (
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate text-primary">SMS Channel</div>
            <div className="text-xs text-muted-foreground truncate">
              {senderId}
            </div>
          </div>
        )}
        {!hasConfiguration && (
          <div className="flex-1 text-center">
            <h3 className="font-medium text-xs text-primary">SMS</h3>
          </div>
        )}
      </div>

      {/* Configuration Details - Only show when configured */}
      {hasConfiguration && (
        <div className="space-y-2 mb-3">
          {Array.isArray(selectedVendors) && selectedVendors.length > 0 && (
            <div className="bg-accent/30 rounded p-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Vendors</span>
                <span className="text-xs text-muted-foreground">
                  {selectedVendors.length} selected</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedVendors.slice(0, 3).map((vendorId: string) => {
                  const vendor = VENDORS.find(v => v.id === vendorId);
                  return vendor ? (
                    <span key={vendorId} className="text-xs bg-primary/10 px-1 py-0.5 rounded">
                      {vendor.logo} {vendor.name}
                    </span>
                  ) : null;
                })}
                {selectedVendors.length > 3 && (
                  <span className="text-xs text-muted-foreground">+{selectedVendors.length - 3}</span>
                )}
              </div>
            </div>
          )}

          {/* Message Type Block */}
          <div className="bg-accent/30 rounded p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Type</span>
              <Badge 
                variant="secondary"
                className={`text-xs ${messageTypeColors[messageType as keyof typeof messageTypeColors]}`}
              >
                {messageType}
              </Badge>
            </div>
          </div>

          {fallback && fallback.channel && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-1">
              <span className="text-xs text-blue-700 dark:text-blue-400 font-medium">
                ↻ Fallback: {fallback.channel.toUpperCase()}
              </span>
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

      {/* Vendor Routing Sub-Block */}
      {hasConfiguration && (
        <VendorRoutingSubBlock
          vendors={VENDORS}
          selectedVendors={selectedVendors}
          routingConfig={routingConfig}
          onConfigChange={(config) => {
            // This would be handled by the parent flow context
            console.log('Routing config changed:', config);
          }}
        />
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