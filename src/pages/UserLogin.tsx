
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UserLoginPage from '@/components/auth/UserLoginPage';
import LoadingScreen from '@/components/auth/LoadingScreen';

const UserLogin: React.FC = () => {
  console.log("Rendering UserLogin page");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Set login origin for role determination
  useEffect(() => {
    sessionStorage.setItem('loginOrigin', 'user');
    console.log('UserLogin: Setting login origin to user');
  }, []);
  
  // Check if already authenticated
  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true);
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          console.log('UserLogin: Already authenticated, redirecting...');
          setIsAuthenticated(true);
          
          // Add a small delay to ensure auth state is fully processed before redirect
          setTimeout(() => {
            navigate('/user-dashboard', { replace: true });
          }, 500);
        } else {
          console.log('UserLogin: Not authenticated, showing login form');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
  }, [navigate]);
  
  if (isLoading) {
    return <LoadingScreen message="Checking authentication..." />;
  }
  
  if (isAuthenticated) {
    return <LoadingScreen message="Redirecting to dashboard..." />;
  }
  
  return (
    <>
      <Navbar />
      <div className="py-8 md:py-12 bg-gray-50 min-h-screen">
        <UserLoginPage />
      </div>
      <Footer />
    </>
  );
};

export default UserLogin;
