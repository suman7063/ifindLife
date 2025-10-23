import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft,
  Star,
  User,
  MessageSquare,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

// Mock data for users the expert has had sessions with
const sessionUsers = [
  {
    id: 1,
    name: 'Sarah Wilson',
    sessionsCount: 5,
    lastSession: '2024-01-15',
    hasReviewed: false,
    avatar: 'SW'
  },
  {
    id: 2,
    name: 'Michael Chen',
    sessionsCount: 3,
    lastSession: '2024-01-12',
    hasReviewed: true,
    rating: 5,
    avatar: 'MC'
  },
  {
    id: 3,
    name: 'Emma Davis',
    sessionsCount: 2,
    lastSession: '2024-01-10',
    hasReviewed: false,
    avatar: 'ED'
  }
];

// Mock data for reviews received by the expert
const receivedReviews = [
  {
    id: 1,
    userName: 'John Anderson',
    rating: 5,
    comment: 'Excellent session! Very helpful and insightful. Dr. Sarah really understood my concerns and provided practical advice.',
    date: '2024-01-14',
    avatar: 'JA'
  },
  {
    id: 2,
    userName: 'Lisa Martinez',
    rating: 5,
    comment: 'Great experience. The expert was very professional and caring.',
    date: '2024-01-12',
    avatar: 'LM'
  },
  {
    id: 3,
    userName: 'David Kim',
    rating: 4,
    comment: 'Good session overall. Would recommend to others.',
    date: '2024-01-10',
    avatar: 'DK'
  }
];

export const ExpertRatingsReviewsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const handleSubmitReview = () => {
    if (!selectedUser || rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    // Mock API call
    toast.success('Review submitted successfully!');
    setSelectedUser(null);
    setRating(0);
    setReview('');
  };

  const averageRating = (receivedReviews.reduce((acc, r) => acc + r.rating, 0) / receivedReviews.length).toFixed(1);

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-ifind-teal/10 via-ifind-aqua/10 to-ifind-purple/10 p-6 rounded-b-3xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/mobile-app/expert-app')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-poppins font-bold text-ifind-charcoal mb-2">
          Rating & Reviews
        </h1>
        <p className="text-muted-foreground">
          Manage your reviews and rate your clients
        </p>
      </div>

      <div className="p-6">
        <Tabs defaultValue="rate-clients" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="rate-clients">Rate Clients</TabsTrigger>
            <TabsTrigger value="my-reviews">My Reviews</TabsTrigger>
          </TabsList>

          {/* Rate Clients Tab */}
          <TabsContent value="rate-clients" className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <MessageSquare className="h-5 w-5 text-ifind-teal" />
              <p className="text-sm text-muted-foreground">
                Rate users you've had sessions with
              </p>
            </div>

            {sessionUsers.map((user) => (
              <Card key={user.id} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-ifind-aqua to-ifind-teal rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-lg">
                        {user.avatar}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-poppins font-medium text-ifind-charcoal">
                            {user.name}
                          </h4>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                            <span>{user.sessionsCount} sessions</span>
                            <span>•</span>
                            <span>Last: {new Date(user.lastSession).toLocaleDateString()}</span>
                          </div>
                        </div>
                        {user.hasReviewed && (
                          <Badge variant="outline" className="text-xs">
                            <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" />
                            Reviewed
                          </Badge>
                        )}
                      </div>

                      {!user.hasReviewed && selectedUser !== user.id && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedUser(user.id)}
                          className="mt-2"
                        >
                          Write Review
                        </Button>
                      )}

                      {selectedUser === user.id && (
                        <div className="mt-3 space-y-3 border-t pt-3">
                          <div>
                            <p className="text-sm font-medium text-ifind-charcoal mb-2">
                              Rate this client:
                            </p>
                            <div className="flex space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  onClick={() => setRating(star)}
                                  className="focus:outline-none"
                                >
                                  <Star
                                    className={`h-8 w-8 ${
                                      star <= rating
                                        ? 'fill-yellow-500 text-yellow-500'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-ifind-charcoal mb-2">
                              Your review (optional):
                            </p>
                            <Textarea
                              value={review}
                              onChange={(e) => setReview(e.target.value)}
                              placeholder="Share your experience with this client..."
                              className="min-h-20"
                            />
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={handleSubmitReview}
                              className="bg-gradient-to-r from-ifind-teal to-ifind-aqua"
                            >
                              Submit Review
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedUser(null);
                                setRating(0);
                                setReview('');
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* My Reviews Tab */}
          <TabsContent value="my-reviews" className="space-y-4">
            {/* Overall Rating Card */}
            <Card className="border-border/50 bg-gradient-to-br from-ifind-teal/5 via-ifind-aqua/5 to-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Your Overall Rating
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-4xl font-bold text-ifind-charcoal">
                        {averageRating}
                      </span>
                      <div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className="h-5 w-5 fill-yellow-500 text-yellow-500"
                            />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Based on {receivedReviews.length} reviews
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-ifind-teal to-ifind-aqua rounded-2xl flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews List */}
            <div className="space-y-3">
              <h3 className="font-poppins font-semibold text-ifind-charcoal">
                Recent Reviews
              </h3>
              {receivedReviews.map((review) => (
                <Card key={review.id} className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-ifind-aqua to-ifind-teal rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-sm">
                          {review.avatar}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-poppins font-medium text-ifind-charcoal">
                              {review.userName}
                            </h4>
                            <div className="flex items-center space-x-1 mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= review.rating
                                      ? 'fill-yellow-500 text-yellow-500'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(review.date).toLocaleDateString()}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
