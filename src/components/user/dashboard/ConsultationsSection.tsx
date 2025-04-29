
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '@/types/supabase/user';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { format, parseISO, isPast } from 'date-fns';
import { Calendar, CalendarX, Clock, Video } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAppointments } from '@/hooks/useAppointments';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800'
};

interface ConsultationsSectionProps {
  user: UserProfile | null;
}

const ConsultationsSection: React.FC<ConsultationsSectionProps> = ({ user }) => {
  const navigate = useNavigate();
  const { appointments, loading, updateAppointmentStatus } = useAppointments(user);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(null);
  const [joinCallDialogOpen, setJoinCallDialogOpen] = useState(false);
  const [appointmentToJoin, setAppointmentToJoin] = useState<any | null>(null);
  
  const handleCancelAppointment = async () => {
    if (appointmentToCancel) {
      const success = await updateAppointmentStatus(appointmentToCancel, 'cancelled');
      if (success) {
        toast.success('Appointment cancelled successfully');
      }
      setCancelDialogOpen(false);
      setAppointmentToCancel(null);
    }
  };
  
  const initiateCancel = (appointmentId: string) => {
    setAppointmentToCancel(appointmentId);
    setCancelDialogOpen(true);
  };
  
  const joinAppointment = (appointment: any) => {
    setAppointmentToJoin(appointment);
    setJoinCallDialogOpen(true);
  };
  
  const confirmJoinCall = () => {
    if (appointmentToJoin) {
      // In a real app, navigate to the video call page with the appointment ID
      navigate(`/call/${appointmentToJoin.id}`);
      // For now, we'll just show a toast
      toast.info('Joining video call...');
      setJoinCallDialogOpen(false);
    }
  };
  
  const handleBookNewAppointment = () => {
    navigate('/experts');
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Your Consultations</h2>
        <p className="text-muted-foreground">
          View and manage your scheduled consultations with experts
        </p>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleBookNewAppointment}>
          <Calendar className="mr-2 h-4 w-4" />
          Book New Appointment
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Sessions</CardTitle>
          <CardDescription>
            View and manage your scheduled appointments with experts.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <p className="text-center py-6">Loading your appointments...</p>
          ) : appointments.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">You don't have any appointments yet.</p>
              <Button variant="link" className="mt-2" onClick={handleBookNewAppointment}>
                <Calendar className="h-4 w-4 mr-2" />
                Book an appointment
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Expert</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => {
                  const appointmentDate = parseISO(appointment.appointment_date);
                  const isPastAppointment = isPast(appointmentDate);
                  
                  return (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">
                        {appointment.expert_name || 'Expert'}
                      </TableCell>
                      <TableCell>
                        {format(appointmentDate, 'MMMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        {appointment.start_time} - {appointment.end_time}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[appointment.status] || ''}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {appointment.status === 'confirmed' && !isPastAppointment && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="h-8"
                                onClick={() => joinAppointment(appointment)}
                              >
                                <Video className="h-4 w-4 mr-1" />
                                Join
                              </Button>
                              
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="h-8 text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => initiateCancel(appointment.id)}
                              >
                                <CalendarX className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                            </>
                          )}
                          
                          {appointment.status === 'pending' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="h-8 text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => initiateCancel(appointment.id)}
                            >
                              <CalendarX className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          )}
                          
                          {(appointment.status === 'cancelled' || appointment.status === 'completed') && (
                            <span className="text-sm text-muted-foreground">No actions available</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to cancel this appointment? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>No, Keep It</Button>
            <Button variant="destructive" onClick={handleCancelAppointment}>
              Yes, Cancel Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={joinCallDialogOpen} onOpenChange={setJoinCallDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join Video Call</DialogTitle>
          </DialogHeader>
          <p>You are about to join the video consultation. Make sure your camera and microphone are working properly.</p>
          
          {appointmentToJoin && (
            <div className="bg-muted p-4 rounded-md my-4">
              <p className="font-medium">Appointment Details</p>
              <p className="text-sm mt-2">
                <span className="font-medium">Expert:</span> {appointmentToJoin.expert_name}
              </p>
              <p className="text-sm">
                <span className="font-medium">Date:</span> {format(parseISO(appointmentToJoin.appointment_date), 'MMMM d, yyyy')}
              </p>
              <p className="text-sm">
                <span className="font-medium">Time:</span> {appointmentToJoin.start_time} - {appointmentToJoin.end_time}
              </p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setJoinCallDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmJoinCall}>
              <Video className="h-4 w-4 mr-2" />
              Join Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConsultationsSection;
