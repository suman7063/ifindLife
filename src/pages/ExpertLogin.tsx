
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import ExpertLoginTabs from '@/components/expert/auth/ExpertLoginTabs';
import { useUnifiedAuth } from '@/contexts/auth/UnifiedAuthContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const ExpertLogin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const { isAuthenticated, sessionType, expert, isLoading, login } = useUnifiedAuth();
  const [hasRedirected, setHasRedirected] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  console.log('ExpertLogin: Unified auth state:', {
    isAuthenticated,
    sessionType,
    hasExpertProfile: !!expert,
    isLoading
  });

  // Check for existing authentication
  useEffect(() => {
    console.log('ExpertLogin: Auth state check:', {
      isAuthenticated,
      sessionType,
      hasExpertProfile: !!expert,
      isLoading
    });

    // Check status from URL parameters
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

    // Only redirect if authenticated as expert AND has expert profile AND hasn't redirected yet
    if (isAuthenticated && sessionType === 'expert' && expert && !hasRedirected && !isRedirecting) {
      console.log('ExpertLogin: Already authenticated as expert, redirecting to dashboard');
      setHasRedirected(true);
      setIsRedirecting(true);
      
      // Add small delay to prevent infinite loops
      setTimeout(() => {
        navigate('/expert-dashboard');
      }, 100);
    }
  }, [isAuthenticated, sessionType, expert, isLoading, navigate, searchParams, hasRedirected, isRedirecting]);

  // Handle login with unified auth
  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoggingIn(true);
      setLoginError(null);
      
      console.log('ExpertLogin: Attempting login with unified auth:', email);
      
      const success = await login('expert', { email, password, asExpert: true });
      
      if (success) {
        console.log('Expert login successful, will redirect shortly');
        toast.success('Login successful!');
        
        // Add a small delay to allow auth state to update
        setTimeout(() => {
          navigate('/expert-dashboard', { replace: true });
        }, 100);
        
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

  // Show loading while auth is being checked or during redirect
  if (isLoading || isRedirecting) {
    return (
      <>
        <Navbar />
        
        <main className="py-8 md:py-12 bg-gray-50 min-h-screen">
          <Container>
            <div className="flex justify-center">
              <div className="w-full max-w-lg">
                <div className="bg-white rounded-lg shadow-md p-6 md:p-8 flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p>{isRedirecting ? 'Redirecting to dashboard...' : 'Checking authentication...'}</p>
                </div>
              </div>
            </div>
          </Container>
        </main>
        
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <main className="py-8 md:py-12 bg-gray-50 min-h-screen">
        <Container>
          <div className="flex justify-center">
            <div className="w-full max-w-lg">
              <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
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
            </div>
          </div>
        </Container>
      </main>
      
      <Footer />
    </>
  );
};

export default ExpertLogin;
