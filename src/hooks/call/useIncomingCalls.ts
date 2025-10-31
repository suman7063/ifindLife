import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type IncomingCallRequest = {
  id: string;
  user_id: string;
  expert_id: string; // auth_id of expert
  call_type: 'audio' | 'video';
  status: 'pending' | 'accepted' | 'declined' | 'timeout' | 'cancelled';
  channel_name: string;
  expires_at: string;
  call_session_id?: string | null;
  user_metadata?: any;
};

export function useIncomingCalls(explicitExpertAuthId?: string) {
  const [incoming, setIncoming] = useState<IncomingCallRequest | null>(null);
  const expertAuthIdRef = useRef<string | null>(null);

  // Resolve current auth user id (expert auth_id)
  const resolveAuthId = useCallback(async () => {
    if (explicitExpertAuthId) {
      expertAuthIdRef.current = explicitExpertAuthId;
      return explicitExpertAuthId;
    }
    const { data } = await supabase.auth.getUser();
    const uid = data?.user?.id || null;
    expertAuthIdRef.current = uid;
    return uid;
  }, [explicitExpertAuthId]);

  // Accept call: mark accepted and return request
  const acceptCall = useCallback(async (request: IncomingCallRequest) => {
    try {
      const { error } = await supabase
        .from('incoming_call_requests')
        .update({ status: 'accepted', updated_at: new Date().toISOString() })
        .eq('id', request.id)
        .eq('expert_id', request.expert_id)
        .eq('status', 'pending');
      if (error) throw error;
      toast.success('Call accepted');
      return true;
    } catch (e) {
      console.error('Failed to accept call', e);
      toast.error('Failed to accept call');
      return false;
    }
  }, []);

  // Decline call
  const declineCall = useCallback(async (request: IncomingCallRequest) => {
    try {
      const { error } = await supabase
        .from('incoming_call_requests')
        .update({ status: 'declined', updated_at: new Date().toISOString() })
        .eq('id', request.id)
        .eq('expert_id', request.expert_id)
        .eq('status', 'pending');
      if (error) throw error;
      toast.message('Call declined');
      return true;
    } catch (e) {
      console.error('Failed to decline call', e);
      toast.error('Failed to decline call');
      return false;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    let channel1: ReturnType<typeof supabase.channel> | null = null;
    let channel2: ReturnType<typeof supabase.channel> | null = null;

    (async () => {
      const uid = await resolveAuthId();
      console.log('🔔 useIncomingCalls: Setting up subscription for expert:', uid);
      
      if (!uid || cancelled) {
        console.warn('🔔 useIncomingCalls: No expert auth_id, skipping subscription');
        return;
      }

      console.log('🔔 useIncomingCalls: Subscribing to incoming_call_requests for expert_id:', uid);

      channel1 = supabase
        .channel(`incoming-calls-${uid}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'incoming_call_requests',
          filter: `expert_id=eq.${uid}`
        }, (payload: any) => {
          console.log('🔔 useIncomingCalls: Received INSERT event:', payload);
          if (cancelled) return;
          const req = payload.new as IncomingCallRequest;
          console.log('🔔 useIncomingCalls: New call request:', req);
          
          // Ignore expired
          if (req.expires_at && Date.now() > new Date(req.expires_at).getTime()) {
            console.log('🔔 useIncomingCalls: Request expired, ignoring');
            return;
          }
          
          // Only show if status is pending
          if (req.status === 'pending') {
            console.log('🔔 useIncomingCalls: Setting incoming call request');
            setIncoming(req);
            toast(`Incoming ${req.call_type} call`, { description: 'User is ringing…', duration: 10000 });
          } else {
            console.log('🔔 useIncomingCalls: Request status is not pending:', req.status);
          }
        })
        .subscribe((status) => {
          console.log('🔔 useIncomingCalls: Subscription status:', status);
        });

      // Also listen to updates to clear when cancelled/timeout
      channel2 = supabase
        .channel(`incoming-calls-updates-${uid}`)
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'incoming_call_requests',
          filter: `expert_id=eq.${uid}`
        }, (payload: any) => {
          console.log('🔔 useIncomingCalls: Received UPDATE event:', payload);
          if (cancelled) return;
          const req = payload.new as IncomingCallRequest;
          // Clear incoming if status changed from pending
          setIncoming(prev => {
            if (prev && prev.id === req.id && req.status !== 'pending') {
              console.log('🔔 useIncomingCalls: Clearing incoming call (status changed)');
              return null;
            }
            return prev;
          });
        })
        .subscribe((status) => {
          console.log('🔔 useIncomingCalls: Update subscription status:', status);
        });
    })();

    return () => {
      console.log('🔔 useIncomingCalls: Cleaning up subscriptions');
      cancelled = true;
      if (channel1) {
        supabase.removeChannel(channel1);
        console.log('🔔 useIncomingCalls: Removed channel1');
      }
      if (channel2) {
        supabase.removeChannel(channel2);
        console.log('🔔 useIncomingCalls: Removed channel2');
      }
    };
  }, [resolveAuthId]);

  return { incoming, setIncoming, acceptCall, declineCall };
}


