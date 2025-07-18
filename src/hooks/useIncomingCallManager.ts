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
  acceptCall: (callId: string) => Promise<void>;
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

  // Fetch initial pending calls
  const fetchPendingCalls = useCallback(async () => {
    if (!expert?.id) return;

    try {
      const { data, error } = await supabase
        .from('incoming_call_requests')
        .select('*')
        .eq('expert_id', expert.id)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      console.log('📞 Fetched pending calls:', data);
      const typedData = (data || []) as IncomingCallRequest[];
      setPendingCalls(typedData);
      
      // Set the first pending call as current if we don't have one
      if (!currentCall && typedData.length > 0) {
        setCurrentCall(typedData[0]);
      }
    } catch (error) {
      console.error('❌ Error fetching pending calls:', error);
    }
  }, [expert?.id, currentCall]);

  // Accept incoming call
  const acceptCall = useCallback(async (callId: string) => {
    try {
      console.log('✅ Accepting call:', callId);
      
      const { error } = await supabase
        .from('incoming_call_requests')
        .update({ 
          status: 'accepted',
          updated_at: new Date().toISOString() 
        })
        .eq('id', callId);

      if (error) throw error;

      // Remove from pending calls
      setPendingCalls(prev => prev.filter(call => call.id !== callId));
      
      // Clear current call if it was the accepted one
      if (currentCall?.id === callId) {
        setCurrentCall(null);
      }

      toast.success('Call accepted successfully');
    } catch (error) {
      console.error('❌ Error accepting call:', error);
      toast.error('Failed to accept call');
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
    if (!expert?.id || isListening) return;

    console.log('🎧 Starting to listen for incoming calls...');
    
    // First fetch existing pending calls
    fetchPendingCalls();

    // Set up realtime subscription
    channelRef.current = supabase
      .channel('incoming-calls')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'incoming_call_requests',
          filter: `expert_id=eq.${expert.id}`
        },
        (payload) => {
          console.log('📞 New incoming call:', payload.new);
          const newCall = payload.new as IncomingCallRequest;
          
          // Add to pending calls
          setPendingCalls(prev => [...prev, newCall]);
          
          // Set as current call if none exists
          setCurrentCall(prev => prev || newCall);
          
          // Show notification
          toast.success(`Incoming ${newCall.call_type} call!`, {
            description: 'Click to view call details',
            duration: 10000
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'incoming_call_requests',
          filter: `expert_id=eq.${expert.id}`
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
      .subscribe();

    setIsListening(true);
  }, [expert?.id, isListening, fetchPendingCalls, currentCall]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (channelRef.current) {
      console.log('🔇 Stopping call listener...');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    setIsListening(false);
  }, []);

  // Auto-start listening when expert is available
  useEffect(() => {
    if (expert?.id) {
      startListening();
    }
    
    return () => {
      stopListening();
    };
  }, [expert?.id]);

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