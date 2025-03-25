
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import LoginForm from '@/components/auth/LoginForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

export const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if user is coming from email verification
  const queryParams = new URLSearchParams(location.search);
  const verified = queryParams.get('verified') === 'true';

  useEffect(() => {
    if (verified) {
      toast.success('Email verified successfully! You can now log in.');
    }
  }, [verified]);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Login successful');
      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    try {
      setSocialLoading(provider);
      let { error } = await supabase.auth.signInWithOAuth({ 
        provider,
        options: {
          redirectTo: `${window.location.origin}`
        }
      });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error(`${provider} login error:`, error);
      toast.error(`Error logging in with ${provider}: ${error.message}`);
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-16 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Login to iFindLife</CardTitle>
            <CardDescription>
              Sign in to access all features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="social">Social Login</TabsTrigger>
              </TabsList>
              
              <TabsContent value="email">
                <LoginForm onLogin={handleLogin} loading={isLoading} />
              </TabsContent>
              
              <TabsContent value="social">
                <div className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center space-x-2" 
                    onClick={() => handleSocialLogin('google')}
                    disabled={!!socialLoading}
                  >
                    {socialLoading === 'google' ? (
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    ) : (
                      <img src="/lovable-uploads/e973bbdf-7ff5-43b6-9c67-969efbc55fa4.png" alt="Google" className="h-5 w-5 mr-2" />
                    )}
                    <span>Continue with Google</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center space-x-2" 
                    onClick={() => handleSocialLogin('facebook')}
                    disabled={!!socialLoading}
                  >
                    {socialLoading === 'facebook' ? (
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    ) : (
                      <img src="/lovable-uploads/6fdf43ed-732a-4659-a397-a7d061440bc2.png" alt="Facebook" className="h-5 w-5 mr-2" />
                    )}
                    <span>Continue with Facebook</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center space-x-2" 
                    onClick={() => handleSocialLogin('apple')}
                    disabled={!!socialLoading}
                  >
                    {socialLoading === 'apple' ? (
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    ) : (
                      <img src="/lovable-uploads/55b74deb-7ab0-4410-a3db-d3706db1d19a.png" alt="Apple" className="h-5 w-5 mr-2" />
                    )}
                    <span>Continue with Apple</span>
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center mt-2">
              Don't have an account?{' '}
              <Link 
                to="/user-login" 
                className="text-ifind-aqua hover:text-ifind-teal"
              >
                Register here
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
