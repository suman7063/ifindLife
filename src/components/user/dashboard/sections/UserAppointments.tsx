
import React from 'react';
import { UserProfile } from '@/types/database/unified';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Plus, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useUserAppointments } from '@/hooks/useUserAppointments';
import AppointmentCard from '../components/AppointmentCard';

interface UserAppointmentsProps {
  user: UserProfile | null;
}

const UserAppointments: React.FC<UserAppointmentsProps> = ({ user }) => {
  const navigate = useNavigate();
  
  const {
    upcomingAppointments,
    pastAppointments,
    loading,
    error,
    cancelAppointment,
    rescheduleAppointment
  } = useUserAppointments(user?.id);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Your Appointments</h2>
          <p className="text-muted-foreground">
            View and manage your scheduled sessions
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Loading Appointments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Your Appointments</h2>
          <p className="text-muted-foreground">
            View and manage your scheduled sessions
          </p>
        </div>
        
        <Card>
          <CardContent className="py-8">
            <div className="flex items-center justify-center text-red-600">
              <AlertCircle className="h-6 w-6 mr-2" />
              <span>Failed to load appointments. Please try refreshing the page.</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Your Appointments</h2>
          <p className="text-muted-foreground">
            View and manage your scheduled sessions
          </p>
        </div>
        <Button onClick={() => navigate('/experts')}>
          <Plus className="h-4 w-4 mr-2" />
          Book Session
        </Button>
      </div>
      
      {/* Upcoming Sessions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-medium">
            Upcoming Sessions ({upcomingAppointments.length})
          </CardTitle>
          <Calendar className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length > 0 ? (
            <div className="grid gap-4">
              {upcomingAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  type="upcoming"
                  onCancel={cancelAppointment}
                  onReschedule={rescheduleAppointment}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-lg text-muted-foreground mb-4">
                You don't have any upcoming appointments
              </p>
              <Button onClick={() => navigate('/experts')}>
                <Plus className="h-4 w-4 mr-2" />
                Book a Consultation
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Past Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Past Sessions ({pastAppointments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {pastAppointments.length > 0 ? (
            <div className="grid gap-4">
              {pastAppointments.slice(0, 5).map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  type="past"
                />
              ))}
              {pastAppointments.length > 5 && (
                <div className="text-center pt-4">
                  <Button variant="outline">
                    View All Past Sessions
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">
                No past sessions found
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAppointments;
