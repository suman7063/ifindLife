
import React, { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Video, X } from 'lucide-react';
import { useUserAuth } from '@/hooks/useUserAuth';
import { useAppointments, Appointment } from '@/hooks/auth/useAppointments';
import { useDoxyme } from '@/hooks/auth/useDoxyme';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const AppointmentsManagement: React.FC = () => {
  const { currentUser } = useUserAuth();
  const { fetchUserAppointments, cancelAppointment, isLoading } = useAppointments();
  const { joinScheduledSession } = useDoxyme();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  useEffect(() => {
    if (currentUser?.id) {
      loadAppointments();
    }
  }, [currentUser]);
  
  const loadAppointments = async () => {
    if (!currentUser?.id) return;
    const data = await fetchUserAppointments(currentUser.id);
    setAppointments(data);
  };
  
  const handleJoinSession = (appointment: Appointment) => {
    if (!appointment.roomUrl) {
      toast.error('Room URL not available for this appointment');
      return;
    }
    
    joinScheduledSession(appointment.roomUrl, appointment.expertName);
  };
  
  const handleCancelAppointment = async (id: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      const success = await cancelAppointment(id);
      if (success) {
        loadAppointments();
      }
    }
  };
  
  const upcomingAppointments = appointments.filter(app => app.status === 'scheduled');
  const pastAppointments = appointments.filter(app => app.status !== 'scheduled');
  
  const formatAppointmentDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'PPP p'); // Example: April 29th, 2023, 3:30 PM
    } catch (e) {
      return dateString;
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Appointments</h2>
      
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcomingAppointments.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastAppointments.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4 mt-4">
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              You don't have any upcoming appointments.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {upcomingAppointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{appointment.expertName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-ifind-aqua" />
                        {formatAppointmentDate(appointment.appointmentDate)}
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-ifind-purple" />
                        {appointment.duration} minutes
                      </div>
                      
                      {appointment.notes && (
                        <div className="text-sm mt-2">
                          <p className="font-medium">Notes:</p>
                          <p className="text-muted-foreground">{appointment.notes}</p>
                        </div>
                      )}
                      
                      <div className="flex gap-2 mt-4">
                        <Button 
                          variant="default" 
                          className="flex-1 bg-ifind-teal hover:bg-ifind-teal/80"
                          onClick={() => handleJoinSession(appointment)}
                        >
                          <Video className="h-4 w-4 mr-1" />
                          Join Session
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          className="flex-1 border-red-500 text-red-500 hover:bg-red-500/10"
                          onClick={() => handleCancelAppointment(appointment.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4 mt-4">
          {pastAppointments.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              You don't have any past appointments.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {pastAppointments.map((appointment) => (
                <Card key={appointment.id} className="opacity-80">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{appointment.expertName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-ifind-aqua" />
                        {formatAppointmentDate(appointment.appointmentDate)}
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-ifind-purple" />
                        {appointment.duration} minutes
                      </div>
                      
                      <div className="text-sm font-medium">
                        Status: <span className="capitalize">{appointment.status}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppointmentsManagement;
