
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Languages, Star, Phone, Calendar } from "lucide-react";
import { useAuthRedirectSystem } from '@/hooks/useAuthRedirectSystem';
import FavoriteButton from '@/components/favorites/FavoriteButton';
import { useFavorites } from '@/contexts/favorites/FavoritesContext';
import { useExpertProfilePricing } from '@/hooks/useExpertProfilePricing';

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
    category?: string;
  };
  onCallClick: () => void;
  onBookClick: () => void;
}

const ExpertProfile: React.FC<ExpertProfileProps> = ({ 
  expert, 
  onCallClick, 
  onBookClick
}) => {
  const { requireAuthForExpert, requireAuthForCall, isAuthenticated } = useAuthRedirectSystem();
  const { isExpertFavorite, toggleExpertFavorite } = useFavorites();
  const { getPrice30, getPrice60, formatPrice, loading: pricingLoading } = useExpertProfilePricing(expert.id.toString());

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

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      return; // FavoriteButton will handle auth redirect
    }
    
    toggleExpertFavorite(expert.id.toString());
  };
  return (
    <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white via-white to-primary/5 backdrop-blur-sm">
        {/* Expert Image */}
        <div className="relative h-72 w-full">
          {expert.imageUrl ? (
            <img 
              src={expert.imageUrl} 
              alt={expert.name} 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <span className="text-6xl font-bold text-primary drop-shadow-md">
                {expert.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </span>
            </div>
          )}
          
          {/* Online Status */}
          {expert.online && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm border border-white/20">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span>Online</span>
              </div>
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
              className="backdrop-blur-sm bg-white/20 hover:bg-white/30 border border-white/30"
            />
          </div>

          {/* Overlay gradient for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
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
        
        {/* Session Rates & CTA */}
        <div className="space-y-4">
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">30 min session</span>
              <span className="font-semibold">
                {pricingLoading ? '...' : formatPrice(getPrice30())}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">60 min session</span>
              <span className="font-semibold">
                {pricingLoading ? '...' : formatPrice(getPrice60())}
              </span>
            </div>
            <p className="text-sm text-green-600 pt-2">{expert.waitTime}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleCallClick}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary transition-all duration-300"
              variant="default"
            >
              <Phone className="h-4 w-4" />
              <span>Call</span>
            </Button>
            
            <Button 
              onClick={handleBookClick} 
              className="flex items-center justify-center gap-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
              variant="outline"
              data-id="booking-tab-button"
            >
              <Calendar className="h-4 w-4" />
              <span>Book</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpertProfile;
