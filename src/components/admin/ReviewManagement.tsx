
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Pencil, 
  Trash, 
  Star, 
  SearchIcon, 
  RefreshCw,
  BadgeAlert
} from 'lucide-react';
import { toast } from 'sonner';
import { adaptReviewsToUI, adaptReviewsToDB } from '@/utils/dataAdapters';
import { Review } from '@/types/supabase';

const ReviewManagement = () => {
  const [experts, setExperts] = useState<any[]>([]);
  const [selectedExpertId, setSelectedExpertId] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  // Fetch all experts on component mount
  useEffect(() => {
    fetchExperts();
  }, []);

  // Fetch experts from Supabase
  const fetchExperts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('experts')
        .select('id, name, email, average_rating, reviews_count')
        .order('name');
      
      if (error) throw error;
      setExperts(data || []);
    } catch (error) {
      console.error('Error fetching experts:', error);
      toast.error('Failed to load experts');
    } finally {
      setLoading(false);
    }
  };

  // Fetch reviews for selected expert
  const fetchReviews = async (expertId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_reviews')
        .select('*, users(name)')
        .eq('expert_id', expertId);
      
      if (error) throw error;
      
      // Format reviews with user name
      const reviewsWithUserNames = data?.map(review => ({
        ...review,
        user_name: review.users?.name || 'Anonymous User'
      })) || [];
      
      setReviews(adaptReviewsToUI(reviewsWithUserNames));
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  // Handle expert selection change
  const handleExpertChange = (expertId: string) => {
    setSelectedExpertId(expertId);
    fetchReviews(expertId);
  };

  // Filter experts based on search term
  const filteredExperts = experts.filter(expert => 
    expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expert.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle review delete
  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
      const { error } = await supabase
        .from('user_reviews')
        .delete()
        .eq('id', reviewId);
      
      if (error) throw error;
      
      // Remove review from local state
      setReviews(reviews.filter(review => review.id !== reviewId));
      toast.success('Review deleted successfully');
      
      // Refetch expert to update rating
      if (selectedExpertId) {
        const { data } = await supabase
          .from('experts')
          .select('average_rating, reviews_count')
          .eq('id', selectedExpertId)
          .single();
          
        if (data) {
          setExperts(experts.map(expert => 
            expert.id === selectedExpertId 
              ? { ...expert, average_rating: data.average_rating, reviews_count: data.reviews_count } 
              : expert
          ));
        }
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  };

  // Open edit dialog and set editing review
  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setNewRating(review.rating);
    setNewComment(review.comment || '');
    setEditDialogOpen(true);
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!editingReview || !selectedExpertId) return;
    
    try {
      const updatedReview = {
        ...editingReview,
        rating: newRating,
        comment: newComment
      };
      
      const dbReview = adaptReviewsToDB([updatedReview])[0];
      
      const { error } = await supabase
        .from('user_reviews')
        .update({
          rating: dbReview.rating,
          comment: dbReview.comment
        })
        .eq('id', dbReview.id);
      
      if (error) throw error;
      
      // Update review in local state
      setReviews(reviews.map(review => 
        review.id === editingReview.id 
          ? updatedReview 
          : review
      ));
      
      // Close dialog
      setEditDialogOpen(false);
      setEditingReview(null);
      toast.success('Review updated successfully');
      
      // Refetch expert to update rating
      const { data } = await supabase
        .from('experts')
        .select('average_rating, reviews_count')
        .eq('id', selectedExpertId)
        .single();
        
      if (data) {
        setExperts(experts.map(expert => 
          expert.id === selectedExpertId 
            ? { ...expert, average_rating: data.average_rating, reviews_count: data.reviews_count } 
            : expert
        ));
      }
    } catch (error) {
      console.error('Error updating review:', error);
      toast.error('Failed to update review');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <h2 className="text-2xl font-bold">Expert Reviews Management</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchExperts}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1 space-y-4">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search experts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <div className="border rounded-md p-2 h-[500px] overflow-y-auto bg-white">
            {filteredExperts.length === 0 && !loading ? (
              <div className="text-center text-gray-500 p-4">No experts found</div>
            ) : (
              <ul className="divide-y">
                {filteredExperts.map(expert => (
                  <li 
                    key={expert.id}
                    className={`p-2 cursor-pointer hover:bg-gray-100 ${
                      selectedExpertId === expert.id ? 'bg-gray-100' : ''
                    }`}
                    onClick={() => handleExpertChange(expert.id)}
                  >
                    <div className="font-medium">{expert.name}</div>
                    <div className="text-sm text-gray-500">{expert.email}</div>
                    <div className="text-sm flex items-center mt-1">
                      {expert.average_rating > 0 ? (
                        <>
                          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
                          <span>{expert.average_rating.toFixed(1)}</span>
                          <span className="text-gray-400 ml-2">({expert.reviews_count} reviews)</span>
                        </>
                      ) : (
                        <span className="text-gray-400">No reviews</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        <div className="md:col-span-3">
          {!selectedExpertId ? (
            <div className="border rounded-md p-6 flex justify-center items-center h-[500px] bg-gray-50">
              <div className="text-center text-gray-500">
                <BadgeAlert className="h-8 w-8 mx-auto mb-2" />
                <p>Select an expert to view and manage their reviews</p>
              </div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="border rounded-md p-6 flex justify-center items-center h-[500px] bg-gray-50">
              <div className="text-center text-gray-500">
                <Star className="h-8 w-8 mx-auto mb-2" />
                <p>No reviews for this expert yet</p>
              </div>
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map(review => (
                    <TableRow key={review.id}>
                      <TableCell className="font-medium">
                        {review.userName || 'Anonymous User'}
                      </TableCell>
                      <TableCell>
                        <div className="flex">
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
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {review.comment || 'No comment'}
                      </TableCell>
                      <TableCell>{review.date}</TableCell>
                      <TableCell>
                        {review.verified ? 
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Verified
                          </span> : 
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                            Unverified
                          </span>
                        }
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEditReview(review)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteReview(review.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Review Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Rating</p>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-8 w-8 cursor-pointer ${
                      star <= (hoveredRating || newRating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                    onClick={() => setNewRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                  />
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Comment</p>
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveEdit}
              className="bg-ifind-aqua hover:bg-ifind-teal transition-colors"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewManagement;
