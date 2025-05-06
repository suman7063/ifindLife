
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Mail, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';

// Define login form schema
const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

interface ExpertLoginFormProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
  isLoggingIn: boolean;
  loginError: string | null;
  setActiveTab: (tab: string) => void;
}

const ExpertLoginForm: React.FC<ExpertLoginFormProps> = ({
  onLogin,
  isLoggingIn,
  loginError,
  setActiveTab
}) => {
  const [showPassword, setShowPassword] = useState(false);
  
  // Initialize form with react-hook-form and zod validation
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmit = async (values: LoginFormValues) => {
    if (isLoggingIn) return;
    
    await onLogin(values.email, values.password);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {loginError && (
          <Alert variant="destructive">
            <AlertDescription>{loginError}</AlertDescription>
          </Alert>
        )}
      
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="pl-10"
                    disabled={isLoggingIn}
                    {...field}
                  />
                </FormControl>
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Link to="/forgot-password?type=expert" className="text-xs text-ifind-aqua hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <FormControl>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    disabled={isLoggingIn}
                    {...field}
                  />
                </FormControl>
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-ifind-aqua hover:bg-ifind-teal"
          disabled={isLoggingIn}
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing In...
            </>
          ) : (
            'Sign In as Expert'
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Don't have an account?{' '}
          <button 
            type="button"
            className="text-ifind-aqua hover:underline"
            onClick={() => setActiveTab('register')}
          >
            Sign up
          </button>
        </p>
      </form>
    </Form>
  );
};

export default ExpertLoginForm;
