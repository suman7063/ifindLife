import { supabase } from '@/lib/supabase';

/**
 * Check if a user has a pending referral and create a pending reward entry
 * Credits will be awarded after delay (2 minutes for test, 48 hours for production)
 * This should be called when a call is completed by a referred user
 */
export const checkAndCompleteReferral = async (
  userId: string, 
  callSessionId?: string,
  callEndTime?: string
): Promise<void> => {
  try {
    // Check if user has a pending referral
    const { data: referral, error: referralError } = await supabase
      .from('referrals')
      .select('*')
      .eq('referred_id', userId)
      .eq('status', 'pending')
      .maybeSingle();

    if (referralError) {
      console.error('Error checking referral:', referralError);
      return;
    }

    if (referral) {
      // Check if referral program is active
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: settingsData } = await (supabase as any)
        .from('referral_settings')
        .select('active')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const settings = settingsData as { active?: boolean } | null;
      if (!settings?.active) {
        console.log('Referral program is not active, skipping referral completion');
        return;
      }

      // Check if pending reward already exists
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: existingPending } = await (supabase as any)
        .from('referral_rewards_pending')
        .select('id')
        .eq('referral_id', referral.id)
        .maybeSingle();

      if (existingPending) {
        console.log('Pending referral reward already exists for this referral');
        return;
      }

      // Use provided call end time or current time
      const endTime = callEndTime || new Date().toISOString();

      // Create pending reward entry (will be processed after delay)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: pendingReward, error: pendingError } = await (supabase as any).rpc(
        'create_pending_referral_reward',
        {
          p_referral_id: referral.id,
          p_call_session_id: callSessionId || null,
          p_call_end_time: endTime
        }
      );

      if (pendingError) {
        console.error('Error creating pending referral reward:', pendingError);
      } else {
        console.log('✅ Pending referral reward created. Credits will be awarded after delay (2 mins for test, 48hrs for production)');
        console.log('Pending reward ID:', pendingReward);
      }
    }
  } catch (error) {
    console.error('Error checking referral:', error);
    // Don't fail the main transaction for referral issues
  }
};

/**
 * Process pending referral rewards that are due
 * This should be called periodically (via cron job or scheduled task)
 * For now, can be called manually or from admin panel
 */
export const processPendingReferralRewards = async (): Promise<{
  processed: number;
  failed: number;
}> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any).rpc('process_pending_referral_rewards');

    if (error) {
      console.error('Error processing pending referral rewards:', error);
      return { processed: 0, failed: 0 };
    }

    const result = data?.[0] || { processed_count: 0, failed_count: 0 };
    console.log(`✅ Processed ${result.processed_count} pending rewards, ${result.failed_count} failed`);

    return {
      processed: result.processed_count || 0,
      failed: result.failed_count || 0
    };
  } catch (error) {
    console.error('Error processing pending referral rewards:', error);
    return { processed: 0, failed: 0 };
  }
};