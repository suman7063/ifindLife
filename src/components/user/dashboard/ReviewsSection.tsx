
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ThumbsUp, Clock, User } from 'lucide-react';
import { Review } from '@/types/supabase/index';
import { adaptReview } from '@/utils/userProfileAdapter';

const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    expert_id: '1',
    rating: 5,
    comment: 'Great session! Very helpful advice.',
    date: '2023-05-15',
    verified: true,
  },
  {
    id: '2',
    expert_id: '2',
    rating: 4,
    comment: 'Good session. I learned a lot about managing stress.',
    date: '2023-05-10',
  },
];

interface ReviewsSectionProps {
  reviews?: Review[];
  loading?: boolean;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ 
  reviews = MOCK_REVIEWS,
  loading = false 
}) => {
  // Use adaptReview to ensure reviews have both expert_id and expertId properties
  const adaptedReviews = React.useMemo(() => {
    return reviews.map(review => adaptReview(review));
  }, [reviews]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your Reviews</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Clock className="h-8 w-8 animate-pulse text-muted-foreground" />
          </div>
        ) : adaptedReviews.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            You haven't left any reviews yet
          </div>
        ) : (
          <div className="space-y-4">
            {adaptedReviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4 hover:bg-muted/50">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    <span className="font-medium">Expert #{review.expert_id}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-400" />
                    <span className="font-medium">{review.rating}</span>
                    {review.verified && (
                      <Badge variant="outline" className="ml-2 text-xs gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
                
                {review.comment && (
                  <p className="mt-2 text-sm">{review.comment}</p>
                )}
                
                <p className="mt-2 text-xs text-muted-foreground">
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewsSection;
