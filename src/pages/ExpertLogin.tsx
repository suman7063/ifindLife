
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingView from '@/components/expert/auth/LoadingView';
import UserLogoutAlert from '@/components/auth/UserLogoutAlert';
import StatusMessage from '@/components/expert/auth/StatusMessage';
import DualSessionAlert from '@/components/expert/auth/DualSessionAlert';
import ExpertLoginContent from '@/components/expert/auth/ExpertLoginContent';
import { useExpertLoginPage } from '@/hooks/expert-auth/useExpertLoginPage';
import { useAuthLogoutEffects } from '@/hooks/expert-auth/useAuthLogoutEffects';

const ExpertLogin = () => {
  // Get state and handlers from custom hooks
  const {
    isLoggingIn,
    loginError,
    activeTab,
    setActiveTab,
    userProfile,
    statusMessage,
    expert,
    loading,
    initialized,
    isCheckingUser,
    handleLogin
  } = useExpertLoginPage();
  
  const {
    isSynchronizing,
    isLoggingOut,
    hasDualSessions,
    handleUserLogout,
    handleFullLogout
  } = useAuthLogoutEffects();

  // Show loading view during initialization
  if ((loading && !isLoggingIn && !initialized) || 
      (initialized && loading && !isLoggingIn) || 
      isSynchronizing || 
      isCheckingUser) {
    console.log('Showing LoadingView on ExpertLogin page');
    return <LoadingView />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10 flex items-center justify-center bg-stars">
        <div className="container max-w-4xl">
          {/* Status message alerts */}
          {statusMessage && (
            <div className="mb-6">
              <StatusMessage 
                type={statusMessage.type} 
                message={statusMessage.message}
              />
            </div>
          )}
          
          {/* Dual session alert */}
          {hasDualSessions && (
            <div className="mb-6">
              <DualSessionAlert
                isLoggingOut={isLoggingOut}
                onLogout={handleFullLogout}
              />
            </div>
          )}
          
          {/* User logout alert */}
          {userProfile && !hasDualSessions && (
            <div className="mb-6">
              <UserLogoutAlert
                profileName={userProfile.name || "User"}
                isLoggingOut={isLoggingOut}
                onLogout={handleUserLogout}
                logoutType="user"
              />
            </div>
          )}
          
          {/* Login content */}
          {!userProfile && !hasDualSessions && (
            <ExpertLoginContent
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onLogin={handleLogin}
              isLoggingIn={isLoggingIn}
              loginError={loginError}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExpertLogin;
