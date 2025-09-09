import React from 'react';
import { Radio } from 'lucide-react';
import { BaseChannelNode } from './base/BaseChannelNode';
import { NodeProps } from '@xyflow/react';

export const RCSNode: React.FC<NodeProps> = (props) => {
  const getSubtitle = (data: any) => {
    const botName = data.botName as string;
    return botName || '';
  };

  return (
    <BaseChannelNode
      {...props}
      icon={Radio}
      title="RCS"
      channelType="rcs"
      getSubtitle={getSubtitle}
      badgeConfig={{
        key: 'messageType',
        variants: {
          text: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
          rich: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
          media: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
          interactive: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
        },
        defaultVariant: 'text'
      }}
    />
  );
};