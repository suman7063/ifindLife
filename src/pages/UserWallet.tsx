
import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import UserDashboardLayout from '@/components/user/dashboard/UserDashboardLayout';
import WalletPage from '@/components/user/dashboard/wallet/WalletPage';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const UserWallet: React.FC = () => {
  const { userProfile, isLoading, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async (): Promise<boolean> => {
    setIsLoggingOut(true);
    try {
      console.log("UserWallet - Initiating logout");
      const success = await logout();
      
      if (success) {
        toast.success('Successfully logged out');
        navigate('/');
        return true;
      } else {
        toast.error('Error logging out');
        return false;
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <UserDashboardLayout
      user={userProfile}
      onLogout={handleLogout}
      isLoggingOut={isLoggingOut}
    >
      <WalletPage />
    </UserDashboardLayout>
  );
};

export default UserWallet;
