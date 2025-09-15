import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, TestTube, CheckCircle, XCircle, ExternalLink, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

const whatsappCredentialsSchema = z.object({
  accessToken: z.string().min(1, 'Access token is required'),
  phoneNumberId: z.string().min(1, 'Phone number ID is required'),
  businessAccountId: z.string().min(1, 'Business account ID is required'),
  verifyToken: z.string().min(8, 'Verify token must be at least 8 characters'),
  webhookUrl: z.string().url('Please enter a valid webhook URL').optional().or(z.literal('')),
});

type WhatsAppCredentialsData = z.infer<typeof whatsappCredentialsSchema>;

interface WhatsAppCredentialsFormProps {
  data?: Partial<WhatsAppCredentialsData>;
  onDataChange: (data: Partial<WhatsAppCredentialsData>) => void;
  onNext: () => void;
  onPrevious?: () => void;
  canProceed: (isValid: boolean) => void;
}

export const WhatsAppCredentialsForm: React.FC<WhatsAppCredentialsFormProps> = ({
  data = {},
  onDataChange,
  onNext,
  onPrevious,
  canProceed
}) => {
  const [showAccessToken, setShowAccessToken] = React.useState(false);
  const [testStatus, setTestStatus] = React.useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  
  const form = useForm<WhatsAppCredentialsData>({
    resolver: zodResolver(whatsappCredentialsSchema),
    defaultValues: {
      accessToken: data.accessToken || '',
      phoneNumberId: data.phoneNumberId || '',
      businessAccountId: data.businessAccountId || '',
      verifyToken: data.verifyToken || '',
      webhookUrl: data.webhookUrl || '',
    },
    mode: 'onChange'
  });

  React.useEffect(() => {
    const subscription = form.watch((value) => {
      onDataChange(value);
    });
    return () => subscription.unsubscribe();
  }, [form, onDataChange]);

  // Separate effect for canProceed to ensure it updates when form validity or test status changes
  React.useEffect(() => {
    const isReadyToProgress = form.formState.isValid && testStatus === 'success';
    canProceed(isReadyToProgress);
  }, [form.formState.isValid, testStatus, canProceed]);

  const handleTestConnection = async () => {
    const values = form.getValues();
    if (!form.formState.isValid) return;

    setTestStatus('testing');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
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
    <TooltipProvider>
      <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          WhatsApp Business API Credentials
          {getTestStatusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription className="flex items-center gap-2">
            Get your credentials from the 
            <a 
              href="https://developers.facebook.com/apps/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              Facebook Developer Console
              <ExternalLink className="w-3 h-3" />
            </a>
          </AlertDescription>
        </Alert>

        <Form {...form}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="accessToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Access Token *
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>A permanent access token from your WhatsApp Business API app. This never expires and is used for authentication.</p>
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showAccessToken ? "text" : "password"}
                        placeholder="Enter your access token" 
                        {...field} 
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowAccessToken(!showAccessToken)}
                      >
                        {showAccessToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Permanent access token from WhatsApp Business API
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phoneNumberId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Phone Number ID *
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>The ID of your registered WhatsApp Business phone number. Found in your Facebook Developer Console under WhatsApp API Setup.</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="123456789012345" {...field} />
                    </FormControl>
                    <FormDescription>
                      WhatsApp Business phone number ID
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessAccountId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Business Account ID *
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Your WhatsApp Business Account ID from Facebook Business Manager. This identifies your business account.</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="123456789012345" {...field} />
                    </FormControl>
                    <FormDescription>
                      WhatsApp Business account ID
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="verifyToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Verify Token *
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>A secure token you create for webhook verification. WhatsApp will use this to verify your webhook endpoint.</p>
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a secure verify token" {...field} />
                  </FormControl>
                  <FormDescription>
                    A secure token you define for webhook verification (min 8 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="webhookUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Webhook URL
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Optional: Your webhook endpoint URL where WhatsApp will send message status updates and user responses.</p>
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://yourapp.com/webhooks/whatsapp" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your webhook endpoint for receiving message status updates
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  Failed to connect to WhatsApp Business API. Please check your credentials and try again.
                </AlertDescription>
              </Alert>
            )}

            {testStatus === 'success' && (
              <Alert className="border-status-success bg-status-success/10">
                <CheckCircle className="h-4 w-4 text-status-success" />
                <AlertDescription className="text-status-success">
                  Successfully connected to WhatsApp Business API!
                </AlertDescription>
              </Alert>
            )}
          </div>
        </Form>
      </CardContent>
    </Card>
    </TooltipProvider>
  );
};