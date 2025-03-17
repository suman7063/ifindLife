
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userType = searchParams.get('type') || 'user';

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

  const getPageTitle = () => {
    switch (userType) {
      case 'expert':
        return 'Expert Password Reset';
      case 'admin':
        return 'Admin Password Reset';
      case 'user':
      default:
        return 'Password Reset';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password?type=${userType}`,
      });
      
      if (error) {
        throw error;
      }
      
      setSubmitted(true);
      toast.success('Password reset instructions sent to your email');
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast.error(error.message || 'Failed to send reset instructions');
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
            <CardTitle>{getPageTitle()}</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you instructions to reset your password.
            </CardDescription>
          </CardHeader>
          
          {submitted ? (
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 text-green-800 rounded-md">
                <p>Password reset instructions have been sent to your email address.</p>
                <p className="mt-2">Please check your inbox and follow the link to reset your password.</p>
              </div>
              <Alert className="bg-blue-50 text-blue-700 border-blue-200">
                <InfoIcon className="h-4 w-4" />
                <AlertDescription>
                  If you don't receive an email, please check your spam folder or try another email address you might have used.
                </AlertDescription>
              </Alert>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Alert className="bg-blue-50 text-blue-700 border-blue-200">
                  <InfoIcon className="h-4 w-4" />
                  <AlertDescription>
                    Not sure which email you used? For security reasons, we won't confirm if an email exists. 
                    Try with different emails you typically use for registrations.
                  </AlertDescription>
                </Alert>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button 
                  type="submit" 
                  className="w-full bg-ifind-aqua hover:bg-ifind-teal transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Instructions'}
                </Button>
                <div className="text-sm text-center mt-2">
                  <Link to={getRedirectPage()} className="text-ifind-aqua hover:text-ifind-teal transition-colors">
                    Back to Login
                  </Link>
                </div>
              </CardFooter>
            </form>
          )}
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
