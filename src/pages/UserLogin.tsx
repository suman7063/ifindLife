
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { toast } from 'sonner';
import { fetchReferralSettings } from '@/utils/referralUtils';
import { ReferralSettings } from '@/types/supabase';
import { Loader2 } from 'lucide-react';
import LoginHeader from '@/components/auth/LoginHeader';
import LoginTab from '@/components/auth/LoginTab';
import RegisterTab from '@/components/auth/RegisterTab';
import VerificationScreen from '@/components/auth/VerificationScreen';

const UserLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, isAuthenticated, authLoading, currentUser, user } = useUserAuth();
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [referralSettings, setReferralSettings] = useState<ReferralSettings | null>(null);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Get referral code from URL if available
  const queryParams = new URLSearchParams(location.search);
  const referralCodeFromUrl = queryParams.get('ref');
  const redirectPath = location.state?.from || '/user-dashboard';

  // Redirect if already authenticated
  useEffect(() => {
    console.log("Auth status:", isAuthenticated);
    console.log("Current user:", currentUser);
    console.log("Supabase user:", user);
    
    if (isAuthenticated || user) {
      console.log("User is authenticated, redirecting to:", redirectPath);
      navigate(redirectPath);
    }
  }, [isAuthenticated, navigate, redirectPath, currentUser, user]);

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
    setLoginError(null); // Clear any previous errors
    setIsLoggingIn(true);
    
    try {
      console.log("Login handler called with:", email);
      const success = await login(email, password);
      console.log("Login result:", success);
      
      if (success) {
        console.log("Login successful, waiting for redirect to dashboard");
        // The redirect will be handled in UserAuthProvider after profile is fetched
        // Adding a safety timeout to ensure we don't leave users hanging
        setTimeout(() => {
          if (window.location.pathname.includes('/user-login')) {
            console.log("Safety timeout triggered, redirecting to dashboard");
            navigate('/user-dashboard');
            setIsLoggingIn(false);
          }
        }, 3000);
      } else {
        // If login returned false but didn't throw an error, show a generic message
        setLoginError("Login failed. Please check your credentials and try again.");
        setIsLoggingIn(false);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      // Set error message to be displayed in the form
      setLoginError(error.message || "An unexpected error occurred during login.");
      setIsLoggingIn(false);
    }
  };

  const handleSignup = async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    country: string;
    city?: string;
    referralCode?: string;
  }) => {
    setRegisterError(null);
    setIsRegistering(true);
    
    try {
      console.log("Attempting to sign up with:", userData);
      const success = await signup(userData);
      console.log("Signup result:", success);
      
      if (success) {
        setVerificationSent(true);
      } else {
        setRegisterError("Registration failed. Please check your information and try again.");
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      setRegisterError(error.message || "An unexpected error occurred during registration.");
    } finally {
      setIsRegistering(false);
    }
  };

  // Show a loading indicator if we're in the process of authenticating
  if (authLoading && !isLoggingIn && !isRegistering) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-10 flex items-center justify-center bg-stars">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-ifind-aqua" />
            <h2 className="text-xl font-medium">Authenticating...</h2>
            <p className="text-muted-foreground">Please wait while we verify your credentials</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10 flex items-center justify-center bg-stars">
        <div className="container max-w-md">
          <div className="bg-background/80 backdrop-blur-md rounded-xl shadow-xl p-8 border border-ifind-aqua/10">
            <LoginHeader />
            
            {verificationSent ? (
              <VerificationScreen 
                onBackToLogin={() => setVerificationSent(false)} 
              />
            ) : (
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger data-value="login" value="login">Login</TabsTrigger>
                  <TabsTrigger data-value="register" value="register">Register</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <LoginTab 
                    onLogin={handleLogin}
                    loading={authLoading}
                    isLoggingIn={isLoggingIn}
                    loginError={loginError}
                    socialLoading={socialLoading}
                    authLoading={authLoading}
                    setSocialLoading={setSocialLoading}
                  />
                </TabsContent>
                
                <TabsContent value="register">
                  <RegisterTab 
                    onRegister={handleSignup}
                    loading={authLoading}
                    isRegistering={isRegistering}
                    registerError={registerError}
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
