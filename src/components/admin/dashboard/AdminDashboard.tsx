
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSecureAdminAuth } from '@/contexts/SecureAdminAuth';
import AdminDashboardLayout from '../layout/AdminDashboardLayout';
import AdminRoutes from './AdminRoutes';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const adminAuth = useSecureAdminAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Auth check with clean admin system
  useEffect(() => {
    if (!adminAuth?.isLoading && !adminAuth?.isAuthenticated) {
      navigate('/admin-login', { replace: true });
    }
  }, [adminAuth?.isAuthenticated, adminAuth?.isLoading, navigate]);

  if (adminAuth?.isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!adminAuth?.isAuthenticated || !adminAuth.admin) {
    return null; // Will redirect in useEffect
  }

  return (
    <AdminDashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <AdminRoutes />
    </AdminDashboardLayout>
  );
};

export default AdminDashboard;
