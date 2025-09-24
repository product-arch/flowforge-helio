import React, { useState } from 'react';
import { Plus, MessageSquare, Send, Mail, Phone, Video, GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useFlow } from '@/contexts/FlowContext';

interface NodeOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  category: 'channel' | 'logic';
}

const NODE_OPTIONS: NodeOption[] = [
  // Channel nodes
  { id: 'sms', label: 'SMS', icon: MessageSquare, color: 'text-blue-500', category: 'channel' },
  { id: 'whatsapp', label: 'WhatsApp', icon: Send, color: 'text-green-500', category: 'channel' },
  { id: 'email', label: 'Email', icon: Mail, color: 'text-purple-500', category: 'channel' },
  { id: 'voice', label: 'Voice', icon: Phone, color: 'text-orange-500', category: 'channel' },
  { id: 'rcs', label: 'RCS', icon: Video, color: 'text-indigo-500', category: 'channel' },
  
  // Logic nodes
  { id: 'conditional', label: 'Conditional', icon: GitBranch, color: 'text-purple-500', category: 'logic' },
];

interface FloatingAddButtonProps {
  sourceNodeId: string;
  sourceHandle: string;
  position: { x: number; y: number };
  onNodeSelect: (nodeType: string) => void;
  onClose: () => void;
}

export const FloatingAddButton: React.FC<FloatingAddButtonProps> = ({
  sourceNodeId,
  sourceHandle,
  position,
  onNodeSelect,
  onClose
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleNodeClick = (nodeType: string) => {
    onNodeSelect(nodeType);
    onClose();
  };

  const channels = NODE_OPTIONS.filter(node => node.category === 'channel');
  const logic = NODE_OPTIONS.filter(node => node.category === 'logic');

  return (
    <div 
      className="absolute z-50 pointer-events-auto"
      style={{
        left: position.x - 20,
        top: position.y + 10,
        transform: 'translate(-50%, 0)'
      }}
    >
      {!isExpanded ? (
        <Button
          variant="ghost"
          size="sm"
          className="w-8 h-8 p-0 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-full shadow-lg backdrop-blur-sm opacity-60 hover:opacity-100 transition-all duration-200"
          onClick={() => setIsExpanded(true)}
          title="Click to add nodes"
        >
          <Plus className="w-4 h-4 text-primary" />
        </Button>
      ) : (
        <Card className="bg-card/95 backdrop-blur-sm border shadow-xl animate-in fade-in scale-in-95 duration-200">
          <CardContent className="p-3 space-y-3">
            {/* Channel Nodes */}
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                Channels
              </div>
              <div className="grid grid-cols-2 gap-1">
                {channels.map((node) => {
                  const IconComponent = node.icon;
                  return (
                    <Button
                      key={node.id}
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2 justify-start h-8 px-2 hover:bg-muted/50"
                      onClick={() => handleNodeClick(node.id)}
                    >
                      <IconComponent className={`w-3 h-3 ${node.color}`} />
                      <span className="text-xs">{node.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Logic Nodes */}
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                Logic
              </div>
              <div className="grid grid-cols-1 gap-1">
                {logic.map((node) => {
                  const IconComponent = node.icon;
                  return (
                    <Button
                      key={node.id}
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2 justify-start h-8 px-2 hover:bg-muted/50"
                      onClick={() => handleNodeClick(node.id)}
                    >
                      <IconComponent className={`w-3 h-3 ${node.color}`} />
                      <span className="text-xs">{node.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Close button */}
            <div className="border-t pt-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-6 text-xs"
                onClick={onClose}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};