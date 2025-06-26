
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/SimpleAuthProvider';
import { useNavigate } from 'react-router-dom';
import SimpleLoginForm from '@/components/SimpleLoginForm';
import SimpleNavbar from '@/components/SimpleNavbar';
import Footer from '@/components/Footer';

const UserLogin: React.FC = () => {
  const { isAuthenticated, userType, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated && userType === 'user') {
      navigate('/user-dashboard');
    }
  }, [isAuthenticated, userType, isLoading, navigate]);

  if (isLoading) {
    return (
      <>
        <SimpleNavbar />
        <div className="flex justify-center items-center min-h-screen">
          <div>Checking authentication...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (isAuthenticated && userType === 'user') {
    return (
      <>
        <SimpleNavbar />
        <div className="flex justify-center items-center min-h-screen">
          <div>Redirecting to dashboard...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SimpleNavbar />
      <div className="py-12 bg-gray-50 min-h-screen flex items-center justify-center">
        <SimpleLoginForm 
          userType="user"
          title="User Login"
          redirectTo="/user-dashboard"
        />
      </div>
      <Footer />
    </>
  );
};

export default UserLogin;
