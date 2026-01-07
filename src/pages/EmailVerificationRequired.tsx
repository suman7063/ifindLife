import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const EmailVerificationRequired: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    // Get current user email if available
    const getCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setEmail(session.user.email);
      }
    };
    getCurrentUser();
  }, []);

  const handleResendVerification = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth-callback?type=user`
        }
      });
      
      if (error) {
        console.error('Resend verification error:', error);
        toast.error('Failed to resend verification email: ' + error.message);
      } else {
        toast.success('Verification email sent! Please check your inbox and spam folder.');
      }
    } catch (error) {
      console.error('Error resending verification:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const handleCheckVerification = async () => {
    setLoading(true);
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        toast.error('Error checking verification status');
        return;
      }

      if (session?.user?.email_confirmed_at) {
        toast.success('Email verified! Redirecting...');
        setTimeout(() => {
          navigate('/user-dashboard', { replace: true });
        }, 1000);
      } else {
        toast.info('Email not verified yet. Please check your inbox and click the verification link.');
      }
    } catch (error) {
      console.error('Error checking verification:', error);
      toast.error('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Email Verification Required</CardTitle>
          <p className="text-gray-600 text-sm mt-2">
            Please verify your email address to access your account
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-blue-50 text-blue-700 border-blue-200">
            <Mail className="h-4 w-4" />
            <AlertDescription>
              We've sent a verification link to <strong>{email || 'your email address'}</strong>. 
              Please check your inbox and click the link to verify your email.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p className="text-sm font-medium text-gray-700">What to do:</p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Check your email inbox</li>
                <li>Look in spam/junk folder if not found</li>
                <li>Click the verification link in the email</li>
                <li>You'll be redirected automatically after verification</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <Button 
                onClick={handleCheckVerification}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    I've Verified My Email
                  </>
                )}
              </Button>

              <Button 
                onClick={handleResendVerification}
                disabled={resending}
                variant="outline"
                className="w-full"
              >
                {resending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Resend Verification Email
                  </>
                )}
              </Button>
            </div>

            <div className="text-center pt-2">
              <Button 
                variant="ghost"
                onClick={() => navigate('/user-login')}
                className="text-sm"
              >
                Back to Login
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerificationRequired;

