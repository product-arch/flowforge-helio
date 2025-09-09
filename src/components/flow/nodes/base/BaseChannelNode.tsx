import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Trash2, Settings, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFlow } from '@/contexts/FlowContext';
import { nodeBaseClasses, badgeVariants, handleClasses } from '@/styles/nodeClasses';
import { analyzeNodeConfiguration, formatVendorDisplay, generateNodeSummary, getChannelVendors } from '@/utils/nodeHelpers';

export interface BaseChannelNodeProps extends NodeProps {
  icon: LucideIcon;
  title: string;
  channelType: 'sms' | 'email' | 'rcs' | 'voice' | 'whatsapp';
  getSubtitle?: (data: any) => string;
  renderConfigBlocks?: (data: any, config: ReturnType<typeof analyzeNodeConfiguration>) => React.ReactNode;
  badgeConfig?: {
    key: string;
    variants: Record<string, string>;
    defaultVariant?: string;
  };
}

export const BaseChannelNode: React.FC<BaseChannelNodeProps> = ({
  id,
  data,
  selected,
  icon: Icon,
  title,
  channelType,
  getSubtitle,
  renderConfigBlocks,
  badgeConfig
}) => {
  const { deleteNode } = useFlow();
  const onConfigClick = data.onConfigClick as ((nodeId: string) => void) | undefined;
  
  const config = analyzeNodeConfiguration(data);
  const selectedVendors = (data.selectedVendors as string[]) || [];
  const vendors = getChannelVendors(channelType);
  
  const subtitle = getSubtitle ? getSubtitle(data) : generateNodeSummary(channelType, data);
  
  const renderDefaultConfigBlocks = () => {
    const blocks = [];
    
    // Vendors block
    if (selectedVendors.length > 0) {
      const { displayVendors, hasMore, moreCount } = formatVendorDisplay(selectedVendors);
      blocks.push(
        <div key="vendors" className={nodeBaseClasses.configBlock}>
          <div className={nodeBaseClasses.configBlockHeader}>
            <span className={nodeBaseClasses.configBlockTitle}>Vendors</span>
            <span className="text-xs text-muted-foreground">
              {selectedVendors.length} selected
            </span>
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {displayVendors.map((vendor) => (
              <span key={vendor.id} className={nodeBaseClasses.vendorChip}>
                {vendor.logo} {vendor.name}
              </span>
            ))}
            {hasMore && (
              <span className="text-xs text-muted-foreground">+{moreCount}</span>
            )}
          </div>
        </div>
      );
    }
    
    // Badge-based config block
    if (badgeConfig && data[badgeConfig.key]) {
      const value = data[badgeConfig.key] as string;
      const badgeClass = badgeConfig.variants[value] || badgeConfig.variants[badgeConfig.defaultVariant || ''];
      
      blocks.push(
        <div key={badgeConfig.key} className={nodeBaseClasses.configBlock}>
          <div className={nodeBaseClasses.configBlockHeader}>
            <span className={nodeBaseClasses.configBlockTitle}>
              {badgeConfig.key.charAt(0).toUpperCase() + badgeConfig.key.slice(1)}
            </span>
            <Badge variant="secondary" className={`text-xs ${badgeClass}`}>
              {value.replace(/[_-]/g, ' ')}
            </Badge>
          </div>
        </div>
      );
    }
    
    // Fallback indicator
    const fallback = data.fallback as { channel?: string } | undefined;
    if (fallback && fallback.channel) {
      blocks.push(
        <div key="fallback" className={nodeBaseClasses.fallbackIndicator}>
          <span className={nodeBaseClasses.fallbackText}>
            ↻ Fallback: {fallback.channel.toUpperCase()}
          </span>
        </div>
      );
    }
    
    return blocks;
  };

  return (
    <div className={nodeBaseClasses.container(selected, config.isConfigured)}>
      {/* Delete Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => deleteNode(id)}
        className={nodeBaseClasses.deleteButton}
      >
        <Trash2 className="w-3 h-3" />
      </Button>

      {/* Config Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onConfigClick?.(id)}
        className={nodeBaseClasses.configButton}
      >
        <Settings className="w-3 h-3" />
      </Button>

      {/* Header */}
      <div className={nodeBaseClasses.header}>
        <div className={nodeBaseClasses.iconContainer(config.isConfigured)}>
          <Icon className={nodeBaseClasses.icon(config.isConfigured)} />
        </div>
        {config.isConfigured && (
          <div className="flex-1 min-w-0">
            <div className={nodeBaseClasses.title(config.isConfigured)}>{title}</div>
            <div className={nodeBaseClasses.subtitle}>{subtitle}</div>
          </div>
        )}
        {!config.isConfigured && (
          <div className="flex-1 text-center">
            <h3 className={nodeBaseClasses.title(config.isConfigured)}>{title}</h3>
          </div>
        )}
      </div>

      {/* Configuration Details */}
      {config.isConfigured && (
        <div className={nodeBaseClasses.configurationDetails}>
          {renderConfigBlocks ? renderConfigBlocks(data, config) : renderDefaultConfigBlocks()}
        </div>
      )}

      {/* Unconfigured state notice */}
      {!config.isConfigured && (
        <div className={nodeBaseClasses.unconfiguredNotice}>
          <span className={nodeBaseClasses.unconfiguredText}>Not configured</span>
        </div>
      )}

      {/* Connection Handles */}
      <Handle type="target" position={Position.Left} id="left-in" className={handleClasses.invisible} />
      <Handle type="target" position={Position.Top} id="top-in" className={handleClasses.invisible} />
      <Handle type="target" position={Position.Bottom} id="bottom-in" className={handleClasses.invisible} />
      <Handle type="target" position={Position.Right} id="right-in" className={handleClasses.invisible} />
      <Handle type="source" position={Position.Left} id="left-out" className={handleClasses.invisible} />
      <Handle type="source" position={Position.Right} id="right-out" className={handleClasses.invisible} />
      <Handle type="source" position={Position.Top} id="top-out" className={handleClasses.invisible} />
      <Handle type="source" position={Position.Bottom} id="bottom-out" className={handleClasses.invisible} />
    </div>
  );
};