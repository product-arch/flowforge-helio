import React, { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, 
  X, 
  ChevronDown, 
  ChevronRight,
  Save,
  RotateCcw,
  Settings,
  Zap,
  Shield,
  Clock,
  DollarSign,
  Globe,
  AlertTriangle
} from 'lucide-react';
import { useFlow } from '@/contexts/FlowContext';
import { useToast } from '@/hooks/use-toast';
import { VendorRoutingConfiguration } from './VendorRoutingConfiguration';

interface ConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodeId: string;
}

// Comprehensive vendor lists for each channel
const VENDORS = {
  sms: [
    { id: 'twilio', name: 'Twilio', logo: '🔴', region: 'Global', tier: 'Premium' },
    { id: 'messagebird', name: 'MessageBird', logo: '🔵', region: 'Global', tier: 'Premium' },
    { id: 'msg91', name: 'MSG91', logo: '🟢', region: 'India', tier: 'Standard' },
    { id: 'textlocal', name: 'Textlocal', logo: '🟡', region: 'India', tier: 'Standard' },
    { id: 'gupshup', name: 'Gupshup', logo: '🟠', region: 'India', tier: 'Premium' },
    { id: 'kaleyra', name: 'Kaleyra', logo: '🟣', region: 'Global', tier: 'Premium' },
    { id: 'infobip', name: 'Infobip', logo: '🔷', region: 'Global', tier: 'Premium' },
    { id: 'sinch', name: 'Sinch', logo: '🟦', region: 'Global', tier: 'Premium' },
    { id: 'netcore', name: 'Netcore Cloud', logo: '⚫', region: 'India', tier: 'Standard' },
    { id: 'valueFirst', name: 'ValueFirst', logo: '🟤', region: 'India', tier: 'Standard' },
    { id: 'route_mobile', name: 'Route Mobile', logo: '🔶', region: 'India', tier: 'Premium' },
    { id: 'clickatell', name: 'Clickatell', logo: '🟨', region: 'Global', tier: 'Standard' },
    { id: 'plivo', name: 'Plivo', logo: '🟪', region: 'Global', tier: 'Premium' },
    { id: 'nexmo', name: 'Vonage (Nexmo)', logo: '⚪', region: 'Global', tier: 'Premium' },
    { id: 'aws_sns', name: 'AWS SNS', logo: '🟧', region: 'Global', tier: 'Premium' }
  ],
  whatsapp: [
    { id: 'meta', name: 'Meta (WhatsApp)', logo: '🟢', region: 'Global', tier: 'Official' },
    { id: 'twilio', name: 'Twilio WhatsApp', logo: '🔴', region: 'Global', tier: 'Premium' },
    { id: 'messagebird', name: 'MessageBird WhatsApp', logo: '🔵', region: 'Global', tier: 'Premium' },
    { id: 'gupshup', name: 'Gupshup WhatsApp', logo: '🟠', region: 'India', tier: 'Premium' },
    { id: 'kaleyra', name: 'Kaleyra WhatsApp', logo: '🟣', region: 'Global', tier: 'Premium' },
    { id: 'infobip', name: 'Infobip WhatsApp', logo: '🔷', region: 'Global', tier: 'Premium' },
    { id: 'sinch', name: 'Sinch WhatsApp', logo: '🟦', region: 'Global', tier: 'Premium' },
    { id: 'netcore', name: 'Netcore WhatsApp', logo: '⚫', region: 'India', tier: 'Standard' },
    { id: 'interakt', name: 'Interakt', logo: '🟨', region: 'India', tier: 'Standard' },
    { id: 'wati', name: 'WATI', logo: '🟪', region: 'Global', tier: 'Standard' },
    { id: 'aisensy', name: 'AiSensy', logo: '🔶', region: 'India', tier: 'Standard' },
    { id: 'yellow_ai', name: 'Yellow.ai', logo: '🟡', region: 'Global', tier: 'Premium' }
  ],
  email: [
    { id: 'sendgrid', name: 'SendGrid', logo: '🟦', region: 'Global', tier: 'Premium' },
    { id: 'mailgun', name: 'Mailgun', logo: '🟠', region: 'Global', tier: 'Premium' },
    { id: 'ses', name: 'Amazon SES', logo: '🟡', region: 'Global', tier: 'Premium' },
    { id: 'postmark', name: 'Postmark', logo: '🟨', region: 'Global', tier: 'Premium' },
    { id: 'mailchimp', name: 'Mailchimp Transactional', logo: '🟢', region: 'Global', tier: 'Standard' },
    { id: 'sparkpost', name: 'SparkPost', logo: '🔶', region: 'Global', tier: 'Premium' },
    { id: 'netcore', name: 'Netcore Email', logo: '⚫', region: 'India', tier: 'Standard' },
    { id: 'pepipost', name: 'Pepipost', logo: '🟣', region: 'India', tier: 'Standard' },
    { id: 'smtp2go', name: 'SMTP2GO', logo: '🔵', region: 'Global', tier: 'Standard' },
    { id: 'elastic_email', name: 'Elastic Email', logo: '🟪', region: 'Global', tier: 'Standard' },
    { id: 'brevo', name: 'Brevo (Sendinblue)', logo: '🔷', region: 'Global', tier: 'Premium' },
    { id: 'resend', name: 'Resend', logo: '⚪', region: 'Global', tier: 'Premium' }
  ],
  voice: [
    { id: 'twilio', name: 'Twilio Voice', logo: '🔴', region: 'Global', tier: 'Premium' },
    { id: 'vonage', name: 'Vonage Voice', logo: '🟣', region: 'Global', tier: 'Premium' },
    { id: 'plivo', name: 'Plivo Voice', logo: '🟢', region: 'Global', tier: 'Premium' },
    { id: 'kaleyra', name: 'Kaleyra Voice', logo: '🟦', region: 'Global', tier: 'Premium' },
    { id: 'exotel', name: 'Exotel', logo: '🟠', region: 'India', tier: 'Premium' },
    { id: 'knowlarity', name: 'Knowlarity', logo: '🟡', region: 'India', tier: 'Standard' },
    { id: 'ozonetel', name: 'Ozonetel', logo: '🔷', region: 'India', tier: 'Standard' },
    { id: 'aws_connect', name: 'AWS Connect', logo: '🟧', region: 'Global', tier: 'Premium' },
    { id: 'bandwidth', name: 'Bandwidth', logo: '🟪', region: 'Global', tier: 'Premium' },
    { id: 'signalwire', name: 'SignalWire', logo: '⚫', region: 'Global', tier: 'Premium' },
    { id: 'telnyx', name: 'Telnyx', logo: '🔶', region: 'Global', tier: 'Premium' }
  ],
  rcs: [
    { id: 'google', name: 'Google RCS', logo: '🟢', region: 'Global', tier: 'Official' },
    { id: 'samsung', name: 'Samsung RCS', logo: '🔵', region: 'Global', tier: 'Official' },
    { id: 'maap', name: 'MAAP', logo: '🟣', region: 'Global', tier: 'Premium' },
    { id: 'twilio', name: 'Twilio RCS', logo: '🔴', region: 'Global', tier: 'Premium' },
    { id: 'messagebird', name: 'MessageBird RCS', logo: '🔷', region: 'Global', tier: 'Premium' },
    { id: 'infobip', name: 'Infobip RCS', logo: '🟦', region: 'Global', tier: 'Premium' },
    { id: 'sinch', name: 'Sinch RCS', logo: '🟨', region: 'Global', tier: 'Premium' },
    { id: 'kaleyra', name: 'Kaleyra RCS', logo: '🟪', region: 'Global', tier: 'Premium' },
    { id: 'gupshup', name: 'Gupshup RCS', logo: '🟠', region: 'India', tier: 'Premium' },
    { id: 'netcore', name: 'Netcore RCS', logo: '⚫', region: 'India', tier: 'Standard' }
  ]
};

export const ConfigurationModal: React.FC<ConfigurationModalProps> = ({ isOpen, onClose, nodeId }) => {
  const { nodes, updateNodeData } = useFlow();
  const { toast } = useToast();
  
  const node = nodes.find(n => n.id === nodeId);
  
  const [formData, setFormData] = useState<any>({});
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  

  useEffect(() => {
    if (node) {
      setFormData({ ...node.data });
      setSelectedVendors((node.data.selectedVendors as string[]) || []);
    }
  }, [node]);

  if (!node) return null;

  const handleSave = () => {
    const updatedData = {
      ...formData,
      selectedVendors
    };
    
    updateNodeData(nodeId, updatedData);
    toast({
      title: "Configuration Saved",
      description: `${node.type} node updated successfully`,
      className: "border-status-success bg-status-success/10 text-status-success"
    });
    onClose();
  };

  const handleReset = () => {
    setFormData({ ...node.data });
    setSelectedVendors((node.data.selectedVendors as string[]) || []);
    toast({
      title: "Configuration Reset",
      description: "All changes have been reverted",
      className: "border-status-info bg-status-info/10 text-status-info"
    });
  };

  const toggleVendor = (vendorId: string) => {
    setSelectedVendors(prev => 
      prev.includes(vendorId) 
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    );
  };


  const getChannelVendors = () => {
    switch (node.type) {
      case 'sms': return VENDORS.sms;
      case 'whatsapp': return VENDORS.whatsapp;
      case 'email': return VENDORS.email;
      case 'voice': return VENDORS.voice;
      case 'rcs': return VENDORS.rcs;
      default: return [];
    }
  };

  const renderChannelConfiguration = () => {
    switch (node.type) {
      case 'vendorrouting':
        return (
          <VendorRoutingConfiguration
            node={node}
            onUpdate={(data) => setFormData(prev => ({ ...prev, ...data }))}
          />
        );

      case 'sms':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">SMS Channel Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="senderId">Sender ID</Label>
                    <Input
                      id="senderId"
                      value={formData.senderId || ''}
                      onChange={(e) => setFormData({ ...formData, senderId: e.target.value })}
                      placeholder="YOURCOMPANY"
                      className="nodrag"
                    />
                  </div>
                  <div>
                    <Label htmlFor="messageType">Message Type</Label>
                    <Select
                      value={formData.messageType || 'transactional'}
                      onValueChange={(value) => setFormData({ ...formData, messageType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="transactional">Transactional</SelectItem>
                        <SelectItem value="promotional">Promotional</SelectItem>
                        <SelectItem value="utility">Utility</SelectItem>
                        <SelectItem value="authentication">Authentication</SelectItem>
                        <SelectItem value="service_explicit">Service Explicit</SelectItem>
                        <SelectItem value="service_implicit">Service Implicit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="encoding">Encoding</Label>
                    <Select
                      value={formData.encoding || 'utf8'}
                      onValueChange={(value) => setFormData({ ...formData, encoding: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utf8">UTF-8</SelectItem>
                        <SelectItem value="unicode">Unicode</SelectItem>
                        <SelectItem value="gsm7">GSM 7-bit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={formData.priority || 'normal'}
                      onValueChange={(value) => setFormData({ ...formData, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'whatsapp':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">WhatsApp Channel Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessId">Business ID</Label>
                    <Input
                      id="businessId"
                      value={formData.businessId || ''}
                      onChange={(e) => setFormData({ ...formData, businessId: e.target.value })}
                      placeholder="Enter WhatsApp Business ID"
                      className="nodrag"
                    />
                  </div>
                  <div>
                    <Label htmlFor="wabaNumber">WABA Number</Label>
                    <Input
                      id="wabaNumber"
                      value={formData.wabaNumber || ''}
                      onChange={(e) => setFormData({ ...formData, wabaNumber: e.target.value })}
                      placeholder="+91XXXXXXXXXX"
                      className="nodrag"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="templateType">Template Type</Label>
                    <Select
                      value={formData.templateType || 'text'}
                      onValueChange={(value) => setFormData({ ...formData, templateType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="media">Media</SelectItem>
                        <SelectItem value="interactive">Interactive</SelectItem>
                        <SelectItem value="location">Location</SelectItem>
                        <SelectItem value="authentication">Authentication</SelectItem>
                        <SelectItem value="utility">Utility</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="botName">Bot Name</Label>
                    <Input
                      id="botName"
                      value={formData.botName || ''}
                      onChange={(e) => setFormData({ ...formData, botName: e.target.value })}
                      placeholder="your_bot_name"
                      className="nodrag"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'email':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Email Channel Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fromAddress">From Address</Label>
                    <Input
                      id="fromAddress"
                      value={formData.fromAddress || ''}
                      onChange={(e) => setFormData({ ...formData, fromAddress: e.target.value })}
                      placeholder="noreply@yourcompany.com"
                      className="nodrag"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fromName">From Name</Label>
                    <Input
                      id="fromName"
                      value={formData.fromName || ''}
                      onChange={(e) => setFormData({ ...formData, fromName: e.target.value })}
                      placeholder="Your Company"
                      className="nodrag"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="messageType">Message Type</Label>
                    <Select
                      value={formData.messageType || 'transactional'}
                      onValueChange={(value) => setFormData({ ...formData, messageType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="transactional">Transactional</SelectItem>
                        <SelectItem value="promotional">Promotional</SelectItem>
                        <SelectItem value="utility">Utility</SelectItem>
                        <SelectItem value="authentication">Authentication</SelectItem>
                        <SelectItem value="service">Service</SelectItem>
                        <SelectItem value="newsletter">Newsletter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="template">Template ID</Label>
                    <Input
                      id="template"
                      value={formData.template || ''}
                      onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                      placeholder="welcome_email_v1"
                      className="nodrag"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="replyTo">Reply-To Address</Label>
                  <Input
                    id="replyTo"
                    value={formData.replyTo || ''}
                    onChange={(e) => setFormData({ ...formData, replyTo: e.target.value })}
                    placeholder="support@yourcompany.com"
                    className="nodrag"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'voice':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Voice Channel Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="callerId">Caller ID</Label>
                    <Input
                      id="callerId"
                      value={formData.callerId || ''}
                      onChange={(e) => setFormData({ ...formData, callerId: e.target.value })}
                      placeholder="+1234567890"
                      className="nodrag"
                    />
                  </div>
                  <div>
                    <Label htmlFor="voiceType">Voice Type</Label>
                    <Select
                      value={formData.voiceType || 'text-to-speech'}
                      onValueChange={(value) => setFormData({ ...formData, voiceType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text-to-speech">Text-to-Speech</SelectItem>
                        <SelectItem value="pre-recorded">Pre-recorded</SelectItem>
                        <SelectItem value="interactive">Interactive (IVR)</SelectItem>
                        <SelectItem value="live">Live Agent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={formData.language || 'en'}
                      onValueChange={(value) => setFormData({ ...formData, language: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="pt">Portuguese</SelectItem>
                        <SelectItem value="it">Italian</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                        <SelectItem value="ko">Korean</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="voice">Voice</Label>
                    <Select
                      value={formData.voice || 'female'}
                      onValueChange={(value) => setFormData({ ...formData, voice: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="neutral">Neutral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="callbackUrl">Callback URL</Label>
                  <Input
                    id="callbackUrl"
                    value={formData.callbackUrl || ''}
                    onChange={(e) => setFormData({ ...formData, callbackUrl: e.target.value })}
                    placeholder="https://your-app.com/voice-callback"
                    className="nodrag"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'rcs':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">RCS Channel Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="botName">Bot Name</Label>
                    <Input
                      id="botName"
                      value={formData.botName || ''}
                      onChange={(e) => setFormData({ ...formData, botName: e.target.value })}
                      placeholder="your_rcs_bot"
                      className="nodrag"
                    />
                  </div>
                  <div>
                    <Label htmlFor="agentId">Agent ID</Label>
                    <Input
                      id="agentId"
                      value={formData.agentId || ''}
                      onChange={(e) => setFormData({ ...formData, agentId: e.target.value })}
                      placeholder="agent_12345"
                      className="nodrag"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="messageType">Message Type</Label>
                    <Select
                      value={formData.messageType || 'text'}
                      onValueChange={(value) => setFormData({ ...formData, messageType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="rich">Rich Card</SelectItem>
                        <SelectItem value="media">Media</SelectItem>
                        <SelectItem value="interactive">Interactive</SelectItem>
                        <SelectItem value="carousel">Carousel</SelectItem>
                        <SelectItem value="location">Location</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="brandId">Brand ID</Label>
                    <Input
                      id="brandId"
                      value={formData.brandId || ''}
                      onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                      placeholder="brand_12345"
                      className="nodrag"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'fallback':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Fallback Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Fallback Criteria - Radio Buttons */}
                <div>
                  <Label className="text-sm font-medium mb-4 block">Fallback Criteria</Label>
                  <RadioGroup
                    value={formData.fallbackCriteria || 'vendor_failure'}
                    onValueChange={(value) => setFormData({ ...formData, fallbackCriteria: value })}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent/50">
                      <RadioGroupItem value="vendor_failure" id="vendor_failure" />
                      <div className="flex-1">
                        <Label htmlFor="vendor_failure" className="font-medium cursor-pointer">Vendor Failure</Label>
                        <p className="text-xs text-muted-foreground">Switch when primary vendor fails to deliver</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent/50">
                      <RadioGroupItem value="timeout" id="timeout" />
                      <div className="flex-1">
                        <Label htmlFor="timeout" className="font-medium cursor-pointer">Timeout</Label>
                        <p className="text-xs text-muted-foreground">Switch after specified timeout period</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent/50">
                      <RadioGroupItem value="rate_limit" id="rate_limit" />
                      <div className="flex-1">
                        <Label htmlFor="rate_limit" className="font-medium cursor-pointer">Rate Limit Exceeded</Label>
                        <p className="text-xs text-muted-foreground">Switch when vendor rate limits are hit</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent/50">
                      <RadioGroupItem value="cost_optimization" id="cost_optimization" />
                      <div className="flex-1">
                        <Label htmlFor="cost_optimization" className="font-medium cursor-pointer">Cost Optimization</Label>
                        <p className="text-xs text-muted-foreground">Switch to lower cost vendor when available</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent/50">
                      <RadioGroupItem value="geographical_routing" id="geographical_routing" />
                      <div className="flex-1">
                        <Label htmlFor="geographical_routing" className="font-medium cursor-pointer">Geographical Routing</Label>
                        <p className="text-xs text-muted-foreground">Switch based on recipient location</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent/50">
                      <RadioGroupItem value="load_balancing" id="load_balancing" />
                      <div className="flex-1">
                        <Label htmlFor="load_balancing" className="font-medium cursor-pointer">Load Balancing</Label>
                        <p className="text-xs text-muted-foreground">Distribute load across multiple vendors</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent/50">
                      <RadioGroupItem value="smart_routing" id="smart_routing" />
                      <div className="flex-1">
                        <Label htmlFor="smart_routing" className="font-medium cursor-pointer">Smart Routing</Label>
                        <p className="text-xs text-muted-foreground">AI-based routing optimization</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent/50">
                      <RadioGroupItem value="manual_override" id="manual_override" />
                      <div className="flex-1">
                        <Label htmlFor="manual_override" className="font-medium cursor-pointer">Manual Override</Label>
                        <p className="text-xs text-muted-foreground">Manual control over vendor switching</p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* Additional Configuration based on selected criteria */}
                {formData.fallbackCriteria === 'timeout' && (
                  <div>
                    <Label htmlFor="timeoutDuration">Timeout Duration (seconds)</Label>
                    <Input
                      id="timeoutDuration"
                      type="number"
                      value={formData.timeoutDuration || '30'}
                      onChange={(e) => setFormData({ ...formData, timeoutDuration: e.target.value })}
                      placeholder="30"
                      className="nodrag"
                    />
                  </div>
                )}

                {formData.fallbackCriteria === 'rate_limit' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="rateLimit">Rate Limit (per minute)</Label>
                      <Input
                        id="rateLimit"
                        type="number"
                        value={formData.rateLimit || '100'}
                        onChange={(e) => setFormData({ ...formData, rateLimit: e.target.value })}
                        placeholder="100"
                        className="nodrag"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cooldownPeriod">Cooldown Period (minutes)</Label>
                      <Input
                        id="cooldownPeriod"
                        type="number"
                        value={formData.cooldownPeriod || '5'}
                        onChange={(e) => setFormData({ ...formData, cooldownPeriod: e.target.value })}
                        placeholder="5"
                        className="nodrag"
                      />
                    </div>
                  </div>
                )}

                {formData.fallbackCriteria === 'geographical_routing' && (
                  <div>
                    <Label htmlFor="targetRegions">Target Regions</Label>
                    <Select
                      value={formData.targetRegions || 'auto'}
                      onValueChange={(value) => setFormData({ ...formData, targetRegions: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto-detect</SelectItem>
                        <SelectItem value="north_america">North America</SelectItem>
                        <SelectItem value="europe">Europe</SelectItem>
                        <SelectItem value="asia_pacific">Asia Pacific</SelectItem>
                        <SelectItem value="india">India</SelectItem>
                        <SelectItem value="middle_east">Middle East</SelectItem>
                        <SelectItem value="africa">Africa</SelectItem>
                        <SelectItem value="south_america">South America</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="maxRetries">Max Retries</Label>
                    <Input
                      id="maxRetries"
                      type="number"
                      value={formData.maxRetries || '3'}
                      onChange={(e) => setFormData({ ...formData, maxRetries: e.target.value })}
                      placeholder="3"
                      className="nodrag"
                    />
                  </div>
                  <div>
                    <Label htmlFor="retryDelay">Retry Delay (seconds)</Label>
                    <Input
                      id="retryDelay"
                      type="number"
                      value={formData.retryDelay || '5'}
                      onChange={(e) => setFormData({ ...formData, retryDelay: e.target.value })}
                      placeholder="5"
                      className="nodrag"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const renderVendorSelection = () => {
    const channelVendors = getChannelVendors();
    
    if (channelVendors.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No vendors available for this channel type.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Available Vendors
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Click to select/deselect vendors for this {node.type} channel. Selected vendors will be highlighted.
          </p>
        </div>

        {/* Vendor Chips Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {channelVendors.map((vendor) => (
            <div
              key={vendor.id}
              className={`
                flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all hover:scale-105
                ${selectedVendors.includes(vendor.id) 
                  ? 'border-primary bg-primary text-primary-foreground shadow-md' 
                  : 'border-border hover:border-primary/50 hover:bg-accent/30'
                }
              `}
              onClick={() => toggleVendor(vendor.id)}
            >
              <span className="text-2xl mb-2">{vendor.logo}</span>
              <div className="text-center">
                <div className={`font-medium text-xs mb-1 ${selectedVendors.includes(vendor.id) ? 'text-primary-foreground' : ''}`}>
                  {vendor.name}
                </div>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Globe className="w-3 h-3" />
                  <span className={`text-xs ${selectedVendors.includes(vendor.id) ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    {vendor.region}
                  </span>
                </div>
                <Badge 
                  variant={selectedVendors.includes(vendor.id) ? "secondary" : (vendor.tier === 'Official' ? 'default' : 'outline')}
                  className="text-xs"
                >
                  {vendor.tier}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Vendors Summary */}
        {selectedVendors.length > 0 && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">Selected Vendors ({selectedVendors.length})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedVendors.map(vendorId => {
                const vendor = channelVendors.find(v => v.id === vendorId);
                return vendor ? (
                  <Badge key={vendorId} variant="outline" className="text-xs">
                    {vendor.logo} {vendor.name}
                  </Badge>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* Vendor Selection Warning */}
        {selectedVendors.length === 0 && (
          <div className="bg-status-warning/10 border border-status-warning/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-status-warning" />
              <span className="font-medium text-sm text-status-warning">No Vendors Selected</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Please select at least one vendor to enable message routing for this channel.
            </p>
          </div>
        )}
      </div>
    );
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Configure {node.type.charAt(0).toUpperCase() + node.type.slice(1)} Node
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-6 p-6">
          {/* Channel Configuration */}
          {renderChannelConfiguration()}
          
          {/* Vendor Selection - Only show for channel nodes */}
          {['sms', 'whatsapp', 'email', 'voice', 'rcs'].includes(node.type) && (
            <>
              <Separator />
              {renderVendorSelection()}
            </>
          )}
        </div>
        
        <Separator />
        
        <div className="flex justify-between items-center pt-4">
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-gradient-primary">
              <Save className="w-4 h-4 mr-2" />
              Save Configuration
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};