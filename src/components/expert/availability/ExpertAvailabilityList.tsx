
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAvailabilityManagement } from '@/hooks/useAvailabilityManagement';
import { toast } from 'sonner';
import { Calendar, Clock, Trash2, Users } from 'lucide-react';
import EmptyAvailabilityState from './EmptyAvailabilityState';

interface ExpertAvailabilityListProps {
  user: any;
}

const ExpertAvailabilityList: React.FC<ExpertAvailabilityListProps> = ({ user }) => {
  const { availabilities, loading, error, fetchAvailabilities, deleteAvailability } = useAvailabilityManagement(user);

  useEffect(() => {
    if (user?.id) {
      fetchAvailabilities(user.id);
    }
  }, [user?.id, fetchAvailabilities]);

  const handleDelete = async (availabilityId: string) => {
    if (window.confirm('Are you sure you want to delete this availability?')) {
      const success = await deleteAvailability(availabilityId);
      if (success) {
        toast.success('Availability deleted successfully');
      }
    }
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDayName = (dayOfWeek: number) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[dayOfWeek - 1];
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Your Availability Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading availability...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Your Availability Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
            <Button 
              onClick={() => fetchAvailabilities(user.id)} 
              variant="outline" 
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Your Availability Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        {availabilities.length === 0 ? (
          <EmptyAvailabilityState />
        ) : (
          <div className="space-y-4">
            {availabilities.map((availability) => (
              <Card key={availability.id} className="border border-border">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">
                          {availability.availability_type === 'recurring' ? 'Recurring' : 'Date Range'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(availability.start_date)} - {formatDate(availability.end_date)}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        {availability.time_slots?.map((slot: any, index: number) => (
                          <div key={index} className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-primary" />
                              <span className="font-medium">{getDayName(slot.day_of_week)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{formatTime(slot.start_time)} - {formatTime(slot.end_time)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(availability.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpertAvailabilityList;
