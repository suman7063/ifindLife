
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Container } from '@/components/ui/container';
import ExpertLoginContent from '@/components/expert/auth/ExpertLoginContent';
import { useAuth } from '@/contexts/auth/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingScreen from '@/components/auth/LoadingScreen';
import { supabase } from '@/lib/supabase';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ExpertLogin: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(
    searchParams.get('register') === 'true' ? 'register' : 'login'
  );
  const [isLogging, setIsLogging] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  const [dbErrorRetries, setDbErrorRetries] = useState(0);
  const [systemError, setSystemError] = useState<string | null>(null);
  
  // Get auth context
  const { isLoading, isAuthenticated, expertProfile, userProfile, role, login } = useAuth();
  
  // Debug logging
  useEffect(() => {
    console.log("ExpertLogin component rendering", { 
      isLoading, 
      isAuthenticated, 
      hasExpertProfile: !!expertProfile,
      hasUserProfile: !!userProfile,
      role,
      redirectAttempted,
      dbErrorRetries
    });
    
    // Clear any previous login origins
    sessionStorage.setItem('loginOrigin', 'expert');
  }, [isLoading, isAuthenticated, expertProfile, userProfile, role, redirectAttempted, dbErrorRetries]);
  
  // Clear any cached redirects
  useEffect(() => {
    localStorage.removeItem('redirectAfterLogin');
  }, []);
  
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
    } else if (status === 'dberror') {
      setStatusMessage({
        type: 'error',
        message: 'Database error occurred. Please try again or contact support.'
      });
    }
  }, [searchParams]);
  
  // Redirect if already authenticated as expert
  useEffect(() => {
    if (!isLoading && isAuthenticated && !redirectAttempted) {
      setRedirectAttempted(true);
      
      console.log('ExpertLogin: Authentication status check', { role, hasExpertProfile: !!expertProfile });
      
      if (role === 'expert' && expertProfile) {
        console.log('ExpertLogin: User is authenticated as expert, redirecting to expert dashboard');
        // Use replace: true to prevent going back to login
        navigate('/expert-dashboard', { replace: true });
      } else if (role === 'user') {
        console.log('ExpertLogin: User is authenticated as regular user, not as expert');
        toast.error('You are logged in as a user. Please log out first to access expert portal.');
        navigate('/user-dashboard');
      }
    }
  }, [isLoading, isAuthenticated, expertProfile, role, navigate, redirectAttempted]);
  
  const handleSystemErrorRefresh = () => {
    window.location.reload();
  };
  
  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    setIsLogging(true);
    setLoginError(null);
    setSystemError(null);
    
    try {
      console.log('ExpertLogin: Attempting login with', email);
      
      // First check for existing session and sign out if necessary
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        console.log('ExpertLogin: Found existing session, signing out first');
        await supabase.auth.signOut({ scope: 'local' });
      }
      
      // CRITICAL FIX: Always set login origin for role determination
      sessionStorage.setItem('loginOrigin', 'expert');
      
      // Check if login function is available
      if (!login || typeof login !== 'function') {
        console.error('Login function is not available in auth context');
        toast.error('Login functionality is not available. Please try again later.');
        setLoginError('Login functionality is not available. Please try refreshing the page.');
        setIsLogging(false);
        return false;
      }
      
      try {
        // Pass 'expert' as the roleOverride parameter to ensure proper role checking
        const success = await login(email, password, 'expert');
        
        if (success) {
          console.log('ExpertLogin: Login successful');
          toast.success('Successfully logged in as expert!');
          navigate('/expert-dashboard', { replace: true });
          return true;
        } else {
          // Handle database error as a special case
          const isDatabaseError = dbErrorRetries < 3;
          
          if (isDatabaseError) {
            console.warn(`ExpertLogin: Database error detected, retry attempt ${dbErrorRetries + 1}`);
            setDbErrorRetries(prev => prev + 1);
            
            // Show more informative error for database issues
            toast.error('Database connection issue detected. Please try again in a moment.');
            setLoginError('A temporary database issue occurred. Please try again.');
            
            // For user experience, we'll reload the page after a brief delay when we detect DB issues
            if (dbErrorRetries >= 2) {
              toast.info('Refreshing application to resolve connection issues...');
              setTimeout(() => {
                window.location.href = '/expert-login?status=dberror';
              }, 2000);
            }
          } else {
            console.error('ExpertLogin: Login failed');
            setLoginError('Login failed. Please check your credentials or contact support.');
          }
          setIsLogging(false);
          return false;
        }
      } catch (error: any) {
        // Handle specific database errors
        if (error.message && (error.message.includes('recursion') || error.message.includes('500'))) {
          console.error('Database permission error:', error.message);
          setSystemError('We are experiencing a database issue. Please try again later or contact support.');
          toast.error('Database error. Our team has been notified.');
          setLoginError(null); // Clear regular login error
        } else {
          console.error('ExpertLogin error:', error);
          toast.error('Failed to login. Please try again.');
          setLoginError('Failed to login. Please try again.');
        }
        setIsLogging(false);
        return false;
      }
    } catch (error: any) {
      console.error('ExpertLogin error:', error);
      toast.error('Failed to login. Please try again.');
      setLoginError('Failed to login. Please try again.');
      setIsLogging(false);
      return false;
    }
  };

  // Create a wrapper function to handle type conversion
  const handleTabChange = (tab: string) => {
    if (tab === 'login' || tab === 'register') {
      setActiveTab(tab);
      // Clear error messages when switching tabs
      setLoginError(null);
      setStatusMessage(null);
      setSystemError(null);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }
  
  // Display system error with refresh option
  if (systemError) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-12">
          <Container className="max-w-md">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-red-600 mb-4">System Error</h2>
              <p className="mb-6">{systemError}</p>
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>
                  There appears to be a database issue. Our team has been notified.
                </AlertDescription>
              </Alert>
              <Button 
                onClick={handleSystemErrorRefresh}
                className="w-full flex items-center justify-center"
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Refresh Page
              </Button>
            </div>
          </Container>
        </div>
        <Footer />
      </>
    );
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
