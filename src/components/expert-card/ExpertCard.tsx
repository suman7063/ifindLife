
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { ExpertCardData } from './types';

export interface ExpertCardProps {
  expert: ExpertCardData;
  onClick?: () => void;
  className?: string;
}

const ExpertCard: React.FC<ExpertCardProps> = ({ expert, onClick, className = '' }) => {
  // Default values for missing props
  const expertName = expert.name || 'Unnamed Expert';
  const avatarUrl = expert.profilePicture || '';
  const specialization = expert.specialization || 'General';
  const rating = expert.averageRating || 0;
  const reviewCount = expert.reviewsCount || 0;
  const isVerified = expert.verified || false;
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
  
  return (
    <Card 
      className={`overflow-hidden transition-all hover:shadow-lg ${className}`}
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
              {isVerified && (
                <Badge variant="outline" className="border-green-500 text-green-600">
                  Verified
                </Badge>
              )}
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
                <p className="font-medium">${price}/session</p>
              </div>
              <div>
                <p className="text-muted-foreground">Wait Time</p>
                <p className="font-medium">{waitTime}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-muted/50 px-4 py-3">
        <Button 
          variant="secondary" 
          size="sm" 
          className="w-full"
          onClick={onClick}
        >
          View Profile
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExpertCard;
