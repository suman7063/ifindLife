
import React, { useState } from 'react';
import { UserProfile } from '@/types/supabase/user';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarClock, Calendar, History, FileText, Video } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ConsultationsSectionProps {
  user: UserProfile | null;
}

interface ConsultationProps {
  id: string;
  expertName: string;
  date: string;
  time: string;
  service: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
}

// Mock data for demonstrations
const mockConsultations: ConsultationProps[] = [
  {
    id: '1',
    expertName: 'Dr. Jane Smith',
    date: '2025-05-15',
    time: '10:00 AM',
    service: 'Stress Management',
    status: 'upcoming',
  },
  {
    id: '2',
    expertName: 'Dr. Michael Johnson',
    date: '2025-05-07',
    time: '2:30 PM',
    service: 'Career Counselling',
    status: 'upcoming',
  },
  {
    id: '3',
    expertName: 'Dr. Sarah Williams',
    date: '2025-04-20',
    time: '11:15 AM',
    service: 'Mental Health Assessment',
    status: 'completed',
    notes: 'Follow-up recommended in 2 weeks. Progress with relaxation techniques noted.'
  },
  {
    id: '4',
    expertName: 'Dr. Robert Davis',
    date: '2025-04-10',
    time: '3:00 PM',
    service: 'Relationship Counselling',
    status: 'completed',
    notes: 'Communication exercises assigned. Next session will focus on conflict resolution.'
  },
  {
    id: '5',
    expertName: 'Dr. Emily Chen',
    date: '2025-04-05',
    time: '9:30 AM',
    service: 'Depression Therapy',
    status: 'cancelled',
  },
];

const ConsultationCard: React.FC<{ consultation: ConsultationProps }> = ({ consultation }) => {
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
            <div className="bg-primary/10 p-3 rounded-full mb-2 md:mb-0">
              {consultation.status === 'upcoming' ? (
                <CalendarClock className="h-6 w-6 text-primary" />
              ) : (
                <History className="h-6 w-6 text-primary" />
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">{consultation.service}</h3>
              <p className="text-muted-foreground">with {consultation.expertName}</p>
              <div className="flex items-center gap-2 mt-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{consultation.date} at {consultation.time}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col mt-4 md:mt-0 md:items-end">
            <Badge className={`${getStatusColor(consultation.status)} capitalize mb-2`}>
              {consultation.status}
            </Badge>
            
            <div className="flex gap-2 mt-2">
              {consultation.status === 'upcoming' && (
                <>
                  <Button size="sm" variant="outline">Reschedule</Button>
                  <Button size="sm" variant="outline">Cancel</Button>
                  <Button size="sm">Join Session</Button>
                </>
              )}
              
              {consultation.status === 'completed' && (
                <>
                  <Dialog open={showNotesDialog} onOpenChange={setShowNotesDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        View Notes
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Session Notes</DialogTitle>
                        <DialogDescription>
                          {consultation.service} with {consultation.expertName} on {consultation.date}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <p>{consultation.notes || 'No session notes available.'}</p>
                      </div>
                      <DialogFooter>
                        <Button onClick={() => setShowNotesDialog(false)}>Close</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <Button size="sm" variant="outline">
                    <Video className="h-4 w-4 mr-2" />
                    Recording
                  </Button>
                  
                  <Button size="sm">Book Again</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ConsultationsSection: React.FC<ConsultationsSectionProps> = ({ user }) => {
  const upcomingConsultations = mockConsultations.filter(c => c.status === 'upcoming');
  const pastConsultations = mockConsultations.filter(c => c.status === 'completed');
  const cancelledConsultations = mockConsultations.filter(c => c.status === 'cancelled');
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Consultations</h2>
        <p className="text-muted-foreground">
          View and manage your scheduled and past consultations
        </p>
      </div>
      
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcomingConsultations.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastConsultations.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({cancelledConsultations.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          {upcomingConsultations.length > 0 ? (
            <div className="space-y-4">
              {upcomingConsultations.map(consultation => (
                <ConsultationCard key={consultation.id} consultation={consultation} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="py-6">
                  <CalendarClock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No upcoming consultations</h3>
                  <p className="text-muted-foreground mb-4">
                    You don't have any scheduled consultations at the moment.
                  </p>
                  <Button>Book a Consultation</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="past">
          {pastConsultations.length > 0 ? (
            <div className="space-y-4">
              {pastConsultations.map(consultation => (
                <ConsultationCard key={consultation.id} consultation={consultation} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="py-6">
                  <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No past consultations</h3>
                  <p className="text-muted-foreground">
                    Your completed consultation history will appear here.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="cancelled">
          {cancelledConsultations.length > 0 ? (
            <div className="space-y-4">
              {cancelledConsultations.map(consultation => (
                <ConsultationCard key={consultation.id} consultation={consultation} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="py-6">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No cancelled consultations</h3>
                  <p className="text-muted-foreground">
                    You don't have any cancelled consultations.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConsultationsSection;
