
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import LoadingScreen from '@/components/auth/LoadingScreen';

const ExpertLogin: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  
  // Temporary compatibility fix for missing expertLogin and expertSignup
  const expertLogin = async (email: string, password: string) => {
    return await auth.login(email, password);
  };
  
  const expertSignup = async (email: string, password: string, userData: any) => {
    return auth.signup ? await auth.signup(email, password, userData) : false;
  };
  
  useEffect(() => {
    // Redirect if user is already authenticated as an expert
    if (auth.isAuthenticated && auth.role === 'expert') {
      navigate('/expert-dashboard');
    }
  }, [auth.isAuthenticated, auth.role, navigate]);
  
  if (auth.isLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">Expert Login</h1>
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
        <p className="text-center text-gray-500 mb-6">
          This page is under construction. Please use the standard login page.
        </p>
        <div className="flex justify-center">
          <button 
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpertLogin;
