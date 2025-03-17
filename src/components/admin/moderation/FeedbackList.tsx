
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { Loader2, Star, Trash2, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReviewUI } from '@/types/supabase/reviews';
import FeedbackDetailsDialog from './FeedbackDetailsDialog';
import DeleteConfirmDialog from './DeleteConfirmDialog';

interface FeedbackListProps {
  feedback: ReviewUI[];
  isLoading: boolean;
  onDelete: (feedbackId: string) => void;
}

const FeedbackList: React.FC<FeedbackListProps> = ({
  feedback,
  isLoading,
  onDelete,
}) => {
  const [selectedFeedback, setSelectedFeedback] = useState<ReviewUI | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  
  // Filter feedback
  const filteredFeedback = feedback.filter(item => {
    // Search filter
    const searchMatches = 
      item.expertName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.comment?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Rating filter
    const ratingMatches = ratingFilter === 'all' || item.rating === parseInt(ratingFilter);
    
    return searchMatches && ratingMatches;
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search feedback..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Select value={ratingFilter} onValueChange={setRatingFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="1">1 Star</SelectItem>
            <SelectItem value="2">2 Stars</SelectItem>
            <SelectItem value="3">3 Stars</SelectItem>
            <SelectItem value="4">4 Stars</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredFeedback.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          No feedback found matching your filters.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Expert</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFeedback.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {format(new Date(item.date), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="font-medium">
                    {item.userName || 'Anonymous User'}
                  </TableCell>
                  <TableCell className="font-medium">
                    {item.expertName || 'Unknown Expert'}
                  </TableCell>
                  <TableCell>
                    {renderStars(item.rating)}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {item.comment ? (
                      <span>{item.comment.substring(0, 50)}{item.comment.length > 50 ? '...' : ''}</span>
                    ) : (
                      <span className="text-muted-foreground italic">No comment</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedFeedback(item);
                          setIsDetailsOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => {
                          setSelectedFeedback(item);
                          setIsDeleteOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {selectedFeedback && (
        <>
          <FeedbackDetailsDialog
            feedback={selectedFeedback}
            open={isDetailsOpen}
            onOpenChange={setIsDetailsOpen}
          />
          <DeleteConfirmDialog
            itemId={selectedFeedback.id}
            itemType="feedback"
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
            onConfirm={onDelete}
          />
        </>
      )}
    </div>
  );
};

export default FeedbackList;
