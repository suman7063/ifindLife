
import React, { useState } from 'react';
import { MessageSquare, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserProfile, Review } from '@/types/supabase';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

interface UserReviewsCardProps {
  userProfile: UserProfile | null;
}

const UserReviewsCard: React.FC<UserReviewsCardProps> = ({ userProfile }) => {
  const [expanded, setExpanded] = useState(false);
  const reviews = userProfile?.reviews || [];
  const displayReviews = expanded ? reviews : reviews.slice(0, 2);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  if (!userProfile) return null;

  return (
    <Card className="border-ifind-aqua/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <MessageSquare className="mr-2 h-4 w-4 text-ifind-aqua" />
          Your Reviews
        </CardTitle>
        <div className="text-sm text-gray-500">
          {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {reviews.length === 0 ? (
          <CardDescription className="text-center py-6">
            You haven't submitted any reviews yet.
          </CardDescription>
        ) : (
          <>
            {displayReviews.map((review, index) => (
              <div key={review.id} className="space-y-2">
                {index > 0 && <Separator />}
                <div className="pt-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm font-medium">
                        Expert #{review.expertId}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(review.date)}
                    </span>
                  </div>
                  <p className="text-sm mt-1 text-gray-600 line-clamp-2">
                    {review.comment}
                  </p>
                </div>
              </div>
            ))}
            
            {reviews.length > 2 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2 text-ifind-aqua"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? (
                  <div className="flex items-center justify-center w-full">
                    <span>Show less</span>
                    <ChevronUp className="ml-1 h-4 w-4" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full">
                    <span>Show all {reviews.length} reviews</span>
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </div>
                )}
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UserReviewsCard;
