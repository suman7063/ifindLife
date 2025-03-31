
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoginTab from '@/components/auth/LoginTab';
import RegisterTab from '@/components/auth/RegisterTab';
import LoadingScreen from '@/components/auth/LoadingScreen';
import UserLogoutAlert from '@/components/auth/UserLogoutAlert';
import { toast } from 'sonner';
import UserLoginHeader from '@/components/auth/UserLoginHeader';
import { useAuthSynchronization } from '@/hooks/useAuthSynchronization';
import { useUserAuth } from '@/contexts/UserAuthContext';

const UserLogin = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [socialLoginLoading, setSocialLoginLoading] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get auth state from context
  const { login, signup, authLoading } = useUserAuth();
  const { 
    isUserAuthenticated, 
    isExpertAuthenticated, 
    currentUser, 
    isSynchronizing, 
    expertProfile,
    expertLogout 
  } = useAuthSynchronization();
  
  // Log auth state for debugging
  useEffect(() => {
    console.log('UserLogin component - Auth states:', {
      userLoading: authLoading,
      isUserAuthenticated,
      hasUserProfile: !!currentUser,
      isExpertAuthenticated,
      hasExpertProfile: !!expertProfile,
      isSynchronizing,
      redirectAttempted
    });
  }, [authLoading, isUserAuthenticated, currentUser, isExpertAuthenticated, expertProfile, isSynchronizing, redirectAttempted]);
  
  // Check if redirected to register tab
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('register') === 'true') {
      setActiveTab('register');
    }
  }, [location]);
  
  // Redirect if already logged in
  useEffect(() => {
    if (isUserAuthenticated && !authLoading && currentUser && !redirectAttempted) {
      console.log('User authenticated, redirecting to dashboard...');
      setRedirectAttempted(true);
      
      // Add a slight delay to ensure state is settled
      setTimeout(() => {
        navigate('/user-dashboard');
      }, 100);
    }
  }, [isUserAuthenticated, authLoading, currentUser, navigate, redirectAttempted]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleLogin = async (email: string, password: string): Promise<void> => {
    if (isLoggingIn) return;
    
    setIsLoggingIn(true);
    setLoginError(null);
    
    try {
      // First check if logged in as expert
      if (isExpertAuthenticated) {
        toast.error('You are already logged in as an expert. Please log out first.');
        setLoginError('Please log out as an expert before logging in as a user.');
        return;
      }
      
      console.log('Attempting user login with:', email);
      const success = await login(email, password);
      
      if (!success) {
        setLoginError('Login failed. Please check your credentials and try again.');
      } else {
        console.log('User login successful, redirecting soon...');
        toast.success('Login successful');
        
        // Force redirect to dashboard
        setTimeout(() => {
          navigate('/user-dashboard');
        }, 500);
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
      if (isExpertAuthenticated) {
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
        toast.success('Registration successful! Please check your email for verification.');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setRegisterError(error.message || 'An unexpected error occurred');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleExpertLogout = async (): Promise<boolean> => {
    setIsLoggingOut(true);
    try {
      const success = await expertLogout();
      
      if (success) {
        toast.success('Successfully logged out as expert');
        // Force a full page reload to ensure clean state
        window.location.href = '/user-login';
        return true;
      } else {
        toast.error('Failed to log out as expert. Please try again.');
        // Force a page reload as a last resort
        setTimeout(() => {
          window.location.href = '/user-login';
        }, 1500);
        return false;
      }
    } catch (error) {
      console.error('Error during expert logout:', error);
      toast.error('Failed to log out as expert. Please try again.');
      
      // Force a page reload as a last resort
      setTimeout(() => {
        window.location.href = '/user-login';
      }, 1500);
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Show loading screen during auth initialization
  if (authLoading || isSynchronizing) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16 container">
        <div className="max-w-md mx-auto">
          <Card className="border-ifind-lavender/20 shadow-xl">
            <CardContent className="pt-6">
              <UserLoginHeader />
              
              {isExpertAuthenticated ? (
                <UserLogoutAlert 
                  profileName={expertProfile?.name}
                  isLoggingOut={isLoggingOut}
                  onLogout={handleExpertLogout}
                />
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
