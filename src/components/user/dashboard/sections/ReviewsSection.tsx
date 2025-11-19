import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, MessageSquare, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ReviewModal from '../modals/ReviewModal';

interface Review {
  id: string;
  expert_id: string; // Changed to string (UUID)
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  expert_name?: string;
  user_name?: string;
}

interface UserProfile {
  id: string;
  name: string;
  [key: string]: any;
}

interface ReviewsSectionProps {
  user: UserProfile;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ user }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [completedSessions, setCompletedSessions] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<any>(null);

  useEffect(() => {
    fetchReviews();
    fetchCompletedSessions();
  }, [user.id]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_reviews')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletedSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          expert:expert_accounts!inner(auth_id, name, profile_picture)
        `)
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('appointment_date', { ascending: false });

      if (error) throw error;
      
      // Filter sessions that haven't been reviewed yet
      const unreviewed = data?.filter(session => 
        !reviews.some(review => review.expert_id === session.expert_id)
      ) || [];
      
      setCompletedSessions(unreviewed);
    } catch (error) {
      console.error('Error fetching completed sessions:', error);
    }
  };

  const handleAddReview = (session: any) => {
    setSelectedReview(null);
    setSelectedSession(session);
    setIsReviewModalOpen(true);
  };

  const handleEditReview = (review: Review) => {
    setSelectedReview(review);
    setSelectedSession(null);
    setIsReviewModalOpen(true);
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const { error } = await supabase
        .from('user_reviews')
        .delete()
        .eq('id', reviewId)
        .eq('user_id', user.id);

      if (error) throw error;
      toast.success('Review deleted successfully');
      fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Your Reviews & Ratings
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Sessions awaiting review */}
      {completedSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sessions Awaiting Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50 border-yellow-200"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={session.expert?.profile_picture} />
                      <AvatarFallback>
                        {session.expert?.name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{session.expert?.name}</p>
                      <p className="text-sm text-gray-600">
                        Session on {formatDate(session.appointment_date)}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAddReview(session)}
                    className="bg-ifind-aqua hover:bg-ifind-aqua/90 text-white"
                  >
                    <Star className="h-4 w-4 mr-1" />
                    Write Review
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing reviews */}
      {reviews.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">You haven't written any reviews yet</p>
            <p className="text-sm text-gray-500">
              Complete sessions with experts to leave reviews and ratings
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-semibold">{review.expert_name || 'Expert'}</h3>
                      {review.verified && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Verified
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="text-sm text-gray-600">
                        {formatDate(review.date)}
                      </span>
                    </div>
                    
                    {review.comment && (
                      <p className="text-gray-700 mb-3">{review.comment}</p>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditReview(review)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteReview(review.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        review={selectedReview}
        session={selectedSession}
        userId={user.id}
        userName={user.name}
        onReviewSubmitted={() => {
          fetchReviews();
          fetchCompletedSessions();
        }}
      />
    </div>
  );
};

export default ReviewsSection;
