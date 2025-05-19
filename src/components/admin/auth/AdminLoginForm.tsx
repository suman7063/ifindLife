
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/admin-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { testCredentials } from '@/contexts/admin-auth/constants';

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
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
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
    setDebugInfo(null);
    
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
      
      // Debug the credentials being used
      setDebugInfo(`Attempting login with username: "${username}" and password: "${password}"`);
      
      // First try to use the provided login function
      if (typeof onLogin === 'function') {
        console.log(`Trying onLogin with username: "${username}" and password length: ${password.length}`);
        
        // For debugging - show expected password for test accounts
        const normalizedUsername = username.toLowerCase();
        if (normalizedUsername === 'admin' || 
            normalizedUsername === 'superadmin' || 
            normalizedUsername === 'iflsuperadmin') {
          let expectedPassword = '';
          if (normalizedUsername === 'admin') {
            expectedPassword = testCredentials.admin.password;
          } else if (normalizedUsername === 'superadmin') {
            expectedPassword = testCredentials.superadmin.password;
          } else if (normalizedUsername === 'iflsuperadmin') {
            expectedPassword = testCredentials.iflsuperadmin.password;
          }
          console.log(`DEBUG - Expected password for ${normalizedUsername}: "${expectedPassword}"`);
          console.log(`DEBUG - Password match: ${password === expectedPassword ? 'YES' : 'NO'}`);
        }
        
        success = await onLogin(username, password);
        console.log('Using provided login function, result:', success);
      } 
      // Fall back to context login if provided login fails or doesn't exist
      else if (typeof contextLogin === 'function') {
        console.log(`Trying contextLogin with username: "${username}" and password length: ${password.length}`);
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
        // Login failed - show error with helpful information
        setErrorMessage('Login failed. Please check your credentials and try again.');
        
        // Add more helpful debug info
        const normalizedUsername = username.toLowerCase();
        if (normalizedUsername === 'admin' || 
            normalizedUsername === 'superadmin' || 
            normalizedUsername === 'iflsuperadmin') {
          const credentials = {
            admin: testCredentials.admin,
            superadmin: testCredentials.superadmin,
            iflsuperadmin: testCredentials.iflsuperadmin
          };
          
          const testAccount = Object.entries(credentials).find(
            ([key]) => key.toLowerCase() === normalizedUsername
          );
          
          if (testAccount) {
            setDebugInfo(`For this test account "${normalizedUsername}", try the password: "${testAccount[1].password}"`);
          }
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An error occurred during login');
      setDebugInfo(`Error details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Provide helper text for testing
  const getHelperText = () => {
    return (
      <div className="text-xs text-muted-foreground mt-2">
        <p>For testing, try these credentials:</p>
        <p>- Username: <strong>{testCredentials.admin.username}</strong>, Password: <strong>{testCredentials.admin.password}</strong></p>
        <p>- Username: <strong>{testCredentials.superadmin.username}</strong>, Password: <strong>{testCredentials.superadmin.password}</strong></p>
        <p>- Username: <strong>{testCredentials.iflsuperadmin.username}</strong>, Password: <strong>{testCredentials.iflsuperadmin.password}</strong></p>
      </div>
    );
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
      
      {debugInfo && (
        <Alert>
          <AlertDescription className="text-amber-600">
            {debugInfo}
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
      {getHelperText()}
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
