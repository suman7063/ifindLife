
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
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { isAuthenticated, userType, user, isLoading, login } = useSimpleAuth();

  console.log('UserLogin: Current simple auth state:', {
    isAuthenticated: Boolean(isAuthenticated),
    userType,
    hasUser: Boolean(user),
    isLoading: Boolean(isLoading),
    userEmail: user?.email
  });

  // Check for existing session on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('UserLogin: Checking for existing session...');
        
        // Wait for auth state to stabilize
        if (isLoading) {
          console.log('UserLogin: Auth still loading, waiting...');
          return;
        }
        
        // Check if user is properly authenticated
        const isProperlyAuthenticated = Boolean(
          isAuthenticated && 
          userType === 'user' && 
          user
        );
        
        console.log('UserLogin: Auth check result:', {
          isAuthenticated: Boolean(isAuthenticated),
          userType,
          hasUser: Boolean(user),
          isProperlyAuthenticated,
          isLoading: Boolean(isLoading)
        });
        
        if (isProperlyAuthenticated) {
          console.log('UserLogin: User is properly authenticated, redirecting to dashboard...');
          navigate('/user-dashboard', { replace: true });
        } else {
          console.log('UserLogin: User not authenticated, staying on login page');
        }
      } catch (error) {
        console.error('UserLogin: Error checking session:', error);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    
    checkSession();
  }, [navigate, isAuthenticated, userType, user, isLoading]);

  // Handle login form submission
  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    if (!email || !password) {
      toast.error('Please enter both email and password', { duration: 2000 });
      return false;
    }
    
    try {
      console.log('UserLogin: Attempting login:', email);
      
      const success = await login(email, password);
      
      if (success) {
        console.log('UserLogin: Login successful');
        toast.success('Login successful!', { duration: 2000 });
        
        // Navigation will be handled by the useEffect above when auth state changes
        return true;
      } else {
        console.error('UserLogin: Login failed');
        toast.error('Invalid email or password', { duration: 2000 });
        return false;
      }
    } catch (error: any) {
      console.error('UserLogin: Login error:', error);
      toast.error('An unexpected error occurred', { duration: 2000 });
      return false;
    }
  };
  
  // Show loading while checking auth
  if (isCheckingAuth || isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Checking authentication...</span>
        </div>
        <Footer />
      </>
    );
  }

  // If user is authenticated, show redirect message
  if (isAuthenticated && userType === 'user' && user && !isLoading) {
    console.log('UserLogin: User is authenticated, should redirect');
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Redirecting to dashboard...</span>
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
            <UserLoginTabs onLogin={handleLogin} isLoggingIn={false} />
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default UserLogin;
