import React, { useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Trash2, Settings, LucideIcon, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFlow } from '@/contexts/FlowContext';
import { nodeBaseClasses, handleClasses } from '@/styles/nodeClasses';
import { FloatingAddButton } from './FloatingAddButton';

export interface BaseChannelNodeProps extends NodeProps {
  icon: LucideIcon;
  title: string;
  channelType: 'sms' | 'email' | 'rcs' | 'voice' | 'whatsapp';
}

export const BaseChannelNode: React.FC<BaseChannelNodeProps> = ({
  id,
  data,
  selected,
  icon: Icon,
  title,
  channelType
}) => {
  const { deleteNode, addNode, onConnect } = useFlow();
  
  const onConfigClick = data.onConfigClick as ((nodeId: string) => void) | undefined;
  
  const isConfigured = !!(data.selectedVendor && data.successCriteria);
  const selectedVendor = data.selectedVendor as string;
  const successCriteria = data.successCriteria as string;

  const getVendorName = (vendorId: string) => {
    const vendorMap: Record<string, string> = {
      'twilio': 'Twilio', 'messagebird': 'MessageBird', 'msg91': 'MSG91',
      'sendgrid': 'SendGrid', 'mailgun': 'Mailgun', 'meta': 'Meta'
    };
    return vendorMap[vendorId] || vendorId;
  };

  const getCriteriaDisplay = (criteriaId: string) => {
    const criteriaMap: Record<string, string> = {
      'delivered': 'Delivered', 'read': 'Read', 'clicked': 'Clicked'
    };
    return criteriaMap[criteriaId] || 'Custom';
  };

  const handleAddNode = (handleType: 'success' | 'failure', nodeType: string) => {
    // Calculate position relative to current node
    const offsetX = handleType === 'success' ? -100 : 100;
    const offsetY = 150;
    const currentX = (data.positionAbsoluteX as number) || 0;
    const currentY = (data.positionAbsoluteY as number) || 0;
    const newPosition = { 
      x: currentX + offsetX, 
      y: currentY + offsetY 
    };
    
    // Add the new node
    addNode(nodeType, newPosition);
  };

  return (
    <div className={nodeBaseClasses.container(selected, isConfigured)}>
      <Button variant="ghost" size="sm" onClick={() => deleteNode(id)} className={nodeBaseClasses.deleteButton}>
        <Trash2 className="w-3 h-3" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => onConfigClick?.(id)} className={nodeBaseClasses.configButton}>
        <Settings className="w-3 h-3" />
      </Button>
      
      <div className={nodeBaseClasses.header}>
        <div className={nodeBaseClasses.iconContainer(isConfigured)}>
          <Icon className={nodeBaseClasses.icon(isConfigured)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className={nodeBaseClasses.title(isConfigured)}>{title}</div>
          {isConfigured && <div className={nodeBaseClasses.subtitle}>{getVendorName(selectedVendor)}</div>}
        </div>
      </div>

      {isConfigured ? (
        <div className={nodeBaseClasses.configurationDetails}>
          <div className="flex justify-between items-center mt-2 px-1">
            <div className="flex items-center gap-1 text-xs">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span className="text-green-600 dark:text-green-400 font-medium">Success</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <XCircle className="w-3 h-3 text-red-500" />
              <span className="text-red-600 dark:text-red-400 font-medium">Failure</span>
            </div>
          </div>
        </div>
      ) : (
        <div className={nodeBaseClasses.unconfiguredNotice}>
          <span className={nodeBaseClasses.unconfiguredText}>Click settings to configure</span>
        </div>
      )}

      <Handle type="target" position={Position.Top} id="input" className={handleClasses.connectionDot}
        style={{ top: -4, left: '50%', transform: 'translateX(-50%)' }} />
      
      {isConfigured && (
        <>
          {/* Success Handle */}
          <Handle type="source" position={Position.Bottom} id="success" 
            className={`${handleClasses.connectionDot} bg-green-500 ${selected ? 'ring-2 ring-green-300' : ''}`}
            style={{ bottom: -4, left: '30%', transform: 'translateX(-50%)' }} />
          
          {/* Failure Handle */}
          <Handle type="source" position={Position.Bottom} id="failure"
            className={`${handleClasses.connectionDot} bg-red-500 ${selected ? 'ring-2 ring-red-300' : ''}`}
            style={{ bottom: -4, right: '30%', transform: 'translateX(50%)' }} />

          {/* Floating Add Buttons - Show when node is selected */}
          {selected && (
            <>
              <FloatingAddButton
                sourceNodeId={id}
                sourceHandle="success"
                position={{ x: -80, y: 40 }}
                onNodeSelect={(nodeType) => handleAddNode('success', nodeType)}
                onClose={() => {}}
              />
              
              <FloatingAddButton
                sourceNodeId={id}
                sourceHandle="failure"
                position={{ x: 80, y: 40 }}
                onNodeSelect={(nodeType) => handleAddNode('failure', nodeType)}
                onClose={() => {}}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};