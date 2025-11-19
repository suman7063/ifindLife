import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Plus, Filter } from 'lucide-react';
import { useAppointmentManagement } from '@/hooks/useAppointmentManagement';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import AppointmentCard from './AppointmentCard';
import { AppointmentListSkeleton } from '@/components/common/LoadingStates';
import { supabase } from '@/integrations/supabase/client';

interface ExpertData {
  profile_picture?: string;
  specialization?: string;
  average_rating?: number;
}

const AppointmentList: React.FC = () => {
  const { user } = useSimpleAuth();
  const userProfile = null; // Simplified for now
  const { appointments, loading, error, fetchAppointments } = useAppointmentManagement(userProfile);
  const [expertDataMap, setExpertDataMap] = useState<Record<string, ExpertData>>({});
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  // Fetch expert data for appointments
  useEffect(() => {
    const fetchExpertData = async () => {
      if (appointments.length === 0) return;

      const expertIds = [...new Set(appointments.map(apt => apt.expert_id))];
      
      try {
        const { data: experts, error } = await supabase
          .from('expert_accounts')
          .select('auth_id, profile_picture, specialization, average_rating')
          .in('auth_id', expertIds);

        if (error) {
          console.error('Error fetching expert data:', error);
          return;
        }

        const expertMap: Record<string, ExpertData> = {};
        experts?.forEach(expert => {
          const expertKey = expert.auth_id;
          if (expertKey) {
            expertMap[expertKey] = {
              profile_picture: expert.profile_picture,
              specialization: expert.specialization,
              average_rating: expert.average_rating
            };
          }
        });

        setExpertDataMap(expertMap);
      } catch (error) {
        console.error('Error fetching expert data:', error);
      }
    };

    fetchExpertData();
  }, [appointments]);

  const filterAppointments = (status: 'upcoming' | 'past' | 'all') => {
    const now = new Date();
    
    switch (status) {
      case 'upcoming':
        return appointments.filter(apt => {
          const aptDate = new Date(`${apt.appointment_date}T${apt.start_time}`);
          return aptDate > now && (apt.status === 'confirmed' || apt.status === 'pending');
        });
      case 'past':
        return appointments.filter(apt => {
          const aptDate = new Date(`${apt.appointment_date}T${apt.start_time}`);
          return aptDate < now || apt.status === 'completed' || apt.status === 'cancelled';
        });
      default:
        return appointments;
    }
  };

  const upcomingAppointments = filterAppointments('upcoming');
  const pastAppointments = filterAppointments('past');
  const allAppointments = filterAppointments('all');

  const getAppointmentStats = () => {
    return {
      total: appointments.length,
      upcoming: upcomingAppointments.length,
      completed: appointments.filter(apt => apt.status === 'completed').length,
      cancelled: appointments.filter(apt => apt.status === 'cancelled').length
    };
  };

  const stats = getAppointmentStats();

  if (loading) {
    return <AppointmentListSkeleton />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => fetchAppointments(user?.id)}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">My Appointments</h1>
          <p className="text-muted-foreground">
            Manage your scheduled sessions and join calls
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Book New Session
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.upcoming}</div>
            <div className="text-sm text-muted-foreground">Upcoming</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.completed}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
            <div className="text-sm text-muted-foreground">Cancelled</div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Your Sessions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingAppointments.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past ({pastAppointments.length})
              </TabsTrigger>
              <TabsTrigger value="all">
                All ({allAppointments.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4 mt-6">
              {upcomingAppointments.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No upcoming appointments
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Book a session with one of our experts to get started.
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Book Your First Session
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={{
                        ...appointment,
                        start_time: appointment.start_time || '00:00',
                        end_time: appointment.end_time || '00:00'
                      }}
                      expertData={expertDataMap[appointment.expert_id]}
                      showCallActions={true}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4 mt-6">
              {pastAppointments.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No past appointments
                  </h3>
                  <p className="text-gray-500">
                    Your completed sessions will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pastAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={{
                        ...appointment,
                        start_time: appointment.start_time || '00:00',
                        end_time: appointment.end_time || '00:00'
                      }}
                      expertData={expertDataMap[appointment.expert_id]}
                      showCallActions={false}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="all" className="space-y-4 mt-6">
              {allAppointments.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No appointments yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Start your wellness journey by booking a session.
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Book Your First Session
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {allAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={{
                        ...appointment,
                        start_time: appointment.start_time || '00:00',
                        end_time: appointment.end_time || '00:00'
                      }}
                      expertData={expertDataMap[appointment.expert_id]}
                      showCallActions={appointment.status === 'confirmed'}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentList;