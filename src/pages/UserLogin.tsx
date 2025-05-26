
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import UserLoginTabs from '@/components/auth/UserLoginTabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const UserLogin: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Check for existing session on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('UserLogin: Checking for existing session...');
        const { data } = await supabase.auth.getSession();
        
        if (data.session?.user) {
          console.log('UserLogin: Existing session found, redirecting to dashboard');
          // Make sure the redirect actually happens
          navigate('/user-dashboard', { replace: true });
          return;
        }
        
        console.log('UserLogin: No existing session found');
      } catch (error) {
        console.error('UserLogin: Error checking session:', error);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    
    checkSession();
  }, [navigate]);

  // Handle login form submission
  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    if (!email || !password) {
      toast.error('Please enter both email and password', {
        duration: 2000
      });
      return false;
    }
    
    try {
      setIsLoggingIn(true);
      console.log('UserLogin: Attempting login with:', email);
      
      // First check if user exists in the users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();
        
      if (userError) {
        console.error('UserLogin: Error checking user:', userError);
        toast.error('An error occurred while checking user', {
          duration: 2000
        });
        return false;
      }
      
      // Proceed with login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('UserLogin: Login error:', error);
        toast.error(error.message || 'Invalid email or password', {
          duration: 2000
        });
        return false;
      }
      
      if (!data.user || !data.session) {
        toast.error('Login failed. Please try again.', {
          duration: 2000
        });
        return false;
      }
      
      // Set session type
      localStorage.setItem('sessionType', 'user');
      
      toast.success('Login successful!', {
        duration: 2000
      });
      
      console.log('UserLogin: Login successful, navigating to dashboard');
      // Make sure the redirect actually happens
      navigate('/user-dashboard', { replace: true });
      
      return true;
    } catch (error: any) {
      console.error('UserLogin: Login error:', error);
      toast.error('An unexpected error occurred', {
        duration: 2000
      });
      return false;
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Checking authentication...</span>
      </div>
    );
  }
  
  return (
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
  );
};

export default UserLogin;
