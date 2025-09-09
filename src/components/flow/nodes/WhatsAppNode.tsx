import React from 'react';
import { MessageCircle, Hash, Bot, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BaseChannelNode } from './base/BaseChannelNode';
import { badgeVariants } from '@/styles/nodeClasses';
import { NodeProps } from '@xyflow/react';


export const WhatsAppNode: React.FC<NodeProps> = (props) => {
  const getSubtitle = (data: any) => {
    const wabaNumber = data.wabaNumber as string;
    const businessId = data.businessId as string;
    return wabaNumber || businessId || 'Business API';
  };

  const renderConfigBlocks = (data: any) => {
    const blocks = [];
    const businessId = data.businessId as string;
    const wabaNumber = data.wabaNumber as string;

    // Business ID Block
    if (businessId) {
      blocks.push(
        <div key="business-id" className="bg-accent/30 rounded p-2">
          <div className="flex items-center gap-2">
            <Hash className="w-3 h-3 text-primary" />
            <span className="text-xs font-medium">Business ID</span>
            <CheckCircle className="w-3 h-3 text-green-500" />
          </div>
          <div className="text-xs text-muted-foreground mt-1 truncate">
            {businessId}
          </div>
        </div>
      );
    }

    // WABA Number Block
    if (wabaNumber) {
      blocks.push(
        <div key="waba-number" className="bg-accent/30 rounded p-2">
          <div className="flex items-center gap-2">
            <Bot className="w-3 h-3 text-primary" />
            <span className="text-xs font-medium">WABA Number</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1 truncate">
            {wabaNumber}
          </div>
        </div>
      );
    }

    return blocks;
  };

  return (
    <BaseChannelNode
      {...props}
      icon={MessageCircle}
      title="WhatsApp"
      channelType="whatsapp"
      getSubtitle={getSubtitle}
      renderConfigBlocks={renderConfigBlocks}
      badgeConfig={{
        key: 'templateType',
        variants: badgeVariants.templateType,
        defaultVariant: 'text'
      }}
    />
  );
};