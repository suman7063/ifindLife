
import React from 'react';
import { useUserAuth } from '@/contexts/UserAuthContext';
import ReferralsList from '@/components/user/ReferralsList';
import { ReferralUI } from '@/types/supabase';
import { useEffect, useState } from 'react';
import { formatReferrals } from '@/utils/referralUtils';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const UserReferrals: React.FC = () => {
  const { currentUser, isAuthenticated } = useUserAuth();
  const [referrals, setReferrals] = useState<ReferralUI[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReferrals = async () => {
      if (!isAuthenticated || !currentUser) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('referrals')
          .select('*')
          .eq('referrer_id', currentUser.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching referrals:', error);
          toast.error('Failed to load referrals. Please try again.');
          return;
        }

        if (data) {
          const formattedReferrals = formatReferrals(data);
          setReferrals(formattedReferrals);
        }
      } catch (error) {
        console.error('Error processing referrals:', error);
        toast.error('Error processing referral data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReferrals();
  }, [currentUser, isAuthenticated]);

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Your Referrals</CardTitle>
            <Link to="/referral-invite">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Invite Friends
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <ReferralsList referrals={referrals} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserReferrals;
