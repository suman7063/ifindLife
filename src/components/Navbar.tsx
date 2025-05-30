
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NavbarDesktopLinks from './navbar/NavbarDesktopLinks';
import NavbarMobileMenu from './navbar/NavbarMobileMenu';
import { toast } from 'sonner';
import { useUnifiedAuth } from '@/contexts/auth/UnifiedAuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Use unified auth context
  const { 
    isAuthenticated, 
    sessionType, 
    user, 
    admin, 
    expert, 
    isLoading,
    logout 
  } = useUnifiedAuth();

  // Determine current user based on session type
  const currentUser = sessionType === 'expert' ? expert : 
                     sessionType === 'admin' ? admin : 
                     sessionType === 'user' ? user : null;

  const hasExpertProfile = sessionType === 'expert' && !!expert;
  const hasAdminProfile = sessionType === 'admin' && !!admin;

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

  // Handle logout
  const handleLogout = async (): Promise<boolean> => {
    try {
      console.log("Navbar: Initiating logout...");
      await logout();
      console.log("Navbar: Logout successful");
      
      // Redirect based on session type
      const redirectPath = sessionType === 'expert' ? '/expert-login' : 
                          sessionType === 'admin' ? '/admin-login' : 
                          '/user-login';
      
      navigate(redirectPath);
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Failed to log out. Please try again.');
      return false;
    }
  };

  // Updated to have consistent light background across all pages
  const getNavbarBackground = () => {
    return scrolled ? 'bg-background/90' : 'bg-transparent';
  };

  // Enhanced authentication state logging for debugging
  console.log("Navbar rendering. Unified auth state:", {
    isAuthenticated: Boolean(isAuthenticated),
    sessionType,
    isLoading: Boolean(isLoading),
    hasCurrentUser: Boolean(currentUser),
    hasExpertProfile: Boolean(hasExpertProfile),
    hasAdminProfile: Boolean(hasAdminProfile)
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className={`sticky top-0 w-full backdrop-blur-md z-50 transition-colors ${getNavbarBackground()} shadow-sm`}>
        <div className="container-fluid px-4 sm:px-6 lg:px-8 flex h-24 items-center justify-between">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/55b74deb-7ab0-4410-a3db-d3706db1d19a.png" 
              alt="iFindLife" 
              className="h-14 transform scale-150 origin-left" 
            />
          </Link>
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <>
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
            isAuthenticated={Boolean(isAuthenticated)}
            currentUser={currentUser}
            hasExpertProfile={Boolean(hasExpertProfile)}
            userLogout={handleLogout}
            expertLogout={handleLogout}
            sessionType={sessionType || 'none'}
            isLoggingOut={false}
          />
          
          <NavbarMobileMenu 
            isAuthenticated={Boolean(isAuthenticated)}
            currentUser={currentUser}
            hasExpertProfile={Boolean(hasExpertProfile)}
            userLogout={handleLogout}
            expertLogout={handleLogout}
            sessionType={sessionType || 'none'}
            isLoggingOut={false}
          />
        </div>
      </div>
    </>
  );
};

export default Navbar;
