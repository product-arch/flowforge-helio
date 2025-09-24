import React, { useState, useEffect } from 'react';
import { X, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFlow } from '@/contexts/FlowContext';
import { useToast } from '@/hooks/use-toast';
import { VendorSelector } from './VendorSelector';
import { SuccessCriteriaSelector } from './SuccessCriteriaSelector';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ConfigurationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  nodeId: string;
}

export const ConfigurationSidebar: React.FC<ConfigurationSidebarProps> = ({
  isOpen,
  onClose,
  nodeId
}) => {
  const { nodes, updateNodeData } = useFlow();
  const { toast } = useToast();
  
  const node = nodes.find(n => n.id === nodeId);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (node) {
      setFormData({ ...node.data });
    }
  }, [node]);

  if (!node || !isOpen) return null;

  const handleSave = () => {
    updateNodeData(nodeId, formData);
    
    toast({
      title: "Configuration saved",
      description: "Node configuration has been updated successfully.",
    });
    
    onClose();
  };

  const handleReset = () => {
    if (node) {
      setFormData({ ...node.data });
    }
  };

  const isChannelNode = ['sms', 'whatsapp', 'email', 'voice', 'rcs'].includes(node.type);

  const renderChannelConfiguration = () => (
    <div className="space-y-6">
      {/* Vendor Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Vendor Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <VendorSelector
            channelType={node.type as 'sms' | 'whatsapp' | 'email' | 'voice' | 'rcs'}
            selectedVendor={formData.selectedVendor}
            onVendorChange={(vendor) => setFormData(prev => ({ ...prev, selectedVendor: vendor }))}
          />
        </CardContent>
      </Card>

      {/* Success Criteria */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Success Criteria</CardTitle>
        </CardHeader>
        <CardContent>
          <SuccessCriteriaSelector
            channelType={node.type as 'sms' | 'whatsapp' | 'email' | 'voice' | 'rcs'}
            selectedCriteria={formData.successCriteria}
            onCriteriaChange={(criteria) => setFormData(prev => ({ ...prev, successCriteria: criteria }))}
          />
        </CardContent>
      </Card>

      {/* Channel-specific settings */}
      {renderChannelSpecificSettings()}
    </div>
  );

  const renderChannelSpecificSettings = () => {
    switch (node.type) {
      case 'sms':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">SMS Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="senderId">Sender ID</Label>
                <Input
                  id="senderId"
                  value={formData.senderId || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, senderId: e.target.value }))}
                  placeholder="BRAND"
                />
              </div>
              <div>
                <Label htmlFor="messageType">Message Type</Label>
                <Select
                  value={formData.messageType || 'transactional'}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, messageType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transactional">Transactional</SelectItem>
                    <SelectItem value="promotional">Promotional</SelectItem>
                    <SelectItem value="otp">OTP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="template">Message Template</Label>
                <Textarea
                  id="template"
                  value={formData.template || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, template: e.target.value }))}
                  placeholder="Hi {{name}}, your message here..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        );

      case 'email':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Email Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fromAddress">From Address</Label>
                <Input
                  id="fromAddress"
                  value={formData.fromAddress || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, fromAddress: e.target.value }))}
                  placeholder="noreply@company.com"
                />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Welcome to our platform!"
                />
              </div>
              <div>
                <Label htmlFor="emailTemplate">Email Template</Label>
                <Select
                  value={formData.emailTemplate || ''}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, emailTemplate: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="welcome">Welcome Email</SelectItem>
                    <SelectItem value="notification">Notification</SelectItem>
                    <SelectItem value="promotional">Promotional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        );

      case 'whatsapp':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">WhatsApp Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="businessId">Business Account ID</Label>
                <Input
                  id="businessId"
                  value={formData.businessId || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, businessId: e.target.value }))}
                  placeholder="WABA_ID"
                />
              </div>
              <div>
                <Label htmlFor="wabaNumber">WhatsApp Number</Label>
                <Input
                  id="wabaNumber"
                  value={formData.wabaNumber || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, wabaNumber: e.target.value }))}
                  placeholder="+1234567890"
                />
              </div>
              <div>
                <Label htmlFor="templateType">Template Type</Label>
                <Select
                  value={formData.templateType || 'text'}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, templateType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="interactive">Interactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        );

      case 'voice':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Voice Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="callerId">Caller ID</Label>
                <Input
                  id="callerId"
                  value={formData.callerId || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, callerId: e.target.value }))}
                  placeholder="+1234567890"
                />
              </div>
              <div>
                <Label htmlFor="voiceType">Voice Type</Label>
                <Select
                  value={formData.voiceType || 'text-to-speech'}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, voiceType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text-to-speech">Text-to-Speech</SelectItem>
                    <SelectItem value="pre-recorded">Pre-recorded</SelectItem>
                    <SelectItem value="interactive">Interactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="message">Voice Message</Label>
                <Textarea
                  id="message"
                  value={formData.message || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Hello {{name}}, this is your message..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  const renderBasicConfiguration = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Basic Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="label">Node Label</Label>
          <Input
            id="label"
            value={formData.label || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
            placeholder="Enter node label"
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter node description"
            rows={2}
          />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={`fixed top-0 right-0 h-full w-96 bg-background border-l border-border shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Configure {node.type.charAt(0).toUpperCase() + node.type.slice(1)}</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="w-8 h-8 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="h-[calc(100vh-120px)]">
        <div className="p-4 space-y-6">
          {isChannelNode ? renderChannelConfiguration() : renderBasicConfiguration()}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
        <div className="flex gap-2">
          <Button onClick={handleSave} className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};