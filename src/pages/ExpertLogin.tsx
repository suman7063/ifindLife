
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

    // Show email verification notice if redirected from signup
    const verify = searchParams.get('verify');
    if (verify === 'email') {
      toast.info('Please verify your email address. Check your inbox for the verification link.');
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
      console.log(result,"result")
      console.log('ExpertLogin: Login result:', result);
      
      if (result.success) {
        toast.success('Login successful!');
        
        // Wait for auth state to update and expert profile to load, then redirect
        // Check if expert is approved before redirecting
        const checkAndRedirect = () => {
          let attempts = 0;
          const maxAttempts = 25; // 5 seconds max (25 * 200ms)
          
          const checkInterval = setInterval(() => {
            attempts++;
            
            // Check if expert profile is loaded and approved
            if (simpleAuth.expert && simpleAuth.expert.status === 'approved') {
              clearInterval(checkInterval);
              console.log('✅ Expert approved, redirecting to dashboard');
              navigate('/expert-dashboard', { replace: true });
            } else if (simpleAuth.isLoading === false && simpleAuth.expert) {
              // Profile loaded but status check
              if (simpleAuth.expert.status !== 'approved') {
                clearInterval(checkInterval);
                console.error('❌ Expert profile loaded but status is not approved:', simpleAuth.expert.status);
                // Don't redirect - error will be shown by validation
                return;
              }
            }
            
            // Timeout after max attempts
            if (attempts >= maxAttempts) {
              clearInterval(checkInterval);
              // If still loading or expert not loaded, redirect anyway (dashboard will handle it)
              if (simpleAuth.isLoading || !simpleAuth.expert) {
                console.log('⏳ Profile still loading, redirecting to dashboard (will load there)');
                navigate('/expert-dashboard', { replace: true });
              } else if (simpleAuth.expert.status === 'approved') {
                console.log('✅ Expert approved (timeout check), redirecting');
                navigate('/expert-dashboard', { replace: true });
              }
            }
          }, 200);
        };
        
        checkAndRedirect();
        
        return true;
      } else {
        // Use the specific error message from the login function
        const errorMsg = result.error || 'Login failed. Please check your credentials and try again.';
        console.log('ExpertLogin: Login failed with error:', errorMsg);
        setLoginError(errorMsg);
        
        // Show toast for all errors including approval errors
        toast.error(errorMsg, { duration: 5000 });
        
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMsg = error instanceof Error ? error.message : 'An error occurred during login. Please try again.';
      setLoginError(errorMsg);
      
      // Show toast for all errors including approval errors
      toast.error(errorMsg, { duration: 5000 });
      
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
        <Container className="max-w-4xl">
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
