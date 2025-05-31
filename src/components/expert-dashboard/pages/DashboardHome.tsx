
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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, MessageSquare, Users, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardHome = () => {
  const { expert } = useUnifiedAuth();
  const navigate = useNavigate();

  const expertName = expert?.name || expert?.full_name || 'Expert';
  const expertStatus = expert?.status || 'pending';

  return (
    <div className="space-y-6">
      <WelcomeSection expertName={expertName} expertStatus={expertStatus} />
      
      {/* Enhanced Metrics Grid */}
      <DashboardMetrics />
      
      {/* Quick Access Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
          <CardDescription>Jump to key areas of your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => navigate('/expert-dashboard/analytics')}
            >
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm">Analytics</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => navigate('/expert-dashboard/messages')}
            >
              <MessageSquare className="h-6 w-6" />
              <span className="text-sm">Messages</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => navigate('/expert-dashboard/clients')}
            >
              <Users className="h-6 w-6" />
              <span className="text-sm">Clients</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => navigate('/expert-dashboard/schedule')}
            >
              <Calendar className="h-6 w-6" />
              <span className="text-sm">Schedule</span>
            </Button>
          </div>
        </CardContent>
      </Card>

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
