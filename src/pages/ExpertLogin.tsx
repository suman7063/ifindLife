
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Container } from '@/components/ui/container';
import ExpertLoginContent from '@/components/expert/auth/ExpertLoginContent';
import { useAuth } from '@/contexts/auth/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingScreen from '@/components/auth/LoadingScreen';

const ExpertLogin: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [isLogging, setIsLogging] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const auth = useAuth();
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // Check URL parameters for status messages
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    
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
  }, []);
  
  // Redirect if already authenticated as expert
  useEffect(() => {
    if (auth.isAuthenticated && auth.expertProfile) {
      console.log('ExpertLogin: User is authenticated as expert, redirecting to dashboard');
      navigate('/expert-dashboard');
    }
  }, [auth.isAuthenticated, auth.expertProfile, navigate]);
  
  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    setIsLogging(true);
    setLoginError(null);
    try {
      console.log('ExpertLogin: Attempting login with', email);
      
      // Use the standard auth login
      const success = await auth.login(email, password);
      
      if (success) {
        console.log('ExpertLogin: Login successful, checking for expert profile');
        
        // Check if user has an expert profile
        if (auth.expertProfile) {
          toast.success('Successfully logged in!');
          navigate('/expert-dashboard');
          return true;
        } else {
          console.error('ExpertLogin: No expert profile found');
          toast.error('No expert profile found for this account.');
          // Log out since user doesn't have an expert profile
          await auth.logout();
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
    }
  };

  if (auth.isLoading) {
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
