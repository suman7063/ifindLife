
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
  specialization: z.string().optional(),
  experience: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const ExpertRegisterForm: React.FC = () => {
  const auth = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      specialization: '',
      experience: '',
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    setIsRegistering(true);
    try {
      // For backward compatibility, check if registerExpert exists, otherwise use signup
      if (auth.registerExpert) {
        await auth.registerExpert(data.email, data.password, {
          name: data.name,
          phone: data.phone,
          specialization: data.specialization,
          experience: data.experience,
        });
      } else {
        await auth.signup(data.email, data.password, {
          name: data.name,
          phone: data.phone,
          specialization: data.specialization,
          experience: data.experience,
          isExpert: true,  // Flag to indicate this is an expert registration
        });
      }
      
      toast.success('Registration successful!');
      // Redirect is handled by the auth provider
    } catch (error) {
      console.error('Expert registration error:', error);
      toast.error('An error occurred during registration');
    } finally {
      setIsRegistering(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
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
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
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
                <Input placeholder="+1234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="specialization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specialization (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Relationship Counseling" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years of Experience (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isRegistering}
        >
          {isRegistering ? 'Registering...' : 'Register as Expert'}
        </Button>
      </form>
    </Form>
  );
};

export default ExpertRegisterForm;
