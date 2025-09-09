import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { NavigationHeader } from '@/components/navigation/NavigationHeader';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
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
import { useToast } from '@/hooks/use-toast';

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
      <NavigationHeader 
        subtitle="Documentation"
        icon={Book}
        showBackButton
        rightActions={
          <>
            <Badge variant="outline" className="bg-status-success/10 text-status-success border-status-success">
              v1.0.0
            </Badge>
            <Button variant="outline" size="sm" onClick={() => navigate('/api-console')}>
              <Terminal className="w-4 h-4 mr-2" />
              API Console
            </Button>
          </>
        }
      />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search endpoints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* API Categories */}
              <div className="space-y-2">
                {categories.map((category) => {
                  const CategoryIcon = getCategoryIcon(category);
                  const categoryEndpoints = filteredEndpoints.filter(ep => ep.category === category);
                  const isExpanded = expandedSections.has(category.toLowerCase());

                  return (
                    <Collapsible key={category} open={isExpanded}>
                      <CollapsibleTrigger
                        onClick={() => toggleSection(category.toLowerCase())}
                        className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-accent text-left"
                      >
                        <div className="flex items-center gap-2">
                          <CategoryIcon className="w-4 h-4" />
                          <span className="font-medium">{category}</span>
                          <Badge variant="secondary" className="text-xs">
                            {categoryEndpoints.length}
                          </Badge>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent className="ml-6 mt-2 space-y-1">
                        {categoryEndpoints.map((endpoint) => (
                          <div
                            key={endpoint.id}
                            className={`p-2 rounded-lg cursor-pointer hover:bg-accent ${
                              selectedEndpoint?.id === endpoint.id ? 'bg-accent' : ''
                            }`}
                            onClick={() => setSelectedEndpoint(endpoint)}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={`text-xs px-1.5 py-0.5 ${getMethodColor(endpoint.method)}`}>
                                {endpoint.method}
                              </Badge>
                              <span className="text-sm font-medium">{endpoint.title}</span>
                            </div>
                            <div className="text-xs text-muted-foreground font-mono">
                              {endpoint.path}
                            </div>
                          </div>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedEndpoint ? (
              <div className="space-y-8">
                {/* Endpoint Header */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge className={`${getMethodColor(selectedEndpoint.method)} px-2 py-1`}>
                      {selectedEndpoint.method}
                    </Badge>
                    <h1 className="text-3xl font-bold">{selectedEndpoint.title}</h1>
                  </div>
                  <p className="text-lg text-muted-foreground">{selectedEndpoint.description}</p>
                  <div className="p-3 bg-muted rounded-lg">
                    <code className="text-sm font-mono">{selectedEndpoint.path}</code>
                  </div>
                </div>

                {/* Code Examples */}
                {codeExamples[selectedEndpoint.id] && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Examples</h2>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">Language:</label>
                        <select
                          value={selectedLanguage}
                          onChange={(e) => setSelectedLanguage(e.target.value)}
                          className="px-3 py-1 rounded border border-border bg-background text-sm"
                        >
                          {codeExamples[selectedEndpoint.id].map((example) => (
                            <option key={example.language} value={example.language}>
                              {example.language}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {codeExamples[selectedEndpoint.id]
                        .filter(example => example.language === selectedLanguage)
                        .map((example, index) => (
                          <div key={index} className="relative">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium capitalize">{example.language}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(example.code)}
                              >
                                <Copy className="w-4 h-4 mr-2" />
                                Copy
                              </Button>
                            </div>
                            <ScrollArea className="h-[400px] w-full">
                              <pre className="p-4 bg-muted rounded-lg overflow-auto text-sm">
                                <code>{example.code}</code>
                              </pre>
                            </ScrollArea>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Response Format */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Response</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-status-success" />
                      <span className="font-medium">200 OK</span>
                    </div>
                    <ScrollArea className="h-[200px] w-full">
                      <pre className="p-4 bg-muted rounded-lg overflow-auto text-sm">
                        <code>{JSON.stringify({
                          success: true,
                          data: {
                            message_id: "msg_abc123",
                            status: "queued",
                            created_at: "2024-01-15T10:30:00Z"
                          }
                        }, null, 2)}</code>
                      </pre>
                    </ScrollArea>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Book className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Select an Endpoint</h2>
                <p className="text-muted-foreground">Choose an API endpoint from the sidebar to view its documentation.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;