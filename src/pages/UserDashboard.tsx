
import React, { useEffect } from 'react';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { useExpertAuth } from '@/hooks/useExpertAuth';
import DashboardLoader from '@/components/user/dashboard/DashboardLoader';
import DashboardStatsGrid from '@/components/user/dashboard/DashboardStatsGrid';
import UserProfileCard from '@/components/user/UserProfileCard';
import ReferralDashboardCard from '@/components/user/ReferralDashboardCard';
import WalletBalanceCard from '@/components/user/dashboard/WalletBalanceCard';
import RecentTransactionsCard from '@/components/user/dashboard/RecentTransactionsCard';
import ProfileSetupPlaceholder from '@/components/user/dashboard/ProfileSetupPlaceholder';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import other necessary components and hooks

const UserDashboard: React.FC = () => {
  const { 
    currentUser, 
    isAuthenticated, 
    loading: userLoading,
    updateProfile
  } = useUserAuth();
  
  const { 
    loading: expertLoading 
  } = useExpertAuth();

  // Make sure the user is redirected if they're not authenticated
  if (!isAuthenticated && !userLoading && !expertLoading) {
    return <Navigate to="/login" replace />;
  }

  // Show loading state while checking authentication
  if (userLoading || expertLoading || !currentUser) {
    return <DashboardLoader />;
  }

  // Check if user profile is incomplete
  const isProfileIncomplete = !currentUser.name || !currentUser.email || !currentUser.phone;

  // Handle user profile information
  const handleUpdateProfile = async (data: any) => {
    try {
      await updateProfile({
        name: data.name,
        phone: data.phone,
        city: data.city,
        country: data.country
      });
      return true;
    } catch (error) {
      console.error("Failed to update profile:", error);
      return false;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>

      {isProfileIncomplete ? (
        <ProfileSetupPlaceholder 
          user={currentUser} 
          onUpdateProfile={handleUpdateProfile}
        />
      ) : (
        // User's dashboard content when profile is complete
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <UserProfileCard 
              userProfile={currentUser}
            />
            
            <ReferralDashboardCard 
              userProfile={currentUser} 
            />
          </div>
          
          {/* Right Column (spans 2 columns on large screens) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <DashboardStatsGrid userProfile={currentUser} />
            
            {/* Tabs for Wallet & Transactions */}
            <Tabs defaultValue="wallet" className="w-full">
              <TabsList className="grid grid-cols-2 mb-2">
                <TabsTrigger value="wallet">Wallet</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="wallet" className="mt-0">
                <WalletBalanceCard 
                  userProfile={currentUser}
                  onRecharge={() => {}} 
                />
              </TabsContent>
              
              <TabsContent value="transactions" className="mt-0">
                <RecentTransactionsCard 
                  transactions={currentUser.transactions || []}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
