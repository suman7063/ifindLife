
import React, { useState, useEffect, memo, useMemo, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NavbarDesktopLinks from './navbar/NavbarDesktopLinks';
import NavbarMobileMenu from './navbar/NavbarMobileMenu';
import { showLogoutSuccessToast, showLogoutErrorToast } from '@/utils/toastConfig';
import { useEnhancedUnifiedAuth } from '@/contexts/auth/EnhancedUnifiedAuthContext';
import { UserProfile, ExpertProfile, AdminProfile } from '@/types/database/unified';

// FIXED: Stable helper function moved outside component
const createCompatibleUser = (userProfile: UserProfile | null, expertProfile: ExpertProfile | null, adminProfile: AdminProfile | null, sessionType: 'user' | 'expert' | 'admin' | null): UserProfile | null => {
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

// FIXED: Render tracking for debugging
const useRenderTracker = (componentName: string) => {
  const renderCountRef = React.useRef(0);
  renderCountRef.current += 1;
  
  // FIXED: Only log first few renders to prevent spam
  if (renderCountRef.current <= 3) {
    console.log(`🔒 ${componentName} render count: ${renderCountRef.current}`);
  }
  
  return renderCountRef.current;
};

const NavbarComponent = () => {
  // FIXED: Track renders for debugging
  const renderCount = useRenderTracker('Navbar');
  
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // FIXED: Destructure only what we need to minimize dependencies
  const { 
    isAuthenticated, 
    sessionType, 
    user, 
    userProfile, 
    expertProfile, 
    adminProfile, 
    isLoading,
    logout: authLogout 
  } = useEnhancedUnifiedAuth();

  // FIXED: Stable compatible user object
  const currentUser = useMemo(() => 
    createCompatibleUser(userProfile, expertProfile, adminProfile, sessionType),
    [userProfile, expertProfile, adminProfile, sessionType]
  );

  // FIXED: Stable derived values
  const authData = useMemo(() => ({
    isAuthenticated: Boolean(isAuthenticated),
    hasExpertProfile: Boolean(sessionType === 'expert' && expertProfile),
    hasAdminProfile: Boolean(sessionType === 'admin' && adminProfile),
    sessionType,
    isLoading: Boolean(isLoading)
  }), [isAuthenticated, sessionType, expertProfile, adminProfile, isLoading]);

  // FIXED: Convert sessionType to match expected interface
  const navbarSessionType = useMemo((): 'user' | 'expert' | 'none' | 'dual' => {
    if (!sessionType) return 'none';
    if (sessionType === 'admin') return 'user';
    if (sessionType === 'expert') return 'expert';
    return 'user';
  }, [sessionType]);

  // FIXED: Stable scroll effect with proper cleanup
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // FIXED: Stable logout handler
  const handleLogout = useCallback(async (): Promise<boolean> => {
    try {
      console.log("🔒 Navbar: Initiating logout...", {
        sessionType,
        hasUser: !!user
      });
      
      await authLogout();
      
      console.log("🔒 Navbar: Logout successful");
      showLogoutSuccessToast();

      const redirectPath = sessionType === 'expert' ? '/expert-login' : sessionType === 'admin' ? '/admin-login' : '/user-login';
      navigate(redirectPath);
      return true;
    } catch (error) {
      console.error('🔒 Navbar: Error during logout:', error);
      showLogoutErrorToast();
      return false;
    }
  }, [sessionType, user, authLogout, navigate]);

  // FIXED: Stable navbar background calculation
  const navbarBackground = useMemo(() => {
    return scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-white';
  }, [scrolled]);

  // Enhanced authentication state logging (development only) - limited logging
  if (process.env.NODE_ENV === 'development' && renderCount <= 2) {
    console.log("🔒 Navbar rendering with auth data:", {
      isAuthenticated: authData.isAuthenticated,
      sessionType,
      hasCurrentUser: Boolean(currentUser),
      hasExpertProfile: authData.hasExpertProfile,
      hasAdminProfile: authData.hasAdminProfile,
      userEmail: user?.email || 'No user',
      renderCount
    });
  }

  // FIXED: Brief loading state only for initial render
  if (authData.isLoading && renderCount === 1) {
    console.log('🔒 Navbar showing brief loading state');
    return (
      <div 
        data-navbar="main" 
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
          </div>
        </div>
      </div>
    );
  }

  console.log('🔒 Navbar rendering main content');

  return (
    <div 
      data-navbar="main"
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
          isAuthenticated={authData.isAuthenticated} 
          currentUser={currentUser} 
          hasExpertProfile={authData.hasExpertProfile} 
          userLogout={handleLogout} 
          expertLogout={handleLogout} 
          sessionType={navbarSessionType} 
          isLoggingOut={false}
          isLoading={authData.isLoading}
        />
        
        <NavbarMobileMenu 
          isAuthenticated={authData.isAuthenticated} 
          currentUser={currentUser} 
          hasExpertProfile={authData.hasExpertProfile} 
          userLogout={handleLogout} 
          expertLogout={handleLogout} 
          sessionType={navbarSessionType} 
          isLoggingOut={false} 
        />
      </div>
    </div>
  );
};

// FIXED: Proper memoization with custom comparison
const Navbar = memo(NavbarComponent, (prevProps, nextProps) => {
  // Since this component doesn't take props, only re-render if forced
  return false; // Always allow re-render but let context value stability prevent unnecessary renders
});

export default Navbar;
