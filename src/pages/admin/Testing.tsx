
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/admin-auth';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminRoutes from '@/components/admin/dashboard/AdminRoutes';

const Testing = () => {
  const { isAuthenticated, isLoading, logout } = useAuth();
  
  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader onLogout={logout} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/*" element={<AdminRoutes />} />
        </Routes>
      </main>
    </div>
  );
};

export default Testing;
