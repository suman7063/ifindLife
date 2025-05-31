
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MessageSquare, Users, TrendingUp } from 'lucide-react';

interface WelcomeSectionProps {
  expertName: string;
  expertStatus: string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ expertName, expertStatus }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Welcome back, {expertName}!</CardTitle>
            <CardDescription className="text-lg mt-1">
              Here's what's happening with your practice today
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(expertStatus)}
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Session
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <div className="text-sm text-gray-600">Active Clients</div>
              <div className="text-xl font-semibold">12</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <Calendar className="h-8 w-8 text-green-600" />
            <div>
              <div className="text-sm text-gray-600">Today's Sessions</div>
              <div className="text-xl font-semibold">4</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
            <MessageSquare className="h-8 w-8 text-purple-600" />
            <div>
              <div className="text-sm text-gray-600">Unread Messages</div>
              <div className="text-xl font-semibold">7</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
            <TrendingUp className="h-8 w-8 text-orange-600" />
            <div>
              <div className="text-sm text-gray-600">This Month</div>
              <div className="text-xl font-semibold">$2,450</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeSection;
