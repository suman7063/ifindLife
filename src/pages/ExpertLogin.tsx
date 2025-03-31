
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
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  
  const { login, expert, loading, authInitialized } = useExpertAuth();
  const { isAuthenticated, currentUser, isSynchronizing, userLogout } = useAuthSynchronization();
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // All useEffects should be defined at the component's top level
  
  // Debug logging
  useEffect(() => {
    console.log('ExpertLogin component - Auth states:', {
      expertLoading: loading,
      expertAuthInitialized: authInitialized,
      hasExpertProfile: !!expert,
      isAuthenticated,
      hasUserProfile: !!currentUser,
      isSynchronizing,
      redirectAttempted
    });
  }, [loading, authInitialized, expert, isAuthenticated, currentUser, isSynchronizing, redirectAttempted]);
  
  // Check URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('register') === 'true') {
      setActiveTab('register');
      toast.info('Please complete your expert registration to continue');
    }
  }, [location]);
  
  // Redirect if authenticated - all in a single effect
  useEffect(() => {
    // Skip if conditions aren't met
    if (!expert || !authInitialized || loading || redirectAttempted) {
      return;
    }
    
    console.log('Redirecting to expert dashboard - Expert profile found');
    setRedirectAttempted(true);
    
    // Use timeout to avoid state update conflicts
    setTimeout(() => {
      navigate('/expert-dashboard', { replace: true });
    }, 100);
  }, [expert, loading, authInitialized, redirectAttempted, navigate]);
  
  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    if (isLoggingIn) return false;
    
    if (isAuthenticated) {
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
        // Use navigate for React Router-based redirection
        navigate('/expert-dashboard', { replace: true });
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
    if (isLoggingOut) return false;
    setIsLoggingOut(true);
    
    try {
      console.log('Attempting to log out user...');
      const success = await userLogout();
      
      if (success) {
        console.log('User logout completed');
        toast.success('Successfully logged out as user');
        
        window.location.href = '/expert-login';
        return true;
      } else {
        console.error('User logout failed');
        toast.error('Failed to log out as user. Please try again.');
        
        setTimeout(() => {
          window.location.href = '/expert-login';
        }, 1500);
        return false;
      }
    } catch (error) {
      console.error('Error during user logout:', error);
      toast.error('Failed to log out as user. Please try again.');
      
      setTimeout(() => {
        window.location.href = '/expert-login';
      }, 1500);
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  };

  if ((loading && !isLoggingIn && !authInitialized) || (authInitialized && loading && !isLoggingIn) || isSynchronizing) {
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
              <UserLogoutAlert
                profileName={currentUser?.name}
                isLoggingOut={isLoggingOut}
                onLogout={handleUserLogout}
              />
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
