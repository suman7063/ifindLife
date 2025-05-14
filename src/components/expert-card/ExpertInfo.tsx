
import React from 'react';
import { Star } from 'lucide-react';
import { ExpertInfoProps } from './types';

const ExpertInfo: React.FC<ExpertInfoProps> = ({ expert, showRating = true }) => {
  return (
    <div>
      {/* Expert name */}
      <h3 className="font-semibold text-lg">{expert.name}</h3>
      
      {/* Expert title or specialization */}
      {(expert.title || expert.specialization) && (
        <p className="text-muted-foreground text-sm">
          {expert.title || expert.specialization}
        </p>
      )}
      
      {/* Rating */}
      {showRating && (expert.rating !== undefined || expert.averageRating !== undefined) && (
        <div className="flex items-center mt-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
          <span className="text-sm font-medium">
            {expert.rating || expert.averageRating || 0}
          </span>
          {(expert.reviewCount !== undefined || expert.reviewsCount !== undefined) && (
            <span className="text-xs text-muted-foreground ml-1">
              ({expert.reviewCount || expert.reviewsCount || 0} reviews)
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ExpertInfo;
