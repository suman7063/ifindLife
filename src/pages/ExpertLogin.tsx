
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
  const auth = useAuth();
  const { expertProfile, isExpertAuthenticated, isAuthInitialized } = useAuthSynchronization();

  // Redirect to expert dashboard if already logged in as expert
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

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setLoginError(null);
    try {
      console.log("Attempting expert login with:", email);
      
      if (!auth.login || typeof auth.login !== 'function') {
        console.error("Login function is not available");
        toast.error("Login functionality is not available");
        setIsLoading(false);
        return false;
      }
      
      const success = await auth.login(email, password);
      
      if (success) {
        // After successful authentication, check if the user is an expert
        console.log("Login successful, checking if expert profile exists");
        
        // Wait a bit for the expert profile to load
        setTimeout(() => {
          if (auth.expertProfile) {
            console.log("Expert profile found, redirecting to expert dashboard");
            toast.success('Successfully logged in as expert!');
            navigate('/expert-dashboard');
          } else if (auth.userProfile) {
            console.log("No expert profile found, user is not an expert");
            toast.error('This account is not registered as an expert');
            // Sign out since this is not an expert account
            auth.logout();
          }
        }, 500);
        
        return true;
      } else {
        setLoginError("Invalid credentials. Please try again.");
        toast.error("Invalid credentials. Please try again.");
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("An error occurred during login. Please try again.");
      toast.error("An error occurred during login. Please try again.");
      setIsLoading(false);
      return false;
    }
  };

  const handleRegister = async (formData: any): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Use standard signup since we don't have separate expert signup
      const success = await auth.signup(formData.email, formData.password, formData);
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
