
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/admin-auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/common/PageHeader';
import AdminLoginContent from '@/components/admin/auth/AdminLoginContent';
import { toast } from 'sonner';

const AdminLogin = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { isAuthenticated, currentUser, isLoading, login } = useAuth();
  const navigate = useNavigate();
  
  console.log('AdminLogin component rendered', { 
    isAuthenticated, 
    currentUser: currentUser?.username,
    hasLoginFunction: typeof login === 'function',
    isLoading
  });

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && isAuthenticated && currentUser) {
      console.log('User is already authenticated as', currentUser?.role, 'redirecting to admin panel');
      navigate('/admin');
    }
  }, [isAuthenticated, navigate, currentUser, isLoading]);

  const handleLoginSuccess = () => {
    console.log('Login successful, redirecting to admin panel');
    navigate('/admin');
  };

  const handleLogin = async (username: string, password: string) => {
    if (isLoggingIn) return false;
    
    try {
      setIsLoggingIn(true);
      console.log('Attempting admin login for:', username);
      
      if (typeof login !== 'function') {
        console.error('Login function is not available');
        toast.error('Authentication service unavailable');
        return false;
      }
      
      const success = await login(username, password);
      
      if (success) {
        console.log('Admin login successful');
        handleLoginSuccess();
        return true;
      } else {
        toast.error('Login failed. Please check your credentials.');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
      return false;
    } finally {
      setIsLoggingIn(false);
    }
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
          <AdminLoginContent 
            onLoginSuccess={handleLoginSuccess} 
            onLogin={handleLogin}
            isLoggingIn={isLoggingIn}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLogin;
