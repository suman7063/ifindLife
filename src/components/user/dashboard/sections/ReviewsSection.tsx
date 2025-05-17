
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Star } from 'lucide-react';
import { UserProfile, Review } from '@/types/supabase/user';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface ReviewsSectionProps {
  user: UserProfile;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ user }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        setLoading(true);
        
        if (!user?.id) return;
        
        const { data, error } = await supabase
          .from('reviews')
          .select('*, expert:experts(name)')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        // Transform the data to match the Review interface
        const formattedReviews = data?.map(review => ({
          id: review.id, // Map review_id to id for compatibility
          user_id: review.user_id,
          expert_id: review.expert_id,
          rating: review.rating,
          comment: review.comment || '',
          date: review.created_at,
          verified: review.verified || false,
          expert_name: review.expert?.name || 'Expert',
          user_name: user.name || 'User',
          review_id: review.id // Add this for backward compatibility
        })) as Review[];
        
        setReviews(formattedReviews || []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        toast.error('Failed to load review data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserReviews();
  }, [user?.id, user?.name]);
  
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <CardTitle>My Reviews</CardTitle>
          </div>
          <CardDescription>
            See all the reviews you've left for experts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Loading reviews...</p>
          ) : reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Review for: {review.expert_name}</h4>
                      <div className="flex items-center mt-1">
                        {renderStars(review.rating)}
                        <span className="ml-2 text-sm text-muted-foreground">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {review.verified && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  {review.comment && (
                    <p className="mt-3 text-sm">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
              <p className="mt-4 text-muted-foreground">You haven't left any reviews yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewsSection;
