
import React, { useEffect, useState } from 'react';
import { useAuthSynchronization } from '@/hooks/useAuthSynchronization';
import UserLogoutAlert from '@/components/auth/UserLogoutAlert';
import UserLoginTabs from '@/components/auth/UserLoginTabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { ExpertProfile } from '@/hooks/expert-auth';

const UserLoginContent = () => {
  const [expertProfile, setExpertProfile] = useState<ExpertProfile | null>(null);
  const [isCheckingExpert, setIsCheckingExpert] = useState(true);
  
  const { 
    isExpertAuthenticated, 
    expertProfile: synchronizedExpertProfile,
    expertLogout,
    isLoggingOut,
    setIsLoggingOut,
    authCheckCompleted,
    hasDualSessions,
    fullLogout,
    sessionType
  } = useAuthSynchronization();
  
  // Check if expert is logged in directly from Supabase
  useEffect(() => {
    const checkExpertLogin = async () => {
      setIsCheckingExpert(true);
      
      try {
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          // Check if there's a profile in the expert_accounts table
          const { data: expertData, error } = await supabase
            .from('expert_accounts')
            .select('*')
            .eq('auth_id', data.session.user.id)
            .maybeSingle();
            
          if (expertData && !error) {
            setExpertProfile(expertData as ExpertProfile);
            // If an expert is logged in, we shouldn't show login tabs
            console.log('Expert is already logged in, user login not allowed');
          } else {
            setExpertProfile(null);
          }
        } else {
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
  
  const handleExpertLogout = async (): Promise<boolean> => {
    setIsLoggingOut(true);
    try {
      const success = await expertLogout();
      
      if (success) {
        setExpertProfile(null);
        // Navigation handled by the logout function
        return true;
      } else {
        // Force a page reload as a last resort
        setTimeout(() => {
          window.location.reload();
        }, 1500);
        return false;
      }
    } catch (error) {
      console.error('Error during expert logout:', error);
      
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
      const success = await fullLogout();
      
      if (success) {
        // Navigation handled by the logout function
        return true;
      } else {
        // Force a page reload as a last resort
        setTimeout(() => {
          window.location.reload();
        }, 1500);
        return false;
      }
    } catch (error) {
      console.error('Error during full logout:', error);
      
      // Force a page reload as a last resort
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      return false;
    } finally {
      setIsLoggingOut(false);
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
  
  return (
    <>
      {hasDualSessions && (
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
      ) : expertProfile || synchronizedExpertProfile ? (
        <UserLogoutAlert 
          profileName={(expertProfile?.name || synchronizedExpertProfile?.name) ?? "Expert"}
          isLoggingOut={isLoggingOut}
          onLogout={handleExpertLogout}
          logoutType="expert"
        />
      ) : (
        <UserLoginTabs />
      )}
    </>
  );
};

export default UserLoginContent;
