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
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
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
  const [expandedVendorSections, setExpandedVendorSections] = useState(new Set(['premium']));

  useEffect(() => {
    if (node) {
      setFormData({ ...node.data });
      setSelectedVendors(node.data.selectedVendors || []);
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
    setSelectedVendors(node.data.selectedVendors || []);
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

  const toggleVendorSection = (section: string) => {
    const newExpanded = new Set(expandedVendorSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedVendorSections(newExpanded);
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

  const channelVendors = getChannelVendors();
  const vendorsByTier = {
    premium: channelVendors.filter(v => v.tier === 'Premium' || v.tier === 'Official'),
    standard: channelVendors.filter(v => v.tier === 'Standard')
  };

  const renderChannelConfiguration = () => {
    switch (node.type) {
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

      default:
        return null;
    }
  };

  const renderVendorSelection = () => {
    if (!['sms', 'whatsapp', 'email', 'voice', 'rcs'].includes(node.type)) {
      return null;
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            Vendor Selection
            <Badge variant="secondary">
              {selectedVendors.length} selected
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Premium/Official Vendors */}
          <Collapsible 
            open={expandedVendorSections.has('premium')}
            onOpenChange={() => toggleVendorSection('premium')}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span className="font-medium">Premium & Official Vendors</span>
                <Badge variant="outline" className="text-xs">
                  {vendorsByTier.premium.length} available
                </Badge>
              </div>
              {expandedVendorSections.has('premium') ? 
                <ChevronDown className="w-4 h-4" /> : 
                <ChevronRight className="w-4 h-4" />
              }
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <div className="grid grid-cols-1 gap-2">
                {vendorsByTier.premium.map((vendor) => (
                  <div
                    key={vendor.id}
                    className={`
                      flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all
                      ${selectedVendors.includes(vendor.id) 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50 hover:bg-accent/30'
                      }
                    `}
                    onClick={() => toggleVendor(vendor.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedVendors.includes(vendor.id)}
                        onChange={() => {}} // Handled by parent onClick
                        className="pointer-events-none"
                      />
                      <span className="text-lg">{vendor.logo}</span>
                      <div>
                        <div className="font-medium text-sm">{vendor.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <Globe className="w-3 h-3" />
                          {vendor.region}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={vendor.tier === 'Official' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {vendor.tier}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Standard Vendors */}
          {vendorsByTier.standard.length > 0 && (
            <Collapsible 
              open={expandedVendorSections.has('standard')}
              onOpenChange={() => toggleVendorSection('standard')}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="font-medium">Standard Vendors</span>
                  <Badge variant="outline" className="text-xs">
                    {vendorsByTier.standard.length} available
                  </Badge>
                </div>
                {expandedVendorSections.has('standard') ? 
                  <ChevronDown className="w-4 h-4" /> : 
                  <ChevronRight className="w-4 h-4" />
                }
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3">
                <div className="grid grid-cols-1 gap-2">
                  {vendorsByTier.standard.map((vendor) => (
                    <div
                      key={vendor.id}
                      className={`
                        flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all
                        ${selectedVendors.includes(vendor.id) 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50 hover:bg-accent/30'
                        }
                      `}
                      onClick={() => toggleVendor(vendor.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedVendors.includes(vendor.id)}
                          onChange={() => {}} // Handled by parent onClick
                          className="pointer-events-none"
                        />
                        <span className="text-lg">{vendor.logo}</span>
                        <div>
                          <div className="font-medium text-sm">{vendor.name}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2">
                            <Globe className="w-3 h-3" />
                            {vendor.region}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {vendor.tier}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Vendor Selection Summary */}
          {selectedVendors.length > 0 && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">Selected Vendors</span>
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
        </CardContent>
      </Card>
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
        
        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="vendors">Vendors</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4 mt-6">
              {renderChannelConfiguration()}
            </TabsContent>
            
            <TabsContent value="vendors" className="space-y-4 mt-6">
              {renderVendorSelection()}
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Advanced Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="timeout">Timeout (seconds)</Label>
                      <Input
                        id="timeout"
                        type="number"
                        value={formData.timeout || ''}
                        onChange={(e) => setFormData({ ...formData, timeout: parseInt(e.target.value) })}
                        placeholder="30"
                        className="nodrag"
                      />
                    </div>
                    <div>
                      <Label htmlFor="retryAttempts">Retry Attempts</Label>
                      <Input
                        id="retryAttempts"
                        type="number"
                        value={formData.retryAttempts || ''}
                        onChange={(e) => setFormData({ ...formData, retryAttempts: parseInt(e.target.value) })}
                        placeholder="3"
                        className="nodrag"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enableFallback"
                        checked={formData.enableFallback || false}
                        onCheckedChange={(checked) => setFormData({ ...formData, enableFallback: checked })}
                      />
                      <Label htmlFor="enableFallback">Enable Fallback Routing</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enableDeliveryReports"
                        checked={formData.enableDeliveryReports || false}
                        onCheckedChange={(checked) => setFormData({ ...formData, enableDeliveryReports: checked })}
                      />
                      <Label htmlFor="enableDeliveryReports">Enable Delivery Reports</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enableAnalytics"
                        checked={formData.enableAnalytics || true}
                        onCheckedChange={(checked) => setFormData({ ...formData, enableAnalytics: checked })}
                      />
                      <Label htmlFor="enableAnalytics">Enable Analytics Tracking</Label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="webhookUrl">Webhook URL</Label>
                    <Input
                      id="webhookUrl"
                      value={formData.webhookUrl || ''}
                      onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
                      placeholder="https://your-app.com/webhooks/delivery-status"
                      className="nodrag"
                    />
                  </div>

                  <div>
                    <Label htmlFor="customHeaders">Custom Headers (JSON)</Label>
                    <Textarea
                      id="customHeaders"
                      value={formData.customHeaders || ''}
                      onChange={(e) => setFormData({ ...formData, customHeaders: e.target.value })}
                      placeholder='{"X-Custom-Header": "value"}'
                      className="nodrag font-mono text-sm"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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