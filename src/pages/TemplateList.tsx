import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { ArrowLeft, Grid, List, MoreVertical, Eye, User, Settings, CreditCard, FileDown, FileUp, Copy, History, LogOut } from 'lucide-react';
import { useTheme, Theme } from '@/contexts/ThemeContext';
import { PersonalInfoModal, AccountSettingsModal, BillingModal } from '@/components/flow/AccountModals';
import { useToast } from '@/hooks/use-toast';
import { THEMES } from '@/constants/themes';

interface Template {
  id: string;
  name: string;
  channel: 'sms' | 'rcs' | 'whatsapp' | 'email' | 'voice';
  messageType: 'promo' | 'auth' | 'transactional' | 'utility' | 'service_explicit' | 'service_implicit';
  status: 'active' | 'inactive';
  dateCreated: string;
  content: string;
}

const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Welcome SMS',
    channel: 'sms',
    messageType: 'auth',
    status: 'active',
    dateCreated: '2024-01-15',
    content: 'Welcome to FlowForge! Your account has been successfully created. Start building your first communication flow today.'
  },
  {
    id: '2',
    name: 'Order Confirmation',
    channel: 'email',
    messageType: 'transactional',
    status: 'active',
    dateCreated: '2024-01-10',
    content: 'Thank you for your order! Your order #{{order_id}} has been confirmed and will be processed within 24 hours.'
  },
  {
    id: '3',
    name: 'Promotional WhatsApp',
    channel: 'whatsapp',
    messageType: 'promo',
    status: 'inactive',
    dateCreated: '2024-01-08',
    content: '🎉 Special offer just for you! Get 30% off on your next purchase. Use code SAVE30. Valid until {{expiry_date}}!'
  },
  {
    id: '4',
    name: 'Service Update RCS',
    channel: 'rcs',
    messageType: 'service_explicit',
    status: 'active',
    dateCreated: '2024-01-05',
    content: 'Your service will be temporarily unavailable on {{date}} from {{start_time}} to {{end_time}} for maintenance.'
  },
  {
    id: '5',
    name: 'Voice Reminder',
    channel: 'voice',
    messageType: 'utility',
    status: 'active',
    dateCreated: '2024-01-03',
    content: 'Hello, this is a reminder for your appointment on {{date}} at {{time}}. Please call us to confirm or reschedule.'
  }
];

const TemplateList: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme, mode, setMode } = useTheme();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [personalInfoOpen, setPersonalInfoOpen] = useState(false);
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(false);
  const [billingOpen, setBillingOpen] = useState(false);


  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    toast({
      title: "Theme Changed",
      description: `Switched to ${THEMES.find(t => t.value === newTheme)?.name}`,
      className: "border-status-success bg-status-success/10 text-status-success"
    });
  };

  const handleExport = () => {
    toast({
      title: "Export Started", 
      description: "Templates are being exported...",
    });
  };

  const handleImport = () => {
    toast({
      title: "Import Started",
      description: "Ready to import templates...",
    });
  };

  const getChannelColor = (channel: string) => {
    const colors = {
      sms: 'bg-status-success/10 text-status-success border-status-success/20',
      rcs: 'bg-status-info/10 text-status-info border-status-info/20',
      whatsapp: 'bg-status-success/10 text-status-success border-status-success/20',
      email: 'bg-status-info/10 text-status-info border-status-info/20',
      voice: 'bg-status-warning/10 text-status-warning border-status-warning/20'
    };
    return colors[channel as keyof typeof colors] || 'bg-muted/10 text-muted-foreground';
  };

  const getMessageTypeColor = (type: string) => {
    const colors = {
      promo: 'bg-primary/10 text-primary border-primary/20',
      auth: 'bg-status-success/10 text-status-success border-status-success/20',
      transactional: 'bg-status-info/10 text-status-info border-status-info/20',
      utility: 'bg-status-warning/10 text-status-warning border-status-warning/20',
      service_explicit: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      service_implicit: 'bg-pink-500/10 text-pink-500 border-pink-500/20'
    };
    return colors[type as keyof typeof colors] || 'bg-muted/10 text-muted-foreground';
  };

  const formatMessageType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleViewTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
        {/* Header with island navbar style */}
        <header className="sticky top-0 z-50 pt-4">
          <div className="container mx-auto px-6">
            <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-lg shadow-black/5 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                      <List className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                      Template List
                    </h1>
                  </div>
                  
                  <nav className="hidden md:flex items-center gap-6">
                    <Button variant="ghost" className="text-sm" onClick={() => navigate('/')}>Home</Button>
                    <Button variant="ghost" className="text-sm" onClick={() => navigate('/templates')}>Templates</Button>
                  </nav>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* View Toggle */}
                  <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-1 mr-2">
                    <Button
                      variant={viewMode === 'card' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('card')}
                      className="h-8"
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="h-8"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Settings Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem onClick={handleExport}>
                        <FileDown className="w-4 h-4 mr-2" />
                        Export Templates
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleImport}>
                        <FileUp className="w-4 h-4 mr-2" />
                        Import Templates
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Account Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <User className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => setPersonalInfoOpen(true)}>
                        <User className="w-4 h-4 mr-2" />
                        Personal Info
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setAccountSettingsOpen(true)}>
                        <Settings className="w-4 h-4 mr-2" />
                        Account Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setBillingOpen(true)}>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Billing
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      
                      
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive">
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="container mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Message Templates</h2>
              <p className="text-muted-foreground">
                Manage your business message templates across all communication channels
              </p>
            </div>

            {viewMode === 'card' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockTemplates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg truncate">{template.name}</CardTitle>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewTemplate(template)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex gap-2">
                          <Badge className={getChannelColor(template.channel)}>
                            {template.channel.toUpperCase()}
                          </Badge>
                          <Badge className={getMessageTypeColor(template.messageType)}>
                            {formatMessageType(template.messageType)}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <Badge variant={template.status === 'active' ? 'default' : 'secondary'}>
                            {template.status}
                          </Badge>
                          <span className="text-muted-foreground">{template.dateCreated}</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {template.content}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Channel</TableHead>
                      <TableHead>Message Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date Created</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTemplates.map((template, index) => (
                      <motion.tr
                        key={template.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="border-b transition-colors hover:bg-muted/50"
                      >
                        <TableCell className="font-medium">{template.name}</TableCell>
                        <TableCell>
                          <Badge className={getChannelColor(template.channel)}>
                            {template.channel.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getMessageTypeColor(template.messageType)}>
                            {formatMessageType(template.messageType)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={template.status === 'active' ? 'default' : 'secondary'}>
                            {template.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{template.dateCreated}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewTemplate(template)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}
          </motion.div>
        </main>

        {/* View Template Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Eye className="w-5 h-5 text-primary" />
                </div>
                {selectedTemplate?.name}
              </DialogTitle>
            </DialogHeader>
            {selectedTemplate && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Badge className={getChannelColor(selectedTemplate.channel)}>
                    {selectedTemplate.channel.toUpperCase()}
                  </Badge>
                  <Badge className={getMessageTypeColor(selectedTemplate.messageType)}>
                    {formatMessageType(selectedTemplate.messageType)}
                  </Badge>
                  <Badge variant={selectedTemplate.status === 'active' ? 'default' : 'secondary'}>
                    {selectedTemplate.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Created: {selectedTemplate.dateCreated}
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Template Content:</h4>
                  <p className="text-sm whitespace-pre-wrap">{selectedTemplate.content}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <PersonalInfoModal isOpen={personalInfoOpen} onClose={() => setPersonalInfoOpen(false)} />
        <AccountSettingsModal isOpen={accountSettingsOpen} onClose={() => setAccountSettingsOpen(false)} />
        <BillingModal isOpen={billingOpen} onClose={() => setBillingOpen(false)} />
    </div>
  );
};

export default TemplateList;