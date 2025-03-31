
import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UserLoginHeader from '@/components/auth/UserLoginHeader';
import UserLoginContent from '@/components/auth/UserLoginContent';
import LoadingScreen from '@/components/auth/LoadingScreen';
import { useAuthSynchronization } from '@/hooks/useAuthSynchronization';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { useUserAuth } from '@/contexts/UserAuthContext';

const UserLoginPage = () => {
  const { authLoading, isSynchronizing } = useAuthSynchronization();
  const { isAuthenticated, currentUser } = useUserAuth();
  const { redirectImmediately } = useAuthRedirect('/user-dashboard');
  
  // Redirect immediately if user is already authenticated
  useEffect(() => {
    if (isAuthenticated && currentUser && !authLoading && !isSynchronizing) {
      console.log('UserLoginPage: User is authenticated, redirecting to dashboard');
      redirectImmediately(true);
    }
  }, [isAuthenticated, currentUser, authLoading, isSynchronizing, redirectImmediately]);
  
  // Show loading screen during auth initialization or synchronization
  if (authLoading || isSynchronizing) {
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
