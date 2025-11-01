import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { toast } from 'sonner';

export interface IncomingCallRequest {
  id: string;
  user_id: string;
  expert_id: string;
  call_type: 'audio' | 'video';
  status: 'pending' | 'accepted' | 'declined' | 'timeout' | 'cancelled';
  channel_name: string;
  agora_token: string | null;
  agora_uid: number | null;
  estimated_cost_usd: number | null;
  estimated_cost_inr: number | null;
  expires_at: string;
  created_at: string;
  updated_at: string;
  call_session_id: string | null;
  user_metadata: any;
}

export interface UseIncomingCallManagerReturn {
  currentCall: IncomingCallRequest | null;
  pendingCalls: IncomingCallRequest[];
  isListening: boolean;
  acceptCall: (callId: string) => Promise<boolean>;
  declineCall: (callId: string) => Promise<void>;
  startListening: () => void;
  stopListening: () => void;
}

export const useIncomingCallManager = (): UseIncomingCallManagerReturn => {
  const { expert } = useSimpleAuth();
  const [currentCall, setCurrentCall] = useState<IncomingCallRequest | null>(null);
  const [pendingCalls, setPendingCalls] = useState<IncomingCallRequest[]>([]);
  const [isListening, setIsListening] = useState(false);
  const channelRef = useRef<any>(null);

  // Simplified: No fetching of existing pending calls - only handle NEW calls via real-time
  // This ensures clean state and modal only shows for fresh incoming calls
  const fetchPendingCalls = useCallback(async () => {
    // Skip fetching - we only want to show notifications for NEW calls, not existing ones
    console.log('📞 Skipping pending calls fetch - only showing NEW incoming calls');
  }, []);

  // Accept incoming call
  const acceptCall = useCallback(async (callId: string) => {
    try {
      console.log('✅ Accepting call:', callId);
      
      // Use the full acceptCall service which handles session update and user notification
      const { acceptCall: acceptCallService } = await import('@/services/callService');
      const success = await acceptCallService(callId);
      
      if (!success) {
        throw new Error('Failed to accept call');
      }

      // Remove from pending calls
      setPendingCalls(prev => prev.filter(call => call.id !== callId));
      
      // Clear current call if it was the accepted one
      if (currentCall?.id === callId) {
        setCurrentCall(null);
      }

      console.log('✅ Call accepted - user will be notified and call session updated');
      toast.success('Call accepted - connecting...');
      return true;
    } catch (error) {
      console.error('❌ Error accepting call:', error);
      toast.error('Failed to accept call');
      return false;
    }
  }, [currentCall]);

  // Decline incoming call
  const declineCall = useCallback(async (callId: string) => {
    try {
      console.log('❌ Declining call:', callId);
      
      const { error } = await supabase
        .from('incoming_call_requests')
        .update({ 
          status: 'declined',
          updated_at: new Date().toISOString() 
        })
        .eq('id', callId);

      if (error) throw error;

      // Remove from pending calls
      setPendingCalls(prev => prev.filter(call => call.id !== callId));
      
      // Clear current call if it was the declined one
      if (currentCall?.id === callId) {
        setCurrentCall(null);
      }

      toast.success('Call declined');
    } catch (error) {
      console.error('❌ Error declining call:', error);
      toast.error('Failed to decline call');
    }
  }, [currentCall]);

  // Start listening for real-time call requests
  const startListening = useCallback(() => {
    // IMPORTANT: expert_id in incoming_call_requests references expert_accounts(auth_id)
    const expertAuthId = expert?.auth_id || expert?.id;
    if (!expertAuthId || isListening) {
      if (!expertAuthId) {
        console.warn('⚠️ useIncomingCallManager: Cannot start listening - no expert auth_id');
      }
      return;
    }

    // Clean up any existing channel first
    if (channelRef.current) {
      console.log('🧹 Cleaning up existing channel before creating new one');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    console.log('🎧 Starting to listen for incoming calls with expert auth_id:', expertAuthId);
    console.log('🎧 Expert object:', { 
      expertId: expert?.id, 
      expertAuthId: expert?.auth_id,
      expertName: expert?.name 
    });
    
    // First fetch existing pending calls
    fetchPendingCalls();

    // Set up realtime subscription - use auth_id for expert_id filter
    // Use a unique channel name to avoid conflicts
    const channelName = `incoming-calls-${expertAuthId}-${Date.now()}`;
    console.log('🔔 Setting up real-time subscription for expert auth_id:', expertAuthId);
    console.log('🔔 Filter will be: expert_id=eq.' + expertAuthId);
    console.log('🔔 Channel name:', channelName);
    
    channelRef.current = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'incoming_call_requests',
          filter: `expert_id=eq.${expertAuthId}` // Must match auth_id, not expert_accounts.id
        },
        (payload) => {
          console.log('📞 New incoming call received via real-time:', payload);
          console.log('📞 Payload data:', JSON.stringify(payload.new, null, 2));
          const newCall = payload.new as IncomingCallRequest;
          
          // Check if already expired
          if (newCall.expires_at && new Date(newCall.expires_at) < new Date()) {
            console.log('⚠️ Received expired call request, ignoring');
            return;
          }
          
          // Only process pending calls
          if (newCall.status !== 'pending') {
            console.log('⚠️ Received non-pending call request, ignoring:', newCall.status);
            return;
          }
          
          console.log('✅ Processing new pending call request:', newCall.id);
          
          // Add to pending calls (avoid duplicates)
          setPendingCalls(prev => {
            if (prev.some(call => call.id === newCall.id)) {
              console.log('⚠️ Call already in pending list, skipping duplicate');
              return prev;
            }
            console.log('✅ Adding call to pending list');
            return [...prev, newCall];
          });
          
          // ALWAYS set as current call for NEW incoming calls (triggers the modal)
          // This ensures the modal appears even if there was a previous call
          console.log('✅ Setting new call as current call (this will show modal):', newCall.id);
          setCurrentCall(newCall);
          
          // Simple toast notification
          const userName = newCall.user_metadata?.name || 'A user';
          toast(`Incoming ${newCall.call_type} call from ${userName}`, {
            duration: 5000
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'incoming_call_requests',
          filter: `expert_id=eq.${expertAuthId}` // Use auth_id, not expert_accounts.id
        },
        (payload) => {
          console.log('📞 Call status updated:', payload.new);
          const updatedCall = payload.new as IncomingCallRequest;
          
          // Update pending calls
          setPendingCalls(prev => 
            prev.map(call => call.id === updatedCall.id ? updatedCall : call)
              .filter(call => call.status === 'pending')
          );
          
          // Update current call
          if (currentCall?.id === updatedCall.id) {
            if (updatedCall.status !== 'pending') {
              setCurrentCall(null);
            } else {
              setCurrentCall(updatedCall);
            }
          }
        }
      )
      .subscribe((status, err) => {
        console.log('🔔 Real-time subscription status:', status);
        if (err) {
          console.error('❌ Subscription error:', err);
        }
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to incoming call requests');
          console.log('✅ Listening for calls where expert_id =', expertAuthId);
          
          console.log('✅ Channel name: incoming-calls-' + expertAuthId);
          console.log('✅ Filter: expert_id=eq.' + expertAuthId);
          console.log('✅ Real-time subscription is ACTIVE - will show modal for NEW calls');
          
          // Test query to verify we can see calls with this expert_id
          supabase
            .from('incoming_call_requests')
            .select('id, expert_id, status, created_at')
            .eq('expert_id', expertAuthId)
            .eq('status', 'pending')
            .limit(5)
            .then(({ data, error }) => {
              if (error) {
                console.error('❌ Test query error:', error);
              } else {
                console.log('✅ Test query successful - Found', data?.length || 0, 'pending calls for this expert');
                if (data && data.length > 0) {
                  console.log('📋 Existing pending calls:', data);
                  console.log('⚠️ Note: These existing calls will NOT auto-show modal (only NEW calls will)');
                } else {
                  console.log('✅ No existing pending calls - waiting for new incoming calls...');
                }
              }
            });
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Channel subscription error');
        } else if (status === 'TIMED_OUT') {
          console.warn('⚠️ Channel subscription timed out');
        } else if (status === 'CLOSED') {
          console.warn('⚠️ Channel subscription closed');
        }
      });

    setIsListening(true);
  }, [expert?.auth_id, expert?.id, isListening, fetchPendingCalls, currentCall]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (channelRef.current) {
      console.log('🔇 Stopping call listener...');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    setIsListening(false);
  }, []);

  // Cleanup on unmount (removed auto-start to allow presence-based control)
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  // Cleanup expired calls
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setPendingCalls(prev => prev.filter(call => new Date(call.expires_at) > now));
      
      if (currentCall && new Date(currentCall.expires_at) <= now) {
        setCurrentCall(null);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [currentCall]);

  return {
    currentCall,
    pendingCalls,
    isListening,
    acceptCall,
    declineCall,
    startListening,
    stopListening
  };
};