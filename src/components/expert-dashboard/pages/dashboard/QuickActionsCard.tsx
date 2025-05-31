
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, MessageSquare, DollarSign, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
}

const QuickActionsCard: React.FC = () => {
  const navigate = useNavigate();

  const quickActions: QuickAction[] = [
    {
      title: "Set Available Hours",
      description: "Update your availability",
      icon: Calendar,
      action: () => navigate('/expert-dashboard/schedule')
    },
    {
      title: "Update Profile",
      description: "Edit your professional profile",
      icon: Users,
      action: () => navigate('/expert-dashboard/profile')
    },
    {
      title: "Check Messages",
      description: "View client messages",
      icon: MessageSquare,
      action: () => navigate('/expert-dashboard/messages')
    },
    {
      title: "View Earnings",
      description: "Check your earnings",
      icon: DollarSign,
      action: () => navigate('/expert-dashboard/earnings')
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks to manage your practice</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {quickActions.map((action, index) => (
          <Button 
            key={index}
            className="w-full justify-between" 
            variant="outline"
            onClick={action.action}
          >
            <div className="flex items-center">
              <action.icon className="h-4 w-4 mr-2" />
              <div className="text-left">
                <p className="font-medium">{action.title}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4" />
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
