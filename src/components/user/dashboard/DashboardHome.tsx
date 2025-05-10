
import React, { useEffect } from 'react';
import { UserProfile } from '@/types/supabase/user';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Calendar, Wallet, MessageSquare } from 'lucide-react';
import { useFavorites } from '@/contexts/favorites/FavoritesContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface DashboardHomeProps {
  user: UserProfile | null;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ user }) => {
  const { expertFavorites, programFavorites, expertFavoriteDetails, programFavoriteDetails } = useFavorites();
  const navigate = useNavigate();
  
  // Add debug logging to track component lifecycle and data
  useEffect(() => {
    console.log('DashboardHome component mounted with:', {
      hasUser: !!user,
      username: user?.name,
      expertFavoritesCount: expertFavorites?.length || 0,
      programFavoritesCount: programFavorites?.length || 0,
      expertFavoriteDetails,
      programFavoriteDetails,
      walletBalance: user?.wallet_balance,
      domElement: document.querySelector('.dashboard-content')
    });
  }, [user, expertFavorites, programFavorites, expertFavoriteDetails, programFavoriteDetails]);
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Welcome, {user?.name || 'User'}</h2>
        <p className="text-muted-foreground">
          Here's an overview of your account and recent activities
        </p>
      </div>
      
      {/* Quick Stats */}
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
        {/* Expert Favorites */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Favorite Experts</CardTitle>
            <CardDescription>Experts you've bookmarked</CardDescription>
          </CardHeader>
          <CardContent>
            {expertFavoriteDetails && expertFavoriteDetails.length > 0 ? (
              <div className="space-y-2">
                {expertFavoriteDetails.slice(0, 3).map((expert) => (
                  <div key={expert.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <span>{expert.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p>You haven't added any experts to your favorites</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => navigate('/experts')}
                >
                  Browse Experts
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Program Favorites */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Favorite Programs</CardTitle>
            <CardDescription>Programs you've bookmarked</CardDescription>
          </CardHeader>
          <CardContent>
            {programFavoriteDetails && programFavoriteDetails.length > 0 ? (
              <div className="space-y-2">
                {programFavoriteDetails.slice(0, 3).map((program) => (
                  <div key={program.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <span>{program.title}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p>You haven't added any programs to your favorites</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => navigate('/programs-for-wellness-seekers')}
                >
                  Browse Programs
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Recommended Programs Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Programs</CardTitle>
          <CardDescription>Personalized suggestions based on your profile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-muted-foreground">We're preparing personalized recommendations for you.</p>
            <Button 
              className="mt-4"
              onClick={() => navigate('/programs-for-wellness-seekers')}
            >
              Browse All Programs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;
