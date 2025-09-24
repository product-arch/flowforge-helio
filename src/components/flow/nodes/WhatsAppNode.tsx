import React from 'react';
import { MessageCircle } from 'lucide-react';
import { BaseChannelNode } from './base/BaseChannelNode';
import { NodeProps } from '@xyflow/react';

export const WhatsAppNode: React.FC<NodeProps> = (props) => {
  return (
    <BaseChannelNode
      {...props}
      icon={MessageCircle}
      title="WhatsApp"
      channelType="whatsapp"
    />
  );
};