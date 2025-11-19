import React, { memo, useMemo } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Video, Phone, Calendar, MessageSquare } from 'lucide-react';
import { ExpertCardData } from './types';
import { useAuthRedirectSystem } from '@/hooks/useAuthRedirectSystem';
import { useExpertPresence } from '@/contexts/ExpertPresenceContext';
import FavoriteButton from '@/components/favorites/FavoriteButton';
import { useFavorites } from '@/contexts/favorites/FavoritesContext';
import { getInitials } from '@/utils/getInitials';
import { toast } from 'sonner';
import { useExpertProfilePricing } from '@/hooks/useExpertProfilePricing';

export interface ExpertCardSimplifiedProps {
  expert: ExpertCardData;
  onClick?: () => void;
  className?: string;
  onConnectNow?: (type: 'video' | 'voice') => void;
  onBookNow?: () => void;
  onChat?: () => void;
  showConnectOptions?: boolean;
  onShowConnectOptions?: (show: boolean) => void;
}

const ExpertCardSimplified: React.FC<ExpertCardSimplifiedProps> = memo(({ 
  expert, 
  onClick, 
  className = '',
  onConnectNow,
  onBookNow,
  onChat,
  showConnectOptions = false,
  onShowConnectOptions,
}) => {
  const { requireAuthForExpert } = useAuthRedirectSystem();
  const { isExpertFavorite, toggleExpertFavorite } = useFavorites();
  const { getExpertPresence, version } = useExpertPresence();
  const { getPrice30, getPrice60, formatPrice, loading: pricingLoading } = useExpertProfilePricing(expert.auth_id);
  
  // Get real-time presence status
  const presence = useMemo(() => {
    const pres = getExpertPresence(expert.auth_id);
    return {
      status: (pres?.status ?? 'offline') as 'available' | 'busy' | 'away' | 'offline',
      isAvailable: pres?.status === 'available' && pres?.acceptingCalls === true,
    };
  }, [expert.auth_id, version, getExpertPresence]);

  const expertData = useMemo(() => ({
    name: expert.name || 'Unnamed Expert',
    avatarUrl: expert.profilePicture || '',
    specialization: expert.specialization || 'General',
    rating: expert.averageRating || 0,
    reviewCount: expert.reviewsCount || 0,
    experience: expert.experience || 0,
    price: expert.price || 0,
    initials: getInitials(expert.name || ''),
  }), [expert]);

  // Handle Connect Now button
  const handleConnectNow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!requireAuthForExpert(expert.auth_id, expertData.name, 'connect')) return;

    // Available → Direct call
    if (presence.isAvailable && onConnectNow) {
      onConnectNow('video');
      return;
    }

    // Away → Chat
    if (presence.status === 'away' && onChat) {
      onChat();
      return;
    }

    // Offline/Busy → Error
    if (presence.status === 'offline') {
      toast.error(`${expertData.name} is currently offline`);
      return;
    }

    // Show options if available
    if (onShowConnectOptions) {
      onShowConnectOptions(true);
    }
  };

  // Handle Book Session
  const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!requireAuthForExpert(expert.auth_id, expertData.name, 'book')) return;
    if (onBookNow) onBookNow();
  };

  // Handle Chat (for away status)
  const handleChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!requireAuthForExpert(expert.auth_id, expertData.name, 'connect')) return;
    if (onChat) onChat();
  };

  // Handle Connect Option (Video/Voice selection)
  const handleConnectOption = (type: 'video' | 'voice') => {
    if (!requireAuthForExpert(expert.auth_id, expertData.name, 'connect')) return;
    if (onConnectNow) onConnectNow(type);
    if (onShowConnectOptions) onShowConnectOptions(false);
  };

  // Render action buttons based on status
  const renderActionButtons = () => {
    if (showConnectOptions && presence.isAvailable) {
      return (
        <div className="flex gap-2">
          <Button size="sm" variant="default" className="flex-1" onClick={() => handleConnectOption('video')}>
            <Video className="h-3 w-3 mr-1" />
            Video
          </Button>
          <Button size="sm" variant="outline" className="flex-1" onClick={() => handleConnectOption('voice')}>
            <Phone className="h-3 w-3 mr-1" />
            Voice
          </Button>
        </div>
      );
    }

    // Away status → Show Chat button
    if (presence.status === 'away') {
      return (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="default"
            className="flex-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-900 border-yellow-300"
            onClick={handleChat}
          >
            <MessageSquare className="h-3 w-3 mr-1" />
            Chat
          </Button>
          <Button size="sm" variant="outline" className="flex-1" onClick={handleBookNow}>
            <Calendar className="h-3 w-3 mr-1" />
            Book Session
          </Button>
        </div>
      );
    }

    // Available status → Show Connect Now
    if (presence.status === 'available' && presence.isAvailable) {
      return (
        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1 border bg-green-100 hover:bg-green-200 text-green-900"
            onClick={handleConnectNow}
          >
            Connect Now
          </Button>
          <Button size="sm" variant="outline" className="flex-1" onClick={handleBookNow}>
            <Calendar className="h-3 w-3 mr-1" />
            Book Session
          </Button>
        </div>
      );
    }

    // Busy/Offline → Show status + Book Session
    const statusLabel = presence.status === 'busy' ? 'Busy' : 'Offline';
    const statusStyle = presence.status === 'busy' 
      ? { backgroundColor: 'rgb(255 237 213)', color: '#92400e' }
      : { backgroundColor: 'rgb(243 244 246)', color: '#374151' };

    return (
      <div className="flex gap-2">
        <span className="flex-1 inline-flex items-center justify-center text-xs font-medium px-3 py-2 rounded-md border" style={statusStyle}>
          {statusLabel}
        </span>
        <Button size="sm" variant="outline" className="flex-1" onClick={handleBookNow}>
          <Calendar className="h-3 w-3 mr-1" />
          Book Session
        </Button>
      </div>
    );
  };

  return (
    <Card 
      className={`overflow-hidden transition-all hover:shadow-lg cursor-pointer ${className}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="h-16 w-16 border-2 border-white shadow">
              <AvatarImage src={expertData.avatarUrl} alt={expertData.name} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {expertData.initials}
              </AvatarFallback>
            </Avatar>
            {/* Status indicator */}
            <span 
              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                presence.isAvailable ? 'bg-green-500' : 
                presence.status === 'busy' ? 'bg-orange-500' :
                presence.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
              }`}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-lg truncate">{expertData.name}</h3>
              <FavoriteButton
                isFavorite={isExpertFavorite(expert.auth_id)}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpertFavorite(expert.auth_id);
                }}
                expertId={expert.auth_id}
                expertName={expertData.name}
                size="sm"
              />
            </div>
            
            <p className="text-sm text-muted-foreground truncate mb-2">{expertData.specialization}</p>
            
            <div className="flex items-center gap-1 mb-3">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{expertData.rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({expertData.reviewCount})</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-muted-foreground">Experience</p>
                <p className="font-medium">{expertData.experience} years</p>
              </div>
              <div>
                <p className="text-muted-foreground">Price</p>
                {pricingLoading ? (
                  <p className="font-medium">...</p>
                ) : (
                  <div className="space-y-0.5">
                    <p className="font-medium">{formatPrice(getPrice30())}/30 mins</p>
                    <p className="font-medium text-muted-foreground">{formatPrice(getPrice60())}/60 mins</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-muted/50 px-4 py-3">
        <div className="w-full space-y-2">
          {renderActionButtons()}
        </div>
      </CardFooter>
    </Card>
  );
});

ExpertCardSimplified.displayName = 'ExpertCardSimplified';
export default ExpertCardSimplified;

