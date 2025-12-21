import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Circle, Clock, UserMinus, Wifi, WifiOff, Phone, PhoneOff } from 'lucide-react';
import { useExpertPresence } from '@/contexts/ExpertPresenceContext';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type ExpertStatus = 'available' | 'busy' | 'away' | 'offline';

const MasterStatusControl: React.FC = () => {
  const { expert } = useSimpleAuth();
  const { updateExpertPresence, getExpertPresence, checkExpertPresence, bulkCheckPresence } = useExpertPresence();
  const [currentStatus, setCurrentStatus] = useState<ExpertStatus>('offline');
  const [acceptingCalls, setAcceptingCalls] = useState(false);
  const isAutoUpdatingRef = useRef(false);

  // Check if expert has an active booking/session
  const checkActiveBooking = async (expertId: string): Promise<boolean> => {
    try {
      const now = new Date();
      // Get today's date in local timezone (YYYY-MM-DD format)
      // Use local date methods to avoid timezone issues
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const todayStr = `${year}-${month}-${day}`;
      
      console.log('📅 Date calculation:', {
        now: now.toString(),
        nowISO: now.toISOString(),
        localDate: todayStr,
        year,
        month: now.getMonth() + 1,
        day: now.getDate(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      });
      
      // Get current time in HH:MM format
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTimeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;

      console.log('🔍 Checking active bookings:', { expertId, todayStr, currentTimeStr });

      // First, let's check all appointments for this expert to debug
      const { data: allAppointments, error: allError } = await supabase
        .from('appointments')
        .select('id, appointment_date, start_time, end_time, duration, status, expert_id')
        .eq('expert_id', expertId)
        .order('appointment_date', { ascending: true })
        .order('start_time', { ascending: true })
        .limit(10);
      
      console.log('📋 All appointments for expert:', allAppointments?.length || 0, allAppointments);
      
      // Check today's appointments specifically
      const todayAppointments = allAppointments?.filter(apt => apt.appointment_date === todayStr) || [];
      console.log('📅 Today\'s appointments (all statuses):', todayAppointments.length, todayAppointments.map(apt => ({
        id: apt.id,
        date: apt.appointment_date,
        startTime: apt.start_time,
        endTime: apt.end_time,
        status: apt.status,
        duration: apt.duration
      })));
      
      // Log status details for debugging
      todayAppointments.forEach(apt => {
        console.log('🔍 Appointment status check:', {
          id: apt.id,
          status: apt.status,
          statusType: typeof apt.status,
          isInFilter: ['scheduled', 'confirmed', 'in-progress', 'pending'].includes(apt.status),
          startTime: apt.start_time,
          currentTime: currentTimeStr
        });
      });
      
      if (allError) {
        console.error('❌ Error fetching all appointments:', allError);
      }

      // Fetch appointments for today that are scheduled or in-progress
      // Note: Including 'cancelled' temporarily as requested
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select('id, appointment_date, start_time, end_time, duration, status')
        .eq('expert_id', expertId)
        .eq('appointment_date', todayStr)
        .in('status', ['scheduled', 'confirmed', 'in-progress', 'pending', 'cancelled']);
      
      console.log('🔍 Query details:', {
        expertId,
        todayStr,
        statusFilter: ['scheduled', 'confirmed', 'in-progress', 'pending', 'cancelled']
      });

      if (error) {
        console.error('❌ Error checking active bookings:', error);
        return false;
      }

      console.log('📅 Found appointments:', appointments?.length || 0, appointments);

      if (!appointments || appointments.length === 0) {
        return false;
      }

      // Check if any appointment is currently active
      for (const appointment of appointments) {
        const startTime = appointment.start_time?.split(':').slice(0, 2).join(':') || '';
        let endTime = appointment.end_time?.split(':').slice(0, 2).join(':') || '';
        
        console.log('📋 Checking appointment:', {
          id: appointment.id,
          startTime,
          endTime,
          duration: appointment.duration,
          status: appointment.status
        });
        
        // If no end_time, calculate from duration
        if (!endTime && appointment.duration && startTime) {
          const [startHour, startMin] = startTime.split(':').map(Number);
          const endMinutes = startHour * 60 + startMin + appointment.duration;
          const endHour = Math.floor(endMinutes / 60);
          const endMin = endMinutes % 60;
          endTime = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;
          console.log('📐 Calculated endTime from duration:', endTime);
        }

        // Check if current time is within the appointment time range
        if (startTime && endTime) {
          // Convert times to minutes for accurate comparison
          const [currentHourNum, currentMinNum] = [currentHour, currentMinute];
          const currentMinutes = currentHourNum * 60 + currentMinNum;
          
          const [startHourNum, startMinNum] = startTime.split(':').map(Number);
          const startMinutes = startHourNum * 60 + startMinNum;
          
          const [endHourNum, endMinNum] = endTime.split(':').map(Number);
          const endMinutes = endHourNum * 60 + endMinNum;
          
          const isAfterStart = currentMinutes >= startMinutes;
          const isBeforeEnd = currentMinutes <= endMinutes;
          
          console.log('⏰ Time comparison:', {
            currentTime: `${currentTimeStr} (${currentMinutes} min)`,
            startTime: `${startTime} (${startMinutes} min)`,
            endTime: `${endTime} (${endMinutes} min)`,
            isAfterStart,
            isBeforeEnd,
            isActive: isAfterStart && isBeforeEnd
          });
          
          if (isAfterStart && isBeforeEnd) {
            console.log('✅ Active booking found!', appointment.id);
            return true; // Active booking found
          }
        } else {
          console.warn('⚠️ Missing time data for appointment:', appointment.id, { startTime, endTime });
        }
      }

      console.log('❌ No active booking found');
      return false;
    } catch (error) {
      console.error('❌ Error checking active booking:', error);
      return false;
    }
  };

  // Automatically update status based on active bookings
  const updateStatusBasedOnBookings = useCallback(async () => {
    if (!expert?.auth_id || isAutoUpdatingRef.current) {
      return;
    }

    try {
      isAutoUpdatingRef.current = true;
      console.log('🔄 Starting status check for expert:', expert.auth_id);
      const hasActiveBooking = await checkActiveBooking(expert.auth_id);
      
      // Get current presence status
      const currentPresence = await checkExpertPresence(expert.auth_id);
      const currentPresenceStatus = currentPresence.status === 'available' ? 'available' :
                                    currentPresence.status === 'busy' ? 'busy' :
                                    currentPresence.status === 'away' ? 'away' : 'offline';

      console.log('📊 Status check result:', {
        hasActiveBooking,
        currentPresenceStatus,
        shouldUpdate: hasActiveBooking && currentPresenceStatus !== 'busy'
      });

      // If there's an active booking and status is not already busy, set to busy
      if (hasActiveBooking && currentPresenceStatus !== 'busy') {
        // Only auto-update if status is available or away (don't override offline)
        if (currentPresenceStatus === 'available' || currentPresenceStatus === 'away') {
          console.log('🔄 Updating status to busy...');
          // Store the previous status in database before setting to busy
          await updateExpertPresence(expert.auth_id, 'busy', currentPresence.acceptingCalls, currentPresenceStatus);
          setCurrentStatus('busy');
          console.log('✅ Auto-updated status to busy due to active booking');
        } else {
          console.log('⏭️ Skipping status update (current status is offline)');
        }
      } else if (hasActiveBooking && currentPresenceStatus === 'busy') {
        console.log('✅ Status already busy, no update needed');
      } 
      // If no active booking and status is busy, auto-revert to previous status
      else if (!hasActiveBooking && currentPresenceStatus === 'busy') {
        // Get previous status from database (or from currentPresence if available)
        const previousStatusFromDB = currentPresence.previousStatus;
        const statusToRevert = previousStatusFromDB || 'available';
        
        // Only revert if we have a stored previous status (meaning it was auto-set to busy)
        // or if we're reverting to available (safe default)
        if (previousStatusFromDB || statusToRevert === 'available') {
          // Clear previous_status in database when reverting
          await updateExpertPresence(expert.auth_id, statusToRevert, currentPresence.acceptingCalls, null);
          setCurrentStatus(statusToRevert);
          console.log(`🔄 Auto-reverted status from busy to ${statusToRevert} (no active booking)`);
        }
      }
    } catch (error) {
      console.error('Error updating status based on bookings:', error);
    } finally {
      isAutoUpdatingRef.current = false;
    }
  }, [expert?.auth_id, checkExpertPresence, updateExpertPresence]);

  useEffect(() => {
    if (!expert?.auth_id) {
      return;
    }

    // Always verify presence from DB on mount/refresh to restore state
    (async () => {
      try {
        const presence = await checkExpertPresence(expert.auth_id);
        const mappedStatus = presence.status === 'available' ? 'available' :
                            presence.status === 'busy' ? 'busy' :
                            presence.status === 'away' ? 'away' : 'offline';
        setCurrentStatus(mappedStatus);
        setAcceptingCalls(!!presence.acceptingCalls && mappedStatus !== 'offline');
        
        // Check for active bookings after initial load
        await updateStatusBasedOnBookings();
      } catch (e) {
        // Fallback to any cached state if network fails
        const cached = getExpertPresence(expert.auth_id);
        if (cached) {
          const mappedStatus = cached.status === 'available' ? 'available' :
                              cached.status === 'busy' ? 'busy' :
                              cached.status === 'away' ? 'away' : 'offline';
          setCurrentStatus(mappedStatus);
          setAcceptingCalls(!!cached.acceptingCalls && mappedStatus !== 'offline');
        }
      }
    })();

    // Subscribe to appointment changes for real-time updates only
    // No polling - relying on Supabase real-time for instant updates
    const appointmentChannel = supabase
      .channel(`expert-status-appointments-${expert.auth_id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: `expert_id=eq.${expert.auth_id}`,
        },
        () => {
          // Check status when appointments change
          updateStatusBasedOnBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(appointmentChannel);
    };
  }, [expert?.auth_id, getExpertPresence, checkExpertPresence, updateStatusBasedOnBookings]);

  const refreshSelfPresence = async () => {
    if (!expert?.auth_id) return;
    try {
      await bulkCheckPresence([String(expert.auth_id)]);
    } catch (e) {
      console.warn('Presence refresh failed', e);
    }
  };

  const handleStatusChange = async (newStatus: ExpertStatus) => {
    if (!expert?.auth_id) return;

    try {
      // If manually changing status, clear the previous_status in database
      // This prevents auto-revert when user manually changes status
      // (only auto-revert if status was auto-set to busy due to booking)
      // Pass null to clear previous_status
      const shouldClearPreviousStatus = true;

      // Robust transition rules
      // - offline: force accepting calls to false
      // - available: enable accepting calls
      // - busy/away: preserve current switch
      const callAcceptance = newStatus === 'offline' ? false : newStatus === 'available' ? true : acceptingCalls;
      
      // Clear previous_status when manually changing status
      await updateExpertPresence(expert.auth_id, newStatus, callAcceptance, shouldClearPreviousStatus ? null : undefined);
      
      // Immediately reflect in local UI
      setCurrentStatus(newStatus);
      setAcceptingCalls(callAcceptance);

      // Confirm from DB and sync state (handles any race conditions)
      const confirmed = await checkExpertPresence(expert.auth_id);
      const mapped = confirmed.status === 'available' ? 'available' : confirmed.status === 'busy' ? 'busy' : confirmed.status === 'away' ? 'away' : 'offline';
      setCurrentStatus(mapped);
      setAcceptingCalls(!!confirmed.acceptingCalls && mapped !== 'offline');

      await refreshSelfPresence();
      
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleCallAcceptanceToggle = async (accepting: boolean) => {
    if (!expert?.auth_id) return;

    try {
      // If enabling call acceptance but currently offline, set to available
      if (accepting && currentStatus === 'offline') {
        await handleStatusChange('available');
      }
      
      // Update the presence system with call acceptance status
      await updateExpertPresence(expert.auth_id, currentStatus, accepting);
      setAcceptingCalls(accepting);

      await refreshSelfPresence();
      
      toast.success(accepting ? 'Now accepting calls' : 'No longer accepting calls');
    } catch (error) {
      console.error('Error updating call acceptance:', error);
      toast.error('Failed to update call settings');
    }
  };

  const getStatusConfig = (status: ExpertStatus) => {
    switch (status) {
      case 'available':
        return {
          icon: <Circle className="h-4 w-4 fill-green-500 text-green-500" />,
          color: 'bg-green-100 text-green-800 border-green-200',
          label: 'Available',
          description: 'Visible to clients and ready for consultations'
        };
      case 'busy':
        return {
          icon: <Clock className="h-4 w-4 text-orange-500" />,
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          label: 'Busy',
          description: 'Visible to clients but currently in a session'
        };
      case 'away':
        return {
          icon: <UserMinus className="h-4 w-4 text-yellow-500" />,
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          label: 'Away',
          description: 'Visible to clients but temporarily unavailable'
        };
      case 'offline':
      default:
        return {
          icon: <WifiOff className="h-4 w-4 text-gray-500" />,
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          label: 'Offline',
          description: 'Not visible to clients'
        };
    }
  };

  if (!expert?.auth_id) return null;

  const statusConfig = getStatusConfig(currentStatus);
  const canAcceptCalls = currentStatus !== 'offline' && expert.status === 'approved';

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Wifi className="h-5 w-5" />
          Online Status & Availability
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status Display */}
        <div className={`flex items-center justify-between p-4 rounded-lg border ${statusConfig.color}`}>
          <div className="flex items-center gap-3">
            {statusConfig.icon}
            <div>
              <div className="font-medium">{statusConfig.label}</div>
              <div className="text-sm opacity-75">{statusConfig.description}</div>
            </div>
          </div>
          <Badge variant="outline" className="bg-white">
            {currentStatus}
          </Badge>
        </div>

        {/* Status Control Buttons */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-700">Set Your Status:</div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={currentStatus === 'available' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('available')}
              className="flex items-center gap-2"
            >
              <Circle className="h-3 w-3 fill-green-500 text-green-500" />
              Available
            </Button>
            
            <Button
              variant={currentStatus === 'busy' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('busy')}
              className="flex items-center gap-2"
            >
              <Clock className="h-3 w-3 text-orange-500" />
              Busy
            </Button>
            
            <Button
              variant={currentStatus === 'away' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('away')}
              className="flex items-center gap-2"
            >
              <UserMinus className="h-3 w-3 text-yellow-500" />
              Away
            </Button>
            
            <Button
              variant={currentStatus === 'offline' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('offline')}
              className="flex items-center gap-2"
            >
              <WifiOff className="h-3 w-3 text-gray-500" />
              Offline
            </Button>
          </div>
        </div>

        {/* Call Reception Control */}
        <div className={`p-4 rounded-lg border ${acceptingCalls ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {acceptingCalls ? (
                <Phone className="h-5 w-5 text-green-600" />
              ) : (
                <PhoneOff className="h-5 w-5 text-gray-500" />
              )}
              <div>
                <div className="font-medium">Call Reception</div>
                <div className="text-sm text-gray-600">
                  {acceptingCalls ? 'Ready to receive incoming calls' : 'Not accepting calls'}
                </div>
              </div>
            </div>
            <Switch
              checked={acceptingCalls}
              onCheckedChange={handleCallAcceptanceToggle}
              disabled={!canAcceptCalls}
            />
          </div>
          
          {!canAcceptCalls && expert.status !== 'approved' && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                Your expert account is pending approval. You'll be able to receive calls once approved.
              </p>
            </div>
          )}
          
          {!canAcceptCalls && expert.status === 'approved' && currentStatus === 'offline' && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                Set your status to Available, Busy, or Away to enable call reception.
              </p>
            </div>
          )}
        </div>

        {/* Status Information */}
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
          <p className="font-medium mb-1">How this works:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Available:</strong> Clients can see you're online and book calls</li>
            <li><strong>Busy:</strong> Clients see you're online but currently occupied</li>
            <li><strong>Away:</strong> Clients see you're temporarily unavailable</li>
            <li><strong>Offline:</strong> You're invisible to clients on the website</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default MasterStatusControl;