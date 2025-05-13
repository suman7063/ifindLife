
import React from 'react';
import { ExpertCardProps } from './types';
import ExpertInfo from './ExpertInfo';
import ExpertImage from './ExpertImage';
import ExpertActions from './ExpertActions';

const ExpertCard: React.FC<ExpertCardProps> = ({
  expert,
  showRating = true,
  showActions = true,
  showPrice = true,
  compact = false,
  className = '',
  onBook,
  onChat,
  onCall,
  onFavoriteToggle,
  isFavorited = false,
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${compact ? 'compact' : ''} ${className}`}>
      <div className="flex flex-col md:flex-row">
        <ExpertImage 
          imageUrl={expert.profile_picture} 
          name={expert.name || 'Expert'} 
          isOnline={expert.is_online} 
          compact={compact} 
        />
        
        <div className="flex-1 p-4">
          <ExpertInfo 
            expert={expert}
            showRating={showRating}
            showPrice={showPrice}
            compact={compact}
          />
          
          {showActions && (
            <ExpertActions
              expertId={expert.id}
              onBook={onBook}
              onChat={onChat}
              onCall={onCall}
              onFavoriteToggle={onFavoriteToggle}
              isFavorited={isFavorited}
              isOnline={expert.is_online}
              compact={compact}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpertCard;
