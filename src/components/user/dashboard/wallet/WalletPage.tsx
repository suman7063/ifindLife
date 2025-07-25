
import React from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import RewardPointsCard from '../../rewards/RewardPointsCard';
import RewardTransactionsList from '../../rewards/RewardTransactionsList';
import RewardItemsGrid from '../../rewards/RewardItemsGrid';

interface Props {
  user?: any;
  currentUser?: any;
  [key: string]: any;
}

const WalletPage: React.FC<Props> = (props) => {
  const { userProfile } = useAuth();
  const user = props.user || userProfile;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reward Points</h1>
        <p className="text-muted-foreground">Earn points through referrals and redeem them for exclusive rewards</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RewardPointsCard user={user} />
        <div className="lg:col-span-2 space-y-6">
          <RewardItemsGrid user={user} />
          <RewardTransactionsList user={user} />
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
