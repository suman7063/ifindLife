import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { Calendar, Clock, User } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface Appointment {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  duration: number;
  client_name: string;
  service_name: string;
  status: string;
  notes?: string;
}

interface UpcomingAppointmentsProps {
  expertId?: string;
  limit?: number;
}

const UpcomingAppointments: React.FC<UpcomingAppointmentsProps> = ({ expertId, limit = 3 }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (expertId) {
      fetchAppointments();
    }
  }, [expertId]);

  const fetchAppointments = async () => {
    if (!expertId) return;
    
    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch appointments
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          appointment_date,
          start_time,
          end_time,
          duration,
          notes,
          status,
          user_id,
          service_id,
          users (name),
          services (name)
        `)
        .eq('expert_id', expertId)
        .gte('appointment_date', today)
        .order('appointment_date', { ascending: true })
        .limit(limit);
        
      if (error) throw error;
      
      // Format appointments
      const formattedAppointments = (data || []).map(app => ({
        id: app.id,
        date: app.appointment_date,
        start_time: app.start_time,
        end_time: app.end_time,
        duration: app.duration,
        client_name: app.users?.name || 'Unknown Client',
        service_name: app.services?.name || 'Unknown Service',
        status: app.status,
        notes: app.notes
      }));
      
      setAppointments(formattedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setNotes(appointment.notes || '');
    setIsDialogOpen(true);
  };

  const handleSaveNotes = async () => {
    if (!expertId || !selectedAppointment) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ notes })
        .eq('id', selectedAppointment.id);
        
      if (error) throw error;
      
      toast.success('Notes saved successfully');
      setIsDialogOpen(false);
      
      // Update local state
      setAppointments(prevAppointments => 
        prevAppointments.map(app => 
          app.id === selectedAppointment.id ? { ...app, notes } : app
        )
      );
    } catch (error) {
      console.error('Error saving notes:', error);
      toast.error('Failed to save notes');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'EEEE, MMMM d, yyyy');
  };

  const formatTime = (timeStr: string) => {
    return timeStr ? timeStr.substring(0, 5) : '';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'canceled':
        return <Badge className="bg-red-500">Canceled</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="text-center py-8">Loading appointments...</div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No upcoming appointments found.
        </div>
      ) : (
        appointments.map((appointment) => (
          <Card key={appointment.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base">{appointment.service_name}</CardTitle>
                {getStatusBadge(appointment.status)}
              </div>
              <CardDescription>
                <div className="flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  <span>{formatDate(appointment.date)}</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-1">
                <div className="flex items-center">
                  <User className="h-3.5 w-3.5 mr-1" />
                  <span className="text-sm">{appointment.client_name}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span className="text-sm">
                    {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)} 
                    ({appointment.duration} min)
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button 
                variant="outline" 
                size="sm"
                className="w-full"
                onClick={() => handleViewAppointment(appointment)}
              >
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
      
      {/* Appointment Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>
              View and manage appointment information
            </DialogDescription>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Date</Label>
                  <div className="font-medium">{formatDate(selectedAppointment.date)}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Time</Label>
                  <div className="font-medium">
                    {formatTime(selectedAppointment.start_time)} - {formatTime(selectedAppointment.end_time)}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Client</Label>
                  <div className="font-medium">{selectedAppointment.client_name}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Service</Label>
                  <div className="font-medium">{selectedAppointment.service_name}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Duration</Label>
                  <div className="font-medium">{selectedAppointment.duration} minutes</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Status</Label>
                  <div className="font-medium">{getStatusBadge(selectedAppointment.status)}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium">Session Notes</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Add notes about this session..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              onClick={handleSaveNotes}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Notes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpcomingAppointments;
