import React from 'react';
import { TrendingDown } from 'lucide-react';
import { BaseChannelNode } from './base/BaseChannelNode';
import { badgeVariants } from '@/styles/nodeClasses';
import { Badge } from '@/components/ui/badge';
import { NodeProps } from '@xyflow/react';

export const SpilloverNode: React.FC<NodeProps> = (props) => {
  const getSubtitle = (data: any) => {
    const globalThreshold = data.globalThreshold as number || 80;
    return `${globalThreshold}% threshold`;
  };

  const renderConfigBlocks = (data: any) => {
    const blocks = [];
    const vendors = (data.vendors as any[]) || [];
    const globalThreshold = (data.globalThreshold as number) || 80;

    // Vendors Block
    if (vendors.length > 0) {
      blocks.push(
        <div key="vendors" className="bg-accent/30 rounded p-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Vendors</span>
            <span className="text-xs text-muted-foreground">
              {vendors.length} configured
            </span>
          </div>
        </div>
      );
    }

    // Threshold Block
    blocks.push(
      <div key="threshold" className="bg-accent/30 rounded p-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium">Threshold</span>
          <Badge variant="outline" className="text-xs">
            {globalThreshold}%
          </Badge>
        </div>
      </div>
    );

    return blocks;
  };

  return (
    <BaseChannelNode
      {...props}
      icon={TrendingDown}
      title="Spillover"
      channelType="sms" // Spillover can work with any channel type
      getSubtitle={getSubtitle}
      renderConfigBlocks={renderConfigBlocks}
      badgeConfig={{
        key: 'spilloverMode',
        variants: badgeVariants.spilloverMode,
        defaultVariant: 'capacity_based'
      }}
    />
  );
};