
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import UserDashboardLayout from './UserDashboardLayout';
import ProfileSettings from './ProfileSettings';
import ConsultationsSection from './ConsultationsSection';
import FavoritesSection from './FavoritesSection';
import WalletSection from './WalletSection';
import DashboardHome from './DashboardHome';
import { adaptUserProfile } from '@/utils/adaptUserProfile';

const UserDashboard: React.FC = () => {
  const { profile, userProfile, user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Use the first available profile data
  const rawUser = userProfile || profile || (user ? { id: user.id, email: user.email } : null);
  // Adapt the user to ensure consistent properties
  const dashboardUser = adaptUserProfile(rawUser);
  
  useEffect(() => {
    console.log('UserDashboard mounted with:', {
      hasProfile: !!profile,
      hasUserProfile: !!userProfile,
      hasUser: !!user,
      dashboardUser
    });
  }, [profile, userProfile, user, dashboardUser]);

  // Handle user logout
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const success = await logout();
      if (success) {
        navigate('/login');
      } else {
        toast.error('Failed to logout. Please try again.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred during logout');
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!dashboardUser) {
    return <div className="container mx-auto p-6">Loading user dashboard...</div>;
  }

  return (
    <UserDashboardLayout user={dashboardUser} onLogout={handleLogout} isLoggingOut={isLoggingOut}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full max-w-lg">
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="consultations">Consultations</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
        </TabsList>
        
        <TabsContent value="home" className="mt-6">
          <DashboardHome user={dashboardUser} />
        </TabsContent>
        
        <TabsContent value="profile" className="mt-6">
          <ProfileSettings user={dashboardUser} />
        </TabsContent>
        
        <TabsContent value="consultations" className="mt-6">
          <ConsultationsSection user={dashboardUser} />
        </TabsContent>
        
        <TabsContent value="favorites" className="mt-6">
          <FavoritesSection user={dashboardUser} />
        </TabsContent>
        
        <TabsContent value="wallet" className="mt-6">
          <WalletSection user={dashboardUser} />
        </TabsContent>
      </Tabs>
    </UserDashboardLayout>
  );
};

export default UserDashboard;
