
import React, { useState, useEffect, memo, useMemo, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NavbarDesktopLinks from './navbar/NavbarDesktopLinks';
import NavbarMobileMenu from './navbar/NavbarMobileMenu';
import { showLogoutSuccessToast, showLogoutErrorToast } from '@/utils/toastConfig';
import { useEnhancedUnifiedAuth } from '@/contexts/auth/EnhancedUnifiedAuthContext';
import { UserProfile, ExpertProfile, AdminProfile } from '@/types/database/unified';

// Add render counter for performance monitoring
let navbarRenderCount = 0;

// Memoized helper function to create a compatible currentUser object
const createCompatibleUser = memo((userProfile: UserProfile | null, expertProfile: ExpertProfile | null, adminProfile: AdminProfile | null, sessionType: 'user' | 'expert' | 'admin' | null): UserProfile | null => {
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
});

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

  // Memoize authentication state to prevent unnecessary re-renders
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

  // Memoize compatible user object
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

  // Memoized scroll effect
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

  // Memoized logout handler
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

  // Memoized navbar background calculation
  const navbarBackground = useMemo(() => {
    return scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-white';
  }, [scrolled]);

  // Enhanced authentication state logging for debugging
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

  // Show minimal loading state only for first few renders
  const shouldShowLoadingState = authMemo.isLoading && navbarRenderCount <= 3;

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
            <div className="text-xs text-gray-400">Auth: {navbarRenderCount}</div>
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
        
        {/* Debug: Show current auth state */}
        <div className="hidden lg:flex text-xs text-gray-500 absolute left-1/2 transform -translate-x-1/2">
          Auth: {authMemo.isAuthenticated ? 'Yes' : 'No'} | 
          Loading: {authMemo.isLoading ? 'Yes' : 'No'} | 
          Type: {authMemo.sessionType || 'none'}
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
        
        {/* DEBUG INFO - Temporary verification */}
        <div className="fixed top-20 right-0 bg-green-100 p-2 text-xs z-50 border border-green-300">
          <div>Renders: {navbarRenderCount}</div>
          <div>Auth: {authMemo.isAuthenticated.toString()}</div>
          <div>Loading: {authMemo.isLoading.toString()}</div>
          <div>Type: {authMemo.sessionType || 'none'}</div>
          <div>User: {currentUser?.email || 'none'}</div>
        </div>
      </div>
    </div>
  );
};

// Export memoized component to prevent unnecessary re-renders
const Navbar = memo(NavbarComponent);

export default Navbar;
