
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NavbarDesktopLinks from './navbar/NavbarDesktopLinks';
import NavbarMobileMenu from './navbar/NavbarMobileMenu';
import { showLogoutSuccessToast, showLogoutErrorToast } from '@/utils/toastConfig';
import { useEnhancedUnifiedAuth } from '@/contexts/auth/EnhancedUnifiedAuthContext';
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
  if (!profile) return {
    name: '',
    email: ''
  };
  return {
    name: profile.name || '',
    email: profile.email || '',
    id: profile.id || ''
  };
};

// Helper function to create a compatible currentUser object for NavbarDesktopLinks
const createCompatibleUser = (userProfile: UserProfile | null, expertProfile: ExpertProfile | null, adminProfile: AdminProfile | null, sessionType: 'user' | 'expert' | 'admin' | null): UserProfile | null => {
  // Return the appropriate profile based on session type
  if (sessionType === 'user' && userProfile) {
    return userProfile;
  }
  
  if (sessionType === 'expert' && expertProfile) {
    return {
      id: expertProfile.id,
      name: expertProfile.name || '',
      email: expertProfile.email || '',
      phone: expertProfile.phone || '',
      country: expertProfile.country || '',
      city: expertProfile.city || '',
      currency: 'USD',
      profile_picture: expertProfile.profile_picture || '',
      wallet_balance: 0,
      created_at: expertProfile.created_at || '',
      updated_at: expertProfile.created_at || '',
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
  
  if (sessionType === 'admin' && adminProfile) {
    return {
      id: adminProfile.id,
      name: adminProfile.name || '',
      email: adminProfile.email || '',
      phone: '',
      country: '',
      city: '',
      currency: 'USD',
      profile_picture: '',
      wallet_balance: 0,
      created_at: adminProfile.created_at || '',
      updated_at: adminProfile.created_at || '',
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
  
  return null;
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Use enhanced unified auth context
  const {
    isAuthenticated,
    sessionType,
    user,
    admin,
    expert,
    userProfile,
    expertProfile,
    adminProfile,
    isLoading,
    logout
  } = useEnhancedUnifiedAuth();

  // Create compatible user object for navbar components
  const currentUser = createCompatibleUser(userProfile, expertProfile, adminProfile, sessionType);
  const hasExpertProfile = sessionType === 'expert' && !!expert;
  const hasAdminProfile = sessionType === 'admin' && !!admin;

  // Convert sessionType to match expected interface
  const convertSessionType = (type: 'user' | 'admin' | 'expert' | null): 'user' | 'expert' | 'none' | 'dual' => {
    if (!type) return 'none';
    if (type === 'admin') return 'user';
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

      const redirectPath = sessionType === 'expert' ? '/expert-login' : sessionType === 'admin' ? '/admin-login' : '/user-login';
      navigate(redirectPath);
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
