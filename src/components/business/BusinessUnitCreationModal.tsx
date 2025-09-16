import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChannelSelector } from './ChannelSelector';

const businessUnitSchema = z.object({
  brandName: z.string()
    .min(2, 'Brand name must be at least 2 characters')
    .max(50, 'Brand name must be less than 50 characters'),
  businessEntityName: z.string()
    .min(2, 'Business entity name must be at least 2 characters')
    .max(50, 'Business entity name must be less than 50 characters'),
  channels: z.array(z.string())
    .min(1, 'Please select at least one channel'),
});

type BusinessUnitFormData = z.infer<typeof businessUnitSchema>;

interface BusinessUnitCreationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: BusinessUnitFormData) => void;
}

export const BusinessUnitCreationModal: React.FC<BusinessUnitCreationModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
}) => {
  const form = useForm<BusinessUnitFormData>({
    resolver: zodResolver(businessUnitSchema),
    defaultValues: {
      brandName: '',
      businessEntityName: '',
      channels: [],
    },
  });

  const handleSubmit = (data: BusinessUnitFormData) => {
    onSubmit(data);
    form.reset();
    onOpenChange(false);
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create New Business Unit</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="brandName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter brand name" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="businessEntityName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Entity Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter business entity name" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="channels"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Channels to be Activated</FormLabel>
                  <FormControl>
                    <ChannelSelector 
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Creating...' : 'Create Business Unit'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};