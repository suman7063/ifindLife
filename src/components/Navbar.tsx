
import React, { useState, useEffect, memo, useMemo, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NavbarDesktopLinks from './navbar/NavbarDesktopLinks';
import NavbarMobileMenu from './navbar/NavbarMobileMenu';
import { showLogoutSuccessToast, showLogoutErrorToast } from '@/utils/toastConfig';
import { useAuth } from '@/contexts/auth/UnifiedAuthContext';
import { UserProfile } from '@/types/database/unified';

// Helper function to create a compatible currentUser object for NavbarDesktopLinks
const createCompatibleUser = (userProfile: UserProfile | null, expertProfile: any | null, sessionType: 'user' | 'expert' | null): UserProfile | null => {
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
  
  return null;
};

const NavbarComponent = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const {
    isAuthenticated,
    sessionType,
    user,
    userProfile,
    expertProfile,
    isLoading,
    logout
  } = useAuth();

  // Memoize compatible user object to prevent unnecessary re-renders
  const currentUser = useMemo(() => 
    createCompatibleUser(userProfile, expertProfile, sessionType),
    [userProfile, expertProfile, sessionType]
  );

  const hasExpertProfile = useMemo(() => 
    sessionType === 'expert' && !!expertProfile,
    [sessionType, expertProfile]
  );

  // Convert sessionType to match expected interface
  const navbarSessionType = useMemo((): 'user' | 'expert' | 'none' | 'dual' => {
    if (!sessionType) return 'none';
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

  // Memoize logout handler
  const handleLogout = useCallback(async (): Promise<boolean> => {
    try {
      console.log("🔒 Navbar: Initiating logout...");
      
      const success = await logout();
      
      if (success) {
        console.log("🔒 Navbar: Logout successful");
        showLogoutSuccessToast();
        const redirectPath = sessionType === 'expert' ? '/expert-login' : '/user-login';
        navigate(redirectPath);
        return true;
      } else {
        showLogoutErrorToast();
        return false;
      }
    } catch (error) {
      console.error('🔒 Navbar: Error during logout:', error);
      showLogoutErrorToast();
      return false;
    }
  }, [logout, sessionType, navigate]);

  const navbarBackground = useMemo(() => 
    scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-white', [scrolled]);

  // Only log when auth state actually changes to prevent log spam
  const authStateRef = React.useRef<string>('');
  const currentAuthState = `${isAuthenticated}-${sessionType}-${!!currentUser}-${hasExpertProfile}`;
  
  if (authStateRef.current !== currentAuthState) {
    console.log("🔒 Navbar state:", {
      isAuthenticated,
      sessionType,
      isLoading,
      hasCurrentUser: !!currentUser,
      hasExpertProfile
    });
    authStateRef.current = currentAuthState;
  }

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
          isAuthenticated={isAuthenticated} 
          currentUser={currentUser} 
          hasExpertProfile={hasExpertProfile} 
          userLogout={handleLogout} 
          expertLogout={handleLogout} 
          sessionType={navbarSessionType} 
          isLoggingOut={false} 
        />
        
        <NavbarMobileMenu 
          isAuthenticated={isAuthenticated} 
          currentUser={currentUser} 
          hasExpertProfile={hasExpertProfile} 
          userLogout={handleLogout} 
          expertLogout={handleLogout} 
          sessionType={navbarSessionType} 
          isLoggingOut={false} 
        />
      </div>
    </div>
  );
};

export default memo(NavbarComponent);
