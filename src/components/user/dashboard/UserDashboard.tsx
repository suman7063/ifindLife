
import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import UserDashboardLayout from './UserDashboardLayout';
import ProfileSettings from './ProfileSettings';
import ConsultationsSection from './ConsultationsSection';
import FavoritesSection from './FavoritesSection';
import WalletSection from './WalletSection';

const UserDashboard: React.FC = () => {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  if (!profile) {
    return <div className="container mx-auto p-6">Loading user profile...</div>;
  }

  return (
    <UserDashboardLayout user={profile} onLogout={handleLogout} isLoggingOut={isLoggingOut}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="consultations">Consultations</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-6">
          <ProfileSettings user={profile} />
        </TabsContent>
        
        <TabsContent value="consultations" className="mt-6">
          <ConsultationsSection user={profile} />
        </TabsContent>
        
        <TabsContent value="favorites" className="mt-6">
          <FavoritesSection user={profile} />
        </TabsContent>
        
        <TabsContent value="wallet" className="mt-6">
          <WalletSection user={profile} />
        </TabsContent>
      </Tabs>
    </UserDashboardLayout>
  );
};

export default UserDashboard;
