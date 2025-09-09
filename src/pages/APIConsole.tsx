import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  PersonalInfoModal, 
  AccountSettingsModal, 
  BillingModal,
  NotificationsModal,
  LanguageModal,
  PrivacyModal,
  DataManagementModal,
  KeyboardShortcutsModal
} from '@/components/flow/AccountModals';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Home,
  Play,
  Copy,
  Trash2,
  Plus,
  Clock,
  Code,
  Terminal,
  Settings,
  User,
  Bell,
  Moon,
  Sun,
  Globe,
  Shield,
  Database,
  Keyboard,
  LogOut,
  CreditCard,
  Palette,
  GitBranch,
  BarChart3,
  Plug,
  FileText,
  Book,
  Zap,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useTheme, Theme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { THEMES } from '@/constants/themes';
  { value: 'indigo', label: 'Deep Indigo', color: 'bg-indigo-500' },
  { value: 'solarized-osaka', label: 'Solarized Osaka', color: 'bg-teal-600' },
];

interface RequestHistory {
  id: string;
  method: string;
  url: string;
  timestamp: string;
  status?: number;
  responseTime?: number;
}

interface KeyValuePair {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

const APIConsole: React.FC = () => {
  const navigate = useNavigate();
  const [personalInfoOpen, setPersonalInfoOpen] = useState(false);
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(false);
  const [billingOpen, setBillingOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [dataManagementOpen, setDataManagementOpen] = useState(false);
  const [keyboardShortcutsOpen, setKeyboardShortcutsOpen] = useState(false);
  const { theme, mode, setTheme, setMode } = useTheme();
  const { toast } = useToast();

  // Request state
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('https://api.flowforge.com/v1/flows');
  const [headers, setHeaders] = useState<KeyValuePair[]>([
    { id: '1', key: 'Content-Type', value: 'application/json', enabled: true }
  ]);
  const [queryParams, setQueryParams] = useState<KeyValuePair[]>([]);
  const [requestBody, setRequestBody] = useState('{\n  "name": "Test Flow",\n  "channel": "sms"\n}');
  const [apiKey, setApiKey] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('curl');

  // Response state
  const [response, setResponse] = useState<any>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // History state
  const [history, setHistory] = useState<RequestHistory[]>([]);

  // Auto-add Authorization header when API key is provided
  useEffect(() => {
    if (apiKey) {
      setHeaders(prev => {
        const authHeaderExists = prev.some(h => h.key.toLowerCase() === 'authorization');
        if (!authHeaderExists) {
          return [...prev, { 
            id: Date.now().toString(), 
            key: 'Authorization', 
            value: `Bearer ${apiKey}`, 
            enabled: true 
          }];
        } else {
          return prev.map(h => 
            h.key.toLowerCase() === 'authorization' 
              ? { ...h, value: `Bearer ${apiKey}` }
              : h
          );
        }
      });
    }
  }, [apiKey]);

  const addKeyValuePair = (type: 'headers' | 'queryParams') => {
    const newPair: KeyValuePair = {
      id: Date.now().toString(),
      key: '',
      value: '',
      enabled: true
    };

    if (type === 'headers') {
      setHeaders(prev => [...prev, newPair]);
    } else {
      setQueryParams(prev => [...prev, newPair]);
    }
  };

  const updateKeyValuePair = (
    type: 'headers' | 'queryParams',
    id: string,
    field: 'key' | 'value' | 'enabled',
    value: string | boolean
  ) => {
    const updateFn = (prev: KeyValuePair[]) =>
      prev.map(pair => pair.id === id ? { ...pair, [field]: value } : pair);

    if (type === 'headers') {
      setHeaders(updateFn);
    } else {
      setQueryParams(updateFn);
    }
  };

  const removeKeyValuePair = (type: 'headers' | 'queryParams', id: string) => {
    const filterFn = (prev: KeyValuePair[]) => prev.filter(pair => pair.id !== id);

    if (type === 'headers') {
      setHeaders(filterFn);
    } else {
      setQueryParams(filterFn);
    }
  };

  const executeRequest = async () => {
    setIsLoading(true);
    const startTime = Date.now();

    try {
      // Build URL with query params
      const urlObj = new URL(url);
      queryParams
        .filter(param => param.enabled && param.key)
        .forEach(param => urlObj.searchParams.set(param.key, param.value));

      // Build headers
      const requestHeaders: Record<string, string> = {};
      headers
        .filter(header => header.enabled && header.key)
        .forEach(header => {
          requestHeaders[header.key] = header.value;
        });

      // Build request options
      const requestOptions: RequestInit = {
        method,
        headers: requestHeaders,
      };

      if (['POST', 'PUT', 'PATCH'].includes(method) && requestBody.trim()) {
        requestOptions.body = requestBody;
      }

      // Execute request
      const response = await fetch(urlObj.toString(), requestOptions);
      const responseData = await response.json().catch(() => null);
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      setResponse({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: responseData,
      });
      setResponseTime(responseTime);

      // Add to history
      const historyItem: RequestHistory = {
        id: Date.now().toString(),
        method,
        url: urlObj.toString(),
        timestamp: new Date().toISOString(),
        status: response.status,
        responseTime,
      };
      setHistory(prev => [historyItem, ...prev.slice(0, 19)]); // Keep last 20 requests

      toast({
        title: "Request Completed",
        description: `${method} ${response.status} - ${responseTime}ms`,
        className: response.ok 
          ? "border-status-success bg-status-success/10 text-status-success"
          : "border-status-error bg-status-error/10 text-status-error"
      });

    } catch (error) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      setResponse({
        status: 0,
        statusText: 'Network Error',
        headers: {},
        data: { error: (error as Error).message },
      });
      setResponseTime(responseTime);

      toast({
        title: "Request Failed",
        description: (error as Error).message,
        className: "border-status-error bg-status-error/10 text-status-error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateCodeSnippet = () => {
    const urlObj = new URL(url);
    queryParams
      .filter(param => param.enabled && param.key)
      .forEach(param => urlObj.searchParams.set(param.key, param.value));

    const enabledHeaders = headers.filter(h => h.enabled && h.key);

    switch (selectedLanguage) {
      case 'curl':
        let curlCommand = `curl -X ${method} "${urlObj.toString()}"`;
        enabledHeaders.forEach(header => {
          curlCommand += ` \\\n  -H "${header.key}: ${header.value}"`;
        });
        if (['POST', 'PUT', 'PATCH'].includes(method) && requestBody.trim()) {
          curlCommand += ` \\\n  -d '${requestBody}'`;
        }
        return curlCommand;

      case 'javascript':
        const jsHeaders = enabledHeaders.reduce((acc, h) => {
          acc[h.key] = h.value;
          return acc;
        }, {} as Record<string, string>);

        let jsCode = `const response = await fetch('${urlObj.toString()}', {\n  method: '${method}'`;
        if (Object.keys(jsHeaders).length > 0) {
          jsCode += `,\n  headers: ${JSON.stringify(jsHeaders, null, 2)}`;
        }
        if (['POST', 'PUT', 'PATCH'].includes(method) && requestBody.trim()) {
          jsCode += `,\n  body: ${JSON.stringify(requestBody)}`;
        }
        jsCode += '\n});\n\nconst data = await response.json();\nconsole.log(data);';
        return jsCode;

      case 'python':
        let pythonCode = `import requests\n\n`;
        if (enabledHeaders.length > 0) {
          pythonCode += `headers = ${JSON.stringify(enabledHeaders.reduce((acc, h) => {
            acc[h.key] = h.value;
            return acc;
          }, {} as Record<string, string>), null, 2)}\n\n`;
        }
        pythonCode += `response = requests.${method.toLowerCase()}('${urlObj.toString()}'`;
        if (enabledHeaders.length > 0) {
          pythonCode += ', headers=headers';
        }
        if (['POST', 'PUT', 'PATCH'].includes(method) && requestBody.trim()) {
          pythonCode += `, json=${requestBody}`;
        }
        pythonCode += ')\n\nprint(response.json())';
        return pythonCode;

      default:
        return '';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Code snippet copied successfully",
      className: "border-status-success bg-status-success/10 text-status-success"
    });
  };

  const loadFromHistory = (historyItem: RequestHistory) => {
    setMethod(historyItem.method);
    setUrl(historyItem.url);
    
    toast({
      title: "Request Loaded",
      description: "Request loaded from history",
      className: "border-status-info bg-status-info/10 text-status-info"
    });
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    toast({
      title: "Theme Changed",
      description: `Switched to ${THEMES.find(t => t.value === newTheme)?.name}`,
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

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-status-success';
    if (status >= 400 && status < 500) return 'text-status-warning';
    if (status >= 500) return 'text-status-error';
    return 'text-muted-foreground';
  };

  const getStatusIcon = (status: number) => {
    if (status >= 200 && status < 300) return CheckCircle;
    if (status >= 400 && status < 500) return AlertTriangle;
    if (status >= 500) return XCircle;
    return Info;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 pt-4">
        <div className="container mx-auto px-6">
          <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-lg shadow-black/5 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    Hub
                  </h1>
                </div>
                
                <nav className="hidden md:flex items-center gap-6">
                  <Button variant="ghost" className="text-sm" onClick={() => navigate('/')}>
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </Button>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-primary/10 rounded-lg">
                      <Terminal className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">API Console</span>
                  </div>
                </nav>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={() => navigate('/documentation')}>
                  <Book className="w-4 h-4 mr-2" />
                  Documentation
                </Button>
                
                {/* Settings Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => setNotificationsOpen(true)}>
                      <Bell className="w-4 h-4 mr-2" />
                      Notifications
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguageOpen(true)}>
                      <Globe className="w-4 h-4 mr-2" />
                      Language & Region
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPrivacyOpen(true)}>
                      <Shield className="w-4 h-4 mr-2" />
                      Privacy & Security
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDataManagementOpen(true)}>
                      <Database className="w-4 h-4 mr-2" />
                      Data Management
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setKeyboardShortcutsOpen(true)}>
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
        </div>
      </header>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-73px)] py-6">
        {/* Request Builder Panel */}
        <div className="w-1/2 border-r border-border flex flex-col">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Request Builder</h2>
              <Button 
                onClick={executeRequest}
                disabled={isLoading}
                className="bg-gradient-primary hover:opacity-90"
              >
                <Play className="w-4 h-4 mr-2" />
                {isLoading ? 'Sending...' : 'Send Request'}
              </Button>
            </div>

            {/* Method and URL */}
            <div className="flex gap-2 mb-4">
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://api.flowforge.com/v1/flows"
                className="flex-1"
              />
            </div>

            {/* Authentication */}
            <div className="mb-4">
              <Label className="text-sm font-medium mb-2 block">Authentication</Label>
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                className="w-full"
              />
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="headers" className="h-full flex flex-col">
              <TabsList className="w-full rounded-none border-b">
                <TabsTrigger value="headers">Headers</TabsTrigger>
                <TabsTrigger value="params">Query Params</TabsTrigger>
                <TabsTrigger value="body">Request Body</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
              </TabsList>

              <TabsContent value="headers" className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Request Headers</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addKeyValuePair('headers')}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Header
                    </Button>
                  </div>
                  
                  {headers.map((header) => (
                    <div key={header.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={header.enabled}
                        onChange={(e) => updateKeyValuePair('headers', header.id, 'enabled', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <Input
                        value={header.key}
                        onChange={(e) => updateKeyValuePair('headers', header.id, 'key', e.target.value)}
                        placeholder="Header name"
                        className="flex-1"
                      />
                      <Input
                        value={header.value}
                        onChange={(e) => updateKeyValuePair('headers', header.id, 'value', e.target.value)}
                        placeholder="Header value"
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeKeyValuePair('headers', header.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="params" className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Query Parameters</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addKeyValuePair('queryParams')}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Parameter
                    </Button>
                  </div>
                  
                  {queryParams.map((param) => (
                    <div key={param.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={param.enabled}
                        onChange={(e) => updateKeyValuePair('queryParams', param.id, 'enabled', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <Input
                        value={param.key}
                        onChange={(e) => updateKeyValuePair('queryParams', param.id, 'key', e.target.value)}
                        placeholder="Parameter name"
                        className="flex-1"
                      />
                      <Input
                        value={param.value}
                        onChange={(e) => updateKeyValuePair('queryParams', param.id, 'value', e.target.value)}
                        placeholder="Parameter value"
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeKeyValuePair('queryParams', param.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="body" className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Request Body (JSON)</Label>
                  <Textarea
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    placeholder="Enter JSON request body"
                    className="min-h-[300px] font-mono text-sm"
                    disabled={!['POST', 'PUT', 'PATCH'].includes(method)}
                  />
                  {!['POST', 'PUT', 'PATCH'].includes(method) && (
                    <p className="text-xs text-muted-foreground">
                      Request body is only available for POST, PUT, and PATCH methods
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="code" className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Generated Code</Label>
                    <div className="flex items-center gap-2">
                      <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="curl">cURL</SelectItem>
                          <SelectItem value="javascript">JavaScript</SelectItem>
                          <SelectItem value="python">Python</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(generateCodeSnippet())}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-slate-100">
                      <code>{generateCodeSnippet()}</code>
                    </pre>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Response and History Panel */}
        <div className="w-1/2 flex flex-col">
          <Tabs defaultValue="response" className="h-full flex flex-col">
            <TabsList className="w-full rounded-none border-b">
              <TabsTrigger value="response">Response</TabsTrigger>
              <TabsTrigger value="history">
                History
                {history.length > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {history.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="response" className="flex-1 overflow-hidden">
              {response ? (
                <div className="h-full flex flex-col">
                  {/* Response Status */}
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {React.createElement(getStatusIcon(response.status), {
                          className: `w-5 h-5 ${getStatusColor(response.status)}`
                        })}
                        <span className={`text-lg font-semibold ${getStatusColor(response.status)}`}>
                          {response.status} {response.statusText}
                        </span>
                      </div>
                      {responseTime && (
                        <Badge variant="outline">
                          <Clock className="w-3 h-3 mr-1" />
                          {responseTime}ms
                        </Badge>
                      )}
                    </div>
                    
                    {/* Response Headers */}
                    <details className="mt-3">
                      <summary className="text-sm font-medium cursor-pointer hover:text-primary">
                        Response Headers ({Object.keys(response.headers).length})
                      </summary>
                      <div className="mt-2 space-y-1">
                        {Object.entries(response.headers).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2 text-xs">
                            <span className="font-medium text-muted-foreground">{key}:</span>
                            <span className="font-mono">{value as string}</span>
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>

                  {/* Response Body */}
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-sm font-medium">Response Body</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(JSON.stringify(response.data, null, 2))}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                    
                    <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm text-slate-100">
                        <code>{JSON.stringify(response.data, null, 2)}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <Terminal className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No Response Yet</h3>
                    <p className="text-muted-foreground">
                      Configure your request and click "Send Request" to see the response here.
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Request History</Label>
                  {history.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setHistory([])}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                  )}
                </div>

                {history.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No requests in history yet.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {history.map((item) => (
                      <Card 
                        key={item.id} 
                        className="cursor-pointer hover:bg-accent/50 transition-colors"
                        onClick={() => loadFromHistory(item)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="outline"
                                className={`text-xs ${
                                  item.method === 'GET' ? 'text-green-600 border-green-600' :
                                  item.method === 'POST' ? 'text-blue-600 border-blue-600' :
                                  item.method === 'PUT' ? 'text-orange-600 border-orange-600' :
                                  'text-red-600 border-red-600'
                                }`}
                              >
                                {item.method}
                              </Badge>
                              {item.status && (
                                <Badge 
                                  variant="outline"
                                  className={`text-xs ${getStatusColor(item.status)}`}
                                >
                                  {item.status}
                                </Badge>
                              )}
                            </div>
                            {item.responseTime && (
                              <span className="text-xs text-muted-foreground">
                                {item.responseTime}ms
                              </span>
                            )}
                          </div>
                          <div className="text-sm font-mono truncate mb-1">
                            {item.url}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(item.timestamp).toLocaleString()}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
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
      <NotificationsModal isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
      <LanguageModal isOpen={languageOpen} onClose={() => setLanguageOpen(false)} />
      <PrivacyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <DataManagementModal isOpen={dataManagementOpen} onClose={() => setDataManagementOpen(false)} />
      <KeyboardShortcutsModal isOpen={keyboardShortcutsOpen} onClose={() => setKeyboardShortcutsOpen(false)} />
    </div>
  );
};

export default APIConsole;