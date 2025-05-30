
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import UserLoginTabs from '@/components/auth/UserLoginTabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthJourneyPreservation } from '@/hooks/useAuthJourneyPreservation';
import { useAuth } from '@/contexts/auth/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const UserLogin: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { executePendingAction } = useAuthJourneyPreservation();
  const authState = useAuth();

  console.log('UserLogin: Current auth state:', {
    hasUser: !!authState?.user,
    hasSession: !!authState?.session,
    sessionType: authState?.sessionType,
    isAuthenticated: authState?.isAuthenticated,
    isLoading: authState?.isLoading,
    userEmail: authState?.user?.email
  });

  // Check for existing session on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('UserLogin: Checking for existing session...');
        
        // Wait for auth state to stabilize
        if (authState?.isLoading) {
          console.log('UserLogin: Auth still loading, waiting...');
          return;
        }
        
        // Enhanced authentication check
        const isProperlyAuthenticated = !!(
          authState?.user && 
          authState?.session && 
          authState?.sessionType && 
          authState?.sessionType !== 'none' && 
          authState?.isAuthenticated
        );
        
        console.log('UserLogin: Enhanced auth check result:', {
          user: !!authState?.user,
          session: !!authState?.session,
          sessionType: authState?.sessionType,
          isAuthenticated: authState?.isAuthenticated,
          isProperlyAuthenticated,
          authLoading: authState?.isLoading
        });
        
        if (isProperlyAuthenticated) {
          console.log('UserLogin: User is properly authenticated, checking for pending actions...');
          
          // Execute pending action if it exists
          setTimeout(() => {
            const pendingAction = executePendingAction();
            if (pendingAction) {
              console.log('UserLogin: Found pending action, executing:', pendingAction);
              return;
            }
            
            console.log('UserLogin: No pending action, redirecting to dashboard');
            navigate('/user-dashboard', { replace: true });
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
  }, [navigate, executePendingAction, authState]);

  // Handle login form submission with enhanced logging
  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    if (!email || !password) {
      toast.error('Please enter both email and password', { duration: 2000 });
      return false;
    }
    
    try {
      setIsLoggingIn(true);
      console.log('UserLogin: Attempting login with enhanced flow:', email);
      
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
      
      console.log('UserLogin: Login successful, user ID:', data.user.id);
      toast.success('Login successful!', { duration: 2000 });
      
      // Wait longer for auth state to fully update
      setTimeout(() => {
        const pendingAction = executePendingAction();
        if (pendingAction) {
          console.log('UserLogin: Found pending action after login, executing:', pendingAction);
        } else {
          console.log('UserLogin: No pending action, redirecting to dashboard');
          navigate('/user-dashboard', { replace: true });
        }
      }, 2000); // Increased wait time for auth state to propagate
      
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
  if (isCheckingAuth || authState?.isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Checking authentication...</span>
      </div>
    );
  }

  // If user is authenticated, show redirect message
  if (authState?.isAuthenticated && !authState?.isLoading) {
    console.log('UserLogin: User is authenticated, should redirect');
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Redirecting to dashboard...</span>
      </div>
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
              Log in or create an account to connect with experts
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
