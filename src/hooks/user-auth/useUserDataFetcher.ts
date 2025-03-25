
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/supabase';
import { adaptCoursesToUI, adaptReviewsToUI, adaptReportsToUI } from '@/utils/dataAdapters';

export const useUserDataFetcher = (
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const fetchUserData = async (userId: string) => {
    try {
      // Get base user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      // Get user favorites (expert IDs)
      const { data: favoritesData, error: favoritesError } = await supabase
        .from('user_favorites')
        .select('expert_id')
        .eq('user_id', userId);

      if (favoritesError) throw favoritesError;

      // Get user's courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('user_courses')
        .select('*')
        .eq('user_id', userId);

      if (coursesError) throw coursesError;

      // Get user's reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('user_reviews')
        .select('*')
        .eq('user_id', userId);

      if (reviewsError) throw reviewsError;

      // Get user's reports
      const { data: reportsData, error: reportsError } = await supabase
        .from('user_reports')
        .select('*')
        .eq('user_id', userId);

      if (reportsError) throw reportsError;

      // Get user's transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('user_transactions')
        .select('*')
        .eq('user_id', userId);

      if (transactionsError) throw transactionsError;

      // Convert expert_id to strings for favorites
      const favorites = favoritesData.map(fav => fav.expert_id.toString());

      // Create UserProfile object
      const userProfile: UserProfile = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        country: userData.country,
        city: userData.city,
        profilePicture: userData.profile_picture,
        walletBalance: userData.wallet_balance || 0,
        currency: userData.currency || 'USD',
        referralCode: userData.referral_code,
        referralLink: userData.referral_link,
        favorites: favorites,
        courses: adaptCoursesToUI(coursesData || []),
        reviews: adaptReviewsToUI(reviewsData || []),
        reports: adaptReportsToUI(reportsData || []),
        transactions: transactionsData || [],
      };

      setCurrentUser(userProfile);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  return { fetchUserData };
};
