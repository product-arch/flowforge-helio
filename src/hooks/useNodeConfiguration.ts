import { useState, useCallback } from 'react';
import { nodeService, NodeConfiguration } from '@/services/nodeService';
import { useToast } from '@/hooks/use-toast';

interface UseNodeConfigurationProps {
  initialData?: Partial<NodeConfiguration>;
  onUpdate?: (data: NodeConfiguration) => void;
}

export const useNodeConfiguration = ({ 
  initialData = {}, 
  onUpdate 
}: UseNodeConfigurationProps = {}) => {
  const [configuration, setConfiguration] = useState<NodeConfiguration>({
    selectedVendors: [],
    ...initialData
  });
  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const { toast } = useToast();

  const validateConfiguration = useCallback((config: NodeConfiguration) => {
    const validation = nodeService.validateNodeConfiguration(config);
    setIsValid(validation.isValid);
    setErrors(validation.errors);
    setWarnings(validation.warnings);
    
    if (validation.warnings.length > 0) {
      toast({
        title: "Configuration Warning",
        description: validation.warnings[0],
        className: "border-status-warning bg-status-warning/10 text-status-warning"
      });
    }
    
    return validation.isValid;
  }, [toast]);

  const updateConfiguration = useCallback((updates: Partial<NodeConfiguration>) => {
    const newConfig = nodeService.mergeNodeConfigurations(configuration, updates);
    const optimizedConfig = nodeService.optimizeNodeConfiguration(newConfig);
    
    setConfiguration(optimizedConfig);
    validateConfiguration(optimizedConfig);
    onUpdate?.(optimizedConfig);
  }, [configuration, validateConfiguration, onUpdate]);

  const addVendor = useCallback((vendorId: string) => {
    if (!configuration.selectedVendors.includes(vendorId)) {
      updateConfiguration({
        selectedVendors: [...configuration.selectedVendors, vendorId]
      });
    }
  }, [configuration.selectedVendors, updateConfiguration]);

  const removeVendor = useCallback((vendorId: string) => {
    updateConfiguration({
      selectedVendors: configuration.selectedVendors.filter(id => id !== vendorId)
    });
  }, [configuration.selectedVendors, updateConfiguration]);

  const setThreshold = useCallback((threshold: number) => {
    updateConfiguration({ threshold });
  }, [updateConfiguration]);

  const setTemplate = useCallback((template: string) => {
    updateConfiguration({ template });
  }, [updateConfiguration]);

  const resetConfiguration = useCallback(() => {
    const resetConfig: NodeConfiguration = {
      selectedVendors: [],
      ...initialData
    };
    setConfiguration(resetConfig);
    validateConfiguration(resetConfig);
  }, [initialData, validateConfiguration]);

  const getDisplayProperties = useCallback(() => {
    return nodeService.getNodeDisplayProperties(configuration);
  }, [configuration]);

  return {
    configuration,
    isValid,
    errors,
    warnings,
    updateConfiguration,
    addVendor,
    removeVendor,
    setThreshold,
    setTemplate,
    resetConfiguration,
    getDisplayProperties
  };
};