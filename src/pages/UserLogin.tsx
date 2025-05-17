
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import UserLoginTabs from '@/components/auth/UserLoginTabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
        
        if (data.session) {
          console.log('UserLogin: Existing session found, redirecting to dashboard');
          navigate('/user-dashboard', { replace: true });
        }
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
      toast.error('Please enter both email and password');
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
        console.error('Error checking user:', userError);
        toast.error('An error occurred while checking user');
        return false;
      }
      
      // Proceed with login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login error:', error);
        toast.error(error.message || 'Invalid email or password');
        return false;
      }
      
      if (!data.user || !data.session) {
        toast.error('Login failed. Please try again.');
        return false;
      }
      
      // Set session type
      localStorage.setItem('sessionType', 'user');
      
      toast.success('Login successful!');
      
      // Navigate to dashboard
      navigate('/user-dashboard', { replace: true });
      
      return true;
    } catch (error: any) {
      console.error('UserLogin: Login error:', error);
      toast.error('An unexpected error occurred');
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
