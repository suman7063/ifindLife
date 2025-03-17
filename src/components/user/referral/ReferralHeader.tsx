
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Gift } from 'lucide-react';

interface ReferralHeaderProps {
  isActive: boolean;
}

const ReferralHeader: React.FC<ReferralHeaderProps> = ({ isActive }) => {
  if (!isActive) {
    return (
      <CardHeader>
        <CardTitle className="text-center text-gray-500">Referral Program</CardTitle>
        <CardDescription className="text-center">Your referral code is not available yet.</CardDescription>
      </CardHeader>
    );
  }

  return (
    <CardHeader className="bg-gradient-to-r from-ifind-teal/10 to-ifind-aqua/10 rounded-t-lg">
      <div className="flex items-center justify-between">
        <CardTitle className="text-ifind-teal flex items-center">
          <Gift className="mr-2 h-5 w-5" />
          Referral Program
        </CardTitle>
        <div className="px-3 py-1 bg-ifind-teal text-white text-xs rounded-full">
          Active
        </div>
      </div>
      <CardDescription>
        Invite friends and earn rewards when they join!
      </CardDescription>
    </CardHeader>
  );
};

export default ReferralHeader;
