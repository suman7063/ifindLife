
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import ExpertImage from './ExpertImage';
import ExpertInfo from './ExpertInfo';
import ExpertActions from './ExpertActions';
import { ExpertCardProps } from './types';
import { useFavorites } from '@/contexts/favorites/FavoritesContext';
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
  const { toggleExpertFavorite, isExpertFavorite } = useFavorites();
  
  // Determine if expert is favorite based on prop or from the context
  const isFavorite = propIsFavorite !== undefined 
    ? propIsFavorite 
    : isExpertFavorite(id);
  
  const handleViewProfile = () => {
    navigate(`/experts/${id}`);
  };
  
  const handleFavoriteToggle = async (expertId: string) => {
    if (isAuthenticated) {
      // Pass only the expert ID to toggleExpertFavorite, not the entire expert object
      await toggleExpertFavorite(expertId);
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
