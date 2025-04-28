
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UserLoginPage from '@/components/auth/UserLoginPage';

const UserLogin: React.FC = () => {
  return (
    <>
      <Navbar />
      <UserLoginPage />
      <Footer />
    </>
  );
};

export default UserLogin;
