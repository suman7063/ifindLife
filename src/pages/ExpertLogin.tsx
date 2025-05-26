
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import Footer from '@/components/Footer';
import Navbar from '../components/Navbar';
import ExpertLoginTabs from '@/components/expert/auth/ExpertLoginTabs';
import { useExpertAuth } from '@/hooks/expert-auth/useExpertAuth';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const ExpertLogin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Authentication state - no Agora dependencies here
  const [authLoaded, setAuthLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load authentication hook after component mount
  const { isAuthenticated, currentExpert, login } = useExpertAuth();
  
  // Mark auth as loaded after initial render
  useEffect(() => {
    setAuthLoaded(true);
    setIsLoading(false);
  }, []);
  
  // Check for existing authentication - pure auth logic only
  useEffect(() => {
    if (!authLoaded) return;
    
    console.log('ExpertLogin: Auth state (no Agora):', {
      isAuthenticated,
      hasExpertProfile: !!currentExpert,
      isLoading
    });

    // Check status from URL parameters
    const status = searchParams.get('status');
    if (status === 'pending') {
      toast.info('Your expert account is pending approval. You will be notified once approved.');
    } else if (status === 'disapproved') {
      toast.error('Your expert account application has been disapproved.');
    }

    // Redirect if already authenticated
    if (!isLoading && isAuthenticated && currentExpert) {
      console.log('Already authenticated as expert, redirecting to dashboard');
      navigate('/expert-dashboard', { replace: true });
    }
  }, [isAuthenticated, currentExpert, isLoading, navigate, searchParams, authLoaded]);

  // Handle login with proper error handling - no Agora dependencies
  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoggingIn(true);
      setLoginError(null);
      
      console.log('ExpertLogin: Attempting login (auth only):', email);
      
      if (typeof login !== 'function') {
        console.error('ExpertLogin: Login function not available');
        setLoginError('Authentication service is not available. Please try again later.');
        toast.error('Authentication service is not available. Please try again later.');
        return false;
      }
      
      const success = await login(email, password);
      
      if (success) {
        console.log('Expert login successful, will redirect shortly');
        toast.success('Login successful!');
        
        // Set session type to ensure consistency
        localStorage.setItem('sessionType', 'expert');
        localStorage.setItem('preferredRole', 'expert');
        
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

  return (
    <>
      <Navbar />
      
      <main className="py-8 md:py-12 bg-gray-50 min-h-screen">
        <Container>
          <div className="flex justify-center">
            <div className="w-full max-w-lg">
              {isLoading ? (
                <div className="bg-white rounded-lg shadow-md p-6 md:p-8 flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p>Loading authentication service...</p>
                </div>
              ) : (
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
              )}
            </div>
          </div>
        </Container>
      </main>
      
      <Footer />
    </>
  );
};

export default ExpertLogin;
