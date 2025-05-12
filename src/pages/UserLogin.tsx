
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UserLoginPage from '@/components/auth/UserLoginPage';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserLogin: React.FC = () => {
  console.log("Rendering UserLogin page");
  const { isAuthenticated, isLoading, role } = useAuth();
  const navigate = useNavigate();
  
  // Set login origin for role determination
  useEffect(() => {
    sessionStorage.setItem('loginOrigin', 'user');
    console.log('UserLogin: Setting login origin to user');
  }, []);
  
  // Handle redirection if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      console.log('UserLogin: Already authenticated as', role);
      
      if (role === 'expert') {
        console.log('Redirecting to expert dashboard');
        navigate('/expert-dashboard', { replace: true });
      } else {
        console.log('Redirecting to user dashboard');
        navigate('/user-dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, role, navigate]);
  
  return (
    <>
      <Navbar />
      <UserLoginPage />
      <Footer />
    </>
  );
};

export default UserLogin;
