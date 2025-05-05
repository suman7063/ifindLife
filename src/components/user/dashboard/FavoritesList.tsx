
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFavorites } from '@/contexts/favorites/FavoritesContext';
import { Loader2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface FavoritesListProps {
  type: 'experts' | 'programs';
  onToggle?: (id: string | number) => Promise<boolean>;
}

const FavoritesList: React.FC<FavoritesListProps> = ({ type, onToggle }) => {
  const { 
    expertFavorites, 
    programFavorites, 
    isLoading,
    toggleExpertFavorite,
    toggleProgramFavorite
  } = useFavorites();
  const navigate = useNavigate();
  
  const favorites = type === 'experts' ? expertFavorites : programFavorites;
  const toggleFavorite = type === 'experts' ? toggleExpertFavorite : toggleProgramFavorite;
  
  const handleToggle = async (id: string | number) => {
    if (onToggle) {
      await onToggle(id);
    } else {
      await toggleFavorite(id);
    }
  };
  
  const handleViewDetails = (id: string | number) => {
    if (type === 'experts') {
      navigate(`/experts/${id}`);
    } else {
      navigate(`/wellness-programs/${id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-10">
        <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">
          No {type === 'experts' ? 'experts' : 'programs'} in your favorites yet
        </h3>
        <p className="text-muted-foreground mb-4">
          Start adding {type === 'experts' ? 'experts' : 'programs'} to your favorites to see them here
        </p>
        <Button 
          onClick={() => navigate(type === 'experts' ? '/experts' : '/wellness-programs')} 
          variant="outline"
        >
          Explore {type === 'experts' ? 'Experts' : 'Programs'}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {favorites.map((id) => (
          <Card key={id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle>{type === 'experts' ? `Expert ID: ${id}` : `Program ID: ${id}`}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleViewDetails(id)}
              >
                View Details
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleToggle(id)}
              >
                <Heart className="h-5 w-5 fill-red-500 text-red-500" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FavoritesList;
