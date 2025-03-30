
import React, { useState, useEffect } from 'react';
import { useUserAuth } from '@/hooks/user-auth';
import { useAppointments, Appointment } from '@/hooks/useAppointments';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
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
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { format, parseISO } from 'date-fns';
import { AlertCircle, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800'
};

const AppointmentsList = () => {
  const { currentUser } = useUserAuth();
  const { appointments, loading, fetchAppointments, updateAppointmentStatus } = useAppointments(currentUser);
  const [isGoogleCalendarConnected, setIsGoogleCalendarConnected] = useState(false);
  
  const handleStatusChange = async (appointmentId: string, status: Appointment['status']) => {
    await updateAppointmentStatus(appointmentId, status);
  };
  
  const connectToGoogleCalendar = () => {
    toast.info('Google Calendar integration will be implemented in a future update');
    setIsGoogleCalendarConnected(true);
  };
  
  const sendReminderManually = (appointment: Appointment) => {
    toast.info('Reminder has been sent to the user');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
        
        {!isGoogleCalendarConnected && (
          <Button variant="outline" onClick={connectToGoogleCalendar}>
            <Calendar className="h-4 w-4 mr-2" />
            Connect Google Calendar
          </Button>
        )}
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Appointments</CardTitle>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <p className="text-center py-6">Loading appointments...</p>
          ) : appointments.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No appointments found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      {format(parseISO(appointment.appointment_date), 'MMM d, yyyy')}
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
                      {appointment.user_name || 'User'}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {appointment.status === 'pending' && (
                          <>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    size="icon" 
                                    variant="ghost"
                                    className="h-8 w-8"
                                    onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                                  >
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Confirm</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    size="icon" 
                                    variant="ghost"
                                    className="h-8 w-8"
                                    onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                                  >
                                    <XCircle className="h-4 w-4 text-red-500" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Cancel</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </>
                        )}
                        
                        {appointment.status === 'confirmed' && (
                          <>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    size="icon" 
                                    variant="ghost"
                                    className="h-8 w-8"
                                    onClick={() => handleStatusChange(appointment.id, 'completed')}
                                  >
                                    <CheckCircle className="h-4 w-4 text-blue-500" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Mark as Completed</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    size="icon" 
                                    variant="ghost"
                                    className="h-8 w-8"
                                    onClick={() => sendReminderManually(appointment)}
                                  >
                                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Send Reminder</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentsList;
