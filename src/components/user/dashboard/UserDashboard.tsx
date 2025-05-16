
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import UserDashboardLayout from './UserDashboardLayout';
import ProfileSettings from './ProfileSettings';
import ConsultationsSection from './ConsultationsSection';
import FavoritesSection from './FavoritesSection';
import WalletSection from './WalletSection';
import DashboardHome from './DashboardHome';
import { adaptUserProfile } from '@/utils/adaptUserProfile';
import { UserProfile } from '@/types/supabase/user';

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
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
          email: sessionData.session.user.email 
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
    <UserDashboardLayout user={user} onLogout={handleLogout} isLoggingOut={isLoggingOut}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full max-w-lg">
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="consultations">Consultations</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
        </TabsList>
        
        <TabsContent value="home" className="mt-6">
          <DashboardHome user={user} />
        </TabsContent>
        
        <TabsContent value="profile" className="mt-6">
          <ProfileSettings user={user} />
        </TabsContent>
        
        <TabsContent value="consultations" className="mt-6">
          <ConsultationsSection user={user} />
        </TabsContent>
        
        <TabsContent value="favorites" className="mt-6">
          <FavoritesSection user={user} />
        </TabsContent>
        
        <TabsContent value="wallet" className="mt-6">
          <WalletSection user={user} />
        </TabsContent>
      </Tabs>
    </UserDashboardLayout>
  );
};

export default UserDashboard;
