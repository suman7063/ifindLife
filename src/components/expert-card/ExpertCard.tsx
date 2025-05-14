
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ExpertCardProps } from './types';

const ExpertCard: React.FC<ExpertCardProps> = ({ 
  expert, 
  onClick, 
  className = '',
  showRating = true 
}) => {
  // Handle null or undefined expert safely
  if (!expert) {
    console.error('ExpertCard received null or undefined expert data');
    return null;
  }

  // Use either profilePicture or imageUrl (for backward compatibility)
  const profileImage = expert.profilePicture || expert.imageUrl || '/placeholder-avatar.jpg';
  
  // Determine status display
  const status = expert.status || (expert.online ? 'online' : 'offline');
  
  // Format rating for display
  const rating = expert.averageRating !== undefined ? expert.averageRating : 
    (typeof expert.reviewsCount === 'number' ? expert.reviewsCount : 0);

  return (
    <div 
      className={`border rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="flex flex-col p-4">
        <div className="flex items-center mb-3">
          <div className="relative">
            <img 
              src={profileImage} 
              alt={`${expert.name}`}
              className="w-16 h-16 rounded-full object-cover"
            />
            {status && (
              <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white
                ${status === 'online' ? 'bg-green-500' : 
                  status === 'busy' ? 'bg-orange-500' : 'bg-gray-400'}`}
              />
            )}
          </div>
          
          <div className="ml-3">
            <h3 className="font-medium text-gray-900">{expert.name}</h3>
            <p className="text-sm text-gray-500">{expert.specialization}</p>
            
            {expert.verified && (
              <Badge variant="outline" className="bg-blue-50 text-blue-600 text-xs mt-1">
                Verified
              </Badge>
            )}
          </div>
        </div>
        
        {showRating && (
          <div className="flex items-center mt-1">
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
    </div>
  );
};

export default ExpertCard;
