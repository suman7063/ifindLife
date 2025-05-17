import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Appointment {
  id: string;
  name: string;
  avatar: string;
  date: string;
  time: string;
}

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
  isLoading: boolean;
}

const mockAppointments: Appointment[] = [
  {
    id: '1',
    name: 'John Doe',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    date: format(new Date(), 'MMM d, yyyy'),
    time: '10:00 AM',
  },
  {
    id: '2',
    name: 'Jane Smith',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    date: format(new Date(), 'MMM d, yyyy'),
    time: '2:00 PM',
  },
];

const UpcomingAppointments: React.FC<UpcomingAppointmentsProps> = ({ appointments = mockAppointments, isLoading }) => {
  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Upcoming Appointments</CardTitle>
          <CardDescription>Your schedule for the next few days</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="h-8">
          <Calendar className="h-4 w-4 mr-2" />
          View Calendar
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-16 bg-muted rounded-md animate-pulse" />
            <div className="h-16 bg-muted rounded-md animate-pulse" />
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>No upcoming appointments scheduled.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment, index) => (
              <div key={index} className="flex items-center gap-4 border p-3 rounded-lg">
                <Avatar className="h-12 w-12 border">
                  <AvatarImage src={appointment[0]?.avatar || ''} />
                  <AvatarFallback>{appointment[0]?.name?.charAt(0) || 'C'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="font-medium">{appointment[0]?.name || 'Client'}</div>
                  <div className="text-sm flex items-center text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    <span>{appointment[0]?.date || 'No date'}</span>
                    <span className="mx-2">•</span>
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    <span>{appointment[0]?.time || 'No time'}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingAppointments;
