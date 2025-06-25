
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldCheck, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AdminSession {
  id: string;
  role: string;
  timestamp: string;
}

const AdminLoginClean: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Check for existing admin session on mount
  useEffect(() => {
    const checkAdminSession = () => {
      try {
        const adminSession = localStorage.getItem('clean_admin_session');
        if (adminSession) {
          const session: AdminSession = JSON.parse(adminSession);
          const now = new Date().getTime();
          const sessionTime = new Date(session.timestamp).getTime();
          const maxAge = 8 * 60 * 60 * 1000; // 8 hours
          
          if (now - sessionTime < maxAge) {
            console.log('Valid admin session found, redirecting to dashboard');
            navigate('/admin-dashboard-clean', { replace: true });
            return;
          } else {
            localStorage.removeItem('clean_admin_session');
          }
        }
      } catch (error) {
        console.error('Error checking admin session:', error);
        localStorage.removeItem('clean_admin_session');
      }
      setIsCheckingSession(false);
    };

    checkAdminSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setIsLoading(true);

    try {
      // Check credentials against admin_users table
      const { data: adminUser, error: queryError } = await supabase
        .from('admin_users')
        .select('id, role')
        .eq('id', username.toLowerCase().trim())
        .single();

      if (queryError || !adminUser) {
        setError('Invalid credentials');
        return;
      }

      // Validate password (in production, this should be hashed)
      const validPassword = password === 'IFLadmin2024';
      
      if (!validPassword) {
        setError('Invalid credentials');
        return;
      }

      // Create clean admin session
      const adminSession: AdminSession = {
        id: adminUser.id,
        role: adminUser.role,
        timestamp: new Date().toISOString()
      };

      localStorage.setItem('clean_admin_session', JSON.stringify(adminSession));
      
      toast.success('Admin login successful');
      console.log('Admin logged in successfully:', adminUser.id);
      
      navigate('/admin-dashboard-clean', { replace: true });

    } catch (error) {
      console.error('Admin login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Checking admin session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <ShieldCheck className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Administrator Access
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Secure admin portal for iFindLife
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username">Administrator ID</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin ID"
                disabled={isLoading}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  disabled={isLoading}
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800">
              <p className="font-medium">Test Credentials:</p>
              <p>ID: iflsuperadmin</p>
              <p>Password: IFLadmin2024</p>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Logging in...
                </>
              ) : (
                'Login as Administrator'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoginClean;
