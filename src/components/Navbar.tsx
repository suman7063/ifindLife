
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NavbarDesktopLinks from './navbar/NavbarDesktopLinks';
import NavbarMobileMenu from './navbar/NavbarMobileMenu';
import { showLogoutSuccessToast, showLogoutErrorToast } from '@/utils/toastConfig';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Use simplified auth hook
  const { isAuthenticated, userType, user, expert, userProfile, isLoading } = useSimpleAuth();

  // Create a compatible user object for backward compatibility
  const currentUser = userProfile || (expert ? {
    id: expert.id,
    name: expert.name || '',
    email: expert.email || '',
    phone: expert.phone || '',
    country: expert.country || '',
    city: expert.city || '',
    currency: 'USD',
    profile_picture: expert.profile_picture || '',
    wallet_balance: 0,
    created_at: expert.created_at || '',
    updated_at: expert.created_at || '',
    referred_by: null,
    referral_code: '',
    referral_link: '',
    favorite_experts: [],
    favorite_programs: [],
    enrolled_courses: [],
    reviews: [],
    reports: [],
    transactions: [],
    referrals: []
  } : null);

  const hasExpertProfile = userType === 'expert' && !!expert;

  // Convert userType to match expected interface
  const convertSessionType = (type: 'user' | 'expert' | 'none'): 'user' | 'expert' | 'none' | 'dual' => {
    return type;
  };
  const navbarSessionType = convertSessionType(userType);

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
      // For now, just clear localStorage and reload
      localStorage.clear();
      showLogoutSuccessToast();
      window.location.reload();
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      showLogoutErrorToast();
      return false;
    }
  };

  const getNavbarBackground = () => {
    return scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-white';
  };

  // Show loading state only if still loading after a brief delay
  if (isLoading) {
    return (
      <div className={`sticky top-0 w-full z-50 transition-colors ${getNavbarBackground()} border-b border-gray-100`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-20 items-center justify-between">
          <div className="flex items-center gap-2 relative">
            <Link to="/" className="flex items-center">
              <img src="/lovable-uploads/55b74deb-7ab0-4410-a3db-d3706db1d19a.png" alt="iFindLife" className="h-10" />
            </Link>
            <span className="absolute -top-1 -right-6 bg-gray-400 text-white text-[8px] px-1 py-0.5 rounded font-medium">
              BETA
            </span>
          </div>
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`sticky top-0 w-full z-50 transition-colors ${getNavbarBackground()} border-b border-gray-100`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-20 items-center justify-between">
        <div className="flex items-center gap-2 relative">
          <Link to="/" className="flex items-center">
            <img src="/lovable-uploads/55b74deb-7ab0-4410-a3db-d3706db1d19a.png" alt="iFindLife" className="h-16" />
          </Link>
          <span className="absolute -top-1 -right-6 bg-gray-400 text-white text-[8px] px-1 py-0.5 rounded font-medium">
            BETA
          </span>
        </div>
        
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
  );
};

export default Navbar;
