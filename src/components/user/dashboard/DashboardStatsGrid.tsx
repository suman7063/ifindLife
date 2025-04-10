import React from 'react';
import StatsCard from './StatsCard';
import { UserProfile } from '@/types/supabase';
import { Users, ShoppingBag, MessageSquare, ShieldCheck } from 'lucide-react';

interface DashboardStatsGridProps {
  userProfile: UserProfile | null;
}

const DashboardStatsGrid: React.FC<DashboardStatsGridProps> = ({ userProfile }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="My Courses"
        value={userProfile?.enrolled_courses?.length || 0}
        description="Courses you've enrolled in"
        icon={Users}
      />
      
      <StatsCard
        title="Purchased Services"
        value={5} // This appears to be a static value in the original
        description="Services you've purchased"
        icon={ShoppingBag}
      />
      
      <StatsCard
        title="Reviews Given"
        value={userProfile?.reviews?.length || 0}
        description="Reviews you've submitted"
        icon={MessageSquare}
      />
      
      <StatsCard
        title="Reports Submitted"
        value={userProfile?.reports?.length || 0}
        description="Reports you've submitted"
        icon={ShieldCheck}
      />
    </div>
  );
};

export default DashboardStatsGrid;
