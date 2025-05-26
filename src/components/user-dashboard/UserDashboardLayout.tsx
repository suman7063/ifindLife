
import React from 'react';
import UserDashboardSidebar from './UserDashboardSidebar';
import UserDashboardHeader from './UserDashboardHeader';

interface UserDashboardLayoutProps {
  children: React.ReactNode;
  user?: any;
  onLogout?: () => Promise<boolean>;
  isLoggingOut?: boolean;
}

const UserDashboardLayout: React.FC<UserDashboardLayoutProps> = ({ 
  children, 
  user, 
  onLogout, 
  isLoggingOut 
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <UserDashboardHeader />
      <div className="flex">
        <UserDashboardSidebar 
          user={user} 
          onLogout={onLogout} 
          isLoggingOut={isLoggingOut} 
        />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default UserDashboardLayout;
