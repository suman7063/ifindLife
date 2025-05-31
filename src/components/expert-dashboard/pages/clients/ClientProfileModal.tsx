
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Calendar, 
  MessageSquare, 
  Video, 
  Phone, 
  Mail, 
  MapPin, 
  Star,
  TrendingUp,
  Clock,
  Target
} from 'lucide-react';

interface ClientProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    location: string;
    joinDate: Date;
    totalSessions: number;
    rating: number;
    status: 'active' | 'inactive' | 'pending';
    lastSession: Date;
    nextSession?: Date;
    goals: string[];
    notes: string;
    progress: Array<{
      date: Date;
      score: number;
      notes: string;
    }>;
    sessions: Array<{
      id: string;
      date: Date;
      duration: number;
      type: 'video' | 'chat' | 'phone';
      status: 'completed' | 'cancelled' | 'no-show';
      notes: string;
    }>;
  };
}

const ClientProfileModal: React.FC<ClientProfileModalProps> = ({
  isOpen,
  onClose,
  client
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'chat': return <MessageSquare className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Client Profile</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Client Info */}
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">
              <Avatar className="h-20 w-20 mx-auto mb-4">
                <AvatarImage src={client.avatar} />
                <AvatarFallback className="text-lg">
                  {client.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{client.name}</CardTitle>
              <Badge className={getStatusColor(client.status)}>
                {client.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{client.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{client.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>Joined {client.joinDate.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>{client.rating}/5 rating</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{client.totalSessions}</div>
                  <div className="text-xs text-gray-500">Total Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.floor((Date.now() - client.joinDate.getTime()) / (1000 * 60 * 60 * 24))}
                  </div>
                  <div className="text-xs text-gray-500">Days as Client</div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button size="sm" className="flex-1">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Message
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Video className="h-4 w-4 mr-1" />
                  Call
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Information */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="h-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="sessions">Sessions</TabsTrigger>
                <TabsTrigger value="progress">Progress</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Current Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {client.goals.map((goal, index) => (
                        <Badge key={index} variant="outline" className="mr-2 mb-2">
                          {goal}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Last Session</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg font-semibold">
                        {client.lastSession.toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {Math.floor((Date.now() - client.lastSession.getTime()) / (1000 * 60 * 60 * 24))} days ago
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Next Session</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {client.nextSession ? (
                        <>
                          <div className="text-lg font-semibold">
                            {client.nextSession.toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            in {Math.ceil((client.nextSession.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-gray-500">No upcoming session</div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="sessions">
                <Card>
                  <CardHeader>
                    <CardTitle>Session History</CardTitle>
                    <CardDescription>All sessions with this client</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-4">
                        {client.sessions.map((session) => (
                          <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              {getSessionTypeIcon(session.type)}
                              <div>
                                <div className="font-medium">
                                  {session.date.toLocaleDateString()}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {session.duration} minutes • {session.type}
                                </div>
                              </div>
                            </div>
                            <Badge 
                              variant={session.status === 'completed' ? 'default' : 'destructive'}
                            >
                              {session.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="progress">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Progress Tracking
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-4">
                        {client.progress.map((entry, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                              {entry.score}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">
                                {entry.date.toLocaleDateString()}
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                {entry.notes}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes">
                <Card>
                  <CardHeader>
                    <CardTitle>Client Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm leading-relaxed">
                      {client.notes || 'No notes available for this client.'}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientProfileModal;
