
import React from 'react';
import DashboardLayout from './DashboardLayout';

const UnauthorizedView: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="text-center py-10">
        You are not logged in. Please <a href="/expert-login" className="text-ifind-aqua hover:underline">log in</a> to access the expert dashboard.
      </div>
    </DashboardLayout>
  );
};

export default UnauthorizedView;
