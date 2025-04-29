
import React, { useState } from 'react';
import { UserProfile } from '@/types/supabase/user';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Edit, Trash2, MessageSquare, AlertTriangle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Review } from '@/types/supabase/user';

interface ReviewsSectionProps {
  user: UserProfile | null;
}

// Mock data for reviews
const mockReviews: Review[] = [
  {
    id: '1',
    expertId: '101',
    rating: 5,
    comment: 'Dr. Jane Smith was exceptional. She listened attentively to my concerns and provided practical advice that has already made a significant difference in my daily life. I highly recommend her for anyone struggling with anxiety issues.',
    date: '2025-04-12',
  },
  {
    id: '2',
    expertId: '102',
    rating: 4,
    comment: 'Dr. Michael Johnson provided valuable insights during our career counseling session. His approach was structured and helpful, though I would have appreciated more specific action items to follow up with.',
    date: '2025-03-25',
  },
];

// Mock data for pending reviews
const mockPendingReviews = [
  {
    id: '3',
    expertId: '103',
    expertName: 'Dr. Sarah Williams',
    serviceName: 'Mental Health Assessment',
    date: '2025-04-20',
  },
  {
    id: '4',
    expertId: '104',
    expertName: 'Dr. Robert Davis',
    serviceName: 'Relationship Counselling',
    date: '2025-04-10',
  },
];

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedReview, setEditedReview] = useState(review.comment);
  const [editedRating, setEditedRating] = useState(review.rating);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const expertNames: Record<string, string> = {
    '101': 'Dr. Jane Smith',
    '102': 'Dr. Michael Johnson',
    '103': 'Dr. Sarah Williams',
    '104': 'Dr. Robert Davis',
  };
  
  const handleSaveEdit = () => {
    toast.success('Review updated successfully');
    setIsEditing(false);
  };
  
  const handleDelete = () => {
    toast.success('Review deleted successfully');
    setDeleteDialogOpen(false);
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{expertNames[review.expertId]?.charAt(0) || 'E'}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
              <div>
                <h3 className="font-medium">{expertNames[review.expertId] || 'Expert'}</h3>
                <p className="text-xs text-muted-foreground">Reviewed on {review.date}</p>
              </div>
              
              {!isEditing && (
                <div className="flex mt-2 sm:mt-0">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`h-4 w-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {isEditing ? (
              <div className="space-y-4 mt-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEditedRating(star)}
                      className="focus:outline-none"
                    >
                      <Star 
                        className={`h-6 w-6 ${star <= editedRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    </button>
                  ))}
                </div>
                
                <Textarea
                  value={editedReview}
                  onChange={(e) => setEditedReview(e.target.value)}
                  className="min-h-[100px]"
                />
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button onClick={handleSaveEdit}>Save Changes</Button>
                </div>
              </div>
            ) : (
              <>
                <p className="mt-2">{review.comment}</p>
                
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  
                  <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Review</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this review? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PendingReviewCard: React.FC<{ review: any }> = ({ review }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      toast.success('Review submitted successfully');
      setIsSubmitting(false);
    }, 1000);
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="bg-yellow-100 p-3 rounded-full">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
              <div>
                <h3 className="font-medium">{review.expertName}</h3>
                <p className="text-sm text-muted-foreground">{review.serviceName}</p>
                <p className="text-xs text-muted-foreground">Session on {review.date}</p>
              </div>
              
              <Badge variant="outline" className="mt-2 sm:mt-0">Pending Review</Badge>
            </div>
            
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Rate your experience:</p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star 
                        className={`h-6 w-6 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Share your feedback:</p>
                <Textarea
                  placeholder="Write your review here..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ user }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Reviews</h2>
        <p className="text-muted-foreground">
          Manage your reviews and provide feedback
        </p>
      </div>
      
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            Pending Reviews ({mockPendingReviews.length})
          </TabsTrigger>
          <TabsTrigger value="submitted">
            Your Reviews ({mockReviews.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          {mockPendingReviews.length > 0 ? (
            <div className="space-y-4">
              {mockPendingReviews.map(review => (
                <PendingReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="py-6">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No pending reviews</h3>
                  <p className="text-muted-foreground">
                    You don't have any pending reviews at the moment.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="submitted">
          {mockReviews.length > 0 ? (
            <div className="space-y-4">
              {mockReviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="py-6">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No reviews submitted</h3>
                  <p className="text-muted-foreground">
                    You haven't submitted any reviews yet.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReviewsSection;
