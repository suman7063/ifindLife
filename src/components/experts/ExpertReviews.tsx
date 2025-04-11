
import React from 'react';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';

export interface Review {
  id: string;
  user_id?: string;
  user_name?: string;
  rating: number;
  comment: string;
  date: string;
  verified?: boolean;
}

export interface ExpertReviewsProps {
  expertId: string;
  reviews: Review[];
}

const ExpertReviews: React.FC<ExpertReviewsProps> = ({ expertId, reviews = [] }) => {
  if (!reviews.length) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">No reviews yet</p>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">{review.user_name || 'Anonymous'}</h4>
              <div className="flex items-center my-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i}
                    className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
            </div>
            {review.verified && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Verified
              </span>
            )}
          </div>
          <p className="mt-3 text-sm">{review.comment}</p>
        </Card>
      ))}
    </div>
  );
};

export default ExpertReviews;
