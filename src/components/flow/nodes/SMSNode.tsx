import React from 'react';
import { MessageSquare } from 'lucide-react';
import { BaseChannelNode } from './base/BaseChannelNode';
import { NodeProps } from '@xyflow/react';

export const SMSNode: React.FC<NodeProps> = (props) => {
  return (
    <BaseChannelNode
      {...props}
      icon={MessageSquare}
      title="SMS"
      channelType="sms"
    />
  );
};