import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSecureAdminAuth } from '@/contexts/admin-auth/SecureAdminAuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock } from 'lucide-react';
import { toast } from 'sonner';
import SecureAdminLoginForm from '@/components/admin/auth/SecureAdminLoginForm';

const SecureAdminLogin: React.FC = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { isAuthenticated, currentUser, isLoading, login } = useSecureAdminAuth();
  const navigate = useNavigate();

  console.log('SecureAdminLogin: Current auth state:', {
    isAuthenticated,
    hasCurrentUser: !!currentUser,
    isLoading,
    currentUserUsername: currentUser?.username
  });

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && isAuthenticated && currentUser) {
      console.log('SecureAdminLogin: User is already authenticated as admin, redirecting to admin panel');
      navigate('/admin');
    }
  }, [isAuthenticated, navigate, currentUser, isLoading]);

  const handleLoginSuccess = () => {
    console.log('SecureAdminLogin: Login successful, redirecting to admin panel');
    navigate('/admin');
  };

  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    if (isLoggingIn) return false;
    
    try {
      setIsLoggingIn(true);
      console.log('SecureAdminLogin: Attempting secure admin login for:', username);
      
      if (typeof login !== 'function') {
        console.error('SecureAdminLogin: Login function is not available');
        toast.error('Authentication service unavailable');
        return false;
      }
      
      const success = await login(username, password);
      
      console.log('SecureAdminLogin: Login result:', success ? 'SUCCESS' : 'FAILED');
      
      if (success) {
        console.log('SecureAdminLogin: Login successful');
        return true;
      } else {
        console.log('SecureAdminLogin: Login failed - invalid credentials');
        return false;
      }
    } catch (error) {
      console.error('SecureAdminLogin: Login error:', error);
      toast.error('An error occurred during login');
      return false;
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Show loading while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 py-8 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-12 w-12 text-white mr-3" />
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Secure Administrator Access</h1>
            <p className="text-xl text-red-100">
              Authorized Personnel Only • All Access Monitored
            </p>
          </div>
        </div>
      </div>
      
      {/* Login Form */}
      <div className="py-8 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <Card className="border-2 border-red-200 shadow-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center">
                <Shield className="h-6 w-6 text-red-600 mr-2" />
                Administrator Login
              </CardTitle>
              <CardDescription className="text-red-600 font-medium">
                High-Security Access Portal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SecureAdminLoginForm 
                onLogin={handleLogin}
                onLoginSuccess={handleLoginSuccess}
                isLoading={isLoggingIn}
              />
            </CardContent>
          </Card>
          
          {/* Security Notice */}
          <div className="mt-6 text-center text-sm text-gray-600 bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center mb-2">
              <Lock className="h-4 w-4 text-red-500 mr-2" />
              <span className="font-semibold text-red-600">Security Notice</span>
            </div>
            <p>
              This system is restricted to authorized administrators only. 
              All login attempts are logged and monitored for security purposes.
              Unauthorized access attempts will be reported.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecureAdminLogin;