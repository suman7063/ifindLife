
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { useExpertAuth } from '@/hooks/expert-auth';
import ExpertLoginHeader from '@/components/expert/auth/ExpertLoginHeader';
import ExpertLoginTabs from '@/components/expert/auth/ExpertLoginTabs';
import LoadingView from '@/components/expert/auth/LoadingView';
import UserLogoutAlert from '@/components/auth/UserLogoutAlert';
import { useAuthSynchronization } from '@/hooks/useAuthSynchronization';

const ExpertLogin = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('login');
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  
  const { login, expert, loading, authInitialized } = useExpertAuth();
  const { 
    isAuthenticated, 
    currentUser, 
    isSynchronizing, 
    userLogout, 
    isLoggingOut, 
    setIsLoggingOut,
    authCheckCompleted 
  } = useAuthSynchronization();
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Debug logging
  useEffect(() => {
    console.log('ExpertLogin component - Auth states:', {
      expertLoading: loading,
      expertAuthInitialized: authInitialized,
      hasExpertProfile: !!expert,
      isAuthenticated,
      hasUserProfile: !!currentUser,
      isSynchronizing,
      redirectAttempted,
      authCheckCompleted
    });
  }, [loading, authInitialized, expert, isAuthenticated, currentUser, isSynchronizing, redirectAttempted, authCheckCompleted]);
  
  // Check URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('register') === 'true') {
      setActiveTab('register');
      toast.info('Please complete your expert registration to continue');
    }
  }, [location]);
  
  // Redirect if authenticated
  useEffect(() => {
    // Skip if conditions aren't met
    if (!expert || !authInitialized || loading || redirectAttempted) {
      return;
    }
    
    console.log('Redirecting to expert dashboard - Expert profile found');
    setRedirectAttempted(true);
    
    // Redirect to dashboard
    navigate('/expert-dashboard', { replace: true });
  }, [expert, loading, authInitialized, redirectAttempted, navigate]);
  
  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    if (isLoggingIn) return false;
    
    // Only check for user authentication if auth check is completed
    if (authCheckCompleted && isAuthenticated) {
      setLoginError('You are logged in as a user. Please log out first.');
      toast.error('Please log out as a user before logging in as an expert');
      return false;
    }
    
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
        console.log('Expert login successful');
        toast.success('Login successful! Redirecting to dashboard...');
        // Redirect handled by the login function
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
    setIsLoggingOut(true);
    
    try {
      console.log('Attempting to log out user...');
      const success = await userLogout();
      
      if (success) {
        console.log('User logout completed');
        // Reload the page to ensure clean state
        window.location.href = '/expert-login';
        return true;
      } else {
        console.error('User logout failed');
        // Force reload as a fallback
        setTimeout(() => {
          window.location.href = '/expert-login';
        }, 1000);
        return false;
      }
    } catch (error) {
      console.error('Error during user logout:', error);
      // Force reload as a fallback
      setTimeout(() => {
        window.location.href = '/expert-login';
      }, 1000);
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Show loading screen when appropriate
  if ((loading && !isLoggingIn && !authInitialized) || (authInitialized && loading && !isLoggingIn) || isSynchronizing) {
    console.log('Showing LoadingView on ExpertLogin page');
    return <LoadingView />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10 flex items-center justify-center bg-stars">
        <div className="container max-w-4xl">
          {authCheckCompleted && isAuthenticated && (
            <div className="mb-6">
              <UserLogoutAlert
                profileName={currentUser?.name}
                isLoggingOut={isLoggingOut}
                onLogout={handleUserLogout}
              />
            </div>
          )}
          
          <div className="bg-background/80 backdrop-blur-md rounded-xl shadow-xl p-8 border border-astro-purple/10">
            <ExpertLoginHeader />
            
            {(!authCheckCompleted || !isAuthenticated) && (
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
