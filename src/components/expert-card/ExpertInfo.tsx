
import React from 'react';
import { Star } from 'lucide-react';
import { ExpertInfoProps } from './types';

const ExpertInfo: React.FC<ExpertInfoProps> = ({ expert, showRating = true }) => {
  return (
    <div>
      {/* Name and price */}
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-lg leading-tight">{expert.name}</h3>
        {expert.price && (
          <div className="text-muted-foreground font-medium">
            ${expert.price}/min
          </div>
        )}
      </div>
      
      {/* Title */}
      {expert.title && (
        <p className="text-sm text-muted-foreground">{expert.title}</p>
      )}
      
      {/* Rating */}
      {showRating && expert.rating && (
        <div className="flex items-center gap-1 mt-1">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{expert.rating}</span>
          {expert.reviewCount && (
            <span className="text-xs text-muted-foreground">
              ({expert.reviewCount} review{expert.reviewCount !== 1 ? 's' : ''})
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ExpertInfo;
