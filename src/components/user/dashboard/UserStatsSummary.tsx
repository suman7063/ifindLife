
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import { UserProfile } from '@/types/supabase';

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
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">Wallet Balance</span>
            <span className="text-2xl font-bold">
              {user ? formatCurrency(user.wallet_balance) : '$0.00'}
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
