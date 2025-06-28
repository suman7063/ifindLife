
import React from 'react';
import { UserProfile } from '@/types/database/unified';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Video } from 'lucide-react';

interface ConsultationsSectionProps {
  user?: UserProfile;
}

const ConsultationsSection: React.FC<ConsultationsSectionProps> = ({ user }) => {
  // Mock consultation data - in a real app, this would come from the database
  const consultations = [
    {
      id: 1,
      expertName: 'Dr. Sarah Johnson',
      date: '2024-01-20',
      time: '10:00 AM',
      duration: 60,
      status: 'upcoming',
      type: 'Video Call',
      notes: 'Follow-up session for stress management'
    },
    {
      id: 2,
      expertName: 'Dr. Michael Chen',
      date: '2024-01-15',
      time: '2:00 PM',
      duration: 45,
      status: 'completed',
      type: 'Phone Call',
      notes: 'Initial consultation for anxiety support'
    }
  ];

  const upcomingConsultations = consultations.filter(c => c.status === 'upcoming');
  const pastConsultations = consultations.filter(c => c.status === 'completed');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const renderConsultationCard = (consultation: any) => (
    <Card key={consultation.id} className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{consultation.expertName}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Calendar className="h-4 w-4" />
              {consultation.date} at {consultation.time}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(consultation.status)}>
            {consultation.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{consultation.duration} minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <Video className="h-4 w-4 text-muted-foreground" />
            <span>{consultation.type}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>1-on-1 Session</span>
          </div>
        </div>
        {consultation.notes && (
          <div className="mt-3 p-2 bg-muted rounded-md">
            <p className="text-sm">{consultation.notes}</p>
          </div>
        )}
        {consultation.status === 'upcoming' && (
          <div className="mt-4 flex gap-2">
            <Button size="sm">Join Session</Button>
            <Button size="sm" variant="outline">Reschedule</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Consultations</h2>
        <p className="text-muted-foreground">Manage your consultation sessions with experts</p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
          <TabsTrigger value="past">Past Sessions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-6">
          {upcomingConsultations.length > 0 ? (
            <div className="space-y-4">
              {upcomingConsultations.map(renderConsultationCard)}
            </div>
          ) : (
            <div className="bg-muted p-12 rounded-lg text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No Upcoming Consultations</h3>
              <p className="text-muted-foreground mb-6">
                You don't have any scheduled consultations. Book a session with an expert to get started!
              </p>
              <Button>
                <a href="/experts">Find Experts</a>
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="mt-6">
          {pastConsultations.length > 0 ? (
            <div className="space-y-4">
              {pastConsultations.map(renderConsultationCard)}
            </div>
          ) : (
            <div className="bg-muted p-12 rounded-lg text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No Past Consultations</h3>
              <p className="text-muted-foreground">
                Your completed consultation sessions will appear here.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConsultationsSection;
