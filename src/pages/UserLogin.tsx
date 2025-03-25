
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { toast } from 'sonner';
import { fetchReferralSettings } from '@/utils/referralUtils';
import { ReferralSettings } from '@/types/supabase';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { Link } from 'react-router-dom';
import { Loader2, Lock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

const UserLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, isAuthenticated } = useUserAuth();
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [referralSettings, setReferralSettings] = useState<ReferralSettings | null>(null);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  // Get referral code from URL if available
  const queryParams = new URLSearchParams(location.search);
  const referralCodeFromUrl = queryParams.get('ref');
  const redirectPath = location.state?.from || '/user-dashboard';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath);
    }
  }, [isAuthenticated, navigate, redirectPath]);

  // Load referral settings
  useEffect(() => {
    const loadReferralSettings = async () => {
      const settings = await fetchReferralSettings();
      setReferralSettings(settings);
    };
    
    loadReferralSettings();
  }, []);

  // Switch to registration tab if referral code is in URL
  useEffect(() => {
    if (referralCodeFromUrl) {
      // Find the register tab trigger and click it
      const registerTab = document.querySelector('[data-value="register"]');
      if (registerTab && registerTab instanceof HTMLElement) {
        registerTab.click();
      }
    }
  }, [referralCodeFromUrl]);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        toast.success('Login successful');
        navigate('/user-dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    country: string;
    city: string;
    referralCode?: string;
  }) => {
    setLoading(true);
    
    try {
      console.log("Attempting to sign up with:", userData);
      const success = await signup(userData);
      console.log("Signup result:", success);
      
      if (success) {
        setVerificationSent(true);
        toast.success('Please check your email to confirm your account');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Failed to register account');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    try {
      setSocialLoading(provider);
      toast.info(`Logging in with ${provider}...`);
      
      let { error } = await supabase.auth.signInWithOAuth({ 
        provider,
        options: {
          redirectTo: `${window.location.origin}/user-dashboard`
        }
      });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error(`${provider} login error:`, error);
      toast.error(`${provider} login failed: ${error.message || 'Please try again later'}`);
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10 flex items-center justify-center bg-stars">
        <div className="container max-w-md">
          <div className="bg-background/80 backdrop-blur-md rounded-xl shadow-xl p-8 border border-ifind-aqua/10">
            <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
              <div className="relative w-8 h-8">
                <div className="absolute w-8 h-8 bg-ifind-aqua rounded-full opacity-70"></div>
                <div className="absolute w-4 h-4 bg-ifind-teal rounded-full top-1 left-2"></div>
              </div>
              <span className="font-bold text-2xl text-gradient">iFindLife</span>
            </Link>
            
            {verificationSent ? (
              <div className="space-y-6">
                <div className="text-center">
                  <Lock className="mx-auto h-12 w-12 text-ifind-aqua mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
                  <p className="text-gray-600 mb-4">
                    We've sent a verification link to your email address. Please check your inbox and click the link to activate your account.
                  </p>
                </div>

                <Alert className="bg-blue-50 text-blue-700 border-blue-200">
                  <AlertDescription>
                    If you don't see the email, check your spam folder or try again.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => setVerificationSent(false)}
                  >
                    Back to Login
                  </Button>
                </div>
              </div>
            ) : (
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger data-value="login" value="login">Login</TabsTrigger>
                  <TabsTrigger data-value="register" value="register">Register</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <div className="space-y-4">
                    <LoginForm onLogin={handleLogin} loading={loading} userType="user" />
                    
                    <div className="relative flex items-center py-2">
                      <div className="flex-grow border-t border-gray-300"></div>
                      <span className="flex-shrink mx-3 text-gray-500 text-sm">or continue with</span>
                      <div className="flex-grow border-t border-gray-300"></div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <Button 
                        variant="outline" 
                        className="flex items-center justify-center" 
                        onClick={() => handleSocialLogin('google')}
                        disabled={!!socialLoading}
                      >
                        {socialLoading === 'google' ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <img src="/lovable-uploads/e973bbdf-7ff5-43b6-9c67-969efbc55fa4.png" alt="Google" className="h-5 w-5" />
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex items-center justify-center" 
                        onClick={() => handleSocialLogin('facebook')}
                        disabled={!!socialLoading}
                      >
                        {socialLoading === 'facebook' ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <img src="/lovable-uploads/6fdf43ed-732a-4659-a397-a7d061440bc2.png" alt="Facebook" className="h-5 w-5" />
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex items-center justify-center" 
                        onClick={() => handleSocialLogin('apple')}
                        disabled={!!socialLoading}
                      >
                        {socialLoading === 'apple' ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <img src="/lovable-uploads/55b74deb-7ab0-4410-a3db-d3706db1d19a.png" alt="Apple" className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="register">
                  <RegisterForm 
                    onRegister={handleSignup} 
                    loading={loading} 
                    initialReferralCode={referralCodeFromUrl}
                    referralSettings={referralSettings}
                    setCaptchaVerified={() => setShowCaptcha(true)}
                  />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserLogin;
