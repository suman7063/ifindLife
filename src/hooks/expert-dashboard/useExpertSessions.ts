import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { setCallSessionCacheBatch } from '@/hooks/useExpertNoShowWarning';

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
      console.log('⏭️ Skipping call_sessions fetch - no appointment IDs');
      return new Map<string, any>();
    }

    // Check cache first - if all appointment IDs are in cache, return cached data
    const cachedMap = new Map<string, any>();
    const uncachedIds: string[] = [];
    const now = Date.now();
    
    appointmentIds.forEach(id => {
      const cached = callSessionCacheRef.current.get(id);
      if (cached && (now - cached.timestamp) < CACHE_DURATION) {
        cachedMap.set(id, cached.data);
      } else {
        uncachedIds.push(id);
      }
    });

    // If all are cached, return cached data
    if (uncachedIds.length === 0) {
      console.log('✅ All call sessions found in cache, skipping API call');
      return cachedMap;
    }

    console.log(`📞 Fetching call_sessions for ${uncachedIds.length} uncached appointments (${cachedMap.size} from cache)`);

    try {
      // Fetch all call sessions for uncached appointments in ONE query
      const { data: callSessions, error } = await supabase
        .from('call_sessions')
        .select('*')
        .eq('expert_id', expertId)
        .in('appointment_id', uncachedIds)
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
      // Start with cached data
      const callSessionMap = new Map(cachedMap);
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

        // Store in cache and add to map
        grouped.forEach((cs, appointmentId) => {
          callSessionMap.set(appointmentId, cs);
          callSessionCacheRef.current.set(appointmentId, {
            data: cs,
            timestamp: now
          });
        });
      }

      console.log(`✅ Call sessions map ready: ${callSessionMap.size} total (${cachedMap.size} from cache, ${callSessionMap.size - cachedMap.size} fetched)`);
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
    // Priority: appointment status > refund check > call session check (expert joined?) > past time check
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
          // Stale active call session - keep as scheduled, don't auto-complete
          // IMPORTANT: Don't auto-complete sessions just because time passed
          // Only mark as completed if explicitly set in database
          status = 'scheduled';
        }
      } else if (callSession.status === 'completed' || callSession.status === 'ended') {
        // Call session completed
        status = 'completed';
      } else {
        // Other call session status - keep as scheduled, don't auto-complete
        // IMPORTANT: Don't auto-complete sessions just because time passed
        // Only mark as completed if explicitly set in database
        status = 'scheduled';
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
    
    // IMPORTANT: Override status to 'cancelled' if refund was processed (even if status is 'in-progress')
    // This ensures refunded sessions show as cancelled, not in-progress
    if (status === 'in-progress' || (callSession && callSession.status === 'active')) {
      // Quick check for refund - only if status would be in-progress
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(appointment.id);
      
      let hasRefund = false;
      if (isUUID) {
        const { data: refunds } = await supabase
          .from('wallet_transactions')
          .select('id')
          .eq('reference_id', appointment.id)
          .eq('reference_type', 'appointment')
          .eq('type', 'credit')
          .in('reason', ['expert_no_show', 'refund'])
          .limit(1);
        hasRefund = (refunds && refunds.length > 0) || false;
      } else {
        const { data: refunds } = await supabase
          .from('wallet_transactions')
          .select('id')
          .eq('metadata->>reference_id', appointment.id)
          .eq('reference_type', 'appointment')
          .eq('type', 'credit')
          .in('reason', ['expert_no_show', 'refund'])
          .limit(1);
        hasRefund = (refunds && refunds.length > 0) || false;
      }
      
      // Also check call session refunds
      if (!hasRefund && callSession) {
        const callSessionIsUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(callSession.id);
        if (callSessionIsUUID) {
          const { data: callRefunds } = await supabase
            .from('wallet_transactions')
            .select('id')
            .eq('reference_id', callSession.id)
            .eq('reference_type', 'call_session')
            .eq('type', 'credit')
            .in('reason', ['expert_no_show', 'refund'])
            .limit(1);
          hasRefund = (callRefunds && callRefunds.length > 0) || false;
        } else {
          const { data: callRefunds } = await supabase
            .from('wallet_transactions')
            .select('id')
            .eq('metadata->>reference_id', callSession.id)
            .eq('reference_type', 'call_session')
            .eq('type', 'credit')
            .in('reason', ['expert_no_show', 'refund'])
            .limit(1);
          hasRefund = (callRefunds && callRefunds.length > 0) || false;
        }
      }
      
      if (hasRefund) {
        console.log('🔄 Refund detected for appointment, overriding status to cancelled:', appointment.id);
        status = 'cancelled';
      }
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
      // IMPORTANT: Include call_session status to detect if call was disconnected
      // This helps differentiate between "first time scheduled" vs "disconnected and available"
      callSessionStatus: callSession?.status || undefined,
      // Include call session duration to check if expert attended
      callSessionDuration: callSession?.duration || undefined
    } as Session & { callSessionStatus?: string; callSessionDuration?: number };
  }, [fetchCallSession]);

  // Update ref when function changes
  useEffect(() => {
    mapAppointmentToSessionRef.current = mapAppointmentToSession;
  }, [mapAppointmentToSession]);

  // Prevent concurrent fetches
  const isFetchingRef = useRef(false);
  const lastFetchTimeRef = useRef<Map<string, number>>(new Map()); // Track last fetch time per tab
  const MIN_FETCH_INTERVAL = 2000; // Minimum 2 seconds between fetches for same tab
  
  // Fetch sessions from Supabase
  const fetchSessions = useCallback(async (tabFilter?: 'today' | 'upcoming' | 'cancelled' | 'history') => {
    if (!expertId) {
      setSessions([]);
      return;
    }

    // Prevent concurrent fetches
    if (isFetchingRef.current) {
      console.log('⏸️ Fetch already in progress, skipping');
      return;
    }

    // Throttling per tab - allow fetch if it's a different tab or enough time has passed
    const tabKey = tabFilter || 'all';
    const now = Date.now();
    const lastFetchTime = lastFetchTimeRef.current.get(tabKey) || 0;
    const timeSinceLastFetch = now - lastFetchTime;
    
    if (timeSinceLastFetch < MIN_FETCH_INTERVAL && lastFetchTime > 0) {
      console.log(`⏸️ Throttled: Only ${Math.round(timeSinceLastFetch/1000)}s since last fetch for tab: ${tabKey}`);
      return;
    }
    
    console.log(`📡 Fetching sessions for tab: ${tabKey || 'all'}`);

    try {
      isFetchingRef.current = true;
      lastFetchTimeRef.current.set(tabKey, now); // Update last fetch time for this tab
      setLoading(true);
      setError(null);

      // Build query based on tab filter
      let query = supabase
        .from('appointments')
        .select('*')
        .eq('expert_id', expertId);

      // Apply tab-specific filters
      if (tabFilter === 'today') {
        // Today's sessions: get today's date (YYYY-MM-DD format)
        // Note: appointment_date is stored in YYYY-MM-DD format in database
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const todayStr = `${year}-${month}-${day}`;
        console.log('📅 Today filter:', todayStr);
        query = query.eq('appointment_date', todayStr);
      } else if (tabFilter === 'upcoming') {
        // Upcoming: future dates, scheduled status
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const todayStr = `${year}-${month}-${day}`;
        console.log('📅 Upcoming filter:', todayStr);
        query = query
          .gt('appointment_date', todayStr)
          .in('status', ['scheduled', 'pending', 'confirmed']);
      } else if (tabFilter === 'cancelled') {
        // Cancelled: cancelled status (no-show is determined client-side based on time)
        console.log('📅 Cancelled filter');
        query = query.eq('status', 'cancelled');
      } else if (tabFilter === 'history') {
        // History: fetch ALL appointments (no date or status filter)
        // Client-side will filter to show only past sessions
        // This ensures we get all past sessions regardless of status (completed, cancelled, no-show, etc.)
        console.log('📅 History filter - fetching ALL appointments (no filters) for client-side filtering');
        // Don't filter by status or date - fetch everything, client-side will filter past sessions
        // No additional filters needed - query already has .eq('expert_id', expertId)
      } else {
        console.log('📅 No filter - fetching all');
      }
      // If no filter, fetch all (for backward compatibility)

      console.log('🔍 Executing query for tab:', tabFilter);
      const { data: appointments, error: appointmentsError } = await query
        .order('appointment_date', { ascending: false }) // Most recent first for history
        .order('start_time', { ascending: false });
      
      console.log('📊 Query result:', { 
        count: appointments?.length || 0, 
        error: appointmentsError?.message,
        tabFilter,
        sampleDates: appointments?.slice(0, 5).map(a => a.appointment_date) || []
      });

      if (appointmentsError) {
        throw appointmentsError;
      }

      if (!appointments || appointments.length === 0) {
        console.log('📭 No appointments found for tab:', tabFilter);
        setSessions([]);
        setLoading(false);
        isFetchingRef.current = false;
        return;
      }

      console.log(`📊 Found ${appointments.length} appointments for tab: ${tabFilter}`);

      // STEP 1: Fetch ALL call sessions in ONE batch query (only if we have appointments)
      // This replaces 50+ individual API calls with just 1 call
      const appointmentIds = appointments.map(apt => apt.id);
      console.log(`📞 Fetching call sessions for ${appointmentIds.length} appointments`);
      const callSessionMap = await fetchAllCallSessions(appointmentIds);
      
      // Populate shared cache for useExpertNoShowWarning hook
      // This prevents individual API calls when checking if expert joined
      setCallSessionCacheBatch(callSessionMap);

      // STEP 2: Fetch ALL user profiles in ONE batch query (only if we have appointments)
      // Collect unique user IDs
      const uniqueUserIds = [...new Set(appointments.map(apt => apt.user_id).filter(Boolean))];
      
      // Check cache first for user profiles
      const cachedUserProfiles = new Map<string, any>();
      const uncachedUserIds: string[] = [];
      const userProfileNow = Date.now();
      
      uniqueUserIds.forEach(userId => {
        const cached = userProfileCacheRef.current.get(userId);
        if (cached && (userProfileNow - cached.timestamp) < USER_PROFILE_CACHE_DURATION) {
          cachedUserProfiles.set(userId, cached.data);
        } else {
          uncachedUserIds.push(userId);
        }
      });

      console.log(`👥 User profiles: ${cachedUserProfiles.size} from cache, ${uncachedUserIds.length} need fetching`);
      
      // Start with cached profiles
      const userProfileMap = new Map(cachedUserProfiles);
      
      // Batch fetch only uncached user profiles
      if (uncachedUserIds.length > 0) {
        try {
          const { data: userProfiles, error: userError } = await supabase
            .from('users')
            .select('id, name, email, profile_picture')
            .in('id', uncachedUserIds);

          if (!userError && userProfiles) {
            console.log(`✅ Fetched ${userProfiles.length} user profiles from API`);
            // Create map for quick lookup
            userProfiles.forEach(profile => {
              if (profile?.id) {
                userProfileMap.set(profile.id, profile);
                // Also update cache
                userProfileCacheRef.current.set(profile.id, {
                  data: profile,
                  timestamp: userProfileNow
                });
              }
            });
          } else if (userError) {
            console.error('❌ Error fetching user profiles:', userError);
          }
        } catch (err) {
          console.error('❌ Error batch fetching user profiles:', err);
        }
      } else {
        console.log('✅ All user profiles found in cache, skipping API call');
      }

      // STEP 3: Map appointments to sessions (now uses batch-fetched data)
      console.log(`🔄 Mapping ${appointments.length} appointments to sessions...`);
      const mappedSessions = await Promise.all(
        appointments.map(async (appointment) => {
          try {
            // Use the batch-fetched call session data (from ONE API call)
            const callSession = callSessionMap.get(appointment.id) || null;
            
            // Get user profile from batch-fetched map (or cache if not in batch)
            let userProfile = userProfileMap.get(appointment.user_id);
            if (!userProfile) {
              // Fallback to cache or fetch if not in batch
              userProfile = await fetchUserProfile(appointment.user_id);
            }
            
            // Parse start and end times
            const appointmentDate = new Date(appointment.appointment_date);
            const startTime = appointment.start_time
              ? new Date(`${appointment.appointment_date}T${appointment.start_time}`)
              : appointmentDate;
            const endTime = appointment.end_time
              ? new Date(`${appointment.appointment_date}T${appointment.end_time}`)
              : new Date(startTime.getTime() + (appointment.duration || 60) * 60000);
            
            // Log for debugging
            const now = new Date();
            const isPast = endTime < now;
            if (tabFilter === 'history') {
              console.log(`📅 Mapping appointment:`, {
                id: appointment.id,
                date: appointment.appointment_date,
                startTime: appointment.start_time,
                endTime: appointment.end_time,
                parsedEndTime: endTime.toISOString(),
                currentTime: now.toISOString(),
                isPast,
                status: appointment.status
              });
            }

            // Determine session type
            const type: 'video' | 'audio' | 'in-person' = 
              appointment.channel_name ? 'video' : 'audio';

            // Map status using call session data from batch fetch
            let status: Session['status'] = 'scheduled';
            const appointmentStatus = appointment.status?.toLowerCase();
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
                // IMPORTANT: Don't auto-complete sessions just because time passed
                // Only mark as in-progress if recently started, otherwise keep as scheduled
                status = callSessionTime >= thirtyMinutesAgo ? 'in-progress' : 'scheduled';
              } else if (callSession.status === 'completed' || callSession.status === 'ended') {
                status = 'completed';
              } else {
                // IMPORTANT: Don't auto-complete sessions just because time passed
                // Only mark as completed if explicitly set in database
                status = 'scheduled';
              }
            } else if (isPast && (appointmentStatus === 'scheduled' || appointmentStatus === 'pending' || appointmentStatus === 'confirmed')) {
              status = 'no-show';
            } else if (appointmentStatus === 'pending' || appointmentStatus === 'confirmed') {
              status = 'scheduled';
            }
            
            // IMPORTANT: Override status to 'cancelled' if refund was processed
            // Check refund only if status would be in-progress to avoid unnecessary queries
            if (status === 'in-progress' || (callSession && callSession.status === 'active')) {
              const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(appointment.id);
              
              let hasRefund = false;
              if (isUUID) {
                const { data: refunds } = await supabase
                  .from('wallet_transactions')
                  .select('id')
                  .eq('reference_id', appointment.id)
                  .eq('reference_type', 'appointment')
                  .eq('type', 'credit')
                  .in('reason', ['expert_no_show', 'refund'])
                  .limit(1);
                hasRefund = (refunds && refunds.length > 0) || false;
              } else {
                const { data: refunds } = await supabase
                  .from('wallet_transactions')
                  .select('id')
                  .eq('metadata->>reference_id', appointment.id)
                  .eq('reference_type', 'appointment')
                  .eq('type', 'credit')
                  .in('reason', ['expert_no_show', 'refund'])
                  .limit(1);
                hasRefund = (refunds && refunds.length > 0) || false;
              }
              
              // Also check call session refunds
              if (!hasRefund && callSession) {
                const callSessionIsUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(callSession.id);
                if (callSessionIsUUID) {
                  const { data: callRefunds } = await supabase
                    .from('wallet_transactions')
                    .select('id')
                    .eq('reference_id', callSession.id)
                    .eq('reference_type', 'call_session')
                    .eq('type', 'credit')
                    .in('reason', ['expert_no_show', 'refund'])
                    .limit(1);
                  hasRefund = (callRefunds && callRefunds.length > 0) || false;
                } else {
                  const { data: callRefunds } = await supabase
                    .from('wallet_transactions')
                    .select('id')
                    .eq('metadata->>reference_id', callSession.id)
                    .eq('reference_type', 'call_session')
                    .eq('type', 'credit')
                    .in('reason', ['expert_no_show', 'refund'])
                    .limit(1);
                  hasRefund = (callRefunds && callRefunds.length > 0) || false;
                }
              }
              
              if (hasRefund) {
                console.log('🔄 Refund detected in batch fetch, overriding status to cancelled:', appointment.id);
                status = 'cancelled';
              }
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
              // IMPORTANT: Include call_session status and duration for history filter
              callSessionStatus: callSession?.status || undefined,
              callSessionDuration: callSession?.duration || actualDuration || undefined
            } as Session & { callSessionStatus?: string; callSessionDuration?: number };
          } catch (error) {
            console.error(`❌ Error mapping appointment ${appointment.id} to session:`, error);
            // Return a minimal session object to prevent filtering out
            return {
              id: appointment.id,
              clientId: appointment.user_id,
              clientName: 'Unknown Client',
              type: 'audio' as const,
              status: 'scheduled' as const,
              startTime: new Date(appointment.appointment_date),
              endTime: new Date(appointment.appointment_date),
              duration: appointment.duration || 60,
              notes: '',
              goals: [],
              outcomes: [],
              nextSteps: [],
              paymentStatus: 'pending' as const,
              amount: 0,
              appointmentId: appointment.id,
              appointmentDate: appointment.appointment_date,
              callSessionStatus: undefined,
              callSessionDuration: undefined
            } as Session & { callSessionStatus?: string; callSessionDuration?: number };
          }
        })
      );

      console.log(`✅ Mapped ${mappedSessions.length} sessions from ${appointments.length} appointments`);
      if (tabFilter === 'history') {
        const now = new Date();
        const pastSessions = mappedSessions.filter(s => s.endTime < now);
        console.log('📚 History check - Past sessions:', {
          totalMapped: mappedSessions.length,
          pastSessions: pastSessions.length,
          samplePast: pastSessions.slice(0, 5).map(s => ({
            id: s.id,
            endTime: s.endTime.toISOString(),
            status: s.status
          }))
        });
      }
      
      setSessions(mappedSessions);
      console.log('✅ Sessions fetched successfully:', { count: mappedSessions.length, tabFilter });
    } catch (err: any) {
      console.error('❌ Error fetching sessions:', err);
      setError(err.message || 'Failed to fetch sessions');
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
      console.log('🏁 Fetch completed, isFetching reset to false');
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

          // Check and complete referral if this is a referred user's first call
          // Credits will be awarded after delay (48 hours for production)
          if (callSession.user_id) {
            try {
              const { checkAndCompleteReferral } = await import('@/utils/referralCompletion');
              await checkAndCompleteReferral(
                callSession.user_id,
                callSession.id,
                endTime.toISOString() // Pass call end time for delayed reward calculation
              );
            } catch (referralError) {
              // Silently handle referral errors - they're non-critical
              console.warn('⚠️ Failed to check referral completion:', referralError);
            }
          }
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
          // Get appointment details and check current status
          const { data: appointment } = await supabase
            .from('appointments')
            .select('id, user_id, expert_id, status')
            .eq('id', sessionId)
            .single();

          if (!appointment) {
            console.warn('⚠️ Appointment not found for refund processing');
          } else {
            // Process refund regardless of current status (might have been cancelled elsewhere)
            // Check if refund already processed first
            // Check for call session payment
            const { data: callSession } = await supabase
              .from('call_sessions')
              .select('id, cost, user_id, currency, payment_status, status')
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
              // Validate UUID before querying
              const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(callSession.id);
              
              let existingRefunds: any[] = [];
              if (isUUID) {
                // Query by reference_id if it's a valid UUID
                const { data } = await supabase
                  .from('wallet_transactions')
                  .select('id')
                  .eq('reference_id', callSession.id)
                  .eq('reference_type', 'call_session')
                  .eq('type', 'credit')
                  .in('reason', ['expert_no_show', 'refund']);
                existingRefunds = data || [];
              } else {
                // Query by metadata if it's not a UUID
                const { data } = await supabase
                  .from('wallet_transactions')
                  .select('id')
                  .eq('metadata->>reference_id', callSession.id)
                  .eq('reference_type', 'call_session')
                  .eq('type', 'credit')
                  .in('reason', ['expert_no_show', 'refund']);
                existingRefunds = data || [];
              }

              if (existingRefunds && existingRefunds.length > 0) {
                // Refund already processed - but check if status needs to be updated
                console.log('ℹ️ Refund already processed, checking if status needs update');
                
                // Check if call session is still active but refund was processed
                if (callSession && (callSession.status === 'active' || callSession.status === 'pending')) {
                  // Update call session status to ended
                  await supabase
                    .from('call_sessions')
                    .update({ 
                      status: 'ended',
                      end_time: new Date().toISOString()
                    })
                    .eq('id', callSession.id);
                  
                  // Update appointment status to cancelled
                  await supabase
                    .from('appointments')
                    .update({ status: 'cancelled' })
                    .eq('id', sessionId)
                    .neq('status', 'cancelled');
                  
                  console.log('✅ Updated session status to ended/cancelled after refund check');
                }
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
                  console.error('Error processing call session refund:', refundError);
                } else if (refundData?.success) {
                  toast.success('Refund has been processed and credited to user wallet.');
                  // Status will be updated by the edge function
                }
              }
            } else {
              // Check wallet transactions for appointment payment
              // Try multiple ways to find the payment:
              // 1. Direct reference_id match
              // 2. Check metadata->>reference_id
              // 3. Check metadata->>appointment_ids array
              
              let paymentTransaction: { amount: number; currency: string } | null = null;
              
              // Query 1: Check reference_id column
              const { data: paymentByRefId } = await supabase
                .from('wallet_transactions')
                .select('amount, currency, metadata')
                .eq('reference_id', sessionId)
                .eq('reference_type', 'appointment')
                .eq('type', 'debit')
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

              // Query 2: Check metadata->>reference_id
              const { data: paymentByMetadata } = await supabase
                .from('wallet_transactions')
                .select('amount, currency, metadata')
                .eq('metadata->>reference_id', sessionId)
                .eq('reference_type', 'appointment')
                .eq('type', 'debit')
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

              // Query 3: Check if appointment is in metadata->>appointment_ids array
              const { data: allAppointmentPayments } = await supabase
                .from('wallet_transactions')
                .select('amount, currency, metadata')
                .eq('reference_type', 'appointment')
                .eq('type', 'debit')
                .order('created_at', { ascending: false });

              // Find payment where this appointment ID is in metadata->appointment_ids array
              const paymentInArray = allAppointmentPayments?.find(transaction => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const metadata = (transaction.metadata as any) || {};
                const appointmentIds = metadata.appointment_ids || [];
                return Array.isArray(appointmentIds) && appointmentIds.includes(sessionId);
              });

              // Use the first found payment
              paymentTransaction = paymentByRefId || paymentByMetadata || paymentInArray || null;

              if (paymentTransaction?.amount) {
                refundAmount = paymentTransaction.amount;
                currency = paymentTransaction.currency || 'INR';

                // Check if refund already processed (check all possible reference locations)
                const { data: existingRefundsByRefId } = await supabase
                  .from('wallet_transactions')
                  .select('id')
                  .eq('reference_id', sessionId)
                  .eq('reference_type', 'appointment')
                  .eq('type', 'credit')
                  .in('reason', ['expert_no_show', 'refund']);

                const { data: existingRefundsByMetadata } = await supabase
                  .from('wallet_transactions')
                  .select('id')
                  .eq('metadata->>reference_id', sessionId)
                  .eq('reference_type', 'appointment')
                  .eq('type', 'credit')
                  .in('reason', ['expert_no_show', 'refund']);

                const { data: allRefunds } = await supabase
                  .from('wallet_transactions')
                  .select('id, metadata')
                  .eq('reference_type', 'appointment')
                  .eq('type', 'credit')
                  .in('reason', ['expert_no_show', 'refund']);

                const refundInArray = allRefunds?.find(refund => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const metadata = (refund.metadata as any) || {};
                  const appointmentIds = metadata.appointment_ids || [];
                  return Array.isArray(appointmentIds) && appointmentIds.includes(sessionId);
                });

                const existingRefunds = [
                  ...(existingRefundsByRefId || []),
                  ...(existingRefundsByMetadata || []),
                  ...(refundInArray ? [refundInArray] : [])
                ];

                if (existingRefunds.length > 0) {
                  // Refund already processed
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
                    toast.error(`Failed to process refund: ${refundError.message || 'Unknown error'}`);
                  } else if (refundResult?.success) {
                    toast.success(`Refund of ₹${refundAmount.toFixed(2)} has been credited to user wallet.`);
                  } else {
                    console.error('❌ Refund failed - wallet-operations returned:', refundResult);
                    toast.error('Failed to process refund. Please contact support.');
                  }
                }
              } else {
                // Only show warning if payment was expected but not found
                // If no call session exists, payment might not have been made yet (normal)
                if (callSession && callSession.payment_status === 'paid' && !callSession.cost) {
                  console.warn('Call session marked as paid but no cost found');
                }
                // Don't show warning if no payment was made (normal for appointments cancelled before payment)
              }
            }
          }
        } catch (refundError) {
          console.error('❌ Error processing refund for cancelled session:', refundError);
          const errorMsg = refundError instanceof Error ? refundError.message : 'Unknown error';
          toast.error(`Session cancelled, but refund failed: ${errorMsg}. Please contact support.`);
          // Don't fail the cancellation if refund fails - but show error to user
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

  // Process refund for cancelled session (manual trigger)
  const processRefundForCancelledSession = async (sessionId: string): Promise<boolean> => {
    try {
      
      // Get appointment details
      const { data: appointment } = await supabase
        .from('appointments')
        .select('id, user_id, expert_id, status')
        .eq('id', sessionId)
        .single();

      if (!appointment) {
        console.error('❌ Appointment not found:', sessionId);
        toast.error('Appointment not found');
        return false;
      }

      if (appointment.status !== 'cancelled') {
        console.warn('⚠️ Appointment is not cancelled:', appointment.status);
        toast.warning('This appointment is not cancelled. Refund only applies to cancelled appointments.');
        return false;
      }

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
        // Validate UUID before querying
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(callSession.id);
        
        let existingRefunds: any[] = [];
        if (isUUID) {
          // Query by reference_id if it's a valid UUID
          const { data } = await supabase
            .from('wallet_transactions')
            .select('id')
            .eq('reference_id', callSession.id)
            .eq('reference_type', 'call_session')
            .eq('type', 'credit')
            .in('reason', ['expert_no_show', 'refund']);
          existingRefunds = data || [];
        } else {
          // Query by metadata if it's not a UUID
          const { data } = await supabase
            .from('wallet_transactions')
            .select('id')
            .eq('metadata->>reference_id', callSession.id)
            .eq('reference_type', 'call_session')
            .eq('type', 'credit')
            .in('reason', ['expert_no_show', 'refund']);
          existingRefunds = data || [];
        }

          if (existingRefunds && existingRefunds.length > 0) {
            toast.info('Refund has already been processed for this session');
            return true;
          }

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
          console.error('Error processing call session refund:', refundError);
          toast.error(`Failed to process refund: ${refundError.message || 'Unknown error'}`);
          return false;
        } else if (refundData?.success) {
          toast.success('Refund has been processed and credited to user wallet.');
          return true;
        } else {
          console.error('❌ Refund failed - process-call-refund returned:', refundData);
          toast.error('Failed to process refund. Please contact support.');
          return false;
        }
      } else {
        // Check wallet transactions for appointment payment (same logic as updateSessionStatus)
        let paymentTransaction: { amount: number; currency: string } | null = null;
        
        const { data: paymentByRefId } = await supabase
          .from('wallet_transactions')
          .select('amount, currency, metadata')
          .eq('reference_id', sessionId)
          .eq('reference_type', 'appointment')
          .eq('type', 'debit')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        const { data: paymentByMetadata } = await supabase
          .from('wallet_transactions')
          .select('amount, currency, metadata')
          .eq('metadata->>reference_id', sessionId)
          .eq('reference_type', 'appointment')
          .eq('type', 'debit')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        const { data: allAppointmentPayments } = await supabase
          .from('wallet_transactions')
          .select('amount, currency, metadata')
          .eq('reference_type', 'appointment')
          .eq('type', 'debit')
          .order('created_at', { ascending: false });

        const paymentInArray = allAppointmentPayments?.find(transaction => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const metadata = (transaction.metadata as any) || {};
          const appointmentIds = metadata.appointment_ids || [];
          return Array.isArray(appointmentIds) && appointmentIds.includes(sessionId);
        });

        paymentTransaction = paymentByRefId || paymentByMetadata || paymentInArray || null;

        if (paymentTransaction?.amount) {
          refundAmount = paymentTransaction.amount;
          currency = paymentTransaction.currency || 'INR';

          // Check if refund already processed
          const { data: existingRefundsByRefId } = await supabase
            .from('wallet_transactions')
            .select('id')
            .eq('reference_id', sessionId)
            .eq('reference_type', 'appointment')
            .eq('type', 'credit')
            .in('reason', ['expert_no_show', 'refund']);

          const { data: existingRefundsByMetadata } = await supabase
            .from('wallet_transactions')
            .select('id')
            .eq('metadata->>reference_id', sessionId)
            .eq('reference_type', 'appointment')
            .eq('type', 'credit')
            .in('reason', ['expert_no_show', 'refund']);

          const { data: allRefunds } = await supabase
            .from('wallet_transactions')
            .select('id, metadata')
            .eq('reference_type', 'appointment')
            .eq('type', 'credit')
            .in('reason', ['expert_no_show', 'refund']);

          const refundInArray = allRefunds?.find(refund => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const metadata = (refund.metadata as any) || {};
            const appointmentIds = metadata.appointment_ids || [];
            return Array.isArray(appointmentIds) && appointmentIds.includes(sessionId);
          });

          const existingRefunds = [
            ...(existingRefundsByRefId || []),
            ...(existingRefundsByMetadata || []),
            ...(refundInArray ? [refundInArray] : [])
          ];

          if (existingRefunds.length > 0) {
            toast.info('Refund has already been processed for this session');
            return true;
          }

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
            toast.error(`Failed to process refund: ${refundError.message || 'Unknown error'}`);
            return false;
          } else if (refundResult?.success) {
            toast.success(`Refund of ₹${refundAmount.toFixed(2)} has been credited to user wallet.`);
            return true;
          } else {
            console.error('❌ Refund failed - wallet-operations returned:', refundResult);
            toast.error('Failed to process refund. Please contact support.');
            return false;
          }
          } else {
            toast.warning('No payment found for this appointment. Refund may not be applicable.');
            return false;
          }
      }
    } catch (error) {
      console.error('❌ Error processing refund for cancelled session:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to process refund: ${errorMsg}`);
      return false;
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
    processRefundForCancelledSession,
  };
};

