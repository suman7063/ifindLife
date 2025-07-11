import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, 
  Clock, 
  Video, 
  Phone, 
  MessageSquare, 
  Star,
  MapPin,
  User
} from 'lucide-react';
import { toast } from 'sonner';
import { useAppointmentToCall } from '@/hooks/useAppointmentToCall';

interface AppointmentCardProps {
  appointment: {
    id: string;
    expert_id: string;
    expert_name: string;
    appointment_date: string;
    start_time: string;
    end_time: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    notes?: string;
    channel_name?: string;
    token?: string;
  };
  expertData?: {
    profile_picture?: string;
    specialization?: string;
    average_rating?: number;
  };
  variant?: 'default' | 'compact';
  showCallActions?: boolean;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  expertData,
  variant = 'default',
  showCallActions = true
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { initiateCallFromAppointment, getAppointmentStatus } = useAppointmentToCall();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    try {
      const [hours, minutes] = timeStr.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeStr;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isUpcoming = () => {
    const appointmentDateTime = new Date(`${appointment.appointment_date}T${appointment.start_time}`);
    const now = new Date();
    return appointmentDateTime > now && appointment.status === 'confirmed';
  };

  const canJoinCall = () => {
    const appointmentDateTime = new Date(`${appointment.appointment_date}T${appointment.start_time}`);
    const now = new Date();
    const timeDiff = appointmentDateTime.getTime() - now.getTime();
    const minutesDiff = timeDiff / (1000 * 60);
    
    // Allow joining 15 minutes before appointment time
    return minutesDiff <= 15 && minutesDiff >= -60 && appointment.status === 'confirmed';
  };

  const handleJoinVideoCall = async () => {
    if (!canJoinCall()) {
      toast.error('Call not available yet. You can join 15 minutes before your appointment.');
      return;
    }

    try {
      setIsLoading(true);
      await initiateCallFromAppointment(appointment.id, 'video');
    } catch (error) {
      console.error('Failed to join video call:', error);
      toast.error('Failed to start video call');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinAudioCall = async () => {
    if (!canJoinCall()) {
      toast.error('Call not available yet. You can join 15 minutes before your appointment.');
      return;
    }

    try {
      setIsLoading(true);
      await initiateCallFromAppointment(appointment.id, 'audio');
    } catch (error) {
      console.error('Failed to join audio call:', error);
      toast.error('Failed to start audio call');
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === 'compact') {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={expertData?.profile_picture} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium text-sm">{appointment.expert_name}</h4>
                <p className="text-xs text-muted-foreground">
                  {formatDate(appointment.appointment_date)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <Badge className={getStatusColor(appointment.status)}>
                {appointment.status}
              </Badge>
              {showCallActions && canJoinCall() && (
                <div className="flex space-x-1">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleJoinVideoCall}
                    disabled={isLoading}
                  >
                    <Video className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleJoinAudioCall}
                    disabled={isLoading}
                  >
                    <Phone className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-start space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={expertData?.profile_picture} />
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="font-semibold text-lg">{appointment.expert_name}</h3>
                <Badge className={getStatusColor(appointment.status)}>
                  {appointment.status}
                </Badge>
              </div>
              
              {expertData?.specialization && (
                <p className="text-sm text-muted-foreground mb-2">
                  {expertData.specialization}
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(appointment.appointment_date)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}</span>
                </div>
                {expertData?.average_rating && (
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>{expertData.average_rating}</span>
                  </div>
                )}
              </div>
              
              {appointment.notes && (
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm"><strong>Notes:</strong> {appointment.notes}</p>
                </div>
              )}
            </div>
          </div>
          
          {showCallActions && (
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              {canJoinCall() ? (
                <>
                  <Button 
                    onClick={handleJoinVideoCall}
                    disabled={isLoading}
                    className="flex items-center space-x-2"
                  >
                    <Video className="h-4 w-4" />
                    <span>Join Video Call</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleJoinAudioCall}
                    disabled={isLoading}
                    className="flex items-center space-x-2"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Join Audio Call</span>
                  </Button>
                </>
              ) : isUpcoming() ? (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Call available 15 min before
                  </p>
                  <Button variant="outline" disabled>
                    <Clock className="h-4 w-4 mr-2" />
                    Waiting to join
                  </Button>
                </div>
              ) : appointment.status === 'completed' ? (
                <Button variant="outline" disabled>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Session Completed
                </Button>
              ) : null}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;