
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface ReferralRewardsFormProps {
  settings: {
    referrer_reward: number;
    referred_reward: number;
    active: boolean;
  };
  errors: {
    referrer_reward?: string;
    referred_reward?: string;
  };
  onSettingChange: (key: string, value: any) => void;
}

const ReferralRewardsForm: React.FC<ReferralRewardsFormProps> = ({
  settings,
  errors,
  onSettingChange
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="active" 
          checked={settings.active} 
          onCheckedChange={(checked) => onSettingChange('active', checked)} 
        />
        <Label htmlFor="active" className="font-medium">
          Referral Program Active
        </Label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="referrer_reward">Referrer Reward (credits)</Label>
          <Input
            id="referrer_reward"
            type="number"
            min="0"
            step="0.01"
            value={settings.referrer_reward}
            onChange={(e) => onSettingChange('referrer_reward', parseFloat(e.target.value) || 0)}
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
            type="number"
            min="0"
            step="0.01"
            value={settings.referred_reward}
            onChange={(e) => onSettingChange('referred_reward', parseFloat(e.target.value) || 0)}
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
  );
};

export default ReferralRewardsForm;
