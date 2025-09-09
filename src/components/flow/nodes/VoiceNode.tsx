import React from 'react';
import { Phone } from 'lucide-react';
import { BaseChannelNode } from './base/BaseChannelNode';
import { badgeVariants } from '@/styles/nodeClasses';
import { NodeProps } from '@xyflow/react';


export const VoiceNode: React.FC<NodeProps> = (props) => {
  const getSubtitle = (data: any) => {
    const callerId = data.callerId as string;
    return callerId || '';
  };

  return (
    <BaseChannelNode
      {...props}
      icon={Phone}
      title="Voice"
      channelType="voice"
      getSubtitle={getSubtitle}
      badgeConfig={{
        key: 'voiceType',
        variants: badgeVariants.voiceType,
        defaultVariant: 'text-to-speech'
      }}
    />
  );
};