
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useExpertAuth } from '@/hooks/expert-auth';
import { UserProfile } from '@/types/supabase';
import { supabase } from '@/lib/supabase';

interface StatusMessage {
  type: 'info' | 'warning' | 'success' | 'error';
  message: string;
}

export const useExpertLoginPage = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('login');
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isCheckingUser, setIsCheckingUser] = useState(true);
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);
  
  const { 
    login, 
    currentExpert: expert, 
    loading, 
    initialized, 
    hasUserAccount 
  } = useExpertAuth();
  
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
      expertAuthInitialized: initialized,
      hasExpertProfile: !!expert,
      directlyFetchedUserProfile: !!userProfile,
      redirectAttempted,
    });
  }, [loading, initialized, expert, userProfile, redirectAttempted]);
  
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
    if (!expert || !initialized || loading || redirectAttempted) {
      return;
    }
    
    // Don't redirect if expert is not approved
    if (expert.status !== 'approved') {
      return;
    }
    
    console.log('Redirecting to expert dashboard - Expert profile found and approved');
    setRedirectAttempted(true);
    
    navigate('/expert-dashboard', { replace: true });
  }, [expert, loading, initialized, redirectAttempted, navigate]);
  
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
    
    if (userProfile) {
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

  return {
    isLoggingIn,
    loginError,
    activeTab,
    setActiveTab,
    userProfile,
    statusMessage,
    expert,
    loading,
    initialized,
    isCheckingUser,
    handleLogin,
    redirectAttempted
  };
};
