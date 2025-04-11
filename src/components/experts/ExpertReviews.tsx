
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

interface ExpertReviewsProps {
  expertId: string;
  reviews: Review[];
  isLoading?: boolean;
}

const ExpertReviews: React.FC<ExpertReviewsProps> = ({ expertId, reviews, isLoading = false }) => {
  if (isLoading) {
    return <div className="animate-pulse p-4 space-y-4">
      {[1, 2].map((i) => (
        <div key={i} className="flex space-x-4">
          <div className="rounded-full bg-gray-300 h-10 w-10"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>
      ))}
    </div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No reviews yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-gray-100 pb-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={review.userAvatar} alt={review.userName} />
                <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{review.userName}</p>
                <p className="text-xs text-gray-500">
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center bg-gray-100 px-2 py-1 rounded">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="text-xs font-medium">{review.rating}</span>
            </div>
          </div>
          <p className="text-sm text-gray-700">{review.comment}</p>
          {review.verified && (
            <div className="mt-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                Verified Session
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ExpertReviews;
