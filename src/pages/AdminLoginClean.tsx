
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
import ReCAPTCHA from 'react-google-recaptcha';

const AdminLoginClean: React.FC = () => {
  const navigate = useNavigate();
  const adminAuth = useAdminAuthClean();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);

  // Test site key - replace with real key in production
  const RECAPTCHA_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';


  // Clear any conflicting auth sessions on mount
  useEffect(() => {
    const clearAllSessions = async () => {
      console.log('🔒 AdminLoginClean: Clearing ALL conflicting auth sessions');
      
      // Clear all localStorage auth tokens
      localStorage.removeItem('sb-nmcqyudqvbldxwzhyzma-auth-token');
      localStorage.removeItem('expert_session');
      localStorage.removeItem('user_session');
      
      // Clear all possible Supabase session data
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.includes('supabase') || key.includes('auth') || key.includes('session')) {
          localStorage.removeItem(key);
        }
      });

      // Force clear any active Supabase session
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        await supabase.auth.signOut({ scope: 'local' });
        console.log('🔒 AdminLoginClean: Supabase session cleared');
      } catch (error) {
        console.log('🔒 AdminLoginClean: Supabase clear error (ignored):', error);
      }
    };

    clearAllSessions();
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

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminAuth) {
      console.error('❌ AdminLoginClean: No admin auth context available');
      return;
    }

    if (!captchaValue) {
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await adminAuth.login(formData.email, formData.password);
      
      if (success) {
        // Redirect happens in useEffect when isAuthenticated becomes true
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
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Loading iFindLife Admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <ShieldCheck className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            iFindLife Admin Portal
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Secure Administrator Access
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
            
            <div className="space-y-2">
              <Label>Security Verification</Label>
              <ReCAPTCHA
                sitekey={RECAPTCHA_SITE_KEY}
                onChange={handleCaptchaChange}
                onExpired={() => setCaptchaValue(null)}
              />
              {!captchaValue && (
                <p className="text-sm text-destructive">Please complete the security verification</p>
              )}
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !captchaValue}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Authenticating...
                </>
              ) : (
                'Secure Admin Login'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoginClean;
