
import React, { useEffect, useState } from 'react';
import { UserProfile } from '@/types/database/unified';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, StarHalf, Edit2, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

interface ReviewsSectionProps {
  user: UserProfile | null;
}

interface Review {
  id: string;
  expert_id: string | number;
  rating: number;
  comment?: string;
  date: string;
  verified?: boolean;
  expert_name?: string;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    
    const fetchReviews = async () => {
      setIsLoading(true);
      
      try {
        // Fetch user reviews
        const { data, error } = await supabase
          .rpc('get_user_reviews_with_experts', { user_id_param: user.id });
        
        if (error) {
          console.error('Error fetching reviews:', error);
          return;
        }
        
        setReviews(data || []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReviews();
  }, [user]);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    // Half star
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    // Empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    
    return stars;
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Reviews</CardTitle>
              <CardDescription>Reviews you've given to experts</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading reviews...</p>
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {review.expert_name?.charAt(0) || 'E'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{review.expert_name || 'Expert'}</h4>
                        <div className="flex items-center mt-1">
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-xs text-muted-foreground ml-2">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <span className="flex items-center">
                        <Edit2 className="h-3 w-3 mr-1" />
                        Edit
                      </span>
                    </Button>
                  </div>
                  
                  {review.comment && (
                    <div className="mt-3 text-sm">
                      <p>{review.comment}</p>
                    </div>
                  )}
                  
                  {review.verified && (
                    <div className="mt-3 flex items-center text-xs text-green-600">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      <span>Verified Consultation</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-muted-foreground mb-4">You haven't written any reviews yet</p>
              <Button onClick={() => navigate('/user-dashboard/consultations')} variant="outline">
                View Your Consultations
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewsSection;
