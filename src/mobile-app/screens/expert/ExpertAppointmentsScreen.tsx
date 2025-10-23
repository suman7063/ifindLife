import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Video, 
  MessageSquare, 
  Clock,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Phone
} from 'lucide-react';

// Mock data
const upcomingAppointments = [
  {
    id: 1,
    clientName: 'Sarah Wilson',
    date: 'Today',
    time: '10:00 AM',
    type: 'video',
    duration: '30 min',
    fee: 50,
    status: 'confirmed'
  },
  {
    id: 2,
    clientName: 'Michael Chen',
    date: 'Today',
    time: '2:30 PM',
    type: 'chat',
    duration: '45 min',
    fee: 45,
    status: 'confirmed'
  },
  {
    id: 3,
    clientName: 'Emma Davis',
    date: 'Tomorrow',
    time: '11:00 AM',
    type: 'video',
    duration: '60 min',
    fee: 75,
    status: 'pending'
  }
];

const pastAppointments = [
  {
    id: 4,
    clientName: 'John Smith',
    date: 'Yesterday',
    time: '3:00 PM',
    type: 'video',
    duration: '30 min',
    fee: 50,
    status: 'completed'
  },
  {
    id: 5,
    clientName: 'Lisa Brown',
    date: '2 days ago',
    time: '1:00 PM',
    type: 'chat',
    duration: '45 min',
    fee: 45,
    status: 'completed'
  }
];

export const ExpertAppointmentsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/10 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'completed':
        return 'bg-blue-500/10 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const AppointmentCard = ({ appointment }: { appointment: any }) => (
    <Card className="border-border/50 hover:border-ifind-aqua/30 transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-ifind-aqua to-ifind-teal rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {appointment.clientName.charAt(0)}
              </span>
            </div>
            <div>
              <h4 className="font-poppins font-medium text-ifind-charcoal">
                {appointment.clientName}
              </h4>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{appointment.date}</span>
                <span>•</span>
                <Clock className="h-3 w-3" />
                <span>{appointment.time}</span>
              </div>
            </div>
          </div>
          <Badge className={getStatusColor(appointment.status)}>
            {appointment.status}
          </Badge>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              {appointment.type === 'video' ? (
                <Video className="h-4 w-4 text-ifind-teal" />
              ) : (
                <MessageSquare className="h-4 w-4 text-ifind-aqua" />
              )}
              <span>{appointment.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span>${appointment.fee}</span>
            </div>
          </div>

          {appointment.status === 'pending' && (
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline" className="h-8 text-green-600 border-green-200 hover:bg-green-50">
                <CheckCircle className="h-3 w-3 mr-1" />
                Accept
              </Button>
              <Button size="sm" variant="outline" className="h-8 text-red-600 border-red-200 hover:bg-red-50">
                <XCircle className="h-3 w-3" />
              </Button>
            </div>
          )}

          {appointment.status === 'confirmed' && (
            <Button size="sm" className="bg-gradient-to-r from-ifind-teal to-ifind-aqua">
              <Phone className="h-3 w-3 mr-1" />
              Join
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-ifind-teal/10 via-ifind-aqua/10 to-ifind-purple/10 p-6 rounded-b-3xl">
        <h1 className="text-2xl font-poppins font-bold text-ifind-charcoal mb-2">
          Appointments
        </h1>
        <p className="text-muted-foreground">
          Manage your consultation schedule
        </p>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastAppointments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-3">
            {upcomingAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </TabsContent>

          <TabsContent value="past" className="space-y-3">
            {pastAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
