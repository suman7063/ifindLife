
import React, { useState } from 'react';
import { UserProfile } from '@/types/database/unified';
import DashboardHeader from './DashboardHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import sub-components for dashboard sections
import ProfileSection from './sections/ProfileSection';
import WalletSection from './sections/WalletSection';
import ConsultationsSection from './sections/ConsultationsSection';
import FavoritesSection from './sections/FavoritesSection';
import ReviewsSection from './sections/ReviewsSection';
import ReferralsSection from './sections/ReferralsSection';

interface DashboardContentProps {
  currentUser: UserProfile | null;
  loading?: boolean;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ 
  currentUser, 
  loading = false
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-xl font-medium text-gray-700">User profile not found</h3>
        <p className="text-gray-500 mt-2">Please login to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header with user information */}
      <DashboardHeader user={currentUser} />
      
      {/* Welcome message */}
      <div className="bg-gradient-to-r from-blue-500 to-teal-400 p-6 rounded-lg text-white">
        <h2 className="text-2xl font-semibold">
          Welcome back, {currentUser.name || 'User'}!
        </h2>
        <p className="mt-2">
          Manage your profile, consultations, wallet, and more from your personal dashboard.
        </p>
      </div>
      
      {/* Main dashboard tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="consultations">Consultations</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick access widgets */}
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-semibold text-lg mb-4">Quick Access</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted p-4 rounded-md text-center">
                  <p className="font-medium">Wallet Balance</p>
                  <p className="text-2xl font-bold text-primary">{currentUser.currency} {currentUser.wallet_balance.toFixed(2)}</p>
                </div>
                <div className="bg-muted p-4 rounded-md text-center">
                  <p className="font-medium">Upcoming Calls</p>
                  <p className="text-2xl font-bold text-primary">0</p>
                </div>
              </div>
            </div>
            
            {/* Recent activities */}
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
              <div className="space-y-2">
                {currentUser.transactions && currentUser.transactions.length > 0 ? (
                  currentUser.transactions.slice(0, 3).map((transaction, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span>{transaction.description || 'Transaction'}</span>
                      <span className={transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                        {transaction.type === 'credit' ? '+' : '-'}
                        {currentUser.currency} {transaction.amount}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">No recent activity</p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="profile" className="mt-6">
          <ProfileSection user={currentUser} />
        </TabsContent>
        
        <TabsContent value="wallet" className="mt-6">
          <WalletSection user={currentUser} />
        </TabsContent>
        
        <TabsContent value="consultations" className="mt-6">
          <ConsultationsSection user={currentUser} />
        </TabsContent>
        
        <TabsContent value="favorites" className="mt-6">
          <FavoritesSection user={currentUser} />
        </TabsContent>
        
        <TabsContent value="referrals" className="mt-6">
          <ReferralsSection user={currentUser} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardContent;
