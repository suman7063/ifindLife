
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Container } from '@/components/ui/container';
import ExpertLoginContent from '@/components/expert/auth/ExpertLoginContent';
import { useAuth } from '@/contexts/auth/AuthContext';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingScreen from '@/components/auth/LoadingScreen';

const ExpertLogin: React.FC = () => {
  console.log("Rendering ExpertLogin page");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(
    searchParams.get('register') === 'true' ? 'register' : 'login'
  );
  const [isLogging, setIsLogging] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { isLoading, isAuthenticated, expertProfile, userProfile, role, login } = useAuth();
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // Debug logging
  useEffect(() => {
    console.log("ExpertLogin component rendering", { 
      isLoading, 
      isAuthenticated, 
      hasExpertProfile: !!expertProfile,
      hasUserProfile: !!userProfile,
      role 
    });
  }, [isLoading, isAuthenticated, expertProfile, userProfile, role]);
  
  // Check URL parameters for status messages
  useEffect(() => {
    const status = searchParams.get('status');
    
    if (status === 'registered') {
      setStatusMessage({
        type: 'success',
        message: 'Registration successful! Please log in with your credentials.'
      });
      setActiveTab('login');
    } else if (status === 'pending') {
      setStatusMessage({
        type: 'success',
        message: 'Your account is pending approval. You will be notified once approved.'
      });
    } else if (status === 'disapproved') {
      setStatusMessage({
        type: 'error',
        message: 'Your account application was not approved. Please check your email for details.'
      });
    }
  }, [searchParams]);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // If authenticated as expert, redirect to expert dashboard
      if (role === 'expert') {
        console.log('ExpertLogin: User is authenticated as expert, redirecting to dashboard');
        navigate('/expert-dashboard');
      } 
      // If authenticated as user, don't auto-redirect - show a message instead
      else if (role === 'user') {
        console.log('ExpertLogin: User is authenticated as regular user, not as expert');
        toast.error('You are logged in as a user. Please log out first to access expert portal.');
      }
    }
  }, [isLoading, isAuthenticated, expertProfile, userProfile, role, navigate]);
  
  // Create a temporary expert profile for demonstration purposes
  const createTemporaryExpertProfile = async (userId: string): Promise<boolean> => {
    try {
      console.log("Creating temporary expert profile for demo purposes");
      
      // First check if profile already exists to avoid duplicate creation
      try {
        const { data: existingProfile, error: checkError } = await supabase
          .from('expert_accounts')
          .select('id')
          .eq('auth_id', userId)
          .maybeSingle();
        
        if (checkError) {
          console.error("Error checking for existing profile:", checkError);
          // Continue to attempt creation anyway
        } else if (existingProfile) {
          console.log("Expert profile already exists, no need to create");
          return true;
        }
      } catch (checkErr) {
        console.error("Error checking for existing profile:", checkErr);
        // Continue to attempt creation anyway
      }
      
      // Create expert profile with minimum required fields
      const { data, error } = await supabase
        .from('expert_accounts')
        .insert([
          { 
            auth_id: userId,
            name: 'Demo Expert',
            email: 'demo@expert.com', // This will be overwritten by the user's email in a real app
            status: 'approved',
            experience: '5+ years'
          }
        ])
        .select();
      
      if (error) {
        console.error("Error creating expert profile:", error);
        toast.error('Could not create expert profile: ' + error.message);
        return false;
      }
      
      console.log("Created expert profile:", data);
      toast.success('Created temporary expert profile for demonstration');
      return true;
    } catch (err) {
      console.error("Error in createTemporaryExpertProfile:", err);
      return false;
    }
  };

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    setIsLogging(true);
    setLoginError(null);
    try {
      console.log('ExpertLogin: Attempting login with', email);
      
      // Sign out any existing session first
      await supabase.auth.signOut();
      
      // Use the standard auth login
      const success = await login(email, password);
      
      if (success) {
        // Get current session to get user ID
        const { data: newSession } = await supabase.auth.getSession();
        if (!newSession.session || !newSession.session.user) {
          console.error('ExpertLogin: Login successful but no user session found');
          toast.error('Authentication error. Please try again.');
          return false;
        }
        
        const userId = newSession.session.user.id;
        
        // For demo purposes, create an expert profile if none exists
        const created = await createTemporaryExpertProfile(userId);
        
        if (created) {
          toast.success('Successfully logged in!');
          
          // Force full page reload to ensure proper state initialization
          window.location.href = '/expert-dashboard';
          return true;
        } else {
          console.error('ExpertLogin: No expert profile found and could not create one');
          toast.error('Could not set up expert profile. Please contact support.');
          await supabase.auth.signOut();
          setLoginError('Expert profile setup failed.');
          return false;
        }
      } else {
        console.error('ExpertLogin: Login failed');
        toast.error('Invalid credentials. Please try again.');
        setLoginError('Invalid credentials. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('ExpertLogin error:', error);
      toast.error('Failed to login. Please try again.');
      setLoginError('Failed to login. Please try again.');
      return false;
    } finally {
      setIsLogging(false);
    }
  };

  // Create a wrapper function to handle type conversion
  const handleTabChange = (tab: string) => {
    if (tab === 'login' || tab === 'register') {
      setActiveTab(tab);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
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
            isLogging={isLogging}
            loginError={loginError}
            statusMessage={statusMessage}
          />
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default ExpertLogin;
