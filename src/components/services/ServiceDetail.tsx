
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useFavorites } from '@/contexts/favorites/FavoritesContext';

interface ServiceDetailProps {
  serviceId: number;
  image: string;
  title: string;
  description: string;
  price: number;
  expertId: string | number;
  expertName: string;
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({
  serviceId,
  image,
  title,
  description,
  price,
  expertId,
  expertName
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isExpertFavorite, toggleExpertFavorite } = useFavorites();
  const [isFavorite, setIsFavorite] = useState(isExpertFavorite(String(expertId)));
  
  const handleBookService = () => {
    if (!isAuthenticated) {
      toast.info('Please login to book services');
      navigate('/user-login');
      return;
    }
    
    navigate(`/book-service/${serviceId}`);
  };
  
  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to add experts to favorites');
      navigate('/user-login');
      return;
    }
    
    // Convert expertId to string to ensure compatibility
    const success = await toggleExpertFavorite(String(expertId));
    if (success) {
      setIsFavorite(!isFavorite);
      toast.success(isFavorite ? 'Expert removed from favorites' : 'Expert added to favorites');
    } else {
      toast.error('Failed to update favorites');
    }
  };
  
  return (
    <div className="border rounded-lg shadow-sm overflow-hidden">
      <div className="aspect-video w-full">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      
      <div className="p-6">
        <h3 className="text-2xl font-semibold">{title}</h3>
        <p className="text-lg text-muted-foreground mb-2">By {expertName}</p>
        <p className="mb-6">{description}</p>
        
        <div className="flex justify-between items-center">
          <div className="text-xl font-semibold">${price}</div>
          
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={handleToggleFavorite}
            >
              {isFavorite ? 'Remove From Favorites' : 'Add To Favorites'}
            </Button>
            
            <Button onClick={handleBookService}>
              Book Service
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
