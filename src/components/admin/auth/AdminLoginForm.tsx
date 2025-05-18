
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/admin-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AdminLoginFormProps {
  onLoginSuccess: () => void;
  onLogin?: (username: string, password: string) => Promise<boolean>;
  isLoading?: boolean;
}

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ 
  onLoginSuccess, 
  onLogin, 
  isLoading = false 
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { login: contextLogin } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  console.log('AdminLoginForm rendered', {
    hasProvidedLoginFunction: typeof onLogin === 'function',
    hasContextLoginFunction: typeof contextLogin === 'function'
  });

  useEffect(() => {
    // Clear error message when user changes inputs
    if (errorMessage) {
      setErrorMessage(null);
    }
  }, [username, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    if (!username || !password) {
      setErrorMessage('Please enter both username and password');
      return;
    }
    
    // Debug logs
    console.log('Admin login form submitted with username:', username);
    console.log('Available login methods:', {
      propLogin: !!onLogin, 
      contextLogin: !!contextLogin
    });
    
    try {
      setIsSubmitting(true);
      let success = false;
      
      // First try to use the provided login function
      if (typeof onLogin === 'function') {
        success = await onLogin(username, password);
        console.log('Using provided login function, result:', success);
      } 
      // Fall back to context login if provided login fails or doesn't exist
      else if (typeof contextLogin === 'function') {
        success = await contextLogin(username, password);
        console.log('Using context login function, result:', success);
      }
      // No login function available
      else {
        console.error('No login function available');
        setErrorMessage('Authentication service is not available');
        return;
      }
      
      if (success) {
        toast.success('Successfully logged in as administrator');
        onLoginSuccess(); 
      } else {
        // Login failed - show error
        setErrorMessage('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An error occurred during login');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="admin-username">Username</Label>
        <Input
          id="admin-username"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={isLoading || isSubmitting}
          autoComplete="username"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="admin-password">Password</Label>
        <div className="relative">
          <Input
            id="admin-password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading || isSubmitting}
            autoComplete="current-password"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={toggleShowPassword}
            tabIndex={-1} // Don't affect form tab sequence
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || isSubmitting}
      >
        {isLoading || isSubmitting ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
};

export default AdminLoginForm;
