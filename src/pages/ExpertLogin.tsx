
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/UnifiedAuthContext';
import { supabase } from '@/lib/supabase';
import ExpertLoginForm from '@/components/expert/auth/ExpertLoginForm';
import LoadingScreen from '@/components/auth/LoadingScreen';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ExpertLogin: React.FC = () => {
  const { isAuthenticated, sessionType, expertProfile, isLoading } = useAuth();
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  console.log('ExpertLogin: Current auth state:', {
    isAuthenticated: Boolean(isAuthenticated),
    sessionType,
    hasExpertProfile: Boolean(expertProfile),
    isLoading: Boolean(isLoading)
  });

  useEffect(() => {
    const checkExistingAuth = async () => {
      if (isLoading) {
        console.log('ExpertLogin: Auth still loading, waiting...');
        return;
      }
      
      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const storedSessionType = localStorage.getItem('sessionType');
        
        // If authenticated as expert with valid profile, redirect to dashboard
        if (storedSessionType === 'expert' && isAuthenticated && expertProfile) {
          console.log('ExpertLogin: Expert authenticated, redirecting to dashboard');
          navigate('/expert-dashboard', { replace: true });
          return;
        }
        
        // If authenticated but as different type, show message
        if (storedSessionType !== 'expert') {
          console.log('ExpertLogin: Authenticated as different type, need expert login');
          toast.info('You need to login as an expert to access this area');
          await supabase.auth.signOut();
        }
      }
      
      setCheckingAuth(false);
    };

    checkExistingAuth();
  }, [isAuthenticated, sessionType, expertProfile, isLoading, navigate]);

  // Restore working expert login handler
  const handleExpertLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoggingIn(true);
      console.log('🔒 Starting expert login for:', email);
      
      // Set session type BEFORE authentication
      localStorage.setItem('sessionType', 'expert');
      
      // 1. Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (authError || !authData.user) {
        console.error('❌ Authentication failed:', authError?.message);
        toast.error(authError?.message || 'Authentication failed');
        localStorage.removeItem('sessionType');
        return false;
      }
      
      console.log('✅ Auth successful, checking expert profile...');
      
      // 2. Verify expert profile exists and is approved
      const { data: expertProfile, error: profileError } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', authData.user.id)
        .eq('status', 'approved')
        .maybeSingle();
      
      if (profileError || !expertProfile) {
        console.error('❌ Expert profile not found or not approved');
        await supabase.auth.signOut();
        localStorage.removeItem('sessionType');
        toast.error('Expert profile not found or not approved');
        return false;
      }
      
      console.log('✅ Expert profile verified:', expertProfile.name);
      toast.success('Expert login successful!');
      
      // 3. Navigate to expert dashboard with forced redirect
      setTimeout(() => {
        window.location.href = '/expert-dashboard';
      }, 500);
      
      return true;
    } catch (error: any) {
      console.error('❌ Expert login failed:', error);
      toast.error(error.message || 'Login failed. Please try again.');
      localStorage.removeItem('sessionType');
      return false;
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (isLoading || checkingAuth) {
    return <LoadingScreen message="Checking expert authentication..." />;
  }

  // If already authenticated as expert, show loading while redirecting
  if (isAuthenticated && sessionType === 'expert' && expertProfile) {
    return <LoadingScreen message="Redirecting to expert dashboard..." />;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <Container className="max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Expert Portal</CardTitle>
              <p className="text-muted-foreground">Sign in to your expert account</p>
            </CardHeader>
            <CardContent>
              <ExpertLoginForm 
                onLogin={handleExpertLogin}
                isLoggingIn={isLoggingIn}
                loginError={null}
                setActiveTab={() => {}}
              />
            </CardContent>
          </Card>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default ExpertLogin;
