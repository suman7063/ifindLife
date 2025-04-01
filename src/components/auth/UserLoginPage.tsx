
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UserLoginHeader from '@/components/auth/UserLoginHeader';
import UserLoginContent from '@/components/auth/UserLoginContent';
import LoadingScreen from '@/components/auth/LoadingScreen';
import { useAuthSynchronization } from '@/hooks/useAuthSynchronization';
import { useUserAuth } from '@/contexts/UserAuthContext';

const UserLoginPage = () => {
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  const { userAuthLoading, isSynchronizing } = useAuthSynchronization();
  const { isAuthenticated, currentUser, loading } = useUserAuth();
  const navigate = useNavigate();
  
  // Redirect to dashboard if already authenticated
  useEffect(() => {
    // Only redirect if:
    // 1. User is authenticated
    // 2. We have a user profile
    // 3. Loading states are completed
    // 4. We haven't already attempted a redirect
    if (isAuthenticated && 
        currentUser && 
        !userAuthLoading && 
        !isSynchronizing && 
        !loading && 
        !redirectAttempted) {
      console.log('UserLoginPage: User is authenticated, redirecting to dashboard');
      setRedirectAttempted(true);
      navigate('/user-dashboard', { replace: true });
    }
  }, [
    isAuthenticated, 
    currentUser, 
    userAuthLoading, 
    isSynchronizing, 
    loading, 
    redirectAttempted,
    navigate
  ]);
  
  // Show loading screen during initialization
  if (userAuthLoading || isSynchronizing || loading) {
    console.log('UserLoginPage: Showing loading screen');
    return <LoadingScreen />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16 container">
        <div className="max-w-md mx-auto">
          <Card className="border-ifind-lavender/20 shadow-xl">
            <CardContent className="pt-6">
              <UserLoginHeader />
              <UserLoginContent />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserLoginPage;
