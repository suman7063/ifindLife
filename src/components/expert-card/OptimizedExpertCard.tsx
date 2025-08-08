import React, { memo, useMemo, useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Video, Phone, Clock, Calendar, Languages } from 'lucide-react';
import { ExpertCardData } from './types';
import { useAuth } from '@/contexts/auth';
import { useAuthRedirectSystem } from '@/hooks/useAuthRedirectSystem';
import { useExpertPresence } from '@/contexts/ExpertPresenceContext';
import ExpertStatusIndicator from './ExpertStatusIndicator';
import AwayMessageDialog from './AwayMessageDialog';
import FavoriteButton from '@/components/favorites/FavoriteButton';
import { useFavorites } from '@/contexts/favorites/FavoritesContext';
import { getInitials } from '@/utils/getInitials';
import { toast } from 'sonner';
import { useExpertCategoryPricing } from '@/hooks/useExpertCategoryPricing';

export interface OptimizedExpertCardProps {
  expert: ExpertCardData;
  onClick?: () => void;
  className?: string;
  onConnectNow?: (type: 'video' | 'voice') => void;
  onBookNow?: () => void;
  showConnectOptions?: boolean;
  onShowConnectOptions?: (show: boolean) => void;
  variant?: 'default' | 'compact' | 'detailed';
  showCategoryBadge?: boolean;
}

const OptimizedExpertCard: React.FC<OptimizedExpertCardProps> = memo(({ 
  expert, 
  onClick, 
  className = '',
  onConnectNow,
  onBookNow,
  showConnectOptions = false,
  onShowConnectOptions,
  variant = 'default',
  showCategoryBadge = false
}) => {
  const { isAuthenticated } = useAuth();
  const { requireAuthForExpert, requireAuthForCall, executeIntendedAction } = useAuthRedirectSystem();
  const { isExpertFavorite, toggleExpertFavorite } = useFavorites();
  const [showAwayDialog, setShowAwayDialog] = useState(false);
  
  // Use category-based pricing hook
  const { getFormattedPrice } = useExpertCategoryPricing((expert as any).category);
  
  // Use simplified expert presence
  const { getExpertPresence } = useExpertPresence();
  
  const getExpertStatus = (expertId: string) => {
    const presence = getExpertPresence(expertId);
    return {
      status: presence?.status === 'online' ? 'online' : 
              presence?.status === 'away' ? 'away' : 'offline',
      isAvailable: presence?.isAvailable || false,
      lastActivity: presence?.lastActivity || ''
    };
  };
  
  const isExpertLoading = () => false; // Simplified - no lazy loading needed

  // Memoize expert data processing
  const expertData = useMemo(() => {
    const presenceStatus = getExpertStatus(expert.id);
    
    // Map presence status to ExpertStatusIndicator expected format
    const mappedStatus: 'available' | 'busy' | 'away' | 'offline' = 
      presenceStatus.status === 'online' ? 'available' :
      presenceStatus.status === 'away' ? 'away' : 'offline';
    
    return {
      id: expert.id,
      name: expert.name || 'Unnamed Expert',
      avatarUrl: expert.profilePicture || '',
      specialization: expert.specialization || 'General',
      rating: expert.averageRating || 0,
      reviewCount: expert.reviewsCount || 0,
      status: mappedStatus,
      isAvailable: presenceStatus.isAvailable,
      experience: expert.experience || 0,
      price: expert.price || 0,
      waitTime: expert.waitTime || 'Unknown',
      category: (expert as any).category || '',
      initials: getInitials(expert.name || ''),
      languages: (expert as any).languages || ['English']
    };
  }, [expert, getExpertStatus]);

  const handleInteraction = async (action: () => void) => {
    // Simplified - just execute the action without additional presence checking
    action();
  };

  // Category badge logic from ExpertApprovalWorkflow
  const getCategoryBadgeColor = (category: string) => {
    const colors = {
      'listening-volunteer': 'bg-blue-100 text-blue-800',
      'listening-expert': 'bg-green-100 text-green-800', 
      'listening-coach': 'bg-purple-100 text-purple-800',
      'mindfulness-expert': 'bg-yellow-100 text-yellow-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatCategoryName = (category: string) => {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Handle authentication flow after login
  React.useEffect(() => {
    if (isAuthenticated) {
      const pendingAction = executeIntendedAction();
      if (pendingAction && pendingAction.params?.expertId === expertData.id) {
        setTimeout(async () => {
          if (pendingAction.action === 'connect' && pendingAction.params?.callType && onConnectNow) {
            toast.success(`Logged in! Starting ${pendingAction.params.callType} call with ${expertData.name}`);
            await handleInteraction(() => onConnectNow(pendingAction.params.callType as 'video' | 'voice'));
          } else if (pendingAction.action === 'book' && onBookNow) {
            toast.success(`Logged in! Opening booking for ${expertData.name}`);
            await handleInteraction(() => onBookNow());
          } else if (pendingAction.action === 'call' && onShowConnectOptions) {
            toast.success(`Logged in! Opening call options for ${expertData.name}`);
            await handleInteraction(() => onShowConnectOptions(true));
          }
        }, 500);
      }
    }
  }, [isAuthenticated, executeIntendedAction, onConnectNow, onBookNow, onShowConnectOptions, expertData.id, expertData.name, handleInteraction]);

  // Handle connect now with improved UX
  const handleConnectNow = React.useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!requireAuthForExpert(expertData.id, expertData.name, 'connect')) {
      return;
    }

    await handleInteraction(() => {
      if (expertData.status === 'away') {
        setShowAwayDialog(true);
        return;
      }

      if (expertData.status === 'offline') {
        toast.error(`${expertData.name} is currently offline`);
        return;
      }

      if (expertData.isAvailable && onShowConnectOptions) {
        onShowConnectOptions(true);
      }
    });
  }, [requireAuthForExpert, expertData.id, expertData.name, expertData.status, expertData.isAvailable, onShowConnectOptions, handleInteraction]);

  // Handle book now with improved UX
  const handleBookNow = React.useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!requireAuthForExpert(expertData.id, expertData.name, 'book')) {
      return;
    }

    await handleInteraction(() => {
      if (onBookNow) {
        onBookNow();
      }
    });
  }, [requireAuthForExpert, expertData.id, expertData.name, onBookNow, handleInteraction]);

  // Handle favorite click
  const handleFavoriteClick = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      return; // FavoriteButton will handle auth redirect
    }
    
    toggleExpertFavorite(expertData.id);
  }, [isAuthenticated, toggleExpertFavorite, expertData.id]);

  // Handle specific connection type
  const handleConnectOption = React.useCallback(async (type: 'video' | 'voice') => {
    if (!requireAuthForCall(expertData.id, expertData.name, type)) {
      return;
    }

    await handleInteraction(() => {
      // Double check availability before connecting
      if (!expertData.isAvailable) {
        toast.error(`${expertData.name} is no longer available for connection`);
        if (onShowConnectOptions) {
          onShowConnectOptions(false);
        }
        return;
      }

      if (onConnectNow) {
        onConnectNow(type);
      }
      if (onShowConnectOptions) {
        onShowConnectOptions(false);
      }
    });
  }, [requireAuthForCall, expertData.id, expertData.name, expertData.isAvailable, onConnectNow, onShowConnectOptions, handleInteraction]);

  // Render buttons based on variant and state
  const renderActionButtons = () => {
    const isLoading = isExpertLoading();
    
    if (showConnectOptions && expertData.isAvailable) {
      return (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="default"
            className="flex-1"
            disabled={isLoading}
            onClick={(e) => {
              e.stopPropagation();
              handleConnectOption('video');
            }}
          >
            <Video className="h-3 w-3 mr-1" />
            Video
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            disabled={isLoading}
            onClick={(e) => {
              e.stopPropagation();
              handleConnectOption('voice');
            }}
          >
            <Phone className="h-3 w-3 mr-1" />
            Voice
          </Button>
        </div>
      );
    }

    return (
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={expertData.isAvailable ? 'default' : 'outline'}
          className={`flex-1 ${expertData.isAvailable ? 'bg-ifind-aqua hover:bg-ifind-aqua/90 text-white' : ''}`}
          disabled={isLoading}
          onClick={handleConnectNow}
        >
          {isLoading ? (
            <>Loading...</>
          ) : expertData.isAvailable ? (
            <>
              <Video className="h-3 w-3 mr-1" />
              <span className="text-xs">
                Connect Now
                {expertData.status === 'available' && (
                  <span className="ml-1 inline-flex h-2 w-2 rounded-full bg-green-400"></span>
                )}
              </span>
            </>
          ) : expertData.status === 'away' ? (
            <>
              Send Message
            </>
          ) : (
            <>
              <Clock className="h-3 w-3 mr-1" />
              {expertData.status === 'offline' ? 'Offline' : 'Unavailable'}
            </>
          )}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          disabled={isLoading}
          onClick={handleBookNow}
        >
          <Calendar className="h-3 w-3 mr-1" />
          Book
        </Button>
      </div>
    );
  };

  const cardContent = (
    <>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="h-16 w-16 border-2 border-white shadow">
              <AvatarImage 
                src={expertData.avatarUrl || ''} 
                alt={expertData.name}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {expertData.initials}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-lg truncate">{expertData.name}</h3>
              <div className="flex items-center gap-2">
                {showCategoryBadge && expertData.category && (
                  <Badge 
                    variant="secondary"
                    className={getCategoryBadgeColor(expertData.category)}
                  >
                    {formatCategoryName(expertData.category)}
                  </Badge>
                )}
                <FavoriteButton
                  isFavorite={isExpertFavorite(expertData.id)}
                  onClick={handleFavoriteClick}
                  expertId={expertData.id}
                  expertName={expertData.name}
                  tooltipText={isExpertFavorite(expertData.id) ? 'Remove from favorites' : 'Add to favorites'}
                  size="sm"
                />
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground truncate mb-2">{expertData.specialization}</p>
            
            <div className="flex items-center gap-1 mb-3">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{expertData.rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({expertData.reviewCount})</span>
            </div>
            
            {variant !== 'compact' && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Experience</p>
                  <p className="font-medium">{expertData.experience} years</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Price</p>
                  <p className="font-medium">From {getFormattedPrice()}/session</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-muted/50 px-4 py-3">
        <div className="w-full space-y-2">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Languages className="h-3 w-3" />
            <span>{expertData.languages.join(', ')}</span>
          </div>
          {renderActionButtons()}
        </div>
      </CardFooter>
    </>
  );

  return (
    <>
      <Card 
        className={`overflow-hidden transition-all hover:shadow-lg cursor-pointer ${className}`}
        onClick={onClick}
      >
        {cardContent}
      </Card>
      
      {/* Away Message Dialog */}
      <AwayMessageDialog
        isOpen={showAwayDialog}
        onClose={() => setShowAwayDialog(false)}
        expertId={expertData.id}
        expertName={expertData.name}
      />
    </>
  );
});

OptimizedExpertCard.displayName = 'OptimizedExpertCard';

export default OptimizedExpertCard;