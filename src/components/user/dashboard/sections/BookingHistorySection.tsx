
import React, { useState, useEffect } from 'react';
import { UserProfile } from '@/types/database/unified';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface BookingHistorySectionProps {
  user?: UserProfile;
}

interface Booking {
  id: string;
  expert_name: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
  service_id: number;
  notes?: string;
  duration: number;
}

const BookingHistorySection: React.FC<BookingHistorySectionProps> = ({ user }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchBookingHistory();
    }
  }, [user?.id]);

  const fetchBookingHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

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
      case 'completed': return 'bg-green-500';
      case 'confirmed': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Booking History</h2>
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
      <div>
        <h2 className="text-3xl font-bold">Booking History</h2>
        <p className="text-muted-foreground">View your past and upcoming appointments</p>
      </div>

      {bookings.length > 0 ? (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{booking.expert_name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(booking.appointment_date).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.start_time} - {booking.end_time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.duration} minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Online Session</span>
                  </div>
                </div>
                {booking.notes && (
                  <div className="mt-3 p-2 bg-muted rounded-md">
                    <p className="text-sm">{booking.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-muted p-12 rounded-lg text-center">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No Bookings Yet</h3>
          <p className="text-muted-foreground mb-6">
            You haven't made any appointments yet. Book your first session with an expert!
          </p>
          <Button>
            <a href="/experts">Find Experts</a>
          </Button>
        </div>
      )}
    </div>
  );
};

export default BookingHistorySection;
