
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import Footer from '@/components/Footer';
import ExpertLoginTabs from '@/components/expert/auth/ExpertLoginTabs';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';

const ExpertLogin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const { isAuthenticated, userType, expert, isLoading, login } = useSimpleAuth();
  const [hasRedirected, setHasRedirected] = useState(false);

  console.log('ExpertLogin - Auth state:', {
    isAuthenticated,
    userType,
    hasExpertProfile: !!expert,
    isLoading,
    expertStatus: expert?.status
  });

  // Check for existing authentication and redirect
  useEffect(() => {
    const status = searchParams.get('status');
    if (status === 'pending') {
      toast.info('Your expert account is pending approval. You will be notified once approved.');
    } else if (status === 'disapproved') {
      toast.error('Your expert account application has been disapproved.');
    }

    // Wait for auth loading to complete
    if (isLoading) {
      console.log('ExpertLogin: Still loading auth state...');
      return;
    }

    // Check if authenticated as expert with approved status
    const isExpertAuthenticated = Boolean(
      isAuthenticated && 
      userType === 'expert' && 
      expert && 
      expert.status === 'approved'
    );

    if (isExpertAuthenticated && !hasRedirected) {
      console.log('ExpertLogin: Expert authenticated, redirecting to dashboard');
      setHasRedirected(true);
      navigate('/expert-dashboard', { replace: true });
    }
  }, [isAuthenticated, userType, expert, isLoading, navigate, searchParams, hasRedirected]);

  // Handle expert login
  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoggingIn(true);
      setLoginError(null);
      
      console.log('ExpertLogin: Attempting expert login:', email);
      
      const success = await login(email, password, { asExpert: true });
      
      if (success) {
        console.log('Expert login successful');
        toast.success('Login successful!');
        return true;
      } else {
        console.error('Expert login failed');
        setLoginError('Invalid email or password. Please check your credentials and try again.');
        toast.error('Invalid email or password. Please check your credentials and try again.');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An error occurred during login. Please try again.');
      toast.error('An error occurred during login. Please try again.');
      return false;
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Show loading while auth is being checked
  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4 mx-auto" />
            <p>Checking authentication...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <Container className="max-w-md">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold mb-1">Expert Portal</h1>
              <p className="text-gray-600">Login or join as an expert</p>
            </div>
            
            <ExpertLoginTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onLogin={handleLogin}
              isLoggingIn={isLoggingIn}
              loginError={loginError}
            />
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default ExpertLogin;
