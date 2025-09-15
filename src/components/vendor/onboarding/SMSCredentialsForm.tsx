import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, TestTube, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const smsCredentialsSchema = z.object({
  apiKey: z.string().min(1, 'API Key is required'),
  apiSecret: z.string().min(1, 'API Secret is required'),
  senderId: z.string().min(1, 'Sender ID is required'),
  baseUrl: z.string().url('Please enter a valid base URL').optional().or(z.literal('')),
});

type SMSCredentialsData = z.infer<typeof smsCredentialsSchema>;

interface SMSCredentialsFormProps {
  data?: Partial<SMSCredentialsData>;
  onDataChange: (data: Partial<SMSCredentialsData>) => void;
  onNext: () => void;
  onPrevious?: () => void;
  canProceed: (isValid: boolean) => void;
  vendorName: string;
}

export const SMSCredentialsForm: React.FC<SMSCredentialsFormProps> = ({
  data = {},
  onDataChange,
  onNext,
  onPrevious,
  canProceed,
  vendorName
}) => {
  const [showApiSecret, setShowApiSecret] = React.useState(false);
  const [testStatus, setTestStatus] = React.useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  
  const form = useForm<SMSCredentialsData>({
    resolver: zodResolver(smsCredentialsSchema),
    defaultValues: {
      apiKey: data.apiKey || '',
      apiSecret: data.apiSecret || '',
      senderId: data.senderId || '',
      baseUrl: data.baseUrl || '',
    },
    mode: 'onChange'
  });

  React.useEffect(() => {
    const subscription = form.watch((value) => {
      onDataChange(value);
      canProceed(form.formState.isValid && testStatus === 'success');
    });
    return () => subscription.unsubscribe();
  }, [form, onDataChange, canProceed, testStatus]);

  const handleTestConnection = async () => {
    const values = form.getValues();
    if (!form.formState.isValid) return;

    setTestStatus('testing');
    
    // Simulate API test
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Simulate random success/failure for demo
      const success = Math.random() > 0.3;
      setTestStatus(success ? 'success' : 'error');
    } catch {
      setTestStatus('error');
    }
  };

  const getTestStatusBadge = () => {
    switch (testStatus) {
      case 'testing':
        return <Badge variant="secondary">Testing...</Badge>;
      case 'success':
        return <Badge className="bg-status-success text-white"><CheckCircle className="w-3 h-3 mr-1" />Connected</Badge>;
      case 'error':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {vendorName} API Credentials
          {getTestStatusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            Enter your {vendorName} API credentials. These will be securely encrypted and stored.
          </AlertDescription>
        </Alert>

        <Form {...form}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your API key" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your {vendorName} API key from the developer console
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="apiSecret"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Secret *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showApiSecret ? "text" : "password"}
                        placeholder="Enter your API secret" 
                        {...field} 
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowApiSecret(!showApiSecret)}
                      >
                        {showApiSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Your {vendorName} API secret key
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="senderId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sender ID *</FormLabel>
                    <FormControl>
                      <Input placeholder="COMPANY" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your registered sender ID (11 chars max)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="baseUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://api.vendor.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Custom API endpoint (if different from default)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleTestConnection}
                disabled={!form.formState.isValid || testStatus === 'testing'}
                className="flex items-center gap-2"
              >
                <TestTube className="w-4 h-4" />
                {testStatus === 'testing' ? 'Testing...' : 'Test Connection'}
              </Button>
            </div>

            {testStatus === 'error' && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to connect to {vendorName} API. Please check your credentials and try again.
                </AlertDescription>
              </Alert>
            )}

            {testStatus === 'success' && (
              <Alert className="border-status-success bg-status-success/10">
                <CheckCircle className="h-4 w-4 text-status-success" />
                <AlertDescription className="text-status-success">
                  Successfully connected to {vendorName} API!
                </AlertDescription>
              </Alert>
            )}
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};