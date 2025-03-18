
import React, { useEffect, useState } from 'react';
import { format, parseISO, isBefore, addMinutes } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Video, X, Check, AlertTriangle } from 'lucide-react';
import { useUserAuth } from '@/hooks/useUserAuth';
import { useAppointments, Appointment, AppointmentStatus } from '@/hooks/auth/useAppointments';
import { useAgora } from '@/hooks/auth/useAgora';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import VideoSessionWithTimer from './VideoSessionWithTimer';
import { Badge } from '@/components/ui/badge';

const AppointmentsManagement: React.FC = () => {
  const { currentUser } = useUserAuth();
  const { 
    fetchUserAppointments, 
    cancelAppointment, 
    markUserNoShow,
    markExpertNoShow,
    isLoading 
  } = useAppointments();
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
    
    // Reload appointments to get updated status
    await loadAppointments();
  };
  
  const handleCancelAppointment = async (id: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      const success = await cancelAppointment(id);
      if (success) {
        loadAppointments();
      }
    }
  };
  
  const handleNoShow = async (id: string, isExpert: boolean) => {
    const message = isExpert 
      ? 'Mark the expert as no-show? This will process a refund.'
      : 'Mark yourself as no-show? You will forfeit the session fee.';
      
    if (window.confirm(message)) {
      const success = isExpert 
        ? await markExpertNoShow(id)
        : await markUserNoShow(id);
        
      if (success) {
        loadAppointments();
      }
    }
  };
  
  const upcomingAppointments = appointments.filter(app => 
    app.status === 'scheduled' && isBefore(new Date(), parseISO(app.appointmentDate))
  );
  
  const activeAppointments = appointments.filter(app => 
    app.status === 'scheduled' && 
    !isBefore(new Date(), parseISO(app.appointmentDate)) && 
    isBefore(new Date(), addMinutes(parseISO(app.appointmentDate), app.duration))
  );
  
  const pastAppointments = appointments.filter(app => 
    app.status !== 'scheduled' || 
    isBefore(addMinutes(parseISO(app.appointmentDate), app.duration), new Date())
  );
  
  const getStatusBadge = (status: AppointmentStatus) => {
    switch(status) {
      case 'scheduled':
        return <Badge className="bg-blue-500">Scheduled</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-orange-500">Cancelled</Badge>;
      case 'no-show-user':
        return <Badge className="bg-red-500">No-show (You)</Badge>;
      case 'no-show-expert':
        return <Badge className="bg-purple-500">No-show (Expert)</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
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
            <TabsTrigger value="active">Active Now ({activeAppointments.length})</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming ({upcomingAppointments.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({pastAppointments.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-4 mt-4">
            {activeAppointments.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                You don't have any active sessions right now.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {activeAppointments.map((appointment) => (
                  <Card key={appointment.id} className="border-l-4 border-l-green-500">
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
                        
                        <div className="flex items-center text-sm font-medium">
                          <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
                          Session in progress!
                        </div>
                        
                        <div className="flex justify-center mt-4">
                          <Button 
                            onClick={() => handleJoinSession(appointment)}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <Video className="h-4 w-4 mr-1" />
                            Join Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
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
                        
                        {appointment.price && (
                          <div className="text-sm">
                            <span className="font-medium">Price:</span> {appointment.currency} {appointment.price.toFixed(2)}
                          </div>
                        )}
                        
                        {appointment.notes && (
                          <div className="text-sm mt-2">
                            <p className="font-medium">Notes:</p>
                            <p className="text-muted-foreground">{appointment.notes}</p>
                          </div>
                        )}
                        
                        <div className="flex gap-2 mt-4">
                          <Button 
                            variant="outline" 
                            className="flex-1 border-red-500 text-red-500 hover:bg-red-500/10"
                            onClick={() => handleCancelAppointment(appointment.id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => {
                              // Add Google Calendar integration here in the future
                              toast.success("Added to calendar");
                            }}
                          >
                            <Calendar className="h-4 w-4 mr-1" />
                            Add to Calendar
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
                    <CardHeader className="pb-2 flex flex-row justify-between items-center">
                      <CardTitle className="text-lg">{appointment.expertName}</CardTitle>
                      {getStatusBadge(appointment.status)}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2 text-ifind-aqua" />
                          {formatAppointmentDate(appointment.appointmentDate)}
                        </div>
                        
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2 text-ifind-purple" />
                          {appointment.actualDuration || appointment.duration} minutes
                          {appointment.actualDuration !== appointment.duration && appointment.actualDuration && (
                            <span className="text-xs ml-2">
                              (Originally {appointment.duration} min)
                            </span>
                          )}
                        </div>
                        
                        {appointment.extensionCount > 0 && (
                          <div className="text-sm">
                            <span className="font-medium">Extensions:</span> {appointment.extensionCount} time(s)
                          </div>
                        )}
                        
                        {appointment.refunded && (
                          <div className="text-sm font-medium text-green-600">
                            <Check className="h-4 w-4 inline mr-1" />
                            Refunded
                          </div>
                        )}
                        
                        {/* No-show Reporting - only for scheduled appointments that are in the past */}
                        {appointment.status === 'scheduled' && (
                          <div className="flex gap-2 mt-4">
                            <Button 
                              size="sm"
                              variant="outline" 
                              className="flex-1 border-red-500 text-red-500 hover:bg-red-500/10"
                              onClick={() => handleNoShow(appointment.id, true)}
                            >
                              Report Expert No-Show
                            </Button>
                            
                            <Button 
                              size="sm"
                              variant="outline" 
                              className="flex-1 border-orange-500 text-orange-500 hover:bg-orange-500/10"
                              onClick={() => handleNoShow(appointment.id, false)}
                            >
                              I Didn't Attend
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <Dialog open={isVideoSessionOpen} onOpenChange={(open) => !open && handleEndSession()} className="max-w-4xl">
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Video Session with {selectedAppointment?.expertName}
            </DialogTitle>
          </DialogHeader>
          
          {ready && inCall && selectedAppointment && (
            <VideoSessionWithTimer
              appointment={selectedAppointment}
              client={client}
              tracks={tracks}
              onEndSession={handleEndSession}
            />
          )}
          
          {(!ready || !inCall) && (
            <div className="w-full h-64 flex items-center justify-center bg-slate-100 rounded-lg">
              <div className="w-16 h-16 border-4 border-ifind-aqua border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AppointmentsManagement;
