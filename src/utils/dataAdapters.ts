
import { 
  UserProfile, 
  ReportUI,
  Review,
  UserReview,
  ReviewUI,
  ReferralSettingsUI,
  ReferralUI
} from '@/types/supabase';

// Convert DB format to UI format
export const adaptReviewsForUI = (reviews: any[]): Review[] => {
  return reviews.map(review => ({
    id: review.id,
    userId: review.user_id,
    userName: review.user_name,
    expertId: review.expert_id,
    expertName: 'Expert', // Default value, should be populated later
    rating: review.rating,
    comment: review.comment,
    date: review.date,
    verified: review.verified,
    // Keep DB fields for compatibility
    user_id: review.user_id,
    expert_id: review.expert_id,
    user_name: review.user_name
  }));
};

export const adaptReferralSettings = (settings: any): ReferralSettingsUI => {
  return {
    id: settings.id,
    referrerReward: settings.referrer_reward,
    referredReward: settings.referred_reward,
    active: settings.active,
    description: settings.description,
    updatedAt: settings.updated_at,
    // Keep DB fields for compatibility
    referrer_reward: settings.referrer_reward,
    referred_reward: settings.referred_reward,
    updated_at: settings.updated_at
  };
};

export const adaptReferrals = (referrals: any[]): ReferralUI[] => {
  return referrals.map(referral => ({
    id: referral.id,
    referrerId: referral.referrer_id,
    referredId: referral.referred_id,
    referralCode: referral.referral_code || '',
    status: referral.status,
    createdAt: referral.created_at,
    completedAt: referral.completed_at,
    rewardClaimed: referral.reward_claimed,
    referredName: referral.referred_name || 'Unknown User',
    // Keep DB fields for compatibility
    referrer_id: referral.referrer_id,
    referred_id: referral.referred_id,
    referral_code: referral.referral_code,
    created_at: referral.created_at,
    completed_at: referral.completed_at,
    reward_claimed: referral.reward_claimed
  }));
};

// Add these export stubs to resolve missing imports
export const adaptCoursesToUI = (courses: any[]) => {
  return courses;
};

export const adaptReportsToUI = (reports: any[]) => {
  return reports;
};

export const adaptCoursesToDB = (courses: any[]) => {
  return courses;
};

export const adaptReviewsToDB = (reviews: any[]) => {
  return reviews;
};

export const adaptReportsToDB = (reports: any[]) => {
  return reports;
};
