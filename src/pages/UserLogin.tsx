
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
  
  // Use SimpleAuthContext
  const simpleAuth = useSimpleAuth();

  console.log('UserLogin: Current simple auth state:', {
    isAuthenticated: Boolean(simpleAuth?.isAuthenticated),
    userType: simpleAuth?.userType,
    hasUser: Boolean(simpleAuth?.user),
    isLoading: Boolean(simpleAuth?.isLoading),
    userEmail: simpleAuth?.user?.email
  });

  // CRITICAL: Add redirect logic that actually works
  useEffect(() => {
    console.log('UserLogin: Checking auth state for redirect...');
    console.log('UserLogin: Auth state details:', {
      isAuthenticated: simpleAuth?.isAuthenticated,
      user: simpleAuth?.user,
      loading: simpleAuth?.isLoading,
      userType: simpleAuth?.userType
    });

    // Wait for auth state to stabilize
    if (simpleAuth?.isLoading) {
      console.log('UserLogin: Auth still loading, waiting...');
      return;
    }

    // Check if user is properly authenticated
    const isProperlyAuthenticated = Boolean(
      simpleAuth?.isAuthenticated && 
      simpleAuth?.userType === 'user' && 
      simpleAuth?.user
    );

    console.log('UserLogin: Is properly authenticated:', isProperlyAuthenticated);

    if (isProperlyAuthenticated) {
      console.log('UserLogin: User authenticated, redirecting to dashboard');
      navigate('/user-dashboard', { replace: true });
    } else {
      console.log('UserLogin: User not authenticated, staying on login page');
      setIsCheckingAuth(false);
    }
  }, [simpleAuth?.isAuthenticated, simpleAuth?.user, simpleAuth?.isLoading, simpleAuth?.userType, navigate]);

  // Handle login form submission
  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    if (!email || !password) {
      toast.error('Please enter both email and password', { duration: 2000 });
      return false;
    }
    
    try {
      console.log('UserLogin: Attempting login:', email);
      
      // Use SimpleAuthContext login method
      const success = await simpleAuth?.login?.(email, password);
      
      if (success) {
        console.log('UserLogin: Login successful via SimpleAuth');
        toast.success('Login successful!', { duration: 2000 });
        // Don't navigate here - let the useEffect handle it
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
    }
  };

  // Temporary debug button function
  const forceRedirect = () => {
    console.log('Force redirecting to user dashboard');
    navigate('/user-dashboard', { replace: true });
  };

  // Don't render anything if authenticated (should redirect)
  if (simpleAuth?.isAuthenticated && simpleAuth?.user && simpleAuth?.userType === 'user') {
    console.log('UserLogin: User is authenticated, should redirect');
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
  if (isCheckingAuth || simpleAuth?.isLoading) {
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
        {/* Temporary debug button */}
        <button 
          onClick={forceRedirect}
          className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded z-50"
        >
          DEBUG: Force Redirect
        </button>
        
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
