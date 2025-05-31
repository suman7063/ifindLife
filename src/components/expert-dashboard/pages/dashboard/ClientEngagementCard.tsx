
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, MessageSquare, Calendar } from 'lucide-react';

const ClientEngagementCard: React.FC = () => {
  const topClients = [
    {
      name: 'Sarah Johnson',
      avatar: '/lovable-uploads/avatar1.jpg',
      sessions: 12,
      engagement: 95,
      status: 'active',
      lastSeen: '2 hours ago'
    },
    {
      name: 'Michael Chen',
      avatar: '/lovable-uploads/avatar2.jpg',
      sessions: 8,
      engagement: 88,
      status: 'active',
      lastSeen: '1 day ago'
    },
    {
      name: 'Emma Davis',
      avatar: '/lovable-uploads/avatar3.jpg',
      sessions: 15,
      engagement: 92,
      status: 'completed',
      lastSeen: '3 days ago'
    },
    {
      name: 'John Smith',
      avatar: '/lovable-uploads/avatar4.jpg',
      sessions: 3,
      engagement: 78,
      status: 'new',
      lastSeen: '5 hours ago'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      case 'new':
        return <Badge className="bg-purple-100 text-purple-800">New</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Engagement</CardTitle>
        <CardDescription>Top engaged clients and their progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topClients.map((client, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
              <Avatar>
                <AvatarImage src={client.avatar} />
                <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium truncate">{client.name}</h4>
                  {getStatusBadge(client.status)}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Engagement Score</span>
                    <span>{client.engagement}%</span>
                  </div>
                  <Progress value={client.engagement} className="h-1" />
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {client.sessions} sessions
                  </span>
                  <span>Last seen: {client.lastSeen}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm font-medium text-blue-900">
            <TrendingUp className="h-4 w-4" />
            Engagement Insights
          </div>
          <div className="text-xs text-blue-700 mt-1">
            Your average client engagement score is 88% - 12% above platform average
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientEngagementCard;
