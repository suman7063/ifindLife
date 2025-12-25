
import React, { useState, useEffect, useMemo, useRef } from 'react';
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

  // Use the expert sessions hook
  const {
    sessions,
    loading,
    error,
    fetchSessions,
    updateSessionStatus,
    updateSessionNotes,
  } = useExpertSessions({
    expertId: expert?.auth_id,
    autoFetch: true,
  });

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
          console.log('🌍 Expert timezone fetched:', timezone);
          setExpertTimezone(timezone);
        } else {
          console.log('⚠️ No timezone found, using UTC as default');
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
  
  // Filter sessions by comparing appointment_date directly (memoized)
  // appointment_date is already stored as YYYY-MM-DD in expert's timezone context
  const todaySessions = useMemo(() => {
    return sessions.filter(session => {
      if (session.appointmentDate) {
        // Direct string comparison - appointment_date is already in expert's timezone context
        return session.appointmentDate === todayDateString;
      }
      // Fallback: compare using startTime converted to expert's timezone
      try {
        const formatter = new Intl.DateTimeFormat('en-CA', {
          timeZone: expertTimezone,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
        const sessionDateInTimezone = formatter.format(session.startTime);
        return sessionDateInTimezone === todayDateString;
      } catch {
        // If timezone conversion fails, use simple date comparison
        const sessionDate = new Date(session.startTime);
        const today = new Date();
        return sessionDate.getFullYear() === today.getFullYear() &&
               sessionDate.getMonth() === today.getMonth() &&
               sessionDate.getDate() === today.getDate();
      }
    });
  }, [sessions, todayDateString, expertTimezone]);

  const upcomingSessions = useMemo(() => {
    const now = new Date();
    return sessions.filter(session => {
      // Use appointmentDate for comparison if available
      if (session.appointmentDate) {
        // Direct string comparison - appointment_date is already in expert's timezone context
        const isToday = session.appointmentDate === todayDateString;
        return !isToday && session.startTime > now && session.status === 'scheduled';
      }
      // Fallback: use date comparison with timezone
      try {
        const formatter = new Intl.DateTimeFormat('en-CA', {
          timeZone: expertTimezone,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
        const sessionDateInTimezone = formatter.format(session.startTime);
        const isToday = sessionDateInTimezone === todayDateString;
        return !isToday && session.startTime > now && session.status === 'scheduled';
      } catch {
        const sessionDate = new Date(session.startTime);
        const today = new Date();
        const isToday = sessionDate.getFullYear() === today.getFullYear() &&
                        sessionDate.getMonth() === today.getMonth() &&
                        sessionDate.getDate() === today.getDate();
        return !isToday && session.startTime > now && session.status === 'scheduled';
      }
    });
  }, [sessions, todayDateString, expertTimezone]);

  const historySessions = useMemo(() => {
    return sessions.filter(session => {
      return session.status === 'completed' || session.status === 'cancelled';
    }).sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  }, [sessions]);

  const getStatusColor = (status: string) => {
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
  const formatStatusText = (status: string) => {
    if (status === 'no-show') {
      return 'cancelled';
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

  const startSession = async (session: Session) => {
    // Prevent multiple simultaneous calls
    if (isStartingSessionRef.current) {
      console.log('⏸️ Start session already in progress, skipping...');
      return;
    }

    try {
      isStartingSessionRef.current = true;
      
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
      
      // Generate Agora tokens if missing
      if (!token || token === 'null' || token === '') {
        const expertUid = Math.floor(Math.random() * 1000000);
        
        try {
          // Generate token for expert
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
            toast.error('Failed to generate call token. Please try again.');
            return;
          } else {
            token = tokenData?.token || null;
            console.log('✅ Agora token generated for expert');
          }
        } catch (tokenErr) {
          console.error('Error generating token:', tokenErr);
          toast.error('Failed to generate call token. Please try again.');
          return;
        }
      }
      
      // Update appointment with channel and token (but keep status as scheduled)
      await supabase
        .from('appointments')
        .update({
          channel_name: channelName,
          token: token
        })
        .eq('id', session.id);
      
      // Create call session in 'pending' status (not active yet)
      const { data: existingCallSession } = await supabase
        .from('call_sessions')
        .select('*')
        .eq('appointment_id', session.id)
        .maybeSingle();
      
      let callSessionId: string | null = null;
      
      if (!existingCallSession) {
        // Create new call session
        const newCallSessionId = `call_${session.id}_${Date.now()}`;
        if (!expert?.auth_id) {
          toast.error('Expert information not available. Please refresh and try again.');
          return;
        }
        
        const { data: newCallSession, error: insertError } = await supabase
          .from('call_sessions')
          .insert({
            id: newCallSessionId,
            expert_id: expert.auth_id,
            user_id: session.clientId,
            appointment_id: session.id,
            channel_name: channelName,
            agora_token: token,
            call_type: session.type === 'video' ? 'video' : 'audio',
            status: 'pending', // Not active until user joins
            selected_duration: session.duration
          })
          .select()
          .single();
        
        if (insertError) {
          console.error('Error creating call session:', insertError);
          toast.error('Failed to create call session. Please try again.');
          return;
        }
        
        callSessionId = newCallSession?.id || null;
      } else {
        // Update existing call session
        await supabase
          .from('call_sessions')
          .update({
            channel_name: channelName,
            agora_token: token,
            status: 'pending' // Reset to pending
          })
          .eq('id', existingCallSession.id);
        callSessionId = existingCallSession.id;
      }
      
      // Send notification to user
      try {
        const callType = session.type === 'video' ? 'Video' : 'Audio';
        const expertName = expert?.name || 'Your expert';
        
        const { error: notificationError } = await supabase.functions.invoke('send-notification', {
          body: {
            userId: session.clientId,
            type: 'session_ready',
            title: `${callType} Session Ready`,
            content: `${expertName} is ready for your scheduled ${callType.toLowerCase()} session. Click to join the call now.`,
            referenceId: callSessionId || session.id,
            senderId: expert?.auth_id,
            data: {
              sessionId: session.id,
              callSessionId: callSessionId,
              channelName: channelName,
              callType: session.type,
              expertName: expertName
            }
          }
        });
        
        if (notificationError) {
          console.warn('⚠️ Failed to send notification to user:', notificationError.message || 'Unknown error');
        } else {
          console.log('✅ Notification sent to user successfully');
        }
      } catch (notificationErr: unknown) {
        const errorMessage = notificationErr instanceof Error ? notificationErr.message : 'Unknown error';
        console.warn('⚠️ Error sending notification to user:', errorMessage);
      }
      
      // Show warning to expert about 5 minute refund policy
      toast.warning('Session Prepared', {
        description: `User has been notified. If you don't join within 5 minutes of the session start time, the user will receive a full refund automatically.`,
        duration: 8000
      });
      
      toast.success(`Session prepared. Waiting for ${session.clientName} to join...`);
      
      // Refresh sessions to show updated status
      await fetchSessions();
    } catch (error) {
      console.error('Error starting session:', error);
      toast.error('Failed to prepare session. Please try again.');
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
    getStatusColor: (status: string) => string;
  }> = ({ session, appointmentDate, startTime, onSelect, onStart, onEnd, formatTime, formatDuration, getTypeIcon, getStatusColor }) => {
    const { warningData } = useExpertNoShowWarning(
      session.id,
      appointmentDate,
      startTime,
      session.status
    );

    const isWarning = warningData?.isWarning || false;
    const isNoShow = warningData?.isNoShow || false;
    const minutesRemaining = warningData?.minutesRemaining || 0;

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
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(session.status)}>
              {formatStatusText(session.status)}
            </Badge>
            {session.status === 'scheduled' && new Date() >= session.startTime && (
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

  // Check if there's an active session
  useEffect(() => {
    const activeSession = sessions.find(s => s.status === 'in-progress');
    if (activeSession) {
      setSessionTimer({ isRunning: true, elapsed: 0 });
      // Calculate elapsed time if session has a start time
      if (activeSession.startTime) {
        const elapsed = Math.floor((new Date().getTime() - activeSession.startTime.getTime()) / 1000);
        setSessionTimer({ isRunning: true, elapsed: Math.max(0, elapsed) });
      }
    } else {
      setSessionTimer({ isRunning: false, elapsed: 0 });
    }
  }, [sessions]);

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
            <Tabs defaultValue="today" className="w-full">
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
                
                {loading ? (
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
                                startSession(session);
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
                {loading ? (
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
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={getStatusColor(session.status)}>
                                  {formatStatusText(session.status)}
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
                {loading ? (
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
                                    {session.actualDuration && (
                                      <span className="text-xs">({formatDuration(session.actualDuration)} actual)</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={getStatusColor(session.status)}>
                                  {formatStatusText(session.status)}
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
                  <Badge className={getStatusColor(selectedSession.status)}>
                    {formatStatusText(selectedSession.status)}
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
                  <Button onClick={() => startSession(selectedSession)}>
                    <Play className="h-4 w-4 mr-2" />
                    Start Session
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SessionManager;
