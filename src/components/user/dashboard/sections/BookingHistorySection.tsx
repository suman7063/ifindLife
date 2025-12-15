
import React, { useState, useEffect } from 'react';
import { UserProfile } from '@/types/database/unified';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, User, Plus, Video } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format, isAfter, isBefore, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';

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

type FilterType = 'all' | 'upcoming' | 'past';

const BookingHistorySection: React.FC<BookingHistorySectionProps> = ({ user }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      fetchBookingHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const fetchBookingHistory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user?.id)
        .order('appointment_date', { ascending: false })
        .order('start_time', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching booking history:', error);
      toast.error('Failed to load booking history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
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
      const [hours, minutes] = timeStr.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeStr;
    }
  };

  const isUpcoming = (booking: Booking): boolean => {
    try {
      const appointmentDateTime = parseISO(`${booking.appointment_date}T${booking.start_time}`);
      return isAfter(appointmentDateTime, new Date()) && booking.status === 'scheduled';
    } catch {
      return false;
    }
  };

  const isPast = (booking: Booking): boolean => {
    try {
      const appointmentDateTime = parseISO(`${booking.appointment_date}T${booking.end_time}`);
      return isBefore(appointmentDateTime, new Date()) || booking.status === 'completed' || booking.status === 'cancelled';
    } catch {
      return false;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'upcoming') return isUpcoming(booking);
    if (filter === 'past') return isPast(booking);
    return true;
  });

  const stats = {
    total: bookings.length,
    upcoming: bookings.filter(isUpcoming).length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  const canJoinCall = (booking: Booking): boolean => {
    if (booking.status !== 'scheduled') return false;
    try {
      const appointmentDateTime = parseISO(`${booking.appointment_date}T${booking.start_time}`);
      const now = new Date();
      const timeDiff = appointmentDateTime.getTime() - now.getTime();
      // Can join 15 minutes before start time
      return timeDiff <= 15 * 60 * 1000 && timeDiff >= -30 * 60 * 1000;
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
            <p className="text-muted-foreground">Manage your scheduled sessions and join calls</p>
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
                              <Badge className={getStatusColor(booking.status)}>
                                {booking.status}
                              </Badge>
                            </div>
                            
                            {booking.notes && (
                              <div className="mt-3 p-3 bg-muted rounded-md">
                                <p className="text-sm">{booking.notes}</p>
                              </div>
                            )}

                            {canJoinCall(booking) && (
                              <div className="mt-4 flex gap-2">
                                <Button 
                                  size="sm" 
                                  onClick={() => {
                                    // Navigate to call page or open call interface
                                    if (booking.channel_name && booking.token) {
                                      navigate(`/call/${booking.id}`);
                                    } else {
                                      toast.info('Call session is being prepared. Please wait a moment.');
                                    }
                                  }}
                                >
                                  <Video className="h-4 w-4 mr-2" />
                                  Join Call
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">
                    {filter === 'upcoming' ? 'No upcoming appointments' : filter === 'past' ? 'No past appointments' : 'No appointments'}
                  </h3>
                  <p className="text-muted-foreground">
                    {filter === 'upcoming' 
                      ? 'Book a session with one of our experts to get started.'
                      : 'Your appointment history will appear here.'}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingHistorySection;
