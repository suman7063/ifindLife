import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Mail, Lock, Stethoscope } from 'lucide-react';

export const ExpertLoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Mock login - just navigate to dashboard
    navigate('/mobile-app/expert-app');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-ifind-teal/10 via-ifind-aqua/10 to-ifind-purple/10">
      {/* Header */}
      <div className="p-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/')}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center p-6">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-ifind-teal to-ifind-aqua rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Stethoscope className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-poppins font-bold text-ifind-charcoal mb-2">
            Expert Login
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Log in to manage your consultations
          </p>
        </div>

        <Card className="border-border/50 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl">Sign In</CardTitle>
            <CardDescription>Enter your credentials to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="expert@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Button 
              className="w-full bg-gradient-to-r from-ifind-teal to-ifind-aqua hover:from-ifind-teal/90 hover:to-ifind-aqua/90"
              onClick={handleLogin}
            >
              Login
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/mobile-app/expert-auth/signup')}
                className="text-ifind-teal font-medium hover:underline"
              >
                Sign up
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
