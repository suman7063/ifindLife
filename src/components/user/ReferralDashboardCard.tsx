import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DollarSign, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ReferralDashboardCardProps {
  referralCode: string;
  totalReferrals: number;
  pendingReferrals: number;
  successfulReferrals: number;
  rewardsEarned: number;
}

interface ReferralSettingsUI {
  id: string;
  referrerReward: number;
  referredReward: number;
  active: boolean;
  description: string;
  updatedAt: string;
  
  // Original fields for compatibility
  referrer_reward: number;
  referred_reward: number;
  updated_at: string;
}

const ReferralDashboardCard: React.FC<ReferralDashboardCardProps> = ({ 
  referralCode, 
  totalReferrals, 
  pendingReferrals, 
  successfulReferrals, 
  rewardsEarned 
}) => {
  const [settings, setSettings] = useState<ReferralSettingsUI | null>(null);
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('referral_settings')
          .select('*')
          .limit(1)
          .single();
          
        if (error) throw error;
        
        // Map DB format to UI format
        const settingsUI: ReferralSettingsUI = {
          id: data.id,
          referrerReward: data.referrer_reward,
          referredReward: data.referred_reward,
          active: data.active,
          description: data.description,
          updatedAt: data.updated_at,
          
          // Original fields for compatibility
          referrer_reward: data.referrer_reward,
          referred_reward: data.referred_reward,
          updated_at: data.updated_at
        };
        
        setSettings(settingsUI);
      } catch (error) {
        // Silent fail, not critical
      }
    };
    
    fetchSettings();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Referral Dashboard</CardTitle>
        <CardDescription>
          Track your referrals and rewards
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center space-x-4">
          <Users className="w-5 h-5 text-gray-500" />
          <div>
            <p className="text-sm font-medium">Total Referrals</p>
            <p className="text-2xl font-bold">{totalReferrals}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Pending</p>
            <p className="text-xl font-bold">{pendingReferrals}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Successful</p>
            <p className="text-xl font-bold">{successfulReferrals}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <DollarSign className="w-5 h-5 text-gray-500" />
          <div>
            <p className="text-sm font-medium">Rewards Earned</p>
            <p className="text-2xl font-bold">${rewardsEarned.toFixed(2)}</p>
          </div>
        </div>
        
        <div>
          <p className="text-sm font-medium">Referral Code</p>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">{referralCode}</Badge>
            <Badge variant="outline">Copy</Badge>
          </div>
        </div>
        
        <div>
          <p className="text-sm font-medium">Referral Program Progress</p>
          <Progress value={(successfulReferrals / 10) * 100} />
          <p className="text-xs text-gray-500 mt-1">
            {successfulReferrals} / 10 referrals
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralDashboardCard;
