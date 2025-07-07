
// ✅ CLEAN ADMIN LOGIN - ISOLATED FROM UNIFIED SYSTEM
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuthClean } from '@/contexts/AdminAuthClean';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldCheck, Eye, EyeOff, Loader2 } from 'lucide-react';

const AdminLoginClean: React.FC = () => {
  const navigate = useNavigate();
  const adminAuth = useAdminAuthClean();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log('🔒 AdminLoginClean: Using correct useAdminAuthClean hook:', {
    hasAdminAuth: !!adminAuth,
    isAuthenticated: adminAuth?.isAuthenticated,
    isLoading: adminAuth?.isLoading,
    error: adminAuth?.error
  });

  // Clear any conflicting auth sessions on mount
  useEffect(() => {
    console.log('🔒 AdminLoginClean: Clearing conflicting auth sessions');
    // Clear expert and user sessions to prevent conflicts
    localStorage.removeItem('sb-nmcqyudqvbldxwzhyzma-auth-token');
    localStorage.removeItem('expert_session');
    localStorage.removeItem('user_session');
  }, []);

  // SAFETY: Only render on admin routes
  if (!window.location.pathname.startsWith('/admin')) {
    console.log('🔒 AdminLoginClean: Not on admin route, not rendering');
    return null;
  }

  // Redirect if already authenticated
  useEffect(() => {
    if (adminAuth?.isAuthenticated) {
      console.log('✅ AdminLoginClean: Already authenticated, redirecting to dashboard');
      navigate('/admin/overview', { replace: true });
    }
  }, [adminAuth?.isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminAuth) {
      console.error('❌ AdminLoginClean: No admin auth context available');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('🔒 AdminLoginClean: Attempting login with isolated admin system');
      const success = await adminAuth.login(formData.email, formData.password);
      
      if (success) {
        console.log('✅ AdminLoginClean: Login successful with isolated admin system');
        // Redirect happens in useEffect when isAuthenticated becomes true
      } else {
        console.log('❌ AdminLoginClean: Login failed');
      }
    } catch (error) {
      console.error('❌ AdminLoginClean: Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (adminAuth?.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
          <p className="mt-4 text-gray-600">Loading iFindLife Admin (Clean Auth System)...</p>
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
            iFindLife Admin
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Clean Authentication System (Isolated)
          </p>
          <p className="text-xs text-blue-600 mt-1">
            ✅ Using useAdminAuthClean hook
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {adminAuth?.error && (
              <Alert variant="destructive">
                <AlertDescription>{adminAuth.error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Administrator ID</Label>
              <Input
                id="email"
                type="text"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter admin ID"
                disabled={isSubmitting}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter password"
                  disabled={isSubmitting}
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isSubmitting}
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
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                'Admin Login (Clean System)'
              )}
            </Button>
            
            <div className="text-center text-xs text-gray-500 space-y-1">
              <p>✅ Isolated admin authentication system</p>
              <p>✅ No interference with user/expert auth</p>
              <p>✅ Complete separation of concerns</p>
              <p>✅ Using correct useAdminAuthClean hook</p>
              <p className="text-blue-600">Old system: /admin-login (separate auth)</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoginClean;
