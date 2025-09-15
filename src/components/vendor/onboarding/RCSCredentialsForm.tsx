import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, TestTube, CheckCircle, XCircle, ExternalLink, HelpCircle, MessageSquareMore } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const rcsCredentialsSchema = z.object({
  agentId: z.string().min(1, 'Agent ID is required'),
  brandId: z.string().min(1, 'Brand ID is required'),
  serviceAccountKey: z.string().min(1, 'Service account key is required'),
  partnerId: z.string().min(1, 'Partner ID is required'),
  webhookUrl: z.string().url('Please enter a valid webhook URL').optional().or(z.literal('')),
  webhookSecret: z.string().optional(),
});

type RCSCredentialsData = z.infer<typeof rcsCredentialsSchema>;

interface RCSCredentialsFormProps {
  data?: Partial<RCSCredentialsData>;
  onDataChange: (data: Partial<RCSCredentialsData>) => void;
  onNext: () => void;
  onPrevious?: () => void;
  canProceed: (isValid: boolean) => void;
  vendorName?: string;
}

export const RCSCredentialsForm: React.FC<RCSCredentialsFormProps> = ({
  data = {},
  onDataChange,
  onNext,
  onPrevious,
  canProceed,
  vendorName = 'RCS Provider'
}) => {
  const [showServiceAccountKey, setShowServiceAccountKey] = React.useState(false);
  const [showWebhookSecret, setShowWebhookSecret] = React.useState(false);
  const [testStatus, setTestStatus] = React.useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  
  const form = useForm<RCSCredentialsData>({
    resolver: zodResolver(rcsCredentialsSchema),
    defaultValues: {
      agentId: data.agentId || '',
      brandId: data.brandId || '',
      serviceAccountKey: data.serviceAccountKey || '',
      partnerId: data.partnerId || '',
      webhookUrl: data.webhookUrl || '',
      webhookSecret: data.webhookSecret || '',
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
              <MessageSquareMore className="w-5 h-5" />
              {vendorName} RCS Credentials
            </div>
            {getTestStatusBadge()}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription className="flex items-center gap-2">
              Configure your RCS Business Messaging credentials. Brand verification is required before going live.
              <a 
                href="https://developers.google.com/business-communications/rcs-business-messaging" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                Learn more about RCS
                <ExternalLink className="w-3 h-3" />
              </a>
            </AlertDescription>
          </Alert>

          <Form {...form}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="agentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Agent ID *
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="w-4 h-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Your unique RCS agent identifier from Google Business Communications.</p>
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="brands/{brand-id}/agents/{agent-id}" {...field} />
                      </FormControl>
                      <FormDescription>
                        RCS agent ID from Google Business Communications
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="brandId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Brand ID *
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="w-4 h-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Your brand identifier that represents your business in RCS.</p>
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="brands/{brand-id}" {...field} />
                      </FormControl>
                      <FormDescription>
                        Brand ID for your verified business
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="partnerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Partner ID *
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Your RCS partner identifier assigned by Google.</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="partners/{partner-id}" {...field} />
                    </FormControl>
                    <FormDescription>
                      RCS partner ID assigned by Google
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serviceAccountKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Service Account Key *
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>JSON service account key file contents for authentication with Google APIs.</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Textarea 
                          placeholder="Paste your service account JSON key here"
                          className={showServiceAccountKey ? "" : "font-mono text-sm filter blur-sm"}
                          rows={4}
                          {...field} 
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-2 h-8 px-2"
                          onClick={() => setShowServiceAccountKey(!showServiceAccountKey)}
                        >
                          {showServiceAccountKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      JSON service account key from Google Cloud Console
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <p>Optional: URL to receive RCS message events and delivery receipts.</p>
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://yourapp.com/webhooks/rcs" {...field} />
                      </FormControl>
                      <FormDescription>
                        Your webhook endpoint for RCS events
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="webhookSecret"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Webhook Secret
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="w-4 h-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Optional: Secret key for webhook signature verification.</p>
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showWebhookSecret ? "text" : "password"}
                            placeholder="Enter webhook secret" 
                            {...field} 
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                          >
                            {showWebhookSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Secret for webhook signature verification
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
                    Failed to connect to RCS provider. Please check your credentials and brand verification status.
                  </AlertDescription>
                </Alert>
              )}

              {testStatus === 'success' && (
                <Alert className="border-status-success bg-status-success/10">
                  <CheckCircle className="h-4 w-4 text-status-success" />
                  <AlertDescription className="text-status-success">
                    Successfully connected to RCS provider!
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