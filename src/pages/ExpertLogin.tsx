
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import ExpertLoginForm from '@/components/expert/auth/ExpertLoginForm';
import ExpertRegisterForm from '@/components/expert/auth/ExpertRegisterForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const ExpertLogin = () => {
  const [activeTab, setActiveTab] = useState('login');
  const { isAuthenticated, expertProfile, userProfile, sessionType } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get returnUrl from query parameter
  const queryParams = new URLSearchParams(location.search);
  const returnUrl = queryParams.get('returnUrl') || '/expert-dashboard';
  
  useEffect(() => {
    // If logged in as expert, redirect to expert dashboard
    if (isAuthenticated && expertProfile) {
      toast.success('Welcome back!');
      navigate(returnUrl);
    }
    // If logged in as user only, show alert or option to continue as user
    else if (isAuthenticated && userProfile && !expertProfile) {
      toast.info('You are logged in as a user but not registered as an expert');
    }
  }, [isAuthenticated, expertProfile, userProfile, navigate, returnUrl]);
  
  const handleRegisterComplete = () => {
    setActiveTab('login');
    toast.success('Registration successful! Please log in with your new account');
  };
  
  const handleExpertLoginSuccess = () => {
    toast.success('Login successful!');
    navigate(returnUrl);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-6 left-6">
        <Button variant="outline" size="sm" asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
      
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Expert Portal
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your expert dashboard
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4 mt-4">
            <ExpertLoginForm onLoginSuccess={handleExpertLoginSuccess} />
          </TabsContent>
          
          <TabsContent value="register" className="space-y-4 mt-4">
            <ExpertRegisterForm onRegisterComplete={handleRegisterComplete} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ExpertLogin;
