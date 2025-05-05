
import React, { useEffect } from 'react';
import { UserProfile } from '@/types/supabase/user';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Calendar, Wallet, MessageSquare } from 'lucide-react';
import { useFavorites } from '@/contexts/favorites/FavoritesContext';

interface DashboardHomeProps {
  user: UserProfile | null;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ user }) => {
  const { expertFavorites, programFavorites } = useFavorites();
  
  // Add debug logging to track component lifecycle and data
  useEffect(() => {
    console.log('DashboardHome component mounted with:', {
      hasUser: !!user,
      username: user?.name,
      expertFavoritesCount: expertFavorites?.length || 0,
      programFavoritesCount: programFavorites?.length || 0,
      walletBalance: user?.wallet_balance
    });
  }, [user, expertFavorites, programFavorites]);
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Welcome, {user?.name || 'User'}</h2>
        <p className="text-muted-foreground">
          Here's an overview of your account and recent activities
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Quick Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user?.currency || '$'}{user?.wallet_balance?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Available for consultations
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">
              Scheduled consultations
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">
              Unread notifications
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(expertFavorites?.length || 0) + (programFavorites?.length || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total favorites and actions
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Favorite Experts</CardTitle>
            <CardDescription>Experts you've bookmarked</CardDescription>
          </CardHeader>
          <CardContent>
            {expertFavorites && expertFavorites.length > 0 ? (
              <div className="space-y-2">
                {expertFavorites.slice(0, 3).map((id) => (
                  <div key={id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <span>Expert ID: {id}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                You haven't added any experts to your favorites
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Upcoming Consultations */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Favorite Programs</CardTitle>
            <CardDescription>Programs you've bookmarked</CardDescription>
          </CardHeader>
          <CardContent>
            {programFavorites && programFavorites.length > 0 ? (
              <div className="space-y-2">
                {programFavorites.slice(0, 3).map((id) => (
                  <div key={id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <span>Program ID: {id}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                You haven't added any programs to your favorites
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;
