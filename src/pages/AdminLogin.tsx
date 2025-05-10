
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/admin-auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/common/PageHeader';
import AdminLoginContent from '@/components/admin/auth/AdminLoginContent';

const AdminLogin = () => {
  const { isAuthenticated, currentUser, isLoading } = useAuth();
  const navigate = useNavigate();
  
  console.log('AdminLogin component rendered, isAuthenticated:', isAuthenticated, 'currentUser:', currentUser?.username);

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      console.log('User is already authenticated as', currentUser?.role, 'redirecting to admin panel');
      navigate('/admin');
    }
  }, [isAuthenticated, navigate, currentUser, isLoading]);

  const handleLoginSuccess = () => {
    console.log('Login successful, redirecting to admin panel');
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
