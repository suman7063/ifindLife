
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NavbarDesktopLinks from './navbar/NavbarDesktopLinks';
import NavbarMobileMenu from './navbar/NavbarMobileMenu';
import { showLogoutSuccessToast, showLogoutErrorToast } from '@/utils/toastConfig';
import { useUnifiedAuth } from '@/contexts/auth/UnifiedAuthContext';
import { UserProfile, ExpertProfile, AdminProfile } from '@/types/database/unified';

// Type guard functions
const isUserProfile = (profile: any): profile is UserProfile => {
  return profile && 'wallet_balance' in profile && 'currency' in profile;
};

const isExpertProfile = (profile: any): profile is ExpertProfile => {
  return profile && 'specialization' in profile && 'experience' in profile;
};

const isAdminProfile = (profile: any): profile is AdminProfile => {
  return profile && 'role' in profile && !('wallet_balance' in profile) && !('specialization' in profile);
};

// Helper function to get common properties safely
const getCommonProfileProps = (profile: UserProfile | ExpertProfile | AdminProfile | null) => {
  if (!profile) return { name: '', email: '' };
  
  return {
    name: profile.name || '',
    email: profile.email || '',
    id: profile.id || ''
  };
};

// Helper function to create a compatible currentUser object for NavbarDesktopLinks
const createCompatibleUser = (profile: UserProfile | ExpertProfile | AdminProfile | null) => {
  if (!profile) return null;
  
  const commonProps = getCommonProfileProps(profile);
  
  if (isUserProfile(profile)) {
    return profile; // Already compatible
  }
  
  if (isExpertProfile(profile)) {
    // Create a UserProfile-like object for compatibility
    return {
      ...commonProps,
      phone: profile.phone || '',
      country: profile.country || '',
      city: profile.city || '',
      currency: 'USD', // Default currency for experts
      profile_picture: profile.profile_picture || '',
      wallet_balance: 0, // Experts don't have wallet balance in navbar context
      created_at: profile.created_at || '',
      updated_at: profile.created_at || '',
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
    } as UserProfile;
  }
  
  if (isAdminProfile(profile)) {
    // Create a UserProfile-like object for compatibility
    return {
      ...commonProps,
      phone: '',
      country: '',
      city: '',
      currency: 'USD',
      profile_picture: '',
      wallet_balance: 0,
      created_at: profile.created_at || '',
      updated_at: profile.created_at || '',
      referred_by: null,
      referral_code: '',
      referral_link: '',
      favorite_experts: [],
      favorite_programs: [],
      enrolled_courses: [],
      reviews: [],
      reports: [],
      referrals: []
    } as UserProfile;
  }
  
  return null;
};

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
  const currentProfile = sessionType === 'expert' ? expert : 
                        sessionType === 'admin' ? admin : 
                        sessionType === 'user' ? user : null;

  // Create compatible user object for navbar components
  const currentUser = createCompatibleUser(currentProfile);

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
