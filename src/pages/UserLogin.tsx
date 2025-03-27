
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const UserLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, isAuthenticated, authLoading, currentUser, user, profileNotFound } = useUserAuth();
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [referralSettings, setReferralSettings] = useState<ReferralSettings | null>(null);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const referralCodeFromUrl = queryParams.get('ref');
  const redirectPath = location.state?.from || '/user-dashboard';

  useEffect(() => {
    console.log("Auth status:", isAuthenticated);
    console.log("Current user:", currentUser);
    console.log("Supabase user:", user);
    console.log("Profile not found:", profileNotFound);
    
    if (isAuthenticated && !profileNotFound && currentUser) {
      console.log("User is authenticated with a profile, redirecting to:", redirectPath);
      navigate(redirectPath);
    }
  }, [isAuthenticated, navigate, redirectPath, currentUser, user, profileNotFound]);

  useEffect(() => {
    const loadReferralSettings = async () => {
      try {
        const settings = await fetchReferralSettings();
        setReferralSettings(settings);
      } catch (error) {
        console.error("Error loading referral settings:", error);
      }
    };
    
    loadReferralSettings();
  }, []);

  useEffect(() => {
    if (referralCodeFromUrl || profileNotFound) {
      const registerTab = document.querySelector('[data-value="register"]');
      if (registerTab && registerTab instanceof HTMLElement) {
        registerTab.click();
      }
    }
  }, [referralCodeFromUrl, profileNotFound]);

  const handleLogin = async (email: string, password: string) => {
    setLoginError(null);
    setIsLoggingIn(true);
    
    try {
      console.log("Login handler called with:", email);
      const success = await login(email, password);
      console.log("Login result:", success);
      
      if (success) {
        console.log("Login successful, waiting for redirect or profile check");
        setTimeout(() => {
          if (window.location.pathname.includes('/user-login')) {
            setIsLoggingIn(false);
          }
        }, 5000);
      } else {
        setLoginError("Login failed. Please check your credentials and try again.");
        setIsLoggingIn(false);
      }
    } catch (error: any) {
      console.error('Login error:', error);
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
      // Update this line to match the expected signature
      const success = await signup(
        userData.email, 
        userData.password, 
        {
          name: userData.name,
          phone: userData.phone,
          country: userData.country,
          city: userData.city
        }, 
        userData.referralCode
      );
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
            
            {profileNotFound && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Profile Not Found</AlertTitle>
                <AlertDescription>
                  No user profile found for your account. Please register to create a profile.
                </AlertDescription>
              </Alert>
            )}
            
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
