import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import CaptchaField from './CaptchaField';

interface SecureAdminLoginFormProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
  onLoginSuccess: () => void;
  isLoading?: boolean;
}

const SecureAdminLoginForm: React.FC<SecureAdminLoginFormProps> = ({
  onLogin,
  onLoginSuccess,
  isLoading = false
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  // Clear errors when inputs change
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setErrors({});
    }
  }, [username, password, captchaAnswer]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      toast.error('Too many failed attempts. Please wait before trying again.');
      return;
    }

    // Validate inputs
    const newErrors: Record<string, string> = {};
    
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }
    
    if (!captchaAnswer) {
      newErrors.captcha = 'Please solve the security question';
    }

    // Validate CAPTCHA
    const captchaAnswerElement = document.querySelector('[data-testid="captcha-answer"]') as HTMLInputElement;
    const correctAnswer = parseInt(captchaAnswerElement?.value || '0');
    
    if (captchaAnswer !== correctAnswer) {
      newErrors.captcha = 'Incorrect answer. Please try again.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      
      console.log('SecureAdminLoginForm: Attempting secure login');
      
      const success = await onLogin(username.trim(), password);
      
      if (success) {
        console.log('SecureAdminLoginForm: Login successful');
        setAttemptCount(0);
        toast.success('Login successful');
        onLoginSuccess();
      } else {
        console.log('SecureAdminLoginForm: Login failed');
        const newAttemptCount = attemptCount + 1;
        setAttemptCount(newAttemptCount);
        
        if (newAttemptCount >= 3) {
          setIsLocked(true);
          toast.error('Too many failed attempts. Access temporarily blocked.');
          
          // Unlock after 5 minutes
          setTimeout(() => {
            setIsLocked(false);
            setAttemptCount(0);
          }, 5 * 60 * 1000);
        } else {
          setErrors({
            general: `Invalid credentials. ${3 - newAttemptCount} attempts remaining.`
          });
        }
      }
    } catch (error) {
      console.error('SecureAdminLoginForm: Login error:', error);
      setErrors({
        general: 'An error occurred during login. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Security Notice */}
      <Alert className="border-blue-200 bg-blue-50">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          This is a secure administrator login. All access attempts are logged and monitored.
        </AlertDescription>
      </Alert>

      {/* General Error */}
      {errors.general && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{errors.general}</AlertDescription>
        </Alert>
      )}

      {/* Lock Warning */}
      {isLocked && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Account temporarily locked due to multiple failed attempts. Please wait 5 minutes.
          </AlertDescription>
        </Alert>
      )}

      {/* Username Field */}
      <div className="space-y-2">
        <Label htmlFor="username">Administrator Username *</Label>
        <Input
          id="username"
          type="text"
          placeholder="Enter administrator username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading || isSubmitting || isLocked}
          className={errors.username ? 'border-red-500' : ''}
          autoComplete="username"
        />
        {errors.username && (
          <p className="text-sm text-red-500">{errors.username}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password">Password *</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter secure password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading || isSubmitting || isLocked}
            className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading || isSubmitting || isLocked}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password}</p>
        )}
      </div>

      {/* CAPTCHA Field */}
      <CaptchaField
        value={captchaAnswer}
        onChange={setCaptchaAnswer}
        error={errors.captcha}
        disabled={isLoading || isSubmitting || isLocked}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || isSubmitting || isLocked}
      >
        {isLoading || isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Authenticating...
          </>
        ) : (
          <>
            <Shield className="h-4 w-4 mr-2" />
            Secure Login
          </>
        )}
      </Button>

      {/* Attempt Counter */}
      {attemptCount > 0 && !isLocked && (
        <p className="text-sm text-orange-600 text-center">
          Failed attempts: {attemptCount}/3
        </p>
      )}
    </form>
  );
};

export default SecureAdminLoginForm;