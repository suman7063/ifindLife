
import React from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import UserDashboardLayout from '@/components/user/dashboard/UserDashboardLayout';
import WalletPage from '@/components/user/dashboard/wallet/WalletPage';

const UserWallet: React.FC = () => {
  const { userProfile, isLoading, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
    return true;
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
