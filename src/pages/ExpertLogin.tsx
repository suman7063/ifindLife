
import React, { useState, useEffect } from 'react';
import { useExpertAuth } from '@/hooks/useExpertAuth';
import { useNavigate } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import ExpertLoginTabs from '@/components/expert/auth/ExpertLoginTabs';
import { toast } from 'sonner';

const ExpertLogin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const auth = useExpertAuth();
  const navigate = useNavigate();
  
  // Enhanced debug logging
  useEffect(() => {
    console.log('ExpertLogin: Auth context state:', {
      isAuthenticated: auth?.isAuthenticated,
      isLoading: auth?.isLoading,
      role: typeof auth?.login === 'function' ? 'available' : 'missing',
      authKeys: Object.keys(auth)
    });

    // Check if already authenticated as expert and redirect
    if (!auth.isLoading && auth.isAuthenticated) {
      console.log('Already authenticated as expert, redirecting to dashboard');
      navigate('/expert-dashboard', { replace: true });
    }
  }, [auth, navigate]);

  // Handle login with better error handling
  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoggingIn(true);
      setLoginError(null);
      
      console.log('ExpertLogin: Attempting login with:', {
        email,
        hasLoginFunction: typeof auth?.login === 'function'
      });
      
      if (!auth || typeof auth.login !== 'function') {
        console.error('ExpertLogin: Login function not available');
        setLoginError('Authentication service is not available. Please try again later.');
        toast.error('Authentication service is not available. Please try again later.');
        return false;
      }
      
      // Using login with explicit asExpert option
      const success = await auth.login(email, password);
      
      if (success) {
        console.log('Expert login successful, will redirect shortly');
        toast.success('Login successful!');
        navigate('/expert-dashboard');
        return true;
      } else {
        console.error('Expert login failed');
        setLoginError('Invalid username or password. Please check your credentials and try again.');
        toast.error('Invalid username or password. Please check your credentials and try again.');
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
