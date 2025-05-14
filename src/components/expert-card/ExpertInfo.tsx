
import React from 'react';
import { Star } from 'lucide-react';
import { ExpertInfoProps } from './types';

const ExpertInfo: React.FC<ExpertInfoProps> = ({ expert, showRating }) => {
  return (
    <div>
      <h3 className="font-medium text-base">{expert.name}</h3>
      
      {expert.specialization && (
        <p className="text-sm text-muted-foreground">{expert.specialization}</p>
      )}
      
      {showRating && expert.averageRating !== undefined && (
        <div className="flex items-center gap-1 mt-1">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{expert.averageRating.toFixed(1)}</span>
          {expert.reviewsCount !== undefined && (
            <span className="text-xs text-muted-foreground">
              ({expert.reviewsCount} {expert.reviewsCount === 1 ? 'review' : 'reviews'})
            </span>
          )}
        </div>
      )}
      
      {expert.experience && (
        <p className="text-xs text-muted-foreground mt-1">
          {typeof expert.experience === 'number' 
            ? `${expert.experience} years experience` 
            : expert.experience}
        </p>
      )}
    </div>
  );
};

export default ExpertInfo;
