
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/UnifiedAuthContext';
import ExpertLoginForm from '@/components/expert/auth/ExpertLoginForm';
import LoadingScreen from '@/components/auth/LoadingScreen';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ExpertLogin: React.FC = () => {
  const { isAuthenticated, sessionType, expertProfile, isLoading, login } = useAuth();
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  console.log('ExpertLogin: Current auth state:', {
    isAuthenticated: Boolean(isAuthenticated),
    sessionType,
    hasExpertProfile: Boolean(expertProfile),
    isLoading: Boolean(isLoading),
    expertEmail: expertProfile?.email
  });

  useEffect(() => {
    // Don't proceed if still loading
    if (isLoading) {
      console.log('ExpertLogin: Auth still loading, waiting...');
      return;
    }

    const checkExistingAuth = () => {
      console.log('ExpertLogin: Checking existing authentication...');

      // If authenticated as expert with valid profile, redirect to dashboard
      if (isAuthenticated && sessionType === 'expert' && expertProfile) {
        console.log('ExpertLogin: Expert authenticated, redirecting to dashboard');
        navigate('/expert-dashboard', { replace: true });
        return;
      }

      // If authenticated but as different type, show message and logout
      if (isAuthenticated && sessionType !== 'expert') {
        console.log('ExpertLogin: Authenticated as different type, need to logout');
        toast.info('You need to login as an expert to access this area');
      }

      setCheckingAuth(false);
    };

    // Small delay to ensure auth state is stable
    const timer = setTimeout(checkExistingAuth, 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, sessionType, expertProfile, isLoading, navigate]);

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    setIsLoggingIn(true);
    setLoginError(null);
    
    try {
      console.log('ExpertLogin: Attempting login for expert:', email);
      
      // Set session type before login
      localStorage.setItem('sessionType', 'expert');
      
      const result = await login(email, password);
      
      if (result) {
        console.log('ExpertLogin: Login successful');
        return true;
      } else {
        setLoginError('Invalid email or password');
        return false;
      }
    } catch (error) {
      console.error('ExpertLogin: Login error:', error);
      setLoginError('Login failed. Please try again.');
      return false;
    } finally {
      setIsLoggingIn(false);
    }
  };

  const setActiveTab = (tab: string) => {
    console.log('ExpertLogin: Setting active tab to:', tab);
  };

  if (isLoading || checkingAuth) {
    return <LoadingScreen message="Checking expert authentication..." />;
  }

  // If already authenticated as expert, show loading while redirecting
  if (isAuthenticated && sessionType === 'expert' && expertProfile) {
    return <LoadingScreen message="Redirecting to expert dashboard..." />;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <Container className="max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Expert Portal</CardTitle>
              <p className="text-muted-foreground">Sign in to your expert account</p>
            </CardHeader>
            <CardContent>
              <ExpertLoginForm 
                onLogin={handleLogin}
                isLoggingIn={isLoggingIn}
                loginError={loginError}
                setActiveTab={setActiveTab}
              />
            </CardContent>
          </Card>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default ExpertLogin;
