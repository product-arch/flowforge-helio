import React from 'react';
import { Radio } from 'lucide-react';
import { BaseChannelNode } from './base/BaseChannelNode';
import { NodeProps } from '@xyflow/react';

export const RCSNode: React.FC<NodeProps> = (props) => {
  return (
    <BaseChannelNode
      {...props}
      icon={Radio}
      title="RCS"
      channelType="rcs"
    />
  );
};