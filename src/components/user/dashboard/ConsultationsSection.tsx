import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Appointment } from '@/types/appointment';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ConsultationsSection: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  // useCallback to memoize fetchAppointments
  const fetchAppointments = useCallback(async () => {
    try {
      if (!user) return null;
      
      // Simulate fetching appointments from an API
      const mockAppointments: Appointment[] = [
        {
          id: '1',
          expertName: 'Dr. Wellness',
          date: new Date().toLocaleDateString(),
          time: '10:00 AM',
          status: 'Confirmed',
        },
        {
          id: '2',
          expertName: 'Sarah Balance',
          date: new Date(Date.now() + 86400000).toLocaleDateString(),
          time: '02:00 PM',
          status: 'Pending',
        },
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return mockAppointments;
    } catch (error: any) {
      console.error('Error fetching appointments:', error);
      setError('Failed to load your appointments. Please try again later.');
      return null;
    }
  }, [user]);
  
  useEffect(() => {
    if (isAuthenticated && user) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const fetchedAppointments = await fetchAppointments();
          if (fetchedAppointments) {
            setAppointments(fetchedAppointments);
          }
        } catch (error) {
          console.error('Error fetching appointments:', error);
          setError('Failed to load your appointments. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchData();
    }
  }, [isAuthenticated, user, fetchAppointments]);

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle>Upcoming Consultations</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            {error}
          </div>
        ) : appointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 bg-muted rounded-md">
                <div>
                  <p className="font-medium">{appointment.expertName}</p>
                  <p className="text-sm text-muted-foreground">
                    {appointment.date} at {appointment.time}
                  </p>
                </div>
                <span className="text-sm font-bold">{appointment.status}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No upcoming consultations</h3>
            <p className="text-muted-foreground mb-4">
              Schedule a consultation with one of our experts
            </p>
            <Button onClick={() => navigate('/experts')} variant="outline">
              Find an Expert
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConsultationsSection;
