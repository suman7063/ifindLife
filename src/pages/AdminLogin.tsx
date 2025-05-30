
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/admin-auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminLoginContent from '@/components/admin/auth/AdminLoginContent';
import { toast } from 'sonner';

const AdminLogin = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { isAuthenticated, currentUser, isLoading, login } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && isAuthenticated && currentUser) {
      console.log('User is already authenticated as admin, redirecting to admin panel');
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
      
      console.log('Admin login result:', success ? 'SUCCESS' : 'FAILED');
      
      if (success) {
        console.log('Admin login successful');
        toast.success('Successfully logged in as admin');
        handleLoginSuccess();
        return true;
      } else {
        toast.error('Login failed. Please check your credentials and try again.');
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
      
      <div className="bg-gradient-to-r from-ifind-aqua to-ifind-teal py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Admin Access</h1>
            <p className="text-xl text-white/90">Secure login for system administrators</p>
          </div>
        </div>
      </div>
      
      <main className="flex-1 py-6 flex items-center justify-center bg-gray-50">
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
