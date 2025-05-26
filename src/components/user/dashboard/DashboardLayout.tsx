
import React from 'react';
import { UserProfile } from '@/types/database/unified';
import UserDashboardSidebar from './UserDashboardSidebar';
import DashboardSectionRenderer from './DashboardSectionRenderer';

interface DashboardLayoutProps {
  user: UserProfile | null;
  currentSection: string;
  onLogout: () => Promise<boolean>;
  isLoggingOut: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  user,
  currentSection,
  onLogout,
  isLoggingOut
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex flex-1">
        {/* Sidebar */}
        <UserDashboardSidebar 
          user={user} 
          onLogout={onLogout} 
          isLoggingOut={isLoggingOut}
        />
        
        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          <DashboardSectionRenderer currentSection={currentSection} user={user} />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
