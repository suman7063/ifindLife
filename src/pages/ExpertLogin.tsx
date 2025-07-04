
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import Footer from '@/components/Footer';
import ExpertLoginTabs from '@/components/expert/auth/ExpertLoginTabs';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { isExpertAuthenticated } from '@/utils/authHelpers';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';

const ExpertLogin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const simpleAuth = useSimpleAuth();
  const { isLoading, login } = simpleAuth;

  console.log('ExpertLogin - Auth state:', {
    isAuthenticated: Boolean(simpleAuth.isAuthenticated),
    userType: simpleAuth.userType,
    hasExpertProfile: Boolean(simpleAuth.expert),
    isLoading: Boolean(isLoading),
    expertStatus: simpleAuth.expert?.status,
    isExpertAuthenticated: isExpertAuthenticated(simpleAuth)
  });

  // Enhanced redirect logic - check if already authenticated as expert
  useEffect(() => {
    const status = searchParams.get('status');
    if (status === 'pending') {
      toast.info('Your expert account is pending approval. You will be notified once approved.');
    } else if (status === 'disapproved') {
      toast.error('Your expert account application has been disapproved.');
    }

    console.log('ExpertLogin: Checking auth state for redirect...');

    // Wait for auth loading to complete
    if (isLoading) {
      console.log('ExpertLogin: Still loading auth state...');
      return;
    }

    // Check if authenticated as expert with approved status
    if (isExpertAuthenticated(simpleAuth)) {
      console.log('ExpertLogin: Expert authenticated, redirecting to dashboard');
      navigate('/expert-dashboard', { replace: true });
    } else {
      console.log('ExpertLogin: Expert not authenticated, staying on login page');
    }
  }, [simpleAuth.isAuthenticated, simpleAuth.userType, simpleAuth.expert, isLoading, navigate, searchParams]);

  // Enhanced expert login
  const handleLogin = async (email: string, password: string) => {
    if (!email || !password) {
      toast.error('Please enter both email and password', { duration: 2000 });
      return false;
    }

    setIsLoggingIn(true);
    setLoginError(null);
    
    try {
      console.log('ExpertLogin: Attempting expert login:', email);
      
      const result = await login(email, password, { asExpert: true });
      
      if (result.success) {
        console.log('Expert login successful');
        toast.success('Login successful!');
        
        // Wait a moment for auth state to update, then check if expert authenticated
        setTimeout(() => {
          if (isExpertAuthenticated(simpleAuth)) {
            console.log('Redirecting to expert dashboard');
            navigate('/expert-dashboard', { replace: true });
          } else {
            console.log('No expert profile or not approved, redirecting to user dashboard');
            navigate('/user-dashboard', { replace: true });
            toast.info('You don\'t have an approved expert profile. Redirected to user dashboard.');
          }
        }, 500);
        
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

  // Don't render login form if already authenticated as expert
  if (isExpertAuthenticated(simpleAuth) && !isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4 mx-auto" />
            <p>Redirecting to expert dashboard...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

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
