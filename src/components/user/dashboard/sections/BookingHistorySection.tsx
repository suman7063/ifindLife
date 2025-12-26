
import React, { useState, useEffect } from 'react';
import { UserProfile } from '@/types/database/unified';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, User, Plus, Video, AlertTriangle, RefreshCw, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format, isAfter, isBefore, parseISO, isToday as dateFnsIsToday } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useExpertNoShow } from '@/hooks/useExpertNoShow';
import { joinAppointmentCall } from '@/services/callService';
import UserCallInterface from '@/components/call/UserCallInterface';

interface BookingHistorySectionProps {
  user?: UserProfile;
}

interface Booking {
  id: string;
  expert_name: string;
  expert_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
  service_id: number | string | null;
  notes?: string;
  duration: number;
  payment_status?: string;
  channel_name?: string;
  token?: string;
  created_at: string;
}

type FilterType = 'all' | 'upcoming' | 'past' | 'today';

// Separate component for booking card to use hooks
const BookingCard: React.FC<{
  booking: Booking;
  canJoinCall: boolean;
  navigate: (path: string) => void;
  getStatusColor: (status: string, isNoShow?: boolean) => string;
  formatTime: (timeStr: string) => string;
  onJoinCall?: (appointmentId: string, expertId: string, expertName: string) => void;
}> = ({ booking, canJoinCall, navigate, getStatusColor, formatTime, onJoinCall }) => {
  const { noShowData, isChecking, reportNoShow } = useExpertNoShow(
    booking.id,
    booking.appointment_date,
    booking.start_time,
    booking.status
  );

  const isNoShow = noShowData?.isNoShow || false;
  const canReportNoShow = noShowData?.canReportNoShow || false;
  const refundProcessed = noShowData?.refundProcessed || false;
  const isWarning = noShowData?.isWarning || false;

  // Check if this is a cancelled appointment with expert_no_show reason
  const isExpertNoShowCancelled = booking.status === 'cancelled' && (() => {
    try {
      const notesData = typeof booking.notes === 'string' ? JSON.parse(booking.notes) : booking.notes;
      return notesData?.cancellation_reason === 'expert_no_show';
    } catch {
      return false;
    }
  })();

  return (
    <Card key={booking.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold">{booking.expert_name}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {format(parseISO(booking.appointment_date), 'EEEE, MMMM d, yyyy')}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {booking.duration} min
                  </div>
                </div>
              </div>
              <Badge className={getStatusColor(booking.status, isNoShow)}>
                {isNoShow ? 'Expert No-Show' : booking.status}
              </Badge>
            </div>
            
            {/* Warning: Expert hasn't joined yet (3-5 minutes) */}
            {isWarning && !isNoShow && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-900">
                      Waiting for expert to join
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      The expert hasn't joined your session yet. If they don't join within {5 - (noShowData?.timeSinceStart || 0)} minute(s), you'll receive a full refund automatically. No action needed from your side.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* No-Show Alert - Only show if NOT cancelled (cancelled appointments show cancellation info instead) */}
            {isNoShow && booking.status !== 'cancelled' && (
              <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-md">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-orange-900">
                      Expert did not join the session
                    </p>
                    <p className="text-xs text-orange-700 mt-1">
                      {refundProcessed 
                        ? 'Full refund has been processed and credited to your wallet automatically. No action needed from your side.'
                        : 'Refund is being processed automatically. You will receive a full refund shortly. No action needed from your side.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Cancellation Info - Show for cancelled appointments */}
            {booking.status === 'cancelled' && booking.notes && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-900 mb-1">
                      Appointment Cancelled
                    </p>
                    {(() => {
                      try {
                        const notesData = typeof booking.notes === 'string' ? JSON.parse(booking.notes) : booking.notes;
                        const cancellationReason = notesData?.cancellation_reason || notesData?.reason || 'Unknown reason';
                        const cancelledAt = notesData?.cancelled_at ? format(parseISO(notesData.cancelled_at), 'MMM d, yyyy h:mm a') : null;
                        
                        const reasonText = cancellationReason === 'expert_no_show' 
                          ? 'Expert did not join the session'
                          : cancellationReason === 'user_cancelled'
                          ? 'Cancelled by you'
                          : cancellationReason === 'expert_cancelled'
                          ? 'Cancelled by expert'
                          : cancellationReason.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                        
                        return (
                          <div className="text-xs text-red-700 space-y-1">
                            <p><span className="font-medium">Reason:</span> {reasonText}</p>
                            {cancelledAt && (
                              <p><span className="font-medium">Cancelled on:</span> {cancelledAt}</p>
                            )}
                            {isExpertNoShowCancelled && refundProcessed && (
                              <p className="text-xs text-green-700 mt-2 font-medium">
                                ✓ Refund has been processed and credited to your wallet automatically.
                              </p>
                            )}
                            {isExpertNoShowCancelled && !refundProcessed && (
                              <p className="text-xs text-blue-700 mt-2 font-medium">
                                Refund will be processed automatically. Please wait a moment.
                              </p>
                            )}
                          </div>
                        );
                      } catch {
                        // If not JSON, display as plain text
                        return (
                          <p className="text-xs text-red-700">{booking.notes}</p>
                        );
                      }
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* Regular Notes (non-cancelled) */}
            {booking.notes && booking.status !== 'cancelled' && !isNoShow && (
              <div className="mt-3 p-3 bg-muted rounded-md">
                <p className="text-sm">{booking.notes}</p>
              </div>
            )}

            {/* Show waiting warning when appointment time has arrived but expert hasn't joined */}
            {canJoinCall && !isNoShow && !isWarning && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-900">
                      {booking.channel_name ? 'Session Ready - Join Now' : 'Waiting for expert to join'}
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      {booking.channel_name 
                        ? 'Expert has started the session. Click Join to connect.'
                        : 'The expert hasn\'t joined your session yet. If they don\'t join within 5 minutes, you\'ll receive a full refund automatically.'}
                    </p>
                    {booking.channel_name && onJoinCall && (
                      <Button
                        size="sm"
                        className="mt-3 w-full sm:w-auto"
                        onClick={() => onJoinCall(booking.id, booking.expert_id, booking.expert_name)}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Join Call
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const BookingHistorySection: React.FC<BookingHistorySectionProps> = ({ user }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('today');
  const navigate = useNavigate();
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<{id: string; authId: string; name: string; avatar?: string} | null>(null);
  const [appointmentCallData, setAppointmentCallData] = useState<{callSessionId: string; channelName: string; token: string | null; uid: number; callType: 'audio' | 'video'} | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchBookingHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Handle join call from notification
  const handleJoinCallFromNotification = async (appointmentId: string, expertId: string, expertName: string) => {
    try {
      // Get call data for appointment
      const callData = await joinAppointmentCall(appointmentId);
      if (!callData) {
        toast.error('Call session not ready. Please wait for expert to start the session.');
        return;
      }

      // Get expert details
      const { data: expert } = await supabase
        .from('experts')
        .select('id, auth_id, name, profile_picture')
        .eq('auth_id', expertId)
        .maybeSingle();

      // Set selected expert and call data, then open call modal
      setSelectedExpert({
        id: expert?.id || expertId,
        authId: expert?.auth_id || expertId,
        name: expert?.name || expertName,
        avatar: expert?.profile_picture || undefined
      });
      
      setAppointmentCallData({
        callSessionId: callData.callSessionId,
        channelName: callData.channelName,
        token: callData.token,
        uid: callData.uid,
        callType: callData.callType
      });
      
      setIsCallModalOpen(true);
    } catch (error) {
      console.error('Error joining appointment call:', error);
      toast.error('Failed to join call. Please try again.');
    }
  };

  // Listen for join call events from notifications
  useEffect(() => {
    const handleJoinCall = async (event: CustomEvent) => {
      const { appointmentId } = event.detail;
      if (appointmentId) {
        // Find the booking
        const booking = bookings.find(b => b.id === appointmentId);
        if (booking && booking.channel_name) {
          // Trigger join call
          handleJoinCallFromNotification(appointmentId, booking.expert_id, booking.expert_name);
        } else {
          // Fetch booking if not found
          const { data: appointment } = await supabase
            .from('appointments')
            .select('id, expert_id, expert_name, channel_name')
            .eq('id', appointmentId)
            .single();
          
          if (appointment && appointment.channel_name) {
            // Get expert details
            const { data: expert } = await supabase
              .from('experts')
              .select('auth_id, name, profile_picture')
              .eq('id', appointment.expert_id)
              .maybeSingle();
            
            if (expert) {
              handleJoinCallFromNotification(appointmentId, expert.auth_id, expert.name || appointment.expert_name);
            }
          }
        }
      }
    };

    window.addEventListener('joinAppointmentCall', handleJoinCall as EventListener);
    return () => {
      window.removeEventListener('joinAppointmentCall', handleJoinCall as EventListener);
    };
  }, [bookings]);

  const fetchBookingHistory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user?.id)
        .in('status', ['scheduled', 'confirmed', 'completed', 'cancelled', 'in-progress']);
        // Don't order in query - we'll sort client-side for better control

      if (error) throw error;
      
      console.log('📅 Fetched appointments:', data?.length, 'appointments');
      console.log('📅 Sample appointments:', data?.slice(0, 3).map(a => ({
        id: a.id,
        date: a.appointment_date,
        time: `${a.start_time} - ${a.end_time}`,
        status: a.status
      })));
      
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching booking history:', error);
      toast.error('Failed to load booking history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string, isNoShow?: boolean) => {
    if (isNoShow) {
      return 'bg-orange-100 text-orange-800 border-orange-200';
    }
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTime = (timeStr: string): string => {
    try {
      // Handle HH:MM:SS format (take only HH:MM)
      const timeParts = timeStr.split(':');
      const hours = timeParts[0];
      const minutes = timeParts[1] || '00';
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeStr;
    }
  };

  const isUpcoming = (booking: Booking): boolean => {
    try {
      // Handle HH:MM:SS format (take only HH:MM for parsing)
      const startTime = booking.start_time.split(':').slice(0, 2).join(':');
      const appointmentDateTime = parseISO(`${booking.appointment_date}T${startTime}`);
      return isAfter(appointmentDateTime, new Date()) && (booking.status === 'scheduled' || booking.status === 'confirmed');
    } catch {
      return false;
    }
  };

  const isPast = (booking: Booking): boolean => {
    try {
      // Handle HH:MM:SS format (take only HH:MM for parsing)
      const endTime = booking.end_time.split(':').slice(0, 2).join(':');
      const appointmentDateTime = parseISO(`${booking.appointment_date}T${endTime}`);
      return isBefore(appointmentDateTime, new Date()) || booking.status === 'completed' || booking.status === 'cancelled';
    } catch {
      return false;
    }
  };

  const isToday = (booking: Booking): boolean => {
    try {
      const appointmentDate = parseISO(booking.appointment_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const bookingDate = new Date(appointmentDate);
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate.getTime() === today.getTime();
    } catch {
      return false;
    }
  };

  const filteredBookings = bookings
    .filter(booking => {
      if (filter === 'upcoming') return isUpcoming(booking);
      if (filter === 'past') return isPast(booking);
      if (filter === 'today') return isToday(booking);
      return true;
    })
    .sort((a, b) => {
      // Sort by date first (ascending: 15, 16, 17, 18...)
      const dateA = parseISO(a.appointment_date);
      const dateB = parseISO(b.appointment_date);
      const dateDiff = dateA.getTime() - dateB.getTime();
      
      if (dateDiff !== 0) return dateDiff;
      
      // If same date, sort by start time (ascending: 12:00, 12:30, 1:00...)
      try {
        // Get time in HH:MM format (handle HH:MM:SS)
        const timeA = a.start_time.split(':').slice(0, 2).join(':');
        const timeB = b.start_time.split(':').slice(0, 2).join(':');
        
        // Convert time to minutes for comparison (24-hour format)
        // Handle HH:MM format (e.g., "10:00" -> 600, "23:00" -> 1380)
        // Handle "24:00" as 1440 minutes (midnight)
        const parseTimeToMinutes = (timeStr: string): number => {
          const parts = timeStr.split(':');
          const hours = parseInt(parts[0] || '0', 10);
          const minutes = parseInt(parts[1] || '0', 10);
          
          // Handle 24:00 as midnight (1440 minutes)
          if (hours === 24 || timeStr.startsWith('24:')) {
            return 24 * 60; // 1440 minutes
          }
          
          return hours * 60 + minutes;
        };
        
        const totalMinutesA = parseTimeToMinutes(timeA);
        const totalMinutesB = parseTimeToMinutes(timeB);
        
        // Ascending order: earliest time first (12:00, 12:30, 1:00, 1:30...)
        return totalMinutesA - totalMinutesB;
      } catch (error) {
        console.error('Error sorting by time:', error, a.start_time, b.start_time);
        return 0;
      }
    });

  const stats = {
    total: bookings.length,
    upcoming: bookings.filter(isUpcoming).length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    today: bookings.filter(isToday).length,
  };

  const canJoinCall = (booking: Booking): boolean => {
    if (booking.status !== 'scheduled' && booking.status !== 'confirmed' && booking.status !== 'in-progress') return false;
    try {
      // Handle HH:MM:SS format (take only HH:MM for parsing)
      const startTime = booking.start_time.split(':').slice(0, 2).join(':');
      const appointmentDateTime = parseISO(`${booking.appointment_date}T${startTime}`);
      const now = new Date();
      const timeDiff = appointmentDateTime.getTime() - now.getTime();
      
      // Can join only when:
      // 1. Appointment has started (timeDiff <= 0) - not before
      // 2. And within the session duration (30 minutes after start)
      const sessionEndTime = appointmentDateTime.getTime() + (booking.duration || 30) * 60 * 1000;
      const isWithinSession = now.getTime() <= sessionEndTime;
      
      // Only show button when appointment time has arrived (not before)
      return timeDiff <= 0 && isWithinSession;
    } catch {
      return false;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">My Appointments</h2>
            <p className="text-muted-foreground text-xs font-light">Manage your scheduled sessions and join calls</p>
          </div>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">My Appointments</h2>
          <p className="text-muted-foreground">Manage your scheduled sessions and join calls</p>
        </div>
        <Button onClick={() => navigate('/experts')}>
          <Plus className="h-4 w-4 mr-2" />
          Book New Session
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Total</div>
            <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Upcoming</div>
            <div className="text-3xl font-bold text-green-600">{stats.upcoming}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Completed</div>
            <div className="text-3xl font-bold text-purple-600">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Cancelled</div>
            <div className="text-3xl font-bold text-red-600">{stats.cancelled}</div>
          </CardContent>
        </Card>
      </div>

      {/* Sessions List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Your Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
            <TabsList>
              <TabsTrigger value="today">
                Today ({stats.today})
              </TabsTrigger>
              <TabsTrigger value="upcoming">
                Upcoming ({stats.upcoming})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past ({stats.completed + stats.cancelled})
              </TabsTrigger>
              <TabsTrigger value="all">
                All ({stats.total})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={filter} className="mt-6">
              {filteredBookings.length > 0 ? (
                <div className="space-y-4">
                  {filteredBookings.map((booking) => (
                    <BookingCard 
                      key={booking.id} 
                      booking={booking}
                      canJoinCall={canJoinCall(booking)}
                      navigate={navigate}
                      getStatusColor={getStatusColor}
                      formatTime={formatTime}
                      onJoinCall={handleJoinCallFromNotification}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">
                    {filter === 'today' ? 'No appointments today' 
                     : filter === 'upcoming' ? 'No upcoming appointments' 
                     : filter === 'past' ? 'No past appointments' 
                     : 'No appointments'}
                  </h3>
                  <p className="text-muted-foreground">
                    {filter === 'today'
                      ? 'You don\'t have any appointments scheduled for today.'
                      : filter === 'upcoming' 
                      ? 'Book a session with one of our experts to get started.'
                      : 'Your appointment history will appear here.'}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Call Modal for Appointment Calls */}
      {selectedExpert && (
        <UserCallInterface
          isOpen={isCallModalOpen}
          onClose={() => {
            setIsCallModalOpen(false);
            setSelectedExpert(null);
            setAppointmentCallData(null);
          }}
          expertId={selectedExpert.id}
          expertAuthId={selectedExpert.authId}
          expertName={selectedExpert.name}
          expertAvatar={selectedExpert.avatar}
          expertPrice={30}
          existingCallData={appointmentCallData || undefined}
        />
      )}
    </div>
  );
};

export default BookingHistorySection;
