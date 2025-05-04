
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface ReviewProps {
  id: number;
  name: string;
  rating: number;
  date: string;
  comment: string;
}

interface ExpertReviewsProps {
  reviews: ReviewProps[];
}

const ExpertReviews: React.FC<ExpertReviewsProps> = ({ reviews }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Client Reviews</h2>
      
      {reviews.length === 0 ? (
        <p className="text-muted-foreground">No reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{review.name}</h3>
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>
                
                <div className="flex items-center mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i}
                      className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                
                <p className="text-muted-foreground">{review.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpertReviews;
