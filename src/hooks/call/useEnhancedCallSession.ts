
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth/AuthContext';

export interface EnhancedCallSession {
  id: string;
  expert_id: number;
  user_id: string;
  channel_name: string;
  call_type: 'audio' | 'video';
  status: 'pending' | 'active' | 'ended' | 'failed';
  start_time?: Date;
  end_time?: Date;
  duration?: number;
  cost?: number;
  currency: 'USD' | 'INR';
  selected_duration: number;
  pricing_tier: string;
  payment_method?: 'wallet' | 'gateway';
  rating?: number;
  review?: string;
  recording_url?: string;
  analytics_data?: any;
}

export const useEnhancedCallSession = () => {
  const [currentSession, setCurrentSession] = useState<EnhancedCallSession | null>(null);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const { userProfile } = useAuth();

  const createCallSession = useCallback(async (
    expertId: number,
    callType: 'audio' | 'video',
    selectedDuration: number,
    currency: 'USD' | 'INR',
    cost: number,
    paymentMethod: 'wallet' | 'gateway'
  ): Promise<EnhancedCallSession | null> => {
    if (!userProfile) {
      toast.error('You must be logged in to start a call');
      return null;
    }

    setIsCreatingSession(true);
    
    try {
      const sessionId = `call_${expertId}_${userProfile.id}_${Date.now()}`;
      const channelName = `channel_${sessionId}`;
      
      const sessionData = {
        id: sessionId,
        expert_id: expertId,
        user_id: userProfile.id,
        channel_name: channelName,
        call_type: callType,
        status: 'pending' as const,
        currency,
        selected_duration: selectedDuration,
        cost,
        pricing_tier: 'standard',
        payment_method: paymentMethod,
        start_time: new Date().toISOString()
      };

      const { error } = await supabase
        .from('call_sessions')
        .insert(sessionData);

      if (error) {
        console.error('Failed to create call session:', error);
        throw new Error('Failed to create call session');
      }

      const session: EnhancedCallSession = {
        ...sessionData,
        start_time: new Date()
      };

      setCurrentSession(session);
      return session;
    } catch (error) {
      console.error('Error creating call session:', error);
      toast.error('Failed to create call session');
      return null;
    } finally {
      setIsCreatingSession(false);
    }
  }, [userProfile]);

  const updateSessionStatus = useCallback(async (
    sessionId: string,
    status: EnhancedCallSession['status'],
    additionalData?: Partial<EnhancedCallSession>
  ) => {
    try {
      const updateData: any = { 
        status,
        updated_at: new Date().toISOString()
      };
      
      if (additionalData?.end_time) {
        updateData.end_time = additionalData.end_time.toISOString();
      }
      if (additionalData?.duration !== undefined) {
        updateData.duration = additionalData.duration;
      }
      if (additionalData?.rating) {
        updateData.rating = additionalData.rating;
      }
      if (additionalData?.review) {
        updateData.review = additionalData.review;
      }

      const { error } = await supabase
        .from('call_sessions')
        .update(updateData)
        .eq('id', sessionId);

      if (error) {
        console.error('Failed to update session:', error);
        return;
      }

      if (currentSession && currentSession.id === sessionId) {
        setCurrentSession(prev => prev ? { ...prev, status, ...additionalData } : null);
      }
    } catch (error) {
      console.error('Error updating session:', error);
    }
  }, [currentSession]);

  const endCallSession = useCallback(async (
    sessionId: string,
    duration: number,
    finalCost?: number
  ) => {
    await updateSessionStatus(sessionId, 'ended', {
      end_time: new Date(),
      duration,
      cost: finalCost
    });

    setCurrentSession(null);
  }, [updateSessionStatus]);

  const processWalletPayment = useCallback(async (
    cost: number,
    currency: 'USD' | 'INR'
  ): Promise<boolean> => {
    if (!userProfile) return false;

    try {
      // Check if user has sufficient balance
      const currentBalance = userProfile.wallet_balance || 0;
      if (currentBalance < cost) {
        toast.error('Insufficient wallet balance');
        return false;
      }

      // Deduct amount from wallet
      const { error: walletError } = await supabase
        .from('users')
        .update({ wallet_balance: currentBalance - cost })
        .eq('id', userProfile.id);

      if (walletError) throw walletError;

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('user_transactions')
        .insert({
          user_id: userProfile.id,
          amount: -cost,
          currency,
          type: 'call_payment',
          description: `Payment for video call`,
          date: new Date().toISOString()
        });

      if (transactionError) throw transactionError;

      toast.success('Payment processed successfully');
      return true;
    } catch (error) {
      console.error('Error processing wallet payment:', error);
      toast.error('Failed to process payment');
      return false;
    }
  }, [userProfile]);

  return {
    currentSession,
    isCreatingSession,
    createCallSession,
    updateSessionStatus,
    endCallSession,
    processWalletPayment
  };
};
