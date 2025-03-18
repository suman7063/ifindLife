
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Users } from "lucide-react";
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface ReferralDashboardCardProps {
  userProfile?: any; // Making this optional
}

const ReferralDashboardCard: React.FC<ReferralDashboardCardProps> = () => {
  return (
    <Card className="shadow-sm border border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center">
          <Gift className="h-5 w-5 mr-2 text-ifind-teal" />
          Referral Program
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Invite friends to iFindLife and both of you will receive rewards
        </p>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-muted-foreground" />
            <span className="text-sm font-medium">0 referrals</span>
          </div>
          <Button asChild size="sm" className="bg-ifind-teal hover:bg-ifind-teal/90">
            <Link to="/referrals">Manage</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralDashboardCard;
