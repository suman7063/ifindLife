
import React from 'react';
import { Star } from 'lucide-react';

export interface StarRatingProps {
  rating: number;
  size?: number;
  onRatingChange?: (rating: number) => void;
  editable?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  size = 24, 
  onRatingChange,
  editable = false
}) => {
  const renderStar = (starPosition: number) => {
    const isFilled = starPosition <= rating;
    
    return (
      <span 
        key={starPosition}
        onClick={() => editable && onRatingChange && onRatingChange(starPosition)}
        className={`${editable ? 'cursor-pointer' : ''}`}
      >
        <Star 
          size={size} 
          className={isFilled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} 
        />
      </span>
    );
  };

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map(renderStar)}
    </div>
  );
};

export default StarRating;
