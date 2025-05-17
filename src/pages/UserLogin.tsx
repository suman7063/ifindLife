
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mail, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RegisterTab from '@/components/auth/RegisterTab';

const UserLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [loginError, setLoginError] = useState<string | null>(null);

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
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    
    if (!email || !password) {
      setLoginError('Please enter both email and password');
      return;
    }
    
    try {
      setIsLoading(true);
      console.log('UserLogin: Attempting login with:', email);
      
      // First check if user exists in the users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();
        
      if (userError) {
        console.error('Error checking user:', userError);
        setLoginError('An error occurred while checking user');
        return;
      }
      
      if (!userData) {
        setLoginError('No account found with this email address');
        return;
      }
      
      // Proceed with login if user exists
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login error:', error);
        setLoginError(error.message || 'Invalid email or password');
        return;
      }
      
      if (!data.user || !data.session) {
        setLoginError('Login failed. Please try again.');
        return;
      }
      
      // Set session type
      localStorage.setItem('sessionType', 'user');
      
      toast.success('Login successful!');
      
      // Navigate to dashboard
      navigate('/user-dashboard', { replace: true });
      
    } catch (error: any) {
      console.error('UserLogin: Login error:', error);
      setLoginError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold">User Login</CardTitle>
            <p className="text-muted-foreground mt-2">Access your iFind account to connect with experts</p>
          </CardHeader>
          
          <div className="flex border-b mb-4">
            <button 
              className={`flex-1 py-3 text-center font-medium ${activeTab === 'login' ? 'border-b-2 border-primary' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button 
              className={`flex-1 py-3 text-center font-medium ${activeTab === 'register' ? 'border-b-2 border-primary' : ''}`}
              onClick={() => setActiveTab('register')}
            >
              Register
            </button>
          </div>
          
          <CardContent>
            {activeTab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                {loginError && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                    {loginError}
                  </div>
                )}
                
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">Email Address</label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="pl-10"
                      disabled={isLoading}
                      required
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="password" className="block text-sm font-medium">Password</label>
                    <a href="/forgot-password" className="text-xs text-sky-500 hover:text-sky-600">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pr-10"
                      disabled={isLoading}
                      required
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={togglePasswordVisibility}
                      tabIndex={-1}
                    >
                      {showPassword ? 
                        <EyeOff className="h-4 w-4 text-gray-400" /> : 
                        <Eye className="h-4 w-4 text-gray-400" />
                      }
                    </button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            ) : (
              <RegisterTab />
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default UserLogin;
