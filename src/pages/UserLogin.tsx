
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
    if (!isLoading && isAuthenticated && user && userType !== 'none') {
      
      // Check for intended action first
      const pendingAction = executeIntendedAction();
      if (pendingAction) {
        // Navigate back to the stored current path or go back in history
        if (pendingAction.currentPath) {
          navigate(pendingAction.currentPath, { replace: true });
        } else {
          window.history.back();
        }
        return;
      }
      
      // Otherwise, redirect to appropriate dashboard based on userType
      if (userType === 'expert') {
        navigate('/expert-dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isLoading, isAuthenticated, user, userType, navigate, executeIntendedAction]);

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    if (!email || !password) {
      toast.error('Please enter both email and password', { duration: 2000 });
      return false;
    }
    
    setIsLoggingIn(true);
    
    try {
      console.log('UserLogin: Attempting user login:', email);
      
      const success = await login(email, password, { asExpert: false });
      
      if (success) {
        console.log('UserLogin: Login successful');
        toast.success('Login successful!', { duration: 2000 });
        
        // Navigation will be handled by the useEffect after auth state updates
        return true;
      } else {
        console.error('UserLogin: Login failed');
        toast.error('Login failed', { duration: 3000 });
        return false;
      }
    } catch (error: any) {
      console.error('UserLogin: Login error:', error);
      toast.error('An unexpected error occurred', { duration: 2000 });
      return false;
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
