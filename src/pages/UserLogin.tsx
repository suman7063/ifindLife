
import React, { useEffect } from 'react';
import UserLoginPage from '@/components/auth/UserLoginPage';
import { useUserAuth } from '@/hooks/user-auth';
import { useNavigate } from 'react-router-dom';

const UserLogin = () => {
  const { isAuthenticated, currentUser } = useUserAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check for pending actions after login
    if (isAuthenticated && currentUser) {
      handlePendingActions();
    }
  }, [isAuthenticated, currentUser]);
  
  const handlePendingActions = () => {
    const pendingAction = sessionStorage.getItem('pendingAction');
    const pendingProgramId = sessionStorage.getItem('pendingProgramId');
    
    if (pendingAction && pendingProgramId) {
      const programId = parseInt(pendingProgramId);
      
      // Clear stored data
      sessionStorage.removeItem('pendingAction');
      sessionStorage.removeItem('pendingProgramId');
      
      // Redirect based on action
      switch (pendingAction) {
        case 'favorite':
        case 'enroll':
        case 'view':
          navigate(`/program/${programId}`);
          break;
        default:
          navigate('/user-dashboard');
          break;
      }
    }
  };
  
  return <UserLoginPage />;
};

export default UserLogin;
