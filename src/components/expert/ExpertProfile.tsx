
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Languages, Star, Phone, Calendar, MessageCircle } from "lucide-react";
import { useAuthRedirectSystem } from '@/hooks/useAuthRedirectSystem';
import FavoriteButton from '@/components/favorites/FavoriteButton';
import { useFavorites } from '@/contexts/favorites/FavoritesContext';

interface ExpertProfileProps {
  expert: {
    id: number;
    name: string;
    experience: number;
    specialties: string[];
    rating: number;
    consultations: number;
    price: number;
    waitTime: string;
    imageUrl: string;
    online: boolean;
    languages: string[];
    description: string;
  };
  onCallClick: () => void;
  onBookClick: () => void;
  onChatClick: () => void;
}

const ExpertProfile: React.FC<ExpertProfileProps> = ({ 
  expert, 
  onCallClick, 
  onBookClick,
  onChatClick 
}) => {
  const { requireAuthForExpert, requireAuthForCall, isAuthenticated } = useAuthRedirectSystem();
  const { isExpertFavorite, toggleExpertFavorite } = useFavorites();

  const handleCallClick = () => {
    if (!requireAuthForCall(expert.id.toString(), expert.name, 'video')) {
      return; // User will be redirected to login
    }
    onCallClick();
  };

  const handleBookClick = () => {
    if (!requireAuthForExpert(expert.id.toString(), expert.name, 'book')) {
      return; // User will be redirected to login
    }
    onBookClick();
  };

  const handleChatClick = () => {
    if (!requireAuthForExpert(expert.id.toString(), expert.name, 'connect')) {
      return; // User will be redirected to login
    }
    onChatClick();
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      return; // FavoriteButton will handle auth redirect
    }
    
    toggleExpertFavorite(expert.id.toString());
  };
  return (
    <Card className="overflow-hidden border-0 shadow-md">
        {/* Expert Image */}
        <div className="relative h-64 w-full">
          <img 
            src={expert.imageUrl} 
            alt={expert.name} 
            className="w-full h-full object-cover"
          />
          
          {/* Online Status */}
          {expert.online && (
            <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Online
            </div>
          )}

          {/* Favorite Button */}
          <div className="absolute top-4 left-4">
            <FavoriteButton
              isFavorite={isExpertFavorite(expert.id.toString())}
              onClick={handleFavoriteClick}
              expertId={expert.id.toString()}
              expertName={expert.name}
              tooltipText={isExpertFavorite(expert.id.toString()) ? 'Remove from favorites' : 'Add to favorites'}
            />
          </div>
        </div>
      
      <CardContent className="p-6">
        {/* Expert Name and Rating */}
        <div className="space-y-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold">{expert.name}</h2>
            <p className="text-gray-500">{expert.experience} years experience</p>
          </div>
          
          <div className="flex items-center gap-1">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{expert.rating}</span>
            <span className="text-gray-500">({expert.consultations.toLocaleString()} consultations)</span>
          </div>
        </div>
        
        {/* Location and Languages */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span>India</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Languages className="h-4 w-4 text-gray-500" />
            <span>{expert.languages.join(", ")}</span>
          </div>
        </div>
        
        {/* Specialties */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Specialties</h3>
          <div className="flex flex-wrap gap-2">
            {expert.specialties.map((specialty, index) => (
              <Badge key={index} variant="outline" className="bg-gray-100">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Price and CTA */}
        <div className="space-y-4">
          <div className="border-t pt-4">
            <p className="text-lg font-semibold">₹{expert.price}/min</p>
            <p className="text-sm text-green-600">{expert.waitTime}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleCallClick}
              className="flex items-center justify-center gap-2"
              variant="default"
            >
              <Phone className="h-4 w-4" />
              <span>Call</span>
            </Button>
            
            <Button 
              onClick={handleBookClick} 
              className="flex items-center justify-center gap-2"
              variant="outline"
              data-id="booking-tab-button"
            >
              <Calendar className="h-4 w-4" />
              <span>Book</span>
            </Button>
          </div>
          
          <Button 
            onClick={handleChatClick}
            className="w-full flex items-center justify-center gap-2"
            variant="secondary"
            data-id="chat-button"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Chat (30% off)</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpertProfile;
