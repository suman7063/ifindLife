
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ExpertLoginFormProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
  isLoggingIn: boolean;
  loginError: string | null;
  setActiveTab: (tab: string) => void;
}

const ExpertLoginForm: React.FC<ExpertLoginFormProps> = ({
  onLogin,
  isLoggingIn,
  loginError,
  setActiveTab
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  
  console.log('ExpertLoginForm: Rendered - authentication only');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setFormError('Email is required');
      return;
    }
    
    if (!password) {
      setFormError('Password is required');
      return;
    }
    
    setFormError(null);
    
    console.log('ExpertLoginForm: Submit handler called with:', { email });
    
    try {
      if (typeof onLogin !== 'function') {
        console.error('ExpertLoginForm: onLogin is not a function', typeof onLogin);
        setFormError('Authentication service unavailable');
        return;
      }
      
      await onLogin(email, password);
    } catch (error) {
      console.error('ExpertLoginForm: Error in submit handler:', error);
      setFormError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      {(loginError || formError) && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>{loginError || formError}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="expert-email">Email</Label>
          <Input
            id="expert-email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFormError(null);
            }}
            required
            disabled={isLoggingIn}
            className="bg-white"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="expert-password">Password</Label>
            <Link 
              to="/forgot-password" 
              className="text-xs text-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <Input
            id="expert-password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setFormError(null);
            }}
            required
            disabled={isLoggingIn}
            className="bg-white"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoggingIn || !email || !password}
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>
      
      <div className="text-center text-sm mt-4">
        <p className="text-muted-foreground">
          Don't have an expert account?{' '}
          <button
            onClick={() => setActiveTab('register')}
            className="text-primary font-medium hover:underline cursor-pointer"
          >
            Register here
          </button>
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Looking to access your user account?{' '}
          <Link to="/user-login" className="text-primary hover:underline">
            User Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ExpertLoginForm;
