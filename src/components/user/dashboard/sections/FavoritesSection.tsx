
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useFavorites } from '@/contexts/favorites/FavoritesContext';
import { Star, Heart } from 'lucide-react';

interface ExpertInfo {
  auth_id: string;
  name: string;
  profile_picture?: string | null;
  specialization?: string | null;
  average_rating?: number | null;
  reviews_count?: number | null;
  experience?: number | null;
}

const FavoritesSection: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSimpleAuth();
  const { expertFavoriteDetails, loading: favoritesLoading } = useFavorites();
  const [favoriteExperts, setFavoriteExperts] = useState<ExpertInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch favorite experts data from user_favorites table
  useEffect(() => {
    const fetchFavoriteExperts = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Fetch favorite experts from user_favorites table
        const { data: favoriteExpertsData, error: favoritesError } = await supabase
          .from('user_favorites')
          .select('expert_id')
          .eq('user_id', user.id);

        if (favoritesError) throw favoritesError;

        // Fetch expert details for favorites
        const favoriteExpertIds = favoriteExpertsData?.map(f => f.expert_id).filter(Boolean) || [];
        if (favoriteExpertIds.length > 0) {
          const { data: favoriteExpertsDetails, error: expertsError } = await supabase
            .from('expert_accounts')
            .select('auth_id, name, profile_picture, specialization, average_rating, reviews_count, experience')
            .in('auth_id', favoriteExpertIds);

          if (expertsError) throw expertsError;

          setFavoriteExperts(favoriteExpertsDetails || []);
        } else {
          setFavoriteExperts([]);
        }
      } catch (error) {
        console.error('Error fetching favorite experts:', error);
        setFavoriteExperts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoriteExperts();
  }, [user?.id, expertFavoriteDetails]); // Re-fetch when favorites change
  
  const getInitials = (name: string) => {
    return name.split(' ').map(part => part[0]).join('').toUpperCase();
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Favorite Experts</h2>
        <p className="text-muted-foreground">Experts you've saved for quick access</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Your Favorite Experts
          </CardTitle>
          <CardDescription>Click on any expert to view their profile</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading || favoritesLoading ? (
            <div className="flex justify-center py-8">
              <p className="text-sm text-muted-foreground">Loading experts...</p>
            </div>
          ) : favoriteExperts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteExperts.map((expert) => (
                <div
                  key={expert.auth_id}
                  className="p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/expert/${expert.auth_id}`)}
                >
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="mb-3 h-20 w-20">
                      <AvatarImage src={expert.profile_picture || undefined} alt={expert.name} />
                      <AvatarFallback className="text-lg">
                        {getInitials(expert.name)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-lg mb-1">{expert.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {expert.specialization || 'Expert'}
                    </p>
                    {expert.experience && (
                      <p className="text-xs text-muted-foreground mb-2">
                        {expert.experience} years experience
                      </p>
                    )}
                    {expert.average_rating && (
                      <div className="flex items-center justify-center gap-1 mb-3">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{expert.average_rating.toFixed(1)}</span>
                        {expert.reviews_count && expert.reviews_count > 0 && (
                          <span className="text-xs text-muted-foreground">
                            ({expert.reviews_count})
                          </span>
                        )}
                      </div>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/expert/${expert.auth_id}`);
                      }}
                    >
                      View Profile
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No favorite experts yet</p>
              <p className="text-sm text-muted-foreground mb-6">
                You haven't added any experts to favorites yet. Start exploring and save your favorite experts!
              </p>
              <Button variant="outline" onClick={() => navigate('/experts')}>
                Browse Experts
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FavoritesSection;
