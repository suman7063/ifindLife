
import React from 'react';
import { UserProfile } from '@/types/database/unified';
import DashboardHeader from './DashboardHeader';

// Import sub-components for dashboard sections
import WalletSummary from '@/components/dashboard/WalletSummary';
import RecentActivities from './RecentActivities';
import EnrolledPrograms from './EnrolledPrograms';
import FavoriteExperts from './FavoriteExperts';

interface DashboardContentProps {
  currentUser: UserProfile | null;
  loading?: boolean;
  children?: React.ReactNode;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ 
  currentUser, 
  loading = false,
  children 
}) => {
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
          Here's an overview of your activities and favorites.
        </p>
      </div>
      
      {/* Main dashboard content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Wallet summary */}
        <div className="md:col-span-1">
          <WalletSummary user={currentUser} />
        </div>
        
        {/* Right column - Recent activities */}
        <div className="md:col-span-2">
          <RecentActivities user={currentUser} />
        </div>
      </div>
      
      {/* Programs and experts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EnrolledPrograms user={currentUser} />
        <FavoriteExperts user={currentUser} />
      </div>
      
      {/* Additional content */}
      {children}
    </div>
  );
};

export default DashboardContent;
