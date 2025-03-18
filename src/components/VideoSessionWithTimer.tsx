
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Clock, Plus } from 'lucide-react';
import { toast } from 'sonner';
import VideoCall from './VideoCall';
import { useAppointments } from '@/hooks/auth/useAppointments';
import { Appointment } from '@/types/supabase/appointments';
import { formatDistanceStrict } from 'date-fns';

interface VideoSessionWithTimerProps {
  appointment: Appointment;
  client: any;
  tracks: any;
  onEndSession: () => void;
}

const VideoSessionWithTimer: React.FC<VideoSessionWithTimerProps> = ({
  appointment,
  client,
  tracks,
  onEndSession
}) => {
  const [timeRemaining, setTimeRemaining] = useState(appointment.duration * 60); // convert to seconds
  const [isExtending, setIsExtending] = useState(false);
  const [showExtensionAlert, setShowExtensionAlert] = useState(false);
  const [inCall, setInCall] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const alertTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { extendSession, completeSession } = useAppointments();
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate time percentage for progress bar
  const calculateTimePercentage = () => {
    const totalSeconds = appointment.duration * 60;
    return (timeRemaining / totalSeconds) * 100;
  };
  
  // Start timer countdown
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        // When 60 seconds remaining, show extension alert
        if (prev === 60) {
          setShowExtensionAlert(true);
          
          // Hide alert after 30 seconds
          alertTimerRef.current = setTimeout(() => {
            setShowExtensionAlert(false);
          }, 30000); // 30 seconds
        }
        
        // End session when timer reaches zero
        if (prev <= 1) {
          handleSessionEnd();
          return 0;
        }
        
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
    };
  }, []);
  
  // Handle session extension
  const handleExtendSession = async () => {
    setIsExtending(true);
    try {
      const extensionMinutes = 5;
      const success = await extendSession(appointment.id, extensionMinutes);
      
      if (success) {
        // Add time to the timer
        setTimeRemaining(prev => prev + (extensionMinutes * 60));
        
        // Show extension alert
        setShowExtensionAlert(true);
        
        // Hide alert after 30 seconds
        if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
        alertTimerRef.current = setTimeout(() => {
          setShowExtensionAlert(false);
        }, 30000); // 30 seconds
      }
    } catch (error) {
      console.error('Error extending session:', error);
      toast.error('Failed to extend session');
    } finally {
      setIsExtending(false);
    }
  };
  
  // End the session
  const handleSessionEnd = async () => {
    try {
      // Stop the timer
      if (timerRef.current) clearInterval(timerRef.current);
      if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
      
      // Calculate actual duration in minutes
      const totalSeconds = appointment.duration * 60;
      const usedSeconds = totalSeconds - timeRemaining;
      const actualDuration = Math.ceil(usedSeconds / 60);
      
      // Mark session as completed
      await completeSession(appointment.id, actualDuration);
      
      // End video call
      onEndSession();
    } catch (error) {
      console.error('Error ending session:', error);
      toast.error('Failed to end session properly');
      onEndSession();
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Timer Card */}
      <Card className="overflow-hidden">
        <div 
          className="h-1 bg-ifind-aqua transition-all duration-1000 ease-linear"
          style={{ width: `${calculateTimePercentage()}%` }}
        />
        
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-ifind-purple" />
              <span className="font-mono text-lg font-bold">{formatTime(timeRemaining)}</span>
            </div>
            
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={handleExtendSession}
                disabled={isExtending}
                className="flex items-center space-x-1 bg-ifind-teal hover:bg-ifind-teal/80"
              >
                {isExtending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                <span>Add 5 min</span>
              </Button>
              
              <Button
                size="sm"
                variant="destructive"
                onClick={handleSessionEnd}
              >
                End Session
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Extension Alert */}
      {showExtensionAlert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-ifind-teal text-white px-4 py-2 rounded-full shadow-lg animate-pulse z-50">
          Session extended for 5 minutes
        </div>
      )}
      
      {/* Video Call */}
      <div className="h-[400px] bg-gray-100 rounded-lg overflow-hidden">
        {inCall && tracks && (
          <VideoCall
            client={client}
            tracks={tracks}
            setStart={setInCall}
            channelName={appointment.channelName || ''}
          />
        )}
      </div>
    </div>
  );
};

export default VideoSessionWithTimer;
