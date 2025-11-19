import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, User, Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useExpertAvailability } from '@/hooks/useExpertAvailability';
import { supabase } from '@/integrations/supabase/client';

interface Appointment {
  id: string;
  user_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
  notes?: string;
}

const BookingCalendar: React.FC = () => {
  const { expert } = useSimpleAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { availabilities, getAvailableSlots, isAvailableOnDate } = useExpertAvailability(expert?.auth_id);

  // Fetch appointments for the current month
  useEffect(() => {
    if (!expert?.auth_id) return;

    const fetchAppointments = async () => {
      const startDate = format(startOfMonth(currentDate), 'yyyy-MM-dd');
      const endDate = format(endOfMonth(currentDate), 'yyyy-MM-dd');

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('expert_id', expert.auth_id)
        .gte('appointment_date', startDate)
        .lte('appointment_date', endDate);

      if (error) {
        console.error('Error fetching appointments:', error);
      } else {
        setAppointments(data || []);
      }
      setLoading(false);
    };

    fetchAppointments();
  }, [expert?.auth_id, currentDate]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
    setSelectedDate(null);
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return appointments.filter(apt => apt.appointment_date === dateStr);
  };

  const getAvailabilityForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const slots = getAvailableSlots(dateStr);
    const isAvailable = isAvailableOnDate(dateStr);
    return { slots, isAvailable };
  };

  const getDayStatus = (date: Date) => {
    const dateAppointments = getAppointmentsForDate(date);
    const { isAvailable } = getAvailabilityForDate(date);
    
    if (!isAvailable) return 'unavailable';
    if (dateAppointments.length > 0) return 'booked';
    return 'available';
  };

  const getDayStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'booked': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'unavailable': return 'bg-gray-100 text-gray-500';
      default: return '';
    }
  };

  const selectedDateAppointments = selectedDate ? getAppointmentsForDate(selectedDate) : [];
  const selectedDateAvailability = selectedDate ? getAvailabilityForDate(selectedDate) : { slots: [], isAvailable: false };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading calendar...</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Calendar */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {format(currentDate, 'MMMM yyyy')}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('prev')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('next')}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Calendar Header */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {daysInMonth.map(date => {
                const dayStatus = getDayStatus(date);
                const dayAppointments = getAppointmentsForDate(date);
                const isSelected = selectedDate && isSameDay(date, selectedDate);
                const isCurrentMonth = isSameMonth(date, currentDate);
                const isCurrentDay = isToday(date);

                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className={`
                      p-2 min-h-[60px] border rounded-lg text-left transition-colors
                      ${isSelected ? 'ring-2 ring-primary' : ''}
                      ${isCurrentDay ? 'ring-1 ring-primary' : ''}
                      ${!isCurrentMonth ? 'opacity-50' : ''}
                      ${getDayStatusColor(dayStatus)}
                    `}
                  >
                    <div className="text-sm font-medium">
                      {format(date, 'd')}
                    </div>
                    {dayAppointments.length > 0 && (
                      <div className="mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {dayAppointments.length} apt{dayAppointments.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
                <span>Booked</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded"></div>
                <span>Unavailable</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Day Details Sidebar */}
      <div className="space-y-4">
        {selectedDate ? (
          <>
            {/* Selected Date Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {format(selectedDate, 'EEEE, MMMM d')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Appointments */}
                {selectedDateAppointments.length > 0 ? (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Appointments ({selectedDateAppointments.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedDateAppointments.map(apt => (
                        <div key={apt.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">
                              {apt.start_time} - {apt.end_time}
                            </span>
                            <Badge 
                              variant={apt.status === 'confirmed' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {apt.status}
                            </Badge>
                          </div>
                          {apt.notes && (
                            <p className="text-xs text-muted-foreground">{apt.notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Available Time Slots */}
                {selectedDateAvailability.isAvailable && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Available Slots
                    </h4>
                    {selectedDateAvailability.slots.length > 0 ? (
                      <div className="space-y-1">
                        {selectedDateAvailability.slots.map((slot, index) => (
                          <div key={index} className="text-sm p-2 bg-muted rounded">
                            {slot.start_time} - {slot.end_time}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No available slots</p>
                    )}
                  </div>
                )}

                {!selectedDateAvailability.isAvailable && (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">No availability set for this date</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <CalendarIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Select a date to view details</p>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">This Month</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Total Appointments</span>
              <span className="font-medium">{appointments.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Confirmed</span>
              <span className="font-medium">
                {appointments.filter(apt => apt.status === 'confirmed').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Available Days</span>
              <span className="font-medium">
                {daysInMonth.filter(date => {
                  const dateStr = format(date, 'yyyy-MM-dd');
                  return isAvailableOnDate(dateStr) && getAppointmentsForDate(date).length === 0;
                }).length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingCalendar;