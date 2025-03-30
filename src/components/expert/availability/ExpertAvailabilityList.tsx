import React from 'react';
import { useUserAuth } from '@/hooks/user-auth';
import { useAppointments } from '@/hooks/useAppointments';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, isAfter, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Clock, Trash } from 'lucide-react';
import { toast } from 'sonner';

const ExpertAvailabilityList = () => {
  const { currentUser } = useUserAuth();
  const { availabilities, fetchAvailabilities, deleteAvailability, loading } = useAppointments(currentUser);
  
  const handleDeleteAvailability = async (availabilityId: string) => {
    await deleteAvailability(availabilityId);
  };
  
  const isAvailabilityActive = (availability: any) => {
    const now = new Date();
    const endDate = parseISO(availability.end_date);
    return isAfter(endDate, now);
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Your Availability Periods</h2>
      
      {loading ? (
        <p>Loading availability...</p>
      ) : availabilities.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              You haven't set any availability periods yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {availabilities.map((availability) => (
            <Card key={availability.id} className={isAvailabilityActive(availability) ? '' : 'opacity-70'}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">
                      {format(parseISO(availability.start_date), 'MMM d, yyyy')} - {format(parseISO(availability.end_date), 'MMM d, yyyy')}
                    </CardTitle>
                    <CardDescription>
                      {availability.availability_type === 'recurring' ? 'Weekly Schedule' : 'Specific Dates'}
                    </CardDescription>
                  </div>
                  <Badge variant={isAvailabilityActive(availability) ? 'default' : 'outline'}>
                    {isAvailabilityActive(availability) ? 'Active' : 'Expired'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                  <Clock className="h-4 w-4" /> 
                  Time Slots
                </h4>
                
                <ul className="space-y-2">
                  {availability.time_slots?.map((slot: any, index: number) => (
                    <li key={index} className="text-sm border rounded-md p-2">
                      {availability.availability_type === 'recurring' && slot.day_of_week !== undefined && (
                        <div className="font-medium">
                          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][slot.day_of_week]}
                        </div>
                      )}
                      <div className="text-muted-foreground">
                        {slot.start_time} - {slot.end_time}
                      </div>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-4 flex justify-end">
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleDeleteAvailability(availability.id)}
                    disabled={!isAvailabilityActive(availability)}
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpertAvailabilityList;
