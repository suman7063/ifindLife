
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NavbarDesktopLinks from './navbar/NavbarDesktopLinks';
import NavbarMobileMenu from './navbar/NavbarMobileMenu';
import { showLogoutSuccessToast, showLogoutErrorToast } from '@/utils/toastConfig';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { UserProfile } from '@/types/database/unified';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { isAuthenticated, userType, user, expert, userProfile, isLoading, logout, refreshProfiles } = useSimpleAuth();

  // Navbar rendering state tracking

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
      await logout();
      showLogoutSuccessToast();
      navigate('/');
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

  // State to force re-render on profile image update
  const [profileUpdateKey, setProfileUpdateKey] = useState(0);

  // Listen for profile image updates when expert is logged in
  useEffect(() => {
    if (userType !== 'expert') return;

    const handleProfileUpdate = async () => {
      if (user?.id) {
        await refreshProfiles(user.id);
        setProfileUpdateKey(prev => prev + 1); // Force re-render
      }
    };

    window.addEventListener('expertProfileImageUpdated', handleProfileUpdate as EventListener);
    window.addEventListener('expertProfileRefreshed', handleProfileUpdate as EventListener);

    return () => {
      window.removeEventListener('expertProfileImageUpdated', handleProfileUpdate as EventListener);
      window.removeEventListener('expertProfileRefreshed', handleProfileUpdate as EventListener);
    };
  }, [userType, user?.id, refreshProfiles]);

  // Memoize currentUser to prevent unnecessary re-renders
  const currentUser: UserProfile | null = useMemo(() => {
    if (userType === 'expert' && expert) {
      // For experts, create a UserProfile-compatible object from expert data
      return {
        id: expert.auth_id,
        name: expert.name || '',
        email: expert.email || '',
        phone: expert.phone || '',
        country: expert.country || '',
        city: expert.city || '',
        currency: 'EUR',
        profile_picture: expert.profile_picture || expert.profilePicture || '',
        wallet_balance: 0, // Experts don't have wallet balance
        created_at: expert.created_at || '',
        updated_at: expert.created_at || '',
        referred_by: null,
        referral_code: '',
        referral_link: '',
        favorite_experts: [],
        favorite_programs: [],
        enrolled_courses: [],
        reviews: [],
        recent_activities: [],
        upcoming_appointments: [],
        reports: [],
        transactions: [],
        referrals: []
      };
    } else if (userType === 'user' && userProfile) {
      // For users, return the userProfile directly
      return userProfile;
    }
    return null;
  }, [userType, expert, userProfile, profileUpdateKey]);

  const hasExpertProfile = useMemo(() => userType === 'expert' && !!expert, [userType, expert]);

  // Prepared props for NavbarDesktopLinks

  // Only show loading during the initial auth check - not after each render
  if (isLoading) {
    // Showing loading state
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
          <div className="flex items-center">
            <div className="animate-pulse text-gray-400">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  // Rendering full navbar
  
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
          isAuthenticated={isAuthenticated} 
          currentUser={currentUser} 
          hasExpertProfile={hasExpertProfile} 
          userLogout={handleLogout} 
          expertLogout={handleLogout} 
          sessionType={userType} 
          isLoggingOut={false} 
        />
        
        <NavbarMobileMenu 
          isAuthenticated={isAuthenticated} 
          currentUser={currentUser} 
          hasExpertProfile={hasExpertProfile} 
          userLogout={handleLogout} 
          expertLogout={handleLogout} 
          sessionType={userType} 
          isLoggingOut={false} 
        />
      </div>
    </div>
  );
};

export default Navbar;
