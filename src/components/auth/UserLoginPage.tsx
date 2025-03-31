
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UserLoginHeader from '@/components/auth/UserLoginHeader';
import UserLoginContent from '@/components/auth/UserLoginContent';
import LoadingScreen from '@/components/auth/LoadingScreen';
import { useAuthSynchronization } from '@/hooks/useAuthSynchronization';

const UserLoginPage = () => {
  const { authLoading, isSynchronizing } = useAuthSynchronization();
  
  // Show loading screen during auth initialization or synchronization
  if (authLoading || isSynchronizing) {
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
