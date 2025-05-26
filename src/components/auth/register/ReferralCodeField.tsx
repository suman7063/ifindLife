
import React from 'react';
import { Input } from '@/components/ui/input';
import { ReferralSettings } from '@/types/supabase';

interface ReferralCodeFieldProps {
  referralCode: string;
  onReferralCodeChange: (value: string) => void;
  disabled: boolean;
  referralSettings?: ReferralSettings | null;
}

const ReferralCodeField: React.FC<ReferralCodeFieldProps> = ({
  referralCode,
  onReferralCodeChange,
  disabled,
  referralSettings
}) => {
  return (
    <>
      <div className="space-y-2">
        <label htmlFor="referralCode" className="text-sm font-medium">Referral Code (Optional)</label>
        <Input
          id="referralCode"
          type="text"
          value={referralCode}
          onChange={(e) => onReferralCodeChange(e.target.value)}
          placeholder="Enter referral code if any"
          disabled={disabled}
        />
      </div>
      
      {referralSettings && (
        <div className="mt-4 text-sm text-center text-muted-foreground">
          <p>Refer friends and earn ₹{referralSettings.referrer_reward}!</p>
        </div>
      )}
    </>
  );
};

export default ReferralCodeField;
