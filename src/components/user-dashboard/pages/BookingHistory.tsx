
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, User, Phone, MessageCircle, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BookingHistory: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const { toast } = useToast();

  const upcomingBookings = [
    {
      id: '1',
      program: 'Stress Management Session',
      expert: 'Dr. Sarah Wilson',
      date: '2024-01-25',
      time: '14:00',
      duration: '60 minutes',
      status: 'Confirmed',
      type: 'Individual Session',
      notes: 'Focus on workplace stress management techniques'
    },
    {
      id: '2',
      program: 'Mindfulness Meditation',
      expert: 'Dr. Michael Chen',
      date: '2024-01-26',
      time: '10:00',
      duration: '45 minutes',
      status: 'Confirmed',
      type: 'Group Session',
      notes: 'Introduction to breathing techniques'
    }
  ];

  const pastBookings = [
    {
      id: '3',
      program: 'Anxiety Relief Session',
      expert: 'Dr. Emily Rodriguez',
      date: '2024-01-20',
      time: '16:30',
      duration: '60 minutes',
      status: 'Completed',
      type: 'Individual Session',
      rating: 5,
      feedback: 'Excellent session, very helpful techniques'
    },
    {
      id: '4',
      program: 'Sleep Improvement',
      expert: 'Dr. James Thompson',
      date: '2024-01-18',
      time: '19:00',
      duration: '45 minutes',
      status: 'Completed',
      type: 'Individual Session',
      rating: 4,
      feedback: 'Good insights on sleep hygiene'
    }
  ];

  const handleCancelBooking = (bookingId: string) => {
    toast({
      title: "Booking Cancelled",
      description: "Your booking has been cancelled successfully. You will receive a confirmation email shortly.",
    });
  };

  const handleReschedule = (bookingId: string) => {
    toast({
      title: "Reschedule Request",
      description: "Please contact support to reschedule your booking.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const BookingCard = ({ booking, isPast = false }: { booking: any; isPast?: boolean }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{booking.program}</h3>
            <div className="flex items-center gap-2 mt-1">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">{booking.expert}</span>
            </div>
          </div>
          <Badge className={getStatusColor(booking.status)}>
            {booking.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {new Date(booking.date).toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {booking.time} ({booking.duration})
            </span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-1">Session Type:</p>
          <p className="text-sm text-gray-600">{booking.type}</p>
        </div>

        {booking.notes && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
            <p className="text-sm text-gray-600">{booking.notes}</p>
          </div>
        )}

        {isPast && booking.rating && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-700">Your Rating:</span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < booking.rating 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            {booking.feedback && (
              <p className="text-sm text-gray-600 italic">"{booking.feedback}"</p>
            )}
          </div>
        )}

        <div className="flex gap-2">
          {!isPast ? (
            <>
              <Button size="sm" variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Join Session
              </Button>
              <Button size="sm" variant="outline">
                <MessageCircle className="h-4 w-4 mr-2" />
                Message Expert
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleReschedule(booking.id)}
              >
                Reschedule
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => handleCancelBooking(booking.id)}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="outline">
                Book Again
              </Button>
              <Button size="sm" variant="outline">
                Download Notes
              </Button>
              {!booking.rating && (
                <Button size="sm">
                  Rate Session
                </Button>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Booking History</h2>
        <p className="text-gray-600 mt-2">
          Manage your upcoming sessions and view past bookings
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
          <TabsTrigger value="past">Past Sessions ({pastBookings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          <div className="space-y-4">
            {pastBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} isPast />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BookingHistory;
