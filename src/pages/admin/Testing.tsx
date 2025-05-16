
import React from 'react';
import TestingDashboard from '@/components/testing/TestingDashboard';
import AdminHeader from '@/components/admin/AdminHeader';

const Testing: React.FC = () => {
  return (
    <div>
      <AdminHeader />
      <div className="container mx-auto px-4 py-8">
        <TestingDashboard />
      </div>
    </div>
  );
};

export default Testing;
