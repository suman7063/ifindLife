
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { 
  Video, 
  Phone, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  FileText, 
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  Square
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface Session {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  type: 'video' | 'audio' | 'in-person';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  actualDuration?: number;
  notes: string;
  goals: string[];
  outcomes: string[];
  nextSteps: string[];
  rating?: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  amount: number;
}

const SessionManager: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [sessionTimer, setSessionTimer] = useState({ isRunning: false, elapsed: 0 });

  const [sessions] = useState<Session[]>([
    {
      id: '1',
      clientId: '1',
      clientName: 'Sarah Johnson',
      clientAvatar: '/lovable-uploads/avatar1.jpg',
      type: 'video',
      status: 'scheduled',
      startTime: new Date(Date.now() + 3600000), // 1 hour from now
      endTime: new Date(Date.now() + 7200000), // 2 hours from now
      duration: 60,
      notes: 'Follow up on anxiety management techniques',
      goals: ['Practice breathing exercises', 'Discuss work stress'],
      outcomes: [],
      nextSteps: [],
      paymentStatus: 'paid',
      amount: 120
    },
    {
      id: '2',
      clientId: '2',
      clientName: 'Michael Chen',
      clientAvatar: '/lovable-uploads/avatar2.jpg',
      type: 'video',
      status: 'completed',
      startTime: new Date(Date.now() - 86400000), // Yesterday
      endTime: new Date(Date.now() - 82800000),
      duration: 60,
      actualDuration: 55,
      notes: 'Discussed career transition and stress management strategies. Client showed good progress.',
      goals: ['Career guidance', 'Stress reduction techniques'],
      outcomes: ['Identified 3 potential career paths', 'Learned new stress management technique'],
      nextSteps: ['Research identified career options', 'Practice daily meditation'],
      rating: 5,
      paymentStatus: 'paid',
      amount: 120
    },
    {
      id: '3',
      clientId: '3',
      clientName: 'Emily Davis',
      clientAvatar: '/lovable-uploads/avatar3.jpg',
      type: 'audio',
      status: 'scheduled',
      startTime: new Date(Date.now() + 172800000), // Day after tomorrow
      endTime: new Date(Date.now() + 176400000),
      duration: 45,
      notes: 'Initial consultation for relationship counseling',
      goals: ['Assess relationship dynamics', 'Set therapy goals'],
      outcomes: [],
      nextSteps: [],
      paymentStatus: 'pending',
      amount: 100
    }
  ]);

  const todaySessions = sessions.filter(session => {
    const sessionDate = session.startTime.toDateString();
    const today = new Date().toDateString();
    return sessionDate === today;
  });

  const upcomingSessions = sessions.filter(session => {
    return session.startTime > new Date() && session.status === 'scheduled';
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no-show':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'audio':
        return <Phone className="h-4 w-4" />;
      case 'in-person':
        return <User className="h-4 w-4" />;
      default:
        return <Video className="h-4 w-4" />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const startSession = (session: Session) => {
    // In a real app, this would initiate the video/audio call
    toast.success(`Starting ${session.type} session with ${session.clientName}`);
    setSessionTimer({ isRunning: true, elapsed: 0 });
  };

  const endSession = () => {
    setSessionTimer({ isRunning: false, elapsed: 0 });
    toast.success('Session ended');
  };

  // Timer effect
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionTimer.isRunning) {
      interval = setInterval(() => {
        setSessionTimer(prev => ({ ...prev, elapsed: prev.elapsed + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionTimer.isRunning]);

  return (
    <div className="space-y-6">
      {/* Session Timer */}
      {sessionTimer.isRunning && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">Session in progress</span>
                <Badge variant="outline">
                  {Math.floor(sessionTimer.elapsed / 60)}:{(sessionTimer.elapsed % 60).toString().padStart(2, '0')}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Pause className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={endSession}>
                  <Square className="h-4 w-4" />
                  End Session
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar and Today's Sessions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Session Schedule</CardTitle>
            <CardDescription>Manage your sessions and appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="today" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="today" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Today's Sessions</h3>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Session
                  </Button>
                </div>
                
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {todaySessions.length > 0 ? (
                      todaySessions.map((session) => (
                        <div
                          key={session.id}
                          className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                          onClick={() => setSelectedSession(session)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={session.clientAvatar} />
                                <AvatarFallback>
                                  {session.clientName.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">{session.clientName}</h4>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  {getTypeIcon(session.type)}
                                  <span>{formatTime(session.startTime)} - {formatTime(session.endTime)}</span>
                                  <span>({formatDuration(session.duration)})</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(session.status)}>
                                {session.status}
                              </Badge>
                              {session.status === 'scheduled' && (
                                <Button size="sm" onClick={(e) => {
                                  e.stopPropagation();
                                  startSession(session);
                                }}>
                                  <Play className="h-4 w-4 mr-1" />
                                  Start
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No sessions scheduled for today
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="upcoming" className="space-y-4">
                <h3 className="text-lg font-medium">Upcoming Sessions</h3>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {upcomingSessions.map((session) => (
                      <div
                        key={session.id}
                        className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedSession(session)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={session.clientAvatar} />
                              <AvatarFallback>
                                {session.clientName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">{session.clientName}</h4>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                {getTypeIcon(session.type)}
                                <span>{session.startTime.toLocaleDateString()}</span>
                                <span>{formatTime(session.startTime)} - {formatTime(session.endTime)}</span>
                              </div>
                            </div>
                          </div>
                          <Badge className={getStatusColor(session.status)}>
                            {session.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="history">
                <div className="text-center py-8 text-gray-500">
                  Session history will be displayed here
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>

      {/* Session Details Modal */}
      {selectedSession && (
        <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Session Details</DialogTitle>
              <DialogDescription>
                {selectedSession.type} session with {selectedSession.clientName}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedSession.clientAvatar} />
                  <AvatarFallback className="text-xl">
                    {selectedSession.clientName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedSession.clientName}</h3>
                  <div className="flex items-center gap-2 text-gray-500">
                    {getTypeIcon(selectedSession.type)}
                    <span>{selectedSession.startTime.toLocaleDateString()}</span>
                    <span>{formatTime(selectedSession.startTime)} - {formatTime(selectedSession.endTime)}</span>
                  </div>
                  <Badge className={getStatusColor(selectedSession.status)}>
                    {selectedSession.status}
                  </Badge>
                </div>
              </div>

              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Duration</Label>
                      <div className="text-sm">{formatDuration(selectedSession.duration)}</div>
                      {selectedSession.actualDuration && (
                        <div className="text-xs text-gray-500">
                          Actual: {formatDuration(selectedSession.actualDuration)}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label>Payment</Label>
                      <div className="text-sm">${selectedSession.amount}</div>
                      <Badge variant="outline" className="text-xs">
                        {selectedSession.paymentStatus}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <Label>Session Goals</Label>
                    <div className="space-y-1 mt-1">
                      {selectedSession.goals.map((goal, index) => (
                        <Badge key={index} variant="outline" className="mr-1">
                          {goal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="space-y-4">
                  <div>
                    <Label>Session Notes</Label>
                    <Textarea
                      value={selectedSession.notes}
                      readOnly={selectedSession.status === 'completed'}
                      rows={6}
                      className="mt-2"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="outcomes" className="space-y-4">
                  {selectedSession.status === 'completed' ? (
                    <>
                      <div>
                        <Label>Outcomes Achieved</Label>
                        <div className="space-y-1 mt-1">
                          {selectedSession.outcomes.map((outcome, index) => (
                            <div key={index} className="text-sm p-2 bg-green-50 rounded">
                              {outcome}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <Label>Next Steps</Label>
                        <div className="space-y-1 mt-1">
                          {selectedSession.nextSteps.map((step, index) => (
                            <div key={index} className="text-sm p-2 bg-blue-50 rounded">
                              {step}
                            </div>
                          ))}
                        </div>
                      </div>

                      {selectedSession.rating && (
                        <div>
                          <Label>Client Rating</Label>
                          <div className="text-2xl font-bold text-yellow-500">
                            {'★'.repeat(selectedSession.rating)}{'☆'.repeat(5 - selectedSession.rating)}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Outcomes will be available after the session is completed
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedSession(null)}>
                  Close
                </Button>
                {selectedSession.status === 'scheduled' && (
                  <Button onClick={() => startSession(selectedSession)}>
                    <Play className="h-4 w-4 mr-2" />
                    Start Session
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SessionManager;
