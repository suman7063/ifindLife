import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Mail, Lock, User, Phone, Stethoscope } from 'lucide-react';

export const ExpertSignupScreen: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    specialization: ''
  });

  const handleSignup = () => {
    // Mock signup - just navigate to login
    navigate('/mobile-app/expert-auth/login');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-ifind-teal/10 via-ifind-aqua/10 to-ifind-purple/10">
      {/* Header */}
      <div className="p-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/mobile-app/expert-auth/login')}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center p-6 pb-10">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-ifind-teal to-ifind-aqua rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Stethoscope className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-poppins font-bold text-ifind-charcoal mb-2">
            Become an Expert
          </h1>
          <p className="text-muted-foreground">
            Join our community of professionals
          </p>
        </div>

        <Card className="border-border/50 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl">Create Account</CardTitle>
            <CardDescription>Fill in your details to get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Dr. Sarah Johnson"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="expert@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <div className="relative">
                <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="specialization"
                  placeholder="e.g., Anxiety & Stress Management"
                  value={formData.specialization}
                  onChange={(e) => setFormData({...formData, specialization: e.target.value})}
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
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="pl-10"
                />
              </div>
            </div>

            <Button 
              className="w-full bg-gradient-to-r from-ifind-teal to-ifind-aqua hover:from-ifind-teal/90 hover:to-ifind-aqua/90"
              onClick={handleSignup}
            >
              Create Account
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/mobile-app/expert-auth/login')}
                className="text-ifind-teal font-medium hover:underline"
              >
                Login
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
