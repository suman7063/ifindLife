
import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface CallSession {
  id: string;
  expertId: number;
  userId: string;
  channelName: string;
  callType: 'audio' | 'video';
  status: 'pending' | 'active' | 'ended' | 'failed';
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  cost?: number;
  rating?: number;
}

export const useCallSession = () => {
  const [currentSession, setCurrentSession] = useState<CallSession | null>(null);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const sessionRef = useRef<CallSession | null>(null);

  const createCallSession = useCallback(async (
    expertId: number,
    callType: 'audio' | 'video',
    userId: string
  ): Promise<CallSession | null> => {
    setIsCreatingSession(true);
    
    try {
      // Generate unique channel name
      const channelName = `call_${expertId}_${userId}_${Date.now()}`;
      
      const session: CallSession = {
        id: `session_${Date.now()}`,
        expertId,
        userId,
        channelName,
        callType,
        status: 'pending',
        startTime: new Date()
      };

      // Store session in Supabase for persistence
      const { error } = await supabase
        .from('call_sessions')
        .insert({
          id: session.id,
          expert_id: expertId,
          user_id: userId,
          channel_name: channelName,
          call_type: callType,
          status: session.status,
          start_time: session.startTime?.toISOString()
        });

      if (error) {
        console.error('Failed to create call session:', error);
        throw new Error('Failed to create call session');
      }

      setCurrentSession(session);
      sessionRef.current = session;
      return session;
    } catch (error) {
      console.error('Error creating call session:', error);
      toast.error('Failed to create call session');
      return null;
    } finally {
      setIsCreatingSession(false);
    }
  }, []);

  const updateSessionStatus = useCallback(async (
    sessionId: string,
    status: CallSession['status'],
    additionalData?: Partial<CallSession>
  ) => {
    try {
      const updateData: any = { status };
      
      if (additionalData?.endTime) {
        updateData.end_time = additionalData.endTime.toISOString();
      }
      if (additionalData?.duration) {
        updateData.duration = additionalData.duration;
      }
      if (additionalData?.cost) {
        updateData.cost = additionalData.cost;
      }

      const { error } = await supabase
        .from('call_sessions')
        .update(updateData)
        .eq('id', sessionId);

      if (error) {
        console.error('Failed to update session status:', error);
        return;
      }

      if (sessionRef.current && sessionRef.current.id === sessionId) {
        const updatedSession = {
          ...sessionRef.current,
          status,
          ...additionalData
        };
        setCurrentSession(updatedSession);
        sessionRef.current = updatedSession;
      }
    } catch (error) {
      console.error('Error updating session status:', error);
    }
  }, []);

  const endCallSession = useCallback(async (
    sessionId: string,
    duration: number,
    cost: number
  ) => {
    await updateSessionStatus(sessionId, 'ended', {
      endTime: new Date(),
      duration,
      cost
    });

    // Clear current session
    setCurrentSession(null);
    sessionRef.current = null;
  }, [updateSessionStatus]);

  const getCurrentSession = useCallback(() => {
    return sessionRef.current;
  }, []);

  return {
    currentSession,
    isCreatingSession,
    createCallSession,
    updateSessionStatus,
    endCallSession,
    getCurrentSession
  };
};
