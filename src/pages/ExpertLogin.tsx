
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
  
  // Redirect if already authenticated as expert
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (role === 'expert' && expertProfile) {
        console.log('ExpertLogin: User is authenticated as expert, redirecting to dashboard');
        navigate('/expert-dashboard');
      } else if (role === 'user' && userProfile) {
        console.log('ExpertLogin: User is authenticated as regular user, not as expert');
        toast.error('You are logged in as a user. Please log out first to access expert portal.');
        navigate('/user-dashboard');
      }
    }
  }, [isLoading, isAuthenticated, expertProfile, userProfile, role, navigate]);
  
  // Helper function to check if an expert profile exists for the user
  const checkForExpertProfile = async (userId: string): Promise<boolean> => {
    try {
      console.log("Checking for expert profile for user ID:", userId);
      
      // First check if user already has an expert profile
      const { data: existingProfile, error } = await supabase
        .from('expert_accounts')
        .select('id, status')
        .eq('auth_id', userId)
        .maybeSingle();
      
      if (error) {
        console.error("Error checking for expert profile:", error);
        return false;
      }
      
      // If we found an existing expert profile
      if (existingProfile) {
        console.log("Found existing expert profile:", existingProfile);
        
        // If the expert profile is not approved, show appropriate message
        if (existingProfile.status !== 'approved') {
          if (existingProfile.status === 'pending') {
            toast.info('Your expert account is pending approval. You will be notified once approved.');
            navigate('/expert-login?status=pending');
          } else {
            toast.error('Your expert account application was not approved.');
            navigate('/expert-login?status=disapproved');
          }
          return false;
        }
        
        return true;
      } else {
        console.log("No expert profile found for this user");
        return false;
      }
    } catch (err) {
      console.error("Error in checkForExpertProfile:", err);
      return false;
    }
  };

  // Helper function to create an expert profile if missing
  const createTemporaryExpertProfile = async (userId: string): Promise<boolean> => {
    try {
      console.log("Creating temporary expert profile for demo purposes");
      
      const { data, error } = await supabase
        .from('expert_accounts')
        .insert([
          { 
            auth_id: userId,
            name: 'Demo Expert',
            email: 'demo@expert.com',
            status: 'approved',
            specialties: ['Psychology', 'Therapy'],
            experience: '5 years' 
          }
        ])
        .select();
      
      if (error) {
        console.error("Error creating expert profile:", error);
        return false;
      }
      
      console.log("Created expert profile:", data);
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
      
      // Check if user is already logged in - if yes, log them out first
      const { data: currentSession } = await supabase.auth.getSession();
      if (currentSession.session) {
        await supabase.auth.signOut();
      }
      
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
        
        // Check if an expert profile exists
        const hasExpertProfile = await checkForExpertProfile(userId);
        
        if (hasExpertProfile) {
          toast.success('Successfully logged in as expert!');
          navigate('/expert-dashboard');
          return true;
        } else {
          // For demo purposes, we'll create a temporary expert profile
          // In a real app, you'd redirect to registration or show an error
          const created = await createTemporaryExpertProfile(userId);
          
          if (created) {
            toast.success('Created temporary expert profile for demonstration');
            
            // Reload the page to trigger a re-fetch of user data
            window.location.href = '/expert-dashboard';
            return true;
          } else {
            console.error('ExpertLogin: No expert profile found and could not create one');
            toast.error('Could not set up expert profile. Please contact support.');
            await supabase.auth.signOut();
            setLoginError('Expert profile setup failed.');
            return false;
          }
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
