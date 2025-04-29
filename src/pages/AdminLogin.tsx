
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EyeOff, Eye, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/common/PageHeader';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AdminLogin = () => {
  const [username, setUsername] = useState('Soultribe'); // Pre-filled for debugging
  const [password, setPassword] = useState('Freesoul@99'); // Pre-filled for debugging
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Refs to store input values directly from DOM
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  
  const renderCount = useRef(0);
  renderCount.current++;

  console.log(`AdminLogin component rendered (${renderCount.current}), isAuthenticated:`, isAuthenticated);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      console.log('User is already authenticated, redirecting to admin panel');
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  // Reset error state after fields are changed
  useEffect(() => {
    if (loginError && (username || password)) {
      setLoginError(null);
    }
  }, [username, password, loginError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login form submitted');
    
    // Get values directly from DOM as an additional check
    const domUsername = usernameRef.current?.value || '';
    const domPassword = passwordRef.current?.value || '';
    
    console.log('React state values:', { username, password: password ? '****' : '' });
    console.log('DOM values:', { username: domUsername, password: domPassword ? '****' : '' });
    
    // Use DOM values if they differ from state (just in case of sync issues)
    const finalUsername = domUsername || username;
    const finalPassword = domPassword || password;
    
    // Input validation
    if (!finalUsername.trim()) {
      setLoginError('Username is required');
      return;
    }
    
    if (!finalPassword) {
      setLoginError('Password is required');
      return;
    }
    
    // Debug log to track exact values
    console.log('Attempting login with username:', JSON.stringify(finalUsername));
    console.log('Password length:', finalPassword.length);
    
    // Try to clear any existing sessions first
    try {
      localStorage.removeItem('admin_session');
      localStorage.removeItem('admin_username');
    } catch (err) {
      console.error('Error clearing localStorage:', err);
    }
    
    // Use a timeout to ensure the UI updates before login attempt
    setTimeout(() => {
      const loginSuccess = login(finalUsername, finalPassword);
      console.log('Login result:', loginSuccess ? 'success' : 'failed');
      
      if (loginSuccess) {
        console.log('Login successful, redirecting to admin panel');
        toast.success(`Welcome back, ${finalUsername}!`);
        navigate('/admin');
      } else {
        console.error('Login failed');
        setLoginError('Invalid username or password. Please verify your credentials are correct.');
        toast.error('Login failed. Please check your credentials and try again.');
      }
    }, 10);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageHeader 
        title="Admin Access" 
        subtitle="Secure login for system administrators" 
      />
      <main className="flex-1 py-10 flex items-center justify-center">
        <div className="container max-w-md">
          <div className="bg-background/95 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-ifind-teal/10">
            <div className="flex items-center justify-center mb-6">
              <ShieldAlert className="h-12 w-12 text-ifind-teal" />
            </div>
            <h1 className="text-2xl font-bold text-center mb-6">Admin Access</h1>
            
            {loginError && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{loginError}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  ref={usernameRef}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-background"
                  placeholder="Enter username (Soultribe)"
                  autoComplete="off"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Link to="/forgot-password?type=admin" className="text-xs text-ifind-aqua hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    ref={passwordRef}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-background"
                    placeholder="Enter password"
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full bg-ifind-teal hover:bg-ifind-aqua"
                >
                  Access Admin Panel
                </Button>
              </div>
              
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-sm text-amber-700">
                  <strong>Admin Login Help:</strong> Username is "Soultribe" and password is "Freesoul@99" (case-sensitive)
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLogin;
