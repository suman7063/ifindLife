
import React from 'react';
import { Gift } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ReferralSettings } from '@/types/supabase';
import { UseFormReturn } from 'react-hook-form';
import { RegisterFormValues } from './types';

interface ReferralCodeFieldProps {
  form: UseFormReturn<RegisterFormValues>;
  referralSettings: ReferralSettings | null;
}

const ReferralCodeField: React.FC<ReferralCodeFieldProps> = ({ form, referralSettings }) => {
  return (
    <FormField
      control={form.control}
      name="referralCode"
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel>Referral Code (Optional)</FormLabel>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Gift className="h-4 w-4 text-muted-foreground" />
            </div>
            <FormControl>
              <Input
                placeholder="Enter referral code"
                className="pl-10"
                {...field}
              />
            </FormControl>
          </div>
          
          {referralSettings && (
            <div className="text-xs text-gray-500 mt-1 flex items-center p-2 bg-ifind-aqua/5 rounded-md">
              <Gift className="h-3 w-3 mr-1 text-ifind-aqua" />
              Get ${referralSettings.referred_reward} credit when you sign up with a referral code!
            </div>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ReferralCodeField;
