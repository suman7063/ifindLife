
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserLoginTabs from '@/components/auth/UserLoginTabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { isUserAuthenticated } from '@/utils/authHelpers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const UserLogin: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const simpleAuth = useSimpleAuth();
  const { isAuthenticated, userType, user, isLoading, login } = simpleAuth;

  // DETAILED DEBUGGING with unified auth check
  console.log('UserLogin: UNIFIED AUTH CHECK:', {
    unifiedResult: isUserAuthenticated(simpleAuth),
    originalCheck: Boolean(isAuthenticated && userType === 'user' && user),
    rawAuthState: {
      isAuthenticated: Boolean(isAuthenticated),
      userType,
      hasUser: Boolean(user),
      userEmail: user?.email,
      isLoading: Boolean(isLoading)
    }
  });

  // PRIMARY AUTH CHECK - Using unified helper
  useEffect(() => {
    console.log('UserLogin: Primary auth check with unified helper...');
    
    if (isLoading) {
      console.log('UserLogin: Still loading, waiting...');
      return;
    }

    if (isUserAuthenticated(simpleAuth)) {
      console.log('UserLogin: User authenticated via unified helper, redirecting');
      navigate('/user-dashboard', { replace: true });
    } else {
      console.log('UserLogin: Not authenticated via unified helper');
    }
  }, [simpleAuth, isLoading, navigate]);

  // SECONDARY AUTH CHECK - Copy LoginDropdown's exact logic
  useEffect(() => {
    console.log('UserLogin: Secondary check using LoginDropdown logic...');
    
    if (isLoading) return;
    
    // LoginDropdown checks: Boolean(isAuthenticated) || Boolean(hasExpertProfile)
    // For user login, we adapt this to: user exists and has email
    if (simpleAuth?.user && simpleAuth?.user?.email) {
      console.log('UserLogin: Using LoginDropdown-style logic - user has email, redirecting');
      navigate('/user-dashboard', { replace: true });
    }
  }, [simpleAuth?.user, simpleAuth?.user?.email, isLoading, navigate]);

  // EMERGENCY AUTH CHECK - Most basic user check
  useEffect(() => {
    console.log('UserLogin: Emergency check - basic user presence...');
    
    if (isLoading) return;
    
    if (user?.email && isAuthenticated) {
      console.log('UserLogin: Emergency redirect - user authenticated with email');
      navigate('/user-dashboard', { replace: true });
    }
  }, [user?.email, isAuthenticated, isLoading, navigate]);

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
        
        // Force immediate redirect on successful login
        setTimeout(() => {
          console.log('UserLogin: Forcing redirect after successful login');
          navigate('/user-dashboard', { replace: true });
        }, 100);
        
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

  // Don't render login form if already authenticated
  if (isUserAuthenticated(simpleAuth) && !isLoading) {
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
            console.log('Emergency redirect triggered with auth state:', simpleAuth);
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
