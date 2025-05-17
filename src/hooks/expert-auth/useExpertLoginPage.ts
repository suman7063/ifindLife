
// Add this file if it doesn't exist or update it
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpertAuth } from './useExpertAuth';

export const useExpertLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated, isLoading, currentExpert, error } = useExpertAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && currentExpert) {
      navigate('/expert-dashboard');
    }
  }, [isAuthenticated, currentExpert, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        // Authentication handled by useEffect above
      }
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isSubmitting,
    handleLogin,
    isLoading,
    error
  };
};

export default useExpertLoginPage;
