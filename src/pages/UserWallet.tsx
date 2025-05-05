
import React from 'react';
import { Helmet } from 'react-helmet';
import UserDashboardLayout from '@/components/user/dashboard/UserDashboardLayout';
import WalletPage from '@/components/user/dashboard/wallet/WalletPage';

const UserWallet: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>My Wallet | iFind Life</title>
      </Helmet>
      <UserDashboardLayout>
        <WalletPage />
      </UserDashboardLayout>
    </>
  );
};

export default UserWallet;
