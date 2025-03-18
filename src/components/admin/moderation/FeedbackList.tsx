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
import { Star, Eye, Trash2, Loader2 } from 'lucide-react';
import { Review } from '@/types/supabase/reviews';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FeedbackDetailsDialog from './FeedbackDetailsDialog';
import DeleteConfirmDialog from './DeleteConfirmDialog';

interface FeedbackListProps {
  feedback: Review[];
  isLoading: boolean;
  onDelete: (id: string) => void;
}

const FeedbackList: React.FC<FeedbackListProps> = ({
  feedback,
  isLoading,
  onDelete,
}) => {
  const [selectedFeedback, setSelectedFeedback] = useState<Review | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [verifiedFilter, setVerifiedFilter] = useState('all');
  
  const filteredFeedback = feedback.filter(item => {
    const searchMatches = 
      item.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.expertName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.comment || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const ratingMatches = 
      ratingFilter === 'all' || 
      item.rating === parseInt(ratingFilter);
    
    const verifiedMatches = 
      verifiedFilter === 'all' || 
      (verifiedFilter === 'verified' && item.verified) ||
      (verifiedFilter === 'unverified' && !item.verified);
    
    return searchMatches && ratingMatches && verifiedMatches;
  });

  const handleConfirmDelete = (id: string) => {
    onDelete(id);
    setItemToDelete(null);
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
        <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="unverified">Unverified</SelectItem>
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
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFeedback.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {format(new Date(item.date), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>{item.userName}</TableCell>
                  <TableCell>{item.expertName}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          className={`${
                            star <= item.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {item.comment || "No comment"}
                  </TableCell>
                  <TableCell>
                    {item.verified ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        Verified
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                        Unverified
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedFeedback(item);
                          setIsDetailsOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => setItemToDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
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
        <FeedbackDetailsDialog
          feedback={selectedFeedback}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        />
      )}

      <DeleteConfirmDialog
        itemId={itemToDelete || ''}
        itemType="feedback"
        open={!!itemToDelete}
        onOpenChange={(open) => !open && setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default FeedbackList;
