
import React from 'react';
import { UserProfile } from '@/types/supabase/user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface UserReferralsPageProps {
  user: UserProfile | null;
}

const UserReferralsPage: React.FC<UserReferralsPageProps> = ({ user }) => {
  const navigate = useNavigate();
  
  // Simple rendering of referral page - will redirect to the full page
  React.useEffect(() => {
    navigate('/user-referrals');
  }, [navigate]);
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Your Referrals</h2>
        <p className="text-muted-foreground">
          Redirecting to referrals page...
        </p>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-6">
            <p className="text-muted-foreground">Loading referrals information...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserReferralsPage;
