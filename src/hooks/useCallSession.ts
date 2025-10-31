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
    currency: string = 'INR'
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
      let expertAuthId: string | null = null;
      
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
          expertAuthId = expertAccount.auth_id as string;
          console.log('✅ Found expert_accounts.id:', expertAccountId);
        }
      } else {
        // Already a UUID - could be expert_accounts.id or auth_id
        // First try as auth_id
        const { data: expertByAuthId } = await supabase
          .from('expert_accounts')
          .select('id, auth_id')
          .eq('auth_id', expertId)
          .maybeSingle();
        
        if (expertByAuthId?.id) {
          expertAccountId = expertByAuthId.id;
          expertAuthId = expertByAuthId.auth_id as string;
          console.log('✅ Resolved auth_id to expert_accounts.id:', expertAccountId);
        } else {
          // Try as expert_accounts.id
          const { data: expertById } = await supabase
            .from('expert_accounts')
            .select('id, auth_id')
            .eq('id', expertId)
            .maybeSingle();
          
          if (expertById?.id) {
            expertAccountId = expertById.id;
            expertAuthId = expertById.auth_id as string;
            console.log('✅ Found expert_accounts.id, got auth_id:', expertAuthId);
          } else {
            // Fallback: assume it's expert_accounts.id but we don't have auth_id
            expertAccountId = expertId;
            console.log('⚠️ Using UUID as expert_accounts.id, but auth_id lookup failed');
          }
        }
      }

      // Generate unique channel name
      const channelName = `call_${user.id}_${expertAccountId}_${Date.now()}`;
      
      // Create call session in database
      // Note: expert_id in call_sessions might be number or UUID depending on schema
      const { data, error: insertError } = await supabase
        .from('call_sessions')
        .insert({
          id: channelName,
          user_id: user.id,
          expert_id: expertAccountId,
          channel_name: channelName,
          call_type: callType,
          status: 'pending',
          selected_duration: selectedDuration,
          cost,
          currency,
        })
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
      
      if (expertAuthId) {
        try {
          const requestExpiresAt = new Date(Date.now() + 2 * 60 * 1000).toISOString(); // 2 minutes expiry
          const notificationData = {
            user_id: user.id,
            expert_id: expertAuthId, // MUST be auth_id (references expert_accounts(auth_id))
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
          
          const { data: insertedRequest, error: requestError } = await supabase
            .from('incoming_call_requests')
            .insert(notificationData)
            .select()
            .single();

          if (requestError) {
            console.error('❌ Failed to create incoming call request:', requestError);
            console.error('❌ Request data was:', notificationData);
          } else {
            console.log('✅ Incoming call request created successfully:', insertedRequest);
            console.log('📨 Expert with auth_id', expertAuthId, 'should receive notification');
          }
        } catch (notifyErr) {
          console.error('❌ Exception while notifying expert about incoming call:', notifyErr);
        }
      } else {
        console.warn('⚠️ Cannot create incoming call request: expert auth_id not resolved');
        console.warn('⚠️ expertId was:', expertId);
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