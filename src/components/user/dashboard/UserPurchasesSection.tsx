
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarClock, BookOpen } from 'lucide-react';
import { formatDate } from '@/utils/formatters';

interface UserPurchasesSectionProps {
  userId?: string;
}

const UserPurchasesSection: React.FC<UserPurchasesSectionProps> = ({ userId }) => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserPurchases = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      
      try {
        // Fetch appointments
        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from('appointments')
          .select('*, services(name, rate_usd, rate_inr)')
          .eq('user_id', userId)
          .order('appointment_date', { ascending: false });
          
        if (appointmentsError) {
          console.error('Error fetching appointments:', appointmentsError);
        } else {
          setAppointments(appointmentsData || []);
        }
        
        // Fetch enrolled programs
        const { data: programsData, error: programsError } = await supabase
          .from('program_enrollments')
          .select('*, programs(id, title, image, price, duration, programType)')
          .eq('user_id', userId)
          .order('enrollment_date', { ascending: false });
          
        if (programsError) {
          console.error('Error fetching programs:', programsError);
        } else {
          setPrograms(programsData || []);
        }
      } catch (error) {
        console.error('Error fetching user purchases:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserPurchases();
  }, [userId]);
  
  if (isLoading) {
    return <div className="flex justify-center p-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>;
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Purchases</h2>
      
      <Tabs defaultValue="appointments">
        <TabsList>
          <TabsTrigger value="appointments" className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4" />
            <span>Appointments</span>
          </TabsTrigger>
          <TabsTrigger value="programs" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Programs</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="appointments" className="mt-4">
          {appointments.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">You haven't booked any appointments yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {appointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex justify-between">
                      <span>Session with {appointment.expert_name}</span>
                      <span className={`text-sm px-2 py-1 rounded ${
                        appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Date:</span>
                        <span>{formatDate(appointment.appointment_date)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Time:</span>
                        <span>{appointment.start_time} - {appointment.end_time}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Service:</span>
                        <span>{appointment.services?.name || 'Consultation'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Duration:</span>
                        <span>{appointment.duration} minutes</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="programs" className="mt-4">
          {programs.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">You haven't enrolled in any programs yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {programs.map((enrollment) => (
                <Card key={enrollment.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{enrollment.programs?.title || 'Program'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Enrolled on:</span>
                        <span>{new Date(enrollment.enrollment_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Type:</span>
                        <span>{enrollment.programs?.programType || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Duration:</span>
                        <span>{enrollment.programs?.duration || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Amount paid:</span>
                        <span>${enrollment.amount_paid}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserPurchasesSection;
