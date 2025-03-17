
import React from 'react';
import { CardFooter } from '@/components/ui/card';
import { ReferralSettings } from '@/types/supabase';

interface ReferralFooterProps {
  settings: ReferralSettings | null;
}

const ReferralFooter: React.FC<ReferralFooterProps> = ({ settings }) => {
  return (
    <CardFooter className="bg-gray-50 py-3 text-xs text-gray-500 justify-center rounded-b-lg">
      {settings?.active ? 
        'Terms & conditions apply. Rewards are subject to verification.' : 
        'Referral program is currently paused.'}
    </CardFooter>
  );
};

export default ReferralFooter;
