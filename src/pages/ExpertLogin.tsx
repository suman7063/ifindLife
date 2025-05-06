
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Container } from '@/components/ui/container';
import ExpertLoginContent from '@/components/expert/auth/ExpertLoginContent';
import { useAuth } from '@/contexts/auth/AuthContext';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingScreen from '@/components/auth/LoadingScreen';

const ExpertLogin: React.FC = () => {
  console.log("Rendering ExpertLogin page");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(
    searchParams.get('register') === 'true' ? 'register' : 'login'
  );
  const [isLogging, setIsLogging] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { isLoading, isAuthenticated, expertProfile, userProfile, role } = useAuth();
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // Debug logging
  useEffect(() => {
    console.log("ExpertLogin component rendering", { 
      isLoading, 
      isAuthenticated, 
      hasExpertProfile: !!expertProfile,
      hasUserProfile: !!userProfile,
      role 
    });
  }, [isLoading, isAuthenticated, expertProfile, userProfile, role]);
  
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
  
  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // If authenticated as expert, redirect to expert dashboard
      if (role === 'expert') {
        console.log('ExpertLogin: User is authenticated as expert, redirecting to dashboard');
        navigate('/expert-dashboard');
      } 
      // If authenticated as user, don't auto-redirect - show a message instead
      else if (role === 'user') {
        console.log('ExpertLogin: User is authenticated as regular user, not as expert');
        toast.error('You are logged in as a user. Please log out first to access expert portal.');
      }
    }
  }, [isLoading, isAuthenticated, expertProfile, userProfile, role, navigate]);

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    setIsLogging(true);
    setLoginError(null);
    try {
      console.log('ExpertLogin: Attempting login with', email);
      
      // Sign out any existing session first
      await supabase.auth.signOut();
      
      // Authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('ExpertLogin: Auth error', error);
        toast.error(error.message);
        setLoginError(`Authentication failed: ${error.message}`);
        return false;
      }
      
      if (!data.user || !data.session) {
        console.error('ExpertLogin: No user or session returned');
        toast.error('Login failed: No user session created');
        setLoginError('Login failed: No user session created');
        return false;
      }
      
      // Check if user has an expert profile
      const { data: expertData, error: expertError } = await supabase
        .from('expert_accounts')
        .select('id, status')
        .eq('auth_id', data.user.id)
        .single();
      
      console.log('Expert profile check result:', expertData, expertError);
      
      if (expertError && expertError.code !== 'PGRST116') {
        console.error('Error checking expert profile:', expertError);
        toast.error('Error verifying expert status');
        
        // Sign out since there was an error
        await supabase.auth.signOut();
        setLoginError('Error verifying expert status');
        return false;
      }
      
      if (!expertData) {
        console.error('ExpertLogin: No expert profile found');
        toast.error('No expert profile found for this account');
        
        // Sign out since this is not a valid expert
        await supabase.auth.signOut();
        setLoginError('No expert profile found for this account');
        return false;
      }
      
      // Check expert approval status
      if (expertData.status === 'pending') {
        console.error('ExpertLogin: Account is pending approval');
        toast.error('Your account is pending approval');
        
        // Sign out since this expert is not approved yet
        await supabase.auth.signOut();
        navigate('/expert-login?status=pending');
        return false;
      }
      
      if (expertData.status === 'disapproved') {
        console.error('ExpertLogin: Account is disapproved');
        toast.error('Your account has been disapproved');
        
        // Sign out since this expert is disapproved
        await supabase.auth.signOut();
        navigate('/expert-login?status=disapproved');
        return false;
      }
      
      if (expertData.status !== 'approved') {
        console.error('ExpertLogin: Unknown account status:', expertData.status);
        toast.error('Your account has an unknown status. Please contact support.');
        
        // Sign out since this expert has an unknown status
        await supabase.auth.signOut();
        setLoginError('Your account has an unknown status. Please contact support.');
        return false;
      }
      
      // Login successful - the AuthContext should handle setting user state through listeners
      console.log('ExpertLogin: Login successful');
      toast.success('Login successful!');
      navigate('/expert-dashboard');
      return true;
      
    } catch (error: any) {
      console.error('ExpertLogin unexpected error:', error);
      toast.error('An unexpected error occurred');
      setLoginError('An unexpected error occurred');
      return false;
    } finally {
      setIsLogging(false);
    }
  };

  // Create a wrapper function to handle type conversion
  const handleTabChange = (tab: string) => {
    if (tab === 'login' || tab === 'register') {
      setActiveTab(tab);
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
