import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Send, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const testingSchema = z.object({
  testRecipient: z.string().min(1, 'Test recipient is required'),
  testMessage: z.string().min(1, 'Test message is required'),
});

type TestingData = z.infer<typeof testingSchema>;

interface TestResult {
  id: string;
  timestamp: Date;
  success: boolean;
  latency: number;
  statusCode?: number;
  response: string;
}

interface TestingFormProps {
  data?: Partial<TestingData>;
  onDataChange: (data: Partial<TestingData>) => void;
  onNext: () => void;
  onPrevious?: () => void;
  canProceed: (isValid: boolean) => void;
  channelType: 'sms' | 'whatsapp' | 'email' | 'voice' | 'rcs';
}

export const TestingForm: React.FC<TestingFormProps> = ({
  data = {},
  onDataChange,
  onNext,
  onPrevious,
  canProceed,
  channelType
}) => {
  const [testResults, setTestResults] = React.useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  
  const form = useForm<TestingData>({
    resolver: zodResolver(testingSchema),
    defaultValues: {
      testRecipient: data.testRecipient || '',
      testMessage: data.testMessage || getDefaultMessage(channelType),
    },
    mode: 'onChange'
  });

  React.useEffect(() => {
    const subscription = form.watch((value) => {
      onDataChange(value);
    });
    return () => subscription.unsubscribe();
  }, [form, onDataChange]);

  // Separate effect for canProceed to ensure it updates when test results change
  React.useEffect(() => {
    const hasSuccessfulTest = testResults.some(r => r.success);
    canProceed(hasSuccessfulTest);
  }, [testResults, canProceed]);

  function getDefaultMessage(type: string): string {
    switch (type) {
      case 'sms':
        return 'Hello! This is a test SMS message from your new integration.';
      case 'whatsapp':
        return 'Hello! This is a test WhatsApp message from your new integration.';
      case 'email':
        return 'Hello! This is a test email from your new integration. Everything is working correctly.';
      case 'voice':
        return 'Hello! This is a test voice call from your new integration.';
      case 'rcs':
        return 'Hello! This is a test RCS message from your new integration.';
      default:
        return 'Hello! This is a test message from your new integration.';
    }
  }

  function getRecipientPlaceholder(type: string): string {
    switch (type) {
      case 'sms':
      case 'whatsapp':
      case 'voice':
      case 'rcs':
        return '+1234567890';
      case 'email':
        return 'test@example.com';
      default:
        return 'Enter test recipient';
    }
  }

  function getRecipientLabel(type: string): string {
    switch (type) {
      case 'sms':
      case 'whatsapp':
      case 'voice':
      case 'rcs':
        return 'Test Phone Number';
      case 'email':
        return 'Test Email Address';
      default:
        return 'Test Recipient';
    }
  }

  const handleSendTest = async () => {
    const values = form.getValues();
    if (!form.formState.isValid) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      const startTime = Date.now();
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
      const endTime = Date.now();
      
      const success = Math.random() > 0.2; // 80% success rate for demo
      const latency = endTime - startTime;
      
      const result: TestResult = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        success,
        latency,
        statusCode: success ? 200 : 400,
        response: success 
          ? `${channelType.toUpperCase()} sent successfully to ${values.testRecipient}`
          : `Failed to send ${channelType.toUpperCase()}: Invalid recipient or service error`
      };
      
      setTestResults(prev => [result, ...prev]);
    } catch (error) {
      const result: TestResult = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        success: false,
        latency: 0,
        response: 'Network error: Failed to connect to service'
      };
      
      setTestResults(prev => [result, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Your Integration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              Send a test {channelType.toUpperCase()} to verify your integration is working correctly.
            </AlertDescription>
          </Alert>

          <Form {...form}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="testRecipient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{getRecipientLabel(channelType)} *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={getRecipientPlaceholder(channelType)} 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Enter a valid {channelType === 'email' ? 'email address' : 'phone number'} to receive the test message
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="testMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Test Message *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter your test message" 
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      The message content to send for testing
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={handleSendTest}
                  disabled={!form.formState.isValid || isLoading}
                  className="flex items-center gap-2"
                >
                  {isLoading ? (
                    <Clock className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {isLoading ? 'Sending...' : `Send Test ${channelType.toUpperCase()}`}
                </Button>
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((result) => (
                <div 
                  key={result.id}
                  className={`p-4 rounded-lg border ${
                    result.success 
                      ? 'border-status-success bg-status-success/10' 
                      : 'border-status-error bg-status-error/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {result.success ? (
                        <CheckCircle className="w-4 h-4 text-status-success" />
                      ) : (
                        <XCircle className="w-4 h-4 text-status-error" />
                      )}
                      <span className="font-medium">
                        {result.success ? 'Success' : 'Failed'}
                      </span>
                      {result.statusCode && (
                        <Badge variant="outline">{result.statusCode}</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {result.timestamp.toLocaleTimeString()} • {result.latency}ms
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {result.response}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};