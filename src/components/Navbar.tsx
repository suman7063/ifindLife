
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
    currentUser, 
    expertProfile,
    userLogout,
    expertLogout,
    fullLogout,
    hasDualSessions
  } = useAuthSynchronization();
  const location = useLocation();

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

  const handleUserLogout = async (): Promise<boolean> => {
    if (isLoggingOut) return false;
    
    try {
      setIsLoggingOut(true);
      console.log("Navbar: Initiating user logout...");
      const success = await userLogout();
      
      if (success) {
        console.log("Navbar: User logout successful");
        toast.success('Successfully logged out');
        // Force page reload to ensure clean state
        window.location.href = '/';
        return true;
      } else {
        console.error("Navbar: User logout failed");
        toast.error('Logout failed. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Error during user logout:', error);
      toast.error('Failed to log out. Please try again.');
      
      // Force reload as a last resort
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleExpertLogout = async (): Promise<boolean> => {
    if (isLoggingOut) return false;
    
    try {
      setIsLoggingOut(true);
      console.log("Navbar: Initiating expert logout...");
      const success = await expertLogout();
      
      if (success) {
        console.log("Navbar: Expert logout completed");
        toast.success('Successfully logged out as expert');
        
        // Force page reload to ensure clean state
        window.location.href = '/';
        return true;
      } else {
        console.error("Navbar: Expert logout failed");
        toast.error('Failed to log out as expert. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Error during expert logout:', error);
      toast.error('Failed to log out as expert. Please try again.');
      
      // Force reload as a last resort
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleFullLogout = async (): Promise<boolean> => {
    if (isLoggingOut) return false;
    
    try {
      setIsLoggingOut(true);
      console.log("Navbar: Initiating full logout...");
      const success = await fullLogout();
      
      if (success) {
        console.log("Navbar: Full logout completed");
        toast.success('Successfully logged out of all accounts');
        
        // Force page reload to ensure clean state
        window.location.href = '/';
        return true;
      } else {
        console.error("Navbar: Full logout failed");
        toast.error('Failed to log out completely. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Error during full logout:', error);
      toast.error('Failed to log out. Please try again.');
      
      // Force reload as a last resort
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {hasDualSessions && (
        <Alert variant="destructive" className="rounded-none">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Warning: Multiple Sessions</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>You are currently logged in as both a user and an expert. Please log out of all accounts to avoid issues.</span>
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
      <div className={`sticky top-0 w-full backdrop-blur-md z-50 transition-colors ${scrolled ? 'bg-background/90 shadow-sm' : 'bg-transparent'}`}>
        <div className="container flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/55b74deb-7ab0-4410-a3db-d3706db1d19a.png" 
              alt="iFindLife" 
              className="h-12 transform scale-125 origin-left" 
            />
          </Link>
          
          <NavbarDesktopLinks 
            isAuthenticated={isAuthenticated}
            currentUser={currentUser}
            hasExpertProfile={isExpertAuthenticated}
            userLogout={handleUserLogout}
            expertLogout={handleExpertLogout}
          />
          
          <NavbarMobileMenu 
            isAuthenticated={isAuthenticated}
            currentUser={currentUser}
            hasExpertProfile={isExpertAuthenticated}
            userLogout={handleUserLogout}
            expertLogout={handleExpertLogout}
          />
        </div>
      </div>
    </>
  );
};

export default Navbar;
