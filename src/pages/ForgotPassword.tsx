
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Mail, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuthPassword } from '@/hooks/auth/useAuthPassword';
import { toast } from 'sonner';
import CaptchaField from '@/components/auth/form/CaptchaField';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { resetPassword } = useAuthPassword(setLoading);
  
  // Get user type from URL query params
  const queryParams = new URLSearchParams(location.search);
  const userType = queryParams.get('type') || 'user';
  
  // Create form schema with validation
  const schema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    captcha: z.string().min(1, { message: "Please verify that you are not a robot" })
  });
  
  type FormValues = z.infer<typeof schema>;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      captcha: ""
    }
  });
  
  const getBackLink = () => {
    switch(userType) {
      case 'expert':
        return '/expert-login';
      case 'admin':
        return '/admin-login';
      default:
        return '/user-login';
    }
  };
  
  const handleSubmit = async (data: FormValues) => {
    try {
      const success = await resetPassword(data.email);
      if (success) {
        setEmailSent(true);
      }
    } catch (error) {
      console.error("Error sending reset email:", error);
      toast.error("Failed to send reset instructions");
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10 flex items-center justify-center">
        <div className="container max-w-md">
          <div className="bg-background/95 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-ifind-teal/10">
            
            <Link to={getBackLink()} className="flex items-center text-ifind-aqua hover:text-ifind-teal mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to login
            </Link>
            
            {emailSent ? (
              <div className="text-center space-y-4">
                <div className="inline-block p-3 bg-green-100 rounded-full">
                  <Mail className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold">Check your email</h1>
                <p className="text-gray-600">
                  We've sent password reset instructions to your email address. Please check your inbox.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-6 w-full"
                  onClick={() => navigate(getBackLink())}
                >
                  Return to Login
                </Button>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-center mb-6">Reset your password</h1>
                <p className="text-gray-600 mb-6">
                  Enter your email address and we'll send you instructions to reset your password.
                </p>
                
                <FormProvider {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="your@email.com"
                                className="pl-10"
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <CaptchaField name="captcha" />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-ifind-aqua hover:bg-ifind-teal"
                      disabled={loading}
                    >
                      {loading ? 'Sending...' : 'Send Reset Instructions'}
                    </Button>
                  </form>
                </FormProvider>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
