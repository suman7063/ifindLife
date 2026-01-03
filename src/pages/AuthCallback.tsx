import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');
  
  const userType = searchParams.get('type') || 'user';

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // First, check for errors in URL hash fragment (Supabase sends errors in hash)
        const hash = window.location.hash;
        if (hash) {
          const hashParams = new URLSearchParams(hash.substring(1)); // Remove the '#' 
          const hashError = hashParams.get('error');
          const hashErrorCode = hashParams.get('error_code');
          const hashErrorDescription = hashParams.get('error_description');
          
          if (hashError) {
            setStatus('error');
            let errorMessage = 'Email verification failed.';
            
            if (hashError === 'access_denied') {
              if (hashErrorCode === 'otp_expired' || hashErrorDescription?.includes('expired')) {
                errorMessage = 'Email verification link has expired. Please request a new verification email.';
              } else if (hashErrorDescription?.includes('invalid') || hashErrorDescription?.includes('Invalid')) {
                errorMessage = 'Email verification link is invalid. Please request a new verification email.';
              } else {
                errorMessage = hashErrorDescription 
                  ? decodeURIComponent(hashErrorDescription.replace(/\+/g, ' '))
                  : 'Email verification link is invalid or has expired.';
              }
            } else {
              errorMessage = hashErrorDescription 
                ? decodeURIComponent(hashErrorDescription.replace(/\+/g, ' '))
                : 'Email verification failed. Please try again.';
            }
            
            setMessage(errorMessage);
            return;
          }
        }

        // Parse the URL hash for auth tokens
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          setStatus('error');
          setMessage('Email verification failed. Please try signing up again.');
          return;
        }

        if (data.session) {
          // User is now verified and logged in
          setStatus('success');
          if (userType === 'expert') {
            setMessage('Email verified successfully! Your expert account is pending admin approval.');
            // Sign out expert users since they need approval first
            await supabase.auth.signOut();
            setTimeout(() => {
              navigate('/expert-login');
            }, 3000);
          } else {
            setMessage('Email verified successfully! You can now access your account.');
            setTimeout(() => {
              navigate('/user-dashboard');
            }, 2000);
          }
          toast.success('Email verified successfully!');
        } else {
          // Check for error in URL query parameters (fallback)
          const queryError = searchParams.get('error');
          const queryErrorDescription = searchParams.get('error_description');
          
          if (queryError) {
            setStatus('error');
            if (queryError === 'access_denied' && queryErrorDescription?.includes('otp_expired')) {
              setMessage('Email verification link has expired. Please request a new verification email.');
            } else if (queryError === 'access_denied' && queryErrorDescription?.includes('Email link is invalid')) {
              setMessage('Email verification link is invalid. Please request a new verification email.');
            } else {
              setMessage(queryErrorDescription || 'Email verification failed. Please try again.');
            }
          } else {
            setStatus('error');
            setMessage('Invalid verification link. Please try signing up again.');
          }
        }
      } catch (error) {
        console.error('Auth callback exception:', error);
        setStatus('error');
        setMessage('An unexpected error occurred during verification.');
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams, userType]);

  const handleRetry = () => {
    if (userType === 'expert') {
      navigate('/expert-register');
    } else {
      navigate('/user-signup');
    }
  };

  const handleResendVerification = async () => {
    try {
      // Try to get email from query params first
      let email = searchParams.get('email');
      
      // If not in query params, try to get from hash fragment
      if (!email) {
        const hash = window.location.hash;
        if (hash) {
          const hashParams = new URLSearchParams(hash.substring(1));
          email = hashParams.get('email');
        }
      }
      
      if (email) {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth-callback?type=${userType}`
          }
        });
        
        if (error) {
          toast.error('Failed to resend verification email: ' + error.message);
        } else {
          toast.success('Verification email sent! Please check your inbox.');
        }
      } else {
        // If email not found, redirect to resend verification page where user can enter email
        navigate('/resend-verification');
      }
    } catch (error) {
      console.error('Error resending verification:', error);
      toast.error('Failed to resend verification email.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="mx-auto h-12 w-12 text-blue-600 animate-spin mb-4" />
              <CardTitle className="text-xl">Verifying Your Email</CardTitle>
            </>
          )}
          {status === 'success' && (
            <>
              <CheckCircle className="mx-auto h-12 w-12 text-green-600 mb-4" />
              <CardTitle className="text-xl text-green-700">Email Verified!</CardTitle>
            </>
          )}
          {status === 'error' && (
            <>
              <XCircle className="mx-auto h-12 w-12 text-red-600 mb-4" />
              <CardTitle className="text-xl text-red-700">Verification Failed</CardTitle>
            </>
          )}
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">{message}</p>
          
          {status === 'error' && (
            <div className="space-y-3">
              <Button onClick={handleRetry} className="w-full">
                Try Again
              </Button>
              {(message.includes('expired') || message.includes('invalid')) && (
                <div className="space-y-2">
                  <Button 
                    onClick={handleResendVerification} 
                    variant="outline" 
                    className="w-full"
                  >
                    Resend Verification Email
                  </Button>
                  <Button 
                    onClick={() => navigate('/resend-verification')} 
                    variant="ghost" 
                    className="w-full text-sm"
                  >
                    Or go to resend page
                  </Button>
                </div>
              )}
              <p className="text-sm text-gray-500">
                Need help? Contact our support team.
              </p>
            </div>
          )}
          
          {status === 'success' && userType === 'user' && (
            <p className="text-sm text-blue-600">
              Redirecting to your dashboard...
            </p>
          )}
          
          {status === 'success' && userType === 'expert' && (
            <p className="text-sm text-orange-600">
              Redirecting to login page...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;