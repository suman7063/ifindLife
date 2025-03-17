
import { useState, useMemo } from 'react';
import { Review } from '@/types/supabase/reviews';

export const useReviewFilters = (reviews: Review[]) => {
  const [filterRating, setFilterRating] = useState(0);
  const [filterVerified, setFilterVerified] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpertId, setSelectedExpertId] = useState<string | null>(null);
  
  const filteredReviews = useMemo(() => {
    return reviews.filter(review => {
      if (filterRating > 0 && review.rating !== filterRating) {
        return false;
      }
      
      if (filterVerified && !review.verified) {
        return false;
      }
      
      if (selectedExpertId && review.expertId !== selectedExpertId) {
        return false;
      }
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesUserName = review.userName.toLowerCase().includes(query);
        const matchesComment = (review.comment || '').toLowerCase().includes(query);
        return matchesUserName || matchesComment;
      }
      
      return true;
    });
  }, [reviews, filterRating, filterVerified, searchQuery, selectedExpertId]);
  
  return {
    filterRating,
    filterVerified,
    searchQuery,
    selectedExpertId,
    setFilterRating,
    setFilterVerified,
    setSearchQuery,
    setSelectedExpertId,
    filteredReviews
  };
};
