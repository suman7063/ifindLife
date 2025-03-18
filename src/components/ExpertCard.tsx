
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, MapPin, Phone, Calendar } from 'lucide-react';
import CallModal from './CallModal';
import BookingModal from './BookingModal';
import { useUserAuth } from '@/hooks/useUserAuth';
import { Expert } from '@/types/supabase/tables';

interface ExpertCardProps {
  expert: Expert;
}

const ExpertCard: React.FC<ExpertCardProps> = ({ expert }) => {
  const navigate = useNavigate();
  const { addToFavorites, removeFromFavorites, currentUser } = useUserAuth();
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  // Check if the expert is already in favorites
  const isFavorite = currentUser?.favorites?.some(fav => fav.expertId === expert.id);
  
  const handleFavoriteToggle = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    if (isFavorite) {
      removeFromFavorites(expert.id);
    } else {
      addToFavorites(expert);
    }
  };
  
  const handleViewProfile = () => {
    navigate(`/expert/${expert.id}`);
  };
  
  // Format expert for modals
  const expertForModals = {
    id: Number(expert.id),
    name: expert.name,
    imageUrl: expert.profile_picture || '/placeholder.svg',
    price: 20 // Replace with actual price from expert services
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="relative">
          <img 
            src={expert.profile_picture || '/placeholder.svg'} 
            alt={expert.name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full bg-white ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}
              onClick={handleFavoriteToggle}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill={isFavorite ? "currentColor" : "none"}
                stroke="currentColor" 
                className="w-5 h-5"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" 
                />
              </svg>
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg">{expert.name}</h3>
            <div className="flex items-center gap-1 text-ifind-gold">
              <Star className="fill-ifind-gold h-4 w-4" />
              <span>{expert.average_rating?.toFixed(1) || '0.0'}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-gray-600 text-sm mb-1">
            <Badge variant="outline" className="font-normal">
              {expert.specialization || 'Expert'}
            </Badge>
            {expert.experience && (
              <span className="text-xs">{expert.experience} yrs exp</span>
            )}
          </div>
          
          {expert.city && expert.country && (
            <div className="flex items-center gap-1 text-gray-600 text-sm mb-3">
              <MapPin className="h-3 w-3" />
              <span>{expert.city}, {expert.country}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center text-gray-700 mb-4">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-ifind-aqua" />
              <span className="text-sm">Availability: In 30 mins</span>
            </div>
            <div className="font-bold text-ifind-purple">₹20/min</div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline"
              className="flex items-center justify-center"
              onClick={() => setIsCallModalOpen(true)}
            >
              <Phone className="mr-1 h-4 w-4" />
              Call Now
            </Button>
            
            <Button 
              className="flex items-center justify-center"
              onClick={() => setIsBookingModalOpen(true)}
            >
              <Calendar className="mr-1 h-4 w-4" />
              Book
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            className="w-full mt-2 text-ifind-aqua hover:text-ifind-aqua/80"
            onClick={handleViewProfile}
          >
            View Profile
          </Button>
        </div>
      </CardContent>
      
      <CallModal 
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        expert={expertForModals}
      />
      
      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        expert={expertForModals}
      />
    </Card>
  );
};

export default ExpertCard;
