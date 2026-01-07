import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { emailSchema } from '@/utils/validationSchemas';

interface UserLoginTabsProps {
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  isLoggingIn: boolean;
}

const UserLoginTabs: React.FC<UserLoginTabsProps> = ({ onLogin, isLoggingIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const validateEmail = (emailValue: string) => {
    const validation = emailSchema.safeParse(emailValue);
    if (!validation.success) {
      // Get first error message
      const firstError = validation.error.errors[0];
      setEmailError(firstError.message);
      return false;
    }
    setEmailError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    
    // Validate email before submitting
    if (!validateEmail(email)) {
      return;
    }
    
    const result = await onLogin(email, password);
    if (!result.success && result.error) {
      setLoginError(result.error);
    }
  };

  return (
    <Tabs defaultValue="login" className="w-full">
      <TabsList className="grid w-full grid-cols-1">
        <TabsTrigger value="login">Login</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          {/* Hidden dummy fields to prevent browser autofill */}
          <input type="text" name="fake-username" autoComplete="off" style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }} tabIndex={-1} />
          <input type="password" name="fake-password" autoComplete="off" style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }} tabIndex={-1} />
          
          {loginError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="login-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setLoginError(null);
                setEmailError(null);
                // Validate on change if there was an error
                if (emailError) {
                  validateEmail(e.target.value);
                }
              }}
              onBlur={(e) => {
                validateEmail(e.target.value);
              }}
              onFocus={(e) => {
                e.target.removeAttribute('readOnly');
              }}
              placeholder="Enter your email"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
              readOnly
              disabled={isLoggingIn}
              required
              className={emailError ? 'border-red-500' : ''}
            />
            {emailError && (
              <p className="text-sm text-red-500 mt-1">{emailError}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="login-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setLoginError(null);
              }}
              onFocus={(e) => {
                e.target.removeAttribute('readOnly');
              }}
              placeholder="Enter your password"
              autoComplete="new-password"
              readOnly
              disabled={isLoggingIn}
              required
            />
          </div>
          <div className="text-right">
            <Link to="/forgot-password?userType=user" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <Button type="submit" className="w-full" disabled={isLoggingIn}>
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Log in'
            )}
          </Button>
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link to="/user-signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </form>
      </TabsContent>
    </Tabs>
  );
};

export default UserLoginTabs;