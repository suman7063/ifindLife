
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { 
  Video, 
  Phone, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  FileText, 
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  Square,
  Loader2
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useExpertSessions, type Session } from '@/hooks/expert-dashboard/useExpertSessions';
import { useExpertNoShowWarning } from '@/hooks/useExpertNoShowWarning';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import ExpertInCallModal from '@/components/expert-dashboard/call/ExpertInCallModal';

// Helper function to extract first valid UUID from combined ID
const extractAppointmentId = (sessionId: string | undefined, appointmentId: string | undefined, isCombined: boolean): string => {
  // If session has appointmentId and isCombined, use appointmentId
  if (isCombined && appointmentId) {
    // Check if appointmentId is still a combined ID (starts with 'combined_')
    if (appointmentId.startsWith('combined_')) {
      // Extract first UUID from combined ID
      const uuidPattern = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;
      const match = appointmentId.match(uuidPattern);
      if (match && match[1]) {
        console.log('🔍 Extracted UUID from combined appointmentId:', match[1], 'from:', appointmentId);
        return match[1];
      }
    }
    // Validate UUID format
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(appointmentId);
    if (isUUID) {
      return appointmentId;
    }
  }
  
  // If sessionId is provided, check if it's a combined ID
  if (sessionId) {
    if (sessionId.startsWith('combined_')) {
      // Extract first UUID from combined ID
      const uuidPattern = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;
      const match = sessionId.match(uuidPattern);
      if (match && match[1]) {
        console.log('🔍 Extracted UUID from combined sessionId:', match[1], 'from:', sessionId);
        return match[1];
      }
    }
    // Validate UUID format
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionId);
    if (isUUID) {
      return sessionId;
    }
  }
  
  // Fallback: return the provided ID (will cause error but at least we tried)
  console.warn('⚠️ Could not extract valid UUID from:', { sessionId, appointmentId, isCombined });
  return appointmentId || sessionId || '';
};

const SessionManager: React.FC = () => {
  const { expert } = useSimpleAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [sessionTimer, setSessionTimer] = useState({ isRunning: false, elapsed: 0 });
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState('');
  const [goalsText, setGoalsText] = useState('');
  const [outcomesText, setOutcomesText] = useState('');
  const [nextStepsText, setNextStepsText] = useState('');
  const [expertTimezone, setExpertTimezone] = useState<string>('UTC');
  const isStartingSessionRef = useRef(false); // Prevent multiple simultaneous startSession calls
  const [activeTab, setActiveTab] = useState<string>('today');
  const [showCallTypeModal, setShowCallTypeModal] = useState(false);
  const [sessionToStart, setSessionToStart] = useState<Session | null>(null);
  const [selectedCallType, setSelectedCallType] = useState<'audio' | 'video'>('video');
  const [activeCallRequest, setActiveCallRequest] = useState<{
    id: string;
    user_id: string;
    call_type: 'audio' | 'video';
    channel_name: string;
    agora_token: string | null;
    agora_uid: number | null;
    user_metadata: {
      name?: string;
      avatar?: string;
    };
    call_session_id?: string | null;
  } | null>(null);

  // Use the expert sessions hook - disable autoFetch, we'll fetch on tab click
  const {
    sessions,
    loading,
    error,
    fetchSessions,
    updateSessionStatus,
    updateSessionNotes,
    processRefundForCancelledSession,
  } = useExpertSessions({
    expertId: expert?.auth_id,
    autoFetch: false, // Disable auto-fetch, fetch only on tab click
  });

  // Fetch today's sessions on initial load (default tab)
  useEffect(() => {
    if (expert?.auth_id && activeTab === 'today') {
      console.log('🔄 Initial load - Fetching today sessions', { expertId: expert.auth_id });
      fetchSessions('today');
    }
  }, [expert?.auth_id]); // Only depend on expertId to trigger once when expert is available

  // Fetch expert timezone
  useEffect(() => {
    const fetchExpertTimezone = async () => {
      if (!expert?.auth_id) return;
      
      try {
        const { data, error } = await supabase
          .from('expert_availabilities')
          .select('timezone')
          .eq('expert_id', expert.auth_id)
          .limit(1);
        
        if (!error && data && data.length > 0 && data[0]?.timezone) {
          const timezone = data[0].timezone;
          setExpertTimezone(timezone);
        } else {
          setExpertTimezone('UTC');
        }
      } catch (err) {
        console.error('Error fetching expert timezone:', err);
        setExpertTimezone('UTC'); // Fallback to UTC
      }
    };
    
    fetchExpertTimezone();
  }, [expert?.auth_id]);

  // Update notes text when selected session changes
  useEffect(() => {
    if (selectedSession) {
      setNotesText(selectedSession.notes || '');
      setGoalsText(selectedSession.goals?.join(', ') || '');
      setOutcomesText(selectedSession.outcomes?.join(', ') || '');
      setNextStepsText(selectedSession.nextSteps?.join(', ') || '');
    }
  }, [selectedSession]);

  // Helper function to get today's date in expert's timezone (YYYY-MM-DD format)
  const getTodayDateStringInTimezone = (timezone: string): string => {
    try {
      // Get current date/time in expert's timezone
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      // en-CA format gives YYYY-MM-DD
      return formatter.format(now);
    } catch (error) {
      console.error('Error formatting date in timezone:', error);
      // Fallback to local timezone
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  };

  // Get today's date in expert's timezone (memoized)
  const todayDateString = useMemo(() => {
    return getTodayDateStringInTimezone(expertTimezone);
  }, [expertTimezone]);

  // Helper function to group continuous sessions together
  const groupContinuousSessions = useCallback((sessionsList: Session[]): Session[] => {
    if (sessionsList.length === 0) return [];
    
    // TEMPORARY: Disable grouping for debugging - set to false to enable grouping
    const ENABLE_GROUPING = true;
    if (!ENABLE_GROUPING) {
      console.log('⚠️ Grouping is disabled for debugging');
      return sessionsList;
    }
    
    // Sort by start time
    const sorted = [...sessionsList].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    const grouped: Session[] = [];
    const processed = new Set<string>();
    
    console.log('🔍 Grouping sessions:', sorted.length, 'sessions');
    sorted.forEach((s, idx) => {
      console.log(`  [${idx}] ${s.id}: ${s.startTime.toLocaleTimeString()} - ${s.endTime.toLocaleTimeString()} (${s.clientName}, ${s.status})`);
    });
    
    for (let i = 0; i < sorted.length; i++) {
      const session = sorted[i];
      if (processed.has(session.id)) continue;
      
      // Find all continuous sessions for this session
      const continuous = [session];
      processed.add(session.id);
      
      let currentEndTime = session.endTime;
      let currentIndex = i;
      
      // Look for consecutive sessions - only check sessions that come AFTER current one
      while (currentIndex < sorted.length - 1) {
        let foundNext = false;
        
        // Look for the IMMEDIATE next session that starts exactly when current ends
        // We need to find the first unprocessed session that matches our criteria
        for (let j = currentIndex + 1; j < sorted.length; j++) {
          const otherSession = sorted[j];
          
          // Skip if already processed
          if (processed.has(otherSession.id)) continue;
          
          // Must match: same user, same date
          // IMPORTANT: Don't check status - group all statuses together for slot count consistency
          // Status filtering happens after grouping
          if (otherSession.clientId !== session.clientId) {
            // Different user - stop looking (sessions are sorted, so no more matches)
            break;
          }
          if (otherSession.appointmentDate !== session.appointmentDate) {
            // Different date - stop looking
            break;
          }
          // Removed status check - group all statuses together for accurate slot count
          
          // Check if next session starts exactly when current ends (within 5 seconds tolerance)
          // IMPORTANT: next session should start >= current end time (not before)
          const timeDiff = otherSession.startTime.getTime() - currentEndTime.getTime();
          const timeDiffSeconds = timeDiff / 1000;
          
          console.log(`  🔗 Checking continuity:`, {
            current: `${currentEndTime.toLocaleTimeString()} (${session.id})`,
            next: `${otherSession.startTime.toLocaleTimeString()} (${otherSession.id})`,
            timeDiff: `${timeDiffSeconds.toFixed(1)}s`,
            isContinuous: timeDiff >= -5000 && timeDiff <= 5000
          });
          
          // Only group if next session starts within 5 seconds of current end time
          // (very strict tolerance - only truly consecutive sessions)
          if (timeDiff >= -5000 && timeDiff <= 5000) { // -5s to +5s tolerance
            // Found a continuous session!
            console.log(`  ✅ Grouping: ${session.id} + ${otherSession.id}`);
            continuous.push(otherSession);
            processed.add(otherSession.id);
            currentEndTime = otherSession.endTime;
            currentIndex = j;
            foundNext = true;
            break; // Found the next continuous session, break and continue from there
          } else if (timeDiff > 5000) {
            // There's a gap - this session starts more than 5 seconds after current ends
            console.log(`  ❌ Gap detected: ${timeDiffSeconds.toFixed(1)}s gap, stopping`);
            // Since sessions are sorted, no later session can be continuous either
            break;
          } else {
            // timeDiff < -5000 means next session starts before current ends
            // This shouldn't happen if sorted correctly, but skip it anyway
            console.log(`  ⚠️ Next session starts before current ends, skipping`);
            continue;
          }
        }
        
        // If no next continuous session found, stop looking
        if (!foundNext) break;
      }
      
      // If multiple continuous sessions, create a combined session
      if (continuous.length > 1) {
        const firstSession = continuous[0];
        const lastSession = continuous[continuous.length - 1];
        const totalDuration = continuous.reduce((sum, s) => sum + s.duration, 0);
        
        console.log(`  📦 Creating combined session: ${continuous.length} slots`, {
          first: `${firstSession.startTime.toLocaleTimeString()} - ${firstSession.endTime.toLocaleTimeString()}`,
          last: `${lastSession.startTime.toLocaleTimeString()} - ${lastSession.endTime.toLocaleTimeString()}`,
          combined: `${firstSession.startTime.toLocaleTimeString()} - ${lastSession.endTime.toLocaleTimeString()}`,
          totalDuration: `${totalDuration}min`,
          ids: continuous.map(s => s.id)
        });
        
        // Create combined session
        const combinedSession: Session = {
          ...firstSession,
          id: `combined_${continuous.map(s => s.id).join('_')}`, // Combined ID
          endTime: lastSession.endTime, // Use last session's end time
          duration: totalDuration, // Total combined duration
          // Store original session IDs for reference
          appointmentId: firstSession.id, // Primary appointment ID
        };
        
        // Store continuous session IDs in a custom property
        (combinedSession as any).continuousSessionIds = continuous.map(s => s.id);
        (combinedSession as any).isCombined = true;
        (combinedSession as any).slotCount = continuous.length;
        
        grouped.push(combinedSession);
      } else {
        // Single session, add as-is
        console.log(`  ➡️ Single session (not grouped): ${session.id}`);
        grouped.push(session);
      }
    }
    
    console.log('✅ Grouping complete:', {
      input: sorted.length,
      output: grouped.length,
      grouped: grouped.filter(g => (g as any).isCombined).length
    });
    
    return grouped;
  }, []);
  
  // IMPORTANT: Group sessions FIRST, then filter
  // This ensures slot count is consistent regardless of status filtering
  const groupedSessions = useMemo(() => {
    return groupContinuousSessions(sessions);
  }, [sessions, groupContinuousSessions]);
  
  // Filter sessions by comparing appointment_date directly (memoized)
  // appointment_date is already stored as YYYY-MM-DD in expert's timezone context
  const todaySessions = useMemo(() => {
    const filtered = groupedSessions.filter(session => {
      // First check if session is today
      let isToday = false;
      
      if (session.appointmentDate) {
        // Normalize appointment date - remove time component and trim
        let sessionDate = String(session.appointmentDate).trim();
        // Remove time component if present (format: YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)
        if (sessionDate.includes('T')) {
          sessionDate = sessionDate.split('T')[0];
        }
        // Remove any trailing timezone info
        if (sessionDate.includes(' ')) {
          sessionDate = sessionDate.split(' ')[0];
        }
        
        // Normalize today's date string
        let todayDate = String(todayDateString).trim();
        
        // Compare normalized dates
        isToday = sessionDate === todayDate;
        
        // Debug logging
        console.log('🔍 Today check:', {
          sessionId: session.id,
          rawAppointmentDate: session.appointmentDate,
          normalizedSessionDate: sessionDate,
          todayDateString,
          normalizedTodayDate: todayDate,
          isToday,
          status: session.status,
          startTime: session.startTime.toISOString()
        });
      } else {
        // Fallback: compare using startTime converted to expert's timezone
        try {
          const formatter = new Intl.DateTimeFormat('en-CA', {
            timeZone: expertTimezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          });
          const sessionDateInTimezone = formatter.format(session.startTime);
          isToday = sessionDateInTimezone === todayDateString;
          
          console.log('🔍 Today check (fallback):', {
            sessionId: session.id,
            sessionDateInTimezone,
            todayDateString,
            isToday,
            startTime: session.startTime.toISOString()
          });
        } catch (error) {
          console.error('Error in date comparison:', error);
          // If timezone conversion fails, use simple date comparison
          const sessionDate = new Date(session.startTime);
          const today = new Date();
          isToday = sessionDate.getFullYear() === today.getFullYear() &&
                   sessionDate.getMonth() === today.getMonth() &&
                   sessionDate.getDate() === today.getDate();
        }
      }
      
      // Session must be today
      // IMPORTANT: Exclude cancelled/completed sessions if time hasn't passed yet
      // If session is cancelled/completed but time is still in future, don't show in Today tab
      if (!isToday) {
        return false;
      }
      
      // IMPORTANT: Show all sessions for today, including cancelled/completed
      // This allows expert to see all sessions scheduled for today
      // The UI will handle showing/hiding Start button based on status
      
      console.log('✅ Session is today:', {
        sessionId: session.id,
        status: session.status,
        shouldInclude: true
      });
      
      return true;
    })
    // Sort by start time (chronologically)
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    
    // Debug logging
    console.log('📊 Today sessions summary:', {
      totalSessions: sessions.length,
      groupedSessions: groupedSessions.length,
      todayDateString,
      expertTimezone,
      todaySessionsCount: filtered.length,
      todaySessionIds: filtered.map(s => s.id)
    });
    
    return filtered;
  }, [groupedSessions, todayDateString, expertTimezone]);

  const upcomingSessions = useMemo(() => {
    const now = new Date();
    const filtered = groupedSessions.filter(session => {
      // First check if session is today - if it is, exclude it from upcoming
      let isToday = false;
      
      if (session.appointmentDate) {
        // Direct string comparison - appointment_date is already in expert's timezone context
        isToday = session.appointmentDate === todayDateString;
      } else {
        // Fallback: use date comparison with timezone
        try {
          const formatter = new Intl.DateTimeFormat('en-CA', {
            timeZone: expertTimezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          });
          const sessionDateInTimezone = formatter.format(session.startTime);
          isToday = sessionDateInTimezone === todayDateString;
        } catch {
          const sessionDate = new Date(session.startTime);
          const today = new Date();
          isToday = sessionDate.getFullYear() === today.getFullYear() &&
                    sessionDate.getMonth() === today.getMonth() &&
                    sessionDate.getDate() === today.getDate();
        }
      }
      
      // If session is today, it should NOT be in upcoming (it should be in todaySessions)
      if (isToday) {
        return false;
      }
      
      // For upcoming: session must be in the future and scheduled
      return session.startTime > now && session.status === 'scheduled';
    })
    // Sort by start time (chronologically)
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    
    return filtered;
  }, [groupedSessions, todayDateString, expertTimezone]);

  // Cancelled sessions are now shown in Today tab, so no separate filter needed

  const historySessions = useMemo(() => {
    const now = new Date();
    const filtered = groupedSessions.filter(session => {
      // Include in history if:
      // 1. Status is 'completed'
      // 2. OR session end time has passed AND call session exists with status 'ended' or 'completed'
      // 3. OR session end time has passed AND appointment status is 'completed'
      // 4. OR session end time has passed AND call session has duration > 0 (expert attended)
      
      if (session.status === 'completed') {
        return true;
      }
      
      // Check if session time has passed
      const isPast = session.endTime < now;
      
      if (!isPast) {
        return false; // Future sessions shouldn't be in history
      }
      
      // Check if there's a call session that ended
      const callSessionStatus = (session as any).callSessionStatus;
      if (callSessionStatus === 'ended' || callSessionStatus === 'completed') {
        return true;
      }
      
      // Check if call session has duration (expert attended)
      const callSessionDuration = (session as any).callSessionDuration;
      if (callSessionDuration && callSessionDuration > 0) {
        return true;
      }
      
      // If session is past and status is not 'scheduled', include it
      // This catches cancelled, no-show, in-progress (if past), and other past sessions
      if (session.status !== 'scheduled') {
        return true;
      }
      
      return false;
    })
    // Sort by start time (most recent first)
    .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
    
    console.log('📚 History sessions:', {
      total: filtered.length,
      byStatus: filtered.reduce((acc, s) => {
        acc[s.status] = (acc[s.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    });
    
    return filtered;
  }, [groupedSessions]);

  const getStatusColor = (status: string, session?: Session) => {
    // If cancelled or scheduled but time is still available, use blue color (like scheduled)
    // This handles cases where call was disconnected but time slot is still available
    if ((status === 'cancelled' || status === 'scheduled') && session) {
      const now = new Date();
      if ((now >= session.startTime && now < session.endTime) || now < session.startTime) {
        return 'bg-blue-100 text-blue-800'; // Show as available/scheduled
      }
    }
    
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800'; // Changed to purple for better distinction
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no-show':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format status text for display (no-show -> cancelled)
  // Logic:
  // 1. First time (no call_session exists) → "scheduled"
  // 2. After disconnect (call_session exists with status 'ended') → "Available" (if time is still available)
  // 3. Otherwise → show status as-is
  const formatStatusText = (status: string, session?: Session) => {
    if (status === 'no-show') {
      return 'cancelled';
    }
    
    // Check if time slot is still available
    if (session) {
      const now = new Date();
      const isTimeAvailable = (now >= session.startTime && now < session.endTime) || now < session.startTime;
      
      // Check if call_session exists and was disconnected (status 'ended')
      // This indicates the call was started but then disconnected
      const hasDisconnectedCall = (session as any).callSessionStatus === 'ended' || 
                                  (session as any).callSessionStatus === 'completed';
      
      // If call was disconnected and time is still available, show "Available"
      if (hasDisconnectedCall && isTimeAvailable && (status === 'scheduled' || status === 'cancelled')) {
        return 'Available';
      }
      
      // If no call_session exists (first time) and time is available, show "scheduled" (not "Available")
      // Only show "Available" if call was disconnected
      if (!hasDisconnectedCall && status === 'scheduled' && isTimeAvailable) {
        return 'scheduled'; // First time - show "scheduled"
      }
    }
    
    return status;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'audio':
        return <Phone className="h-4 w-4" />;
      case 'in-person':
        return <User className="h-4 w-4" />;
      default:
        return <Video className="h-4 w-4" />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const startSession = async (session: Session, callType?: 'audio' | 'video') => {
    // Prevent multiple simultaneous calls
    if (isStartingSessionRef.current) {
      return;
    }

    try {
      isStartingSessionRef.current = true;
      
      // Use provided callType or default to session.type
      const actualCallType = callType || (session.type === 'video' ? 'video' : 'audio');
      
      // For combined sessions, use the primary appointmentId for database operations
      // The combined ID is not a valid UUID and will cause database query errors
      const actualSessionId = extractAppointmentId(
        session.id,
        (session as any).appointmentId,
        !!(session as any).isCombined
      );
      
      // Don't mark as in-progress yet - just prepare the session
      // Status will be updated to in-progress when user actually joins
      
      // Generate channel name and tokens if they don't exist
      let channelName = session.channelName;
      let token = session.token;
      
      if (!channelName) {
        // Generate unique channel name
        const timestamp = Date.now();
        const shortExpertId = expert?.auth_id?.replace(/-/g, '').substring(0, 8) || 'expert';
        const shortUserId = session.clientId.replace(/-/g, '').substring(0, 8);
        channelName = `session_${shortExpertId}_${shortUserId}_${timestamp}`;
      }
      
      // ALWAYS generate fresh token when expert starts session
      // This ensures token is valid and matches current channel name and UID
      const expertUid = Math.floor(Math.random() * 1000000);
      
      console.log('🔄 Generating fresh Agora token for expert session start...', {
        channelName,
        uid: expertUid,
        role: 1,
        expireTime: (session.duration + 5) * 60
      });
      
      try {
        // Always generate fresh token for expert
        const { data: tokenData, error: tokenError } = await supabase.functions.invoke('smooth-action', {
          body: {
            channelName,
            uid: expertUid,
            role: 1, // Publisher role
            expireTime: (session.duration + 5) * 60 // Token expires after session duration + 5 min buffer
          }
        });
        
        if (tokenError) {
          console.error('❌ Failed to generate Agora token:', tokenError);
          toast.error(`Failed to generate call token: ${tokenError.message || 'Unknown error'}`);
          return;
        }
        
        if (!tokenData?.token) {
          console.error('❌ Token generation returned no token');
          toast.error('Failed to generate call token: No token received');
          return;
        }
        
        token = tokenData.token;
        console.log('✅ Fresh Agora token generated for expert:', {
          uid: expertUid,
          channelName,
          tokenLength: token.length,
          tokenPreview: token.substring(0, 30) + '...'
        });
      } catch (tokenErr) {
        console.error('❌ Error generating token:', tokenErr);
        const errorMsg = tokenErr instanceof Error ? tokenErr.message : 'Unknown error';
        toast.error(`Failed to generate call token: ${errorMsg}`);
        return;
      }
      
      // IMPORTANT: If session is cancelled but time is still available, reactivate it
      // Update status from 'cancelled' to 'scheduled' before starting
      if (session.status === 'cancelled') {
        console.log('🔄 Reactivating cancelled session:', actualSessionId);
        
        // For combined sessions, update ALL appointments in the group
        if ((session as any).isCombined && (session as any).continuousSessionIds) {
          const appointmentIds = (session as any).continuousSessionIds;
          const { error: statusUpdateError } = await supabase
            .from('appointments')
            .update({ status: 'scheduled' })
            .in('id', appointmentIds)
            .eq('status', 'cancelled'); // Only update if currently cancelled
          
          if (statusUpdateError) {
            console.error('Error reactivating combined appointments:', statusUpdateError);
            toast.error(`Failed to reactivate session: ${statusUpdateError.message}`);
            return;
          }
        } else {
          // Single appointment - update status
          const { error: statusUpdateError } = await supabase
            .from('appointments')
            .update({ status: 'scheduled' })
            .eq('id', actualSessionId)
            .eq('status', 'cancelled'); // Only update if currently cancelled
          
          if (statusUpdateError) {
            console.error('Error reactivating appointment:', statusUpdateError);
            toast.error(`Failed to reactivate session: ${statusUpdateError.message}`);
            return;
          }
        }
        
        console.log('✅ Session reactivated from cancelled to scheduled');
      }
      
      // Update appointment(s) with channel and token (but keep status as scheduled)
      // For combined sessions, update ALL appointments in the group so user can join from any slot
      if ((session as any).isCombined && (session as any).continuousSessionIds) {
        // Update all appointments in the combined group
        const appointmentIds = (session as any).continuousSessionIds;
        console.log('📝 Updating all appointments in combined session:', appointmentIds);
        
        const { error: updateError } = await supabase
          .from('appointments')
          .update({
            channel_name: channelName,
            token: token
          })
          .in('id', appointmentIds);
        
        if (updateError) {
          console.error('Error updating combined appointments:', updateError);
          toast.error(`Failed to update appointments: ${updateError.message}`);
          return;
        }
      } else {
        // Single appointment - update normally
        const { error: updateError } = await supabase
          .from('appointments')
          .update({
            channel_name: channelName,
            token: token
          })
          .eq('id', actualSessionId);
        
        if (updateError) {
          console.error('Error updating appointment:', updateError);
          toast.error(`Failed to update appointment: ${updateError.message}`);
          return;
        }
      }
      
      // Validate UUID format before querying
      if (!actualSessionId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(actualSessionId)) {
        console.error('❌ Invalid appointment ID format:', actualSessionId);
        toast.error('Invalid session ID. Please try again.');
        return;
      }
      
      // First verify appointment exists to avoid foreign key errors
      const { data: appointmentCheck, error: appointmentCheckError } = await supabase
        .from('appointments')
        .select('id')
        .eq('id', actualSessionId)
        .maybeSingle();
      
      if (appointmentCheckError) {
        console.error('❌ Error checking appointment:', appointmentCheckError);
        toast.error(`Failed to verify appointment: ${appointmentCheckError.message}`);
        return;
      }
      
      if (!appointmentCheck) {
        console.error('❌ Appointment not found:', actualSessionId);
        toast.error('Appointment not found. Please refresh and try again.');
        return;
      }
      
      // IMPORTANT: Check for existing active/pending call session first
      // If exists, resume that session instead of creating new one
      // For combined sessions, check using the primary appointment ID
      const { data: existingCallSession, error: callSessionFetchError } = await supabase
        .from('call_sessions')
        .select('*, start_time') // Include start_time for timer resume
        .eq('appointment_id', actualSessionId)
        .in('status', ['active', 'pending']) // Check for active or pending sessions
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (callSessionFetchError && callSessionFetchError.code !== 'PGRST116') {
        console.error('❌ Error fetching call session:', callSessionFetchError);
        toast.error(`Failed to check call session: ${callSessionFetchError.message}`);
        return;
      }
      
      let callSessionId: string | null = null;
      let isResuming = false;
      
      if (existingCallSession && (existingCallSession.status === 'active' || existingCallSession.status === 'pending')) {
        // RESUME existing call session - don't create new one
        console.log('🔄 Resuming existing call session:', {
          callSessionId: existingCallSession.id,
          status: existingCallSession.status,
          channelName: existingCallSession.channel_name
        });
        
        callSessionId = existingCallSession.id;
        isResuming = true;
        
        // Use existing channel name if available, otherwise use new one
        if (existingCallSession.channel_name) {
          channelName = existingCallSession.channel_name;
          console.log('✅ Using existing channel name:', channelName);
        }
        
        // Update call session with fresh token and ensure status is active/pending
        const { error: updateError } = await supabase
          .from('call_sessions')
          .update({
            agora_token: token, // Update with fresh token
            channel_name: channelName, // Update channel name if changed
            call_type: actualCallType, // Update call type if changed
            status: existingCallSession.status === 'active' ? 'active' : 'pending' // Keep existing status
          })
          .eq('id', callSessionId);
        
        if (updateError) {
          console.error('❌ Error updating call session:', updateError);
          toast.error(`Failed to update call session: ${updateError.message || 'Unknown error'}`);
          return;
        }
        
        console.log('✅ Call session resumed successfully');
      } else {
        // Create new call session only if no active/pending session exists
        const newCallSessionId = `call_${actualSessionId}_${Date.now()}`;
        if (!expert?.auth_id) {
          console.error('Expert auth_id not available');
          toast.error('Expert information not available. Please refresh and try again.');
          return;
        }
        
        const { data: newCallSession, error: insertError } = await supabase
          .from('call_sessions')
          .insert({
            id: newCallSessionId,
            expert_id: expert.auth_id,
            user_id: session.clientId,
            appointment_id: actualSessionId,
            channel_name: channelName,
            agora_token: token,
            call_type: actualCallType,
            status: 'pending', // Not active until user joins
            selected_duration: session.duration
          })
          .select()
          .single();
        
        if (insertError) {
          console.error('Error creating call session:', insertError);
          toast.error(`Failed to create call session: ${insertError.message || 'Unknown error'}`);
          return;
        }
        
        callSessionId = newCallSession?.id || null;
        console.log('✅ New call session created:', callSessionId);
      }
      
      // IMPORTANT: Only send notification if NOT resuming (new session)
      // If resuming, don't send notification - call is already active
      if (!isResuming) {
        // Send notification to user
        try {
        const callType = actualCallType === 'video' ? 'Video' : 'Audio';
        const expertName = expert?.name || 'Your expert';
        
        // Validate required fields before sending
        if (!session.clientId) {
          console.error('Cannot send notification: clientId is missing');
          toast.warning('Session prepared, but notification could not be sent (missing user ID)');
        } else if (!expert?.auth_id) {
          console.error('Cannot send notification: expert auth_id is missing');
          toast.warning('Session prepared, but notification could not be sent (missing expert ID)');
        } else {
          
          // For combined sessions, send notification with info about all slots
          const slotInfo = (session as any).isCombined && (session as any).slotCount > 1
            ? ` (${(session as any).slotCount} slots combined)`
            : '';
          
          console.log('📧 Preparing to send notification:', {
            userId: session.clientId,
            appointmentId: actualSessionId,
            isCombined: (session as any).isCombined,
            slotCount: (session as any).slotCount,
            allAppointmentIds: (session as any).continuousSessionIds || [actualSessionId],
            channelName,
            callSessionId
          });
          
          // Try to send notification with retry logic
          let notificationSent = false;
          let lastError: unknown = null;
          
          for (let attempt = 1; attempt <= 2; attempt++) {
            try {
              const { data: notificationData, error: notificationError } = await supabase.functions.invoke('send-notification', {
                body: {
                  userId: session.clientId,
                  type: 'session_ready',
                  title: `${callType} Session Ready${slotInfo}`,
                  content: `${expertName} is ready for your scheduled ${callType.toLowerCase()} session${slotInfo}. Click to join the call now.`,
                  referenceId: actualSessionId, // Use primary appointment ID for notification
                  senderId: expert.auth_id,
                  data: {
                    sessionId: actualSessionId,
                    callSessionId: callSessionId,
                    channelName: channelName,
                    callType: actualCallType,
                    expertName: expertName,
                    // Include all appointment IDs so user can join from any slot
                    allAppointmentIds: (session as any).isCombined && (session as any).continuousSessionIds
                      ? (session as any).continuousSessionIds
                      : [actualSessionId]
                  }
                }
              });
              
              console.log('📧 Notification send attempt:', {
                attempt,
                success: !notificationError,
                error: notificationError?.message,
                notificationData
              });
              
              if (notificationError) {
                lastError = notificationError;
                // If it's a network error and we have retries left, wait and retry
                if (attempt < 2 && (notificationError.message?.includes('Failed to fetch') || notificationError.message?.includes('network'))) {
                  console.warn(`⚠️ Notification attempt ${attempt} failed (network error), retrying...`);
                  await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
                  continue;
                }
                throw notificationError;
                } else {
                notificationSent = true;
                console.log('✅ Notification sent successfully:', {
                  notificationId: notificationData?.id,
                  referenceId: actualSessionId,
                  userId: session.clientId,
                  type: 'session_ready'
                });
                break;
              }
            } catch (invokeErr: unknown) {
              lastError = invokeErr;
              // If it's a network error and we have retries left, wait and retry
              const errorMessage = invokeErr instanceof Error ? invokeErr.message : String(invokeErr);
              if (attempt < 2 && (errorMessage.includes('Failed to fetch') || errorMessage.includes('network'))) {
                console.warn(`Notification attempt ${attempt} failed (network error), retrying...`);
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
                continue;
              }
              throw invokeErr;
            }
          }
          
          if (!notificationSent && lastError) {
            const errorMessage = lastError instanceof Error ? lastError.message : String(lastError);
            const errorContext = lastError && typeof lastError === 'object' && 'context' in lastError ? lastError.context : undefined;
            console.error('Failed to send notification after retries:', {
              error: lastError,
              message: errorMessage,
              context: errorContext,
              userId: session.clientId,
              callSessionId: callSessionId || session.id
            });
            
            // Try alternative: Create notification directly in database as fallback
            try {
              const { error: directInsertError } = await supabase
                .from('notifications')
                .insert({
                  user_id: session.clientId,
                  type: 'session_ready',
                  title: `${callType} Session Ready`,
                  content: `${expertName} is ready for your scheduled ${callType.toLowerCase()} session. Click to join the call now.`,
                  read: false,
                  sender_id: expert.auth_id,
                  reference_id: actualSessionId // Use appointment ID (UUID) instead of callSessionId
                });
              
              if (directInsertError) {
                console.error('Fallback notification insert also failed:', directInsertError);
                toast.warning('Session prepared. Notification service unavailable - user will see session when they refresh.');
              } else {
                toast.success('Session prepared. Notification sent via fallback method.');
              }
            } catch (fallbackErr) {
              console.error('❌ Fallback notification failed:', fallbackErr);
              toast.warning('Session prepared. Notification service unavailable - user will see session when they refresh.');
            }
          }
        }
      } catch (notificationErr: unknown) {
        const errorMessage = notificationErr instanceof Error ? notificationErr.message : 'Unknown error';
        const errorStack = notificationErr instanceof Error ? notificationErr.stack : undefined;
        console.error('Exception sending notification to user:', {
          error: notificationErr,
          message: errorMessage,
          stack: errorStack,
          userId: session.clientId
        });
        
        // Try fallback notification
        try {
          const { error: fallbackError } = await supabase
            .from('notifications')
            .insert({
              user_id: session.clientId,
              type: 'session_ready',
              title: `${session.type === 'video' ? 'Video' : 'Audio'} Session Ready`,
              content: `${expert?.name || 'Your expert'} is ready for your scheduled session. Click to join the call now.`,
              read: false,
              sender_id: expert?.auth_id,
              reference_id: session.id // Use appointment ID (UUID) instead of callSessionId
            });
          
          if (fallbackError) {
            console.error('Fallback notification also failed:', fallbackError);
            toast.warning('Session prepared. Notification service unavailable.');
          } else {
            toast.success('Session prepared. Notification sent.');
          }
        } catch (fallbackErr) {
          console.error('Fallback notification failed:', fallbackErr);
          toast.warning('Session prepared. Notification service unavailable.');
        }
        }
      }
      
      // Show appropriate message based on whether resuming or new session
      if (isResuming) {
        toast.success(`Call session resumed. Continue waiting for ${session.clientName} to join...`);
      } else {
        // Show warning to expert about 5 minute refund policy
        toast.warning('Session Prepared', {
          description: `User has been notified. If you don't join within 5 minutes of the session start time, the user will receive a full refund automatically.`,
          duration: 8000
        });
        
        toast.success(`Session prepared. Waiting for ${session.clientName} to join...`);
      }
      
      // Open Agora call interface for expert
      // Create call request object from session data
      const finalExpertUid = expertUid || Math.floor(Math.random() * 1000000);
      const callRequestData = {
        id: callSessionId || `session_${actualSessionId}`,
        user_id: session.clientId,
        call_type: actualCallType,
        channel_name: channelName,
        agora_token: token,
        agora_uid: finalExpertUid,
        user_metadata: {
          name: session.clientName,
          avatar: session.clientAvatar || undefined
        },
        call_session_id: callSessionId || null,
        // Include start_time for timer resume if resuming existing session
        start_time: isResuming && existingCallSession?.start_time 
          ? existingCallSession.start_time 
          : undefined
      };
      
      console.log('🎬 Opening Agora call interface for expert:', {
        callSessionId,
        channelName,
        callType: actualCallType,
        clientName: session.clientName,
        expertUid: finalExpertUid
      });
      
      setActiveCallRequest(callRequestData);
      
      // Refresh sessions to show updated status
      await fetchSessions();
    } catch (error) {
      console.error('Error starting session:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to prepare session: ${errorMsg}`);
    } finally {
      isStartingSessionRef.current = false;
    }
  };

  const endSession = async () => {
    if (selectedSession) {
      try {
        await updateSessionStatus(selectedSession.id, 'completed');
        setSessionTimer({ isRunning: false, elapsed: 0 });
        toast.success('Session ended');
      } catch (error) {
        console.error('Error ending session:', error);
      }
    } else {
      setSessionTimer({ isRunning: false, elapsed: 0 });
    }
  };

  const cancelSession = async (session: Session) => {
    try {
      await updateSessionStatus(session.id, 'cancelled');
      toast.success('Session cancelled');
    } catch (error) {
      console.error('Error cancelling session:', error);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedSession) return;

    try {
      const goals = goalsText.split(',').map(g => g.trim()).filter(g => g);
      const outcomes = outcomesText.split(',').map(o => o.trim()).filter(o => o);
      const nextSteps = nextStepsText.split(',').map(s => s.trim()).filter(s => s);

      await updateSessionNotes(
        selectedSession.id,
        notesText,
        goals,
        outcomes,
        nextSteps
      );
      setEditingNotes(false);
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  // Component for session item with warning
  const SessionItemWithWarning: React.FC<{
    session: Session;
    appointmentDate: string;
    startTime: string;
    onSelect: () => void;
    onStart: (e: React.MouseEvent) => void;
    onEnd: (e: React.MouseEvent) => void;
    formatTime: (date: Date) => string;
    formatDuration: (minutes: number) => string;
    getTypeIcon: (type: string) => React.ReactNode;
    getStatusColor: (status: string, session?: Session) => string;
    formatStatusText: (status: string, session?: Session) => string;
  }> = ({ session, appointmentDate, startTime, onSelect, onStart, onEnd, formatTime, formatDuration, getTypeIcon, getStatusColor, formatStatusText }) => {
    // For combined sessions, use the primary appointmentId instead of the combined ID
    // The combined ID is not a valid UUID and will cause database query errors
    const appointmentId = extractAppointmentId(
      session.id,
      (session as any).appointmentId,
      !!(session as any).isCombined
    );
    
    const { warningData } = useExpertNoShowWarning(
      appointmentId,
      appointmentDate,
      startTime,
      session.status
    );

    const isWarning = warningData?.isWarning || false;
    const isNoShow = warningData?.isNoShow || false;
    const minutesRemaining = warningData?.minutesRemaining || 0;
    // IMPORTANT: Don't use || false here - we need to distinguish between:
    // - undefined = not checked yet (should NOT show button)
    // - false = checked, no refund (should show button)
    // - true = checked, refund found (should NOT show button)
    const refundProcessed = warningData?.refundProcessed;
    
    // CRITICAL: For cancelled sessions, only show Start button if:
    // 1. warningData exists (refund check has completed)
    // 2. refundProcessed is explicitly false (no refund found)
    // This ensures we don't show the button while the check is in progress or if refund was found
    const canShowStartForCancelled = session.status === 'cancelled' 
      ? (warningData !== null && refundProcessed === false)
      : true; // For non-cancelled sessions, use normal logic

    return (
      <div
        className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
        onClick={onSelect}
      >
        {/* Warning Alert */}
        {isWarning && !isNoShow && (
          <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-900">
                  Join Session Reminder
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  You haven't joined your scheduled session yet. If you don't join within {minutesRemaining} minute(s), the user will receive a full refund automatically.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* No-Show Alert */}
        {isNoShow && (
          <div className="mb-3 p-3 bg-orange-50 border border-orange-200 rounded-md">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-orange-900">
                  Session Not Joined
                </p>
                <p className="text-xs text-orange-700 mt-1">
                  You did not join the session within 5 minutes. The user has been refunded the full amount.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={session.clientAvatar} />
              <AvatarFallback>
                {session.clientName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium">{session.clientName}</h4>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                {getTypeIcon(session.type)}
                <span>{formatTime(session.startTime)} - {formatTime(session.endTime)}</span>
                <span>({formatDuration(session.duration)})</span>
                {(session as any).isCombined && (session as any).slotCount > 1 && (
                  <Badge variant="outline" className="text-xs">
                    {(session as any).slotCount} slots
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(session.status, session)}>
              {formatStatusText(session.status, session)}
            </Badge>
            {/* Show Start button if:
                1. Status is 'scheduled' AND current time >= start time, OR
                2. Status is 'cancelled' BUT:
                   - Time slot is still available (current time >= start time and < end time)
                   - Refund check has completed (warningData exists)
                   - No refund was found (refundProcessed is explicitly false)
                   This ensures we don't show Start button if refund check hasn't completed yet or if refund was found
            */}
            {(
              (session.status === 'scheduled' && new Date() >= session.startTime) ||
              (session.status === 'cancelled' && 
               new Date() >= session.startTime && 
               new Date() < session.endTime && 
               canShowStartForCancelled)
            ) && (
              <Button size="sm" onClick={onStart}>
                <Play className="h-4 w-4 mr-1" />
                Start
              </Button>
            )}
            {session.status === 'in-progress' && (
              <Button size="sm" variant="destructive" onClick={onEnd}>
                <Square className="h-4 w-4 mr-1" />
                End
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionTimer.isRunning) {
      interval = setInterval(() => {
        setSessionTimer(prev => ({ ...prev, elapsed: prev.elapsed + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionTimer.isRunning]);

  // DISABLED: Auto-processing refunds causes too many API calls
  // Refunds should be processed server-side or on-demand only
  // This useEffect was causing 400+ API calls on page load
  // useEffect(() => {
  //   if (!processRefundForCancelledSession) return;
  //   const cancelledSessions = sessions.filter(s => s.status === 'cancelled');
  //   if (cancelledSessions.length > 0) {
  //     cancelledSessions.forEach(async (session) => {
  //       try {
  //         await processRefundForCancelledSession(session.id);
  //       } catch (error) {
  //         // Silently fail
  //       }
  //     });
  //   }
  // }, [sessions, processRefundForCancelledSession]);

  // Check if there's an active session and resume call if needed
  // Also check if refund was processed and update status accordingly
  useEffect(() => {
    const checkAndUpdateRefundedSessions = async () => {
      for (const session of sessions) {
        // Check if session is in-progress but refund was processed
        if (session.status === 'in-progress') {
          const actualSessionId = extractAppointmentId(
            session.id,
            (session as any).appointmentId,
            !!(session as any).isCombined
          );
          
          // Check if refund exists for this appointment
          const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(actualSessionId);
          
          let hasRefund = false;
          if (isUUID) {
            const { data: refunds } = await supabase
              .from('wallet_transactions')
              .select('id')
              .eq('reference_id', actualSessionId)
              .eq('reference_type', 'appointment')
              .eq('type', 'credit')
              .in('reason', ['expert_no_show', 'refund'])
              .limit(1);
            hasRefund = (refunds && refunds.length > 0) || false;
          } else {
            const { data: refunds } = await supabase
              .from('wallet_transactions')
              .select('id')
              .eq('metadata->>reference_id', actualSessionId)
              .eq('reference_type', 'appointment')
              .eq('type', 'credit')
              .in('reason', ['expert_no_show', 'refund'])
              .limit(1);
            hasRefund = (refunds && refunds.length > 0) || false;
          }
          
          // Also check call session refunds
          if (!hasRefund) {
            // First verify appointment exists to avoid foreign key errors
            const { data: appointmentCheck } = await supabase
              .from('appointments')
              .select('id')
              .eq('id', actualSessionId)
              .maybeSingle();
            
            if (!appointmentCheck) {
              console.warn('⚠️ Appointment not found, skipping call session refund check:', actualSessionId);
              continue; // Skip this session
            }
            
            const { data: callSession, error: callSessionError } = await supabase
              .from('call_sessions')
              .select('id')
              .eq('appointment_id', actualSessionId)
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle();
            
            if (callSessionError && callSessionError.code !== 'PGRST116') {
              console.error('❌ Error fetching call session for refund check:', callSessionError);
              continue; // Skip this session
            }
            
            if (callSession) {
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
          }
          
          // If refund exists but session is still in-progress, update status
          if (hasRefund) {
            console.log('🔄 Refund detected for in-progress session, updating status:', actualSessionId);
            
            // Update appointment status to cancelled
            await supabase
              .from('appointments')
              .update({ status: 'cancelled' })
              .eq('id', actualSessionId)
              .neq('status', 'cancelled');
            
            // Update call session status to ended if exists
            // First verify appointment exists to avoid foreign key errors
            const { data: appointmentCheck } = await supabase
              .from('appointments')
              .select('id')
              .eq('id', actualSessionId)
              .maybeSingle();
            
            if (!appointmentCheck) {
              console.warn('⚠️ Appointment not found, skipping call session update:', actualSessionId);
              continue; // Skip this session
            }
            
            const { data: callSession, error: callSessionError } = await supabase
              .from('call_sessions')
              .select('id, status, duration')
              .eq('appointment_id', actualSessionId)
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle();
            
            if (callSessionError && callSessionError.code !== 'PGRST116') {
              console.error('❌ Error fetching call session for refund check:', callSessionError);
              continue; // Skip this session
            }
            
            // CRITICAL: Do NOT update status to 'ended' if expert attended the call (duration > 0)
            // If a refund was processed but the expert attended, this is an error - don't mark as ended
            if (callSession && callSession.duration && callSession.duration > 0) {
              console.log('⚠️ Refund detected but expert attended the call (duration > 0). Not updating status to ended.', {
                callSessionId: callSession.id,
                duration: callSession.duration,
                status: callSession.status
              });
              // Don't update status - expert attended, so session should remain active/in-progress
              continue; // Skip updating status
            }
            
            if (callSession && (callSession.status === 'active' || callSession.status === 'pending')) {
              await supabase
                .from('call_sessions')
                .update({ 
                  status: 'ended',
                  end_time: new Date().toISOString()
                })
                .eq('id', callSession.id);
            }
            
            // Refresh sessions to reflect updated status
            await fetchSessions();
            console.log('✅ Updated session status after refund detection');
          }
        }
      }
    };
    
    const activeSession = sessions.find(s => s.status === 'in-progress');
    if (activeSession) {
      setSessionTimer({ isRunning: true, elapsed: 0 });
      // Calculate elapsed time if session has a start time
      if (activeSession.startTime) {
        const elapsed = Math.floor((new Date().getTime() - activeSession.startTime.getTime()) / 1000);
        setSessionTimer({ isRunning: true, elapsed: Math.max(0, elapsed) });
      }
      
      // Check for refunds and update status if needed
      checkAndUpdateRefundedSessions();
      
      // Resume call if session is in-progress but call interface is not open
      if (!activeCallRequest && activeSession.channelName) {
        console.log('🔄 Resuming active session after page refresh:', {
          sessionId: activeSession.id,
          channelName: activeSession.channelName,
          callType: activeSession.type
        });
        
        // Get call session data
        const resumeCall = async () => {
          try {
            // Get call session for this appointment
            const actualSessionId = extractAppointmentId(
              activeSession.id,
              (activeSession as any).appointmentId,
              !!(activeSession as any).isCombined
            );
            
            // Validate UUID format before querying
            if (!actualSessionId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(actualSessionId)) {
              console.error('❌ Invalid appointment ID format:', actualSessionId);
              return;
            }
            
            // First verify appointment exists
            const { data: appointment, error: appointmentError } = await supabase
              .from('appointments')
              .select('id')
              .eq('id', actualSessionId)
              .maybeSingle();
            
            if (appointmentError) {
              console.error('❌ Error checking appointment:', appointmentError);
              return;
            }
            
            if (!appointment) {
              console.warn('⚠️ Appointment not found:', actualSessionId);
              return;
            }
            
            const { data: callSession, error: callSessionError } = await supabase
              .from('call_sessions')
              .select('id, agora_token, call_type, channel_name, call_metadata')
              .eq('appointment_id', actualSessionId)
              .eq('status', 'active')
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle();
            
            if (callSessionError) {
              console.error('❌ Error fetching call session:', callSessionError);
              // Don't throw - just log and return
              return;
            }
            
            if (callSession && callSession.channel_name) {
              // Get expert UID from call_metadata or generate new one
              // call_sessions table doesn't have agora_uid column - it's stored in call_metadata
              const callMetadata = (callSession.call_metadata as Record<string, any>) || {};
              const expertUid = callMetadata.expert_uid || Math.floor(Math.random() * 1000000);
              const { data: tokenData, error: tokenError } = await supabase.functions.invoke('smooth-action', {
                body: {
                  channelName: callSession.channel_name,
                  uid: expertUid,
                  role: 1,
                  expireTime: 3600
                }
              });
              
              if (!tokenError && tokenData?.token) {
                const callRequestData = {
                  id: callSession.id,
                  user_id: activeSession.clientId,
                  call_type: (callSession.call_type === 'video' ? 'video' : 'audio') as 'audio' | 'video',
                  channel_name: callSession.channel_name,
                  agora_token: tokenData.token,
                  agora_uid: expertUid,
                  user_metadata: {
                    name: activeSession.clientName,
                    avatar: activeSession.clientAvatar || undefined
                  },
                  call_session_id: callSession.id
                };
                
                console.log('✅ Resuming call interface for active session');
                setActiveCallRequest(callRequestData);
              } else {
                console.error('❌ Failed to generate token for resume:', tokenError);
              }
            }
          } catch (error) {
            console.error('❌ Error resuming call:', error);
          }
        };
        
        resumeCall();
      }
    } else {
      setSessionTimer({ isRunning: false, elapsed: 0 });
    }
  }, [sessions, activeCallRequest]);

  // Show loading or error state if expert is not available
  if (!expert?.auth_id) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <p className="text-gray-500">Loading expert information...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-red-500">Error: {error}</p>
            <Button onClick={() => fetchSessions()} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Session Timer */}
      {sessionTimer.isRunning && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">Session in progress</span>
                <Badge variant="outline">
                  {Math.floor(sessionTimer.elapsed / 60)}:{(sessionTimer.elapsed % 60).toString().padStart(2, '0')}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Pause className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={endSession}>
                  <Square className="h-4 w-4" />
                  End Session
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar and Today's Sessions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Session Schedule</CardTitle>
            <CardDescription>Manage your sessions and appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs 
              defaultValue="today" 
              className="w-full"
              value={activeTab}
              onValueChange={(value) => {
                setActiveTab(value);
                // Always fetch when tab is clicked (tab-specific data)
                if (expert?.auth_id) {
                  console.log('🔄 Tab changed to:', value);
                  console.log('📡 Fetching sessions for tab:', value);
                  fetchSessions(value as 'today' | 'upcoming' | 'history');
                } else {
                  console.log('❌ Expert ID not available');
                }
              }}
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="today" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Today's Sessions</h3>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Session
                  </Button>
                </div>
                
                {loading && sessions.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {todaySessions.length > 0 ? (
                        todaySessions.map((session) => {
                          // Get appointment date and time for warning check
                          const appointmentDate = session.appointmentDate || format(session.startTime, 'yyyy-MM-dd');
                          const startTime = format(session.startTime, 'HH:mm');
                          
                          return (
                            <SessionItemWithWarning
                              key={session.id}
                              session={session}
                              appointmentDate={appointmentDate}
                              startTime={startTime}
                              onSelect={() => setSelectedSession(session)}
                              onStart={(e) => {
                                e.stopPropagation();
                                setSessionToStart(session);
                                setSelectedCallType(session.type === 'video' ? 'video' : 'audio');
                                setShowCallTypeModal(true);
                              }}
                              onEnd={(e) => {
                                e.stopPropagation();
                                setSelectedSession(session);
                                endSession();
                              }}
                              formatTime={formatTime}
                              formatDuration={formatDuration}
                              getTypeIcon={getTypeIcon}
                              getStatusColor={getStatusColor}
                              formatStatusText={formatStatusText}
                            />
                          );
                        })
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No sessions scheduled for today
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                )}
              </TabsContent>

              <TabsContent value="upcoming" className="space-y-4">
                <h3 className="text-lg font-medium">Upcoming Sessions</h3>
                {loading && sessions.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {upcomingSessions.length > 0 ? (
                        upcomingSessions.map((session) => (
                          <div
                            key={session.id}
                            className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                            onClick={() => setSelectedSession(session)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={session.clientAvatar} />
                                  <AvatarFallback>
                                    {session.clientName.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-medium">{session.clientName}</h4>
                                  <div className="flex items-center gap-2 text-sm text-gray-500">
                                    {getTypeIcon(session.type)}
                                    <span>{session.startTime.toLocaleDateString()}</span>
                                    <span>{formatTime(session.startTime)} - {formatTime(session.endTime)}</span>
                                    <span>({formatDuration(session.duration)})</span>
                                    {(session as any).isCombined && (session as any).slotCount > 1 && (
                                      <Badge variant="outline" className="text-xs">
                                        {(session as any).slotCount} slots
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={getStatusColor(session.status, session)}>
                                  {formatStatusText(session.status, session)}
                                </Badge>
                                {session.status === 'scheduled' && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      cancelSession(session);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No upcoming sessions
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                )}
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <h3 className="text-lg font-medium">Session History</h3>
                {loading && sessions.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {historySessions.length > 0 ? (
                        historySessions.map((session) => (
                          <div
                            key={session.id}
                            className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                            onClick={() => setSelectedSession(session)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={session.clientAvatar} />
                                  <AvatarFallback>
                                    {session.clientName.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-medium">{session.clientName}</h4>
                                  <div className="flex items-center gap-2 text-sm text-gray-500">
                                    {getTypeIcon(session.type)}
                                    <span>{session.startTime.toLocaleDateString()}</span>
                                    <span>{formatTime(session.startTime)} - {formatTime(session.endTime)}</span>
                                    <span>({formatDuration(session.duration)})</span>
                                    {(session as any).isCombined && (session as any).slotCount > 1 && (
                                      <Badge variant="outline" className="text-xs">
                                        {(session as any).slotCount} slots
                                      </Badge>
                                    )}
                                    {session.actualDuration && (
                                      <span className="text-xs">({formatDuration(session.actualDuration)} actual)</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={getStatusColor(session.status, session)}>
                                  {formatStatusText(session.status, session)}
                                </Badge>
                                {session.rating && (
                                  <div className="text-yellow-500 text-sm">
                                    {'★'.repeat(session.rating)}{'☆'.repeat(5 - session.rating)}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No session history
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>

      {/* Session Details Modal */}
      {selectedSession && (
        <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Session Details</DialogTitle>
              <DialogDescription>
                {selectedSession.type} session with {selectedSession.clientName}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedSession.clientAvatar} />
                  <AvatarFallback className="text-xl">
                    {selectedSession.clientName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedSession.clientName}</h3>
                  <div className="flex items-center gap-2 text-gray-500">
                    {getTypeIcon(selectedSession.type)}
                    <span>{selectedSession.startTime.toLocaleDateString()}</span>
                    <span>{formatTime(selectedSession.startTime)} - {formatTime(selectedSession.endTime)}</span>
                  </div>
                  <Badge className={getStatusColor(selectedSession.status, selectedSession)}>
                    {formatStatusText(selectedSession.status, selectedSession)}
                  </Badge>
                </div>
              </div>

              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Duration</Label>
                      <div className="text-sm">{formatDuration(selectedSession.duration)}</div>
                      {selectedSession.actualDuration && (
                        <div className="text-xs text-gray-500">
                          Actual: {formatDuration(selectedSession.actualDuration)}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label>Payment</Label>
                      <div className="text-sm">${selectedSession.amount}</div>
                      <Badge variant="outline" className="text-xs">
                        {selectedSession.paymentStatus}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <Label>Session Goals</Label>
                    <div className="space-y-1 mt-1">
                      {selectedSession.goals.map((goal, index) => (
                        <Badge key={index} variant="outline" className="mr-1">
                          {goal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Session Notes</Label>
                      {selectedSession.status !== 'completed' && !editingNotes && (
                        <Button size="sm" variant="outline" onClick={() => setEditingNotes(true)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      )}
                    </div>
                    <Textarea
                      value={notesText}
                      onChange={(e) => setNotesText(e.target.value)}
                      readOnly={!editingNotes || selectedSession.status === 'completed'}
                      rows={6}
                      className="mt-2"
                    />
                    {editingNotes && (
                      <div className="mt-4 space-y-4">
                        <div>
                          <Label>Goals</Label>
                          <Input
                            value={goalsText}
                            onChange={(e) => setGoalsText(e.target.value)}
                            placeholder="Comma-separated goals"
                            className="mt-1"
                          />
                        </div>
                        {selectedSession.status === 'completed' && (
                          <>
                            <div>
                              <Label>Outcomes</Label>
                              <Input
                                value={outcomesText}
                                onChange={(e) => setOutcomesText(e.target.value)}
                                placeholder="Comma-separated outcomes"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label>Next Steps</Label>
                              <Input
                                value={nextStepsText}
                                onChange={(e) => setNextStepsText(e.target.value)}
                                placeholder="Comma-separated next steps"
                                className="mt-1"
                              />
                            </div>
                          </>
                        )}
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSaveNotes}>
                            Save Notes
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => {
                            setEditingNotes(false);
                            setNotesText(selectedSession.notes || '');
                            setGoalsText(selectedSession.goals?.join(', ') || '');
                            setOutcomesText(selectedSession.outcomes?.join(', ') || '');
                            setNextStepsText(selectedSession.nextSteps?.join(', ') || '');
                          }}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="outcomes" className="space-y-4">
                  {selectedSession.status === 'completed' ? (
                    <>
                      <div>
                        <Label>Outcomes Achieved</Label>
                        <div className="space-y-1 mt-1">
                          {selectedSession.outcomes.map((outcome, index) => (
                            <div key={index} className="text-sm p-2 bg-green-50 rounded">
                              {outcome}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <Label>Next Steps</Label>
                        <div className="space-y-1 mt-1">
                          {selectedSession.nextSteps.map((step, index) => (
                            <div key={index} className="text-sm p-2 bg-blue-50 rounded">
                              {step}
                            </div>
                          ))}
                        </div>
                      </div>

                      {selectedSession.rating && (
                        <div>
                          <Label>Client Rating</Label>
                          <div className="text-2xl font-bold text-yellow-500">
                            {'★'.repeat(selectedSession.rating)}{'☆'.repeat(5 - selectedSession.rating)}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Outcomes will be available after the session is completed
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedSession(null)}>
                  Close
                </Button>
                {selectedSession.status === 'scheduled' && new Date() >= selectedSession.startTime && (
                  <Button onClick={() => {
                    setSessionToStart(selectedSession);
                    setSelectedCallType(selectedSession.type === 'video' ? 'video' : 'audio');
                    setShowCallTypeModal(true);
                  }}>
                    <Play className="h-4 w-4 mr-2" />
                    Start Session
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Call Type Selection Modal */}
      <Dialog open={showCallTypeModal} onOpenChange={setShowCallTypeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Call Type</DialogTitle>
            <DialogDescription>
              Choose whether you want to start an audio or video call with {sessionToStart?.clientName || 'the user'}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <button
              onClick={() => setSelectedCallType('audio')}
              className={`p-6 border-2 rounded-lg transition-all ${
                selectedCallType === 'audio'
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Phone className={`h-8 w-8 mx-auto mb-2 ${selectedCallType === 'audio' ? 'text-primary' : 'text-gray-400'}`} />
              <h3 className="font-semibold text-center">Audio Call</h3>
              <p className="text-sm text-gray-500 text-center mt-1">Voice only</p>
            </button>
            <button
              onClick={() => setSelectedCallType('video')}
              className={`p-6 border-2 rounded-lg transition-all ${
                selectedCallType === 'video'
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Video className={`h-8 w-8 mx-auto mb-2 ${selectedCallType === 'video' ? 'text-primary' : 'text-gray-400'}`} />
              <h3 className="font-semibold text-center">Video Call</h3>
              <p className="text-sm text-gray-500 text-center mt-1">With video</p>
            </button>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowCallTypeModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (sessionToStart) {
                  setShowCallTypeModal(false);
                  await startSession(sessionToStart, selectedCallType);
                  setSessionToStart(null);
                }
              }}
            >
              <Play className="h-4 w-4 mr-2" />
              Start {selectedCallType === 'video' ? 'Video' : 'Audio'} Call
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Agora Call Interface Modal - Opens when expert starts session */}
      {activeCallRequest && (
        <ExpertInCallModal
          isOpen={true}
          onClose={() => {
            setActiveCallRequest(null);
            toast.info('Call ended');
          }}
          callRequest={activeCallRequest}
          onCallEnd={() => {
            setActiveCallRequest(null);
            toast.info('Call ended');
            // Refresh sessions to update status
            fetchSessions();
          }}
        />
      )}
    </div>
  );
};

export default SessionManager;
