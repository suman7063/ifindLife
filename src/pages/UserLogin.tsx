
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoginTab from '@/components/auth/LoginTab';
import RegisterTab from '@/components/auth/RegisterTab';
import { toast } from 'sonner';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { useExpertAuth } from '@/hooks/expert-auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const UserLogin = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [socialLoginLoading, setSocialLoginLoading] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isAuthenticated, authLoading, login, signup } = useUserAuth();
  const { expert, loading: expertLoading, logout: expertLogout } = useExpertAuth();
  
  // Log auth state for debugging
  useEffect(() => {
    console.log('UserLogin component - Auth states:', {
      userLoading: authLoading,
      isUserAuthenticated,
      hasUserProfile: !!currentUser,
      expertLoading,
      hasExpertProfile: !!expert
    });
  }, [authLoading, isAuthenticated, currentUser, expertLoading, expert]);
  
  // Check if redirected to register tab
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('register') === 'true') {
      setActiveTab('register');
    }
  }, [location]);
  
  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate('/user-dashboard');
    }
  }, [isAuthenticated, authLoading, navigate]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleLogin = async (email: string, password: string): Promise<void> => {
    if (isLoggingIn) return;
    
    setIsLoggingIn(true);
    setLoginError(null);
    
    try {
      // First check if logged in as expert
      if (expert) {
        toast.error('You are already logged in as an expert. Please log out first.');
        setLoginError('Please log out as an expert before logging in as a user.');
        return;
      }
      
      console.log('Attempting user login with:', email);
      const success = await login(email, password);
      
      if (!success) {
        setLoginError('Login failed. Please check your credentials and try again.');
      } else {
        console.log('User login successful');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setLoginError(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegister = async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    country: string;
    city?: string;
    referralCode?: string;
  }): Promise<void> => {
    if (isRegistering) return;
    
    setIsRegistering(true);
    setRegisterError(null);
    
    try {
      // First check if logged in as expert
      if (expert) {
        toast.error('You are already logged in as an expert. Please log out first.');
        setRegisterError('Please log out as an expert before registering as a user.');
        return;
      }
      
      console.log('Attempting user registration with:', userData.email);
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
      
      if (!success) {
        setRegisterError('Registration failed. Please try again.');
      } else {
        console.log('User registration successful');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setRegisterError(error.message || 'An unexpected error occurred');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleExpertLogout = async () => {
    try {
      await expertLogout();
      toast.success('Successfully logged out as expert');
      // Refresh the page to clear any lingering state
      window.location.reload();
    } catch (error) {
      console.error('Error during expert logout:', error);
      toast.error('Failed to log out as expert. Please try again.');
    }
  };

  if (authLoading || (expertLoading && !expert)) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-16 container">
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ifind-teal"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16 container">
        <div className="max-w-md mx-auto">
          <Card className="border-ifind-lavender/20 shadow-xl">
            <CardContent className="pt-6">
              {expert ? (
                <div className="space-y-4 p-4">
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>
                      You are currently logged in as an expert. You need to log out as an expert before logging in as a user.
                    </AlertDescription>
                  </Alert>
                  <Button onClick={handleExpertLogout} variant="destructive" className="w-full flex items-center justify-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out as Expert
                  </Button>
                </div>
              ) : (
                <Tabs value={activeTab} onValueChange={handleTabChange}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login">
                    <LoginTab 
                      onLogin={handleLogin} 
                      loading={authLoading}
                      isLoggingIn={isLoggingIn}
                      loginError={loginError}
                      socialLoading={socialLoginLoading}
                      authLoading={authLoading}
                      setSocialLoading={(provider) => setSocialLoginLoading(provider)}
                    />
                  </TabsContent>
                  
                  <TabsContent value="register">
                    <RegisterTab 
                      onRegister={handleRegister}
                      loading={authLoading}
                      isRegistering={isRegistering}
                      registerError={registerError}
                      initialReferralCode={null}
                      referralSettings={null}
                      setCaptchaVerified={() => {}}
                    />
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserLogin;
