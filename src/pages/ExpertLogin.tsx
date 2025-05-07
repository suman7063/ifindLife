
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Container } from '@/components/ui/container';
import ExpertLoginContent from '@/components/expert/auth/ExpertLoginContent';
import { useAuth } from '@/contexts/auth/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingScreen from '@/components/auth/LoadingScreen';
import { supabase } from '@/lib/supabase';

const ExpertLogin: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(
    searchParams.get('register') === 'true' ? 'register' : 'login'
  );
  const [isLogging, setIsLogging] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { isLoading, isAuthenticated, expertProfile, role, login } = useAuth();
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  
  // Debug logging
  useEffect(() => {
    console.log("ExpertLogin component rendering", { 
      isLoading, 
      isAuthenticated, 
      hasExpertProfile: !!expertProfile,
      role 
    });
    
    // Clear any cached redirects
    localStorage.removeItem('redirectAfterLogin');
  }, [isLoading, isAuthenticated, expertProfile, role]);
  
  // Check URL parameters for status messages
  useEffect(() => {
    const status = searchParams.get('status');
    
    if (status === 'registered') {
      setStatusMessage({
        type: 'success',
        message: 'Registration successful! Please log in with your credentials.'
      });
      setActiveTab('login');
    } else if (status === 'pending') {
      setStatusMessage({
        type: 'success',
        message: 'Your account is pending approval. You will be notified once approved.'
      });
    } else if (status === 'disapproved') {
      setStatusMessage({
        type: 'error',
        message: 'Your account application was not approved. Please check your email for details.'
      });
    }
  }, [searchParams]);
  
  // Redirect if already authenticated as expert
  useEffect(() => {
    if (!isLoading && isAuthenticated && !redirectAttempted) {
      setRedirectAttempted(true);
      
      if (role === 'expert' && expertProfile) {
        console.log('ExpertLogin: User is authenticated as expert, redirecting to expert dashboard');
        // Use replace: true to prevent going back to login
        navigate('/expert-dashboard', { replace: true });
      } else if (role === 'user') {
        console.log('ExpertLogin: User is authenticated as regular user, not as expert');
        toast.error('You are logged in as a user. Please log out first to access expert portal.');
        navigate('/user-dashboard');
      }
    }
  }, [isLoading, isAuthenticated, expertProfile, role, navigate, redirectAttempted]);
  
  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    setIsLogging(true);
    setLoginError(null);
    try {
      console.log('ExpertLogin: Attempting login with', email);
      
      // First check for existing session and sign out if necessary
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        console.log('ExpertLogin: Found existing session, signing out first');
        await supabase.auth.signOut({ scope: 'local' });
      }
      
      // Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (authError) {
        console.error('ExpertLogin: Authentication error:', authError);
        toast.error(authError.message || 'Invalid credentials');
        setLoginError(authError.message || 'Invalid credentials');
        return false;
      }
      
      if (!authData.user) {
        console.error('ExpertLogin: No user data returned');
        toast.error('Authentication failed. Please try again.');
        setLoginError('Authentication failed. Please try again.');
        return false;
      }
      
      console.log('ExpertLogin: Authenticated successfully, user ID:', authData.user.id);
      
      // CRITICAL FIX: Check for expert profile FIRST
      const { data: expertProfile, error: expertError } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', authData.user.id)
        .maybeSingle();
      
      console.log('ExpertLogin: Expert profile check result:', {
        found: !!expertProfile,
        error: expertError?.message
      });
      
      if (expertError && expertError.code !== 'PGRST116') {
        // Handle error other than "no rows returned"
        console.error('ExpertLogin: Error checking expert profile:', expertError);
        toast.error('Error checking expert profile. Please try again.');
        setLoginError('Error checking expert profile. Please try again.');
        return false;
      }
      
      // If expert profile found, proceed with expert login
      if (expertProfile) {
        // Check if expert is approved
        if (expertProfile.status !== 'approved') {
          console.log(`ExpertLogin: Expert account status is ${expertProfile.status}`);
          
          // Sign out since the expert is not approved
          await supabase.auth.signOut();
          
          if (expertProfile.status === 'pending') {
            toast.info('Your account is pending approval. You will be notified once approved.');
            window.location.href = '/expert-login?status=pending';
          } else if (expertProfile.status === 'disapproved') {
            toast.error('Your account application has been disapproved. Please check your email for details.');
            window.location.href = '/expert-login?status=disapproved';
          } else {
            toast.error(`Your account has an unknown status: ${expertProfile.status}`);
          }
          
          return false;
        }
        
        console.log('ExpertLogin: Expert profile found and approved, using unified auth context');
        
        // Use the login function from context - this should handle setting the role and expert profile
        const success = await login(email, password, 'expert');
        
        if (success) {
          toast.success('Successfully logged in as expert!');
          navigate('/expert-dashboard', { replace: true });
          return true;
        } else {
          console.error('ExpertLogin: Login failed after authentication');
          toast.error('Login failed. Please try again.');
          setLoginError('Login failed. Please try again.');
          return false;
        }
      }
      
      // If no expert profile found, check if there's a user profile
      console.log('ExpertLogin: No expert profile found, checking for regular user profile');
      
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();
      
      if (userProfile) {
        console.log('ExpertLogin: Found user profile:', authData.user.id);
        
        // Sign out first since this is not an expert account
        await supabase.auth.signOut();
        
        toast.error('You have a user account, not an expert account. Please register as an expert.');
        setLoginError('You have a user account, not an expert account. Please register as an expert.');
        return false;
      }
      
      // If neither expert nor user profile found, suggest registration
      console.log('ExpertLogin: No profiles found for this user');
      await supabase.auth.signOut();
      toast.error('No profiles found. Please register first.');
      setLoginError('No profiles found. Please register first.');
      return false;
    } catch (error) {
      console.error('ExpertLogin error:', error);
      toast.error('Failed to login. Please try again.');
      setLoginError('Failed to login. Please try again.');
      return false;
    } finally {
      setIsLogging(false);
    }
  };

  // Create a wrapper function to handle type conversion
  const handleTabChange = (tab: string) => {
    if (tab === 'login' || tab === 'register') {
      setActiveTab(tab);
      // Clear error messages when switching tabs
      setLoginError(null);
      setStatusMessage(null);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <Container className="max-w-md">
          <ExpertLoginContent
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            onLogin={handleLogin}
            isLogging={isLogging}
            loginError={loginError}
            statusMessage={statusMessage}
          />
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default ExpertLogin;
