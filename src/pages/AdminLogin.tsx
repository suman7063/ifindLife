
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/admin-auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/common/PageHeader';
import AdminLoginContent from '@/components/admin/auth/AdminLoginContent';

const AdminLogin = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  console.log('AdminLogin component rendered, isAuthenticated:', isAuthenticated);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      console.log('User is already authenticated, redirecting to admin panel');
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleLoginSuccess = () => {
    navigate('/admin');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageHeader 
        title="Admin Access" 
        subtitle="Secure login for system administrators" 
      />
      <main className="flex-1 py-10 flex items-center justify-center">
        <div className="container max-w-md">
          <AdminLoginContent onLoginSuccess={handleLoginSuccess} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLogin;
