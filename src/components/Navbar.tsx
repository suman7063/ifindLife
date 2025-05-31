
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NavbarDesktopLinks from './navbar/NavbarDesktopLinks';
import NavbarMobileMenu from './navbar/NavbarMobileMenu';
import { showLogoutSuccessToast, showLogoutErrorToast } from '@/utils/toastConfig';
import { useUnifiedAuth } from '@/contexts/auth/UnifiedAuthContext';

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

  // Convert sessionType to match expected interface
  const convertSessionType = (type: 'user' | 'admin' | 'expert' | null): 'user' | 'expert' | 'none' | 'dual' => {
    if (!type) return 'none';
    if (type === 'admin') return 'user'; // Treat admin as user for navbar purposes
    if (type === 'expert') return 'expert';
    return 'user';
  };

  const navbarSessionType = convertSessionType(sessionType);

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

  // Handle logout with consistent messaging
  const handleLogout = async (): Promise<boolean> => {
    try {
      console.log("Navbar: Initiating logout...");
      await logout();
      console.log("Navbar: Logout successful");
      
      showLogoutSuccessToast();
      
      // Redirect based on session type
      const redirectPath = sessionType === 'expert' ? '/expert-login' : 
                          sessionType === 'admin' ? '/admin-login' : 
                          '/user-login';
      
      navigate(redirectPath);
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      showLogoutErrorToast();
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
    navbarSessionType,
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
              className="h-28 transform scale-150 origin-left" 
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
              className="h-28 transform scale-150 origin-left" 
            />
          </Link>
          
          <NavbarDesktopLinks 
            isAuthenticated={Boolean(isAuthenticated)}
            currentUser={currentUser}
            hasExpertProfile={Boolean(hasExpertProfile)}
            userLogout={handleLogout}
            expertLogout={handleLogout}
            sessionType={navbarSessionType}
            isLoggingOut={false}
          />
          
          <NavbarMobileMenu 
            isAuthenticated={Boolean(isAuthenticated)}
            currentUser={currentUser}
            hasExpertProfile={Boolean(hasExpertProfile)}
            userLogout={handleLogout}
            expertLogout={handleLogout}
            sessionType={navbarSessionType}
            isLoggingOut={false}
          />
        </div>
      </div>
    </>
  );
};

export default Navbar;
