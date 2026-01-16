
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface ReferralRewardsFormProps {
  settings: {
    referrer_reward_inr?: number;
    referrer_reward_eur?: number;
    referred_reward_inr?: number;
    referred_reward_eur?: number;
    active: boolean;
  };
  errors: {
    referrer_reward_inr?: string;
    referrer_reward_eur?: string;
    referred_reward_inr?: string;
    referred_reward_eur?: string;
  };
  onSettingChange: (key: string, value: any) => void;
}

const ReferralRewardsForm: React.FC<ReferralRewardsFormProps> = ({
  settings,
  errors,
  onSettingChange
}) => {
  return (
    <div className="space-y-6">
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

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-3">Referrer Rewards (Credits)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="referrer_reward_inr">Referrer Reward (INR) ₹</Label>
              <Input
                id="referrer_reward_inr"
                type="number"
                min="0"
                step="0.01"
                value={settings.referrer_reward_inr ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  onSettingChange('referrer_reward_inr', value === '' ? undefined : parseFloat(value) || 0);
                }}
                onBlur={(e) => {
                  if (e.target.value === '' || isNaN(parseFloat(e.target.value))) {
                    onSettingChange('referrer_reward_inr', 10);
                  }
                }}
                className={errors.referrer_reward_inr ? "border-red-500" : ""}
              />
              {errors.referrer_reward_inr && (
                <p className="text-red-500 text-xs">{errors.referrer_reward_inr}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Credits given to users who invite others (INR)
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="referrer_reward_eur">Referrer Reward (EUR) €</Label>
              <Input
                id="referrer_reward_eur"
                type="number"
                min="0"
                step="0.01"
                value={settings.referrer_reward_eur ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  onSettingChange('referrer_reward_eur', value === '' ? undefined : parseFloat(value) || 0);
                }}
                onBlur={(e) => {
                  if (e.target.value === '' || isNaN(parseFloat(e.target.value))) {
                    onSettingChange('referrer_reward_eur', 10);
                  }
                }}
                className={errors.referrer_reward_eur ? "border-red-500" : ""}
              />
              {errors.referrer_reward_eur && (
                <p className="text-red-500 text-xs">{errors.referrer_reward_eur}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Credits given to users who invite others (EUR)
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Referred User Rewards (Credits)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="referred_reward_inr">Referred User Reward (INR) ₹</Label>
              <Input
                id="referred_reward_inr"
                type="number"
                min="0"
                step="0.01"
                value={settings.referred_reward_inr ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  onSettingChange('referred_reward_inr', value === '' ? undefined : parseFloat(value) || 0);
                }}
                onBlur={(e) => {
                  if (e.target.value === '' || isNaN(parseFloat(e.target.value))) {
                    onSettingChange('referred_reward_inr', 5);
                  }
                }}
                className={errors.referred_reward_inr ? "border-red-500" : ""}
              />
              {errors.referred_reward_inr && (
                <p className="text-red-500 text-xs">{errors.referred_reward_inr}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Credits given to new users who sign up via referral (INR)
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="referred_reward_eur">Referred User Reward (EUR) €</Label>
              <Input
                id="referred_reward_eur"
                type="number"
                min="0"
                step="0.01"
                value={settings.referred_reward_eur ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  onSettingChange('referred_reward_eur', value === '' ? undefined : parseFloat(value) || 0);
                }}
                onBlur={(e) => {
                  if (e.target.value === '' || isNaN(parseFloat(e.target.value))) {
                    onSettingChange('referred_reward_eur', 5);
                  }
                }}
                className={errors.referred_reward_eur ? "border-red-500" : ""}
              />
              {errors.referred_reward_eur && (
                <p className="text-red-500 text-xs">{errors.referred_reward_eur}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Credits given to new users who sign up via referral (EUR)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralRewardsForm;
