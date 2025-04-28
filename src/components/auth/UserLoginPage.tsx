
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import UserLoginHeader from '@/components/auth/UserLoginHeader';
import UserLoginContent from '@/components/auth/UserLoginContent';
import LoadingScreen from '@/components/auth/LoadingScreen';
import { useAuth } from '@/contexts/auth/AuthContext';

const UserLoginPage = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { isAuthenticated, isLoading, role, userProfile } = useAuth();
  const navigate = useNavigate();
  
  // Debug logging
  useEffect(() => {
    console.log('UserLoginPage - Auth states:', {
      isAuthenticated,
      isLoading,
      role,
      hasUserProfile: !!userProfile
    });
  }, [isAuthenticated, isLoading, role, userProfile]);
  
  useEffect(() => {
    // Set a short timeout to avoid flickering during quick auth checks
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Redirect to dashboard if already authenticated as a user
  useEffect(() => {
    if (isAuthenticated && role === 'user' && userProfile && !isLoading) {
      console.log('UserLoginPage: User is authenticated, redirecting to dashboard');
      navigate('/user-dashboard', { replace: true });
    }
    
    // Redirect to expert dashboard if authenticated as an expert
    if (isAuthenticated && role === 'expert' && !isLoading) {
      console.log('UserLoginPage: Expert is authenticated, redirecting to expert dashboard');
      navigate('/expert-dashboard', { replace: true });
    }
  }, [isAuthenticated, role, userProfile, isLoading, navigate]);
  
  // Show loading screen during initialization
  if (isPageLoading || isLoading) {
    console.log('UserLoginPage: Showing loading screen');
    return <LoadingScreen message="Checking authentication status..." />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
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
    </div>
  );
};

export default UserLoginPage;
