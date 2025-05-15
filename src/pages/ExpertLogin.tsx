
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExpertLoginHeader } from '@/components/expert/auth/ExpertLoginHeader';
import { ExpertLoginContent } from '@/components/expert/auth/ExpertLoginContent';
import { ExpertLoginTabs } from '@/components/expert/auth/ExpertLoginTabs';
import { DualSessionAlert } from '@/components/expert/auth/DualSessionAlert';
import { useAuth } from '@/contexts/auth/AuthContext';
import { LoadingView } from '@/components/expert/auth/LoadingView';

const ExpertLogin = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  
  useEffect(() => {
    // Redirect if already authenticated as expert
    if (auth.isAuthenticated && auth.role === 'expert' && auth.sessionType === 'expert') {
      navigate('/expert-dashboard');
    }
  }, [auth.isAuthenticated, auth.role, auth.sessionType, navigate]);
  
  // Show loading state while authentication state is being determined
  if (auth.isLoading) {
    return <LoadingView />;
  }
  
  // Determine if user is in a dual session (both user and expert)
  const isDualSession = auth.isAuthenticated && !!auth.userProfile && !!auth.expertProfile;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-ifind-purple/5 to-ifind-teal/5">
      <div className="container mx-auto px-4 py-8">
        <ExpertLoginHeader />
        
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mb-8">
          {isDualSession && <DualSessionAlert />}
          
          <div className="p-8">
            <ExpertLoginContent>
              <ExpertLoginTabs 
                onLogin={(email, password) => auth.login(email, password, true)}
              />
            </ExpertLoginContent>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertLogin;
