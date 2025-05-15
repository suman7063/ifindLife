
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export interface ExpertLoginFormProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
  isLoggingIn: boolean;
  loginError: string | null;
  setActiveTab: (tab: string) => void;
}

const ExpertLoginForm: React.FC<ExpertLoginFormProps> = ({
  onLogin,
  isLoggingIn,
  loginError,
  setActiveTab,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    await onLogin(data.email, data.password);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  placeholder="you@example.com" 
                  {...field} 
                  autoComplete="email"
                />
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
                <Input 
                  type="password" 
                  placeholder="******" 
                  {...field} 
                  autoComplete="current-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoggingIn}
        >
          {isLoggingIn ? 'Signing in...' : 'Sign In'}
        </Button>
        
        <div className="text-center text-sm mt-4">
          <p>
            Don't have an account?{' '}
            <Button 
              variant="link" 
              className="p-0 h-auto" 
              onClick={() => setActiveTab('register')}
            >
              Register as Expert
            </Button>
          </p>
        </div>
      </form>
    </Form>
  );
};

export default ExpertLoginForm;
