
import React from 'react';
import { Outlet } from 'react-router-dom';
import UserDashboardSidebar from './UserDashboardSidebar';
import UserDashboardHeader from './UserDashboardHeader';

const UserDashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <UserDashboardHeader />
      <div className="flex">
        <UserDashboardSidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserDashboardLayout;
