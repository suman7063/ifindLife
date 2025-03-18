import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserAuth } from '@/hooks/useUserAuth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { ReferralSettings } from '@/types/supabase/referrals';
import { getReferralSettings } from '@/utils/referralUtils';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [referralSettings, setReferralSettings] = useState<ReferralSettings | null>(null);
  const navigate = useNavigate();
  const { signUp, logIn } = useUserAuth();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp(email, password);
      toast.success('Signed up successfully! Please verify your email.');
      navigate('/profile');
    } catch (error: any) {
      console.error('Signup failed:', error.message);
      toast.error(`Signup failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await logIn(email, password);
      toast.success('Logged in successfully!');
      navigate('/profile');
    } catch (error: any) {
      console.error('Login failed:', error.message);
      toast.error(`Login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Load referral settings for the registration form
  useEffect(() => {
    const loadReferralSettings = async () => {
      try {
        const settings = await getReferralSettings();
        setReferralSettings(settings || {
          id: '',
          referrerReward: 10,
          referredReward: 5,
          active: true,
          description: 'Default referral program'
        });
      } catch (error) {
        console.error('Error loading referral settings:', error);
      }
    };

    loadReferralSettings();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-4">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">User Login</CardTitle>
          <CardDescription className="text-center">Enter your email and password to sign in</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleLogin}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full mt-4 bg-ifind-aqua hover:bg-ifind-teal" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>
          <div className="text-sm text-center">
            Don't have an account?{' '}
            <Link to="/register" className="text-ifind-aqua hover:underline">
              Sign Up
            </Link>
          </div>
          <div className="text-sm text-center">
            Forgot password?{' '}
            <Link to="/forgot-password" className="text-ifind-aqua hover:underline">
              Reset Password
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserLogin;
