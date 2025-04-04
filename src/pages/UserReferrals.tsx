
import React, { useEffect, useState } from 'react';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { useUserAuth } from '@/hooks/useUserAuth';
import ReferralsList from '@/components/user/ReferralsList';
import ReferralCard from '@/components/user/ReferralCard';
import { formatReferrals } from '@/utils/referralUtils';
import { supabase } from '@/lib/supabase';

const UserReferrals = () => {
  const { currentUser } = useUserAuth();
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
        
        // Format the data for display
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
          <ReferralCard referralCode={currentUser.referral_code || ''} />
        </div>
        
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Referral History</h2>
            <ReferralsList referrals={referrals} loading={loading} />
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default UserReferrals;
