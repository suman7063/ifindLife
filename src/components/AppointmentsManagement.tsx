import React, { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Video, X } from 'lucide-react';
import { useUserAuth } from '@/hooks/useUserAuth';
import { useAppointments, Appointment } from '@/hooks/auth/useAppointments';
import { useAgora } from '@/hooks/auth/useAgora';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import VideoCall from './VideoCall';

const AppointmentsManagement: React.FC = () => {
  const { currentUser } = useUserAuth();
  const { fetchUserAppointments, cancelAppointment, isLoading } = useAppointments();
  const { useClient, useMicrophoneAndCameraTracks } = useAgora();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isVideoSessionOpen, setIsVideoSessionOpen] = useState(false);
  const [inCall, setInCall] = useState(false);
  
  const client = useClient();
  const { ready, tracks } = useMicrophoneAndCameraTracks();
  
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
  
  const handleJoinSession = async (appointment: Appointment) => {
    if (!appointment.channelName || !appointment.token) {
      toast.error('Video session information not available for this appointment');
      return;
    }
    
    setSelectedAppointment(appointment);
    setIsVideoSessionOpen(true);
    
    if (ready) {
      try {
        client.on('user-published', async (user, mediaType) => {
          await client.subscribe(user, mediaType);
          if (mediaType === 'audio') {
            user.audioTrack?.play();
          }
        });
        
        await client.join(
          'your-agora-app-id',
          appointment.channelName,
          appointment.token,
          appointment.uid
        );
        
        if (tracks) {
          await client.publish(tracks);
          setInCall(true);
          toast.success(`Joined session with ${appointment.expertName}`);
        }
      } catch (error) {
        console.error('Error joining Agora session:', error);
        toast.error('Failed to join video session');
      }
    }
  };
  
  const handleEndSession = async () => {
    if (inCall) {
      client.leave();
      tracks?.[0].close();
      tracks?.[1].close();
      setInCall(false);
    }
    
    setIsVideoSessionOpen(false);
    setSelectedAppointment(null);
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
      return format(date, 'PPP p');
    } catch (e) {
      return dateString;
    }
  };
  
  return (
    <>
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
      
      <Dialog open={isVideoSessionOpen} onOpenChange={(open) => !open && handleEndSession()}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              Video Session with {selectedAppointment?.expertName}
            </DialogTitle>
          </DialogHeader>
          
          <div className="h-64 md:h-80 mt-4">
            {ready && inCall && (
              <VideoCall
                client={client}
                tracks={tracks}
                setStart={setInCall}
                channelName={selectedAppointment?.channelName || ''}
              />
            )}
            
            {(!ready || !inCall) && (
              <div className="w-full h-full flex items-center justify-center bg-slate-100 rounded-lg">
                <div className="w-16 h-16 border-4 border-ifind-aqua border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          
          <div className="flex justify-center mt-4">
            <Button
              variant="destructive"
              onClick={handleEndSession}
            >
              End Session
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AppointmentsManagement;
