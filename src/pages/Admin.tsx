
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/admin-auth';
import AdminDashboard from '@/components/admin/dashboard/AdminDashboard';

const Admin = () => {
  const { isAuthenticated } = useAuth();

  // If not authenticated, redirect to admin login
  if (!isAuthenticated) {
    console.log('Admin.tsx: Not authenticated, redirecting to admin-login');
    return <Navigate to="/admin-login" replace />;
  }

  // Render admin dashboard if authenticated
  return <AdminDashboard />;
};

export default Admin;
