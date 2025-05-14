
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ExpertInfoProps } from './types';

const ExpertInfo: React.FC<ExpertInfoProps> = ({ expert, showRating = true }) => {
  // Format rating for display
  const rating = expert.averageRating !== undefined ? expert.averageRating : 
    (typeof expert.reviewsCount === 'number' ? expert.reviewsCount : 0);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <h3 className="font-medium text-gray-900">{expert.name}</h3>
        <p className="text-sm text-gray-500">{expert.specialization}</p>
        
        {expert.verified && (
          <Badge variant="outline" className="bg-blue-50 text-blue-600 text-xs mt-1">
            Verified
          </Badge>
        )}
      </div>
      
      {showRating && (
        <div className="flex items-center mt-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                className={`w-4 h-4 ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs ml-1 text-gray-500">
            {expert.reviewsCount ? `(${expert.reviewsCount})` : ''}
          </span>
        </div>
      )}
    </div>
  );
};

export default ExpertInfo;
