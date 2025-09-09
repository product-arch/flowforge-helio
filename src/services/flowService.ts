import { toast } from '@/hooks/use-toast';

export interface FlowData {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'archived';
  channel: string;
  nodes: any[];
  edges: any[];
}

class FlowService {
  saveFlow(flowData: FlowData): void {
    // Save flow to localStorage or API
    localStorage.setItem(`flow_${flowData.id}`, JSON.stringify(flowData));
    
    toast({
      title: "Flow Saved",
      description: "Your routing flow has been saved successfully.",
      className: "border-status-success bg-status-success/10 text-status-success"
    });
  }

  activateFlow(flowId: string): void {
    const flowData = this.getFlow(flowId);
    if (flowData) {
      flowData.status = 'active';
      this.saveFlow(flowData);
      
      toast({
        title: "Flow Activated",
        description: "Your routing flow is now live and processing messages.",
        className: "border-status-success bg-status-success/10 text-status-success"
      });
    }
  }

  deactivateFlow(flowId: string): void {
    const flowData = this.getFlow(flowId);
    if (flowData) {
      flowData.status = 'draft';
      this.saveFlow(flowData);
      
      toast({
        title: "Flow Deactivated",
        description: "Your routing flow has been deactivated and is no longer processing messages.",
        className: "border-status-warning bg-status-warning/10 text-status-warning"
      });
    }
  }

  getFlow(flowId: string): FlowData | null {
    const saved = localStorage.getItem(`flow_${flowId}`);
    return saved ? JSON.parse(saved) : null;
  }

  deleteFlow(flowId: string): void {
    localStorage.removeItem(`flow_${flowId}`);
    
    toast({
      title: "Flow Deleted",
      description: "The flow has been permanently deleted.",
      className: "border-status-error bg-status-error/10 text-status-error"
    });
  }

  duplicateFlow(flowId: string): FlowData {
    const original = this.getFlow(flowId);
    if (!original) throw new Error('Flow not found');
    
    const duplicate: FlowData = {
      ...original,
      id: `${flowId}_copy_${Date.now()}`,
      name: `${original.name} (Copy)`,
      status: 'draft'
    };
    
    this.saveFlow(duplicate);
    
    toast({
      title: "Flow Duplicated",
      description: "A copy of the flow has been created.",
      className: "border-status-info bg-status-info/10 text-status-info"
    });
    
    return duplicate;
  }

  exportFlow(flowId: string): void {
    const flowData = this.getFlow(flowId);
    if (!flowData) return;
    
    const dataStr = JSON.stringify(flowData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${flowData.name.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Started",
      description: "Downloading flow configuration...",
      className: "border-status-info bg-status-info/10 text-status-info"
    });
  }

  importFlow(file: File): Promise<FlowData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const flowData = JSON.parse(e.target?.result as string);
          flowData.id = `imported_${Date.now()}`;
          this.saveFlow(flowData);
          
          toast({
            title: "Import Successful",
            description: "Flow configuration has been imported.",
            className: "border-status-success bg-status-success/10 text-status-success"
          });
          
          resolve(flowData);
        } catch (error) {
          toast({
            title: "Import Failed",
            description: "Invalid flow configuration file.",
            className: "border-status-error bg-status-error/10 text-status-error"
          });
          reject(error);
        }
      };
      reader.readAsText(file);
    });
  }
}

export const flowService = new FlowService();