import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Key, Webhook, Zap, Save, X } from 'lucide-react';
import type { VendorIntegration } from '@/types/vendor-integration';
import { useToast } from '@/hooks/use-toast';

interface VendorConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  integration: VendorIntegration | null;
  onSave: (integration: VendorIntegration, changes: Partial<VendorIntegration>) => void;
}

export const VendorConfigurationModal: React.FC<VendorConfigurationModalProps> = ({
  isOpen,
  onClose,
  integration,
  onSave
}) => {
  const [loading, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [formData, setFormData] = useState<Partial<VendorIntegration>>({});
  const { toast } = useToast();

  React.useEffect(() => {
    if (integration) {
      setFormData(integration);
    }
  }, [integration]);

  const handleSave = async () => {
    if (!integration) return;
    
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSave(integration, formData);
      setHasChanges(false);
      
      toast({
        title: "Configuration Saved",
        description: `${integration.vendor.name} ${integration.channel} configuration updated successfully`,
        className: "border-status-success bg-status-success/10 text-status-success"
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save configuration. Please try again.",
        className: "border-status-error bg-status-error/10 text-status-error"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  if (!integration) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <img 
              src={integration.vendor.logo} 
              alt={integration.vendor.name}
              className="w-8 h-8 rounded object-contain"
            />
            Configure {integration.vendor.name} - {integration.channel.toUpperCase()}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="credentials" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="credentials" className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              Credentials
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="flex items-center gap-2">
              <Webhook className="w-4 h-4" />
              Webhooks
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Advanced
            </TabsTrigger>
          </TabsList>

          <TabsContent value="credentials" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API Credentials</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      value={formData.credentials?.apiKey || ''}
                      onChange={(e) => handleFieldChange('credentials', {
                        ...formData.credentials,
                        apiKey: e.target.value
                      })}
                      placeholder="Enter API key"
                    />
                  </div>
                  <div>
                    <Label htmlFor="secretKey">Secret Key</Label>
                    <Input
                      id="secretKey"
                      type="password"
                      value={formData.credentials?.secretKey || ''}
                      onChange={(e) => handleFieldChange('credentials', {
                        ...formData.credentials,
                        secretKey: e.target.value
                      })}
                      placeholder="Enter secret key"
                    />
                  </div>
                </div>
                
                {integration.channel === 'whatsapp' && (
                  <div>
                    <Label htmlFor="phoneNumberId">Phone Number ID</Label>
                    <Input
                      id="phoneNumberId"
                      value={formData.credentials?.phoneNumberId || ''}
                      onChange={(e) => handleFieldChange('credentials', {
                        ...formData.credentials,
                        phoneNumberId: e.target.value
                      })}
                      placeholder="Enter WhatsApp Phone Number ID"
                    />
                  </div>
                )}
                
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <div className="font-medium">Credential Status</div>
                    <div className="text-sm text-muted-foreground">
                      Last verified: {integration.credentials?.lastVerified?.toLocaleDateString() || 'Never'}
                    </div>
                  </div>
                  <Badge variant={integration.credentials?.isValid ? 'default' : 'destructive'}>
                    {integration.credentials?.isValid ? 'Valid' : 'Invalid'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Rate Limiting</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tpsLimit">TPS Limit</Label>
                    <Input
                      id="tpsLimit"
                      type="number"
                      value={formData.configuration?.tpsLimit || ''}
                      onChange={(e) => handleFieldChange('configuration', {
                        ...formData.configuration,
                        tpsLimit: parseInt(e.target.value)
                      })}
                      placeholder="Transactions per second"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dailyLimit">Daily Message Limit</Label>
                    <Input
                      id="dailyLimit"
                      type="number"
                      value={formData.configuration?.dailyLimit || ''}
                      onChange={(e) => handleFieldChange('configuration', {
                        ...formData.configuration,
                        dailyLimit: parseInt(e.target.value)
                      })}
                      placeholder="Messages per day"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Enable Auto-Retry</div>
                    <div className="text-sm text-muted-foreground">
                      Automatically retry failed messages
                    </div>
                  </div>
                  <Switch
                    checked={formData.configuration?.enableRetry || false}
                    onCheckedChange={(checked) => handleFieldChange('configuration', {
                      ...formData.configuration,
                      enableRetry: checked
                    })}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Health Monitoring</div>
                    <div className="text-sm text-muted-foreground">
                      Track performance metrics
                    </div>
                  </div>
                  <Switch
                    checked={formData.configuration?.healthMonitoring || false}
                    onCheckedChange={(checked) => handleFieldChange('configuration', {
                      ...formData.configuration,
                      healthMonitoring: checked
                    })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Webhook Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    value={formData.configuration?.webhookUrl || ''}
                    onChange={(e) => handleFieldChange('configuration', {
                      ...formData.configuration,
                      webhookUrl: e.target.value
                    })}
                    placeholder="https://your-domain.com/webhook"
                  />
                </div>
                
                <div>
                  <Label htmlFor="webhookSecret">Webhook Secret</Label>
                  <Input
                    id="webhookSecret"
                    type="password"
                    value={formData.configuration?.webhookSecret || ''}
                    onChange={(e) => handleFieldChange('configuration', {
                      ...formData.configuration,
                      webhookSecret: e.target.value
                    })}
                    placeholder="Webhook verification secret"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="customConfig">Custom Configuration</Label>
                  <Textarea
                    id="customConfig"
                    value={formData.configuration?.customConfig || ''}
                    onChange={(e) => handleFieldChange('configuration', {
                      ...formData.configuration,
                      customConfig: e.target.value
                    })}
                    placeholder="Additional JSON configuration..."
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex items-center gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!hasChanges || loading}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};