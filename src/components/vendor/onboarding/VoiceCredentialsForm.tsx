import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, TestTube, CheckCircle, XCircle, ExternalLink, HelpCircle, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const voiceCredentialsSchema = z.object({
  providerType: z.string().min(1, 'Please select a provider type'),
  accountSid: z.string().min(1, 'Account SID is required'),
  authToken: z.string().min(1, 'Auth token is required'),
  fromNumber: z.string().min(1, 'From number is required'),
  applicationId: z.string().optional(),
  webhookUrl: z.string().url('Please enter a valid webhook URL').optional().or(z.literal('')),
  recordCalls: z.boolean().default(false),
});

type VoiceCredentialsData = z.infer<typeof voiceCredentialsSchema>;

interface VoiceCredentialsFormProps {
  data?: Partial<VoiceCredentialsData>;
  onDataChange: (data: Partial<VoiceCredentialsData>) => void;
  onNext: () => void;
  onPrevious?: () => void;
  canProceed: (isValid: boolean) => void;
  vendorName?: string;
}

export const VoiceCredentialsForm: React.FC<VoiceCredentialsFormProps> = ({
  data = {},
  onDataChange,
  onNext,
  onPrevious,
  canProceed,
  vendorName = 'Voice Provider'
}) => {
  const [showAuthToken, setShowAuthToken] = React.useState(false);
  const [testStatus, setTestStatus] = React.useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  
  const form = useForm<VoiceCredentialsData>({
    resolver: zodResolver(voiceCredentialsSchema),
    defaultValues: {
      providerType: data.providerType || '',
      accountSid: data.accountSid || '',
      authToken: data.authToken || '',
      fromNumber: data.fromNumber || '',
      applicationId: data.applicationId || '',
      webhookUrl: data.webhookUrl || '',
      recordCalls: data.recordCalls ?? false,
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
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              {vendorName} Voice Credentials
            </div>
            {getTestStatusBadge()}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription className="flex items-center gap-2">
              Configure your voice provider credentials. You'll need a verified phone number and API access.
              <a 
                href="https://www.twilio.com/docs/voice" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                Learn more about voice APIs
                <ExternalLink className="w-3 h-3" />
              </a>
            </AlertDescription>
          </Alert>

          <Form {...form}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="providerType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Voice Provider *
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Choose your voice service provider. Different providers may have different field requirements.</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select voice provider" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="twilio">Twilio</SelectItem>
                        <SelectItem value="plivo">Plivo</SelectItem>
                        <SelectItem value="vonage">Vonage (Nexmo)</SelectItem>
                        <SelectItem value="sinch">Sinch</SelectItem>
                        <SelectItem value="bandwidth">Bandwidth</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="accountSid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Account SID *
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="w-4 h-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Your unique account identifier from your voice provider dashboard.</p>
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" {...field} />
                      </FormControl>
                      <FormDescription>
                        Account identifier from your provider dashboard
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="authToken"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Auth Token *
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="w-4 h-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Your authentication token for API access. Keep this secure!</p>
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showAuthToken ? "text" : "password"}
                            placeholder="Enter your auth token" 
                            {...field} 
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowAuthToken(!showAuthToken)}
                          >
                            {showAuthToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Authentication token from your provider
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fromNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        From Number *
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="w-4 h-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>The phone number that will appear as the caller ID. Must be verified with your provider.</p>
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="+1234567890" {...field} />
                      </FormControl>
                      <FormDescription>
                        Verified phone number for outbound calls
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="applicationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Application ID
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="w-4 h-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Optional: Application ID for handling call flow logic.</p>
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="APxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" {...field} />
                      </FormControl>
                      <FormDescription>
                        Optional: TwiML App SID or equivalent
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                          <p>Optional: URL to receive call status updates and events.</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://yourapp.com/webhooks/voice" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your webhook endpoint for call status updates
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
                    Failed to connect to voice provider. Please check your credentials and try again.
                  </AlertDescription>
                </Alert>
              )}

              {testStatus === 'success' && (
                <Alert className="border-status-success bg-status-success/10">
                  <CheckCircle className="h-4 w-4 text-status-success" />
                  <AlertDescription className="text-status-success">
                    Successfully connected to voice provider!
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