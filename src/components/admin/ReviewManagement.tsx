
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pencil, Trash2, Star, Search } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Review } from '@/types/supabase';

const ReviewManagement: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpertId, setSelectedExpertId] = useState<string | null>(null);
  const [experts, setExperts] = useState<Array<{ id: string, name: string }>>([]);
  
  // Edit review state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState<Review | null>(null);
  const [editedRating, setEditedRating] = useState(0);
  const [editedComment, setEditedComment] = useState('');
  
  // Delete review state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);
  
  // Fetch experts for the dropdown
  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const { data, error } = await supabase
          .from('experts')
          .select('id, name');
        
        if (error) throw error;
        setExperts(data || []);
      } catch (error) {
        console.error('Error fetching experts:', error);
        toast.error('Failed to load experts');
      }
    };
    
    fetchExperts();
  }, []);
  
  // Fetch reviews when expert selection changes
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('user_reviews')
          .select(`
            id,
            expert_id,
            user_id,
            rating,
            comment,
            date,
            verified,
            experts(name)
          `);
        
        if (selectedExpertId) {
          query = query.eq('expert_id', parseInt(selectedExpertId));
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        const formattedReviews: Review[] = (data || []).map(review => ({
          id: review.id,
          expertId: review.expert_id.toString(),
          expertName: review.experts?.name || 'Unknown Expert',
          userId: review.user_id,
          userName: review.user_id ? `User ${review.user_id.slice(0, 8)}...` : 'Anonymous User',
          rating: review.rating,
          comment: review.comment || '',
          date: review.date,
          verified: review.verified,
        }));
        
        setReviews(formattedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        toast.error('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, [selectedExpertId]);
  
  // Open edit dialog
  const handleEdit = (review: Review) => {
    setCurrentReview(review);
    setEditedRating(review.rating);
    setEditedComment(review.comment || '');
    setIsEditDialogOpen(true);
  };
  
  // Update review
  const handleUpdateReview = async () => {
    if (!currentReview) return;
    
    try {
      const { error } = await supabase
        .from('user_reviews')
        .update({
          rating: editedRating,
          comment: editedComment,
        })
        .eq('id', currentReview.id);
      
      if (error) throw error;
      
      // Update local state
      setReviews(reviews.map(review => 
        review.id === currentReview.id 
          ? { ...review, rating: editedRating, comment: editedComment }
          : review
      ));
      
      toast.success('Review updated successfully');
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating review:', error);
      toast.error('Failed to update review');
    }
  };
  
  // Open delete dialog
  const handleDeletePrompt = (review: Review) => {
    setReviewToDelete(review);
    setIsDeleteDialogOpen(true);
  };
  
  // Delete review
  const handleDeleteReview = async () => {
    if (!reviewToDelete) return;
    
    try {
      const { error } = await supabase
        .from('user_reviews')
        .delete()
        .eq('id', reviewToDelete.id);
      
      if (error) throw error;
      
      // Update local state
      setReviews(reviews.filter(review => review.id !== reviewToDelete.id));
      
      toast.success('Review deleted successfully');
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  };
  
  // Filter reviews by search query
  const filteredReviews = reviews.filter(review => 
    review.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.comment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.expertName?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Management</CardTitle>
        <CardDescription>
          Manage user reviews for experts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by user or review content..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <Select onValueChange={(value) => setSelectedExpertId(value)} value={selectedExpertId || undefined}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an expert" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Experts</SelectItem>
                  {experts.map(expert => (
                    <SelectItem key={expert.id} value={expert.id}>
                      {expert.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-10">Loading reviews...</div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No reviews found
            </div>
          ) : (
            <div className="space-y-4 mt-6">
              {filteredReviews.map(review => (
                <div 
                  key={review.id}
                  className="p-4 border rounded-lg bg-card"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{review.userName || 'Anonymous User'}</div>
                      <div className="text-sm text-muted-foreground">
                        Reviewed: {review.expertName} | {new Date(review.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center mt-1 mb-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star 
                            key={star} 
                            className={`h-4 w-4 ${
                              star <= review.rating 
                              ? 'text-yellow-400 fill-yellow-400' 
                              : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm">{review.rating}/5</span>
                        {review.verified && (
                          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-sm">{review.comment || 'No comment provided'}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleEdit(review)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeletePrompt(review)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Edit Review Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Review</DialogTitle>
              <DialogDescription>
                Make changes to the review rating and comment.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <div className="font-medium text-sm">Rating</div>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`h-6 w-6 cursor-pointer ${
                        star <= editedRating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                      onClick={() => setEditedRating(star)}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-medium text-sm">Comment</div>
                <Textarea
                  value={editedComment}
                  onChange={(e) => setEditedComment(e.target.value)}
                  rows={5}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleUpdateReview}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Delete Review Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete Review</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this review? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" variant="destructive" onClick={handleDeleteReview}>
                Delete Review
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ReviewManagement;
