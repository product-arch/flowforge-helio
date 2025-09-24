import React from 'react';
import { Mail } from 'lucide-react';
import { BaseChannelNode } from './base/BaseChannelNode';
import { NodeProps } from '@xyflow/react';

export const EmailNode: React.FC<NodeProps> = (props) => {
  return (
    <BaseChannelNode
      {...props}
      icon={Mail}
      title="Email"
      channelType="email"
    />
  );
};