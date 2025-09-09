import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NavigationHeader } from '@/components/navigation/NavigationHeader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { useToast } from '@/hooks/use-toast';

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
      <NavigationHeader 
        subtitle="API Console"
        icon={Terminal}
        showBackButton
        rightActions={
          <Button variant="outline" size="sm" onClick={() => navigate('/documentation')}>
            <Book className="w-4 h-4 mr-2" />
            Documentation
          </Button>
        }
      />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Request Builder */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Request Builder
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* API Key */}
                <div>
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Enter your API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </div>

                {/* Method and URL */}
                <div className="flex gap-2">
                  <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger className="w-24">
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
                    placeholder="Enter request URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={executeRequest} 
                    disabled={isLoading}
                    className="bg-gradient-primary hover:opacity-90"
                  >
                    {isLoading ? 'Sending...' : 'Send'}
                  </Button>
                </div>

                <Tabs defaultValue="params" className="w-full">
                  <TabsList>
                    <TabsTrigger value="params">Query Params</TabsTrigger>
                    <TabsTrigger value="headers">Headers</TabsTrigger>
                    <TabsTrigger value="body">Body</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="params" className="space-y-2">
                    {queryParams.map((param) => (
                      <div key={param.id} className="flex items-center gap-2">
                        <Input
                          placeholder="Key"
                          value={param.key}
                          onChange={(e) => updateKeyValuePair('queryParams', param.id, 'key', e.target.value)}
                        />
                        <Input
                          placeholder="Value"
                          value={param.value}
                          onChange={(e) => updateKeyValuePair('queryParams', param.id, 'value', e.target.value)}
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeKeyValuePair('queryParams', param.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => addKeyValuePair('queryParams')}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Parameter
                    </Button>
                  </TabsContent>

                  <TabsContent value="headers" className="space-y-2">
                    {headers.map((header) => (
                      <div key={header.id} className="flex items-center gap-2">
                        <Input
                          placeholder="Header Name"
                          value={header.key}
                          onChange={(e) => updateKeyValuePair('headers', header.id, 'key', e.target.value)}
                        />
                        <Input
                          placeholder="Header Value"
                          value={header.value}
                          onChange={(e) => updateKeyValuePair('headers', header.id, 'value', e.target.value)}
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeKeyValuePair('headers', header.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => addKeyValuePair('headers')}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Header
                    </Button>
                  </TabsContent>

                  <TabsContent value="body">
                    <Textarea
                      placeholder="Request body (JSON)"
                      value={requestBody}
                      onChange={(e) => setRequestBody(e.target.value)}
                      className="min-h-[200px] font-mono text-sm"
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Code Generation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="w-5 h-5" />
                  Code Generation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
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
                <ScrollArea className="h-[200px] w-full">
                  <pre className="text-sm bg-muted p-4 rounded-lg overflow-auto">
                    <code>{generateCodeSnippet()}</code>
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Response & History */}
          <div className="space-y-6">
            {/* Response */}
            {response && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <CheckCircle className={`w-5 h-5 ${getStatusColor(response.status)}`} />
                      Response
                    </span>
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant={response.status >= 200 && response.status < 300 ? 'default' : 'destructive'}>
                        {response.status} {response.statusText}
                      </Badge>
                      {responseTime && (
                        <Badge variant="outline">{responseTime}ms</Badge>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px] w-full">
                    <pre className="text-sm bg-muted p-4 rounded-lg overflow-auto">
                      <code>{JSON.stringify(response.data, null, 2)}</code>
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}

            {/* History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Request History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] w-full">
                  <div className="space-y-2">
                    {history.map((item) => {
                      const StatusIcon = getStatusIcon(item.status || 0);
                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-2 rounded-lg border cursor-pointer hover:bg-accent"
                          onClick={() => loadFromHistory(item)}
                        >
                          <div className="flex items-center gap-2">
                            <StatusIcon className={`w-4 h-4 ${getStatusColor(item.status || 0)}`} />
                            <Badge variant="outline" className="text-xs">
                              {item.method}
                            </Badge>
                            <span className="text-sm font-mono truncate max-w-[120px]">
                              {new URL(item.url).pathname}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {item.responseTime}ms
                          </div>
                        </div>
                      );
                    })}
                    {history.length === 0 && (
                      <div className="text-center text-muted-foreground py-8">
                        No requests yet
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default APIConsole;