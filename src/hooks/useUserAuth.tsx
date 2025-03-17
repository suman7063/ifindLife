import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserProfile, Expert, Review, Report, Course } from '@/types/supabase';
import { 
  convertUserToUserProfile, 
  adaptCoursesToUI, 
  adaptReviewsToUI, 
  adaptReportsToUI 
} from '@/utils/userProfileUtils';

export const useUserAuth = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data function
  const fetchUserData = useCallback(async (userId: string) => {
    try {
      // Fetch basic user info
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) throw userError;
      
      // Convert to UserProfile with both snake_case and camelCase properties
      const userProfile = convertUserToUserProfile(userData);
      
      // Fetch related data
      // Favorites
      const { data: favorites } = await supabase
        .from('user_favorites')
        .select('expert_id')
        .eq('user_id', userId);
      
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
        .eq('user_id', userId);
        
      userProfile.enrolledCourses = adaptCoursesToUI(courses || []);
      
      // Reviews
      const { data: reviews } = await supabase
        .from('user_reviews')
        .select('*')
        .eq('user_id', userId);
        
      userProfile.reviews = adaptReviewsToUI(reviews || []);
      
      // Reports
      const { data: reports } = await supabase
        .from('user_reports')
        .select('*')
        .eq('user_id', userId);
        
      userProfile.reports = adaptReportsToUI(reports || []);
      
      // Transactions
      const { data: transactions } = await supabase
        .from('user_transactions')
        .select('*')
        .eq('user_id', userId);
        
      userProfile.transactions = transactions || [];
      
      setCurrentUser(userProfile);
      
    } catch (error: any) {
      console.error('Error fetching user data:', error);
      toast.error(error.message || 'Error fetching user data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Get session from localStorage
    const storedSession = localStorage.getItem('supabase.auth.token');
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession);
        if (session?.currentSession?.user?.id) {
          fetchUserData(session.currentSession.user.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error parsing session from localStorage:', error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }

    // Subscribe to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
        if (session?.user?.id) {
          fetchUserData(session.user.id);
        }
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchUserData]);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error(error.message || 'Logout failed');
    }
  };

  const addToFavorites = async (expertId: string) => {
    if (!currentUser) {
      toast.error('Please log in to add to favorites');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .insert([{ user_id: currentUser.id, expert_id: expertId }]);

      if (error) throw error;

      // Optimistically update the local state
      const updatedUser = {
        ...currentUser,
        favoriteExperts: [...currentUser.favoriteExperts, { id: expertId } as any],
      };
      setCurrentUser(updatedUser);

      toast.success('Added to favorites!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to favorites');
    }
  };

  const removeFromFavorites = async (expertId: string) => {
    if (!currentUser) {
      toast.error('Please log in to remove from favorites');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', currentUser.id)
        .eq('expert_id', expertId);

      if (error) throw error;

      // Optimistically update the local state
      const updatedUser = {
        ...currentUser,
        favoriteExperts: currentUser.favoriteExperts.filter((expert) => expert.id !== expertId),
      };
      setCurrentUser(updatedUser);

      toast.success('Removed from favorites!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove from favorites');
    }
  };

  const hasTakenServiceFrom = async (expertId: string): Promise<boolean> => {
    if (!currentUser) {
      return false;
    }

    try {
      // Check if there are any completed service engagements between the user and expert
      const { data, error } = await supabase
        .from('user_expert_services')
        .select('id')
        .eq('user_id', currentUser.id)
        .eq('expert_id', expertId)
        .eq('status', 'completed')
        .limit(1);

      if (error) {
        console.error('Error checking service history:', error);
        return false;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking service history:', error);
      return false;
    }
  };

  const hasReviewedExpert = async (expertId: string): Promise<boolean> => {
    if (!currentUser) {
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('user_reviews')
        .select('id')
        .eq('user_id', currentUser.id)
        .eq('expert_id', expertId)
        .limit(1);

      if (error) {
        console.error('Error checking review history:', error);
        return false;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking review history:', error);
      return false;
    }
  };

  const addReview = async (expertId: string, rating: number, comment: string) => {
    if (!currentUser) {
      toast.error('Please log in to add a review');
      return;
    }

    try {
      // Check if user has taken service from this expert
      const hasTakenService = await hasTakenServiceFrom(expertId);
      const hasReviewed = await hasReviewedExpert(expertId);

      if (hasReviewed) {
        toast.error('You have already reviewed this expert');
        return;
      }

      if (!hasTakenService) {
        toast.error('You can only review experts after taking their service');
        return;
      }

      const { data, error } = await supabase
        .from('user_reviews')
        .insert([{
          user_id: currentUser.id,
          expert_id: expertId,
          rating: rating,
          comment: comment,
          date: new Date().toISOString(),
          verified: true
        }]);

      if (error) throw error;

      // Optimistically update the local state
      const newReview = {
        id: data ? data[0].id : 'temp_id', // Use a temporary ID
        expertId: expertId,
        rating: rating,
        comment: comment,
        date: new Date().toISOString(),
      };

      const updatedUser = {
        ...currentUser,
        reviews: [...(currentUser.reviews || []), newReview],
      };
      setCurrentUser(updatedUser);

      toast.success('Review added successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add review');
    }
  };

  const addReport = async (expertId: string, reason: string, details: string) => {
    if (!currentUser) {
      toast.error('Please log in to add a report');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_reports')
        .insert([{
          user_id: currentUser.id,
          expert_id: expertId,
          reason: reason,
          details: details,
          date: new Date().toISOString(),
          status: 'pending',
        }]);

      if (error) throw error;

      // Optimistically update the local state
      const newReport = {
        id: data ? data[0].id : 'temp_id', // Use a temporary ID
        user_id: currentUser.id,
        expert_id: expertId,
        reason: reason,
        details: details,
        date: new Date().toISOString(),
        status: 'pending',
      };

      const updatedUser = {
        ...currentUser,
        reports: [...currentUser.reports, newReport],
      };
      setCurrentUser(updatedUser);

      toast.success('Report added successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add report');
    }
  };

  const rechargeWallet = async (amount: number) => {
    if (!currentUser) {
      toast.error('Please log in to recharge your wallet');
      return;
    }

    try {
      // Simulate a successful transaction
      const newBalance = currentUser.walletBalance + amount;

      // Create a new transaction record
      const { data, error } = await supabase
        .from('user_transactions')
        .insert([{
          user_id: currentUser.id,
          date: new Date().toISOString(),
          type: 'recharge',
          amount: amount,
          currency: currentUser.currency || 'USD',
          description: 'Wallet recharge',
        }]);

      if (error) throw error;

      // Optimistically update the local state
      const updatedUser = {
        ...currentUser,
        walletBalance: newBalance,
        transactions: [...currentUser.transactions, {
          id: data ? data[0].id : 'temp_id', // Use a temporary ID
          user_id: currentUser.id,
          date: new Date().toISOString(),
          type: 'recharge',
          amount: amount,
          currency: currentUser.currency || 'USD',
          description: 'Wallet recharge',
        }],
      };
      setCurrentUser(updatedUser);

      toast.success('Wallet recharged successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to recharge wallet');
    }
  };

  const getExpertShareLink = (expertId: string): string => {
    // In a real application, you would generate a share link
    // For now, let's return a dummy link
    return `${window.location.origin}/experts/${expertId}`;
  };

  return {
    currentUser,
    loading,
    logout,
    addToFavorites,
    removeFromFavorites,
    addReview,
    addReport: async (expertId: string, reason: string, details: string) => {
      if (!currentUser) {
        toast.error('Please log in to add a report');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_reports')
          .insert([{
            user_id: currentUser.id,
            expert_id: expertId,
            reason: reason,
            details: details,
            date: new Date().toISOString(),
            status: 'pending',
          }]);

        if (error) throw error;

        // Optimistically update the local state
        const newReport = {
          id: data ? data[0].id : 'temp_id', // Use a temporary ID
          user_id: currentUser.id,
          expert_id: expertId,
          reason: reason,
          details: details,
          date: new Date().toISOString(),
          status: 'pending',
        };

        const updatedUser = {
          ...currentUser,
          reports: [...currentUser.reports, newReport],
        };
        setCurrentUser(updatedUser);

        toast.success('Report added successfully!');
      } catch (error: any) {
        toast.error(error.message || 'Failed to add report');
      }
    },
    rechargeWallet: async (amount: number) => {
      if (!currentUser) {
        toast.error('Please log in to recharge your wallet');
        return;
      }

      try {
        // Simulate a successful transaction
        const newBalance = currentUser.walletBalance + amount;

        // Create a new transaction record
        const { data, error } = await supabase
          .from('user_transactions')
          .insert([{
            user_id: currentUser.id,
            date: new Date().toISOString(),
            type: 'recharge',
            amount: amount,
            currency: currentUser.currency || 'USD',
            description: 'Wallet recharge',
          }]);

        if (error) throw error;

        // Optimistically update the local state
        const updatedUser = {
          ...currentUser,
          walletBalance: newBalance,
          transactions: [...currentUser.transactions, {
            id: data ? data[0].id : 'temp_id', // Use a temporary ID
            user_id: currentUser.id,
            date: new Date().toISOString(),
            type: 'recharge',
            amount: amount,
            currency: currentUser.currency || 'USD',
            description: 'Wallet recharge',
          }],
        };
        setCurrentUser(updatedUser);

        toast.success('Wallet recharged successfully!');
      } catch (error: any) {
        toast.error(error.message || 'Failed to recharge wallet');
      }
    },
    hasTakenServiceFrom,
    hasReviewedExpert,
    getExpertShareLink,
  };
};
