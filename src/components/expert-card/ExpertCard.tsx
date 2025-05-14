
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import ExpertImage from './ExpertImage';
import ExpertInfo from './ExpertInfo';
import ExpertActions from './ExpertActions';
import { ExpertCardProps } from './types';
import { useSafeFavorites } from '@/contexts/favorites/FavoritesContext';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Expert } from '@/types/expert';

const ExpertCard: React.FC<ExpertCardProps> = ({
  id,
  name,
  experience,
  specialties,
  rating,
  price,
  imageUrl,
  waitTime,
  online,
  isFavorite: propIsFavorite,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const favoritesContext = useSafeFavorites();
  
  // Parse id to number if it's a string
  const expertId = typeof id === 'string' ? parseInt(id, 10) : id;
  
  // Determine if expert is favorite based on prop or from the context (if available)
  const isFavorite = propIsFavorite !== undefined 
    ? propIsFavorite 
    : (favoritesContext?.isExpertFavorite?.(expertId) || false);
  
  const handleViewProfile = () => {
    navigate(`/experts/${id}`);
  };
  
  const handleFavoriteToggle = async (expertId: string | number) => {
    // Convert to number if it's a string
    const numericExpertId = typeof expertId === 'string' ? parseInt(expertId, 10) : expertId;
    
    if (isAuthenticated && favoritesContext?.toggleExpertFavorite) {
      await favoritesContext.toggleExpertFavorite(numericExpertId);
    }
  };
  
  return (
    <Card 
      className="overflow-hidden transition-shadow hover:shadow-md cursor-pointer border bg-card h-full"
      onClick={handleViewProfile}
    >
      <ExpertImage imageUrl={imageUrl} name={name} online={online} />
      
      <CardContent className="p-4">
        <ExpertInfo
          name={name}
          experience={experience}
          specialties={specialties}
          rating={rating}
          waitTime={waitTime}
          price={price}
        />
        
        <ExpertActions 
          id={id} 
          online={online} 
          isFavorite={isFavorite}
          onFavoriteToggle={handleFavoriteToggle}
        />
      </CardContent>
    </Card>
  );
};

export default ExpertCard;
