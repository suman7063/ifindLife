
import React, { useState, useEffect, memo, useMemo } from 'react';
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
    // Create a UserProfile-like object for compatibility
    return {
      id: expertProfile.id,
      name: expertProfile.name || '',
      email: expertProfile.email || '',
      phone: expertProfile.phone || '',
      country: expertProfile.country || '',
      city: expertProfile.city || '',
      currency: 'USD', // Default currency for experts
      profile_picture: expertProfile.profile_picture || '',
      wallet_balance: 0, // Experts don't have wallet balance in navbar context
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
    // Create a UserProfile-like object for compatibility
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

// Add render counter for performance monitoring
let navbarRenderCount = 0;

const NavbarComponent = () => {
  // Performance monitoring
  useEffect(() => {
    navbarRenderCount++;
    console.log('🔒 Navbar render count:', navbarRenderCount);
  });

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

  // DEBUG: Add DOM verification effect
  useEffect(() => {
    console.log('🔒 Navbar DOM verification - Component mounted');
    const checkNavbarInDOM = () => {
      const navElement = document.querySelector('[data-navbar="main"]');
      console.log('🔒 Navbar DOM element found:', !!navElement);
      if (navElement) {
        const computedStyles = window.getComputedStyle(navElement);
        console.log('🔒 Navbar computed styles:', {
          display: computedStyles.display,
          visibility: computedStyles.visibility,
          opacity: computedStyles.opacity,
          height: computedStyles.height,
          width: computedStyles.width,
          position: computedStyles.position,
          top: computedStyles.top,
          zIndex: computedStyles.zIndex,
          backgroundColor: computedStyles.backgroundColor
        });
      }
    };
    
    // Check immediately and after a short delay
    checkNavbarInDOM();
    setTimeout(checkNavbarInDOM, 100);
  }, []);

  // Memoize compatible user object for navbar components
  const currentUser = useMemo(() => 
    createCompatibleUser(userProfile, expertProfile, adminProfile, sessionType),
    [userProfile, expertProfile, adminProfile, sessionType]
  );

  const hasExpertProfile = useMemo(() => 
    sessionType === 'expert' && !!expert,
    [sessionType, expert]
  );

  const hasAdminProfile = useMemo(() => 
    sessionType === 'admin' && !!admin,
    [sessionType, admin]
  );

  // Convert sessionType to match expected interface
  const navbarSessionType = useMemo((): 'user' | 'expert' | 'none' | 'dual' => {
    if (!sessionType) return 'none';
    if (sessionType === 'admin') return 'user'; // Treat admin as user for navbar purposes
    if (sessionType === 'expert') return 'expert';
    return 'user';
  }, [sessionType]);

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
      console.log("🔒 Navbar: Initiating logout...", {
        sessionType,
        hasUser: !!user,
        timestamp: new Date().toISOString()
      });
      
      await logout();
      
      console.log("🔒 Navbar: Logout successful");
      showLogoutSuccessToast();

      // Redirect based on session type
      const redirectPath = sessionType === 'expert' ? '/expert-login' : sessionType === 'admin' ? '/admin-login' : '/user-login';
      navigate(redirectPath);
      return true;
    } catch (error) {
      console.error('🔒 Navbar: Error during logout:', error);
      showLogoutErrorToast();
      return false;
    }
  };

  // Enhanced navbar background calculation with debug
  const navbarBackground = useMemo(() => {
    const bgClass = scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-white';
    console.log('🔒 Navbar background class:', bgClass);
    return bgClass;
  }, [scrolled]);

  // Enhanced authentication state logging for debugging
  console.log("🔒 Navbar rendering. Enhanced unified auth state:", {
    isAuthenticated: Boolean(isAuthenticated),
    sessionType,
    navbarSessionType,
    isLoading: Boolean(isLoading),
    hasCurrentUser: Boolean(currentUser),
    hasExpertProfile: Boolean(hasExpertProfile),
    hasAdminProfile: Boolean(hasAdminProfile),
    userEmail: user?.email || 'No user',
    renderCount: navbarRenderCount,
    timestamp: new Date().toISOString()
  });

  // DEBUG STYLING - Force navbar to be visible
  const debugStyle = {
    backgroundColor: '#ffffff',
    minHeight: '80px',
    width: '100%',
    display: 'block',
    visibility: 'visible',
    opacity: 1,
    zIndex: 50,
    position: 'sticky' as const,
    top: 0,
    border: '1px solid #e5e7eb',
    boxShadow: scrolled ? '0 1px 3px 0 rgba(0, 0, 0, 0.1)' : 'none'
  };

  // Show enhanced loading state with debug info
  if (isLoading) {
    console.log('🔒 Navbar showing loading state');
    return (
      <div 
        data-navbar="main" 
        style={debugStyle}
        className={`sticky top-0 w-full z-50 transition-colors ${navbarBackground} border-b border-gray-100`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-20 items-center justify-between">
          <div className="flex items-center gap-2 relative">
            <Link to="/" className="flex items-center">
              <img src="/lovable-uploads/55b74deb-7ab0-4410-a3db-d3706db1d19a.png" alt="iFindLife" className="h-10" />
            </Link>
            <span className="absolute -top-1 -right-6 bg-gray-400 text-white text-[8px] px-1 py-0.5 rounded font-medium">
              BETA
            </span>
          </div>
          <div className="text-gray-500 flex items-center gap-2">
            <div className="animate-pulse">Loading...</div>
            <div className="text-xs text-gray-400">Auth: {navbarRenderCount}</div>
          </div>
        </div>
      </div>
    );
  }

  console.log('🔒 Navbar rendering main content');

  // Normal navbar with debug styling - shows appropriate state based on authentication
  return (
    <div 
      data-navbar="main"
      style={debugStyle}
      className={`sticky top-0 w-full z-50 transition-colors ${navbarBackground} border-b border-gray-100`}
    >
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
        
        {/* DEBUG INFO - Remove this after fixing */}
        <div className="fixed top-20 right-0 bg-red-100 p-2 text-xs z-50 border border-red-300">
          <div>Renders: {navbarRenderCount}</div>
          <div>Auth: {Boolean(isAuthenticated).toString()}</div>
          <div>Loading: {Boolean(isLoading).toString()}</div>
          <div>Type: {sessionType || 'none'}</div>
        </div>
      </div>
    </div>
  );
};

// Export memoized component to prevent unnecessary re-renders
const Navbar = memo(NavbarComponent);

export default Navbar;
