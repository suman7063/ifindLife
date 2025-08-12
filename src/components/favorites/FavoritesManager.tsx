import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Star, 
  Phone, 
  Video, 
  MessageSquare,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface FavoriteExpert {
  id: string;
  expert_id: string;
  expert: {
    id: string;
    name: string;
    profile_picture?: string;
    specialization?: string;
    average_rating?: number;
    reviews_count?: number;
    bio?: string;
  };
}

export const FavoritesManager: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<FavoriteExpert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select(`
          id,
          expert_id,
          expert:experts!inner(
            id,
            name,
            profile_picture,
            specialization,
            average_rating,
            reviews_count,
            bio
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId: string, expertName: string) => {
    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('id', favoriteId)
        .eq('user_id', user?.id);

      if (error) throw error;
      
      setFavorites(prev => prev.filter(f => f.id !== favoriteId));
      toast.success(`Removed ${expertName} from favorites`);
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove from favorites');
    }
  };

  const handleBookSession = (expertId: string) => {
    navigate(`/book/${expertId}`);
  };

  const handleViewProfile = (expertId: string) => {
    navigate(`/expert/${expertId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-48 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Favorite Experts</h1>
          <p className="text-muted-foreground">
            Quick access to your most trusted wellness professionals
          </p>
        </div>
        <Button onClick={() => navigate('/experts')} variant="outline">
          Find More Experts
        </Button>
      </div>

      {/* Favorites Grid */}
      {favorites.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold mb-2">No favorite experts yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start building your list of trusted experts by browsing our wellness professionals 
              and adding them to your favorites.
            </p>
            <Button onClick={() => navigate('/experts')} size="lg">
              Explore Experts
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => (
            <Card key={favorite.id} className="group hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={favorite.expert.profile_picture} />
                      <AvatarFallback>
                        {favorite.expert.name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{favorite.expert.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {favorite.expert.specialization || 'Wellness Expert'}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => removeFavorite(favorite.id, favorite.expert.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Rating */}
                {favorite.expert.average_rating && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium">
                        {favorite.expert.average_rating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({favorite.expert.reviews_count || 0} reviews)
                    </span>
                  </div>
                )}

                {/* Bio */}
                {favorite.expert.bio && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {favorite.expert.bio}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => handleBookSession(favorite.expert.id)}
                    >
                      <Video className="h-3 w-3" />
                      Book
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1"
                      onClick={() => handleViewProfile(favorite.expert.id)}
                    >
                      <ExternalLink className="h-3 w-3" />
                      Profile
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Phone className="h-3 w-3" />
                      Call
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <MessageSquare className="h-3 w-3" />
                      Message
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      {favorites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Favorites Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{favorites.length}</p>
                <p className="text-sm text-muted-foreground">Favorite Experts</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {(favorites.reduce((sum, f) => sum + (f.expert.average_rating || 0), 0) / favorites.length).toFixed(1)}
                </p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {new Set(favorites.map(f => f.expert.specialization)).size}
                </p>
                <p className="text-sm text-muted-foreground">Specializations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};