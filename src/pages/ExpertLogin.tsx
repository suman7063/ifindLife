
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Container } from '@/components/ui/container';
import ExpertLoginContent from '@/components/expert/auth/ExpertLoginContent';
import { useAuthSynchronization } from '@/hooks/useAuthSynchronization';
import { useAuth } from '@/contexts/auth/AuthContext';

const ExpertLogin: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const { expertLogin, expertSignup } = useAuth();
  const { isExpertAuthenticated, isAuthInitialized } = useAuthSynchronization();

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = await expertLogin(email, password);
      if (success) {
        toast.success('Successfully logged in!');
        navigate('/expert-dashboard');
        return true;
      } else {
        toast.error('Invalid credentials. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to login. Please try again.');
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

  return (
    <Container className="max-w-md py-12">
      <ExpertLoginContent
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogin={handleLogin}
        onRegister={handleRegister}
        isLoading={isLoading}
      />
    </Container>
  );
};

export default ExpertLogin;
