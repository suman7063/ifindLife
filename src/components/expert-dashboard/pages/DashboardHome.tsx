
import React from 'react';
import { useUnifiedAuth } from '@/contexts/auth/UnifiedAuthContext';
import WelcomeSection from './dashboard/WelcomeSection';
import DashboardMetrics from './dashboard/DashboardMetrics';
import QuickActionsCard from './dashboard/QuickActionsCard';
import RecentActivityCard from './dashboard/RecentActivityCard';
import AdvancedStatsCard from './dashboard/AdvancedStatsCard';
import RevenueChart from './dashboard/RevenueChart';
import ClientEngagementCard from './dashboard/ClientEngagementCard';
import QuickInsightsCard from './dashboard/QuickInsightsCard';
import NotificationCenter from './dashboard/NotificationCenter';

const DashboardHome = () => {
  const { expert } = useUnifiedAuth();

  const expertName = expert?.name || expert?.full_name || 'Expert';
  const expertStatus = expert?.status || 'pending';

  return (
    <div className="space-y-6">
      <WelcomeSection expertName={expertName} expertStatus={expertStatus} />
      
      {/* Enhanced Metrics Grid */}
      <DashboardMetrics />
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <QuickActionsCard />
        
        {/* Quick Insights */}
        <QuickInsightsCard />
        
        {/* Advanced Stats */}
        <AdvancedStatsCard />
      </div>

      {/* Revenue Analytics */}
      <RevenueChart />

      {/* Notifications and Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NotificationCenter />
        <ClientEngagementCard />
      </div>

      {/* Recent Activity */}
      <RecentActivityCard />
    </div>
  );
};

export default DashboardHome;
