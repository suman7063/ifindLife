
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserProfile } from '@/types/supabase';
import { convertExpertIdToString, convertExpertIdToNumber } from '@/types/supabase/expertId';

// Function to fetch user profile
export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    // Create base user profile
    const userProfile: UserProfile = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      country: userData.country,
      city: userData.city,
      currency: userData.currency,
      profilePicture: userData.profile_picture,
      walletBalance: userData.wallet_balance,
      createdAt: userData.created_at,
      referralCode: userData.referral_code,
      referredBy: userData.referred_by,
      referralLink: userData.referral_link
    };
    
    return userProfile;
  } catch (error: any) {
    toast.error(error.message || 'Failed to load user profile');
    return null;
  }
};

// Function to fetch user reviews
export const fetchUserReviews = async (userId: string) => {
  try {
    const { data: reviews, error } = await supabase
      .from('user_reviews')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      toast.error('Error fetching user reviews');
      return [];
    }
    
    const reviewsWithDetails = await Promise.all((reviews || []).map(async (review) => {
      const { data: expertData } = await supabase
        .from('experts')
        .select('name')
        .eq('id', convertExpertIdToString(review.expert_id))
        .single();
      
      return {
        id: review.id,
        expertId: convertExpertIdToString(review.expert_id),
        rating: review.rating,
        comment: review.comment || '',
        date: review.date,
        verified: review.verified || false,
        userId: review.user_id || '',
        userName: 'Anonymous User', // Will be updated from user profile
        expertName: expertData?.name || 'Unknown Expert'
      };
    }));
    
    return reviewsWithDetails;
  } catch (error) {
    toast.error('Error fetching user reviews');
    return [];
  }
};

// Function to fetch user reports
export const fetchUserReports = async (userId: string) => {
  try {
    const { data: reports, error } = await supabase
      .from('user_reports')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      toast.error('Error fetching user reports');
      return [];
    }
    
    // Map the data to the Report interface
    return (reports || []).map(report => ({
      id: report.id,
      expertId: convertExpertIdToString(report.expert_id),
      reason: report.reason || '',
      details: report.details || '',
      date: report.date || new Date().toISOString(),
      status: report.status || 'pending',
      userId: report.user_id,
      userName: 'User' // Will be updated from profile
    }));
  } catch (error) {
    toast.error('Error fetching user reports');
    return [];
  }
};
