
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import UserDashboardLayout from './UserDashboardLayout';
import DashboardHome from './DashboardHome';
import { adaptUserProfile } from '@/utils/adaptUserProfile';
import { UserProfile } from '@/types/database/unified';

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Check authentication status and fetch user profile
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Check if user is logged in
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData.session) {
          console.log('No session found, redirecting to login');
          navigate('/login');
          return;
        }
        
        // Get user data
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', sessionData.session.user.id)
          .single();
        
        const adaptedUser = adaptUserProfile(userData || { 
          id: sessionData.session.user.id, 
          email: sessionData.session.user.email,
          name: sessionData.session.user.user_metadata?.name || 'User',
          profile_picture: null,
          wallet_balance: 0,
          currency: 'INR',
          phone: '',
          city: '',
          country: '',
          created_at: new Date().toISOString(),
          referred_by: null,
          referral_code: '',
          referral_link: '',
          favorite_experts: [],
          favorite_programs: [],
          enrolled_courses: [],
          transactions: [],
          reviews: [],
          reports: [],
          referrals: []
        });
        
        setUser(adaptedUser);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate]);

  // Handle user logout
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error('Failed to logout. Please try again.');
        return;
      }
      
      // Clear local storage
      localStorage.removeItem('sessionType');
      
      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred during logout');
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-6">Loading user dashboard...</div>;
  }

  if (!user) {
    return <div className="container mx-auto p-6">User profile not found. Please log in again.</div>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden md:block w-64 border-r border-border">
        <div className="h-full">
          <UserDashboardSidebar 
            user={user} 
            onLogout={handleLogout} 
            isLoggingOut={isLoggingOut} 
          />
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <UserDashboardLayout 
          user={user} 
          onLogout={handleLogout} 
          isLoggingOut={isLoggingOut}
        >
          <DashboardHome user={user} />
        </UserDashboardLayout>
      </div>
    </div>
  );
};

export default UserDashboard;
