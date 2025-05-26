
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import LoadingScreen from '@/components/auth/LoadingScreen';
import { toast } from 'sonner';
import UserDashboardSidebar from '@/components/user/dashboard/UserDashboardSidebar';
import DashboardHome from '@/components/user/dashboard/DashboardHome';
import ProfileSection from '@/components/user/dashboard/sections/ProfileSection';
import WalletSection from '@/components/user/dashboard/sections/WalletSection';
import ConsultationsSection from '@/components/user/dashboard/sections/ConsultationsSection';
import FavoritesSection from '@/components/user/dashboard/sections/FavoritesSection';
import MessagesSection from '@/components/user/dashboard/sections/MessagesSection';
import SecuritySection from '@/components/user/dashboard/sections/SecuritySection';
import SettingsSection from '@/components/user/dashboard/sections/SettingsSection';
import SupportSection from '@/components/user/dashboard/sections/SupportSection';
import ProgramsSection from '@/components/user/dashboard/sections/ProgramsSection';
import BookingHistorySection from '@/components/user/dashboard/sections/BookingHistorySection';
import ProgressTrackingSection from '@/components/user/dashboard/sections/ProgressTrackingSection';
import { UserProfile } from '@/types/database/unified';

const UserDashboardPages: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { section } = useParams<{ section?: string }>();
  
  // Set default section and add logging
  const [currentSection, setCurrentSection] = useState(section || 'overview');
  
  useEffect(() => {
    console.log('UserDashboardPages: Current section from URL:', section);
    console.log('UserDashboardPages: Current dashboard section state:', currentSection);
  }, [section, currentSection]);

  // Update current section when URL changes
  useEffect(() => {
    if (section) {
      setCurrentSection(section);
    } else {
      setCurrentSection('overview');
    }
  }, [section]);
  
  // Check auth status and fetch user profile
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
        // Check if user is logged in
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData.session) {
          console.log('UserDashboardPages: No session found, redirecting to login');
          navigate('/user-login');
          return;
        }
        
        // Get user data from users table
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', sessionData.session.user.id)
          .single();
          
        if (error || !userData) {
          console.error('UserDashboardPages: Error fetching user data:', error);
          // Try to get at least basic info from auth user
          const basicUserProfile: UserProfile = {
            id: sessionData.session.user.id,
            name: sessionData.session.user.user_metadata?.name || 'User',
            email: sessionData.session.user.email || '',
            profile_picture: null,
            phone: '',
            country: '',
            city: '',
            wallet_balance: 0,
            currency: 'INR',
            created_at: new Date().toISOString(),
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
          };
          setUser(basicUserProfile);
        } else {
          // Use data from users table and ensure all properties exist
          const fullUserProfile: UserProfile = {
            id: userData.id,
            name: userData.name || sessionData.session.user.user_metadata?.name || 'User',
            email: userData.email || sessionData.session.user.email || '',
            profile_picture: userData.profile_picture || null,
            phone: userData.phone || '',
            country: userData.country || '',
            city: userData.city || '',
            wallet_balance: userData.wallet_balance || 0,
            currency: userData.currency || 'INR',
            created_at: userData.created_at || new Date().toISOString(),
            referred_by: userData.referred_by || null,
            referral_code: userData.referral_code || '',
            referral_link: userData.referral_link || '',
            favorite_experts: userData.favorite_experts || [],
            favorite_programs: userData.favorite_programs || [],
            enrolled_courses: userData.enrolled_courses || [],
            reviews: [],
            reports: [],
            transactions: [],
            referrals: []
          };
          setUser(fullUserProfile);
        }
      } catch (error) {
        console.error('UserDashboardPages: Error fetching user data:', error);
        toast.error('Failed to load user data');
        navigate('/user-login');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate]);

  // Handle user logout with boolean return type
  const handleLogout = async (): Promise<boolean> => {
    try {
      setIsLoggingOut(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error('Failed to logout. Please try again.');
        return false;
      }
      
      // Clear local storage
      localStorage.removeItem('sessionType');
      
      // Redirect to logout confirmation page
      toast.success('Logged out successfully');
      navigate('/logout?type=user');
      return true;
    } catch (error) {
      console.error('UserDashboardPages: Logout error:', error);
      toast.error('An error occurred during logout');
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Render the appropriate section based on current section with proper fallback
  const renderSection = (sectionName: string) => {
    if (!user) return null;
    
    console.log('UserDashboardPages: Rendering section:', sectionName);
    
    switch(sectionName) {
      case 'profile':
        return <ProfileSection user={user} />;
      case 'wallet':
        return <WalletSection user={user} />;
      case 'appointments':
      case 'consultations':
        return <ConsultationsSection user={user} />;
      case 'booking-history':
        return <BookingHistorySection user={user} />;
      case 'progress':
        return <ProgressTrackingSection user={user} />;
      case 'favorites':
        return <FavoritesSection user={user} />;
      case 'programs':
        return <ProgramsSection user={user} />;
      case 'messages':
        return <MessagesSection user={user} />;
      case 'security':
        return <SecuritySection />;
      case 'settings':
        return <SettingsSection user={user} />;
      case 'support':
      case 'help':
        return <SupportSection />;
      case 'overview':
      default:
        console.log('UserDashboardPages: Rendering default overview section for:', sectionName);
        return <DashboardHome user={user} />;
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Loading your dashboard..." />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Main content - no navbar here as it's now in AppRoutes */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <UserDashboardSidebar 
          user={user} 
          onLogout={handleLogout} 
          isLoggingOut={isLoggingOut}
        />
        
        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          {renderSection(currentSection)}
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPages;
