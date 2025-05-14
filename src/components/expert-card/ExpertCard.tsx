
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { ExpertCardProps } from './types';
import ExpertInfo from './ExpertInfo';
import ExpertActions from './ExpertActions';

/**
 * ExpertCard component displays an expert's information in a card format
 */
const ExpertCard: React.FC<ExpertCardProps> = ({ 
  expert, 
  onClick, 
  className = '',
  showRating = true
}) => {
  return (
    <Card 
      className={`overflow-hidden hover:shadow-md transition-shadow ${className}`}
      onClick={onClick}
      data-testid="expert-card"
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={expert.profilePicture || expert.imageUrl} alt={expert.name} />
            <AvatarFallback>
              {expert.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <ExpertInfo expert={expert} showRating={showRating} />
            
            {/* Status badge */}
            {expert.status && (
              <div className="mt-2">
                <Badge 
                  variant={expert.status === 'online' ? 'default' : 'outline'} 
                  className={expert.status === 'online' ? 'bg-green-500' : ''}
                >
                  {expert.status === 'online' ? 'Online' : expert.status === 'busy' ? 'Busy' : 'Offline'}
                </Badge>
              </div>
            )}
            
            {/* Specialties */}
            {expert.specialties && expert.specialties.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {expert.specialties.slice(0, 3).map((specialty, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
                {expert.specialties.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{expert.specialties.length - 3}
                  </Badge>
                )}
              </div>
            )}
            
            {/* Actions */}
            <ExpertActions expert={expert} onClick={onClick} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpertCard;
