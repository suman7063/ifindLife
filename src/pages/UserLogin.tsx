
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

  // DETAILED DEBUGGING
  console.log('UserLogin: DETAILED AUTH STATE DEBUG:', {
    fullAuthObject: simpleAuth,
    user: simpleAuth?.user,
    isAuthenticated: simpleAuth?.isAuthenticated,
    userType: simpleAuth?.userType,
    isLoading: simpleAuth?.isLoading,
    hasUser: !!simpleAuth?.user,
    userKeys: simpleAuth?.user ? Object.keys(simpleAuth.user) : 'no user',
    authKeys: simpleAuth ? Object.keys(simpleAuth) : 'no auth object'
  });

  useEffect(() => {
    console.log('UserLogin: Checking auth state for redirect...');
    console.log('UserLogin: REDIRECT CHECK - Detailed state:', {
      isAuthenticated: Boolean(isAuthenticated),
      userType,
      hasUser: Boolean(user),
      isLoading: Boolean(isLoading),
      userEmail: user?.email
    });
    
    // Wait for auth state to stabilize
    if (isLoading) {
      console.log('UserLogin: Auth still loading, waiting...');
      return;
    }

    // Check if user is properly authenticated as a user
    const isUserAuthenticated = Boolean(
      isAuthenticated && 
      userType === 'user' && 
      user
    );

    console.log('UserLogin: Is user authenticated:', isUserAuthenticated);

    if (isUserAuthenticated) {
      console.log('UserLogin: User authenticated, redirecting to user dashboard');
      navigate('/user-dashboard', { replace: true });
    } else {
      console.log('UserLogin: User not authenticated, staying on login page');
    }
  }, [isAuthenticated, user, isLoading, userType, navigate]);

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

  // Don't render login form if already authenticated (should redirect)
  if (isAuthenticated && userType === 'user' && user && !isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="mt-2 text-gray-600">Redirecting to dashboard...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

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
        {/* Emergency redirect button for debugging */}
        <button 
          onClick={() => {
            console.log('Emergency redirect triggered');
            navigate('/user-dashboard', { replace: true });
          }}
          className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded text-sm z-50"
        >
          EMERGENCY: Go to Dashboard
        </button>
        
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
