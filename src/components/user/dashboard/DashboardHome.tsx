
import React from 'react';
import { UserProfile } from '@/types/database/unified';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardHeader from './DashboardHeader';
import { Calendar, Heart, MessageSquare, Wallet } from 'lucide-react';

interface DashboardHomeProps {
  user: UserProfile | null;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ user }) => {
  if (!user) return null;

  return (
    <div className="space-y-6">
      <DashboardHeader user={user} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.currency || '₹'}{user.wallet_balance?.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-muted-foreground">Available balance</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Upcoming appointments</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.favorite_experts?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Saved experts</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Unread messages</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome to iFindLife</CardTitle>
          <CardDescription>Your wellness journey starts here</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Connect with experts, explore programs, and take control of your well-being.
            Use the sidebar navigation to explore all features of your personal dashboard.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;
