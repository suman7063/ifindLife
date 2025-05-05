
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Container } from '@/components/ui/container';
import ExpertLoginContent from '@/components/expert/auth/ExpertLoginContent';
import { useAuth } from '@/contexts/auth/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingScreen from '@/components/auth/LoadingScreen';

const ExpertLogin: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const auth = useAuth();

  // Debug logs
  useEffect(() => {
    console.log('ExpertLogin - Auth states:', {
      isAuthenticated: auth.isAuthenticated,
      isLoading: auth.isLoading,
      role: auth.role,
      hasExpertProfile: !!auth.expertProfile
    });
  }, [auth.isAuthenticated, auth.isLoading, auth.role, auth.expertProfile]);
  
  // Redirect to expert dashboard if already logged in as expert
  useEffect(() => {
    if (!auth.isLoading && auth.isAuthenticated && auth.role === 'expert') {
      console.log('Already logged in as expert, redirecting to dashboard');
      navigate('/expert-dashboard');
    }
  }, [auth.isAuthenticated, auth.isLoading, auth.role, navigate]);
  
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
      
      if (!auth.login) {
        console.error("Login function is not available");
        toast.error("Login functionality is not available");
        setIsLoading(false);
        return false;
      }
      
      const success = await auth.login(email, password);
      
      if (success) {
        console.log("Login successful, checking for expert profile");
        
        // Wait a moment for the auth state to update
        setTimeout(() => {
          if (auth.role === 'expert') {
            console.log("Expert role confirmed, redirecting to expert dashboard");
            toast.success('Successfully logged in as expert!');
            navigate('/expert-dashboard');
          } else {
            console.log("Not an expert account, logging out");
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
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading screen while checking authentication
  if (auth.isLoading) {
    return <LoadingScreen message="Checking authentication status..." />;
  }

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
