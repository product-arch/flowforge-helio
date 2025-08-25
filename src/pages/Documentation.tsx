import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PersonalInfoModal, AccountSettingsModal, BillingModal } from '@/components/flow/AccountModals';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Home,
  Search,
  ChevronRight,
  ChevronDown,
  Copy,
  ExternalLink,
  Code,
  Play,
  Book,
  Zap,
  GitBranch,
  MessageSquare,
  BarChart3,
  Webhook,
  Database,
  Shield,
  Globe,
  CheckCircle,
  AlertTriangle,
  Info,
  Settings,
  FileText,
  Terminal,
  Layers,
  User,
  Bell,
  Moon,
  Sun,
  Keyboard,
  LogOut,
  Palette,
  CreditCard
} from 'lucide-react';
import { useTheme, Theme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';

const themes: Array<{ value: Theme; label: string; color: string }> = [
  { value: 'blue', label: 'Professional Blue', color: 'bg-blue-500' },
  { value: 'emerald', label: 'Growth Green', color: 'bg-emerald-500' },
  { value: 'purple', label: 'Creative Purple', color: 'bg-purple-500' },
  { value: 'orange', label: 'Energy Orange', color: 'bg-orange-500' },
  { value: 'rose', label: 'Warm Rose', color: 'bg-rose-500' },
  { value: 'indigo', label: 'Deep Indigo', color: 'bg-indigo-500' },
  { value: 'solarized-osaka', label: 'Solarized Osaka', color: 'bg-teal-600' },
];

interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  title: string;
  description: string;
  category: string;
  tags?: string[];
  deprecated?: boolean;
}

interface CodeExample {
  language: string;
  code: string;
}

const apiEndpoints: ApiEndpoint[] = [
  // Flows API
  {
    id: 'list-flows',
    method: 'GET',
    path: '/flows',
    title: 'List Flows',
    description: 'Retrieve a paginated list of communication flows',
    category: 'Flows'
  },
  {
    id: 'create-flow',
    method: 'POST',
    path: '/flows',
    title: 'Create Flow',
    description: 'Create a new communication flow',
    category: 'Flows'
  },
  {
    id: 'get-flow',
    method: 'GET',
    path: '/flows/{flow_id}',
    title: 'Get Flow',
    description: 'Retrieve a specific flow by ID',
    category: 'Flows'
  },
  {
    id: 'update-flow',
    method: 'PUT',
    path: '/flows/{flow_id}',
    title: 'Update Flow',
    description: 'Update an existing flow configuration',
    category: 'Flows'
  },
  {
    id: 'activate-flow',
    method: 'POST',
    path: '/flows/{flow_id}/activate',
    title: 'Activate Flow',
    description: 'Activate a flow to start processing messages',
    category: 'Flows'
  },
  {
    id: 'simulate-flow',
    method: 'POST',
    path: '/flows/{flow_id}/simulate',
    title: 'Simulate Flow',
    description: 'Test a flow configuration without sending actual messages',
    category: 'Flows'
  },
  // Messages API
  {
    id: 'send-message',
    method: 'POST',
    path: '/flows/{flow_id}/messages',
    title: 'Send Message',
    description: 'Send a message through a specific flow',
    category: 'Messages'
  },
  {
    id: 'get-message',
    method: 'GET',
    path: '/messages/{message_id}',
    title: 'Get Message Status',
    description: 'Retrieve the current status of a message',
    category: 'Messages'
  },
  {
    id: 'bulk-send',
    method: 'POST',
    path: '/flows/{flow_id}/messages/bulk',
    title: 'Bulk Send Messages',
    description: 'Send multiple messages in a single request',
    category: 'Messages'
  },
  // Vendors API
  {
    id: 'list-vendors',
    method: 'GET',
    path: '/vendors',
    title: 'List Vendors',
    description: 'Retrieve all configured vendors',
    category: 'Vendors'
  },
  {
    id: 'get-vendor-health',
    method: 'GET',
    path: '/vendors/{vendor_id}/health',
    title: 'Get Vendor Health',
    description: 'Get real-time health status for a vendor',
    category: 'Vendors'
  },
  // Analytics API
  {
    id: 'flow-analytics',
    method: 'GET',
    path: '/flows/{flow_id}/analytics',
    title: 'Get Flow Analytics',
    description: 'Retrieve analytics data for a specific flow',
    category: 'Analytics'
  },
  {
    id: 'global-analytics',
    method: 'GET',
    path: '/analytics',
    title: 'Get Global Analytics',
    description: 'Retrieve analytics across all flows',
    category: 'Analytics'
  },
  // Webhooks API
  {
    id: 'list-webhooks',
    method: 'GET',
    path: '/webhooks',
    title: 'List Webhooks',
    description: 'Retrieve all configured webhooks',
    category: 'Webhooks'
  },
  {
    id: 'create-webhook',
    method: 'POST',
    path: '/webhooks',
    title: 'Create Webhook',
    description: 'Create a new webhook endpoint',
    category: 'Webhooks'
  }
];

const codeExamples: Record<string, CodeExample[]> = {
  'send-message': [
    {
      language: 'curl',
      code: `curl -X POST "https://api.flowforge.com/v1/flows/flow_123/messages" \\
  -H "Authorization: Bearer your-api-token" \\
  -H "Content-Type: application/json" \\
  -d '{
    "recipient": "+1234567890",
    "message": {
      "text": "Your order #12345 has been confirmed!",
      "template_id": "order_confirmation"
    },
    "metadata": {
      "campaign_id": "ORDER_CONFIRMATIONS",
      "priority": "high"
    }
  }'`
    },
    {
      language: 'javascript',
      code: `const response = await fetch('https://api.flowforge.com/v1/flows/flow_123/messages', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your-api-token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    recipient: '+1234567890',
    message: {
      text: 'Your order #12345 has been confirmed!',
      template_id: 'order_confirmation'
    },
    metadata: {
      campaign_id: 'ORDER_CONFIRMATIONS',
      priority: 'high'
    }
  })
});

const result = await response.json();
console.log('Message sent:', result.message_id);`
    },
    {
      language: 'python',
      code: `import requests

response = requests.post(
    'https://api.flowforge.com/v1/flows/flow_123/messages',
    headers={
        'Authorization': 'Bearer your-api-token',
        'Content-Type': 'application/json'
    },
    json={
        'recipient': '+1234567890',
        'message': {
            'text': 'Your order #12345 has been confirmed!',
            'template_id': 'order_confirmation'
        },
        'metadata': {
            'campaign_id': 'ORDER_CONFIRMATIONS',
            'priority': 'high'
        }
    }
)

result = response.json()
print(f"Message sent: {result['message_id']}")`
    }
  ]
};

const Documentation: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('curl');
  const [expandedSections, setExpandedSections] = useState(new Set(['getting-started', 'flows']));
  const [personalInfoOpen, setPersonalInfoOpen] = useState(false);
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(false);
  const [billingOpen, setBillingOpen] = useState(false);
  const { theme, mode, setTheme, setMode } = useTheme();
  const { toast } = useToast();

  useEffect(() => {
    // Set default selected endpoint
    if (!selectedEndpoint && apiEndpoints.length > 0) {
      setSelectedEndpoint(apiEndpoints[0]);
    }
  }, [selectedEndpoint]);

  const filteredEndpoints = apiEndpoints.filter(endpoint =>
    endpoint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    endpoint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    endpoint.path.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = Array.from(new Set(filteredEndpoints.map(endpoint => endpoint.category)));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Code example copied successfully",
      className: "border-status-success bg-status-success/10 text-status-success"
    });
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    toast({
      title: "Theme Changed",
      description: `Switched to ${themes.find(t => t.value === newTheme)?.label}`,
      className: "border-status-success bg-status-success/10 text-status-success"
    });
  };

  const handleSettingClick = (setting: string) => {
    toast({
      title: "Setting Updated",
      description: `${setting} setting has been updated`,
      className: "border-status-info bg-status-info/10 text-status-info"
    });
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400';
      case 'POST': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'PUT': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'DELETE': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Flows': return GitBranch;
      case 'Messages': return MessageSquare;
      case 'Vendors': return Settings;
      case 'Analytics': return BarChart3;
      case 'Webhooks': return Webhook;
      default: return FileText;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Hub
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Book className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold">API Documentation</h1>
                  <p className="text-sm text-muted-foreground">FlowForge Communication Platform</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-status-success/10 text-status-success border-status-success">
                v1.0.0
              </Badge>
              
              <Button variant="outline" size="sm" onClick={() => navigate('/api-console')}>
                <Terminal className="w-4 h-4 mr-2" />
                API Console
              </Button>
              
              {/* Settings Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => handleSettingClick('Notifications')}>
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSettingClick('Language')}>
                    <Globe className="w-4 h-4 mr-2" />
                    Language & Region
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSettingClick('Privacy')}>
                    <Shield className="w-4 h-4 mr-2" />
                    Privacy & Security
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSettingClick('Data')}>
                    <Database className="w-4 h-4 mr-2" />
                    Data Management
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSettingClick('Shortcuts')}>
                    <Keyboard className="w-4 h-4 mr-2" />
                    Keyboard Shortcuts
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
                    {mode === 'light' ? <Moon className="w-4 h-4 mr-2" /> : <Sun className="w-4 h-4 mr-2" />}
                    {mode === 'light' ? 'Dark Mode' : 'Light Mode'}
                  </DropdownMenuItem>
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
                  
                  <div className="px-2 py-1">
                    <div className="text-xs font-medium text-muted-foreground mb-2">Themes</div>
                    <div className="grid grid-cols-3 gap-1">
                      {themes.map((themeOption) => (
                        <button
                          key={themeOption.value}
                          onClick={() => handleThemeChange(themeOption.value)}
                          className={`w-6 h-6 rounded-full ${themeOption.color} hover:scale-110 transition-transform ${
                            theme === themeOption.value ? 'ring-2 ring-ring ring-offset-2 ring-offset-background' : ''
                          }`}
                          title={themeOption.label}
                        />
                      ))}
                    </div>
                    <div className="mt-2 flex gap-1">
                      <button
                        onClick={() => setMode('light')}
                        className={`px-2 py-1 text-xs rounded ${
                          mode === 'light' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                        }`}
                      >
                        Light
                      </button>
                      <button
                        onClick={() => setMode('dark')}
                        className={`px-2 py-1 text-xs rounded ${
                          mode === 'dark' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                        }`}
                      >
                        Dark
                      </button>
                    </div>
                  </div>
                  
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
      </header>

      <div className="flex min-h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <div className="w-80 border-r border-border bg-card/50 flex flex-col sticky top-[73px] h-[calc(100vh-73px)]">
          {/* Search */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search endpoints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {/* Getting Started */}
              <Collapsible 
                open={expandedSections.has('getting-started')}
                onOpenChange={() => toggleSection('getting-started')}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-left hover:bg-accent/50 rounded-md">
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-primary" />
                    <span className="font-medium">Getting Started</span>
                  </div>
                  {expandedSections.has('getting-started') ? 
                    <ChevronDown className="w-4 h-4" /> : 
                    <ChevronRight className="w-4 h-4" />
                  }
                </CollapsibleTrigger>
                <CollapsibleContent className="ml-6 mt-1 space-y-1">
                  <button className="block w-full text-left p-2 text-sm hover:bg-accent/50 rounded-md text-muted-foreground hover:text-foreground">
                    Quick Start Guide
                  </button>
                  <button className="block w-full text-left p-2 text-sm hover:bg-accent/50 rounded-md text-muted-foreground hover:text-foreground">
                    Authentication
                  </button>
                  <button className="block w-full text-left p-2 text-sm hover:bg-accent/50 rounded-md text-muted-foreground hover:text-foreground">
                    Rate Limiting
                  </button>
                  <button className="block w-full text-left p-2 text-sm hover:bg-accent/50 rounded-md text-muted-foreground hover:text-foreground">
                    Error Handling
                  </button>
                </CollapsibleContent>
              </Collapsible>

              {/* API Endpoints by Category */}
              {categories.map(category => {
                const categoryEndpoints = filteredEndpoints.filter(e => e.category === category);
                const CategoryIcon = getCategoryIcon(category);
                
                return (
                  <Collapsible 
                    key={category}
                    open={expandedSections.has(category.toLowerCase())}
                    onOpenChange={() => toggleSection(category.toLowerCase())}
                  >
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-left hover:bg-accent/50 rounded-md">
                      <div className="flex items-center gap-2">
                        <CategoryIcon className="w-4 h-4 text-primary" />
                        <span className="font-medium">{category}</span>
                        <Badge variant="secondary" className="text-xs">
                          {categoryEndpoints.length}
                        </Badge>
                      </div>
                      {expandedSections.has(category.toLowerCase()) ? 
                        <ChevronDown className="w-4 h-4" /> : 
                        <ChevronRight className="w-4 h-4" />
                      }
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-6 mt-1 space-y-1">
                      {categoryEndpoints.map(endpoint => (
                        <button
                          key={endpoint.id}
                          onClick={() => setSelectedEndpoint(endpoint)}
                          className={`
                            block w-full text-left p-2 text-sm rounded-md transition-colors
                            ${selectedEndpoint?.id === endpoint.id 
                              ? 'bg-primary/10 text-primary border-l-2 border-primary' 
                              : 'hover:bg-accent/50 text-muted-foreground hover:text-foreground'
                            }
                          `}
                        >
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="outline" 
                              className={`text-xs px-1.5 py-0.5 ${getMethodColor(endpoint.method)}`}
                            >
                              {endpoint.method}
                            </Badge>
                            <span className="truncate">{endpoint.title}</span>
                          </div>
                        </button>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}

              {/* Additional Sections */}
              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-left hover:bg-accent/50 rounded-md">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="font-medium">Security</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </CollapsibleTrigger>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-left hover:bg-accent/50 rounded-md">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-primary" />
                    <span className="font-medium">SDKs</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </CollapsibleTrigger>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-left hover:bg-accent/50 rounded-md">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-primary" />
                    <span className="font-medium">Examples</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </CollapsibleTrigger>
              </Collapsible>
            </div>
          </ScrollArea>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {selectedEndpoint ? (
            <div className="flex-1 flex min-h-0">
              {/* Documentation Content */}
              <div className="flex-1 overflow-y-auto max-h-[calc(100vh-73px)]">
                <div className="p-8 max-w-4xl pb-20">
                  {/* Endpoint Header */}
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge 
                        variant="outline" 
                        className={`text-sm px-3 py-1 ${getMethodColor(selectedEndpoint.method)}`}
                      >
                        {selectedEndpoint.method}
                      </Badge>
                      <code className="text-lg font-mono bg-muted px-3 py-1 rounded-md">
                        {selectedEndpoint.path}
                      </code>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">{selectedEndpoint.title}</h1>
                    <p className="text-lg text-muted-foreground">{selectedEndpoint.description}</p>
                  </div>

                  {/* Content Sections */}
                  <div className="space-y-8">
                    {/* Authentication */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="w-5 h-5 text-primary" />
                          Authentication
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">
                          This endpoint requires authentication using a Bearer token.
                        </p>
                        <div className="bg-muted/50 rounded-lg p-4">
                          <code className="text-sm">Authorization: Bearer your-api-token</code>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Parameters */}
                    {selectedEndpoint.path.includes('{') && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Path Parameters</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {selectedEndpoint.path.match(/\{([^}]+)\}/g)?.map(param => {
                              const paramName = param.replace(/[{}]/g, '');
                              return (
                                <div key={paramName} className="flex items-start gap-4 p-3 border border-border rounded-lg">
                                  <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                                    {paramName}
                                  </code>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-sm font-medium">string</span>
                                      <Badge variant="destructive" className="text-xs">required</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      Unique {paramName.replace('_', ' ')} identifier
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Request Body */}
                    {['POST', 'PUT'].includes(selectedEndpoint.method) && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Request Body</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="bg-muted/50 rounded-lg p-4">
                              <pre className="text-sm overflow-x-auto">
                                <code>{`{
  "recipient": "+1234567890",
  "message": {
    "text": "Your order #12345 has been confirmed!",
    "template_id": "order_confirmation"
  },
  "metadata": {
    "campaign_id": "ORDER_CONFIRMATIONS",
    "priority": "high"
  }
}`}</code>
                              </pre>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Response */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          Response
                          <Badge variant="outline" className="bg-status-success/10 text-status-success border-status-success">
                            200 OK
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-muted/50 rounded-lg p-4">
                          <pre className="text-sm overflow-x-auto">
                            <code>{`{
  "message_id": "msg_789",
  "flow_id": "flow_123",
  "recipient": "+1234567890",
  "status": "queued",
  "created_at": "2024-01-15T16:45:00Z",
  "routing": {
    "selected_vendor": "twilio",
    "routing_reason": "least_cost",
    "estimated_cost": 0.045
  }
}`}</code>
                          </pre>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Code Examples Panel */}
              <div className="w-96 border-l border-border bg-card/30 flex flex-col sticky top-[73px] h-[calc(100vh-73px)]">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Code Examples</h3>
                    <Button variant="outline" size="sm">
                      <Play className="w-4 h-4 mr-2" />
                      Try It
                    </Button>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        <span className="capitalize">{selectedLanguage}</span>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      <DropdownMenuItem onClick={() => setSelectedLanguage('curl')}>
                        <Terminal className="w-4 h-4 mr-2" />
                        cURL
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedLanguage('javascript')}>
                        <Code className="w-4 h-4 mr-2" />
                        JavaScript
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedLanguage('python')}>
                        <Code className="w-4 h-4 mr-2" />
                        Python
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  {codeExamples[selectedEndpoint.id] ? (
                    <div className="space-y-4">
                      {codeExamples[selectedEndpoint.id]
                        .filter(example => example.language === selectedLanguage)
                        .map((example, index) => (
                          <div key={index} className="relative">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium capitalize">{example.language}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(example.code)}
                                className="h-6 w-6 p-0"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                            <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                              <pre className="text-sm text-slate-100">
                                <code>{example.code}</code>
                              </pre>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Code className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Code examples coming soon</p>
                    </div>
                  )}

                  {/* Response Example */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Response</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard('{"message_id": "msg_789"}')}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm text-slate-100">
                        <code>{`{
  "message_id": "msg_789",
  "flow_id": "flow_123",
  "status": "queued",
  "created_at": "2024-01-15T16:45:00Z"
}`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Welcome Screen */
            <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-73px)]">
              <div className="text-center max-w-2xl mx-auto p-8">
                <div className="p-4 bg-primary/10 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Book className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl font-bold mb-4">FlowForge API Documentation</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Comprehensive API reference for building intelligent communication workflows. 
                  Select an endpoint from the sidebar to get started.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <Card className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Zap className="w-5 h-5 text-primary" />
                      <span className="font-medium">Quick Start</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Get up and running with your first API call in minutes
                    </p>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Globe className="w-5 h-5 text-primary" />
                      <span className="font-medium">Global Scale</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Enterprise-grade infrastructure with 99.9% uptime
                    </p>
                  </Card>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <Button className="bg-gradient-primary">
                    <Play className="w-4 h-4 mr-2" />
                    Get Started
                  </Button>
                  <Button variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    API Console
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/80 rounded-md flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-muted-foreground">
                Hub - Intelligent Communication Routing Platform
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Hub. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
      
      {/* Modals */}
      <PersonalInfoModal isOpen={personalInfoOpen} onClose={() => setPersonalInfoOpen(false)} />
      <AccountSettingsModal isOpen={accountSettingsOpen} onClose={() => setAccountSettingsOpen(false)} />
      <BillingModal isOpen={billingOpen} onClose={() => setBillingOpen(false)} />
    </div>
  );
};

export default Documentation;