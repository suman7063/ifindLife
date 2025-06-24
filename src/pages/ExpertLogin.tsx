
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
  const [loginError, setLoginError] = useState<string | null>(null);

  console.log('ExpertLogin: Current auth state:', {
    isAuthenticated: Boolean(isAuthenticated),
    sessionType,
    hasExpertProfile: Boolean(expertProfile),
    isLoading: Boolean(isLoading),
    expertEmail: expertProfile?.email
  });

  useEffect(() => {
    // Don't proceed if still loading
    if (isLoading) {
      console.log('ExpertLogin: Auth still loading, waiting...');
      return;
    }

    const checkExistingAuth = () => {
      console.log('ExpertLogin: Checking existing authentication...');

      // If authenticated as expert with valid profile, redirect to dashboard
      if (isAuthenticated && sessionType === 'expert' && expertProfile) {
        console.log('ExpertLogin: Expert authenticated, redirecting to dashboard');
        navigate('/expert-dashboard', { replace: true });
        return;
      }

      // If authenticated but as different type, show message and logout
      if (isAuthenticated && sessionType !== 'expert') {
        console.log('ExpertLogin: Authenticated as different type, need to logout');
        toast.info('You need to login as an expert to access this area');
      }

      setCheckingAuth(false);
    };

    // Small delay to ensure auth state is stable
    const timer = setTimeout(checkExistingAuth, 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, sessionType, expertProfile, isLoading, navigate]);

  // ✅ EXPERT LOGIN HANDLER WITH CORRECT QUERIES
  const handleExpertLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoggingIn(true);
      setLoginError(null);
      console.log('🔒 Starting expert login for:', email);
      
      // 1. Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (authError || !authData.user) {
        console.error('❌ Authentication failed:', authError?.message);
        setLoginError(authError?.message || 'Authentication failed');
        toast.error(authError?.message || 'Authentication failed');
        return false;
      }
      
      console.log('✅ Auth successful for user:', authData.user.id);
      console.log('🔒 Checking expert profile...');
      
      // 2. Check expert profile with CORRECT table/column
      const { data: expertProfile, error: profileError } = await supabase
        .from('expert_accounts')  // ✅ Correct table
        .select('*')
        .eq('auth_id', authData.user.id)  // ✅ Correct column
        .eq('status', 'approved')
        .maybeSingle();
      
      if (profileError) {
        console.error('❌ Expert profile query failed:', profileError);
        console.error('❌ This means either:');
        console.error('   1. User is not an expert');
        console.error('   2. Expert profile not approved');
        console.error('   3. Database query issue');
        
        // Logout the user since they're not an approved expert
        await supabase.auth.signOut();
        setLoginError('Expert profile not found or not approved');
        toast.error('Expert profile not found or not approved');
        return false;
      }
      
      if (!expertProfile) {
        console.error('❌ No expert profile found for auth_id:', authData.user.id);
        await supabase.auth.signOut();
        setLoginError('Expert profile not found');
        toast.error('Expert profile not found');
        return false;
      }
      
      console.log('✅ Expert profile verified:', expertProfile.name);
      console.log('✅ Expert specialties:', expertProfile.specialties);
      
      // 3. Set session type immediately
      localStorage.setItem('sessionType', 'expert');
      console.log('✅ Session type set to expert');
      
      // 4. Navigate to expert dashboard
      console.log('🚀 Redirecting to expert dashboard...');
      toast.success('Expert login successful!');
      
      setTimeout(() => {
        navigate('/expert-dashboard', { replace: true });
      }, 500);
      
      return true;
    } catch (error: any) {
      console.error('❌ Expert login failed:', error);
      setLoginError(error.message || 'Login failed');
      toast.error(error.message || 'Login failed. Please try again.');
      return false;
    } finally {
      setIsLoggingIn(false);
    }
  };

  const setActiveTab = (tab: string) => {
    console.log('ExpertLogin: Setting active tab to:', tab);
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
              {loginError && (
                <p className="text-red-500 text-sm mt-2">{loginError}</p>
              )}
            </CardHeader>
            <CardContent>
              <ExpertLoginForm 
                onLogin={handleExpertLogin}
                isLoggingIn={isLoggingIn}
                loginError={loginError}
                setActiveTab={setActiveTab}
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
