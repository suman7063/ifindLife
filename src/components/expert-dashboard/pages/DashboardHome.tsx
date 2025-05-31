
import React from 'react';
import { useUnifiedAuth } from '@/contexts/auth/UnifiedAuthContext';
import WelcomeSection from './dashboard/WelcomeSection';
import StatsGrid from './dashboard/StatsGrid';
import QuickActionsCard from './dashboard/QuickActionsCard';
import RecentActivityCard from './dashboard/RecentActivityCard';
import PerformanceOverviewCard from './dashboard/PerformanceOverviewCard';

const DashboardHome = () => {
  const { expert } = useUnifiedAuth();

  const expertName = expert?.name || expert?.full_name || 'Expert';
  const expertStatus = expert?.status || 'pending';

  return (
    <div className="space-y-6">
      <WelcomeSection expertName={expertName} expertStatus={expertStatus} />
      <StatsGrid />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActionsCard />
        <RecentActivityCard />
      </div>

      <PerformanceOverviewCard />
    </div>
  );
};

export default DashboardHome;
