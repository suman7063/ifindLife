
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoginTab from '@/components/auth/LoginTab';
import RegisterTab from '@/components/auth/RegisterTab';
import { toast } from 'sonner';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { useExpertAuth } from '@/hooks/expert-auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const UserLogin = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [socialLoginLoading, setSocialLoginLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading, signup, login } = useUserAuth();
  const { expert, loading: expertLoading, logout: expertLogout } = useExpertAuth();
  
  // Check if redirected to register tab
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('register') === 'true') {
      setActiveTab('register');
    }
  }, [location]);
  
  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/user-dashboard');
    }
  }, [isAuthenticated, loading, navigate]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleExpertLogout = async () => {
    await expertLogout();
    toast.success('Successfully logged out as expert');
    // Refresh the page to clear any lingering state
    window.location.reload();
  };

  if (loading || expertLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-16 container">
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ifind-teal"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16 container">
        <div className="max-w-md mx-auto">
          <Card className="border-ifind-lavender/20 shadow-xl">
            <CardContent className="pt-6">
              {expert ? (
                <div className="space-y-4 p-4">
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>
                      You are currently logged in as an expert. You need to log out as an expert before logging in as a user.
                    </AlertDescription>
                  </Alert>
                  <Button onClick={handleExpertLogout} variant="destructive" className="w-full flex items-center justify-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out as Expert
                  </Button>
                </div>
              ) : (
                <Tabs value={activeTab} onValueChange={handleTabChange}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login">
                    <LoginTab 
                      onLogin={login} 
                      setSocialLoading={setSocialLoginLoading}
                      socialLoading={socialLoginLoading}
                      loading={loading}
                    />
                  </TabsContent>
                  
                  <TabsContent value="register">
                    <RegisterTab 
                      onRegister={signup}
                      loading={loading}
                    />
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserLogin;
