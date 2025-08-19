import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { MessageCircle, X, Bot, Hash, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFlow } from '@/contexts/FlowContext';

interface WhatsAppNodeProps {
  id: string;
  data: {
    label: string;
    businessId: string;
    templateType: 'text' | 'media' | 'interactive' | 'authentication';
    botName: string;
  };
  selected?: boolean;
}

export const WhatsAppNode: React.FC<WhatsAppNodeProps> = ({ id, data, selected }) => {
  const { deleteNode } = useFlow();

  const templateTypeColors = {
    text: 'bg-green-100 text-green-800',
    media: 'bg-purple-100 text-purple-800',
    interactive: 'bg-blue-100 text-blue-800',
    authentication: 'bg-red-100 text-red-800'
  };

  return (
    <div className={`
      relative bg-card border-2 rounded-lg p-3 min-w-[160px] transition-all duration-200
      ${selected ? 'border-primary shadow-primary/20' : 'border-primary/50'}
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
        <div className="p-1.5 rounded-md bg-primary/10">
          <MessageCircle className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate text-primary">WhatsApp</div>
          <div className="text-xs text-muted-foreground truncate">
            {data.botName || 'Business API'}
          </div>
        </div>
      </div>

      {/* Configuration Blocks */}
      <div className="space-y-2">
        {/* Template Type Block */}
        <div className="bg-accent/30 rounded p-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Template</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${templateTypeColors[data.templateType] || templateTypeColors.text}`}>
              {data.templateType || 'text'}
            </span>
          </div>
        </div>

        {/* Business ID Block */}
        <div className="bg-accent/30 rounded p-2">
          <div className="flex items-center gap-2">
            <Hash className="w-3 h-3 text-primary" />
            <span className="text-xs font-medium">Business ID</span>
            {data.businessId && <CheckCircle className="w-3 h-3 text-green-500" />}
          </div>
          <div className="text-xs text-muted-foreground mt-1 font-mono truncate">
            {data.businessId || 'Not configured'}
          </div>
        </div>

        {/* Bot Name Block */}
        <div className="bg-accent/30 rounded p-2">
          <div className="flex items-center gap-2">
            <Bot className="w-3 h-3 text-primary" />
            <span className="text-xs font-medium">Bot Name</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1 truncate">
            {data.botName || 'Default Bot'}
          </div>
        </div>
      </div>

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