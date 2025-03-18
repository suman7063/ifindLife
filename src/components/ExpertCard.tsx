
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Clock, DollarSign, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Expert } from '@/types/expert';
import { useUserAuth } from '@/hooks/useUserAuth';
import { useFavorites } from '@/hooks/auth/useFavorites';

interface ExpertCardProps {
  expert: Expert;
}

const ExpertCard: React.FC<ExpertCardProps> = ({ expert }) => {
  const { currentUser } = useUserAuth();
  const { addToFavorites, removeFromFavorites } = useFavorites();
  
  // Check if the expert is in favorites list
  const isExpertFavorite = currentUser?.favoriteExperts?.some(
    favExpert => favExpert.id === expert.id.toString()
  ) || false;

  const toggleFavorite = () => {
    if (!currentUser) return;
    
    if (isExpertFavorite) {
      removeFromFavorites(currentUser, expert.id.toString());
    } else {
      addToFavorites(currentUser, expert.id.toString());
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative">
        <img 
          src={expert.imageUrl} 
          alt={expert.name}
          className="h-48 w-full object-cover object-center transition-transform group-hover:scale-105"
        />
        {expert.online && (
          <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">
            Online
          </Badge>
        )}
        {currentUser && (
          <button
            onClick={toggleFavorite}
            className="absolute top-2 left-2 p-1.5 bg-white/80 rounded-full hover:bg-white transition-colors"
            aria-label={isExpertFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              className={`h-4 w-4 ${isExpertFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} 
            />
          </button>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">{expert.name}</h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="font-semibold">{expert.rating || 0}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{expert.experience} years experience</p>
      </CardHeader>
      
      <CardContent className="pb-4">
        <div className="flex flex-wrap gap-1 mb-4">
          {expert.specialties?.slice(0, 3).map((specialty, index) => (
            <Badge key={index} variant="secondary" className="font-normal">
              {specialty}
            </Badge>
          ))}
          {expert.specialties && expert.specialties.length > 3 && (
            <Badge variant="outline" className="font-normal">
              +{expert.specialties.length - 3} more
            </Badge>
          )}
        </div>
        
        <div className="flex justify-between items-center text-sm mt-4">
          <div className="flex items-center">
            <DollarSign className="h-3.5 w-3.5 text-muted-foreground mr-1" />
            <span className="font-medium">${expert.price}/session</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 text-muted-foreground mr-1" />
            <span>{expert.waitTime}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Link to={`/experts/${expert.id}`} className="w-full">
          <Button className="w-full bg-ifind-aqua hover:bg-ifind-teal">
            View Profile
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ExpertCard;
