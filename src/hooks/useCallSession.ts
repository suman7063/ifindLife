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
    currency: string = 'USD'
  ): Promise<CallSession | null> => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      // Generate unique channel name
      const channelName = `call_${user.id}_${expertId}_${Date.now()}`;
      
      // Create call session in database
      const { data, error: insertError } = await supabase
        .from('call_sessions')
        .insert({
          id: channelName,
          user_id: user.id,
          expert_id: parseInt(expertId),
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