import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const businessDetailsSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  contactEmail: z.string().email('Please enter a valid email address'),
  contactPhone: z.string().min(10, 'Please enter a valid phone number'),
  businessType: z.string().min(1, 'Please select a business type'),
  businessWebsite: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
  businessAddress: z.string().min(10, 'Please enter your complete business address'),
});

type BusinessDetailsData = z.infer<typeof businessDetailsSchema>;

interface BusinessDetailsFormProps {
  data?: Partial<BusinessDetailsData>;
  onDataChange: (data: Partial<BusinessDetailsData>) => void;
  onNext: () => void;
  onPrevious?: () => void;
  canProceed: (isValid: boolean) => void;
}

export const BusinessDetailsForm: React.FC<BusinessDetailsFormProps> = ({
  data = {},
  onDataChange,
  onNext,
  onPrevious,
  canProceed
}) => {
  const form = useForm<BusinessDetailsData>({
    resolver: zodResolver(businessDetailsSchema),
    defaultValues: {
      businessName: data.businessName || '',
      contactEmail: data.contactEmail || '',
      contactPhone: data.contactPhone || '',
      businessType: data.businessType || '',
      businessWebsite: data.businessWebsite || '',
      businessAddress: data.businessAddress || '',
    },
    mode: 'onChange'
  });

  React.useEffect(() => {
    const subscription = form.watch((value) => {
      onDataChange(value);
    });
    return () => subscription.unsubscribe();
  }, [form, onDataChange]);

  // Separate effect for canProceed to ensure it updates when form validity changes
  React.useEffect(() => {
    canProceed(form.formState.isValid);
  }, [form.formState.isValid, canProceed]);

  const businessTypes = [
    'E-commerce',
    'Healthcare',
    'Financial Services',
    'Education',
    'Technology',
    'Retail',
    'Real Estate',
    'Automotive',
    'Travel & Hospitality',
    'Government',
    'Non-Profit',
    'Other'
  ];

  return (
    <TooltipProvider>
      <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Business Name *
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Your official business name as registered. This will be used for verification and compliance purposes.</p>
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your business name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Contact Email *
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Primary business email for communications and notifications.</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="contact@company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Contact Phone *
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Business phone number with country code (e.g., +1234567890).</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="+1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="businessType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Business Type *
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Select the category that best describes your business. This helps with compliance and routing optimization.</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {businessTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessWebsite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Business Website
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Optional: Your business website URL. Helps with brand verification.</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="businessAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Business Address *
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Complete business address including street, city, state/province, and postal code.</p>
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your complete business address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>
      </CardContent>
    </Card>
    </TooltipProvider>
  );
};