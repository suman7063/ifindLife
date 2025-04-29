
import React, { useEffect, useState } from 'react';
import { useAuthSynchronization } from '@/hooks/useAuthSynchronization';
import UserLogoutAlert from '@/components/auth/UserLogoutAlert';
import UserLoginTabs from '@/components/auth/UserLoginTabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { ExpertProfile } from '@/hooks/expert-auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth/AuthContext';

interface UserLoginContentProps {
  children?: React.ReactNode;
}

const UserLoginContent: React.FC<UserLoginContentProps> = ({ children }) => {
  const navigate = useNavigate();
  const [expertProfile, setExpertProfile] = useState<ExpertProfile | null>(null);
  const [isCheckingExpert, setIsCheckingExpert] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Use the unified auth context
  const { 
    login,
    logout,
    isAuthenticated,
    isLoading,
    role,
    userProfile
  } = useAuth();
  
  // Get synchronization helpers
  const { 
    isUserAuthenticated,
    isExpertAuthenticated,
    userLogout,
    expertLogout,
    fullLogout,
    hasDualSessions
  } = useAuthSynchronization();
  
  // Check if expert is logged in directly from Supabase
  useEffect(() => {
    const checkExpertLogin = async () => {
      setIsCheckingExpert(true);
      
      try {
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          console.log("UserLoginContent - Found session:", data.session.user.id);
          
          // Check if there's a profile in the expert_accounts table
          const { data: expertData, error } = await supabase
            .from('expert_accounts')
            .select('*')
            .eq('auth_id', data.session.user.id)
            .maybeSingle();
            
          if (expertData && !error) {
            console.log("UserLoginContent - Found expert profile");
            setExpertProfile(expertData as ExpertProfile);
            // If an expert is logged in, we shouldn't show login tabs
            toast.info('You are currently logged in as an expert');
          } else {
            console.log("UserLoginContent - No expert profile found");
            setExpertProfile(null);
          }
        } else {
          console.log("UserLoginContent - No session found");
          setExpertProfile(null);
        }
      } catch (error) {
        console.error('Error checking expert login:', error);
        setExpertProfile(null);
      } finally {
        setIsCheckingExpert(false);
      }
    };
    
    checkExpertLogin();
  }, []);
  
  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated && role === 'user' && userProfile && !isLoading) {
      console.log("UserLoginContent - User is authenticated, redirecting to dashboard", {
        isUserAuthenticated,
        role,
        hasUserProfile: !!userProfile
      });
      navigate('/user-dashboard');
    }
  }, [isAuthenticated, isLoading, navigate, userProfile, role, isUserAuthenticated]);
  
  const handleExpertLogout = async (): Promise<boolean> => {
    setIsLoggingOut(true);
    try {
      await expertLogout();
      setExpertProfile(null);
      toast.success('Logged out successfully');
      return true;
    } catch (error) {
      console.error('Error during expert logout:', error);
      toast.error('Failed to log out');
      
      // Force a page reload as a last resort
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  const handleFullLogout = async (): Promise<boolean> => {
    setIsLoggingOut(true);
    try {
      await fullLogout();
      toast.success('Logged out of all accounts');
      return true;
    } catch (error) {
      console.error('Error during full logout:', error);
      toast.error('Failed to log out');
      
      // Force a page reload as a last resort
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Attempting user login with:", email);
      
      if (!login || typeof login !== 'function') {
        console.error("Login function is not available:", login);
        toast.error("Login functionality is not available");
        return false;
      }
      
      const success = await login(email, password);
      
      if (success) {
        toast.success("Login successful!");
        return true;
      } else {
        toast.error("Login failed. Please check your credentials.");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login. Please try again.");
      return false;
    }
  };
  
  // Show loading while checking expert status
  if (isCheckingExpert) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }
  
  // Determine which content to render based on conditions
  let content;
  if (hasDualSessions) {
    content = (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Multiple Sessions Detected</AlertTitle>
          <AlertDescription>
            You are currently logged in as both a user and an expert. This can cause authentication issues.
          </AlertDescription>
        </Alert>
        <Button 
          onClick={handleFullLogout} 
          variant="destructive" 
          className="w-full"
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              Logging Out...
            </>
          ) : 'Log Out of All Accounts'}
        </Button>
      </div>
    );
  } else if (expertProfile || isExpertAuthenticated) {
    content = (
      <UserLogoutAlert 
        profileName={(expertProfile?.name) ?? "Expert"}
        isLoggingOut={isLoggingOut}
        onLogout={handleExpertLogout}
        logoutType="expert"
      />
    );
  } else {
    // Pass the handleLogin function to UserLoginTabs if children is not provided
    const loginTabs = children || <UserLoginTabs onLogin={handleLogin} />;
    content = loginTabs;
  }

  return <>{content}</>;
};

export default UserLoginContent;
