
import React, { useState, useEffect, memo, useMemo, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NavbarDesktopLinks from './navbar/NavbarDesktopLinks';
import NavbarMobileMenu from './navbar/NavbarMobileMenu';
import { showLogoutSuccessToast, showLogoutErrorToast } from '@/utils/toastConfig';
import { useEnhancedUnifiedAuth } from '@/contexts/auth/EnhancedUnifiedAuthContext';
import { UserProfile, ExpertProfile, AdminProfile } from '@/types/database/unified';

// Add render counter for performance monitoring
let navbarRenderCount = 0;

// FIXED: Stable helper function moved outside component to prevent recreations
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
  const authState = useEnhancedUnifiedAuth();

  // FIXED: Stable authentication state to prevent excessive re-renders
  const authMemo = useMemo(() => {
    const isAuthenticated = Boolean(authState.isAuthenticated && authState.user && !authState.isLoading);
    const hasExpertProfile = Boolean(authState.sessionType === 'expert' && authState.expert);
    const hasAdminProfile = Boolean(authState.sessionType === 'admin' && authState.admin);
    
    return {
      isAuthenticated,
      hasExpertProfile,
      hasAdminProfile,
      sessionType: authState.sessionType,
      isLoading: authState.isLoading,
      user: authState.user
    };
  }, [authState.isAuthenticated, authState.user, authState.isLoading, authState.sessionType, authState.expert, authState.admin]);

  // FIXED: Stable compatible user object
  const currentUser = useMemo(() => 
    createCompatibleUser(authState.userProfile, authState.expertProfile, authState.adminProfile, authState.sessionType),
    [authState.userProfile, authState.expertProfile, authState.adminProfile, authState.sessionType]
  );

  // Convert sessionType to match expected interface
  const navbarSessionType = useMemo((): 'user' | 'expert' | 'none' | 'dual' => {
    if (!authState.sessionType) return 'none';
    if (authState.sessionType === 'admin') return 'user';
    if (authState.sessionType === 'expert') return 'expert';
    return 'user';
  }, [authState.sessionType]);

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

  // FIXED: Stable logout handler with proper error handling
  const handleLogout = useCallback(async (): Promise<boolean> => {
    try {
      console.log("🔒 Navbar: Initiating logout...", {
        sessionType: authState.sessionType,
        hasUser: !!authState.user,
        timestamp: new Date().toISOString()
      });
      
      await authState.logout();
      
      console.log("🔒 Navbar: Logout successful");
      showLogoutSuccessToast();

      const redirectPath = authState.sessionType === 'expert' ? '/expert-login' : authState.sessionType === 'admin' ? '/admin-login' : '/user-login';
      navigate(redirectPath);
      return true;
    } catch (error) {
      console.error('🔒 Navbar: Error during logout:', error);
      showLogoutErrorToast();
      return false;
    }
  }, [authState.logout, authState.sessionType, authState.user, navigate]);

  // Stable navbar background calculation
  const navbarBackground = useMemo(() => {
    return scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-white';
  }, [scrolled]);

  // FIXED: Conditional rendering to prevent excessive re-renders during loading
  const shouldShowLoadingState = authMemo.isLoading && navbarRenderCount <= 2;

  // Enhanced authentication state logging for debugging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log("🔒 Navbar rendering. Optimized auth state:", {
      isAuthenticated: authMemo.isAuthenticated,
      sessionType: authMemo.sessionType,
      navbarSessionType,
      isLoading: authMemo.isLoading,
      hasCurrentUser: Boolean(currentUser),
      hasExpertProfile: authMemo.hasExpertProfile,
      hasAdminProfile: authMemo.hasAdminProfile,
      userEmail: authMemo.user?.email || 'No user',
      renderCount: navbarRenderCount,
      timestamp: new Date().toISOString()
    });
  }

  if (shouldShowLoadingState) {
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
          isAuthenticated={authMemo.isAuthenticated} 
          currentUser={currentUser} 
          hasExpertProfile={authMemo.hasExpertProfile} 
          userLogout={handleLogout} 
          expertLogout={handleLogout} 
          sessionType={navbarSessionType} 
          isLoggingOut={false}
          isLoading={authMemo.isLoading}
        />
        
        <NavbarMobileMenu 
          isAuthenticated={authMemo.isAuthenticated} 
          currentUser={currentUser} 
          hasExpertProfile={authMemo.hasExpertProfile} 
          userLogout={handleLogout} 
          expertLogout={handleLogout} 
          sessionType={navbarSessionType} 
          isLoggingOut={false} 
        />
      </div>
    </div>
  );
};

// FIXED: Proper memoization to prevent unnecessary re-renders
const Navbar = memo(NavbarComponent);

export default Navbar;
