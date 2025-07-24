import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { UserProfile } from '@/types/supabase/user';
import { Award, Star } from 'lucide-react';

interface RewardPointsCardProps {
  user: UserProfile | null;
}

const RewardPointsCard: React.FC<RewardPointsCardProps> = ({ user }) => {
  const rewardPoints = user?.reward_points || 0;

  return (
    <Card className="col-span-1">
      <CardContent className="pt-6">
        <h3 className="text-xl font-bold mb-2">Reward Points</h3>
        <p className="text-muted-foreground text-sm mb-4">Points earned through referrals</p>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Award className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Available Points</p>
              <h2 className="text-3xl font-bold text-primary">
                {rewardPoints.toLocaleString()}
              </h2>
            </div>
          </div>
          
          <div className="bg-muted rounded-md p-3">
            <div className="flex items-center space-x-2 text-sm">
              <Star className="h-4 w-4 text-amber-500" />
              <span className="text-muted-foreground">
                Earn points by referring friends and family
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground pt-0">
        * Use reward points to purchase eligible courses
      </CardFooter>
    </Card>
  );
};

export default RewardPointsCard;