
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Review } from '@/types/supabase/reviews';
import { convertExpertIdToString } from '@/types/supabase/expertId';

export const useFetchReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [experts, setExperts] = useState<Array<{id: string, name: string}>>([]);
  
  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const { data, error } = await supabase
          .from('experts')
          .select('id, name');
        
        if (error) {
          console.error('Error fetching experts:', error);
          return;
        }
        
        setExperts(data || []);
      } catch (error) {
        console.error('Error fetching experts:', error);
      }
    };
    
    fetchExperts();
  }, []);
  
  useEffect(() => {
    fetchReviews();
  }, []);
  
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_reviews')
        .select(`
          id,
          rating,
          comment,
          verified,
          date,
          user_id,
          expert_id
        `);
      
      if (error) {
        console.error('Error fetching reviews:', error);
        toast.error('Failed to load reviews');
        setLoading(false);
        return;
      }
      
      const reviewsData = await Promise.all((data || []).map(async (review) => {
        const { data: userData } = await supabase
          .from('users')
          .select('name')
          .eq('id', review.user_id)
          .single();
        
        const { data: expertData } = await supabase
          .from('experts')
          .select('name')
          .eq('id', review.expert_id)
          .single();
        
        return {
          id: review.id,
          rating: review.rating,
          comment: review.comment || '',
          date: review.date || new Date().toISOString(),
          verified: review.verified || false,
          userId: review.user_id || '',
          expertId: convertExpertIdToString(review.expert_id),
          userName: userData?.name || 'Anonymous User',
          expertName: expertData?.name || 'Unknown Expert'
        };
      }));
      
      setReviews(reviewsData);
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
      toast.error(error.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };
  
  return { reviews, setReviews, loading, experts, fetchReviews };
};
