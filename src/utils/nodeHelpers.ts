import { getVendorsByType, getVendorById, Vendor } from '@/constants/vendors';

export interface NodeConfigurationState {
  hasVendors: boolean;
  hasRouting: boolean;
  hasThreshold: boolean;
  hasTemplate: boolean;
  isConfigured: boolean;
}

export const analyzeNodeConfiguration = (data: any): NodeConfigurationState => {
  const selectedVendors = (data.selectedVendors as string[]) || [];
  const routingConfig = data.routingConfig;
  const threshold = data.threshold || data.globalThreshold;
  const template = data.template || data.templateType;

  return {
    hasVendors: selectedVendors.length > 0,
    hasRouting: Boolean(routingConfig),
    hasThreshold: Boolean(threshold),
    hasTemplate: Boolean(template),
    isConfigured: selectedVendors.length > 0 || Boolean(routingConfig) || Boolean(threshold) || Boolean(template)
  };
};

export const formatVendorDisplay = (vendorIds: string[], maxDisplay: number = 3): {
  displayVendors: Vendor[];
  hasMore: boolean;
  moreCount: number;
} => {
  const vendors = vendorIds.map(id => getVendorById(id)).filter(Boolean) as Vendor[];
  
  return {
    displayVendors: vendors.slice(0, maxDisplay),
    hasMore: vendors.length > maxDisplay,
    moreCount: vendors.length - maxDisplay
  };
};

export const getChannelVendors = (channelType: string): Vendor[] => {
  switch (channelType.toLowerCase()) {
    case 'sms':
      return getVendorsByType('sms');
    case 'email':
      return getVendorsByType('email');
    case 'rcs':
      return getVendorsByType('rcs');
    case 'voice':
      return getVendorsByType('voice');
    case 'whatsapp':
      return getVendorsByType('whatsapp');
    default:
      return [];
  }
};

export const generateNodeSummary = (nodeType: string, data: any): string => {
  const config = analyzeNodeConfiguration(data);
  
  if (!config.isConfigured) {
    return 'Not configured';
  }

  const parts: string[] = [];
  
  if (config.hasVendors) {
    const vendorCount = (data.selectedVendors as string[]).length;
    parts.push(`${vendorCount} vendor${vendorCount !== 1 ? 's' : ''}`);
  }
  
  if (config.hasThreshold) {
    const threshold = data.threshold || data.globalThreshold;
    parts.push(`${threshold}% threshold`);
  }
  
  if (config.hasTemplate) {
    const template = data.template || data.templateType;
    parts.push(template);
  }

  return parts.join(' • ') || 'Configured';
};

export const getNodeDisplaySize = (isConfigured: boolean): {
  containerClass: string;
  iconSize: string;
  padding: string;
} => {
  return {
    containerClass: isConfigured ? 'p-3 min-w-[160px] max-w-[200px]' : 'p-2 w-[120px]',
    iconSize: isConfigured ? 'w-4 h-4' : 'w-3 h-3',
    padding: isConfigured ? 'p-1.5' : 'p-1'
  };
};

export const createConfigurationBlocks = (data: any) => {
  const blocks: Array<{
    type: 'vendors' | 'threshold' | 'template' | 'routing' | 'custom';
    title: string;
    content: React.ReactNode | string;
    data?: any;
  }> = [];

  // Vendors block
  const selectedVendors = (data.selectedVendors as string[]) || [];
  if (selectedVendors.length > 0) {
    const { displayVendors, hasMore, moreCount } = formatVendorDisplay(selectedVendors);
    blocks.push({
      type: 'vendors',
      title: 'Vendors',
      content: `${selectedVendors.length} selected`,
      data: { displayVendors, hasMore, moreCount }
    });
  }

  // Threshold block
  const threshold = data.threshold || data.globalThreshold;
  if (threshold) {
    blocks.push({
      type: 'threshold',
      title: 'Threshold',
      content: `${threshold}%`
    });
  }

  // Template block
  const template = data.template || data.templateType;
  if (template) {
    blocks.push({
      type: 'template',
      title: 'Template',
      content: template
    });
  }

  return blocks;
};