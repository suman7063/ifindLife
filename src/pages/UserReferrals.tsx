
import React, { useEffect, useState } from 'react';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { useUserAuth } from '@/hooks/useUserAuth';
import ReferralsList from '@/components/user/ReferralsList';
import ReferralCard from '@/components/user/ReferralCard';
import { supabase } from '@/lib/supabase';

const UserReferrals = () => {
  const { currentUser } = useUserAuth();
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [referralSettings, setReferralSettings] = useState<any>(null);

  useEffect(() => {
    const fetchReferrals = async () => {
      if (!currentUser) return;
      
      setLoading(true);
      
      try {
        // Fetch referrals where this user is the referrer
        const { data: referralsData, error: referralsError } = await supabase
          .from('referrals')
          .select('*')
          .eq('referrer_id', currentUser.id);
          
        if (referralsError) throw referralsError;
        
        // Get the IDs of referred users to fetch their names
        const referredIds = referralsData.map((ref: any) => ref.referred_id);
        
        // Fetch user data for the referred users
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, name')
          .in('id', referredIds);
          
        if (userError) throw userError;

        // Fetch referral settings
        const { data: settingsData, error: settingsError } = await supabase
          .from('referral_settings')
          .select('*')
          .limit(1)
          .single();

        if (!settingsError && settingsData) {
          setReferralSettings(settingsData);
        }
        
        // Format the data for display - using our own formatter since we can't import the one from referralUtils
        const formattedReferrals = formatReferrals(referralsData, userData || []);
        setReferrals(formattedReferrals);
      } catch (error) {
        console.error('Error fetching referrals:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReferrals();
  }, [currentUser]);

  // Format referrals data for UI display (copied from referralUtils)
  const formatReferrals = (referrals: any[], users: any[]): any[] => {
    if (!referrals || !users) return [];
    
    return referrals.map(referral => {
      // Find the referred user to get their name
      const referredUser = users.find(user => user.id === referral.referred_id);
      
      return {
        id: referral.id,
        referrerId: referral.referrer_id,
        referredId: referral.referred_id,
        referredName: referredUser ? referredUser.name : 'Unknown User',
        referralCode: referral.referral_code,
        status: referral.status,
        rewardClaimed: referral.reward_claimed,
        createdAt: referral.created_at,
        completedAt: referral.completed_at
      };
    });
  };

  if (!currentUser) {
    return (
      <Container className="py-8">
        <p>Please log in to view your referrals.</p>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold mb-6">Your Referrals</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ReferralCard settings={referralSettings} userProfile={currentUser} />
        </div>
        
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Referral History</h2>
            <ReferralsList referrals={referrals} isLoading={loading} />
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default UserReferrals;
