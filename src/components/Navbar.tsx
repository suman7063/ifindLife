import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NavbarDesktopLinks from './navbar/NavbarDesktopLinks';
import NavbarMobileMenu from './navbar/NavbarMobileMenu';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useExpertAuth } from '@/hooks/useExpertAuth';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ensureUserProfileCompatibility } from '@/utils/typeAdapters';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Use both auth contexts
  const { 
    isAuthenticated, 
    userProfile,
    expertProfile,
    role,
    logout,
    sessionType,
    isLoading,
    user,
    session
  } = useAuth();

  // Get expert authentication state directly
  const expertAuth = useExpertAuth();

  // Combine authentication states with expert auth taking precedence
  const isUserAuthenticated = Boolean(isAuthenticated && role === 'user' && userProfile && user && session);
  const isExpertAuthenticated = Boolean(expertAuth.isAuthenticated && expertAuth.currentExpert);
  const hasDualSessions = Boolean(userProfile && expertProfile && isAuthenticated);
  const currentUser = ensureUserProfileCompatibility(userProfile);

  // Determine final authentication state - expert auth takes precedence
  const finalIsAuthenticated = isExpertAuthenticated || isUserAuthenticated;
  const finalSessionType = isExpertAuthenticated ? 'expert' : (isUserAuthenticated ? 'user' : 'none');
  const finalHasExpertProfile = isExpertAuthenticated;

  // Set up session timeout (4 hours = 4 * 60 * 60 * 1000 ms)
  const SESSION_TIMEOUT = 4 * 60 * 60 * 1000; // 4 hours
  
  const handleSessionTimeout = async () => {
    console.log('Session timeout - logging out user');
    await handleUserLogout();
  };

  // Use session timeout hook only if user is authenticated
  useSessionTimeout(
    SESSION_TIMEOUT, 
    finalIsAuthenticated ? handleSessionTimeout : () => {}
  );

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Handle user logout with 2-second toast
  const handleUserLogout = async (): Promise<boolean> => {
    if (isLoggingOut) return false;
    
    try {
      setIsLoggingOut(true);
      console.log("Navbar: Initiating user logout...");
      const success = await logout();
      
      if (success) {
        console.log("Navbar: User logout successful");
        toast.success('Successfully logged out', {
          duration: 2000
        });
        navigate('/logout', { state: { userType: 'user' } });
        return true;
      } else {
        console.error("Navbar: User logout failed");
        toast.error('Logout failed. Please try again.', {
          duration: 2000
        });
        return false;
      }
    } catch (error) {
      console.error('Error during user logout:', error);
      toast.error('Failed to log out. Please try again.', {
        duration: 2000
      });
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Handle expert logout with 2-second toast
  const handleExpertLogout = async (): Promise<boolean> => {
    if (isLoggingOut) return false;
    
    try {
      setIsLoggingOut(true);
      console.log("Navbar: Initiating expert logout...");
      const success = await expertAuth.logout();
      
      if (success) {
        console.log("Navbar: Expert logout completed");
        toast.success('Successfully logged out as expert', {
          duration: 2000
        });
        navigate('/logout', { state: { userType: 'expert' } });
        return true;
      } else {
        console.error("Navbar: Expert logout failed");
        toast.error('Failed to log out as expert. Please try again.', {
          duration: 2000
        });
        return false;
      }
    } catch (error) {
      console.error('Error during expert logout:', error);
      toast.error('Failed to log out as expert. Please try again.', {
        duration: 2000
      });
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Handle full logout (both user and expert) with 2-second toast
  const handleFullLogout = async (): Promise<boolean> => {
    if (isLoggingOut) return false;
    
    try {
      setIsLoggingOut(true);
      console.log("Navbar: Initiating full logout...");
      const success = await logout();
      
      if (success) {
        toast.success('Successfully logged out of all accounts', {
          duration: 2000
        });
        const primaryType = finalSessionType === 'expert' ? 'expert' : 'user';
        navigate('/logout', { state: { userType: primaryType } });
      }
      
      return success;
    } catch (error) {
      console.error('Error during full logout:', error);
      toast.error('Failed to log out. Please try again.', {
        duration: 2000
      });
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Updated to have consistent light background across all pages
  const getNavbarBackground = () => {
    return scrolled ? 'bg-background/90' : 'bg-transparent';
  };

  // Enhanced authentication state logging for debugging
  console.log("Navbar rendering. Combined auth state:", {
    // Original auth states
    originalIsAuthenticated: Boolean(isAuthenticated),
    originalSessionType: sessionType,
    // Expert auth states
    expertIsAuthenticated: Boolean(expertAuth.isAuthenticated),
    expertHasProfile: Boolean(expertAuth.currentExpert),
    expertLoading: Boolean(expertAuth.isLoading),
    // Final combined states
    finalIsAuthenticated: Boolean(finalIsAuthenticated),
    finalSessionType,
    finalHasExpertProfile: Boolean(finalHasExpertProfile),
    // Other states
    currentUser: !!currentUser,
    hasDualSessions: Boolean(hasDualSessions),
    hasUser: !!user,
    hasSession: !!session
  });

  return (
    <>
      {hasDualSessions && (
        <Alert variant="destructive" className="rounded-none w-full">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Warning: Multiple Sessions</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>You are currently logged in as both a user and an expert. This may cause authentication issues.</span>
            <Button 
              variant="destructive" 
              onClick={handleFullLogout}
              disabled={isLoggingOut}
              size="sm"
              className="ml-4"
            >
              {isLoggingOut ? 'Logging out...' : 'Log out completely'}
            </Button>
          </AlertDescription>
        </Alert>
      )}
      <div className={`sticky top-0 w-full backdrop-blur-md z-50 transition-colors ${getNavbarBackground()} shadow-sm`}>
        <div className="container-fluid px-4 sm:px-6 lg:px-8 flex h-24 items-center justify-between">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/55b74deb-7ab0-4410-a3db-d3706db1d19a.png" 
              alt="iFindLife" 
              className="h-14 transform scale-150 origin-left" 
            />
          </Link>
          
          <NavbarDesktopLinks 
            isAuthenticated={Boolean(finalIsAuthenticated)}
            currentUser={currentUser}
            hasExpertProfile={Boolean(finalHasExpertProfile)}
            userLogout={handleUserLogout}
            expertLogout={handleExpertLogout}
            sessionType={finalSessionType as 'none' | 'user' | 'expert' | 'dual'}
            isLoggingOut={isLoggingOut}
          />
          
          <NavbarMobileMenu 
            isAuthenticated={Boolean(finalIsAuthenticated)}
            currentUser={currentUser}
            hasExpertProfile={Boolean(finalHasExpertProfile)}
            userLogout={handleUserLogout}
            expertLogout={handleExpertLogout}
            sessionType={finalSessionType as 'none' | 'user' | 'expert' | 'dual'}
            isLoggingOut={isLoggingOut}
          />
        </div>
      </div>
    </>
  );
};

export default Navbar;
