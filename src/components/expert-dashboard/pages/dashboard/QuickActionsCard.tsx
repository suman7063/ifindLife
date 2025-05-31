
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MessageSquare, Users, FileText, Video, Phone } from 'lucide-react';

const QuickActionsCard: React.FC = () => {
  const actions = [
    {
      title: 'Schedule Session',
      description: 'Book a new session with a client',
      icon: Calendar,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Send Message',
      description: 'Start a conversation',
      icon: MessageSquare,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'View Clients',
      description: 'Manage client relationships',
      icon: Users,
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Create Note',
      description: 'Add session notes',
      icon: FileText,
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      title: 'Start Video Call',
      description: 'Begin emergency session',
      icon: Video,
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      title: 'Quick Call',
      description: 'Make a phone call',
      icon: Phone,
      color: 'bg-indigo-500 hover:bg-indigo-600'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Frequently used actions for efficient workflow</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start space-y-2 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className={`p-2 rounded-md ${action.color} text-white`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
