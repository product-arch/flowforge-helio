import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Globe,
  Clock,
  Database,
  Play,
  Shield,
  Zap,
  Settings,
  AlertTriangle,
  CheckCircle,
  Copy,
  FileText,
  Key,
  Network,
  RefreshCw,
  Save,
  RotateCcw
} from 'lucide-react';
import { useFlow } from '@/contexts/FlowContext';
import { useToast } from '@/hooks/use-toast';
import { StartNodeProps, TriggerType, AuthType, Environment } from '@/types/flow';
import { validateSchema, generateSampleFromSchema, SCHEMA_TEMPLATES } from '@/utils/schema';
import { validateStartNode, validateRateLimit, validateAuth } from '@/utils/validation';
import { CopyCurl } from './CopyCurl';

interface StartNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodeId: string;
}

const triggerIcons = {
  manual: Play,
  webhook: Globe,
  schedule: Clock,
  batch: Database,
  event_bus: Database
};

export const StartNodeModal: React.FC<StartNodeModalProps> = ({
  isOpen,
  onClose,
  nodeId
}) => {
  const { nodes, updateNodeData } = useFlow();
  const { toast } = useToast();
  
  const node = nodes.find(n => n.id === nodeId);
  const [formData, setFormData] = useState<StartNodeProps>({
    trigger: 'manual',
    lockPosition: true
  });
  const [schemaText, setSchemaText] = useState('');
  const [environment, setEnvironment] = useState<Environment>('dev');
  const [validationErrors, setValidationErrors] = useState<any[]>([]);

  useEffect(() => {
    if (node?.data) {
      setFormData({ 
        trigger: 'manual',
        lockPosition: true,
        ...node.data 
      } as StartNodeProps);
      if (node.data.inputSchemaRef && typeof node.data.inputSchemaRef === 'string') {
        // In a real app, this would fetch the schema by reference
        setSchemaText(node.data.inputSchemaRef);
      }
    }
  }, [node]);

  const handleSave = () => {
    // Validate configuration
    const context = {
      environment,
      nodes,
      edges: [], // Would be passed from FlowContext
      startNode: { data: formData }
    };
    
    const errors = validateStartNode(formData, context);
    
    if (errors.filter(e => e.severity === 'error').length > 0) {
      setValidationErrors(errors);
      toast({
        title: "Validation Failed",
        description: "Please fix the configuration errors before saving",
        variant: "destructive"
      });
      return;
    }

    const updatedData = {
      ...formData,
      inputSchemaRef: schemaText || undefined,
      ports: {
        success: 'success',
        ...(formData.trigger === 'webhook' && { invalid_input: 'invalid_input' }),
        ...(formData.rateLimit && { throttled: 'throttled' })
      }
    };

    updateNodeData(nodeId, updatedData);
    
    toast({
      title: "Configuration Saved",
      description: "Start node configuration has been updated successfully",
      className: "border-status-success bg-status-success/10 text-status-success"
    });
    
    onClose();
  };

  const handleReset = () => {
    if (node?.data) {
      setFormData({ 
        trigger: 'manual',
        lockPosition: true,
        ...node.data 
      } as StartNodeProps);
      setSchemaText((node.data.inputSchemaRef as string) || '');
    }
  };

  const handleValidateSchema = () => {
    if (!schemaText.trim()) {
      toast({
        title: "No Schema",
        description: "Please enter a JSON schema to validate",
        variant: "destructive"
      });
      return;
    }

    const result = validateSchema(schemaText);
    
    if (result.isValid) {
      toast({
        title: "Schema Valid",
        description: "JSON schema is valid and ready to use",
        className: "border-status-success bg-status-success/10 text-status-success"
      });
    } else {
      toast({
        title: "Schema Invalid",
        description: result.errors.join(', '),
        variant: "destructive"
      });
    }
  };

  const handleGenerateSample = () => {
    if (!schemaText.trim()) {
      toast({
        title: "No Schema",
        description: "Please enter a JSON schema first",
        variant: "destructive"
      });
      return;
    }

    const sample = generateSampleFromSchema(schemaText);
    if (sample) {
      navigator.clipboard.writeText(JSON.stringify(sample, null, 2));
      toast({
        title: "Sample Generated",
        description: "Sample payload copied to clipboard",
        className: "border-status-success bg-status-success/10 text-status-success"
      });
    } else {
      toast({
        title: "Generation Failed",
        description: "Could not generate sample from schema",
        variant: "destructive"
      });
    }
  };

  const loadSchemaTemplate = (template: keyof typeof SCHEMA_TEMPLATES) => {
    setSchemaText(JSON.stringify(SCHEMA_TEMPLATES[template], null, 2));
  };

  if (!node) return null;

  const TriggerIcon = triggerIcons[formData.trigger];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TriggerIcon className="w-5 h-5 text-primary" />
            </div>
            Start Node Configuration
            <Badge variant="secondary" className="ml-auto">
              {environment.toUpperCase()}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <Tabs defaultValue="trigger" className="space-y-4">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="trigger">Trigger</TabsTrigger>
              <TabsTrigger value="schema">Schema</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="throughput">Throughput</TabsTrigger>
              <TabsTrigger value="reliability">Reliability</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="trigger" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Trigger Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Trigger Type</Label>
                    <Select
                      value={formData.trigger}
                      onValueChange={(value: TriggerType) => 
                        setFormData({ ...formData, trigger: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="webhook">Webhook</SelectItem>
                        <SelectItem value="schedule">Schedule</SelectItem>
                        <SelectItem value="batch">Batch Processing</SelectItem>
                        <SelectItem value="event_bus">Event Bus</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.trigger === 'schedule' && (
                    <div>
                      <Label>Cron Expression</Label>
                      <Input
                        placeholder="0 0 * * * (daily at midnight)"
                        value={formData.schedule?.cron || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          schedule: { cron: e.target.value }
                        })}
                      />
                    </div>
                  )}

                  {formData.trigger === 'event_bus' && (
                    <div>
                      <Label>Topic Name</Label>
                      <Input
                        placeholder="user.created"
                        value={formData.eventBus?.topic || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          eventBus: { topic: e.target.value }
                        })}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {formData.trigger === 'webhook' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Webhook Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <Label className="text-sm font-medium">Webhook URL</Label>
                        <p className="text-sm text-muted-foreground">
                          https://api.flowforge.com/flows/{nodeId}/trigger
                        </p>
                      </div>
                      <CopyCurl startNodeProps={formData} schemaString={schemaText} />
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="schema" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Input Schema
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2 mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadSchemaTemplate('smsMessage')}
                    >
                      SMS Template
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadSchemaTemplate('bulkSms')}
                    >
                      Bulk SMS
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadSchemaTemplate('whatsappMessage')}
                    >
                      WhatsApp
                    </Button>
                  </div>

                  <div>
                    <Label>JSON Schema</Label>
                    <Textarea
                      placeholder="Enter JSON Schema..."
                      className="font-mono text-sm min-h-[200px]"
                      value={schemaText}
                      onChange={(e) => setSchemaText(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleValidateSchema}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Validate
                    </Button>
                    <Button variant="outline" onClick={handleGenerateSample}>
                      <Copy className="w-4 h-4 mr-2" />
                      Generate Sample
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Authentication
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Auth Type</Label>
                    <Select
                      value={formData.auth?.kind || 'none'}
                      onValueChange={(value: AuthType) => 
                        setFormData({
                          ...formData,
                          auth: { ...formData.auth, kind: value }
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="token">Bearer Token</SelectItem>
                        <SelectItem value="hmac">HMAC Signature</SelectItem>
                        <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.auth?.kind !== 'none' && (
                    <>
                      <div>
                        <Label>Secret Reference</Label>
                        <Input
                          placeholder="vault://secrets/webhook-token"
                          value={formData.auth?.secretRef || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            auth: { ...formData.auth, secretRef: e.target.value }
                          })}
                        />
                      </div>
                      
                      <div>
                        <Label>Header Name</Label>
                        <Input
                          placeholder="Authorization"
                          value={formData.auth?.header || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            auth: { ...formData.auth, header: e.target.value }
                          })}
                        />
                      </div>
                    </>
                  )}

                  {environment === 'prod' && formData.auth?.kind === 'none' && (
                    <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                      <span className="text-sm text-destructive">
                        Authentication is required for production webhooks
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="w-5 h-5" />
                    Network Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>IP Allowlist (comma-separated)</Label>
                    <Input
                      placeholder="192.168.1.0/24, 10.0.0.0/8"
                      value={formData.network?.ipAllow?.join(', ') || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        network: {
                          ...formData.network,
                          ipAllow: e.target.value.split(',').map(ip => ip.trim()).filter(Boolean)
                        }
                      })}
                    />
                  </div>

                  <div>
                    <Label>Max Request Size (bytes)</Label>
                    <Input
                      type="number"
                      placeholder="1048576"
                      value={formData.network?.maxBytes || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        network: {
                          ...formData.network,
                          maxBytes: parseInt(e.target.value) || undefined
                        }
                      })}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="throughput" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Rate Limiting
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Requests per Second</Label>
                      <Input
                        type="number"
                        placeholder="100"
                        value={formData.rateLimit?.rps || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          rateLimit: {
                            ...formData.rateLimit,
                            rps: parseInt(e.target.value) || 0
                          }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Burst Capacity</Label>
                      <Input
                        type="number"
                        placeholder="200"
                        value={formData.rateLimit?.burst || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          rateLimit: {
                            ...formData.rateLimit,
                            burst: parseInt(e.target.value) || 0
                          }
                        })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {formData.trigger === 'batch' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      Batch Processing
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Max Items per Batch</Label>
                        <Input
                          type="number"
                          placeholder="1000"
                          value={formData.batch?.maxItems || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            batch: {
                              ...formData.batch,
                              maxItems: parseInt(e.target.value) || 0
                            }
                          })}
                        />
                      </div>
                      <div>
                        <Label>Max Concurrency</Label>
                        <Input
                          type="number"
                          placeholder="10"
                          value={formData.batch?.maxConcurrency || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            batch: {
                              ...formData.batch,
                              maxConcurrency: parseInt(e.target.value) || 0
                            }
                          })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Items per Second (optional)</Label>
                      <Input
                        type="number"
                        placeholder="50"
                        value={formData.batch?.itemsPerSecond || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          batch: {
                            ...formData.batch,
                            itemsPerSecond: parseInt(e.target.value) || undefined
                          }
                        })}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="reliability" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    Idempotency
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.idempotency?.enabled || false}
                      onCheckedChange={(checked) => setFormData({
                        ...formData,
                        idempotency: { ...formData.idempotency, enabled: checked }
                      })}
                    />
                    <Label>Enable Idempotency</Label>
                  </div>

                  {formData.idempotency?.enabled && (
                    <>
                      <div>
                        <Label>Idempotency Header</Label>
                        <Input
                          placeholder="X-Idempotency-Key"
                          value={formData.idempotency?.header || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            idempotency: {
                              ...formData.idempotency,
                              header: e.target.value
                            }
                          })}
                        />
                      </div>

                      <div>
                        <Label>Derive Key From Fields (comma-separated)</Label>
                        <Input
                          placeholder="to, message, senderId"
                          value={formData.idempotency?.deriveFrom?.join(', ') || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            idempotency: {
                              ...formData.idempotency,
                              deriveFrom: e.target.value.split(',').map(f => f.trim()).filter(Boolean)
                            }
                          })}
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5" />
                    Correlation & Dead Letter Queue
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Correlation Field</Label>
                    <Input
                      placeholder="headers.x-correlation-id"
                      value={formData.correlation?.field || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        correlation: { field: e.target.value }
                      })}
                    />
                  </div>

                  <div>
                    <Label>Dead Letter Target</Label>
                    <Input
                      placeholder="dlq.failed-messages"
                      value={formData.deadLetter?.target || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        deadLetter: {
                          ...formData.deadLetter,
                          target: e.target.value
                        }
                      })}
                    />
                  </div>

                  <div>
                    <Label>Retention Days</Label>
                    <Input
                      type="number"
                      placeholder="7"
                      value={formData.deadLetter?.retentionDays || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        deadLetter: {
                          ...formData.deadLetter,
                          retentionDays: parseInt(e.target.value) || 7
                        }
                      })}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Environment & Overrides
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Current Environment</Label>
                    <Select
                      value={environment}
                      onValueChange={(value: Environment) => setEnvironment(value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dev">Development</SelectItem>
                        <SelectItem value="stage">Staging</SelectItem>
                        <SelectItem value="prod">Production</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.lockPosition || false}
                      onCheckedChange={(checked) => setFormData({
                        ...formData,
                        lockPosition: checked
                      })}
                    />
                    <Label>Lock Node Position</Label>
                  </div>
                </CardContent>
              </Card>

              {validationErrors.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                      <AlertTriangle className="w-5 h-5" />
                      Validation Issues
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {validationErrors.map((error, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <AlertTriangle className="w-4 h-4 text-destructive" />
                          <span>{error.message}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </ScrollArea>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Configuration
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};