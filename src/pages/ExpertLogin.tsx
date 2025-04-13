
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Container } from '@/components/ui/container';
import ExpertLoginContent from '@/components/expert/auth/ExpertLoginContent';
import { useAuthSynchronization } from '@/hooks/useAuthSynchronization';
import { useAuth } from '@/contexts/auth/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ExpertLogin: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { expertLogin, expertSignup } = useAuth();
  const { isExpertAuthenticated, isAuthInitialized } = useAuthSynchronization();

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setLoginError(null);
    try {
      const success = await expertLogin(email, password);
      if (success) {
        toast.success('Successfully logged in!');
        navigate('/expert-dashboard');
        return true;
      } else {
        toast.error('Invalid credentials. Please try again.');
        setLoginError('Invalid credentials. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to login. Please try again.');
      setLoginError('Failed to login. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (formData: any): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = await expertSignup(formData);
      if (success) {
        toast.success('Registration successful! Please check your email to verify your account.');
        return true;
      } else {
        toast.error('Failed to register. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to register. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthInitialized && isExpertAuthenticated) {
      navigate('/expert-dashboard');
    }
  }, [isAuthInitialized, isExpertAuthenticated, navigate]);

  // Create a wrapper function to handle type conversion
  const handleTabChange = (tab: string) => {
    if (tab === 'login' || tab === 'register') {
      setActiveTab(tab);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <Container className="max-w-md">
          <ExpertLoginContent
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            onLogin={handleLogin}
            isLogging={isLoading}
            loginError={loginError}
          />
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default ExpertLogin;
