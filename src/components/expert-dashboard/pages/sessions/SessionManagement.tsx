
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Video, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Session {
  id: string;
  clientName: string;
  clientAvatar?: string;
  date: Date;
  duration: number;
  type: 'video' | 'phone' | 'chat';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  sessionNotes?: string;
}

const SessionManagement: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: '1',
      clientName: 'Sarah Johnson',
      clientAvatar: '/lovable-uploads/avatar1.jpg',
      date: new Date(Date.now() + 1800000), // 30 minutes from now
      duration: 60,
      type: 'video',
      status: 'scheduled',
      notes: 'Focus on anxiety management techniques'
    },
    {
      id: '2',
      clientName: 'Michael Chen',
      clientAvatar: '/lovable-uploads/avatar2.jpg',
      date: new Date(Date.now() + 7200000), // 2 hours from now
      duration: 45,
      type: 'video',
      status: 'scheduled',
      notes: 'Follow-up on previous session goals'
    },
    {
      id: '3',
      clientName: 'Emily Davis',
      clientAvatar: '/lovable-uploads/avatar3.jpg',
      date: new Date(Date.now() - 86400000), // Yesterday
      duration: 60,
      type: 'video',
      status: 'completed',
      sessionNotes: 'Great progress on mindfulness exercises. Client showed significant improvement in stress management.'
    }
  ]);

  const [isNewSessionOpen, setIsNewSessionOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);

  const todaySessions = sessions.filter(session => 
    session.date.toDateString() === new Date().toDateString()
  );

  const upcomingSessions = sessions.filter(session => 
    session.date > new Date() && session.status === 'scheduled'
  ).sort((a, b) => a.date.getTime() - b.date.getTime());

  const getStatusColor = (status: Session['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: Session['type']) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'phone': return <Clock className="h-4 w-4" />;
      case 'chat': return <User className="h-4 w-4" />;
      default: return <Video className="h-4 w-4" />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const startSession = (sessionId: string) => {
    setSessions(prev =>
      prev.map(session =>
        session.id === sessionId
          ? { ...session, status: 'in-progress' as const }
          : session
      )
    );
  };

  const completeSession = (sessionId: string, sessionNotes: string) => {
    setSessions(prev =>
      prev.map(session =>
        session.id === sessionId
          ? { ...session, status: 'completed' as const, sessionNotes }
          : session
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Session Management</h1>
          <p className="text-muted-foreground">
            Manage your client sessions and appointments
          </p>
        </div>
        <Dialog open={isNewSessionOpen} onOpenChange={setIsNewSessionOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Session
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule New Session</DialogTitle>
              <DialogDescription>
                Create a new session with a client
              </DialogDescription>
            </DialogHeader>
            {/* Add session scheduling form here */}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar and Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Today's Sessions:</span>
                <span className="font-medium">{todaySessions.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>This Week:</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Completion Rate:</span>
                <span className="font-medium text-green-600">94%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Lists */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="upcoming" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Sessions</CardTitle>
                  <CardDescription>Your scheduled sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {upcomingSessions.map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={session.clientAvatar} />
                              <AvatarFallback>
                                {session.clientName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">{session.clientName}</h4>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <CalendarIcon className="h-3 w-3" />
                                <span>{session.date.toLocaleDateString()}</span>
                                <Clock className="h-3 w-3 ml-2" />
                                <span>{formatTime(session.date)}</span>
                                <span className="ml-2">({session.duration} min)</span>
                              </div>
                              {session.notes && (
                                <p className="text-sm text-gray-600 mt-1">{session.notes}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(session.status)}>
                              {session.status}
                            </Badge>
                            {getTypeIcon(session.type)}
                            <Button
                              size="sm"
                              onClick={() => startSession(session.id)}
                              disabled={session.date.getTime() - Date.now() > 300000} // Can start 5 min early
                            >
                              Start
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="today">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Sessions</CardTitle>
                  <CardDescription>Sessions scheduled for today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {todaySessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={session.clientAvatar} />
                            <AvatarFallback>
                              {session.clientName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{session.clientName}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>{formatTime(session.date)}</span>
                              <span>({session.duration} min)</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(session.status)}>
                            {session.status}
                          </Badge>
                          {session.status === 'scheduled' ? (
                            <Button size="sm" onClick={() => startSession(session.id)}>
                              <Video className="h-4 w-4 mr-1" />
                              Start
                            </Button>
                          ) : session.status === 'in-progress' ? (
                            <Button size="sm" variant="outline">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              In Progress
                            </Button>
                          ) : (
                            <Button size="sm" variant="ghost">
                              <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                              Completed
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="completed">
              <Card>
                <CardHeader>
                  <CardTitle>Completed Sessions</CardTitle>
                  <CardDescription>Recent completed sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {sessions.filter(s => s.status === 'completed').map((session) => (
                        <div key={session.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={session.clientAvatar} />
                                <AvatarFallback>
                                  {session.clientName.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">{session.clientName}</h4>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <CalendarIcon className="h-3 w-3" />
                                  <span>{session.date.toLocaleDateString()}</span>
                                  <Clock className="h-3 w-3 ml-2" />
                                  <span>{session.duration} minutes</span>
                                </div>
                              </div>
                            </div>
                            <Badge className={getStatusColor(session.status)}>
                              {session.status}
                            </Badge>
                          </div>
                          {session.sessionNotes && (
                            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                              <strong>Session Notes:</strong> {session.sessionNotes}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SessionManagement;
