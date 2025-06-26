
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import Footer from '@/components/Footer';
import ExpertLoginTabs from '@/components/expert/auth/ExpertLoginTabs';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';

// Simple redirect safety to prevent infinite loops
class RedirectSafety {
  private redirectCount = 0;
  private lastRedirectTime = 0;
  private readonly MAX_REDIRECTS = 3;
  private readonly RESET_TIME = 5000; // 5 seconds

  canRedirect(from: string, to: string): boolean {
    const now = Date.now();
    
    // Reset counter if enough time has passed
    if (now - this.lastRedirectTime > this.RESET_TIME) {
      this.redirectCount = 0;
    }

    // Check if we've hit the limit
    if (this.redirectCount >= this.MAX_REDIRECTS) {
      console.error(`Redirect loop detected: ${from} -> ${to}. Blocking redirect.`);
      return false;
    }

    this.redirectCount++;
    this.lastRedirectTime = now;
    return true;
  }

  reset() {
    this.redirectCount = 0;
    this.lastRedirectTime = 0;
  }
}

const redirectSafety = new RedirectSafety();

const ExpertLogin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const { isAuthenticated, userType, expert, isLoading, login } = useSimpleAuth();
  const [hasRedirected, setHasRedirected] = useState(false);

  // Enhanced debug logging
  console.log('ExpertLogin - Simple auth state:', {
    isAuthenticated,
    userType,
    hasExpertProfile: !!expert,
    isLoading,
    expertStatus: expert?.status
  });

  // Check for existing authentication with redirect safety
  useEffect(() => {
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

    // Only redirect if authenticated as expert AND has expert profile AND hasn't redirected yet AND expert is approved
    if (isAuthenticated && userType === 'expert' && expert && expert.status === 'approved' && !hasRedirected) {
      console.log('ExpertLogin: Already authenticated as expert, checking redirect safety');
      
      if (redirectSafety.canRedirect('/expert-login', '/expert-dashboard')) {
        console.log('ExpertLogin: Redirecting to dashboard');
        setHasRedirected(true);
        
        // Add small delay to prevent infinite loops
        setTimeout(() => {
          navigate('/expert-dashboard', { replace: true });
        }, 100);
      } else {
        console.error('ExpertLogin: Redirect loop detected, staying on login page');
        toast.error('Authentication error detected. Please try logging out and back in.');
      }
    }
  }, [isAuthenticated, userType, expert, isLoading, navigate, searchParams, hasRedirected]);

  // Handle login with simple auth
  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoggingIn(true);
      setLoginError(null);
      
      console.log('ExpertLogin: Attempting login with simple auth:', email);
      
      const success = await login(email, password, { asExpert: true });
      
      if (success) {
        console.log('Expert login successful, will redirect shortly');
        toast.success('Login successful!');
        
        // Reset redirect safety on successful login
        redirectSafety.reset();
        
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
