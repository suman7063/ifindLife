import { supabase } from '@/lib/supabase';

/**
 * Check if a user has a pending referral and complete it after a successful payment
 * This should be called after any monetary transaction (enrollment, appointment booking, etc.)
 */
export const checkAndCompleteReferral = async (userId: string): Promise<void> => {
  try {
    // Check if user has a pending referral
    const { data: referral } = await supabase
      .from('referrals')
      .select('*')
      .eq('referred_id', userId)
      .eq('status', 'pending')
      .single();

    if (referral) {
      // Complete the referral - this will trigger reward points distribution
      const { error } = await supabase.rpc('handle_completed_referral', {
        p_referral_id: referral.id
      });

      if (error) {
        console.error('Error completing referral:', error);
      } else {
        console.log('Referral completed successfully for user:', userId);
      }
    }
  } catch (error) {
    console.error('Error checking referral:', error);
    // Don't fail the main transaction for referral issues
  }
};