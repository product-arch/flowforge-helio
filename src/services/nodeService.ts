import { NodeConfigurationState, analyzeNodeConfiguration } from '@/utils/nodeHelpers';

export interface NodeConfiguration {
  selectedVendors: string[];
  routingConfig?: any;
  threshold?: number;
  template?: string;
  [key: string]: any;
}

class NodeService {
  validateNodeConfiguration(data: NodeConfiguration): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Check for required vendors
    if (!data.selectedVendors || data.selectedVendors.length === 0) {
      errors.push('At least one vendor must be selected');
    }
    
    // Check threshold values
    if (data.threshold !== undefined) {
      if (data.threshold < 0 || data.threshold > 100) {
        errors.push('Threshold must be between 0 and 100');
      }
      if (data.threshold > 90) {
        warnings.push('High threshold values may cause routing issues');
      }
    }
    
    // Check routing configuration
    if (data.routingConfig && !this.validateRoutingConfig(data.routingConfig)) {
      errors.push('Invalid routing configuration');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  private validateRoutingConfig(config: any): boolean {
    // Implement routing config validation logic
    return true;
  }

  mergeNodeConfigurations(base: NodeConfiguration, override: Partial<NodeConfiguration>): NodeConfiguration {
    return {
      ...base,
      ...override,
      selectedVendors: override.selectedVendors || base.selectedVendors,
    };
  }

  getNodeDisplayProperties(data: NodeConfiguration): {
    title: string;
    subtitle: string;
    badge?: string;
    status: 'configured' | 'partial' | 'unconfigured';
  } {
    const config = analyzeNodeConfiguration(data);
    
    let status: 'configured' | 'partial' | 'unconfigured' = 'unconfigured';
    if (config.isConfigured) {
      status = config.hasVendors && (config.hasRouting || config.hasThreshold) ? 'configured' : 'partial';
    }
    
    return {
      title: this.generateNodeTitle(data),
      subtitle: this.generateNodeSubtitle(data),
      badge: this.generateNodeBadge(data),
      status
    };
  }

  private generateNodeTitle(data: NodeConfiguration): string {
    // Generate appropriate title based on node type and configuration
    return data.template || 'Node';
  }

  private generateNodeSubtitle(data: NodeConfiguration): string {
    if (!data.selectedVendors?.length) return 'Not configured';
    
    const parts: string[] = [];
    
    if (data.selectedVendors.length > 0) {
      parts.push(`${data.selectedVendors.length} vendor${data.selectedVendors.length !== 1 ? 's' : ''}`);
    }
    
    if (data.threshold) {
      parts.push(`${data.threshold}% threshold`);
    }
    
    return parts.join(' • ') || 'Configured';
  }

  private generateNodeBadge(data: NodeConfiguration): string | undefined {
    return data.template || data.routingConfig?.type;
  }

  optimizeNodeConfiguration(data: NodeConfiguration): NodeConfiguration {
    // Remove duplicate vendors
    const uniqueVendors = [...new Set(data.selectedVendors)];
    
    // Optimize threshold values
    let optimizedThreshold = data.threshold;
    if (optimizedThreshold !== undefined) {
      optimizedThreshold = Math.max(0, Math.min(100, optimizedThreshold));
    }
    
    return {
      ...data,
      selectedVendors: uniqueVendors,
      threshold: optimizedThreshold,
    };
  }
}

export const nodeService = new NodeService();