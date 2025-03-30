
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import NavbarDesktopLinks from './navbar/NavbarDesktopLinks';
import NavbarMobileMenu from './navbar/NavbarMobileMenu';
import { toast } from 'sonner';
import { useAuthSynchronization } from '@/hooks/useAuthSynchronization';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { 
    isUserAuthenticated, 
    isExpertAuthenticated, 
    currentUser, 
    expertProfile,
    userLogout,
    expertLogout
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

  const handleUserLogout = async () => {
    if (isLoggingOut) return;
    
    try {
      setIsLoggingOut(true);
      console.log("Navbar: Initiating user logout...");
      const success = await userLogout();
      
      if (success) {
        console.log("Navbar: User logout successful");
        toast.success('Successfully logged out');
        // Force page reload to ensure clean state
        window.location.href = '/';
      } else {
        console.error("Navbar: User logout failed");
        toast.error('Logout failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during user logout:', error);
      toast.error('Failed to log out. Please try again.');
      
      // Force reload as a last resort
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleExpertLogout = async () => {
    if (isLoggingOut) return;
    
    try {
      setIsLoggingOut(true);
      console.log("Navbar: Initiating expert logout...");
      const success = await expertLogout();
      
      if (success) {
        console.log("Navbar: Expert logout completed");
        toast.success('Successfully logged out as expert');
        
        // Force page reload to ensure clean state
        window.location.href = '/';
      } else {
        console.error("Navbar: Expert logout failed");
        toast.error('Failed to log out as expert. Please try again.');
      }
    } catch (error) {
      console.error('Error during expert logout:', error);
      toast.error('Failed to log out as expert. Please try again.');
      
      // Force reload as a last resort
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
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
          isAuthenticated={isUserAuthenticated}
          currentUser={currentUser}
          hasExpertProfile={isExpertAuthenticated}
          userLogout={handleUserLogout}
          expertLogout={handleExpertLogout}
        />
        
        <NavbarMobileMenu 
          isAuthenticated={isUserAuthenticated}
          currentUser={currentUser}
          hasExpertProfile={isExpertAuthenticated}
          userLogout={handleUserLogout}
          expertLogout={handleExpertLogout}
        />
      </div>
    </div>
  );
};

export default Navbar;
