
import React from 'react';
import { ReferralSettingsUI } from '@/types/supabase/referrals';

interface RewardsSectionProps {
  settings: ReferralSettingsUI;
}

const RewardsSection: React.FC<RewardsSectionProps> = ({ settings }) => {
  return (
    <div className="bg-gradient-to-r from-ifind-teal/5 to-ifind-aqua/5 p-4 rounded-md mt-4">
      <h4 className="text-sm font-medium mb-2 text-ifind-teal">Rewards</h4>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">You receive</p>
          <p className="font-semibold">${settings.referrerReward.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-500">Your friend receives</p>
          <p className="font-semibold">${settings.referredReward.toFixed(2)}</p>
        </div>
        <div className="col-span-2 text-xs text-gray-500 mt-1">
          {settings.description || 'Rewards are added to your wallet after your friend makes their first purchase.'}
        </div>
      </div>
    </div>
  );
};

export default RewardsSection;
