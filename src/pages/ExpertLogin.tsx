
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/container';
import ExpertLoginForm from '@/components/expert/auth/ExpertLoginForm';
import ExpertRegisterForm from '@/components/expert/auth/ExpertRegisterForm';
import { Card, CardContent } from '@/components/ui/card';

const ExpertLogin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const { isAuthenticated, isLoading, role, sessionType } = useAuth();
  const navigate = useNavigate();
  
  // Set login origin for role determination
  useEffect(() => {
    sessionStorage.setItem('loginOrigin', 'expert');
    console.log('ExpertLogin: Setting login origin to expert');
  }, []);
  
  // Handle redirection if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      console.log('ExpertLogin: Already authenticated as', role, 'with session type', sessionType);
      
      if (role === 'user' && (sessionType === 'user' || sessionType === 'dual')) {
        console.log('Redirecting to user dashboard');
        navigate('/user-dashboard', { replace: true });
      } else {
        console.log('Redirecting to expert dashboard');
        navigate('/expert-dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, role, sessionType, navigate]);
  
  const handleLoginSuccess = () => {
    navigate('/expert-dashboard');
  };
  
  return (
    <>
      <Navbar />
      <div className="py-8 md:py-12 bg-gray-50 min-h-[calc(100vh-100px)]">
        <Container>
          <div className="max-w-md mx-auto">
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold">Expert Portal</h1>
                  <p className="text-muted-foreground">
                    Login or register to access your expert dashboard
                  </p>
                </div>
                
                <Tabs 
                  value={activeTab} 
                  onValueChange={(value) => setActiveTab(value as 'login' | 'register')}
                >
                  <TabsList className="grid grid-cols-2 w-full mb-6">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login">
                    <ExpertLoginForm />
                  </TabsContent>
                  
                  <TabsContent value="register">
                    <ExpertRegisterForm />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default ExpertLogin;
