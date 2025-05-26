
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserDashboardLayout from '@/components/user-dashboard/UserDashboardLayout';
import DashboardOverview from '@/components/user-dashboard/pages/DashboardOverview';
import MyPrograms from '@/components/user-dashboard/pages/MyPrograms';
import BookingHistory from '@/components/user-dashboard/pages/BookingHistory';

const UserDashboardPages: React.FC = () => {
  return (
    <UserDashboardLayout>
      <Routes>
        <Route index element={<DashboardOverview />} />
        <Route path="programs" element={<MyPrograms />} />
        <Route path="bookings" element={<BookingHistory />} />
        <Route path="favorites" element={<div className="p-6">Favorites page coming soon...</div>} />
        <Route path="progress" element={<div className="p-6">Progress page coming soon...</div>} />
        <Route path="billing" element={<div className="p-6">Billing page coming soon...</div>} />
        <Route path="settings" element={<div className="p-6">Settings page coming soon...</div>} />
      </Routes>
    </UserDashboardLayout>
  );
};

export default UserDashboardPages;
