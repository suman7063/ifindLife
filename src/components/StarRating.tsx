
import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  className?: string;
  color?: string;
  emptyColor?: string;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 20,
  className = '',
  color = 'text-yellow-400',
  emptyColor = 'text-gray-300',
  interactive = false,
  onRatingChange,
}) => {
  const handleClick = (index: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(index + 1);
    }
  };
  
  return (
    <div className={`flex items-center ${className}`}>
      {Array.from({ length: maxRating }).map((_, index) => {
        const filled = index < Math.floor(rating);
        const halfFilled = !filled && index < Math.ceil(rating) && rating % 1 !== 0;
        
        return (
          <div 
            key={index} 
            className={`${interactive ? 'cursor-pointer' : ''}`}
            onClick={() => handleClick(index)}
          >
            {halfFilled ? (
              <div className="relative">
                <Star 
                  size={size} 
                  className={emptyColor} 
                  fill="none"
                />
                <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
                  <Star 
                    size={size} 
                    className={color} 
                    fill="currentColor"
                  />
                </div>
              </div>
            ) : (
              <Star 
                size={size} 
                className={filled ? color : emptyColor} 
                fill={filled ? "currentColor" : "none"}
              />
            )}
          </div>
        );
      })}
      
      {rating > 0 && (
        <span className="ml-2 text-sm font-medium">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
