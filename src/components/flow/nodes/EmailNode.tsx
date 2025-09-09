import React from 'react';
import { Mail } from 'lucide-react';
import { BaseChannelNode } from './base/BaseChannelNode';
import { NodeProps } from '@xyflow/react';

export const EmailNode: React.FC<NodeProps> = (props) => {
  const getSubtitle = (data: any) => {
    const fromAddress = data.fromAddress as string;
    return fromAddress || 'No sender set';
  };

  return (
    <BaseChannelNode
      {...props}
      icon={Mail}
      title="Email"
      channelType="email"
      getSubtitle={getSubtitle}
      badgeConfig={{
        key: 'messageType',
        variants: {
          transactional: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
          promotional: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
          utility: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
          authentication: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
          service: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
        },
        defaultVariant: 'transactional'
      }}
    />
  );
};