
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface ReviewType {
  id: string;
  comment: string;
  rating: number;
  date: string;
  user_id: string;
  user_name?: string;
  user_avatar?: string;
}

interface ExpertReviewsProps {
  expertId: string;
}

const ExpertReviews: React.FC<ExpertReviewsProps> = ({ expertId }) => {
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('user_reviews')
          .select(`
            id,
            comment,
            rating,
            date,
            user_id,
            profiles:user_id (
              name,
              profile_picture
            )
          `)
          .eq('expert_id', expertId)
          .order('date', { ascending: false });

        if (error) throw error;
        
        // Transform the data to match our ReviewType
        const transformedReviews = data.map((review: any) => ({
          id: review.id,
          comment: review.comment,
          rating: review.rating,
          date: review.date,
          user_id: review.user_id,
          user_name: review.profiles?.name || 'Anonymous User',
          user_avatar: review.profiles?.profile_picture || undefined
        }));
        
        setReviews(transformedReviews);
      } catch (err: any) {
        console.error("Error fetching reviews:", err);
        setError(err.message || "Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    if (expertId) {
      fetchReviews();
    }
  }, [expertId]);

  if (loading) {
    return (
      <div className="py-8 flex justify-center">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">No reviews yet. Be the first to leave a review.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id} className="p-4">
          <div className="flex items-start space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={review.user_avatar} alt={review.user_name} />
              <AvatarFallback>
                {review.user_name?.substring(0, 2).toUpperCase() || "??"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{review.user_name}</h4>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16}
                        className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.date).toLocaleDateString()}
                </span>
              </div>
              {review.comment && (
                <p className="mt-2 text-gray-700">{review.comment}</p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ExpertReviews;
