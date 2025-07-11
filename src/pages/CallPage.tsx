import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { CallModalProvider } from '@/components/call/modals/context/CallModalProvider';
import { CallModalContent } from '@/components/call/modals/content/CallModalContent';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, User, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

interface AppointmentDetails {
  id: string;
  expert_id: string;
  expert_name: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  duration: number;
  status: string;
  notes?: string;
  channel_name?: string;
}

interface ExpertInfo {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
}

const CallPage: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, userProfile } = useSimpleAuth();

  const [appointment, setAppointment] = useState<AppointmentDetails | null>(null);
  const [expertInfo, setExpertInfo] = useState<ExpertInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canJoinCall, setCanJoinCall] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    if (!appointmentId) {
      navigate('/dashboard');
      return;
    }

    fetchAppointmentDetails();
  }, [appointmentId, isAuthenticated]);

  const fetchAppointmentDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch appointment details
      const { data: appointmentData, error: appointmentError } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', appointmentId)
        .eq('user_id', userProfile?.id)
        .single();

      if (appointmentError) {
        throw new Error('Appointment not found or access denied');
      }

      setAppointment(appointmentData);

      // Check if user can join the call (within 15 minutes of start time)
      const appointmentDateTime = new Date(`${appointmentData.appointment_date}T${appointmentData.start_time}`);
      const currentTime = new Date();
      const timeDifference = appointmentDateTime.getTime() - currentTime.getTime();
      const isWithin15Minutes = Math.abs(timeDifference) <= 15 * 60 * 1000; // 15 minutes

      setCanJoinCall(isWithin15Minutes && appointmentData.status === 'confirmed');

      // Create expert info object (you might want to fetch real expert data)
      setExpertInfo({
        id: parseInt(appointmentData.expert_id),
        name: appointmentData.expert_name,
        imageUrl: '/placeholder.svg', // You might want to fetch this from experts table
        price: 50 // You might want to fetch this from expert pricing
      });

    } catch (err) {
      console.error('Error fetching appointment:', err);
      setError(err instanceof Error ? err.message : 'Failed to load appointment');
      toast.error('Failed to load appointment details');
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (status: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId);

      if (error) throw error;

      setAppointment(prev => prev ? { ...prev, status } : null);
    } catch (err) {
      console.error('Error updating appointment status:', err);
      toast.error('Failed to update appointment status');
    }
  };

  const handleJoinCall = () => {
    if (appointment && canJoinCall) {
      updateAppointmentStatus('in_progress');
    }
  };

  const handleCallEnd = () => {
    updateAppointmentStatus('completed');
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading appointment details...</p>
        </div>
      </div>
    );
  }

  if (error || !appointment || !expertInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Unable to Load Call</h2>
            <p className="text-muted-foreground mb-4">
              {error || 'Appointment not found or you do not have permission to access this call.'}
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const appointmentDate = parseISO(appointment.appointment_date);
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const timeDate = new Date();
    timeDate.setHours(parseInt(hours), parseInt(minutes));
    return format(timeDate, 'h:mm a');
  };

  if (!canJoinCall) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-lg mx-auto">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Appointment Details</h2>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{appointment.expert_name}</p>
                  <p className="text-sm text-muted-foreground">Expert</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{format(appointmentDate, 'MMMM dd, yyyy')}</p>
                  <p className="text-sm text-muted-foreground">Appointment Date</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">
                    {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {appointment.duration} minutes
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-yellow-800 mb-2">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">Call Not Available Yet</span>
              </div>
              <p className="text-sm text-yellow-700">
                You can join the call 15 minutes before your scheduled appointment time.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <Button
                onClick={() => window.location.reload()}
                className="flex-1"
              >
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <CallModalProvider expert={expertInfo} isOpen={true}>
        <CallModalContent expert={expertInfo} onClose={handleCallEnd} />
      </CallModalProvider>
    </div>
  );
};

export default CallPage;