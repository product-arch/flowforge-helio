import { useState, useCallback } from 'react';
import { flowService, FlowData } from '@/services/flowService';
import { useToast } from '@/hooks/use-toast';

export const useFlowOperations = () => {
  const [flows, setFlows] = useState<FlowData[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const saveFlow = useCallback(async (flowData: FlowData) => {
    setLoading(true);
    try {
      flowService.saveFlow(flowData);
      setFlows(prev => {
        const index = prev.findIndex(f => f.id === flowData.id);
        if (index >= 0) {
          return prev.map(f => f.id === flowData.id ? flowData : f);
        }
        return [...prev, flowData];
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save flow configuration.",
        className: "border-status-error bg-status-error/10 text-status-error"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const activateFlow = useCallback(async (flowId: string) => {
    setLoading(true);
    try {
      flowService.activateFlow(flowId);
      setFlows(prev => prev.map(f => 
        f.id === flowId ? { ...f, status: 'active' as const } : f
      ));
    } catch (error) {
      toast({
        title: "Activation Failed",
        description: "Failed to activate flow.",
        className: "border-status-error bg-status-error/10 text-status-error"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const deactivateFlow = useCallback(async (flowId: string) => {
    setLoading(true);
    try {
      flowService.deactivateFlow(flowId);
      setFlows(prev => prev.map(f => 
        f.id === flowId ? { ...f, status: 'draft' as const } : f
      ));
    } catch (error) {
      toast({
        title: "Deactivation Failed",
        description: "Failed to deactivate flow.",
        className: "border-status-error bg-status-error/10 text-status-error"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const deleteFlow = useCallback(async (flowId: string) => {
    setLoading(true);
    try {
      flowService.deleteFlow(flowId);
      setFlows(prev => prev.filter(f => f.id !== flowId));
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete flow.",
        className: "border-status-error bg-status-error/10 text-status-error"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const duplicateFlow = useCallback(async (flowId: string) => {
    setLoading(true);
    try {
      const duplicatedFlow = flowService.duplicateFlow(flowId);
      setFlows(prev => [...prev, duplicatedFlow]);
      return duplicatedFlow;
    } catch (error) {
      toast({
        title: "Duplicate Failed",
        description: "Failed to duplicate flow.",
        className: "border-status-error bg-status-error/10 text-status-error"
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const exportFlow = useCallback((flowId: string) => {
    flowService.exportFlow(flowId);
  }, []);

  const importFlow = useCallback(async (file: File) => {
    setLoading(true);
    try {
      const importedFlow = await flowService.importFlow(file);
      setFlows(prev => [...prev, importedFlow]);
      return importedFlow;
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Failed to import flow configuration.",
        className: "border-status-error bg-status-error/10 text-status-error"
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const loadFlow = useCallback((flowId: string) => {
    return flowService.getFlow(flowId);
  }, []);

  return {
    flows,
    loading,
    saveFlow,
    activateFlow,
    deactivateFlow,
    deleteFlow,
    duplicateFlow,
    exportFlow,
    importFlow,
    loadFlow
  };
};