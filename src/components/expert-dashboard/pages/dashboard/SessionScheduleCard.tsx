import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Clock, User, Video, Phone, MessageSquare } from 'lucide-react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { format } from 'date-fns';

interface Session {
  id: string;
  clientName: string;
  clientAvatar?: string;
  sessionType: 'video' | 'audio' | 'chat';
  scheduledTime: Date;
  duration: number; // in minutes
  status: 'scheduled' | 'completed' | 'cancelled' | 'in-progress';
  notes?: string;
}

const SessionScheduleCard: React.FC = () => {
  const { expert } = useSimpleAuth();
  const [sessions, setSessions] = useState<{
    today: Session[];
    upcoming: Session[];
    history: Session[];
  }>({
    today: [],
    upcoming: [],
    history: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (expert?.id) {
      loadSessions();
    }
  }, [expert?.id]);

  const loadSessions = async () => {
    try {
      // Mock data - replace with actual API calls
      const mockSessions: Session[] = [
        {
          id: '1',
          clientName: 'Sarah Johnson',
          sessionType: 'video',
          scheduledTime: new Date(),
          duration: 60,
          status: 'scheduled',
          notes: 'Follow-up session for anxiety management'
        },
        {
          id: '2', 
          clientName: 'Michael Chen',
          sessionType: 'audio',
          scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
          duration: 45,
          status: 'scheduled'
        },
        {
          id: '3',
          clientName: 'Emma Williams',
          sessionType: 'chat',
          scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
          duration: 30,
          status: 'scheduled'
        },
        {
          id: '4',
          clientName: 'David Brown',
          sessionType: 'video',
          scheduledTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
          duration: 60,
          status: 'completed'
        },
        {
          id: '5',
          clientName: 'Lisa Davis',
          sessionType: 'audio',
          scheduledTime: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
          duration: 45,
          status: 'completed'
        }
      ];

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

      setSessions({
        today: mockSessions.filter(session => {
          const sessionDate = new Date(session.scheduledTime);
          return sessionDate >= today && sessionDate < tomorrow && session.status !== 'completed';
        }),
        upcoming: mockSessions.filter(session => {
          const sessionDate = new Date(session.scheduledTime);
          return sessionDate >= tomorrow && session.status !== 'completed';
        }),
        history: mockSessions.filter(session => session.status === 'completed')
      });
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSessionIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'audio':
        return <Phone className="h-4 w-4" />;
      case 'chat':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Scheduled</Badge>;
      case 'in-progress':
        return <Badge variant="default" className="bg-green-100 text-green-800">In Progress</Badge>;
      case 'completed':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-700">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const SessionItem: React.FC<{ session: Session }> = ({ session }) => (
    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            {getSessionIcon(session.sessionType)}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{session.clientName}</p>
            {getStatusBadge(session.status)}
          </div>
          <div className="flex items-center text-xs text-muted-foreground gap-2">
            <Clock className="h-3 w-3" />
            {format(session.scheduledTime, 'HH:mm')} • {session.duration}min
          </div>
          {session.notes && (
            <p className="text-xs text-muted-foreground mt-1 truncate">{session.notes}</p>
          )}
        </div>
      </div>
      {session.status === 'scheduled' && (
        <Button size="sm" variant="outline">
          Join
        </Button>
      )}
    </div>
  );

  const EmptyState: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center py-8 text-muted-foreground">
      <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
      <p className="text-sm">{message}</p>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Schedule</CardTitle>
        <CardDescription>View and manage your upcoming sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="today">
              Today ({sessions.today.length})
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              Upcoming ({sessions.upcoming.length})
            </TabsTrigger>
            <TabsTrigger value="history">
              History ({sessions.history.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="today" className="mt-4">
            <ScrollArea className="h-[300px]">
              <div className="space-y-3">
                {sessions.today.length > 0 ? (
                  sessions.today.map((session) => (
                    <SessionItem key={session.id} session={session} />
                  ))
                ) : (
                  <EmptyState message="No sessions scheduled for today" />
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="upcoming" className="mt-4">
            <ScrollArea className="h-[300px]">
              <div className="space-y-3">
                {sessions.upcoming.length > 0 ? (
                  sessions.upcoming.map((session) => (
                    <SessionItem key={session.id} session={session} />
                  ))
                ) : (
                  <EmptyState message="No upcoming sessions scheduled" />
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="history" className="mt-4">
            <ScrollArea className="h-[300px]">
              <div className="space-y-3">
                {sessions.history.length > 0 ? (
                  sessions.history.map((session) => (
                    <SessionItem key={session.id} session={session} />
                  ))
                ) : (
                  <EmptyState message="No session history available" />
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SessionScheduleCard;