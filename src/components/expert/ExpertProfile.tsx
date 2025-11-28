
import React, { useState, useEffect } from 'react';
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
  const { getPrice30, getPrice60, formatPrice, loading: pricingLoading } = useExpertProfilePricing(expert.auth_id?.toString() || '');
  const [imageUrl, setImageUrl] = useState(expert.imageUrl);
  const [imageKey, setImageKey] = useState(0);

  // Update local imageUrl when expert prop changes
  useEffect(() => {
    setImageUrl(expert.imageUrl);
  }, [expert.imageUrl]);

  // Listen for profile image updates for real-time refresh
  useEffect(() => {
    const handleProfileUpdate = (event: CustomEvent) => {
      const eventAuthId = event.detail?.authId;
      if (eventAuthId === expert.auth_id?.toString()) {
        const newUrl = event.detail?.profilePictureUrl;
        console.log('ExpertProfile: Profile image update received', {
          authId: expert.auth_id,
          newUrl: newUrl,
          currentUrl: imageUrl
        });
        
        if (newUrl) {
          // Add cache-busting parameter
          const cacheBustedUrl = `${newUrl}${newUrl.includes('?') ? '&' : '?'}t=${Date.now()}`;
          setImageUrl(cacheBustedUrl);
          setImageKey(prev => prev + 1);
          console.log('ExpertProfile: Updated imageUrl in real-time');
        }
      }
    };

    window.addEventListener('expertProfileImageUpdated', handleProfileUpdate as EventListener);
    window.addEventListener('expertProfileRefreshed', handleProfileUpdate as EventListener);

    return () => {
      window.removeEventListener('expertProfileImageUpdated', handleProfileUpdate as EventListener);
      window.removeEventListener('expertProfileRefreshed', handleProfileUpdate as EventListener);
    };
  }, [expert.auth_id, imageUrl]);

  const handleCallClick = () => {
    if (!requireAuthForCall(expert.auth_id?.toString() || '', expert.name, 'video')) {
      return; // User will be redirected to login
    }
    onCallClick();
  };

  const handleBookClick = () => {
    if (!requireAuthForExpert(expert.auth_id?.toString() || '', expert.name, 'book')) {
      return; // User will be redirected to login
    }
    onBookClick();
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      return; // FavoriteButton will handle auth redirect
    }
    
    try {
      await toggleExpertFavorite(expert.auth_id?.toString() || '');
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };
  return (
    <Card className="overflow-hidden border border-ifind-teal/20 bg-white shadow-sm">
        {/* Expert Image */}
        <div className="relative h-80 w-full bg-gradient-to-br from-ifind-offwhite to-gray-100 overflow-hidden">
          {imageUrl ? (
            <div className="w-full h-full flex items-center justify-center p-4">
              <img 
                key={imageKey}
                src={imageUrl} 
                alt={expert.name} 
                className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-md transition-all duration-300 hover:scale-105"
                style={{ 
                  objectFit: 'contain',
                  objectPosition: 'center'
                }}
                onError={(e) => {
                  console.error('Image load error:', imageUrl);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          ) : (
            <div className="w-full h-full bg-ifind-offwhite flex items-center justify-center">
              <span className="text-6xl font-bold text-ifind-charcoal">
                {expert.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </span>
            </div>
          )}
          
          {/* Online Status */}
          {expert.online && (
            <div className="absolute top-4 right-4 bg-ifind-teal text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg z-10">
              <div className="flex items-center space-x-1.5">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span>Online</span>
              </div>
            </div>
          )}

          {/* Favorite Button */}
          <div className="absolute top-4 left-4 z-10">
            <FavoriteButton
              isFavorite={isExpertFavorite(expert.auth_id?.toString() || '')}
              onClick={handleFavoriteClick}
              expertId={expert.auth_id?.toString() || ''}
              expertName={expert.name}
              tooltipText={isExpertFavorite(expert.auth_id?.toString() || '') ? 'Remove from favorites' : 'Add to favorites'}
              className="backdrop-blur-md bg-white/40 hover:bg-white/60 border border-white/50 shadow-md"
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
              className="flex items-center justify-center gap-2 bg-ifind-aqua hover:bg-ifind-aqua/90 text-white transition-all duration-300"
              variant="default"
            >
              <Phone className="h-4 w-4" />
              <span>Call</span>
            </Button>
            
            <Button 
              onClick={handleBookClick} 
              className="flex items-center justify-center gap-2 border-ifind-purple text-ifind-purple hover:bg-ifind-purple hover:text-white transition-all duration-300"
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
