
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

const UserLogin: React.FC = () => {
  const navigate = useNavigate();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { isAuthenticated, sessionType, user, isLoading: authLoading } = useAuth();

  console.log('UserLogin: Current auth state:', {
    isAuthenticated: Boolean(isAuthenticated),
    sessionType,
    hasUser: Boolean(user),
    authLoading: Boolean(authLoading)
  });

  // Check for existing session on component mount
  useEffect(() => {
    const checkExistingAuth = async () => {
      try {
        console.log('UserLogin: Checking for existing authentication...');
        
        if (authLoading) {
          console.log('UserLogin: Auth still loading, waiting...');
          return;
        }
        
        // Check if already authenticated
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log('UserLogin: Found existing session, determining redirect...');
          
          // Get session type from localStorage
          const storedSessionType = localStorage.getItem('sessionType') || 'user';
          
          // Redirect based on session type
          const redirectMap = {
            'user': '/user-dashboard',
            'expert': '/expert-dashboard', 
            'admin': '/admin-dashboard'
          };
          
          const targetUrl = redirectMap[storedSessionType as keyof typeof redirectMap] || '/user-dashboard';
          
          console.log('UserLogin: Redirecting to:', targetUrl);
          
          // Force redirect with replace
          setTimeout(() => {
            window.location.href = targetUrl;
          }, 100);
          
          return;
        }
        
        console.log('UserLogin: No existing session found');
      } catch (error) {
        console.error('UserLogin: Error checking session:', error);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    
    checkExistingAuth();
  }, [authLoading]);

  // Enhanced login handler with working redirect
  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return false;
    }
    
    try {
      setIsLoggingIn(true);
      console.log('UserLogin: Attempting login for:', email);
      
      // Set session type BEFORE login attempt
      localStorage.setItem('sessionType', 'user');
      
      // Proceed with login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('UserLogin: Login error:', error);
        toast.error(error.message || 'Invalid email or password');
        localStorage.removeItem('sessionType');
        return false;
      }
      
      if (!data.user || !data.session) {
        console.error('UserLogin: No user or session returned');
        toast.error('Login failed. Please try again.');
        localStorage.removeItem('sessionType');
        return false;
      }
      
      console.log('✅ UserLogin: Login successful');
      toast.success('Login successful!');
      
      // Force redirect after successful login
      setTimeout(async () => {
        const redirectExecuted = await AuthRedirectSystem.executeRedirect();
        
        if (!redirectExecuted) {
          console.log('🚀 UserLogin: Redirecting to user dashboard');
          window.location.href = '/user-dashboard';
        }
      }, 500);
      
      return true;
    } catch (error: any) {
      console.error('UserLogin: Unexpected error:', error);
      toast.error('An unexpected error occurred');
      localStorage.removeItem('sessionType');
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
  if (isAuthenticated && sessionType === 'user' && user) {
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
