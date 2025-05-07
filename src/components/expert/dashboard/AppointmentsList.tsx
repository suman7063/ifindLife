
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUserAuth } from '@/hooks/user-auth';
import { Appointment } from '@/types/appointments';
import useAppointments from '@/hooks/useAppointments';
import { 
  Calendar,
  Clock,
  MessageCircle,
  MoreVertical,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const AppointmentsList: React.FC = () => {
  const { currentUser } = useUserAuth();
  const { 
    appointments, 
    fetchAppointments, 
    updateAppointmentStatus,
    sendMessageToClient
  } = useAppointments(currentUser);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    if (currentUser) {
      const loadAppointments = async () => {
        setLoading(true);
        await fetchAppointments();
        setLoading(false);
      };
      
      loadAppointments();
    }
  }, [currentUser, fetchAppointments]);

  const handleStatusUpdate = async (appointmentId: string, status: 'confirmed' | 'cancelled' | 'completed') => {
    try {
      await updateAppointmentStatus(appointmentId, status);
      toast.success(`Appointment ${status} successfully`);
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast.error('Failed to update appointment status');
    }
  };

  const handleSendMessage = async () => {
    if (!selectedAppointment || !messageText.trim()) return;
    
    try {
      const sent = await sendMessageToClient(selectedAppointment.user_id, messageText);
      if (sent) {
        setMessageText('');
        setSelectedAppointment(null);
        toast.success('Message sent successfully');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  // Get initials from a name for avatar
  const getInitials = (name: string = 'Client') => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Appointments</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-10">
          Loading appointments...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No appointments found
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <Card key={appointment.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{getInitials("Client")}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">Client</h4>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {appointment.appointment_date}
                          <Clock className="h-3 w-3 ml-2 mr-1" />
                          {appointment.start_time} - {appointment.end_time}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge 
                        className={
                          appointment.status === 'confirmed' ? 'bg-green-500' :
                          appointment.status === 'completed' ? 'bg-blue-500' :
                          appointment.status === 'cancelled' ? 'bg-red-500' :
                          'bg-yellow-500'
                        }
                      >
                        {appointment.status}
                      </Badge>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setSelectedAppointment(appointment)}
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Send Message to Client</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div>
                              <p className="text-sm text-muted-foreground mb-2">
                                Appointment: {appointment.appointment_date} at {appointment.start_time}
                              </p>
                              <Textarea
                                placeholder="Type your message here..."
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                className="min-h-[100px]"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => {
                              setMessageText('');
                              setSelectedAppointment(null);
                            }}>
                              Cancel
                            </Button>
                            <Button type="button" onClick={handleSendMessage}>
                              Send Message
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {appointment.status === 'pending' && (
                            <DropdownMenuItem onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              <span>Confirm</span>
                            </DropdownMenuItem>
                          )}
                          {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                            <DropdownMenuItem onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}>
                              <XCircle className="mr-2 h-4 w-4" />
                              <span>Cancel</span>
                            </DropdownMenuItem>
                          )}
                          {appointment.status === 'confirmed' && (
                            <DropdownMenuItem onClick={() => handleStatusUpdate(appointment.id, 'completed')}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              <span>Mark as Completed</span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  {appointment.notes && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      <p className="font-medium">Notes:</p>
                      <p>{appointment.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentsList;
