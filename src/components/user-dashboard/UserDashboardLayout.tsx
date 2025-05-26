
import React from 'react';
import UserDashboardSidebar from './UserDashboardSidebar';
import UserDashboardHeader from './UserDashboardHeader';

interface UserDashboardLayoutProps {
  children: React.ReactNode;
}

const UserDashboardLayout: React.FC<UserDashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <UserDashboardHeader />
      <div className="flex">
        <UserDashboardSidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default UserDashboardLayout;
