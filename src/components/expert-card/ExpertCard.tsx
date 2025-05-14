
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import ExpertImage from './ExpertImage';
import { ExpertCardProps } from './types';
import { cn } from '@/lib/utils';

const ExpertCard: React.FC<ExpertCardProps> = ({ 
  expert, 
  onClick,
  className,
  showRating = true,
}) => {
  return (
    <Card 
      className={cn("overflow-hidden cursor-pointer hover:shadow-md transition-shadow", className)}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <ExpertImage 
            profilePicture={expert.profilePicture}
            name={expert.name}
            className="h-16 w-16"
          />
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{expert.name}</h3>
              {expert.verified && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                  Verified
                </Badge>
              )}
            </div>
            
            {expert.specialization && (
              <p className="text-sm text-muted-foreground">{expert.specialization}</p>
            )}
            
            {showRating && expert.averageRating !== undefined && (
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{expert.averageRating.toFixed(1)}</span>
                {expert.reviewsCount !== undefined && (
                  <span className="text-xs text-muted-foreground">
                    ({expert.reviewsCount} reviews)
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpertCard;
