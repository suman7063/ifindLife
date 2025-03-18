
import { Course, Review, Report, ReferralUI, ReferralSettings, ReferralSettingsUI, Expert } from '@/types/supabase';

// Function to adapt database courses to UI format
export const adaptCoursesToUI = (courses: any[]): Course[] => {
  return courses.map(course => ({
    id: course.id,
    title: course.title,
    expertId: course.expert_id,
    expertName: course.expert_name,
    enrollmentDate: course.enrollment_date,
    progress: course.progress,
    completed: course.completed
  }));
};

// Function to adapt database reviews to UI format
export const adaptReviewsToUI = (reviews: any[]): Review[] => {
  return reviews.map(review => ({
    id: review.id,
    expertId: review.expert_id,
    rating: review.rating,
    comment: review.comment,
    date: review.date
  }));
};

export const adaptReviewsForUI = adaptReviewsToUI; // Alias for backward compatibility

// Function to adapt database reports to UI format
export const adaptReportsToUI = (reports: any[]): Report[] => {
  return reports.map(report => ({
    id: report.id,
    expertId: report.expert_id,
    reason: report.reason,
    details: report.details,
    date: report.date,
    status: report.status
  }));
};

// Function to convert UI format back to database format for courses
export const adaptCoursesToDB = (courses: Course[]): any[] => {
  return courses.map(course => ({
    id: course.id,
    title: course.title,
    expert_id: course.expertId,
    expert_name: course.expertName,
    enrollment_date: course.enrollmentDate,
    progress: course.progress,
    completed: course.completed
  }));
};

// Function to convert UI format back to database format for reviews
export const adaptReviewsToDB = (reviews: Review[]): any[] => {
  return reviews.map(review => ({
    id: review.id,
    expert_id: review.expertId,
    rating: review.rating,
    comment: review.comment,
    date: review.date
  }));
};

// Function to convert UI format back to database format for reports
export const adaptReportsToDB = (reports: Report[]): any[] => {
  return reports.map(report => ({
    id: report.id,
    expert_id: report.expertId,
    reason: report.reason,
    details: report.details,
    date: report.date,
    status: report.status
  }));
};

// Functions for referrals
export const adaptReferralsToUI = (referrals: any[]): ReferralUI[] => {
  return referrals.map(referral => ({
    id: referral.id,
    referrerId: referral.referrer_id,
    referredId: referral.referred_id,
    referredName: referral.referred_name,
    referralCode: referral.referral_code,
    status: referral.status as 'pending' | 'completed' | 'expired',
    rewardClaimed: referral.reward_claimed,
    createdAt: referral.created_at,
    completedAt: referral.completed_at
  }));
};

export const adaptReferralsToDB = (referrals: ReferralUI[]): any[] => {
  return referrals.map(referral => ({
    id: referral.id,
    referrer_id: referral.referrerId,
    referred_id: referral.referredId,
    referral_code: referral.referralCode,
    status: referral.status,
    reward_claimed: referral.rewardClaimed,
    created_at: referral.createdAt,
    completed_at: referral.completedAt
  }));
};

// Functions for referral settings
export const adaptReferralSettingsToUI = (settings: ReferralSettings): ReferralSettingsUI => {
  return {
    id: settings.id,
    referrer_reward: settings.referrer_reward,
    referred_reward: settings.referred_reward,
    referrerReward: settings.referrer_reward,
    referredReward: settings.referred_reward,
    active: settings.active,
    description: settings.description,
    updated_at: settings.updated_at,
    updatedAt: settings.updated_at
  };
};

export const adaptReferralSettingsToDB = (settings: ReferralSettingsUI): ReferralSettings => {
  return {
    id: settings.id,
    referrer_reward: settings.referrer_reward || settings.referrerReward || 0,
    referred_reward: settings.referred_reward || settings.referredReward || 0,
    active: settings.active,
    description: settings.description,
    updated_at: settings.updated_at || settings.updatedAt
  };
};

// Function to convert experts for UI
export const adaptExpertsToUI = (experts: any[]): Expert[] => {
  return experts.map(expert => ({
    id: expert.id,
    name: expert.name,
    experience: expert.experience || 0,
    specialties: expert.specialization ? expert.specialization.split(',') : [],
    rating: expert.average_rating || 0,
    consultations: expert.consultations || 0,
    price: expert.price || 0,
    waitTime: expert.wait_time,
    wait_time: expert.wait_time,
    imageUrl: expert.profile_picture || '',
    image_url: expert.profile_picture || '',
    online: expert.online || false,
    languages: expert.languages || ['English'],
    bio: expert.bio,
    address: expert.address,
    city: expert.city,
    state: expert.state,
    country: expert.country,
    certificate_urls: expert.certificate_urls,
    created_at: expert.created_at,
    profile_picture: expert.profile_picture,
    email: expert.email,
    phone: expert.phone,
    selected_services: expert.selected_services,
    average_rating: expert.average_rating,
    reviews_count: expert.reviews_count
  }));
};
