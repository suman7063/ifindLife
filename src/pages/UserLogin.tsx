
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import UserLoginTabs from '@/components/auth/UserLoginTabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth/UnifiedAuthContext';
import AuthRedirectSystem from '@/utils/authRedirectSystem';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { forceAuthRefresh, navigateAfterLogin } from '@/utils/authHelpers';

const UserLogin: React.FC = () => {
  const navigate = useNavigate();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { isAuthenticated, sessionType, user, isLoading: authLoading } = useAuth();

  console.log('UserLogin: Current unified auth state:', {
    isAuthenticated: Boolean(isAuthenticated),
    sessionType,
    hasUser: Boolean(user),
    authLoading: Boolean(authLoading),
    userEmail: user?.email
  });

  // Check for existing session on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('UserLogin: Checking for existing session...');
        
        // Wait for auth state to stabilize
        if (authLoading) {
          console.log('UserLogin: Auth still loading, waiting...');
          return;
        }
        
        // Enhanced authentication check using unified auth
        const isProperlyAuthenticated = Boolean(
          isAuthenticated && 
          sessionType === 'user' && 
          user
        );
        
        console.log('UserLogin: Enhanced auth check result:', {
          isAuthenticated: Boolean(isAuthenticated),
          sessionType,
          hasUser: Boolean(user),
          isProperlyAuthenticated,
          authLoading: Boolean(authLoading)
        });
        
        if (isProperlyAuthenticated) {
          console.log('UserLogin: User is properly authenticated, handling redirect...');
          
          // Execute pending redirect/action
          setTimeout(async () => {
            const redirectExecuted = await AuthRedirectSystem.executeRedirect();
            
            if (!redirectExecuted) {
              console.log('UserLogin: No redirect data, going to dashboard');
              navigate('/user-dashboard', { replace: true });
            }
          }, 100);
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
  }, [navigate, isAuthenticated, sessionType, user, authLoading]);

  // Enhanced login handler with force refresh
  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    if (!email || !password) {
      toast.error('Please enter both email and password', { duration: 2000 });
      return false;
    }
    
    try {
      setIsLoggingIn(true);
      console.log('UserLogin: Attempting login with enhanced flow:', email);
      
      // Check if we have redirect data to show appropriate message
      const redirectData = AuthRedirectSystem.getRedirect();
      if (redirectData) {
        toast.info(`Logging you in to ${redirectData.action || 'continue'}...`);
      }
      
      // Set session type before login attempt
      localStorage.setItem('sessionType', 'user');
      console.log('UserLogin: Session type set to user');
      
      // Proceed with login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('UserLogin: Login error:', error);
        toast.error(error.message || 'Invalid email or password', { duration: 2000 });
        return false;
      }
      
      if (!data.user || !data.session) {
        console.error('UserLogin: No user or session returned');
        toast.error('Login failed. Please try again.', { duration: 2000 });
        return false;
      }
      
      console.log('✅ UserLogin: Login successful, user ID:', data.user.id);
      toast.success('Login successful!', { duration: 2000 });
      
      // Force context refresh and navigation
      console.log('✅ User login successful, forcing context refresh...');
      
      // Method 1: Force auth refresh
      setTimeout(() => {
        forceAuthRefresh();
      }, 100);
      
      // Method 2: Navigate with forced refresh after delay
      setTimeout(async () => {
        const redirectExecuted = await AuthRedirectSystem.executeRedirect();
        
        if (!redirectExecuted) {
          console.log('🚀 Navigating to user dashboard with forced refresh...');
          navigateAfterLogin('user');
        }
      }, 500);
      
      return true;
    } catch (error: any) {
      console.error('UserLogin: Login error:', error);
      toast.error('An unexpected error occurred', { duration: 2000 });
      return false;
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  // Show loading while checking auth
  if (isCheckingAuth || authLoading) {
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
  if (isAuthenticated && sessionType === 'user' && user && !authLoading) {
    console.log('UserLogin: User is authenticated, should redirect');
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Processing your request...</span>
        </div>
        <Footer />
      </>
    );
  }

  // Get redirect context for UI messaging
  const redirectData = AuthRedirectSystem.getRedirect();
  const actionMessage = redirectData 
    ? `Login to ${redirectData.action || 'continue'} ${redirectData.expertName ? `with ${redirectData.expertName}` : ''}`
    : 'Login to access your account';
  
  return (
    <>
      <Navbar />
      <div className="py-12 bg-gray-50 min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome to iFindLife</CardTitle>
            <p className="text-muted-foreground mt-2">
              {actionMessage}
            </p>
            {redirectData && (
              <p className="text-sm text-primary mt-1">
                You'll be returned to complete your action after logging in
              </p>
            )}
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
