
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UserLoginPage from '@/components/auth/UserLoginPage';

const UserLogin: React.FC = () => {
  console.log("Rendering UserLogin page");
  return (
    <>
      <Navbar />
      <UserLoginPage />
      <Footer />
    </>
  );
};

export default UserLogin;
