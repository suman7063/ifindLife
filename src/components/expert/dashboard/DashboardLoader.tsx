
import React from 'react';
import DashboardLayout from './DashboardLayout';

const DashboardLoader: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="text-center py-10">Loading...</div>
    </DashboardLayout>
  );
};

export default DashboardLoader;
