
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserLoginTabs from '@/components/auth/UserLoginTabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useAuthRedirectSystem } from '@/hooks/useAuthRedirectSystem';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const UserLogin: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginJustFailed, setLoginJustFailed] = useState(false);
  
  const simpleAuth = useSimpleAuth();
  const { isAuthenticated, userType, user, isLoading, login } = simpleAuth;
  const { executeIntendedAction } = useAuthRedirectSystem();

  console.log('UserLogin: Current auth state:', {
    isAuthenticated,
    userType,
    hasUser: !!user,
    isLoading,
    userEmail: user?.email
  });

  // Redirect authenticated users to appropriate dashboard
  useEffect(() => {
    // Don't redirect if login just failed
    if (loginJustFailed) {
      setLoginJustFailed(false);
      return;
    }
    
    // IMPORTANT: Don't redirect if userType is 'expert' when on user login page
    // This means they tried to login as user but are actually an expert
    // The error message should be shown instead
    if (userType === 'expert' && !isLoading) {
      console.log('UserLogin: User is expert but on user login page - not redirecting, error should be shown');
      return;
    }
    
    if (!isLoading && isAuthenticated && user && userType !== 'none' && userType !== 'expert') {
      console.log('UserLogin: User authenticated, checking for redirect data');
      
      // Check for intended action first
      const pendingAction = executeIntendedAction();
      if (pendingAction) {
        console.log('UserLogin: Found pending action, staying on page for action execution:', pendingAction);
        // Don't navigate away - let the component that initiated the action handle it
        // Navigate back to where the user came from instead of dashboard
        setTimeout(() => {
          window.history.back();
        }, 1000);
        return;
      }
      
      // Otherwise, redirect to appropriate dashboard based on userType
      setTimeout(() => {
        console.log('UserLogin: Redirecting to home page instead of dashboard');
        navigate('/', { replace: true });
      }, 500);
    }
  }, [isLoading, isAuthenticated, user, userType, navigate, executeIntendedAction, loginJustFailed]);

  const handleLogin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!email || !password) {
      const errorMsg = 'Please enter both email and password';
      toast.error(errorMsg, { duration: 2000 });
      return { success: false, error: errorMsg };
    }
    
    setIsLoggingIn(true);
    
    try {
      console.log('UserLogin: Attempting user login:', email);
      
      const result = await login(email, password, { asExpert: false });
      
      if (result.success) {
        console.log('UserLogin: Login successful, userType:', result.userType);
        toast.success('Login successful!', { duration: 2000 });
        
        // Navigation will be handled by the useEffect after auth state updates
        return { success: true };
      } else {
        console.error('UserLogin: Login failed:', result.error);
        // Mark that login just failed to prevent redirect
        setLoginJustFailed(true);
        // Show toast but also return error for component to display
        toast.error(result.error || 'Login failed', { duration: 3000 });
        return { success: false, error: result.error || 'Login failed' };
      }
    } catch (error: any) {
      console.error('UserLogin: Login error:', error);
      const errorMsg = 'An unexpected error occurred';
      setLoginJustFailed(true);
      toast.error(errorMsg, { duration: 2000 });
      return { success: false, error: errorMsg };
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Show loading while checking auth
  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <span className="ml-2">Checking authentication...</span>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="py-12 bg-gray-50 min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome to iFindLife</CardTitle>
            <p className="text-muted-foreground mt-2">
              Login to access your account
            </p>
          </CardHeader>
          
          <CardContent>
            <UserLoginTabs onLogin={handleLogin} isLoggingIn={isLoggingIn} />
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default UserLogin;
