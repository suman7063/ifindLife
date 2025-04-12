
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminTabs from '@/components/admin/AdminTabs';
import { Container } from '@/components/ui/container';
import { toast } from 'sonner';

const Admin = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin-login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    toast.success('Successfully logged out');
    navigate('/admin-login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Container className="flex-1 py-8">
        <AdminHeader onLogout={handleLogout} />
        <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </Container>
      <Footer />
    </div>
  );
};

export default Admin;
