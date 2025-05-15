
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfile } from '@/types/supabase/user';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Appointment } from '@/types/appointment';

interface ConsultationsSectionProps {
  user: UserProfile;
}

const ConsultationsSection: React.FC<ConsultationsSectionProps> = ({ user }) => {
  // In a real application, this would come from an API
  const appointments: Appointment[] = [];
  
  const upcomingAppointments = appointments.filter(
    app => app.status === 'confirmed' || app.status === 'pending'
  );
  
  const pastAppointments = appointments.filter(
    app => app.status === 'completed' || app.status === 'cancelled'
  );

  const renderAppointmentCard = (appointment: Appointment) => (
    <Card key={appointment.id} className="mb-4">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h3 className="font-medium">{appointment.expert_name}</h3>
            <p className="text-sm text-gray-500">{appointment.appointment_date}</p>
            <p className="text-sm text-gray-500">
              {appointment.start_time} - {appointment.end_time}
            </p>
          </div>
          <div className="mt-2 md:mt-0 text-right">
            <Badge 
              className={`
                ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
                ${appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                ${appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                ${appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' : ''}
              `}
            >
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Consultations</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upcoming">
          <TabsList className="mb-4">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map(renderAppointmentCard)
            ) : (
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <p>You don't have any upcoming consultations.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past">
            {pastAppointments.length > 0 ? (
              pastAppointments.map(renderAppointmentCard)
            ) : (
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <p>You don't have any past consultations.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ConsultationsSection;
