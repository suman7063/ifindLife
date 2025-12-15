import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Phone, MessageSquare, AlertTriangle, RefreshCw } from 'lucide-react';
import { format, parseISO, isToday, isTomorrow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { UserAppointment } from '@/hooks/useUserAppointments';
import { useExpertNoShow } from '@/hooks/useExpertNoShow';

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
  const navigate = useNavigate();
  const appointmentDate = parseISO(appointment.appointment_date);
  const currentTime = new Date();
  // Handle HH:MM:SS format (take only HH:MM for parsing)
  const startTime = appointment.start_time.split(':').slice(0, 2).join(':');
  const appointmentDateTime = new Date(`${appointment.appointment_date}T${startTime}`);
  
  const isAppointmentToday = isToday(appointmentDate);
  const isAppointmentTomorrow = isTomorrow(appointmentDate);
  
  // Can start call only when appointment time has actually arrived (not before)
  const timeDiff = appointmentDateTime.getTime() - currentTime.getTime();
  const sessionEndTime = appointmentDateTime.getTime() + (appointment.duration || 30) * 60 * 1000;
  const isWithinSession = currentTime.getTime() <= sessionEndTime;
  const canStartCall = isAppointmentToday && timeDiff <= 0 && isWithinSession && (appointment.status === 'confirmed' || appointment.status === 'scheduled' || appointment.status === 'in-progress');

  // Check for expert no-show
  const { noShowData, isChecking, reportNoShow } = useExpertNoShow(
    appointment.id,
    appointment.appointment_date,
    appointment.start_time,
    appointment.status
  );

  const isNoShow = noShowData?.isNoShow || false;
  const canReportNoShow = noShowData?.canReportNoShow || false;
  const refundProcessed = noShowData?.refundProcessed || false;
  const isWarning = noShowData?.isWarning || false;

  const getStatusColor = (status: string, isNoShow?: boolean) => {
    if (isNoShow) {
      return 'bg-orange-100 text-orange-800 border-orange-200';
    }
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
    try {
      // Handle HH:MM:SS format (take only HH:MM)
      const timeParts = time.split(':');
      const hours = parseInt(timeParts[0] || '0', 10);
      const minutes = parseInt(timeParts[1] || '0', 10);
      const timeDate = new Date();
      timeDate.setHours(hours, minutes);
      return format(timeDate, 'h:mm a');
    } catch {
      return time;
    }
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
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status, isNoShow)}`}>
            {isNoShow ? 'Expert No-Show' : appointment.status}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Warning: Expert hasn't joined yet (3-5 minutes) */}
        {isWarning && !isNoShow && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-900">
                  Waiting for expert to join
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  The expert hasn't joined your session yet. If they don't join within {5 - (noShowData?.timeSinceStart || 0)} minute(s), you'll receive a full refund automatically. No action needed from your side.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* No-Show Alert */}
        {isNoShow && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-orange-900">
                  Expert did not join the session
                </p>
                <p className="text-xs text-orange-700 mt-1">
                  {refundProcessed 
                    ? 'Full refund has been processed and credited to your wallet automatically. No action needed from your side.'
                    : 'Refund is being processed automatically. You will receive a full refund shortly. No action needed from your side.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Cancellation Info */}
        {appointment.status === 'cancelled' && appointment.notes && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900 mb-1">
                  Appointment Cancelled
                </p>
                {(() => {
                  try {
                    const notesData = typeof appointment.notes === 'string' ? JSON.parse(appointment.notes) : appointment.notes;
                    const cancellationReason = notesData?.cancellation_reason || notesData?.reason || 'Unknown reason';
                    const cancelledAt = notesData?.cancelled_at ? format(parseISO(notesData.cancelled_at), 'MMM d, yyyy h:mm a') : null;
                    
                    const reasonText = cancellationReason === 'expert_no_show' 
                      ? 'Expert did not join the session'
                      : cancellationReason === 'user_cancelled'
                      ? 'Cancelled by you'
                      : cancellationReason === 'expert_cancelled'
                      ? 'Cancelled by expert'
                      : cancellationReason.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    
                    return (
                      <div className="text-xs text-red-700 space-y-1">
                        <p><span className="font-medium">Reason:</span> {reasonText}</p>
                        {cancelledAt && (
                          <p><span className="font-medium">Cancelled on:</span> {cancelledAt}</p>
                        )}
                      </div>
                    );
                  } catch {
                    // If not JSON, display as plain text
                    return (
                      <p className="text-xs text-red-700">{appointment.notes}</p>
                    );
                  }
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Regular Notes (non-cancelled) */}
        {appointment.notes && appointment.status !== 'cancelled' && !isNoShow && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm">{appointment.notes}</p>
          </div>
        )}

        {/* Show waiting warning when appointment time has arrived but expert hasn't joined */}
        {canStartCall && !isNoShow && !isWarning && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-900">
                  Waiting for expert to join
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  The expert hasn't joined your session yet. If they don't join within 5 minutes, you'll receive a full refund automatically.
                </p>
              </div>
            </div>
          </div>
        )}

        {type === 'upcoming' && appointment.status !== 'cancelled' && !isNoShow && (
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
              onClick={() => navigate(`/messaging?expert=${appointment.expert_id}`)}
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