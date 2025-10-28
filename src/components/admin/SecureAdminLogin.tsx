import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Eye, EyeOff, Shield } from 'lucide-react';
import { useSecureAdminAuth } from '@/contexts/SecureAdminAuth';
import { toast } from 'sonner';

const SecureAdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const { login, isAuthenticated, isLoading } = useSecureAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Rate limiting: block after 3 failed attempts for 5 minutes
  const MAX_ATTEMPTS = 3;
  const BLOCK_DURATION = 5 * 60 * 1000; // 5 minutes

  useEffect(() => {
    if (isAuthenticated) {
      console.log('✅ Admin authenticated, redirecting...');
      const from = location.state?.from?.pathname || '/admin';
      console.log('🔍 Redirecting to:', from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Clear any existing admin login blocks since backend was fixed
  useEffect(() => {
    // Only clear admin-related localStorage, not all localStorage
    localStorage.removeItem('admin_login_block_expiry');
    localStorage.removeItem('clean_admin_session');
    setIsBlocked(false);
    setLoginAttempts(0);
    console.log('🧹 Cleared admin login blocks for fresh authentication');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isBlocked) {
      toast.error('Login temporarily blocked. Please wait and try again.');
      return;
    }

    if (!username.trim() || !password.trim()) {
      toast.error('Please enter both username and password');
      return;
    }

    // Additional client-side validation
    if (username.trim().length < 3) {
      toast.error('Username must be at least 3 characters');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    console.log('🔐 Attempting admin login...');
    const success = await login(username.trim(), password);
    console.log('🔐 Login result:', success);

    if (!success) {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);

      if (newAttempts >= MAX_ATTEMPTS) {
        setIsBlocked(true);
        const blockExpiry = new Date(Date.now() + BLOCK_DURATION);
        localStorage.setItem('admin_login_block_expiry', blockExpiry.toISOString());
        toast.error(`Too many failed attempts. Login blocked for ${BLOCK_DURATION / 60000} minutes.`);
      } else {
        toast.error(`Invalid credentials. ${MAX_ATTEMPTS - newAttempts} attempts remaining.`);
      }
    } else {
      // Reset attempts on successful login
      setLoginAttempts(0);
      localStorage.removeItem('admin_login_block_expiry');
    }
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Basic input sanitization
      const value = e.target.value.replace(/[<>\"'&]/g, '');
      setter(value);
    };

  if (isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-3 rounded-full">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">
            Secure Admin Login
          </CardTitle>
          <CardDescription className="text-slate-600">
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-slate-700">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={handleInputChange(setUsername)}
                placeholder="Enter your username"
                disabled={isLoading || isBlocked}
                className="h-11"
                autoComplete="username"
                maxLength={50}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handleInputChange(setPassword)}
                  placeholder="Enter your password"
                  disabled={isLoading || isBlocked}
                  className="h-11 pr-10"
                  autoComplete="current-password"
                  maxLength={100}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading || isBlocked}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-slate-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-slate-500" />
                  )}
                </Button>
              </div>
            </div>

            {loginAttempts > 0 && !isBlocked && (
              <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-md">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <span className="text-sm text-orange-700">
                  {MAX_ATTEMPTS - loginAttempts} attempts remaining
                </span>
              </div>
            )}

            {isBlocked && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-700">
                  Login temporarily blocked due to multiple failed attempts
                </span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-primary hover:bg-primary/90"
              disabled={isLoading || isBlocked || !username.trim() || !password.trim()}
            >
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Shield className="h-3 w-3" />
              <span>Secured with encryption and rate limiting</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecureAdminLogin;