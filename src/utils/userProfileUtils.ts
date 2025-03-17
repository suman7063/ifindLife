
import { supabase } from '@/lib/supabase';
import { UserProfile, Expert, Review, Report, Course, UserTransaction } from '@/types/supabase';

// Function to convert database user to UserProfile
export const convertUserToUserProfile = (user: any): UserProfile => {
  if (!user) return {} as UserProfile;
  
  return {
    // Core user data with both snake_case (from DB) and camelCase (for UI)
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    country: user.country,
    city: user.city,
    currency: user.currency,
    profile_picture: user.profile_picture,
    wallet_balance: user.wallet_balance,
    created_at: user.created_at,
    
    // UI convenience fields (camelCase)
    profilePicture: user.profile_picture,
    walletBalance: user.wallet_balance,
    
    // Related collections that will be populated separately
    favoriteExperts: [],
    enrolledCourses: [],
    transactions: [],
    reviews: [],
    reports: []
  };
};

// Function to update user profile
export const updateUserProfile = async (
  userId: string,
  data: Partial<UserProfile>
): Promise<void> => {
  // Convert camelCase to snake_case for database
  const dbData = {
    name: data.name,
    phone: data.phone,
    country: data.country,
    city: data.city,
    // Add other fields as needed
  };

  const { error } = await supabase
    .from('users')
    .update(dbData)
    .eq('id', userId);

  if (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Function to adapt database courses to UI format
export const adaptCoursesToUI = (courses: Course[]): any[] => {
  return courses.map(course => ({
    ...course,
    // Add camelCase aliases for UI components
    expertName: course.expert_name,
    enrollmentDate: course.enrollment_date
  }));
};

// Function to adapt database reviews/reports to UI format
export const adaptReviewsToUI = (reviews: Review[]): any[] => {
  return reviews.map(review => ({
    ...review,
    // Add camelCase aliases for UI components
    expertId: review.expert_id
  }));
};

export const adaptReportsToUI = (reports: Report[]): any[] => {
  return reports.map(report => ({
    ...report,
    // Add camelCase aliases for UI components
    expertId: report.expert_id
  }));
};
