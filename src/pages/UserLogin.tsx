
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useUserAuth } from '@/hooks/useUserAuth';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.path || '/';

  // Use the correct function names from UserAuthContext
  const { login, signup } = useUserAuth();
  
  // Update the handleLogin function
  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const success = await login(email, password);
      
      if (success) {
        navigate(redirectPath || '/');
        toast.success('Login successful');
      } else {
        toast.error('Login failed');
      }
    } catch (error) {
      toast.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  // Update the handleRegister function
  const handleRegister = async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    country: string;
    city: string;
    referralCode?: string;
  }) => {
    setLoading(true);
    try {
      const success = await signup(userData);
      
      if (success) {
        navigate('/');
        toast.success('Registration successful!');
      } else {
        toast.error('Registration failed');
      }
    } catch (error) {
      toast.error('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">User Login</CardTitle>
          <CardDescription className="text-center">Enter your email and password to login</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button onClick={() => handleLogin(email, password)} className="bg-blue-500 text-white" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          <div className="text-sm text-center">
            Don't have an account? <Link to="/signup" className="text-blue-500">Sign up</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserLogin;
