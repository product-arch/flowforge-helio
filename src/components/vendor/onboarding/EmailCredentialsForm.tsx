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
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const emailCredentialsSchema = z.object({
  providerType: z.string().min(1, 'Please select a provider type'),
  apiKey: z.string().min(1, 'API key is required'),
  apiSecret: z.string().optional(),
  smtpHost: z.string().optional(),
  smtpPort: z.number().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  fromEmail: z.string().email('Please enter a valid from email'),
  fromName: z.string().min(1, 'From name is required'),
  enableTls: z.boolean().default(true),
  enableAuthentication: z.boolean().default(true),
});

type EmailCredentialsData = z.infer<typeof emailCredentialsSchema>;

interface EmailCredentialsFormProps {
  data?: Partial<EmailCredentialsData>;
  onDataChange: (data: Partial<EmailCredentialsData>) => void;
  onNext: () => void;
  onPrevious?: () => void;
  canProceed: (isValid: boolean) => void;
  vendorName?: string;
}

export const EmailCredentialsForm: React.FC<EmailCredentialsFormProps> = ({
  data = {},
  onDataChange,
  onNext,
  onPrevious,
  canProceed,
  vendorName = 'Email Provider'
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showApiSecret, setShowApiSecret] = React.useState(false);
  const [testStatus, setTestStatus] = React.useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  
  const form = useForm<EmailCredentialsData>({
    resolver: zodResolver(emailCredentialsSchema),
    defaultValues: {
      providerType: data.providerType || '',
      apiKey: data.apiKey || '',
      apiSecret: data.apiSecret || '',
      smtpHost: data.smtpHost || '',
      smtpPort: data.smtpPort || 587,
      username: data.username || '',
      password: data.password || '',
      fromEmail: data.fromEmail || '',
      fromName: data.fromName || '',
      enableTls: data.enableTls ?? true,
      enableAuthentication: data.enableAuthentication ?? true,
    },
    mode: 'onChange'
  });

  const selectedProvider = form.watch('providerType');

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

  const isApiProvider = ['sendgrid', 'mailgun', 'ses', 'postmark', 'resend'].includes(selectedProvider);

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {vendorName} Email Credentials
            {getTestStatusBadge()}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription className="flex items-center gap-2">
              Configure your email provider credentials. Domain verification may be required for production use.
              <a 
                href="https://docs.sendgrid.com/for-developers/sending-email/authentication" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                Learn more about email authentication
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
                      Provider Type *
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Choose your email service provider. This determines which fields are required.</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select provider type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sendgrid">SendGrid</SelectItem>
                        <SelectItem value="mailgun">Mailgun</SelectItem>
                        <SelectItem value="ses">Amazon SES</SelectItem>
                        <SelectItem value="postmark">Postmark</SelectItem>
                        <SelectItem value="resend">Resend</SelectItem>
                        <SelectItem value="smtp">Custom SMTP</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedProvider && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="apiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            {isApiProvider ? 'API Key' : 'Username/API Key'} *
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="w-4 h-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Your API key or username for authentication with the email provider.</p>
                              </TooltipContent>
                            </Tooltip>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your API key" {...field} />
                          </FormControl>
                          <FormDescription>
                            {isApiProvider ? 'API key from your email provider dashboard' : 'Username or API key for authentication'}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {(selectedProvider === 'mailgun' || selectedProvider === 'smtp') && (
                      <FormField
                        control={form.control}
                        name="apiSecret"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              {selectedProvider === 'smtp' ? 'Password' : 'API Secret'}
                              <Tooltip>
                                <TooltipTrigger>
                                  <HelpCircle className="w-4 h-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Password or secret key for authentication.</p>
                                </TooltipContent>
                              </Tooltip>
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type={showApiSecret ? "text" : "password"}
                                  placeholder="Enter password/secret" 
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
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  {selectedProvider === 'smtp' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="smtpHost"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SMTP Host *</FormLabel>
                            <FormControl>
                              <Input placeholder="smtp.gmail.com" {...field} />
                            </FormControl>
                            <FormDescription>
                              SMTP server hostname
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="smtpPort"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SMTP Port *</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="587" 
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 587)}
                              />
                            </FormControl>
                            <FormDescription>
                              Usually 587 (TLS) or 465 (SSL)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fromEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            From Email *
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="w-4 h-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>The email address that will appear as the sender. Must be verified with your provider.</p>
                              </TooltipContent>
                            </Tooltip>
                          </FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="noreply@yourdomain.com" {...field} />
                          </FormControl>
                          <FormDescription>
                            Must be verified with your email provider
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fromName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Company Name" {...field} />
                          </FormControl>
                          <FormDescription>
                            Display name for the sender
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {selectedProvider === 'smtp' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="enableTls"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Enable TLS</FormLabel>
                              <FormDescription>
                                Use TLS encryption for secure connection
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="enableAuthentication"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Enable Authentication</FormLabel>
                              <FormDescription>
                                Use SMTP authentication
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

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
                        Failed to connect to email provider. Please check your credentials and try again.
                      </AlertDescription>
                    </Alert>
                  )}

                  {testStatus === 'success' && (
                    <Alert className="border-status-success bg-status-success/10">
                      <CheckCircle className="h-4 w-4 text-status-success" />
                      <AlertDescription className="text-status-success">
                        Successfully connected to email provider!
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              )}
            </div>
          </Form>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};