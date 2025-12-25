import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Session {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  clientEmail?: string;
  type: 'video' | 'audio' | 'in-person';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  actualDuration?: number;
  notes: string;
  goals: string[];
  outcomes: string[];
  nextSteps: string[];
  rating?: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  amount: number;
  appointmentId?: string;
  channelName?: string;
  token?: string;
  appointmentDate?: string; // Store original appointment_date from database (YYYY-MM-DD format)
}

interface UseExpertSessionsOptions {
  expertId?: string;
  autoFetch?: boolean;
}

export const useExpertSessions = ({ expertId, autoFetch = true }: UseExpertSessionsOptions = {}) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const callSessionCacheRef = useRef<Map<string, { data: any; timestamp: number }>>(new Map());
  const CACHE_DURATION = 60000; // Cache call session data for 60 seconds (increased from 30)
  const fetchCallSessionQueueRef = useRef<Set<string>>(new Set()); // Track pending fetches to prevent duplicates

  // Cache for user profiles to prevent redundant API calls
  const userProfileCacheRef = useRef<Map<string, { data: any; timestamp: number }>>(new Map());
  const USER_PROFILE_CACHE_DURATION = 300000; // Cache for 5 minutes

  // Fetch user profile data for client information
  const fetchUserProfile = async (userId: string) => {
    // Check cache first
    const cached = userProfileCacheRef.current.get(userId);
    const now = Date.now();
    if (cached && (now - cached.timestamp) < USER_PROFILE_CACHE_DURATION) {
      return cached.data;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, profile_picture')
        .eq('id', userId)
        .maybeSingle(); // Use maybeSingle to handle no rows gracefully

      if (error) {
        // Handle 406 errors (RLS policy issue) gracefully
        if (error.code === '406' || error.message?.includes('406')) {
          console.warn('⚠️ RLS policy issue when fetching user profile (this may be expected):', error);
          // Return minimal data to allow session to continue
          return {
            id: userId,
            name: 'User',
            email: null,
            profile_picture: null
          };
        }
        // Handle PGRST116 (no rows) - this is expected when user doesn't exist
        if (error.code === 'PGRST116') {
          console.warn('⚠️ User profile not found:', userId);
          return {
            id: userId,
            name: 'User',
            email: null,
            profile_picture: null
          };
        }
        console.error('Error fetching user profile:', error);
        return {
          id: userId,
          name: 'User',
          email: null,
          profile_picture: null
        };
      }

      // If no data found, return minimal data
      const profileData = data || {
        id: userId,
        name: 'User',
        email: null,
        profile_picture: null
      };

      // Cache the result (cache duration is 5 minutes)
      const now = Date.now();
      userProfileCacheRef.current.set(userId, {
        data: profileData,
        timestamp: now
      });

      return profileData;
    } catch (err) {
      console.error('Error fetching user profile:', err);
      // Return minimal data on error to prevent breaking the session list
      const fallbackData = {
        id: userId,
        name: 'User',
        email: null,
        profile_picture: null
      };
      
      // Cache fallback data too
      const now = Date.now();
      userProfileCacheRef.current.set(userId, {
        data: fallbackData,
        timestamp: now
      });
      
      return fallbackData;
    }
  };

  // Helper function to find continuous sessions (same user, same date, consecutive times)
  const findContinuousSessions = (startSession: Session, allSessions: Session[]): Session[] => {
    const continuous: Session[] = [startSession];
    
    // Get all sessions for the same user on the same date, sorted by start time
    const sameUserDateSessions = allSessions
      .filter(s => 
        s.clientId === startSession.clientId &&
        s.appointmentDate === startSession.appointmentDate &&
        s.status === 'scheduled' &&
        s.id !== startSession.id
      )
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    
    // Find sessions that are continuous (end time of current = start time of next)
    let currentEndTime = startSession.endTime;
    
    for (const nextSession of sameUserDateSessions) {
      // Check if next session starts exactly when current ends (within 1 minute tolerance)
      const timeDiff = Math.abs(nextSession.startTime.getTime() - currentEndTime.getTime());
      if (timeDiff <= 60000) { // 1 minute tolerance
        continuous.push(nextSession);
        currentEndTime = nextSession.endTime;
      } else {
        // Not continuous, stop looking
        break;
      }
    }
    
    return continuous;
  };

  // Fetch ALL call sessions for appointments in ONE batch query (not per appointment)
  // This prevents 500+ API calls - fetches all at once
  const fetchAllCallSessions = useCallback(async (appointmentIds: string[]) => {
    if (!expertId || appointmentIds.length === 0) {
      return new Map<string, any>();
    }

    try {
      // Fetch all call sessions for these appointments in ONE query
      const { data: callSessions, error } = await supabase
        .from('call_sessions')
        .select('*')
        .eq('expert_id', expertId)
        .in('appointment_id', appointmentIds)
        .order('created_at', { ascending: false });

      if (error && error.code !== 'PGRST116') {
        if (error.code === '406' || error.message?.includes('406')) {
          console.warn('RLS policy issue when fetching call sessions:', error);
          return new Map<string, any>();
        }
        console.error('Error fetching call sessions:', error);
        return new Map<string, any>();
      }

      // Create a map: appointment_id -> most recent call session
      const callSessionMap = new Map<string, any>();
      const now = Date.now();

      if (callSessions) {
        // Group by appointment_id and get the most recent one for each
        const grouped = new Map<string, any>();
        callSessions.forEach(cs => {
          if (cs.appointment_id) {
            const existing = grouped.get(cs.appointment_id);
            if (!existing || new Date(cs.created_at) > new Date(existing.created_at)) {
              grouped.set(cs.appointment_id, cs);
            }
          }
        });

        // Store in cache and return map
        grouped.forEach((cs, appointmentId) => {
          callSessionMap.set(appointmentId, cs);
          callSessionCacheRef.current.set(appointmentId, {
            data: cs,
            timestamp: now
          });
        });
      }

      return callSessionMap;
    } catch (err) {
      console.error('Error fetching call sessions:', err);
      return new Map<string, any>();
    }
  }, [expertId]);

  // Fetch call session for a single appointment (uses cache from batch fetch)
  const fetchCallSession = useCallback(async (appointmentId: string) => {
    // Return cached data only - batch fetch will populate cache
    const cached = callSessionCacheRef.current.get(appointmentId);
    return cached?.data || null;
  }, [expertId]);

  // Store mapAppointmentToSession in ref to avoid dependency issues
  const mapAppointmentToSessionRef = useRef<((appointment: any) => Promise<Session>) | null>(null);

  // Map appointment to Session format
  const mapAppointmentToSession = useCallback(async (appointment: any): Promise<Session> => {
    // Fetch user profile for client information
    const userProfile = await fetchUserProfile(appointment.user_id);
    
    // Fetch call session if available (uses cache to prevent redundant calls)
    const callSession = await fetchCallSession(appointment.id);

    // Parse start and end times
    const appointmentDate = new Date(appointment.appointment_date);
    const startTime = appointment.start_time
      ? new Date(`${appointment.appointment_date}T${appointment.start_time}`)
      : appointmentDate;
    const endTime = appointment.end_time
      ? new Date(`${appointment.appointment_date}T${appointment.end_time}`)
      : new Date(startTime.getTime() + (appointment.duration || 60) * 60000);

    // Determine session type (default to video if channel_name exists)
    const type: 'video' | 'audio' | 'in-person' = 
      appointment.channel_name ? 'video' : 'audio';

    // Map status - appointments can have: 'scheduled', 'completed', 'cancelled', 'pending', 'confirmed'
    // Priority: appointment status > call session check (expert joined?) > past time check
    let status: Session['status'] = 'scheduled';
    const appointmentStatus = appointment.status?.toLowerCase();
    
    // Check if appointment end time has passed
    const now = new Date();
    const isPast = endTime < now;
    
    // Check if expert joined (call session exists with start_time)
    const expertJoined = callSession && callSession.start_time;
    
    // First check appointment status (highest priority)
    if (appointmentStatus === 'completed') {
      status = 'completed';
    } else if (appointmentStatus === 'cancelled') {
      status = 'cancelled';
    } 
    // If expert joined (call session exists), determine status based on call session
    else if (expertJoined) {
      // Expert joined - check call session status
      if (callSession.status === 'active') {
        // Check if call session is recent (within last 30 minutes) for in-progress
        const callSessionTime = new Date(callSession.created_at);
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        if (callSessionTime >= thirtyMinutesAgo) {
          status = 'in-progress';
        } else {
          // Stale active call session - if past appointment time, mark as completed
          status = isPast ? 'completed' : 'scheduled';
        }
      } else if (callSession.status === 'completed' || callSession.status === 'ended') {
        // Call session completed
        status = 'completed';
      } else {
        // Other call session status - if past, mark as completed
        status = isPast ? 'completed' : 'scheduled';
      }
    }
    // Expert didn't join - check if appointment time passed
    else if (isPast && (appointmentStatus === 'scheduled' || appointmentStatus === 'pending' || appointmentStatus === 'confirmed')) {
      // Appointment time passed and expert didn't join - mark as no-show
      status = 'no-show';
    }
    // Future appointment, no call session yet
    else if (appointmentStatus === 'pending' || appointmentStatus === 'confirmed') {
      status = 'scheduled';
    } else {
      status = 'scheduled'; // Default
    }

    // Calculate actual duration from call session
    let actualDuration: number | undefined;
    if (callSession?.start_time && callSession?.end_time) {
      const start = new Date(callSession.start_time);
      const end = new Date(callSession.end_time);
      actualDuration = Math.round((end.getTime() - start.getTime()) / 60000);
    } else if (callSession?.duration) {
      actualDuration = callSession.duration;
    }

    // Parse notes (could be JSON or plain text)
    let notes = appointment.notes || '';
    let goals: string[] = [];
    let outcomes: string[] = [];
    let nextSteps: string[] = [];

    try {
      if (notes) {
        const parsed = JSON.parse(notes);
        if (typeof parsed === 'object') {
          notes = parsed.notes || notes;
          goals = parsed.goals || [];
          outcomes = parsed.outcomes || [];
          nextSteps = parsed.nextSteps || [];
        }
      }
    } catch {
      // If parsing fails, use notes as-is
    }

    return {
      id: appointment.id,
      clientId: appointment.user_id,
      clientName: userProfile?.name || 'Unknown Client',
      clientAvatar: userProfile?.profile_picture || undefined,
      clientEmail: userProfile?.email || undefined,
      type,
      status,
      startTime,
      endTime,
      duration: appointment.duration || 60,
      actualDuration,
      notes,
      goals,
      outcomes,
      nextSteps,
      rating: callSession?.rating || undefined,
      paymentStatus: (appointment.payment_status as 'pending' | 'paid' | 'refunded') || 'pending',
      amount: 0, // TODO: Calculate from service or call session
      appointmentId: appointment.id,
      channelName: appointment.channel_name || callSession?.channel_name || undefined,
      token: appointment.token || callSession?.agora_token || undefined,
      appointmentDate: appointment.appointment_date, // Store original date string for accurate comparison
    };
  }, [fetchCallSession]);

  // Update ref when function changes
  useEffect(() => {
    mapAppointmentToSessionRef.current = mapAppointmentToSession;
  }, [mapAppointmentToSession]);

  // Prevent concurrent fetches
  const isFetchingRef = useRef(false);
  const lastFetchTimeRef = useRef<number>(0);
  const MIN_FETCH_INTERVAL = 10000; // Minimum 10 seconds between fetches (aggressive throttling)
  
  // Fetch sessions from Supabase
  const fetchSessions = useCallback(async () => {
    if (!expertId) {
      setSessions([]);
      return;
    }

    // Prevent concurrent fetches
    if (isFetchingRef.current) {
      console.log('⏸️ Fetch already in progress, skipping...');
      return;
    }

    // Aggressive throttling - don't allow more than once every 10 seconds
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTimeRef.current;
    if (timeSinceLastFetch < MIN_FETCH_INTERVAL) {
      console.log('⏸️ Throttling fetch - too soon since last one:', timeSinceLastFetch, 'ms');
      return;
    }

    try {
      isFetchingRef.current = true;
      lastFetchTimeRef.current = now;
      setLoading(true);
      setError(null);

      // Fetch appointments for this expert
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*')
        .eq('expert_id', expertId)
        .order('appointment_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (appointmentsError) {
        throw appointmentsError;
      }

      if (!appointments || appointments.length === 0) {
        setSessions([]);
        return;
      }

      // STEP 1: Fetch ALL call sessions in ONE batch query (not per appointment)
      // This replaces 50+ individual API calls with just 1 call
      const appointmentIds = appointments.map(apt => apt.id);
      const callSessionMap = await fetchAllCallSessions(appointmentIds);
      console.log(`✅ Fetched ${callSessionMap.size} call sessions in ONE query (instead of ${appointmentIds.length} separate calls)`);

      // STEP 2: Map appointments to sessions (now uses batch-fetched call session data)
      // No need for batching since we're not making API calls anymore
      const mappedSessions = await Promise.all(
        appointments.map(async (appointment) => {
          // Use the batch-fetched call session data (from ONE API call)
          const callSession = callSessionMap.get(appointment.id) || null;
          
          // Fetch user profile (cached, so no redundant calls)
          const userProfile = await fetchUserProfile(appointment.user_id);
          
          // Parse start and end times
          const appointmentDate = new Date(appointment.appointment_date);
          const startTime = appointment.start_time
            ? new Date(`${appointment.appointment_date}T${appointment.start_time}`)
            : appointmentDate;
          const endTime = appointment.end_time
            ? new Date(`${appointment.appointment_date}T${appointment.end_time}`)
            : new Date(startTime.getTime() + (appointment.duration || 60) * 60000);

          // Determine session type
          const type: 'video' | 'audio' | 'in-person' = 
            appointment.channel_name ? 'video' : 'audio';

          // Map status using call session data from batch fetch
          let status: Session['status'] = 'scheduled';
          const appointmentStatus = appointment.status?.toLowerCase();
          const now = new Date();
          const isPast = endTime < now;
          const expertJoined = callSession && callSession.start_time;

          // Status determination logic (same as before)
          if (appointmentStatus === 'completed') {
            status = 'completed';
          } else if (appointmentStatus === 'cancelled') {
            status = 'cancelled';
          } else if (expertJoined) {
            if (callSession.status === 'active') {
              const callSessionTime = new Date(callSession.created_at);
              const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
              status = callSessionTime >= thirtyMinutesAgo ? 'in-progress' : (isPast ? 'completed' : 'scheduled');
            } else if (callSession.status === 'completed' || callSession.status === 'ended') {
              status = 'completed';
            } else {
              status = isPast ? 'completed' : 'scheduled';
            }
          } else if (isPast && (appointmentStatus === 'scheduled' || appointmentStatus === 'pending' || appointmentStatus === 'confirmed')) {
            status = 'no-show';
          } else if (appointmentStatus === 'pending' || appointmentStatus === 'confirmed') {
            status = 'scheduled';
          }

          // Calculate actual duration
          let actualDuration: number | undefined;
          if (callSession?.start_time && callSession?.end_time) {
            const start = new Date(callSession.start_time);
            const end = new Date(callSession.end_time);
            actualDuration = Math.round((end.getTime() - start.getTime()) / 60000);
          } else if (callSession?.duration) {
            actualDuration = callSession.duration;
          }

          // Parse notes
          let notes = appointment.notes || '';
          let goals: string[] = [];
          let outcomes: string[] = [];
          let nextSteps: string[] = [];

          try {
            if (notes) {
              const parsed = JSON.parse(notes);
              if (typeof parsed === 'object') {
                notes = parsed.notes || notes;
                goals = parsed.goals || [];
                outcomes = parsed.outcomes || [];
                nextSteps = parsed.nextSteps || [];
              }
            }
          } catch {
            // If parsing fails, use notes as-is
          }

          return {
            id: appointment.id,
            clientId: appointment.user_id,
            clientName: userProfile?.name || 'Unknown Client',
            clientAvatar: userProfile?.profile_picture || undefined,
            clientEmail: userProfile?.email || undefined,
            type,
            status,
            startTime,
            endTime,
            duration: appointment.duration || 60,
            actualDuration,
            notes,
            goals,
            outcomes,
            nextSteps,
            rating: callSession?.rating || undefined,
            paymentStatus: (appointment.payment_status as 'pending' | 'paid' | 'refunded') || 'pending',
            amount: 0,
            appointmentId: appointment.id,
            channelName: appointment.channel_name || callSession?.channel_name || undefined,
            token: appointment.token || callSession?.agora_token || undefined,
            appointmentDate: appointment.appointment_date,
          };
        })
      );

      setSessions(mappedSessions);
    } catch (err: any) {
      console.error('Error fetching sessions:', err);
      setError(err.message || 'Failed to fetch sessions');
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [expertId]); // Removed mapAppointmentToSession to prevent infinite loops - use ref instead

  // Update session status
  const updateSessionStatus = async (
    sessionId: string,
    status: Session['status'],
    notes?: string
  ) => {
    try {
      setLoading(true);

      // Update appointment status - map Session status to appointment status
      let appointmentStatus: string;
      if (status === 'in-progress') {
        appointmentStatus = 'scheduled'; // Keep as scheduled in appointments table
      } else if (status === 'no-show') {
        appointmentStatus = 'cancelled'; // Map no-show to cancelled
      } else {
        appointmentStatus = status; // 'scheduled', 'completed', 'cancelled'
      }

      const updateData: any = {
        status: appointmentStatus,
      };

      if (notes !== undefined) {
        // Try to preserve existing structured notes
        const session = sessions.find(s => s.id === sessionId);
        if (session) {
          const existingNotes = {
            notes: notes,
            goals: session.goals || [],
            outcomes: session.outcomes || [],
            nextSteps: session.nextSteps || [],
          };
          updateData.notes = JSON.stringify(existingNotes);
        } else {
          updateData.notes = notes;
        }
      }

      const { error } = await supabase
        .from('appointments')
        .update(updateData)
        .eq('id', sessionId);

      if (error) {
        throw error;
      }

      // If starting a session, create/update call session
      if (status === 'in-progress') {
        const session = sessions.find(s => s.id === sessionId);
        if (session) {
          // Check if call session exists
          const { data: existingCallSession } = await supabase
            .from('call_sessions')
            .select('*')
            .eq('appointment_id', sessionId)
            .single();

          if (!existingCallSession) {
            // Find continuous appointments for the same user on the same date
            const continuousSessions = findContinuousSessions(session, sessions);
            const totalDuration = continuousSessions.reduce((sum, s) => sum + s.duration, 0);
            
            // Use the first session's ID as the primary appointment_id
            const primarySessionId = continuousSessions[0].id;
            const appointmentIds = continuousSessions.map(s => s.id);
            
            // Create new call session with combined duration
            const callSessionId = `call_${primarySessionId}_${Date.now()}`;
            const { data: newCallSession, error: insertError } = await supabase
              .from('call_sessions')
              .insert({
                id: callSessionId,
                expert_id: expertId!,
                user_id: session.clientId,
                appointment_id: primarySessionId, // Primary appointment ID
                channel_name: session.channelName || `channel_${primarySessionId}`,
                call_type: session.type === 'video' ? 'video' : 'audio',
                status: 'active',
                start_time: new Date().toISOString(),
                selected_duration: totalDuration, // Combined duration for continuous slots
                call_metadata: {
                  continuous_appointments: appointmentIds,
                  total_slots: continuousSessions.length,
                  is_continuous: continuousSessions.length > 1
                }
              })
              .select()
              .single();
            
            if (insertError) {
              console.error('Error creating call session:', insertError);
            } else if (newCallSession && continuousSessions.length > 1) {
              console.log(`✅ Created continuous call session for ${continuousSessions.length} slots (${totalDuration} minutes total)`);
            }
          } else {
            // Update existing call session
            await supabase
              .from('call_sessions')
              .update({
                status: 'active',
                start_time: new Date().toISOString(),
              })
              .eq('id', existingCallSession.id);
          }
        }
      }

      // If ending a session, update call session
      if (status === 'completed') {
        const { data: callSession } = await supabase
          .from('call_sessions')
          .select('*')
          .eq('appointment_id', sessionId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (callSession) {
          // If this is a continuous call session, mark all related appointments as completed
          const callMetadata = callSession.call_metadata as any;
          if (callMetadata?.continuous_appointments && Array.isArray(callMetadata.continuous_appointments)) {
            const continuousAppointmentIds = callMetadata.continuous_appointments;
            // Update all continuous appointments to completed
            await supabase
              .from('appointments')
              .update({ status: 'completed' })
              .in('id', continuousAppointmentIds);
            
            console.log(`✅ Marked ${continuousAppointmentIds.length} continuous appointments as completed`);
          }
          const startTime = callSession.start_time 
            ? new Date(callSession.start_time)
            : new Date();
          const endTime = new Date();
          const duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000);

          await supabase
            .from('call_sessions')
            .update({
              status: 'ended',
              end_time: endTime.toISOString(),
              duration,
            })
            .eq('id', callSession.id);
        }

        // Also update appointment status
        await supabase
          .from('appointments')
          .update({ status: 'completed' })
          .eq('id', sessionId);
      }

      // If cancelling a session, process refund
      if (status === 'cancelled') {
        try {
          // Get appointment details
          const { data: appointment } = await supabase
            .from('appointments')
            .select('id, user_id, expert_id')
            .eq('id', sessionId)
            .single();

          if (!appointment) {
            console.warn('⚠️ Appointment not found for refund processing');
          } else {
            // Check for call session payment
            const { data: callSession } = await supabase
              .from('call_sessions')
              .select('id, cost, user_id, currency, payment_status')
              .eq('appointment_id', sessionId)
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle();

            let refundAmount = 0;
            let currency = 'INR';
            let paymentReferenceId = sessionId;
            let paymentReferenceType = 'appointment';

            if (callSession && callSession.payment_status === 'paid' && callSession.cost) {
              // Payment was made via call session
              refundAmount = callSession.cost;
              currency = callSession.currency || 'INR';
              paymentReferenceId = callSession.id;
              paymentReferenceType = 'call_session';

              // Check if refund already processed
              const { data: existingRefunds } = await supabase
                .from('wallet_transactions')
                .select('id')
                .eq('reference_id', callSession.id)
                .eq('reference_type', 'call_session')
                .eq('type', 'credit')
                .in('reason', ['expert_no_show', 'refund']);

              if (existingRefunds && existingRefunds.length > 0) {
                console.log('✅ Refund already processed for call session');
              } else {
                // Process refund via call session edge function
                const { data: refundData, error: refundError } = await supabase.functions.invoke('process-call-refund', {
                  body: {
                    callSessionId: callSession.id,
                    duration: 0,
                    reason: 'refund',
                    refundFullAmount: true
                  }
                });

                if (refundError) {
                  console.error('❌ Error processing call session refund:', refundError);
                } else if (refundData?.success) {
                  console.log('✅ Refund processed successfully for cancelled call session');
                  toast.success('Refund has been processed and credited to user wallet.');
                }
              }
            } else {
              // Check wallet transactions for appointment payment
              const { data: paymentTransaction } = await supabase
                .from('wallet_transactions')
                .select('amount, currency')
                .eq('reference_id', sessionId)
                .eq('reference_type', 'appointment')
                .eq('type', 'debit')
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

              if (paymentTransaction?.amount) {
                refundAmount = paymentTransaction.amount;
                currency = paymentTransaction.currency || 'INR';

                // Check if refund already processed
                const { data: existingRefunds } = await supabase
                  .from('wallet_transactions')
                  .select('id')
                  .eq('reference_id', sessionId)
                  .eq('reference_type', 'appointment')
                  .eq('type', 'credit')
                  .in('reason', ['expert_no_show', 'refund']);

                if (existingRefunds && existingRefunds.length > 0) {
                  console.log('✅ Refund already processed for appointment');
                } else {
                  // Process refund via wallet-operations
                  const { data: refundResult, error: refundError } = await supabase.functions.invoke('wallet-operations', {
                    body: {
                      action: 'add_credits',
                      amount: refundAmount,
                      currency: currency,
                      reason: 'refund',
                      reference_id: sessionId,
                      reference_type: 'appointment',
                      description: `Session Cancelled - Full Refund`
                    }
                  });

                  if (refundError) {
                    console.error('❌ Error processing appointment refund:', refundError);
                  } else if (refundResult?.success) {
                    console.log('✅ Refund processed successfully for cancelled appointment');
                    toast.success(`Refund of ₹${refundAmount.toFixed(2)} has been credited to user wallet.`);
                  }
                }
              } else {
                console.log('ℹ️ No payment found to refund for cancelled appointment');
              }
            }
          }
        } catch (refundError) {
          console.error('❌ Error processing refund for cancelled session:', refundError);
          // Don't fail the cancellation if refund fails - just log it
        }
      }

      // Refresh sessions
      await fetchSessions();
      toast.success(`Session ${status} successfully`);
    } catch (err: any) {
      console.error('Error updating session status:', err);
      setError(err.message || 'Failed to update session');
      toast.error('Failed to update session');
    } finally {
      setLoading(false);
    }
  };

  // Update session notes
  const updateSessionNotes = async (
    sessionId: string,
    notes: string,
    goals?: string[],
    outcomes?: string[],
    nextSteps?: string[]
  ) => {
    try {
      setLoading(true);

      const notesData = {
        notes,
        goals: goals || [],
        outcomes: outcomes || [],
        nextSteps: nextSteps || [],
      };

      const { error } = await supabase
        .from('appointments')
        .update({ notes: JSON.stringify(notesData) })
        .eq('id', sessionId);

      if (error) {
        throw error;
      }

      await fetchSessions();
      toast.success('Session notes updated');
    } catch (err: any) {
      console.error('Error updating session notes:', err);
      setError(err.message || 'Failed to update notes');
      toast.error('Failed to update notes');
    } finally {
      setLoading(false);
    }
  };

  // Store fetchSessions in ref to avoid dependency issues
  const fetchSessionsRef = useRef(fetchSessions);
  useEffect(() => {
    fetchSessionsRef.current = fetchSessions;
  }, [fetchSessions]);

  // Set up real-time subscription - ONLY for INSERT events (new bookings)
  // UPDATE events disabled to prevent infinite calls
  useEffect(() => {
    if (!expertId || !autoFetch) return;

    // Initial fetch
    fetchSessionsRef.current();

    // Only listen to INSERT events (new bookings) - NOT UPDATE events
    // This prevents infinite calls while still showing new bookings
    let refetchTimeout: NodeJS.Timeout | null = null;
    let lastRefetchTime = 0;
    const MIN_REFETCH_INTERVAL = 5000; // Minimum 5 seconds between refetches
    
    const debouncedRefetch = () => {
      const now = Date.now();
      const timeSinceLastRefetch = now - lastRefetchTime;
      
      if (timeSinceLastRefetch < MIN_REFETCH_INTERVAL) {
        return;
      }
      
      if (refetchTimeout) {
        clearTimeout(refetchTimeout);
        refetchTimeout = null;
      }
      
      refetchTimeout = setTimeout(() => {
        const timeSinceLast = Date.now() - lastRefetchTime;
        if (timeSinceLast >= MIN_REFETCH_INTERVAL) {
          lastRefetchTime = Date.now();
          console.log('🔄 Real-time: Refreshing sessions after new booking');
          fetchSessionsRef.current();
        }
        refetchTimeout = null;
      }, 2000); // Wait 2 seconds before refetching
    };

    // ONLY listen to INSERT events (new bookings) - NOT UPDATE events
    const appointmentChannel = supabase
      .channel(`expert-appointments-insert-${expertId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT', // Only INSERT, not UPDATE
          schema: 'public',
          table: 'appointments',
          filter: `expert_id=eq.${expertId}`,
        },
        (payload) => {
          console.log('📥 New appointment created:', payload.new?.id);
          if (payload.new?.id) {
            callSessionCacheRef.current.delete(payload.new.id);
          }
          debouncedRefetch();
        }
      )
      .subscribe();

    return () => {
      if (refetchTimeout) {
        clearTimeout(refetchTimeout);
      }
      supabase.removeChannel(appointmentChannel);
    };
  }, [expertId, autoFetch]); // Only depend on expertId and autoFetch

  return {
    sessions,
    loading,
    error,
    fetchSessions,
    updateSessionStatus,
    updateSessionNotes,
  };
};

