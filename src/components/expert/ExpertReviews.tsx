
import React from 'react';
import { Star } from 'lucide-react';

interface Review {
  id: number;
  name: string;
  rating: number;
  date: string;
  comment: string;
}

interface ExpertReviewsProps {
  reviews: Review[];
  rating: number;
}

const ExpertReviews: React.FC<ExpertReviewsProps> = ({ reviews, rating }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Client Reviews</h2>
        <div className="flex items-center">
          <Star className="h-5 w-5 fill-astro-gold text-astro-gold mr-1" />
          <span className="font-medium">{rating} / 5</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {reviews.map(review => (
          <div key={review.id} className="border rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <div className="font-medium">{review.name}</div>
              <div className="text-sm text-muted-foreground">{review.date}</div>
            </div>
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${i < review.rating ? 'fill-astro-gold text-astro-gold' : 'text-muted'}`} 
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpertReviews;
