
import React from 'react';
import TestingDashboard from '@/components/testing/TestingDashboard';
import AdminHeader from '@/components/admin/AdminHeader';
import { useNavigate } from 'react-router-dom';

const Testing: React.FC = () => {
  const navigate = useNavigate();
  
  // Create a simple logout handler
  const handleLogout = () => {
    console.log('Admin logout clicked in testing page');
    navigate('/admin/login');
    return Promise.resolve(true);
  };

  return (
    <div>
      <AdminHeader onLogout={handleLogout} />
      <div className="container mx-auto px-4 py-8">
        <TestingDashboard />
      </div>
    </div>
  );
};

export default Testing;
