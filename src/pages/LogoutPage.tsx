
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LogoutConfirmation from '@/components/auth/LogoutConfirmation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const LogoutPage: React.FC = () => {
  const location = useLocation();
  const [userType, setUserType] = useState<'user' | 'expert' | 'admin'>('user');
  
  // Extract the user type from the location state
  useEffect(() => {
    if (location.state && location.state.userType) {
      setUserType(location.state.userType as 'user' | 'expert' | 'admin');
    } else {
      // Try to determine from localStorage as fallback
      const sessionType = localStorage.getItem('sessionType');
      if (sessionType === 'admin') {
        setUserType('admin');
      } else if (sessionType === 'expert') {
        setUserType('expert');
      } else {
        setUserType('user');
      }
    }
  }, [location]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <LogoutConfirmation userType={userType} />
      </main>
      <Footer />
    </div>
  );
};

export default LogoutPage;
