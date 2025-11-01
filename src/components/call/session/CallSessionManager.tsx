
import React, { createContext, useContext, useCallback, useState } from 'react';
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
  recordingUrl?: string;
  analyticsData?: any;
}

interface CallSessionContextType {
  currentSession: CallSession | null;
  createSession: (expertId: number, callType: 'audio' | 'video', userId: string) => Promise<CallSession | null>;
  updateSession: (sessionId: string, updates: Partial<CallSession>) => Promise<void>;
  endSession: (sessionId: string, duration: number, cost: number) => Promise<void>;
  rateSession: (sessionId: string, rating: number, review?: string) => Promise<void>;
}

const CallSessionContext = createContext<CallSessionContextType | null>(null);

export const useCallSession = () => {
  const context = useContext(CallSessionContext);
  if (!context) {
    throw new Error('useCallSession must be used within CallSessionProvider');
  }
  return context;
};

interface CallSessionProviderProps {
  children: React.ReactNode;
}

export const CallSessionProvider: React.FC<CallSessionProviderProps> = ({ children }) => {
  const [currentSession, setCurrentSession] = useState<CallSession | null>(null);

  const createSession = useCallback(async (
    expertId: number,
    callType: 'audio' | 'video',
    userId: string
  ): Promise<CallSession | null> => {
    try {
      // Generate unique channel name (must be <= 64 bytes for Agora)
      const timestamp = Date.now();
      const shortExpertId = String(expertId).replace(/-/g, '').substring(0, 8);
      const shortUserId = String(userId).replace(/-/g, '').substring(0, 8);
      const channelName = `call_${shortExpertId}_${shortUserId}_${timestamp}`;
      
      const session: CallSession = {
        id: `session_${Date.now()}`,
        expertId,
        userId,
        channelName,
        callType,
        status: 'pending',
        startTime: new Date()
      };

      // Store in database
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
      return session;
    } catch (error) {
      console.error('Error creating call session:', error);
      toast.error('Failed to create call session');
      return null;
    }
  }, []);

  const updateSession = useCallback(async (
    sessionId: string,
    updates: Partial<CallSession>
  ) => {
    try {
      const updateData: any = {};
      
      if (updates.status) updateData.status = updates.status;
      if (updates.endTime) updateData.end_time = updates.endTime.toISOString();
      if (updates.duration) updateData.duration = updates.duration;
      if (updates.cost) updateData.cost = updates.cost;
      if (updates.recordingUrl) updateData.recording_url = updates.recordingUrl;
      if (updates.analyticsData) updateData.analytics_data = updates.analyticsData;

      const { error } = await supabase
        .from('call_sessions')
        .update(updateData)
        .eq('id', sessionId);

      if (error) {
        console.error('Failed to update session:', error);
        return;
      }

      if (currentSession && currentSession.id === sessionId) {
        setCurrentSession(prev => prev ? { ...prev, ...updates } : null);
      }
    } catch (error) {
      console.error('Error updating session:', error);
    }
  }, [currentSession]);

  const endSession = useCallback(async (
    sessionId: string,
    duration: number,
    cost: number
  ) => {
    await updateSession(sessionId, {
      status: 'ended',
      endTime: new Date(),
      duration,
      cost
    });
    setCurrentSession(null);
  }, [updateSession]);

  const rateSession = useCallback(async (
    sessionId: string,
    rating: number,
    review?: string
  ) => {
    try {
      const { error } = await supabase
        .from('call_sessions')
        .update({ 
          rating,
          review: review || null
        })
        .eq('id', sessionId);

      if (error) {
        console.error('Failed to rate session:', error);
        toast.error('Failed to submit rating');
        return;
      }

      toast.success('Thank you for your feedback!');
    } catch (error) {
      console.error('Error rating session:', error);
      toast.error('Failed to submit rating');
    }
  }, []);

  const value: CallSessionContextType = {
    currentSession,
    createSession,
    updateSession,
    endSession,
    rateSession
  };

  return (
    <CallSessionContext.Provider value={value}>
      {children}
    </CallSessionContext.Provider>
  );
};
