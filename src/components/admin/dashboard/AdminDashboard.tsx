
import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { useAdminAuthClean } from '@/contexts/AdminAuthClean';
import AdminDashboardLayout from '../layout/AdminDashboardLayout';
import AdminRoutes from './AdminRoutes';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const adminAuth = useAdminAuthClean();
  const [activeTab, setActiveTab] = useState('overview');

  // Auth check with clean admin system
  useEffect(() => {
    if (!adminAuth?.isLoading && !adminAuth?.isAuthenticated) {
      console.log('❌ AdminDashboard: Not authenticated, redirecting');
      navigate('/admin-login', { replace: true });
    }
  }, [adminAuth?.isAuthenticated, adminAuth?.isLoading, navigate]);

  // Extract current tab from URL path
  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    const currentTab = pathParts.length > 2 ? pathParts[2] : 'overview';
    setActiveTab(currentTab);
  }, []);

  if (adminAuth?.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!adminAuth?.isAuthenticated || !adminAuth.admin) {
    return null; // Will redirect in useEffect
  }

  return (
    <AdminDashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/overview" replace />} />
        <Route path="/*" element={<AdminRoutes />} />
      </Routes>
    </AdminDashboardLayout>
  );
};

export default AdminDashboard;
