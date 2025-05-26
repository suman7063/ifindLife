
import React from 'react';
import LoadingScreen from '@/components/auth/LoadingScreen';
import DashboardLayout from '@/components/user/dashboard/DashboardLayout';
import { useUserDashboard } from '@/hooks/useUserDashboard';
import { useDashboardSection } from '@/hooks/useDashboardSection';

const UserDashboardPages: React.FC = () => {
  const { user, isLoading, isLoggingOut, handleLogout } = useUserDashboard();
  const { currentSection } = useDashboardSection();

  if (isLoading) {
    return <LoadingScreen message="Loading your dashboard..." />;
  }

  return (
    <DashboardLayout
      user={user}
      currentSection={currentSection}
      onLogout={handleLogout}
      isLoggingOut={isLoggingOut}
    />
  );
};

export default UserDashboardPages;
