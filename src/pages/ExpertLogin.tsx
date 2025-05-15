
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthSynchronization } from '@/hooks/useAuthSynchronization';
import ExpertLoginForm from '@/components/expert/auth/ExpertLoginForm';
import ExpertRegisterForm from '@/components/expert/auth/ExpertRegisterForm';

const ExpertLogin: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, role, expertProfile, sessionType } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  useEffect(() => {
    // Store login origin for correct role determination
    sessionStorage.setItem('loginOrigin', 'expert');

    // Check if already logged in as expert
    if (isAuthenticated && !isLoading && role === 'expert') {
      navigate('/expert-dashboard');
    }
    
    // If logged in as user but trying to access expert login
    if (isAuthenticated && !isLoading && role === 'user' && sessionType === 'user') {
      // Could redirect or show message about being logged in as user
    }
  }, [isAuthenticated, isLoading, role, navigate, sessionType]);

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    setIsLoggingIn(true);
    setLoginError(null);
    
    try {
      // Call login with asExpert=true to indicate expert login attempt
      const success = await auth.login(email, password, true);
      
      if (success) {
        navigate('/expert-dashboard');
        return true;
      } else {
        setLoginError('Login failed. Please check your credentials.');
        return false;
      }
    } catch (error) {
      console.error('Error during expert login:', error);
      setLoginError('An error occurred during login.');
      return false;
    } finally {
      setIsLoggingIn(false);
    }
  };

  const auth = useAuth();

  return (
    <Container className="py-8 md:py-12">
      <Card className="border shadow-lg max-w-md mx-auto">
        <CardContent className="pt-6">
          <h1 className="text-2xl font-bold text-center mb-6">Expert Portal</h1>
          
          {loginError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <ExpertLoginForm 
                onLogin={handleLogin} 
                isLoggingIn={isLoggingIn} 
                loginError={loginError}
                setActiveTab={setActiveTab}
              />
            </TabsContent>
            
            <TabsContent value="register">
              <ExpertRegisterForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ExpertLogin;
