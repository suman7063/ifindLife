
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ReferralSettings } from "@/types/supabase";

interface ReferralRewardsFormProps {
  settings: ReferralSettings;
  errors: {
    referrer_reward?: string;
    referred_reward?: string;
    description?: string;
  };
  onSettingChange: <T extends keyof ReferralSettings>(name: T, value: ReferralSettings[T]) => void;
}

const ReferralRewardsForm: React.FC<ReferralRewardsFormProps> = ({
  settings,
  errors,
  onSettingChange
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let parsedValue: string | number | boolean = value;
    
    // Convert numeric string values to numbers
    if (name === 'referrer_reward' || name === 'referred_reward') {
      parsedValue = parseFloat(value) || 0;
    }
    
    onSettingChange(name as keyof ReferralSettings, parsedValue as any);
  };

  const handleActiveChange = (checked: boolean) => {
    onSettingChange('active', checked);
  };

  return (
    <div className="grid gap-6">
      <div className="flex items-center space-x-2 mb-4">
        <Checkbox 
          id="active" 
          checked={settings.active} 
          onCheckedChange={handleActiveChange} 
        />
        <Label htmlFor="active" className="font-medium">
          Referral Program Active
        </Label>
      </div>

      <div className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="referrer_reward">Referrer Reward (credits)</Label>
            <Input
              id="referrer_reward"
              name="referrer_reward"
              type="number"
              min="0"
              step="0.01"
              value={settings.referrer_reward}
              onChange={handleChange}
              placeholder="10"
              className={errors.referrer_reward ? "border-red-500" : ""}
            />
            {errors.referrer_reward && (
              <p className="text-red-500 text-xs">{errors.referrer_reward}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Credits given to users who invite others
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="referred_reward">Referred User Reward (credits)</Label>
            <Input
              id="referred_reward"
              name="referred_reward"
              type="number"
              min="0"
              step="0.01"
              value={settings.referred_reward}
              onChange={handleChange}
              placeholder="5"
              className={errors.referred_reward ? "border-red-500" : ""}
            />
            {errors.referred_reward && (
              <p className="text-red-500 text-xs">{errors.referred_reward}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Credits given to new users who sign up via referral
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralRewardsForm;
