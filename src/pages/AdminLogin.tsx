
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EyeOff, Eye, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/common/PageHeader';
import { toast } from 'sonner';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempted, setLoginAttempted] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  console.log('AdminLogin component rendered, isAuthenticated:', isAuthenticated);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      console.log('User is already authenticated, redirecting to admin panel');
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  // Reset error state after fields are changed
  useEffect(() => {
    if (loginAttempted) {
      setLoginAttempted(false);
    }
  }, [username, password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Attempting login with username:', username);
    setLoginAttempted(true);
    
    // Always show the default credentials help on first attempt
    
    if (login(username, password)) {
      console.log('Login successful, redirecting to admin panel');
      toast.success(`Welcome back, ${username}!`);
      navigate('/admin');
    } else {
      console.error('Login failed');
      toast.error('Invalid username or password');
      // Show the credentials reminder when login fails
      setLoginAttempted(true);
    }
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
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-background"
                  placeholder="Enter username"
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
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-background"
                    placeholder="Enter password"
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
              
              {/* Always display the credentials for easy testing */}
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
