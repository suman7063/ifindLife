
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authenticate, navigation } from '@/modules/authentication';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mail, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const UserLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

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
            <Link to="/user-register" className="flex-1 py-3 text-center font-medium">
              Register
            </Link>
          </div>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
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
                  <Link to="/forgot-password" className="text-xs text-sky-500 hover:text-sky-600">
                    Forgot password?
                  </Link>
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
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default UserLogin;
