
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/admin-auth';
import AdminDashboard from '@/components/admin/dashboard/AdminDashboard';
import { toast } from 'sonner';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';

const Admin = () => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Set up session timeout
  useSessionTimeout(1800000, () => { // 30 minutes
    if (isAuthenticated) {
      logout();
      navigate('/admin-login');
    }
  });

  // If not authenticated, redirect to admin login
  if (!isAuthenticated) {
    console.log('Admin.tsx: Not authenticated, redirecting to admin-login');
    toast.error('Authentication required', {
      description: 'Please log in to access the admin panel'
    });
    return <Navigate to="/admin-login" replace />;
  }

  // Check if user has any permissions
  const hasAnyPermission = currentUser && Object.values(currentUser.permissions).some(val => val === true);
  
  if (!hasAnyPermission) {
    console.log('Admin.tsx: User has no permissions');
    toast.error('Access restricted', {
      description: 'Your account has no permissions assigned'
    });
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-lg">
          <h1 className="mb-4 text-2xl font-bold">Access Restricted</h1>
          <p className="mb-6 text-muted-foreground">
            You don't have any permissions assigned to your account. Please contact a super administrator.
          </p>
          <button 
            onClick={() => {
              logout();
              navigate('/admin-login');
            }}
            className="w-full rounded bg-ifind-aqua py-2 font-medium text-white hover:bg-ifind-teal"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Render admin dashboard if authenticated
  return <AdminDashboard />;
};

export default Admin;
