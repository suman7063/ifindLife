
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { passwordSchema, validatePasswordStrength } from '@/utils/validationSchemas';

// Create form validation schema
const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userType = searchParams.get('type') || 'user';

  // Set up form with validation
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Update password strength when password changes
  const password = form.watch("password");
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    // Use common validatePasswordStrength function
    const strengthResult = validatePasswordStrength(password);
    setPasswordStrength(strengthResult.score);
  }, [password]);

  // Determine password strength color and label (4 checks: length, letter, number, special)
  const getPasswordStrengthInfo = () => {
    if (passwordStrength === 0) return { color: "bg-gray-200", label: "Password strength" };
    if (passwordStrength < 2) return { color: "bg-red-500", label: "Weak" };
    if (passwordStrength < 4) return { color: "bg-yellow-500", label: "Medium" };
    return { color: "bg-green-500", label: "Strong" };
  };

  const passwordStrengthInfo = getPasswordStrengthInfo();

  const getRedirectPage = () => {
    switch (userType) {
      case 'expert':
        return '/expert-login';
      case 'admin':
        return '/admin-login';
      case 'user':
      default:
        return '/login';
    }
  };

  // Check if we have the hash fragment from Supabase
  useEffect(() => {
    const handleHashChange = async () => {
      const hash = window.location.hash;
      if (hash && hash.includes('type=recovery')) {
        // Hash present, but we don't need to do anything here
        // Supabase will handle it when we call updateUser
      }
    };

    handleHashChange();
  }, []);

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ password: data.password });
      
      if (error) {
        throw error;
      }
      
      setIsSuccess(true);
      toast.success('Password has been reset successfully');
      
      // Redirect to appropriate login page after a short delay
      setTimeout(() => {
        navigate(getRedirectPage());
      }, 3000);
    } catch (error) {
      console.error('Error updating password:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to reset password';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-16 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Create New Password</CardTitle>
            <CardDescription>
              Enter your new password below.
            </CardDescription>
          </CardHeader>
          
          {isSuccess ? (
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 text-green-800 rounded-md">
                <p>Your password has been reset successfully!</p>
                <p className="mt-2">You will be redirected to the login page shortly.</p>
              </div>
            </CardContent>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>New Password</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
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
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">{passwordStrengthInfo.label}</span>
                            <span className="text-xs text-muted-foreground">{passwordStrength}/4</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${passwordStrengthInfo.color} transition-all duration-300`} 
                              style={{ width: `${(passwordStrength / 4) * 100}%` }}
                            ></div>
                          </div>
                          
                          <ul className="text-xs space-y-1 text-muted-foreground">
                            <li className="flex items-center">
                              {field.value.length >= 8 ? 
                                <Check className="h-3 w-3 text-green-500 mr-1" /> : 
                                <AlertCircle className="h-3 w-3 text-muted-foreground mr-1" />
                              }
                              Minimum 8 characters
                            </li>
                            <li className="flex items-center">
                              {/[A-Za-z]/.test(field.value) ? 
                                <Check className="h-3 w-3 text-green-500 mr-1" /> : 
                                <AlertCircle className="h-3 w-3 text-muted-foreground mr-1" />
                              }
                              One letter
                            </li>
                            <li className="flex items-center">
                              {/[0-9]/.test(field.value) ? 
                                <Check className="h-3 w-3 text-green-500 mr-1" /> : 
                                <AlertCircle className="h-3 w-3 text-muted-foreground mr-1" />
                              }
                              One number
                            </li>
                            <li className="flex items-center">
                              {/[^A-Za-z0-9]/.test(field.value) ? 
                                <Check className="h-3 w-3 text-green-500 mr-1" /> : 
                                <AlertCircle className="h-3 w-3 text-muted-foreground mr-1" />
                              }
                              One special character
                            </li>
                          </ul>
                        </div>
                        
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Confirm Password</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  <Button 
                    type="submit" 
                    className="w-full bg-ifind-aqua hover:bg-ifind-teal transition-colors"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Updating...' : 'Reset Password'}
                  </Button>
                  <div className="text-sm text-center mt-2">
                    <Link to={getRedirectPage()} className="text-ifind-aqua hover:text-ifind-teal transition-colors">
                      Back to Login
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </Form>
          )}
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPassword;
