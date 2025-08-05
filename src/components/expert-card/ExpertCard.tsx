
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Video, Phone } from 'lucide-react';
import { ExpertCardData } from './types';
import { useAuth } from '@/contexts/auth';
import { useAuthRedirectSystem } from '@/hooks/useAuthRedirectSystem';
import { toast } from 'sonner';


export interface ExpertCardProps {
  expert: ExpertCardData;
  onClick?: () => void;
  className?: string;
  onConnectNow?: (type: 'video' | 'voice') => void;
  onBookNow?: () => void;
  showConnectOptions?: boolean;
  onShowConnectOptions?: (show: boolean) => void;
}

const ExpertCard: React.FC<ExpertCardProps> = ({ 
  expert, 
  onClick, 
  className = '',
  onConnectNow,
  onBookNow,
  showConnectOptions = false,
  onShowConnectOptions
}) => {
  const { isAuthenticated } = useAuth();
  const { requireAuthForExpert, requireAuthForCall, executeIntendedAction } = useAuthRedirectSystem();

  // Default values for missing props
  const expertName = expert.name || 'Unnamed Expert';
  const avatarUrl = expert.profilePicture || '';
  const specialization = expert.specialization || 'General';
  const rating = expert.averageRating || 0;
  const reviewCount = expert.reviewsCount || 0;
  const status = expert.status || 'offline';
  const experience = expert.experience || 0;
  const price = expert.price || 0;
  const waitTime = expert.waitTime || 'Unknown';
  
  // Get avatar fallback initials
  const initials = expertName
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);

  // Execute pending action after authentication
  React.useEffect(() => {
    if (isAuthenticated) {
      const pendingAction = executeIntendedAction();
      if (pendingAction && pendingAction.params?.expertId === expert.id) {
        console.log('ExpertCard: Executing pending action for expert:', pendingAction);
        
        // Small delay to ensure component is ready
        setTimeout(() => {
          if (pendingAction.action === 'connect' && pendingAction.params?.callType && onConnectNow) {
            toast.success(`Logged in! Starting ${pendingAction.params.callType} call with ${expertName}`);
            onConnectNow(pendingAction.params.callType as 'video' | 'voice');
          } else if (pendingAction.action === 'book' && onBookNow) {
            toast.success(`Logged in! Opening booking for ${expertName}`);
            onBookNow();
          } else if (pendingAction.action === 'call' && onConnectNow) {
            toast.success(`Logged in! Opening call options for ${expertName}`);
            if (onShowConnectOptions) {
              onShowConnectOptions(true);
            }
          }
        }, 500);
      }
    }
  }, [isAuthenticated, executeIntendedAction, onConnectNow, onBookNow, onShowConnectOptions, expert.id, expertName]);

  const handleConnectNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!requireAuthForExpert(expert.id, expertName, 'connect')) {
      return; // User will be redirected to login
    }

    if (status !== 'online') {
      toast.error('Expert is currently offline');
      return;
    }

    if (onShowConnectOptions) {
      onShowConnectOptions(true);
    }
  };

  const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!requireAuthForExpert(expert.id, expertName, 'book')) {
      return; // User will be redirected to login
    }

    if (onBookNow) {
      onBookNow();
    }
  };

  const handleConnectOption = (type: 'video' | 'voice') => {
    if (!requireAuthForCall(expert.id, expertName, type)) {
      return; // User will be redirected to login
    }

    if (onConnectNow) {
      onConnectNow(type);
    }
    if (onShowConnectOptions) {
      onShowConnectOptions(false);
    }
  };
  
  return (
    <Card 
      className={`overflow-hidden transition-all hover:shadow-lg cursor-pointer max-w-md ${className}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="h-16 w-16 border-2 border-white shadow">
              <AvatarImage src={avatarUrl} alt={expertName} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span 
              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background 
                ${status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}
            />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{expertName}</h3>
            </div>
            
            <p className="text-sm text-muted-foreground">{specialization}</p>
            
            <div className="mt-2 flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({reviewCount})</span>
            </div>
            
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-muted-foreground">Experience</p>
                <p className="font-medium">{experience} years</p>
              </div>
              <div>
                <p className="text-muted-foreground">Price</p>
                <p className="font-medium">₹{price}/session</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-muted/50 px-4 py-3">
        <div className="w-full space-y-2">
          <div className="text-xs text-muted-foreground text-center">
            {status === 'online' ? `Available Now` : waitTime}
          </div>
          
          {/* Connect Options - shown when showConnectOptions is true */}
          {showConnectOptions && status === 'online' && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleConnectOption('voice');
                }}
              >
                <Phone className="h-3 w-3 mr-1" />
                Voice
              </Button>
            </div>
          )}
          
          {/* Default buttons when connect options are not shown */}
          {!showConnectOptions && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={status === 'online' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={handleConnectNow}
                  disabled={status !== 'online'}
                >
                  {status === 'online' ? 'Connect Now' : 'Offline'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={handleBookNow}
                >
                  Book Now
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ExpertCard;
