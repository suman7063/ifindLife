
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/supabase';

interface InquiryFormProps {
  serviceName: string;
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  onSuccess: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().optional(),
  preferredSlot: z.string().min(1, { message: 'Please select a preferred time slot' }),
  description: z.string().min(10, { message: 'Please provide at least 10 characters describing your situation' }),
});

type FormValues = z.infer<typeof formSchema>;

const InquiryForm: React.FC<InquiryFormProps> = ({ 
  serviceName, 
  currentUser, 
  isAuthenticated,
  onSuccess 
}) => {
  // Create form with default values based on user auth state
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: isAuthenticated && currentUser ? currentUser.name || '' : '',
      email: isAuthenticated && currentUser ? currentUser.email || '' : '',
      phone: isAuthenticated && currentUser ? currentUser.phone || '' : '',
      preferredSlot: '',
      description: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      // In a real app, you would send this to your backend
      // Here we'll just simulate an API call
      console.log('Submitting inquiry:', {
        ...values,
        service: serviceName,
        userId: isAuthenticated && currentUser ? currentUser.id : null,
        timestamp: new Date().toISOString()
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      toast.success('Your inquiry has been submitted successfully! We will contact you soon.', {
        duration: 5000
      });
      
      // Call the success callback
      onSuccess();
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast.error('There was an error submitting your inquiry. Please try again.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="your.email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Your phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="preferredSlot"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Time Slot</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a preferred time" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="morning-weekday">Weekday Mornings (9AM-12PM)</SelectItem>
                  <SelectItem value="afternoon-weekday">Weekday Afternoons (12PM-5PM)</SelectItem>
                  <SelectItem value="evening-weekday">Weekday Evenings (5PM-9PM)</SelectItem>
                  <SelectItem value="morning-weekend">Weekend Mornings (9AM-12PM)</SelectItem>
                  <SelectItem value="afternoon-weekend">Weekend Afternoons (12PM-5PM)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Situation or Requirements</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Please describe what you're looking for and any specific requirements or concerns..." 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button variant="outline" type="button" onClick={onSuccess}>
            Cancel
          </Button>
          <Button type="submit" className="bg-ifind-purple hover:bg-ifind-purple/90">
            Submit Inquiry
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default InquiryForm;
