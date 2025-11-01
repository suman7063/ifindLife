import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { toast } from 'sonner';

export interface CallSession {
  id: string;
  user_id: string;
  expert_id: number;
  channel_name: string;
  call_type: 'video' | 'voice';
  status: 'pending' | 'active' | 'ended' | 'cancelled';
  selected_duration: number;
  cost: number;
  currency: string;
  start_time?: string;
  end_time?: string;
  duration?: number;
}

export function useCallSession() {
  const [currentSession, setCurrentSession] = useState<CallSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useSimpleAuth();

  const createCallSession = async (
    expertId: string,
    callType: 'video' | 'voice',
    selectedDuration: number,
    cost: number,
    currency: string = 'INR',
    expertAuthId?: string // Optional: If provided, use directly instead of looking up
  ): Promise<CallSession | null> => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      // expertId should be a UUID (either expert_accounts.id or auth_id)
      // If it's not a UUID format, we need to look up the expert_accounts record
      let expertAccountId: string | number;
      let resolvedExpertAuthId: string | null = null;
      
      // If expertAuthId is provided directly, use it (preferred - avoids lookup)
      if (expertAuthId) {
        resolvedExpertAuthId = expertAuthId;
        console.log('✅ Using provided expert_auth_id:', resolvedExpertAuthId);
        // Still need to resolve expert_accounts.id from the expertId
        expertAccountId = expertId; // Assume expertId is expert_accounts.id when auth_id is provided
      }
      
      // Check if expertId looks like a UUID (contains hyphens and is 36 chars)
      const isUUIDFormat = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(expertId);
      
      if (!isUUIDFormat) {
        // If it's not a UUID format, look up the expert_accounts record by auth_id
        console.log('🔍 Looking up expert_accounts for non-UUID ID:', expertId);
        const { data: expertAccount, error: lookupError } = await supabase
          .from('expert_accounts')
          .select('id, auth_id')
          .or(`id.eq.${expertId},auth_id.eq.${expertId}`)
          .maybeSingle();
        
        if (lookupError) {
          console.error('❌ Error looking up expert:', lookupError);
          throw new Error(`Failed to look up expert: ${lookupError.message}`);
        }
        
        if (!expertAccount) {
          // Fallback: try parsing as integer (legacy support)
          const numericId = parseInt(expertId);
          if (!isNaN(numericId)) {
            console.log('⚠️ Using numeric ID as fallback:', numericId);
            expertAccountId = numericId;
          } else {
            throw new Error(`Expert not found for ID: ${expertId}`);
          }
        } else {
          // Use the expert_accounts.id (UUID)
          expertAccountId = expertAccount.id;
          // Only set if not already provided
          if (!resolvedExpertAuthId) {
            resolvedExpertAuthId = expertAccount.auth_id as string;
          }
          console.log('✅ Found expert_accounts.id:', expertAccountId);
        }
      } else {
        // Only do lookup if auth_id wasn't provided directly
        if (!resolvedExpertAuthId) {
          // Already a UUID - could be expert_accounts.id or auth_id
          // First try as expert_accounts.id (most common case)
          console.log('🔍 Looking up expert auth_id...');
          const { data: expertById, error: lookupByIdError } = await supabase
            .from('expert_accounts')
            .select('id, auth_id, name')
            .eq('id', expertId)
            .maybeSingle();
          
          if (lookupByIdError) {
            console.error('❌ Error looking up expert by id:', lookupByIdError);
          }
          
          if (expertById?.id) {
            expertAccountId = expertById.id;
            // Ensure auth_id is properly extracted (handle both string and null cases)
            resolvedExpertAuthId = expertById.auth_id ? String(expertById.auth_id) : null;
            console.log('✅ Found expert_accounts.id:', expertAccountId);
            console.log('✅ Expert name:', expertById.name);
            console.log('✅ Expert auth_id:', resolvedExpertAuthId || 'NULL');
            
            if (!resolvedExpertAuthId) {
              console.warn('⚠️ Expert account found but auth_id is null. Cannot create incoming call request.');
              console.warn('⚠️ Expert ID:', expertId, 'Expert Account ID:', expertAccountId);
              toast.warning('Expert account is missing authentication ID. Call session created but expert may not receive notification.');
            }
          } else {
            // Try as auth_id (less common, but possible)
            const { data: expertByAuthId, error: lookupByAuthError } = await supabase
              .from('expert_accounts')
              .select('id, auth_id, name')
              .eq('auth_id', expertId)
              .maybeSingle();
            
            if (lookupByAuthError) {
              console.error('❌ Error looking up expert by auth_id:', lookupByAuthError);
            }
            
            if (expertByAuthId?.id) {
              expertAccountId = expertByAuthId.id;
              resolvedExpertAuthId = expertByAuthId.auth_id ? String(expertByAuthId.auth_id) : null;
              console.log('✅ Resolved auth_id to expert_accounts.id:', expertAccountId);
            } else {
              // Fallback: assume it's expert_accounts.id but lookup failed
              expertAccountId = expertId;
              console.warn('⚠️ Could not find expert with ID:', expertId);
              console.warn('⚠️ Attempted lookup as both expert_accounts.id and auth_id');
              console.warn('⚠️ This might be a RLS policy issue or expert doesn\'t exist');
              toast.error('Could not find expert account. Please try again.');
            }
          }
        } else {
          // auth_id was provided, just use expertId as expert_accounts.id
          expertAccountId = expertId;
        }
      }

      // Generate unique channel name (must be <= 64 bytes for Agora)
      const timestamp = Date.now();
      const shortUserId = String(user.id).replace(/-/g, '').substring(0, 8);
      const shortExpertId = String(expertAccountId).replace(/-/g, '').substring(0, 8);
      const channelName = `call_${shortUserId}_${shortExpertId}_${timestamp}`;
      
      // Create call session in database
      // Note: expert_id in call_sessions might be number or UUID depending on schema
      const sessionData: any = {
        id: channelName,
        user_id: user.id,
        expert_id: expertAccountId,
        channel_name: channelName,
        call_type: callType,
        status: 'pending',
        selected_duration: selectedDuration,
        cost,
        currency,
      };
      
      // Include expert_auth_id if available (for notifications and tracking)
      if (resolvedExpertAuthId) {
        sessionData.expert_auth_id = resolvedExpertAuthId;
        console.log('✅ Including expert_auth_id in session:', resolvedExpertAuthId);
      } else {
        console.warn('⚠️ expert_auth_id not available, session created without it');
      }
      
      const { data, error: insertError } = await supabase
        .from('call_sessions')
        .insert(sessionData)
        .select()
        .single();

      if (insertError) {
        console.error('Error creating call session:', insertError);
        throw insertError;
      }

      // Also create an incoming call request to notify the expert
      // NOTE: incoming_call_requests.expert_id must reference expert_accounts(auth_id), not expert_accounts(id)
      console.log('📨 Creating incoming call request notification:', {
        hasExpertAuthId: !!expertAuthId,
        expertAuthId,
        userId: user.id,
        callType,
        channelName
      });
      
      if (resolvedExpertAuthId) {
        try {
          const requestExpiresAt = new Date(Date.now() + 2 * 60 * 1000).toISOString(); // 2 minutes expiry
          const notificationData = {
            user_id: user.id,
            expert_id: resolvedExpertAuthId, // MUST be auth_id (references expert_accounts(auth_id))
            call_type: callType === 'video' ? 'video' : 'audio',
            status: 'pending' as const,
            channel_name: channelName,
            expires_at: requestExpiresAt,
            call_session_id: channelName,
            user_metadata: {
              userId: user.id,
              createdAt: new Date().toISOString(),
            }
          };
          
          console.log('📨 Inserting incoming call request:', notificationData);
          
          // Get current authenticated user to verify auth context
          const { data: { user: authUser } } = await supabase.auth.getUser();
          console.log('🔐 Current authenticated user:', authUser?.id);
          console.log('🔐 Request user_id:', user.id);
          console.log('🔐 Match:', authUser?.id === user.id);
          
          const { data: insertedRequest, error: requestError } = await supabase
            .from('incoming_call_requests')
            .insert(notificationData)
            .select()
            .single();

          if (requestError) {
            console.error('❌ Failed to create incoming call request:', requestError);
            console.error('❌ Error details:', {
              code: requestError.code,
              message: requestError.message,
              details: requestError.details,
              hint: requestError.hint
            });
            console.error('❌ Request data was:', notificationData);
            console.error('❌ Auth context - Current user:', authUser?.id, 'Expected:', user.id);
            
            // If RLS fails, try using edge function as fallback
            if (requestError.code === '42501') {
              console.log('⚠️ RLS policy blocked insert, trying edge function fallback...');
              try {
                const { data: edgeResult, error: edgeError } = await supabase.functions.invoke('create-call-request', {
                  body: notificationData
                });
                
                if (edgeError || !edgeResult?.success) {
                  console.error('❌ Edge function also failed:', edgeError || edgeResult);
                  toast.warning('Call session created, but notification may not have been sent.');
                } else {
                  console.log('✅ Call request created via edge function:', edgeResult.callRequest);
                  toast.success('Call request sent successfully');
                }
              } catch (edgeErr) {
                console.error('❌ Edge function error:', edgeErr);
                toast.warning('Call session created, but notification may not have been sent.');
              }
            }
          } else {
            console.log('✅ Incoming call request created successfully:', insertedRequest);
            console.log('📨 Expert with auth_id', resolvedExpertAuthId, 'will receive notification via real-time subscription');
            // Note: No need to send separate notification - real-time subscription will handle it automatically
          }
        } catch (notifyErr) {
          console.error('❌ Exception while notifying expert about incoming call:', notifyErr);
        }
      } else {
        console.warn('⚠️ Cannot create incoming call request: expert auth_id not resolved');
        console.warn('⚠️ expertId was:', expertId);
        console.warn('⚠️ Was auth_id provided?', !!expertAuthId);
      }

      console.log('Call session created:', data);
      setCurrentSession(data as CallSession);
      return data as CallSession;

    } catch (err) {
      console.error('Error creating call session:', err);
      setError('Failed to create call session');
      toast.error('Failed to create call session');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateCallSessionStatus = async (
    sessionId: string,
    status: CallSession['status'],
    additionalData?: Partial<CallSession>
  ): Promise<void> => {
    try {
      const updateData = {
        status,
        updated_at: new Date().toISOString(),
        ...additionalData,
      };

      if (status === 'active' && !additionalData?.start_time) {
        updateData.start_time = new Date().toISOString();
      }

      if (status === 'ended' && !additionalData?.end_time) {
        updateData.end_time = new Date().toISOString();
      }

      const { error } = await supabase
        .from('call_sessions')
        .update(updateData)
        .eq('id', sessionId);

      if (error) {
        console.error('Error updating call session:', error);
        throw error;
      }

      if (currentSession?.id === sessionId) {
        setCurrentSession(prev => prev ? { ...prev, ...updateData } : null);
      }

    } catch (err) {
      console.error('Error updating call session:', err);
      toast.error('Failed to update call session');
    }
  };

  const endCallSession = async (sessionId: string, actualDuration?: number): Promise<void> => {
    try {
      const endTime = new Date().toISOString();
      const updateData: any = {
        status: 'ended' as const,
        end_time: endTime,
        updated_at: endTime,
      };

      if (actualDuration !== undefined) {
        updateData.duration = actualDuration;
      }

      await updateCallSessionStatus(sessionId, 'ended', updateData);
      
      if (currentSession?.id === sessionId) {
        setCurrentSession(null);
      }

    } catch (err) {
      console.error('Error ending call session:', err);
    }
  };

  const getCallSession = async (sessionId: string): Promise<CallSession | null> => {
    try {
      const { data, error } = await supabase
        .from('call_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error) {
        console.error('Error fetching call session:', error);
        return null;
      }

      return data as CallSession;
    } catch (err) {
      console.error('Error fetching call session:', err);
      return null;
    }
  };

  useEffect(() => {
    if (!user) {
      setCurrentSession(null);
    }
  }, [user]);

  return {
    currentSession,
    loading,
    error,
    createCallSession,
    updateCallSessionStatus,
    endCallSession,
    getCallSession,
  };
}