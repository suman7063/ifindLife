
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EyeOff, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/admin-auth';

interface AdminLoginFormProps {
  onLoginSuccess: () => void;
}

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ onLoginSuccess }) => {
  // Default values for testing
  const [username, setUsername] = useState('Soultribe');
  const [password, setPassword] = useState('Freesoul@99');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { login } = useAuth();

  // Reset error state after fields are changed
  useEffect(() => {
    if (loginError && (username || password)) {
      setLoginError(null);
    }
  }, [username, password, loginError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login form submitted');
    console.log('React state values:', { username, password: password.length + ' chars' });
    
    // Get values from DOM for comparison (debugging)
    const usernameInput = document.getElementById('username') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    console.log('DOM values:', {
      username: usernameInput?.value,
      password: passwordInput?.value ? passwordInput.value.length + ' chars' : 'not found'
    });
    
    // For simplicity, use the exact hardcoded values
    // These must match exactly what's in useAdminAuth.ts
    const adminUsername = 'Soultribe';
    const adminPassword = 'Freesoul@99';
    
    console.log('Will attempt login with hardcoded credentials:', { 
      username: adminUsername,
      password: `${adminPassword.length} chars`
    });
    
    console.log(`Attempting login with username: "${adminUsername}"`);
    console.log(`Password length: ${adminPassword.length}`);
    
    // Try to clear any existing sessions first
    try {
      localStorage.removeItem('admin_session');
      localStorage.removeItem('admin_username');
    } catch (err) {
      console.error('Error clearing localStorage:', err);
    }
    
    // Direct login attempt with hardcoded values
    const loginSuccess = login(adminUsername, adminPassword);
    console.log('Login result:', loginSuccess ? 'success' : 'failed');
    
    if (loginSuccess) {
      console.log('Login successful, redirecting to admin panel');
      toast.success(`Welcome back, ${adminUsername}!`);
      onLoginSuccess();
    } else {
      console.error('Login failed');
      setLoginError('Authentication failed. Please contact the system administrator.');
      toast.error('Login failed. Check browser console for detailed logs.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {loginError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{loginError}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium">
          Username
        </label>
        <Input
          id="username"
          name="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="bg-background"
          placeholder="Enter username (Soultribe)"
          autoComplete="off"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Link to="/forgot-password?type=admin" className="text-xs text-ifind-aqua hover:underline">
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-background"
            placeholder="Enter password"
            autoComplete="off"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>
      
      <div className="pt-2">
        <Button 
          type="submit" 
          className="w-full bg-ifind-teal hover:bg-ifind-aqua"
        >
          Access Admin Panel
        </Button>
      </div>
      
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
        <p className="text-sm text-amber-700">
          <strong>Admin Login Help:</strong> Username is "Soultribe" and password is "Freesoul@99" (case-sensitive)
        </p>
      </div>
    </form>
  );
};

export default AdminLoginForm;
