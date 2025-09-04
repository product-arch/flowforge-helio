import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { MessageCircle, Hash, Bot, Trash2, CheckCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFlow } from '@/contexts/FlowContext';


export const WhatsAppNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const { deleteNode } = useFlow();
  const onConfigClick = data.onConfigClick as ((nodeId: string) => void) | undefined;
  
  const businessId = (data.businessId as string) || '';
  const templateType = (data.templateType as string) || 'text';
  const wabaNumber = (data.wabaNumber as string) || '';
  const selectedVendors = (data.selectedVendors as string[]) || [];
  const routingConfig = data.routingConfig;
  
  // Check if node has any configuration
  const hasConfiguration = businessId || wabaNumber || selectedVendors.length > 0;

  const templateTypeColors = {
    text: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    media: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    interactive: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
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
          <MessageCircle className={`${hasConfiguration ? 'w-4 h-4' : 'w-3 h-3'} text-primary`} />
        </div>
        {hasConfiguration && (
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate text-primary">WhatsApp</div>
            <div className="text-xs text-muted-foreground truncate">
              {wabaNumber || businessId || 'Business API'}
            </div>
          </div>
        )}
        {!hasConfiguration && (
          <div className="flex-1 text-center">
            <h3 className="font-medium text-xs text-primary">WhatsApp</h3>
          </div>
        )}
      </div>

      {/* Configuration Details - Only show when configured */}
      {hasConfiguration && (
        <div className="space-y-2 mb-3">
          {/* Business ID Block */}
          {businessId && (
            <div className="bg-accent/30 rounded p-2">
              <div className="flex items-center gap-2">
                <Hash className="w-3 h-3 text-primary" />
                <span className="text-xs font-medium">Business ID</span>
                <CheckCircle className="w-3 h-3 text-green-500" />
              </div>
              <div className="text-xs text-muted-foreground mt-1 truncate">
                {businessId}
              </div>
            </div>
          )}

          {/* Template Type Block */}
          <div className="bg-accent/30 rounded p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Template</span>
              <Badge 
                variant="secondary"
                className={`text-xs ${templateTypeColors[templateType as keyof typeof templateTypeColors]}`}
              >
                {templateType}
              </Badge>
            </div>
          </div>

          {/* WABA Number Block */}
          {wabaNumber && (
            <div className="bg-accent/30 rounded p-2">
              <div className="flex items-center gap-2">
                <Bot className="w-3 h-3 text-primary" />
                <span className="text-xs font-medium">WABA Number</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1 truncate">
                {wabaNumber}
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


      {/* Invisible Connection Handles for full 4-side connectivity */}
      <Handle type="target" position={Position.Left} id="left-in" className="w-3 h-3 opacity-0" />
      <Handle type="target" position={Position.Top} id="top-in" className="w-3 h-3 opacity-0" />
      <Handle type="target" position={Position.Bottom} id="bottom-in" className="w-3 h-3 opacity-0" />
      <Handle type="target" position={Position.Right} id="right-in" className="w-3 h-3 opacity-0" />
      <Handle type="source" position={Position.Left} id="left-out" className="w-3 h-3 opacity-0" />
      <Handle type="source" position={Position.Right} id="right-out" className="w-3 h-3 opacity-0" />
      <Handle type="source" position={Position.Top} id="top-out" className="w-3 h-3 opacity-0" />
      <Handle type="source" position={Position.Bottom} id="bottom-out" className="w-3 h-3 opacity-0" />
    </div>
  );
};