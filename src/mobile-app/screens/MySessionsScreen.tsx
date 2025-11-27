import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Video, MessageSquare, Star, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Mock data for demo purposes
const MOCK_SESSIONS = [
  {
    id: '1',
    expertName: 'Dr. Ananya Sharma',
    expertImage: 'https://i.pravatar.cc/150?img=1',
    service: 'Mental Health Counseling',
    date: '2024-01-28',
    time: '10:00 AM',
    duration: 60,
    status: 'upcoming',
    type: 'video',
    rating: null
  },
  {
    id: '2',
    expertName: 'Ms. Priya Menon',
    expertImage: 'https://i.pravatar.cc/150?img=5',
    service: 'Life Coach',
    date: '2024-01-30',
    time: '3:00 PM',
    duration: 30,
    status: 'upcoming',
    type: 'audio',
    rating: null
  },
  {
    id: '3',
    expertName: 'Dr. Rajesh Kumar',
    expertImage: 'https://i.pravatar.cc/150?img=12',
    service: 'Career Guidance',
    date: '2024-01-20',
    time: '11:00 AM',
    duration: 60,
    status: 'completed',
    type: 'video',
    rating: 5
  },
  {
    id: '4',
    expertName: 'Ms. Deepa Patel',
    expertImage: 'https://i.pravatar.cc/150?img=9',
    service: 'Relationship Counseling',
    date: '2024-01-18',
    time: '2:00 PM',
    duration: 45,
    status: 'completed',
    type: 'video',
    rating: 4
  },
  {
    id: '5',
    expertName: 'Dr. Arjun Singh',
    expertImage: 'https://i.pravatar.cc/150?img=14',
    service: 'Stress Management',
    date: '2024-01-15',
    time: '4:30 PM',
    duration: 30,
    status: 'completed',
    type: 'audio',
    rating: 5
  },
  {
    id: '6',
    expertName: 'Ms. Neha Agarwal',
    expertImage: 'https://i.pravatar.cc/150?img=16',
    service: 'Meditation & Mindfulness',
    date: '2024-01-25',
    time: '5:00 PM',
    duration: 30,
    status: 'cancelled',
    type: 'video',
    rating: null
  }
];

export const MySessionsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getFilteredSessions = () => {
    switch (activeTab) {
      case 'upcoming':
        return MOCK_SESSIONS.filter(s => s.status === 'upcoming');
      case 'completed':
        return MOCK_SESSIONS.filter(s => s.status === 'completed');
      case 'cancelled':
        return MOCK_SESSIONS.filter(s => s.status === 'cancelled');
      default:
        return MOCK_SESSIONS;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="flex flex-col bg-background p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Sessions</h1>
        <p className="text-sm text-muted-foreground">View and manage your appointments</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-3 mt-4">
          {getFilteredSessions().length > 0 ? (
            getFilteredSessions().map((session) => (
              <Card key={session.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={session.expertImage} />
                      <AvatarFallback>
                        <User className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{session.expertName}</h3>
                      <p className="text-xs text-muted-foreground">{session.service}</p>
                      {session.rating && (
                        <div className="flex items-center gap-1 mt-1">
                          {renderStars(session.rating)}
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge className={getStatusColor(session.status)}>
                    {session.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(session.date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{session.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {session.type === 'video' ? (
                      <Video className="h-4 w-4" />
                    ) : (
                      <MessageSquare className="h-4 w-4" />
                    )}
                    <span>{session.duration} min</span>
                  </div>
                </div>

                {session.status === 'upcoming' && (
                  <div className="flex gap-2 pt-2 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                    >
                      Reschedule
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-destructive hover:text-destructive"
                    >
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-ifind-aqua hover:bg-ifind-teal text-white"
                    >
                      Join
                    </Button>
                  </div>
                )}

                {session.status === 'completed' && !session.rating && (
                  <div className="flex gap-2 pt-2 border-t">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-ifind-aqua hover:bg-ifind-teal text-white"
                    >
                      Rate Session
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                    >
                      Book Again
                    </Button>
                  </div>
                )}
              </Card>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">No {activeTab} sessions</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
