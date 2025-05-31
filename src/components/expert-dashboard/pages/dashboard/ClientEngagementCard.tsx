
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Phone, Calendar, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface ClientActivity {
  id: string;
  name: string;
  avatar?: string;
  lastSession: string;
  nextSession?: string;
  status: 'active' | 'pending' | 'completed';
  sessionCount: number;
  lastMessage?: string;
  responseTime: string;
}

const ClientEngagementCard: React.FC = () => {
  const recentClients: ClientActivity[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: '/lovable-uploads/avatar1.jpg',
      lastSession: '2 hours ago',
      nextSession: 'Tomorrow 2:00 PM',
      status: 'active',
      sessionCount: 8,
      lastMessage: 'Thank you for the session!',
      responseTime: '15 min'
    },
    {
      id: '2',
      name: 'Michael Chen',
      lastSession: '1 day ago',
      nextSession: 'Friday 10:00 AM',
      status: 'active',
      sessionCount: 5,
      lastMessage: 'Looking forward to our next session',
      responseTime: '1 hr'
    },
    {
      id: '3',
      name: 'Emma Davis',
      lastSession: '3 days ago',
      status: 'pending',
      sessionCount: 12,
      lastMessage: 'Can we reschedule?',
      responseTime: '3 hrs'
    },
    {
      id: '4',
      name: 'James Wilson',
      lastSession: '1 week ago',
      status: 'completed',
      sessionCount: 15,
      responseTime: '24 hrs'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      pending: 'secondary',
      completed: 'outline'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || 'default'}>{status}</Badge>;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Engagement</CardTitle>
        <CardDescription>Recent client interactions and upcoming sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentClients.map((client) => (
            <div key={client.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={client.avatar} alt={client.name} />
                  <AvatarFallback>{getInitials(client.name)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{client.name}</h4>
                    {getStatusBadge(client.status)}
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Last session: {client.lastSession}</p>
                    {client.nextSession && (
                      <p className="text-blue-600">Next: {client.nextSession}</p>
                    )}
                    {client.lastMessage && (
                      <p className="italic truncate max-w-xs">"{client.lastMessage}"</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right text-sm">
                  <p className="font-medium">{client.sessionCount} sessions</p>
                  <p className="text-gray-500">Response: {client.responseTime}</p>
                </div>
                
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Calendar className="h-4 w-4" />
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Schedule Session</DropdownMenuItem>
                      <DropdownMenuItem>Add Notes</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-green-600">89%</p>
              <p className="text-xs text-gray-600">Client Retention</p>
            </div>
            <div>
              <p className="text-lg font-bold text-blue-600">2.3 hrs</p>
              <p className="text-xs text-gray-600">Avg Response Time</p>
            </div>
            <div>
              <p className="text-lg font-bold text-purple-600">4.8/5</p>
              <p className="text-xs text-gray-600">Satisfaction Score</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientEngagementCard;
