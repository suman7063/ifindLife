
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Container } from '@/components/ui/container';
import ExpertLoginContent from '@/components/expert/auth/ExpertLoginContent';
import { useAuth } from '@/contexts/auth/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingScreen from '@/components/auth/LoadingScreen';

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
        console.log('ExpertLogin: User is authenticated as expert, redirecting to dashboard');
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
      
      // Use the standard auth login
      const success = await login(email, password);
      
      if (success) {
        // Check if user has an expert profile after login
        if (role === 'expert' && expertProfile) {
          toast.success('Successfully logged in as expert!');
          // Use replace: true to prevent going back to login
          navigate('/expert-dashboard', { replace: true });
          return true;
        } else if (role === 'user') {
          console.error('ExpertLogin: User has a user profile, not an expert profile');
          toast.error('You have a user account, not an expert account.');
          setLoginError('You have a user account, not an expert account.');
          return false;
        } else {
          console.error('ExpertLogin: No expert profile found');
          toast.error('No expert profile found for this account.');
          setLoginError('No expert profile found for this account.');
          return false;
        }
      } else {
        console.error('ExpertLogin: Login failed');
        toast.error('Invalid credentials. Please try again.');
        setLoginError('Invalid credentials. Please try again.');
        return false;
      }
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
