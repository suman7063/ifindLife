
import React from 'react';
import { UserProfile } from '@/types/database/unified';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface UserAppointmentsProps {
  user: UserProfile | null;
}

const UserAppointments: React.FC<UserAppointmentsProps> = ({ user }) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Your Appointments</h2>
        <p className="text-muted-foreground">
          View and manage your scheduled sessions
        </p>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-medium">Upcoming Sessions</CardTitle>
          <Calendar className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">You don't have any upcoming appointments</p>
            <Button onClick={() => navigate('/experts')}>
              Book a Consultation
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Past Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No past sessions found
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAppointments;
