import React from 'react';
import { useProfileTypeAdapter } from '@/hooks/useProfileTypeAdapter';
import { withProfileTypeAdapter } from '@/components/wrappers/withProfileTypeAdapter';
import { UserProfile } from '@/types/supabase/user';

interface AnalyticsTabProps {
  user?: UserProfile;
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ user }) => {
  const { toTypeB } = useProfileTypeAdapter();
  const adaptedUser = user ? toTypeB(user) : null;
  
  

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>
      {/* Analytics content goes here */}
    </div>
  );
};

export default withProfileTypeAdapter(AnalyticsTab);
