import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Phone, MessageSquare, AlertTriangle } from 'lucide-react';
import { format, parseISO, isToday, isTomorrow } from 'date-fns';
import { UserAppointment } from '@/hooks/useUserAppointments';

interface AppointmentCardProps {
  appointment: UserAppointment;
  type: 'upcoming' | 'past';
  onCancel?: (appointmentId: string) => void;
  onReschedule?: (appointmentId: string) => void;
  onStartCall?: (appointment: UserAppointment) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  type,
  onCancel,
  onReschedule,
  onStartCall
}) => {
  const appointmentDate = parseISO(appointment.appointment_date);
  const currentTime = new Date();
  const appointmentDateTime = new Date(`${appointment.appointment_date}T${appointment.start_time}`);
  
  const isAppointmentToday = isToday(appointmentDate);
  const isAppointmentTomorrow = isTomorrow(appointmentDate);
  const isAppointmentSoon = appointmentDateTime.getTime() - currentTime.getTime() <= 15 * 60 * 1000; // 15 minutes
  const canStartCall = isAppointmentToday && isAppointmentSoon && appointment.status === 'confirmed';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDateDisplay = () => {
    if (isAppointmentToday) return 'Today';
    if (isAppointmentTomorrow) return 'Tomorrow';
    return format(appointmentDate, 'MMM dd, yyyy');
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const timeDate = new Date();
    timeDate.setHours(parseInt(hours), parseInt(minutes));
    return format(timeDate, 'h:mm a');
  };

  return (
    <Card className={`transition-all hover:shadow-md ${canStartCall ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-4 w-4" />
              {appointment.expert_name}
            </CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {getDateDisplay()}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
              </div>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
            {appointment.status}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {appointment.notes && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm">{appointment.notes}</p>
          </div>
        )}

        {canStartCall && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800 text-sm font-medium mb-2">
              <AlertTriangle className="h-4 w-4" />
              Your session is starting soon!
            </div>
            <Button 
              onClick={() => onStartCall?.(appointment)}
              className="w-full"
              size="sm"
            >
              <Phone className="h-4 w-4 mr-2" />
              Join Call
            </Button>
          </div>
        )}

        {type === 'upcoming' && appointment.status !== 'cancelled' && (
          <div className="flex gap-2">
            {!canStartCall && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReschedule?.(appointment.id)}
                  className="flex-1"
                >
                  Reschedule
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCancel?.(appointment.id)}
                  className="flex-1 text-red-600 hover:text-red-700"
                >
                  Cancel
                </Button>
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Message Expert
            </Button>
          </div>
        )}

        {type === 'past' && appointment.status === 'completed' && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Leave Review
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Book Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;