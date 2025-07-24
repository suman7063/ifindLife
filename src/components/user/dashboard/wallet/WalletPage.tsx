
import React from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import RewardPointsCard from '../../rewards/RewardPointsCard';
import RewardTransactionsList from '../../rewards/RewardTransactionsList';

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
        <p className="text-muted-foreground">Track your referral rewards and redeem points for courses</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RewardPointsCard user={user} />
        <div className="lg:col-span-2">
          <RewardTransactionsList user={user} />
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
