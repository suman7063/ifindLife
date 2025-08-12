
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import Footer from '@/components/Footer';
import ExpertLoginTabs from '@/components/expert/auth/ExpertLoginTabs';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
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

  // ExpertLogin auth state tracking

  // Enhanced redirect logic - check if already authenticated as expert
  useEffect(() => {
    const status = searchParams.get('status');
    if (status === 'pending') {
      toast.info('Your expert account is pending approval. You will be notified once approved.');
    } else if (status === 'disapproved') {
      toast.error('Your expert account application has been disapproved.');
    }

    // Wait for auth loading to complete
    if (isLoading) {
      return;
    }

    // Check if authenticated as expert with approved status
    if (isExpertAuthenticated(simpleAuth)) {
      navigate('/expert-dashboard', { replace: true });
    }
  }, [simpleAuth.isAuthenticated, simpleAuth.userType, simpleAuth.expert, isLoading, navigate, searchParams]);

  // Enhanced expert login with proper redirection
  const handleLogin = async (email: string, password: string) => {
    if (!email || !password) {
      toast.error('Please enter both email and password', { duration: 2000 });
      return false;
    }

    setIsLoggingIn(true);
    setLoginError(null);
    
    try {
      const result = await login(email, password, { asExpert: true });
      
      if (result.success) {
        toast.success('Login successful!');
        
        // Wait for auth state to update, then redirect to expert dashboard
        setTimeout(() => {
          navigate('/expert-dashboard', { replace: true });
        }, 1000);
        
        return true;
      } else {
        setLoginError(result.error || 'Login failed. Please check your credentials and try again.');
        toast.error(result.error || 'Login failed. Please check your credentials and try again.', { duration: 3000 });
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
