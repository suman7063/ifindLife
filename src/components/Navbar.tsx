
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NavbarDesktopLinks from './navbar/NavbarDesktopLinks';
import NavbarMobileMenu from './navbar/NavbarMobileMenu';
import { toast } from 'sonner';
import { useAuthSynchronization } from '@/hooks/useAuthSynchronization';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { 
    isAuthenticated, 
    isExpertAuthenticated,
    isUserAuthenticated,
    currentUser, 
    currentExpert,
    userLogout,
    expertLogout,
    fullLogout,
    hasDualSessions,
    sessionType
  } = useAuthSynchronization();
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

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

  // Handle user logout
  const handleUserLogout = async (): Promise<boolean> => {
    if (isLoggingOut) return false;
    
    try {
      setIsLoggingOut(true);
      console.log("Navbar: Initiating user logout...");
      const success = await userLogout();
      
      if (success) {
        console.log("Navbar: User logout successful");
        navigate('/');
        return true;
      } else {
        console.error("Navbar: User logout failed");
        toast.error('Logout failed. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Error during user logout:', error);
      toast.error('Failed to log out. Please try again.');
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Handle expert logout
  const handleExpertLogout = async (): Promise<boolean> => {
    if (isLoggingOut) return false;
    
    try {
      setIsLoggingOut(true);
      console.log("Navbar: Initiating expert logout...");
      const success = await expertLogout();
      
      if (success) {
        console.log("Navbar: Expert logout completed");
        navigate('/');
        return true;
      } else {
        console.error("Navbar: Expert logout failed");
        toast.error('Failed to log out as expert. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Error during expert logout:', error);
      toast.error('Failed to log out as expert. Please try again.');
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Handle full logout (both user and expert)
  const handleFullLogout = async (): Promise<boolean> => {
    if (isLoggingOut) return false;
    
    try {
      setIsLoggingOut(true);
      console.log("Navbar: Initiating full logout...");
      const success = await fullLogout();
      
      if (success) {
        navigate('/');
      }
      
      return success;
    } catch (error) {
      console.error('Error during full logout:', error);
      toast.error('Failed to log out. Please try again.');
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Updated to have consistent light background across all pages
  const getNavbarBackground = () => {
    return scrolled ? 'bg-background/90' : 'bg-transparent';
  };

  return (
    <>
      {hasDualSessions && (
        <Alert variant="destructive" className="rounded-none">
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
        <div className="container flex h-24 items-center justify-between">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/55b74deb-7ab0-4410-a3db-d3706db1d19a.png" 
              alt="iFindLife" 
              className="h-14 transform scale-150 origin-left" 
            />
          </Link>
          
          <NavbarDesktopLinks 
            isAuthenticated={isAuthenticated}
            currentUser={currentUser}
            hasExpertProfile={isExpertAuthenticated}
            userLogout={handleUserLogout}
            expertLogout={handleExpertLogout}
            sessionType={sessionType as 'user' | 'expert' | 'none' | 'dual'}
            isLoggingOut={isLoggingOut}
          />
          
          <NavbarMobileMenu 
            isAuthenticated={isAuthenticated}
            currentUser={currentUser}
            hasExpertProfile={isExpertAuthenticated}
            userLogout={handleUserLogout}
            expertLogout={handleExpertLogout}
            sessionType={sessionType as 'user' | 'expert' | 'none' | 'dual'}
            isLoggingOut={isLoggingOut}
          />
        </div>
      </div>
    </>
  );
};

export default Navbar;
