
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
import { supabase } from '@/lib/supabase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/types/supabase';

const ExpertLogin = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('login');
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isCheckingUser, setIsCheckingUser] = useState(true);
  
  const { login, expert, loading, authInitialized, isUserLoggedIn } = useExpertAuth();
  const { 
    isAuthenticated, 
    currentUser, 
    isSynchronizing, 
    userLogout, 
    isLoggingOut, 
    setIsLoggingOut,
    authCheckCompleted,
    hasDualSessions,
    fullLogout,
    sessionType
  } = useAuthSynchronization();
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if user is logged in
  useEffect(() => {
    const checkUserLogin = async () => {
      setIsCheckingUser(true);
      
      try {
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          // Check if there's a profile in the profiles table
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .single();
            
          if (profileData) {
            setUserProfile(profileData as UserProfile);
          }
        }
      } catch (error) {
        console.error('Error checking user login:', error);
      } finally {
        setIsCheckingUser(false);
      }
    };
    
    checkUserLogin();
  }, []);
  
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
      authCheckCompleted,
      hasDualSessions,
      sessionType,
      userProfile
    });
  }, [loading, authInitialized, expert, isAuthenticated, currentUser, isSynchronizing, redirectAttempted, authCheckCompleted, hasDualSessions, sessionType, userProfile]);
  
  // Check URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('register') === 'true') {
      setActiveTab('register');
      toast.info('Please complete your expert registration to continue');
    }
  }, [location]);
  
  // Redirect if authenticated as expert
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
    
    // Check for user profile first
    if (userProfile) {
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
      console.log('Expert auth: Starting login process for', email);
      
      // Now attempt login
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
        setUserProfile(null);
        console.log('User logout completed');
        return true;
      } else {
        console.error('User logout failed');
        window.location.reload();
        return false;
      }
    } catch (error) {
      console.error('Error during user logout:', error);
      window.location.reload();
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleFullLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      console.log('Attempting full logout...');
      await fullLogout();
      return true;
    } catch (error) {
      console.error('Error during full logout:', error);
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Show loading screen when appropriate
  if ((loading && !isLoggingIn && !authInitialized) || (authInitialized && loading && !isLoggingIn) || isSynchronizing || isCheckingUser) {
    console.log('Showing LoadingView on ExpertLogin page');
    return <LoadingView />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10 flex items-center justify-center bg-stars">
        <div className="container max-w-4xl">
          {hasDualSessions && (
            <div className="mb-6">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Multiple Sessions Detected</AlertTitle>
                <AlertDescription className="flex flex-col space-y-4">
                  <p>You are currently logged in as both a user and an expert. This can cause authentication issues.</p>
                  <Button 
                    onClick={handleFullLogout} 
                    variant="destructive" 
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                        Logging Out...
                      </>
                    ) : (
                      <>
                        <LogOut className="h-4 w-4 mr-2" />
                        Log Out of All Accounts
                      </>
                    )}
                  </Button>
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          {userProfile && !hasDualSessions && (
            <div className="mb-6">
              <UserLogoutAlert
                profileName={userProfile.name}
                isLoggingOut={isLoggingOut}
                onLogout={handleUserLogout}
                logoutType="user"
              />
            </div>
          )}
          
          <div className="bg-background/80 backdrop-blur-md rounded-xl shadow-xl p-8 border border-astro-purple/10">
            <ExpertLoginHeader />
            
            {!userProfile && (
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
