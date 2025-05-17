
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticate, navigation } from '@/modules/authentication';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const UserLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check for existing session on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('UserLogin: Checking for existing session...');
        const result = await authenticate.checkSession();
        
        if (result.isAuthenticated) {
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
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    try {
      setIsLoading(true);
      console.log('UserLogin: Attempting login with:', email);
      
      const result = await authenticate.userLogin(email, password);
      
      if (!result.success) {
        const errorMessage = result.error?.message || 'Login failed';
        console.error('UserLogin: Login error:', errorMessage);
        toast.error(errorMessage);
        return;
      }
      
      toast.success('Login successful!');
      console.log('UserLogin: Login successful, redirecting to dashboard...');
      
      // Navigate to dashboard
      navigate(navigation.redirects.afterLogin, { replace: true });
      
    } catch (error: any) {
      console.error('UserLogin: Login error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
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
      <div className="py-8 md:py-12 bg-gray-50 min-h-screen">
        <div className="container mx-auto max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle>User Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={isLoading}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">Password</label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    disabled={isLoading}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    'Log in'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserLogin;
