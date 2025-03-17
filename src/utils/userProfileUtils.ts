
import { supabase } from '@/lib/supabase';
import { UserProfile, Expert, Review, Report, Course, UserTransaction } from '@/types/supabase';

// Function to convert database user to UserProfile
export const convertUserToUserProfile = (user: any): UserProfile => {
  if (!user) return {} as UserProfile;
  
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    country: user.country,
    city: user.city,
    currency: user.currency,
    profilePicture: user.profile_picture,
    walletBalance: user.wallet_balance,
    createdAt: user.created_at,
    favoriteExperts: [],
    enrolledCourses: [],
    transactions: [],
    reviews: [],
    reports: []
  };
};

// Function to fetch user profile from Supabase
export const fetchUserProfile = async (user: any): Promise<UserProfile | null> => {
  if (!user || !user.id) return null;
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    // Convert to UserProfile with both snake_case and camelCase properties
    const userProfile = convertUserToUserProfile(data);
    
    // Fetch related data
    // Favorites
    const { data: favorites } = await supabase
      .from('user_favorites')
      .select('expert_id')
      .eq('user_id', user.id);
    
    if (favorites && favorites.length > 0) {
      const expertIds = favorites.map(fav => fav.expert_id);
      const { data: expertsData } = await supabase
        .from('experts')
        .select('*')
        .in('id', expertIds);
        
      userProfile.favoriteExperts = expertsData || [];
    }
    
    // Courses
    const { data: courses } = await supabase
      .from('user_courses')
      .select('*')
      .eq('user_id', user.id);
      
    userProfile.enrolledCourses = adaptCoursesToUI(courses || []);
    
    // Reviews
    const { data: reviews } = await supabase
      .from('user_reviews')
      .select('*')
      .eq('user_id', user.id);
      
    userProfile.reviews = adaptReviewsToUI(reviews || []);
    
    // Reports
    const { data: reports } = await supabase
      .from('user_reports')
      .select('*')
      .eq('user_id', user.id);
      
    userProfile.reports = adaptReportsToUI(reports || []);
    
    // Transactions
    const { data: transactions } = await supabase
      .from('user_transactions')
      .select('*')
      .eq('user_id', user.id);
      
    userProfile.transactions = transactions || [];
    
    return userProfile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

// Function to update user profile
export const updateUserProfile = async (
  userId: string,
  data: Partial<UserProfile>
): Promise<boolean> => {
  try {
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
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
};

// Function to upload and update profile picture
export const updateProfilePicture = async (userId: string, file: File): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `profile-pictures/${fileName}`;
    
    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);
      
    if (uploadError) {
      throw uploadError;
    }
    
    // Get public URL
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);
      
    const publicUrl = data.publicUrl;
    
    // Update user profile with the new profile picture URL
    const { error: updateError } = await supabase
      .from('users')
      .update({ profile_picture: publicUrl })
      .eq('id', userId);
      
    if (updateError) {
      throw updateError;
    }
    
    return publicUrl;
  } catch (error) {
    console.error('Error updating profile picture:', error);
    throw error;
  }
};

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
