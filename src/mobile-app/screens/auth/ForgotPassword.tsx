import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail, ArrowRight } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, send password reset email
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col h-screen bg-background p-6">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/mobile-app/auth/login')}
            className="mr-2 p-1"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 flex flex-col justify-center text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="h-8 w-8 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-poppins font-bold text-ifind-charcoal mb-4">
            Check Your Email
          </h1>
          
          <p className="text-muted-foreground mb-2">
            We've sent password reset instructions to:
          </p>
          <p className="text-ifind-aqua font-medium mb-8">
            {email}
          </p>
          
          <div className="space-y-4">
            <Button 
              onClick={() => navigate('/mobile-app/auth/login')}
              className="w-full bg-gradient-to-r from-ifind-aqua to-ifind-teal hover:opacity-90 text-white py-6"
            >
              Back to Sign In
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost"
              onClick={() => setIsSubmitted(false)}
              className="w-full text-ifind-aqua"
            >
              Didn't receive email? Try again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background p-6">
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mr-2 p-1"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-poppins font-bold text-ifind-charcoal mb-2">
            Reset Password
          </h1>
          <p className="text-muted-foreground">
            Enter your email to receive reset instructions
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-ifind-aqua to-ifind-teal hover:opacity-90 text-white py-6"
          >
            Send Reset Instructions
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            Remember your password?{' '}
            <Button
              variant="ghost"
              onClick={() => navigate('/mobile-app/auth/login')}
              className="text-ifind-aqua p-0 h-auto font-normal"
            >
              Sign In
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};