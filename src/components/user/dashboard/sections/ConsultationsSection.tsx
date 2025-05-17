
import React, { useEffect, useState } from 'react';
import { UserProfile } from '@/types/database/unified';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar, Video, Clock, Filter } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface ConsultationsSectionProps {
  user: UserProfile | null;
}

interface Appointment {
  id: string;
  expert_name: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
  notes: string;
  channel_name?: string;
  token?: string;
}

const ConsultationsSection: React.FC<ConsultationsSectionProps> = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    
    const fetchAppointments = async () => {
      setIsLoading(true);
      
      try {
        // Fetch user appointments from Supabase
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('user_id', user.id)
          .order('appointment_date', { ascending: true });
        
        if (error) {
          console.error('Error fetching appointments:', error);
          return;
        }
        
        setAppointments(data || []);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAppointments();
  }, [user]);
  
  // Filter appointments by status
  const upcomingAppointments = appointments.filter(a => 
    a.status === 'confirmed' || a.status === 'pending'
  );
  
  const pastAppointments = appointments.filter(a => 
    a.status === 'completed' || a.status === 'cancelled'
  );

  const getStatusBadgeStyle = (status: string) => {
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

  const joinConsultation = (appointment: Appointment) => {
    // This would typically navigate to a video call page
    console.log('Joining consultation:', appointment);
    navigate(`/video-call/${appointment.id}`);
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Consultations</CardTitle>
              <CardDescription>Manage your bookings and appointments</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="pt-4">
              {isLoading ? (
                <div className="py-8 text-center">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Loading appointments...</p>
                </div>
              ) : upcomingAppointments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Expert</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingAppointments.map((appointment) => {
                      const today = new Date().toISOString().split('T')[0];
                      const isToday = appointment.appointment_date === today;
                      
                      return (
                        <TableRow key={appointment.id}>
                          <TableCell className="font-medium">{appointment.expert_name}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                              {appointment.appointment_date} 
                              {isToday && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Today</span>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                              {appointment.start_time} - {appointment.end_time}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadgeStyle(appointment.status)}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {isToday && appointment.status === 'confirmed' && (
                                <Button 
                                  size="sm" 
                                  onClick={() => joinConsultation(appointment)}
                                >
                                  <Video className="mr-2 h-4 w-4" />
                                  Join
                                </Button>
                              )}
                              <Button size="sm" variant="outline">
                                View
                              </Button>
                              {appointment.status === 'pending' && (
                                <Button size="sm" variant="ghost" className="text-red-500">
                                  Cancel
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-16 text-center">
                  <p className="text-muted-foreground mb-4">You don't have any upcoming appointments</p>
                  <Button onClick={() => navigate('/experts')} variant="outline">
                    Book a Consultation
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="past" className="pt-4">
              {isLoading ? (
                <div className="py-8 text-center">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Loading appointments...</p>
                </div>
              ) : pastAppointments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Expert</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pastAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell className="font-medium">{appointment.expert_name}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            {appointment.appointment_date}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                            {appointment.start_time} - {appointment.end_time}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeStyle(appointment.status)}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                            {appointment.status === 'completed' && (
                              <Button size="sm" variant="outline">
                                Add Review
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-16 text-center">
                  <p className="text-muted-foreground">You don't have any past appointments</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsultationsSection;
