
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UserProfile } from '@/types/supabase';
import { Award } from 'lucide-react';

interface UserStatsSummaryProps {
  user: UserProfile | null;
  appointmentsCount?: number;
  programsCount?: number;
}

const UserStatsSummary: React.FC<UserStatsSummaryProps> = ({ 
  user,
  appointmentsCount = 0,
  programsCount = 0
}) => {
  const rewardPoints = user?.reward_points || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <Award className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Reward Points</span>
            </div>
            <span className="text-2xl font-bold text-primary">
              {rewardPoints.toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">Appointments</span>
            <span className="text-2xl font-bold">{appointmentsCount}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">Programs</span>
            <span className="text-2xl font-bold">{programsCount}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserStatsSummary;
