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
    console.log('🔍 Checking referral for user:', userId, 'callSessionId:', callSessionId);
    
    // Check if user has a pending referral
    const { data: referral, error: referralError } = await supabase
      .from('referrals')
      .select('*')
      .eq('referred_id', userId)
      .eq('status', 'pending')
      .maybeSingle();

    if (referralError) {
      console.error('❌ Error checking referral:', referralError);
      return;
    }

    if (!referral) {
      console.log('ℹ️ No pending referral found for user:', userId);
      return;
    }

    if (referral) {
      console.log('🔍 Found pending referral:', {
        referralId: referral.id,
        referrerId: referral.referrer_id,
        referredId: referral.referred_id,
        userId: userId,
        status: referral.status
      });

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
        console.log('⚠️ Referral program is not active, skipping referral completion');
        return;
      }

      // Use provided call end time or current time
      const endTime = callEndTime || new Date().toISOString();

      // IMPORTANT: Update referral status to 'completed' immediately when call completes
      // Rewards will still be awarded after delay, but status should show as completed
      // Always update status even if pending reward already exists (in case status update failed previously)
      // Use RPC function to bypass RLS policies
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: statusUpdateResult, error: statusUpdateError } = await (supabase as any).rpc(
        'update_referral_status',
        {
          p_referral_id: referral.id,
          p_status: 'completed',
          p_completed_at: endTime
        }
      );

      if (statusUpdateError) {
        console.error('❌ Error updating referral status:', statusUpdateError);
        console.error('Referral ID:', referral.id, 'User ID:', userId);
        // Don't return early - still try to create pending reward
      } else if (statusUpdateResult === false) {
        console.warn('⚠️ Referral status was already updated or not pending');
        console.log('Referral ID:', referral.id, 'User ID:', userId);
      } else {
        console.log('✅ Referral status updated to completed immediately');
        console.log('Referral ID:', referral.id, 'User ID:', userId);
      }

      // Check if pending reward already exists
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: existingPending } = await (supabase as any)
        .from('referral_rewards_pending')
        .select('id')
        .eq('referral_id', referral.id)
        .maybeSingle();

      if (existingPending) {
        console.log('Pending referral reward already exists for this referral, skipping creation');
        return;
      }

      // Create pending reward entry (will be processed after delay)
      // Rewards will be awarded after delay (2 minutes for test, 48 hours for production)
      // Processing happens automatically via pg_cron job that runs every minute
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
        console.log('✅ Pending referral reward created. Credits will be awarded automatically after 2 minutes delay');
        console.log('Pending reward ID:', pendingReward);
        console.log('ℹ️ Automatic processing is enabled via pg_cron (runs every minute)');
      }
    }
  } catch (error) {
    console.error('Error checking referral:', error);
    // Don't fail the main transaction for referral issues
  }
};

/**
 * Process pending referral rewards that are due
 * This is automatically called every minute via pg_cron job
 * Can also be called manually from admin panel if needed
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

/**
 * Sync referral statuses with completed calls
 * This function fixes referrals that are stuck in 'pending' status
 * but have completed calls. Useful for fixing data inconsistencies.
 * Can be called from admin panel or manually.
 */
export const syncReferralStatusesWithCompletedCalls = async (): Promise<{
  updated: number;
  errors: number;
}> => {
  try {
    // Find all pending referrals
    const { data: pendingReferrals, error: referralsError } = await supabase
      .from('referrals')
      .select('id, referred_id, status')
      .eq('status', 'pending');

    if (referralsError) {
      console.error('Error fetching pending referrals:', referralsError);
      return { updated: 0, errors: 0 };
    }

    if (!pendingReferrals || pendingReferrals.length === 0) {
      console.log('ℹ️ No pending referrals found');
      return { updated: 0, errors: 0 };
    }

    console.log(`🔍 Found ${pendingReferrals.length} pending referrals to check`);
    console.log('Pending referrals:', pendingReferrals.map(r => ({ id: r.id, referred_id: r.referred_id })));

    let updated = 0;
    let errors = 0;

    // For each pending referral, check if the referred user has completed calls
    for (const referral of pendingReferrals) {
      try {
        console.log(`🔍 Checking referral ${referral.id} for user ${referral.referred_id}`);
        
        // Check if user has any completed call sessions
        // Note: call_sessions status is 'ended' (not 'completed') and column is 'end_time' (not 'ended_at')
        const { data: completedCalls, error: callsError } = await supabase
          .from('call_sessions')
          .select('id, status, end_time, user_id')
          .eq('user_id', referral.referred_id)
          .eq('status', 'ended')
          .not('end_time', 'is', null)
          .limit(1);

        console.log(`   Call query result:`, { 
          completedCalls: completedCalls?.length || 0, 
          callsError: callsError?.message || null,
          calls: completedCalls 
        });

        if (callsError) {
          console.error(`❌ Error checking calls for referral ${referral.id}:`, callsError);
          console.error(`   Error details:`, JSON.stringify(callsError, null, 2));
          console.error(`   Referral details:`, { id: referral.id, referred_id: referral.referred_id });
          errors++;
          continue;
        }

        // If user has completed calls, update referral status
        if (completedCalls && completedCalls.length > 0) {
          const firstCompletedCall = completedCalls[0];
          const callEndTime = firstCompletedCall.end_time || new Date().toISOString();
          
          console.log(`   ✅ Found completed call for referral ${referral.id}:`, {
            callId: firstCompletedCall.id,
            endTime: callEndTime,
            status: firstCompletedCall.status
          });

          // Check if pending reward already exists
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: existingPending } = await (supabase as any)
            .from('referral_rewards_pending')
            .select('id')
            .eq('referral_id', referral.id)
            .maybeSingle();

          // Update referral status to completed using RPC function (bypasses RLS)
          // Try RPC function first, fallback to direct update if function doesn't exist
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let updateResult: boolean | null = null;
          let updateError: any = null;
          
          try {
            const rpcResult = await (supabase as any).rpc(
              'update_referral_status',
              {
                p_referral_id: referral.id,
                p_status: 'completed',
                p_completed_at: callEndTime
              }
            );
            updateResult = rpcResult.data;
            updateError = rpcResult.error;
          } catch (rpcErr: any) {
            // If RPC function doesn't exist (code 42883), try direct update
            if (rpcErr?.code === '42883' || rpcErr?.message?.includes('does not exist')) {
              console.warn(`⚠️ RPC function update_referral_status not found, trying direct update`);
              const directUpdate = await supabase
                .from('referrals')
                .update({
                  status: 'completed',
                  completed_at: callEndTime
                })
                .eq('id', referral.id)
                .eq('status', 'pending')
                .select();
              
              updateError = directUpdate.error;
              updateResult = directUpdate.data && directUpdate.data.length > 0;
            } else {
              updateError = rpcErr;
            }
          }

          if (updateError) {
            console.error(`❌ Error updating referral ${referral.id}:`, updateError);
            console.error(`   Error details:`, JSON.stringify(updateError, null, 2));
            console.error(`   Referral details:`, { id: referral.id, referred_id: referral.referred_id });
            errors++;
          } else if (updateResult === false || updateResult === null) {
            console.warn(`⚠️ No rows updated for referral ${referral.id} - status may have already changed or RPC function returned false`);
            // Check current status
            const { data: currentStatus } = await supabase
              .from('referrals')
              .select('status')
              .eq('id', referral.id)
              .single();
            console.log(`   Current referral status:`, currentStatus?.status);
            // Don't count as error if status was already updated
          } else {
            console.log(`✅ Updated referral ${referral.id} to completed`);
            updated++;

            // Create pending reward if it doesn't exist
            if (!existingPending) {
              // Check if referral program is active
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const { data: settingsData } = await (supabase as any)
                .from('referral_settings')
                .select('active')
                .order('updated_at', { ascending: false })
                .limit(1)
                .maybeSingle();

              const settings = settingsData as { active?: boolean } | null;
              if (settings?.active) {
                // Create pending reward entry using RPC function
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const { data: pendingReward, error: pendingError } = await (supabase as any).rpc(
                  'create_pending_referral_reward',
                  {
                    p_referral_id: referral.id,
                    p_call_session_id: firstCompletedCall.id || null,
                    p_call_end_time: callEndTime
                  }
                );

                if (pendingError) {
                  console.error(`Error creating pending reward for referral ${referral.id}:`, pendingError);
                } else {
                  console.log(`✅ Created pending reward for referral ${referral.id}`);
                }
              } else {
                console.log(`Referral program is not active, skipping reward creation for referral ${referral.id}`);
              }
            } else {
              console.log(`Pending reward already exists for referral ${referral.id}, skipping creation`);
            }
          }
        } else {
          console.log(`⚠️ No completed calls found for referral ${referral.id}, user ${referral.referred_id}`);
          // Check if user has any calls at all (for debugging)
          const { data: allCalls } = await supabase
            .from('call_sessions')
            .select('id, status, end_time')
            .eq('user_id', referral.referred_id)
            .limit(5);
          console.log(`   All calls for this user:`, allCalls);
        }
      } catch (error) {
        console.error(`Error processing referral ${referral.id}:`, error);
        errors++;
      }
    }

    console.log(`✅ Sync complete: ${updated} referrals updated, ${errors} errors`);
    return { updated, errors };
  } catch (error) {
    console.error('Error syncing referral statuses:', error);
    return { updated: 0, errors: 0 };
  }
};