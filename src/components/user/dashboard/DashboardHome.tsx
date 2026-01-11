
import React, { useEffect, useState } from 'react';
import { UserProfile } from '@/types/database/unified';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Heart, MessageSquare, Award, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '@/contexts/favorites/FavoritesContext';
import { supabase } from '@/lib/supabase';

interface ExpertInfo {
  auth_id: string;
  name: string;
  profile_picture?: string | null;
  specialization?: string | null;
  average_rating?: number | null;
  reviews_count?: number | null;
}

interface DashboardHomeProps {
  user: UserProfile | null;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ user }) => {
  const navigate = useNavigate();
  const { loading: favoritesLoading } = useFavorites();
  const [favoriteExperts, setFavoriteExperts] = useState<ExpertInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoriteExperts = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch favorite experts from user_favorites table
        const { data: favoriteExpertsData, error: favoritesError } = await supabase
          .from('user_favorites')
          .select('expert_id')
          .eq('user_id', user.id)
          .limit(4);

        if (favoritesError) throw favoritesError;

        // Fetch expert details for favorites
        const favoriteExpertIds = favoriteExpertsData?.map(f => f.expert_id).filter(Boolean) || [];
        if (favoriteExpertIds.length > 0) {
          const { data: favoriteExpertsDetails } = await supabase
            .from('expert_accounts')
            .select('auth_id, name, profile_picture, specialization, average_rating, reviews_count')
            .in('auth_id', favoriteExpertIds);

          setFavoriteExperts(favoriteExpertsDetails || []);
        } else {
          setFavoriteExperts([]);
        }
      } catch (error) {
        console.error('Error fetching favorite experts:', error);
        setFavoriteExperts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteExperts();
  }, [user?.id]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <p className="text-muted-foreground mb-6">Welcome back, {user.name || 'User'}!</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reward Points</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.reward_points || 0}</div>
            <p className="text-xs text-muted-foreground">Points earned through referrals</p>
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
            <div className="text-2xl font-bold">{favoriteExperts.length || 0}</div>
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

      <div className="grid gap-6 md:grid-cols-2">
        {/* Favorite Experts Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Your Favorite Experts
            </CardTitle>
            <CardDescription>Experts you've saved for quick access</CardDescription>
          </CardHeader>
          <CardContent>
            {loading || favoritesLoading ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">Loading favorites...</p>
              </div>
            ) : favoriteExperts.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No favorite experts yet</p>
                <Button onClick={() => navigate('/experts')} variant="outline">
                  Explore Experts
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {favoriteExperts.map((expert) => (
                  <div
                    key={expert.auth_id}
                    className="p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/expert/${expert.auth_id}`)}
                  >
                    <div className="text-center">
                      <Avatar className="mx-auto mb-2">
                        <AvatarImage src={expert.profile_picture || undefined} />
                        <AvatarFallback>
                          {expert.name?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-medium text-sm truncate">{expert.name}</p>
                      <p className="text-xs text-muted-foreground mb-2 truncate">
                        {expert.specialization || 'Expert'}
                      </p>
                      {expert.average_rating && (
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs">{expert.average_rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {favoriteExperts.length > 0 && (
              <div className="mt-4 text-center">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/user-dashboard/favorites')}
                >
                  View All Favorites
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Welcome Card */}
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
    </div>
  );
};

export default DashboardHome;
