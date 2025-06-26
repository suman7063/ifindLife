
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { adaptReview } from '@/utils/userProfileAdapter';

const mockReviews = [
  {
    expertId: '1',
    rating: 5,
    comment: "Excellent session. Really helped me understand my anxiety issues.",
    date: "2023-04-15",
    expert_name: "Dr. Sarah Johnson"
  },
  {
    expertId: '2',
    rating: 4,
    comment: "Very professional and knowledgeable. I've learned a lot about managing stress.",
    date: "2023-03-22",
    expert_name: "Dr. Michael Chen"
  }
];

interface ReviewsSectionProps {
  reviews?: any[];
  loading?: boolean;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ 
  reviews = mockReviews, 
  loading = false
}) => {
  // Process reviews to ensure they have consistent property names
  const normalizedReviews = reviews.map(review => adaptReview(review));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Reviews</CardTitle>
        <CardDescription>Reviews you've left for experts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="text-center py-4">Loading your reviews...</div>
        ) : normalizedReviews.length > 0 ? (
          normalizedReviews.map((review, index) => (
            <div key={index} className="pb-4 border-b last:border-0 last:pb-0">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">{review.expert_name}</h4>
                <div className="flex">
                  {Array(5).fill(0).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{review.date}</p>
              <p className="mt-2">{review.comment}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            You haven't left any reviews yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewsSection;
