
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import ProfileSettings from '@/components/user-dashboard/ProfileSettings';
import ConsultationsSection from '@/components/user-dashboard/ConsultationsSection';
import WalletSection from '@/components/user-dashboard/WalletSection';
import FavoritesSection from '@/components/user-dashboard/FavoritesSection';

interface UserDashboardContentProps {
  user: any;
}

const UserDashboardContent: React.FC<UserDashboardContentProps> = ({ user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Handle logout
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      console.log('Logging out...');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast.error('Failed to logout');
        setIsLoggingOut(false);
        return;
      }
      
      localStorage.removeItem('sessionType');
      toast.success('Logged out successfully');
      
      navigate('/user-login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred during logout');
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Logged in as: {user?.email}
          </span>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="consultations">Consultations</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
        </TabsList>
        
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
    </div>
  );
};

export default UserDashboardContent;
