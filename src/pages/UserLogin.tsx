
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useUserAuth } from '@/hooks/useUserAuth';
import { toast } from 'sonner';
import { fetchReferralSettings } from '@/utils/referralUtils';
import { ReferralSettings } from '@/types/supabase';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { Link } from 'react-router-dom';

const UserLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, isAuthenticated } = useUserAuth();
  const [loading, setLoading] = useState(false);
  const [referralSettings, setReferralSettings] = useState<ReferralSettings | null>(null);

  // Get referral code from URL if available
  const queryParams = new URLSearchParams(location.search);
  const referralCodeFromUrl = queryParams.get('ref');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/user-dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Load referral settings
  useEffect(() => {
    const loadReferralSettings = async () => {
      const settings = await fetchReferralSettings();
      setReferralSettings(settings);
    };
    
    loadReferralSettings();
  }, []);

  // Switch to registration tab if referral code is in URL
  useEffect(() => {
    if (referralCodeFromUrl) {
      // Find the register tab trigger and click it
      const registerTab = document.querySelector('[data-value="register"]');
      if (registerTab && registerTab instanceof HTMLElement) {
        registerTab.click();
      }
    }
  }, [referralCodeFromUrl]);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/user-dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    country: string;
    city: string;
    referralCode?: string;
  }) => {
    setLoading(true);
    
    try {
      const success = await signup(userData);
      
      if (success) {
        toast.success('Please check your email to confirm your account');
        // Optional: Switch to login tab after successful signup
        const loginTab = document.querySelector('[data-state="inactive"][data-value="login"]');
        if (loginTab) {
          (loginTab as HTMLElement).click();
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10 flex items-center justify-center bg-stars">
        <div className="container max-w-md">
          <div className="bg-background/80 backdrop-blur-md rounded-xl shadow-xl p-8 border border-ifind-aqua/10">
            <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
              <div className="relative w-8 h-8">
                <div className="absolute w-8 h-8 bg-ifind-aqua rounded-full opacity-70"></div>
                <div className="absolute w-4 h-4 bg-ifind-teal rounded-full top-1 left-2"></div>
              </div>
              <span className="font-bold text-2xl text-gradient">iFindLife</span>
            </Link>
            
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <LoginForm onLogin={handleLogin} loading={loading} userType="user" />
              </TabsContent>
              
              <TabsContent value="register">
                <RegisterForm 
                  onRegister={handleSignup} 
                  loading={loading} 
                  initialReferralCode={referralCodeFromUrl}
                  referralSettings={referralSettings}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserLogin;
