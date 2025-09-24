import React from 'react';
import { Phone } from 'lucide-react';
import { BaseChannelNode } from './base/BaseChannelNode';
import { NodeProps } from '@xyflow/react';

export const VoiceNode: React.FC<NodeProps> = (props) => {
  return (
    <BaseChannelNode
      {...props}
      icon={Phone}
      title="Voice"
      channelType="voice"
    />
  );
};