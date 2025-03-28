
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { useExpertAuth } from '@/hooks/expert-auth';
import { useUserAuth } from '@/contexts/UserAuthContext';
import ExpertLoginHeader from '@/components/expert/auth/ExpertLoginHeader';
import ExpertLoginTabs from '@/components/expert/auth/ExpertLoginTabs';
import LoadingView from '@/components/expert/auth/LoadingView';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const ExpertLogin = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('login');
  
  const { login, expert, loading } = useExpertAuth();
  const { isAuthenticated: isUserAuthenticated, currentUser: userProfile, logout: userLogout } = useUserAuth();
  
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('register') === 'true') {
      setActiveTab('register');
      toast.info('Please complete your expert registration to continue');
    }
  }, [location]);
  
  useEffect(() => {
    // If already logged in as expert, redirect to dashboard
    if (expert && !loading) {
      navigate('/expert-dashboard');
    }
  }, [expert, loading, navigate]);
  
  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    if (isLoggingIn) return false;
    
    // Basic validation
    if (!email.trim()) {
      setLoginError('Email is required');
      return false;
    }
    
    if (!password.trim()) {
      setLoginError('Password is required');
      return false;
    }
    
    setLoginError(null);
    setIsLoggingIn(true);
    
    try {
      const success = await login(email, password);
      
      if (!success) {
        setLoginError('Login failed. Please check your credentials and try again.');
      }
      
      return success;
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An unexpected error occurred. Please try again.');
      return false;
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleUserLogout = async () => {
    await userLogout();
    toast.success('Successfully logged out as user');
    // Refresh the page to clear any lingering state
    window.location.reload();
  };

  if (loading && !isLoggingIn) {
    return <LoadingView />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10 flex items-center justify-center bg-stars">
        <div className="container max-w-4xl">
          {isUserAuthenticated && (
            <div className="mb-6">
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>
                  You are currently logged in as {userProfile?.name || 'a user'}. You need to log out as a user before logging in as an expert.
                </AlertDescription>
              </Alert>
              <Button onClick={handleUserLogout} variant="destructive" className="flex items-center">
                <LogOut className="mr-2 h-4 w-4" />
                Log Out as User
              </Button>
            </div>
          )}
          
          <div className="bg-background/80 backdrop-blur-md rounded-xl shadow-xl p-8 border border-astro-purple/10">
            <ExpertLoginHeader />
            
            {!isUserAuthenticated && (
              <ExpertLoginTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onLogin={handleLogin}
                isLoggingIn={isLoggingIn}
                loginError={loginError}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExpertLogin;
