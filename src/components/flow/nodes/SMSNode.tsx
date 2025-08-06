import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { MessageSquare, X, Phone, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFlow } from '@/contexts/FlowContext';

interface SMSNodeProps {
  id: string;
  data: {
    label: string;
    senderId: string;
    messageType: 'transactional' | 'promotional' | 'utility' | 'authentication';
    encoding: 'utf8' | 'unicode';
  };
  selected?: boolean;
}

export const SMSNode: React.FC<SMSNodeProps> = ({ id, data, selected }) => {
  const { deleteNode } = useFlow();

  const messageTypeColors = {
    transactional: 'bg-green-100 text-green-800',
    promotional: 'bg-blue-100 text-blue-800',
    utility: 'bg-yellow-100 text-yellow-800',
    authentication: 'bg-red-100 text-red-800'
  };

  return (
    <div className={`
      relative bg-card border-2 rounded-lg p-3 min-w-[160px] transition-all duration-200
      ${selected ? 'border-primary shadow-lg' : 'border-node-sms shadow-sm'}
      hover:shadow-md group
    `}>
      {/* Delete Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => deleteNode(id)}
        className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full"
      >
        <X className="h-3 w-3" />
      </Button>

      {/* Node Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-md bg-node-sms/10">
          <MessageSquare className="w-4 h-4 text-node-sms" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">SMS Channel</div>
          <div className="text-xs text-muted-foreground truncate">
            {data.senderId || 'No Sender ID'}
          </div>
        </div>
      </div>

      {/* Configuration Blocks */}
      <div className="space-y-2">
        {/* Message Type Block */}
        <div className="bg-accent/30 rounded p-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Type</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${messageTypeColors[data.messageType] || messageTypeColors.transactional}`}>
              {data.messageType || 'transactional'}
            </span>
          </div>
        </div>

        {/* Sender ID Block */}
        <div className="bg-accent/30 rounded p-2">
          <div className="flex items-center gap-2">
            <Phone className="w-3 h-3 text-node-sms" />
            <span className="text-xs font-medium">Sender ID</span>
            {data.senderId && <CheckCircle className="w-3 h-3 text-green-500" />}
          </div>
          <div className="text-xs text-muted-foreground mt-1 truncate">
            {data.senderId || 'Not configured'}
          </div>
        </div>

        {/* Encoding Block */}
        <div className="bg-accent/30 rounded p-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Encoding</span>
            <span className="text-xs text-muted-foreground uppercase">
              {data.encoding || 'utf8'}
            </span>
          </div>
        </div>
      </div>

      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 border-2 border-node-sms bg-background"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 border-2 border-node-sms bg-background"
      />
    </div>
  );
};