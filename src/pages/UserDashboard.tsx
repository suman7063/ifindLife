
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import LoadingScreen from '@/components/auth/LoadingScreen';
import { toast } from 'sonner';
import UserDashboardSidebar from '@/components/user/dashboard/UserDashboardSidebar';
import DashboardContent from '@/components/user/dashboard/DashboardContent';
import { UserProfile } from '@/types/database/unified';

const UserDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  
  // Check auth status and fetch user profile
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
        // Check if user is logged in
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData.session) {
          console.log('No session found, redirecting to login');
          navigate('/login');
          return;
        }
        
        // Get user data from users table
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', sessionData.session.user.id)
          .single();
          
        if (error || !userData) {
          console.error('Error fetching user data:', error);
          // Try to get at least basic info from auth user
          const basicUserProfile: UserProfile = {
            id: sessionData.session.user.id,
            name: sessionData.session.user.user_metadata.name || 'User',
            email: sessionData.session.user.email || '',
            profile_picture: null,
            phone: '',
            country: '',
            city: '',
            wallet_balance: 0,
            currency: 'USD',
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
          // Use data from users table
          const fullUserProfile: UserProfile = {
            id: userData.id,
            name: userData.name || sessionData.session.user.user_metadata.name || 'User',
            email: userData.email || sessionData.session.user.email || '',
            profile_picture: userData.profile_picture || null,
            phone: userData.phone || '',
            country: userData.country || '',
            city: userData.city || '',
            wallet_balance: userData.wallet_balance || 0,
            currency: userData.currency || 'USD',
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
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate]);

  // Handle user logout
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
      
      // Redirect to login page
      toast.success('Logged out successfully');
      navigate('/login');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred during logout');
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Loading your dashboard..." />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden md:block w-64 border-r border-border">
        <UserDashboardSidebar 
          user={user} 
          onLogout={handleLogout} 
          isLoggingOut={isLoggingOut} 
        />
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <DashboardContent currentUser={user} />
      </div>
    </div>
  );
};

export default UserDashboard;
