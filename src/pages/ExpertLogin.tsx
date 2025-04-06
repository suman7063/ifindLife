
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
import { AlertCircle, LogOut, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/types/supabase';

const ExpertLogin = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('login');
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isCheckingUser, setIsCheckingUser] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{type: 'info' | 'warning' | 'success' | 'error', message: string} | null>(null);
  
  const { 
    login, 
    currentExpert: expert, 
    isLoading: loading, 
    authInitialized, 
    hasUserAccount 
  } = useExpertAuth();
  
  const { 
    isSynchronizing, 
    userLogout, 
    isLoggingOut, 
    setIsLoggingOut,
    authCheckCompleted,
    hasDualSessions,
    fullLogout,
    sessionType,
    isAuthenticated
  } = useAuthSynchronization();
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check for status message in the URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    
    if (status === 'registered') {
      setStatusMessage({
        type: 'success',
        message: 'Registration successful! Your account is pending approval. You will be notified via email once approved.'
      });
    } else if (status === 'pending') {
      setStatusMessage({
        type: 'info',
        message: 'Your account is still pending approval. You will be notified via email once approved.'
      });
    } else if (status === 'disapproved') {
      setStatusMessage({
        type: 'warning',
        message: 'Your account has been disapproved. Please check your email for details or contact support.'
      });
    }
  }, [location.search]);
  
  // Check if user is already logged in
  useEffect(() => {
    const checkUserLogin = async () => {
      setIsCheckingUser(true);
      
      try {
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .maybeSingle();
            
          if (profileData && !error) {
            console.log('User profile found during expert login check:', profileData);
            setUserProfile(profileData as UserProfile);
          } else {
            setUserProfile(null);
          }
        } else {
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Error checking user login:', error);
        setUserProfile(null);
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
      directlyFetchedUserProfile: !!userProfile,
      isSynchronizing,
      redirectAttempted,
      authCheckCompleted,
      hasDualSessions,
      sessionType,
      isUserAuthenticated: isAuthenticated
    });
  }, [loading, authInitialized, expert, userProfile, isSynchronizing, redirectAttempted, authCheckCompleted, hasDualSessions, sessionType, isAuthenticated]);
  
  // Set the active tab based on the URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('register') === 'true') {
      setActiveTab('register');
      toast.info('Please complete your expert registration to continue');
    }
  }, [location]);
  
  // Navigate to dashboard if authenticated
  useEffect(() => {
    if (!expert || !authInitialized || loading || redirectAttempted) {
      return;
    }
    
    // Don't redirect if expert is not approved
    if (expert.status !== 'approved') {
      return;
    }
    
    console.log('Redirecting to expert dashboard - Expert profile found and approved');
    setRedirectAttempted(true);
    
    navigate('/expert-dashboard', { replace: true });
  }, [expert, loading, authInitialized, redirectAttempted, navigate]);
  
  // Handle login
  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    if (isLoggingIn) return false;
    
    if (!email.trim()) {
      setLoginError('Email is required');
      return false;
    }
    
    if (!password.trim()) {
      setLoginError('Password is required');
      return false;
    }
    
    if (userProfile || isAuthenticated) {
      setLoginError('Please log out as a user before attempting to log in as an expert');
      return false;
    }
    
    const hasUserAcct = await hasUserAccount(email);
    if (hasUserAcct) {
      setLoginError('This email is registered as a user. Please use a different email for expert login.');
      return false;
    }
    
    setLoginError(null);
    setIsLoggingIn(true);
    
    try {
      console.log('Expert auth: Starting login process for', email);
      
      const success = await login(email, password);
      
      if (!success) {
        // Login error is handled in the useExpertAuthentication hook with toast messages
        setLoginError('Login failed. Please check your credentials and try again.');
      } else {
        console.log('Expert login successful');
        toast.success('Login successful! Redirecting to dashboard...');
        // No need to use setTimeout - the useEffect will handle redirection
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

  // Show loading view during initialization
  if ((loading && !isLoggingIn && !authInitialized) || (authInitialized && loading && !isLoggingIn) || isSynchronizing || isCheckingUser) {
    console.log('Showing LoadingView on ExpertLogin page');
    return <LoadingView />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10 flex items-center justify-center bg-stars">
        <div className="container max-w-4xl">
          {statusMessage && (
            <div className="mb-6">
              <Alert variant={statusMessage.type === 'error' ? "destructive" : "default"}>
                {statusMessage.type === 'info' && <Info className="h-4 w-4" />}
                {statusMessage.type === 'warning' && <AlertCircle className="h-4 w-4" />}
                {statusMessage.type === 'error' && <AlertCircle className="h-4 w-4" />}
                <AlertTitle>
                  {statusMessage.type === 'success' ? 'Success' : 
                   statusMessage.type === 'info' ? 'Information' : 
                   statusMessage.type === 'warning' ? 'Warning' : 'Error'}
                </AlertTitle>
                <AlertDescription>{statusMessage.message}</AlertDescription>
              </Alert>
            </div>
          )}
          
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
                profileName={userProfile.name || "User"}
                isLoggingOut={isLoggingOut}
                onLogout={handleUserLogout}
                logoutType="user"
              />
            </div>
          )}
          
          {!userProfile && !hasDualSessions && (
            <div className="bg-background/80 backdrop-blur-md rounded-xl shadow-xl p-8 border border-astro-purple/10">
              <ExpertLoginHeader />
              
              <ExpertLoginTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onLogin={handleLogin}
                isLoggingIn={isLoggingIn}
                loginError={loginError}
              />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExpertLogin;
