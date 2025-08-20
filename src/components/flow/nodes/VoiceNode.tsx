import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Phone, Trash2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFlow } from '@/contexts/FlowContext';

const VENDORS = [
  { id: 'twilio', name: 'Twilio', logo: '🔴', type: 'voice' },
  { id: 'vonage', name: 'Vonage', logo: '🟣', type: 'voice' },
  { id: 'plivo', name: 'Plivo', logo: '🟢', type: 'voice' },
];

interface FallbackConfig {
  channel: string;
  vendors: string[];
}

export const VoiceNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const { deleteNode } = useFlow();
  const onConfigClick = data.onConfigClick as ((nodeId: string) => void) | undefined;

  const callerId = (data.callerId as string) || '';
  const voiceType = (data.voiceType as string) || 'text-to-speech';
  const language = (data.language as string) || 'en';
  const selectedVendors = (data.selectedVendors as string[]) || [];
  const fallback = data.fallback as FallbackConfig | undefined;
  
  // Check if node has any configuration
  const hasConfiguration = selectedVendors.length > 0 || callerId;

  const voiceTypeColors = {
    'text-to-speech': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    'pre-recorded': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    'interactive': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
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
          <Phone className={`${hasConfiguration ? 'w-4 h-4' : 'w-3 h-3'} text-primary`} />
        </div>
        {hasConfiguration && (
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate text-primary">Voice Channel</div>
            <div className="text-xs text-muted-foreground truncate">
              {callerId}
            </div>
          </div>
        )}
        {!hasConfiguration && (
          <div className="flex-1 text-center">
            <h3 className="font-medium text-xs text-primary">Voice</h3>
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

          {/* Voice Type Block */}
          <div className="bg-accent/30 rounded p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Type</span>
              <Badge 
                variant="secondary"
                className={`text-xs ${voiceTypeColors[voiceType as keyof typeof voiceTypeColors] || voiceTypeColors['text-to-speech']}`}
              >
                {(voiceType as string).replace('-', ' ')}
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