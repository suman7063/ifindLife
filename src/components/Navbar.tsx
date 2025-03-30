
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { useExpertAuth } from '@/hooks/expert-auth';
import NavbarDesktopLinks from './navbar/NavbarDesktopLinks';
import NavbarMobileMenu from './navbar/NavbarMobileMenu';
import { toast } from 'sonner';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, currentUser, logout: userLogout } = useUserAuth();
  const { expert, logout: expertLogout } = useExpertAuth();
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
    try {
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
    }
  };

  const handleExpertLogout = async () => {
    try {
      console.log("Navbar: Initiating expert logout...");
      await expertLogout();
      console.log("Navbar: Expert logout completed");
      toast.success('Successfully logged out as expert');
      
      // Force page reload to ensure clean state
      window.location.href = '/';
    } catch (error) {
      console.error('Error during expert logout:', error);
      toast.error('Failed to log out as expert. Please try again.');
      
      // Force reload as a last resort
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
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
          isAuthenticated={isAuthenticated}
          currentUser={currentUser}
          hasExpertProfile={!!expert}
          userLogout={handleUserLogout}
          expertLogout={handleExpertLogout}
        />
        
        <NavbarMobileMenu 
          isAuthenticated={isAuthenticated}
          currentUser={currentUser}
          hasExpertProfile={!!expert}
          userLogout={handleUserLogout}
          expertLogout={handleExpertLogout}
        />
      </div>
    </div>
  );
};

export default Navbar;
