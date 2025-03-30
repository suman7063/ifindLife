
import React, { useState } from 'react';
import { useUserAuth } from '@/hooks/user-auth';
import { useAppointments } from '@/hooks/useAppointments';
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
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800'
};

const UserAppointments = () => {
  const { currentUser } = useUserAuth();
  const { appointments, loading, updateAppointmentStatus } = useAppointments(currentUser);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(null);
  
  const handleCancelAppointment = async () => {
    if (appointmentToCancel) {
      await updateAppointmentStatus(appointmentToCancel, 'cancelled');
      setCancelDialogOpen(false);
      setAppointmentToCancel(null);
    }
  };
  
  const initiateCancel = (appointmentId: string) => {
    setAppointmentToCancel(appointmentId);
    setCancelDialogOpen(true);
  };
  
  const joinAppointment = (appointmentId: string) => {
    // This would navigate to the video call page
    toast.info('Video call functionality will be implemented in a future update');
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Appointments</CardTitle>
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
              <Button variant="link" className="mt-2">
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
                                onClick={() => joinAppointment(appointment.id)}
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
            <DialogClose asChild>
              <Button variant="outline">No, Keep It</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleCancelAppointment}>
              Yes, Cancel Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserAppointments;
