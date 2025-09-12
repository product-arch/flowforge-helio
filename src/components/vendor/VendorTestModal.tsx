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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TestTube, 
  Send, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Activity,
  MessageSquare,
  Phone,
  Mail
} from 'lucide-react';
import type { VendorIntegration, TestResult } from '@/types/vendor-integration';
import { useToast } from '@/hooks/use-toast';

interface VendorTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  integration: VendorIntegration | null;
  onTestComplete: (integration: VendorIntegration, result: TestResult) => void;
}

export const VendorTestModal: React.FC<VendorTestModalProps> = ({
  isOpen,
  onClose,
  integration,
  onTestComplete
}) => {
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testData, setTestData] = useState({
    recipient: '',
    message: 'This is a test message from your integration.',
    templateId: ''
  });
  const { toast } = useToast();

  const handleTest = async () => {
    if (!integration) return;
    
    setTesting(true);
    const startTime = Date.now();
    
    try {
      // Simulate API test call
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
      
      const latency = Date.now() - startTime;
      const isSuccess = Math.random() > 0.2; // 80% success rate for demo
      
      const result: TestResult = {
        id: `test-${Date.now()}`,
        timestamp: new Date(),
        success: isSuccess,
        latency,
        statusCode: isSuccess ? 200 : 400,
        response: isSuccess 
          ? 'Message sent successfully' 
          : 'Failed to send message: Invalid credentials',
        testType: 'manual',
        recipientType: integration.channel === 'voice' ? 'phone' : 'message'
      };
      
      setTestResults(prev => [result, ...prev.slice(0, 4)]); // Keep last 5 results
      onTestComplete(integration, result);
      
      toast({
        title: isSuccess ? "Test Successful" : "Test Failed",
        description: isSuccess 
          ? `Message sent successfully in ${latency}ms`
          : "Test failed - check configuration",
        className: isSuccess 
          ? "border-status-success bg-status-success/10 text-status-success"
          : "border-status-error bg-status-error/10 text-status-error"
      });
      
    } catch (error) {
      toast({
        title: "Test Error",
        description: "Unable to run test. Please try again.",
        className: "border-status-error bg-status-error/10 text-status-error"
      });
    } finally {
      setTesting(false);
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'sms':
      case 'whatsapp':
      case 'rcs':
        return <MessageSquare className="w-4 h-4" />;
      case 'voice':
        return <Phone className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      default:
        return <TestTube className="w-4 h-4" />;
    }
  };

  const getResultIcon = (success: boolean) => {
    return success 
      ? <CheckCircle className="w-4 h-4 text-green-500" />
      : <XCircle className="w-4 h-4 text-red-500" />;
  };

  if (!integration) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <img 
              src={integration.vendor.logo} 
              alt={integration.vendor.name}
              className="w-8 h-8 rounded object-contain"
            />
            Test {integration.vendor.name} - {integration.channel.toUpperCase()}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="test" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="test" className="flex items-center gap-2">
              <TestTube className="w-4 h-4" />
              Run Test
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Test History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="test" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getChannelIcon(integration.channel)}
                  {integration.channel.toUpperCase()} Test Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="recipient">
                    {integration.channel === 'email' ? 'Email Address' : 'Phone Number'}
                  </Label>
                  <Input
                    id="recipient"
                    value={testData.recipient}
                    onChange={(e) => setTestData(prev => ({ ...prev, recipient: e.target.value }))}
                    placeholder={
                      integration.channel === 'email' 
                        ? 'test@example.com'
                        : '+1234567890'
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="message">Test Message</Label>
                  <Textarea
                    id="message"
                    value={testData.message}
                    onChange={(e) => setTestData(prev => ({ ...prev, message: e.target.value }))}
                    rows={3}
                    placeholder="Enter your test message..."
                  />
                </div>

                {integration.channel === 'whatsapp' && (
                  <div>
                    <Label htmlFor="templateId">Template ID (Optional)</Label>
                    <Input
                      id="templateId"
                      value={testData.templateId}
                      onChange={(e) => setTestData(prev => ({ ...prev, templateId: e.target.value }))}
                      placeholder="WhatsApp template ID"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Integration Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge variant={integration.status === 'active' ? 'default' : 'secondary'}>
                      {integration.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Credentials:</span>
                    <Badge variant={integration.credentials?.isValid ? 'default' : 'destructive'}>
                      {integration.credentials?.isValid ? 'Valid' : 'Invalid'}
                    </Badge>
                  </div>
                  {integration.healthMetrics && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Uptime:</span>
                        <span className="text-sm font-medium">
                          {integration.healthMetrics.uptimePercentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Avg Latency:</span>
                        <span className="text-sm font-medium">
                          {integration.healthMetrics.avgLatency.toFixed(0)}ms
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                {testResults.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <TestTube className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No test results yet</p>
                    <p className="text-sm">Run a test to see results here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {testResults.map((result) => (
                      <div key={result.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getResultIcon(result.success)}
                          <div>
                            <div className="text-sm font-medium">
                              {result.success ? 'Success' : 'Failed'}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {result.timestamp.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{result.latency}ms</div>
                          <div className="text-xs text-muted-foreground">
                            Status: {result.statusCode}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button 
            onClick={handleTest} 
            disabled={testing || !testData.recipient || !integration.credentials?.isValid}
            className="flex items-center gap-2"
          >
            {testing ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Run Test
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};