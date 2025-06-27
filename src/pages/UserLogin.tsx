
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserLoginTabs from '@/components/auth/UserLoginTabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const UserLogin: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const simpleAuth = useSimpleAuth();
  const { isAuthenticated, userType, user, isLoading, login } = simpleAuth;

  console.log('UserLogin: Current auth state:', simpleAuth);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      console.log('UserLogin: User authenticated, redirecting to dashboard');
      const targetRoute = userType === 'expert' ? '/expert-dashboard' : '/user-dashboard';
      navigate(targetRoute, { replace: true });
    }
  }, [isLoading, isAuthenticated, user, userType, navigate]);

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    if (!email || !password) {
      toast.error('Please enter both email and password', { duration: 2000 });
      return false;
    }
    
    setIsLoggingIn(true);
    
    try {
      console.log('UserLogin: Attempting login:', email);
      
      const success = await login(email, password);
      
      if (success) {
        console.log('UserLogin: Login successful via SimpleAuth');
        toast.success('Login successful!', { duration: 2000 });
        return true;
      } else {
        console.error('UserLogin: Login failed via SimpleAuth');
        toast.error('Invalid email or password', { duration: 2000 });
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
