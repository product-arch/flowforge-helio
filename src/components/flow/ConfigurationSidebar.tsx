import React from 'react';
import { X, Settings, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ConfigurationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNodeId?: string;
  selectedNodeData?: any;
}

export const ConfigurationSidebar: React.FC<ConfigurationSidebarProps> = ({
  isOpen,
  onClose,
  selectedNodeId,
  selectedNodeData
}) => {
  if (!isOpen) return null;

  const isChannelNode = selectedNodeData?.type && ['sms', 'whatsapp', 'email', 'voice', 'rcs'].includes(selectedNodeData.type);

  return (
    <div className={cn(
      "fixed top-0 right-0 w-80 h-full bg-card border-l border-border z-40 transform transition-transform duration-300",
      isOpen ? "translate-x-0" : "translate-x-full"
    )}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-medium text-foreground">Configuration</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-6 h-6 p-0"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 flex">
          {/* Configuration Panel */}
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 p-4">
              {selectedNodeId ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">
                      {selectedNodeData?.type || 'Node'} Configuration
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Configure the settings for this node.
                    </p>
                  </div>

                  <Separator />

                  {/* Channel-specific configuration */}
                  {isChannelNode && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-foreground block mb-1">
                          Message Type
                        </label>
                        <select className="w-full h-8 px-2 text-xs border border-border rounded bg-background">
                          <option>Transactional</option>
                          <option>Promotional</option>
                          <option>Utility</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-foreground block mb-1">
                          Template
                        </label>
                        <select className="w-full h-8 px-2 text-xs border border-border rounded bg-background">
                          <option>Select template...</option>
                          <option>Welcome Message</option>
                          <option>Order Confirmation</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-foreground block mb-1">
                          Vendors
                        </label>
                        <div className="space-y-1">
                          <label className="flex items-center gap-2 text-xs">
                            <input type="checkbox" className="rounded" />
                            Twilio
                          </label>
                          <label className="flex items-center gap-2 text-xs">
                            <input type="checkbox" className="rounded" />
                            MessageBird
                          </label>
                          <label className="flex items-center gap-2 text-xs">
                            <input type="checkbox" className="rounded" />
                            Plivo
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Generic configuration for other nodes */}
                  {!isChannelNode && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-foreground block mb-1">
                          Label
                        </label>
                        <input 
                          type="text" 
                          className="w-full h-8 px-2 text-xs border border-border rounded bg-background"
                          placeholder="Enter label..."
                        />
                      </div>
                      
                      <div>
                        <label className="text-xs font-medium text-foreground block mb-1">
                          Description
                        </label>
                        <textarea 
                          className="w-full h-16 px-2 py-1 text-xs border border-border rounded bg-background resize-none"
                          placeholder="Enter description..."
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 text-center">
                  <div>
                    <Settings className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">
                      Select a node to configure its settings
                    </p>
                  </div>
                </div>
              )}
            </ScrollArea>

            {/* Actions */}
            {selectedNodeId && (
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 h-8 text-xs">
                    Save
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    Reset
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Preview Panel for Channel Nodes */}
          {isChannelNode && (
            <div className="w-32 border-l border-border p-3 bg-muted/30">
              <div className="text-center mb-3">
                <Smartphone className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                <p className="text-[10px] text-muted-foreground">Preview</p>
              </div>
              
              <Card className="bg-background border p-2 h-40 overflow-hidden">
                <div className="space-y-1">
                  <div className="h-1 bg-muted rounded w-3/4"></div>
                  <div className="h-1 bg-muted rounded w-1/2"></div>
                  <div className="h-1 bg-primary rounded w-2/3"></div>
                  <div className="h-1 bg-muted rounded w-3/4"></div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};