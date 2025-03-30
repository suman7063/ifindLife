
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { useExpertAuth } from '@/hooks/expert-auth';
import { useUserAuth } from '@/contexts/UserAuthContext';
import ExpertLoginHeader from '@/components/expert/auth/ExpertLoginHeader';
import ExpertLoginTabs from '@/components/expert/auth/ExpertLoginTabs';
import LoadingView from '@/components/expert/auth/LoadingView';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const ExpertLogin = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('login');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const { login, expert, loading, authInitialized } = useExpertAuth();
  const { isAuthenticated, currentUser, logout: userLogout } = useUserAuth();
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // For debug purposes
  useEffect(() => {
    console.log('ExpertLogin component - Auth states:', {
      expertLoading: loading,
      expertAuthInitialized: authInitialized,
      hasExpertProfile: !!expert,
      isUserAuthenticated: isAuthenticated,
      hasUserProfile: !!currentUser
    });
  }, [loading, authInitialized, expert, isAuthenticated, currentUser]);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('register') === 'true') {
      setActiveTab('register');
      toast.info('Please complete your expert registration to continue');
    }
  }, [location]);
  
  useEffect(() => {
    // If already logged in as expert and authentication is initialized, redirect to dashboard
    if (expert && authInitialized && !loading) {
      console.log('Redirecting to expert dashboard - Expert profile found');
      navigate('/expert-dashboard');
    }
  }, [expert, loading, authInitialized, navigate]);
  
  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    if (isLoggingIn) return false;
    
    // Check if user is already authenticated as a user
    if (isAuthenticated) {
      setLoginError('You are logged in as a user. Please log out first.');
      toast.error('Please log out as a user before logging in as an expert');
      return false;
    }
    
    // Basic validation
    if (!email.trim()) {
      setLoginError('Email is required');
      return false;
    }
    
    if (!password.trim()) {
      setLoginError('Password is required');
      return false;
    }
    
    setLoginError(null);
    setIsLoggingIn(true);
    
    try {
      console.log('Attempting expert login with:', email);
      const success = await login(email, password);
      
      if (!success) {
        setLoginError('Login failed. Please check your credentials and try again.');
      } else {
        console.log('Expert login successful, should redirect soon');
      }
      
      return success;
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An unexpected error occurred. Please try again.');
      return false;
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleUserLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    
    try {
      console.log('Attempting to log out user...');
      await userLogout();
      console.log('User logout completed');
      toast.success('Successfully logged out as user');
      
      // Force a full page reload to ensure clean state
      window.location.href = '/expert-login';
    } catch (error) {
      console.error('Error during user logout:', error);
      toast.error('Failed to log out as user. Please try again.');
      
      // Force a page reload as a last resort
      setTimeout(() => {
        window.location.href = '/expert-login';
      }, 1500);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Show loading view only when not logging in manually and still initializing auth
  if ((loading && !isLoggingIn && !authInitialized) || (authInitialized && loading && !isLoggingIn)) {
    console.log('Showing LoadingView on ExpertLogin page');
    return <LoadingView />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10 flex items-center justify-center bg-stars">
        <div className="container max-w-4xl">
          {isAuthenticated && (
            <div className="mb-6">
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>
                  You are currently logged in as {currentUser?.name || 'a user'}. You need to log out as a user before logging in as an expert.
                </AlertDescription>
              </Alert>
              <Button 
                onClick={handleUserLogout} 
                variant="destructive" 
                className="flex items-center"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Logging Out...
                  </>
                ) : (
                  <>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out as User
                  </>
                )}
              </Button>
            </div>
          )}
          
          <div className="bg-background/80 backdrop-blur-md rounded-xl shadow-xl p-8 border border-astro-purple/10">
            <ExpertLoginHeader />
            
            {!isAuthenticated && (
              <ExpertLoginTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onLogin={handleLogin}
                isLoggingIn={isLoggingIn}
                loginError={loginError}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExpertLogin;
