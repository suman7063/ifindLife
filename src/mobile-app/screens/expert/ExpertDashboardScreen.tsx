import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  Clock,
  Star,
  TrendingUp,
  Video,
  MessageSquare,
  ArrowRight,
  Bell
} from 'lucide-react';

// Mock data
const todayAppointments = [
  {
    id: 1,
    clientName: 'Sarah Wilson',
    time: '10:00 AM',
    type: 'Video Call',
    status: 'upcoming'
  },
  {
    id: 2,
    clientName: 'Michael Chen',
    time: '2:30 PM',
    type: 'Chat Session',
    status: 'upcoming'
  },
  {
    id: 3,
    clientName: 'Emma Davis',
    time: '4:00 PM',
    type: 'Video Call',
    status: 'upcoming'
  }
];

export const ExpertDashboardScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-ifind-teal/10 via-ifind-aqua/10 to-ifind-purple/10 p-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-poppins font-bold text-ifind-charcoal">
              Welcome, Dr. Sarah! 👋
            </h1>
            <p className="text-muted-foreground">
              You have 3 appointments today
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="rounded-full"
            onClick={() => navigate('/mobile-app/expert-app/notifications')}
          >
            <Bell className="h-5 w-5" />
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-ifind-teal/10 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-ifind-teal" />
                </div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-ifind-charcoal">$2,450</p>
              <p className="text-xs text-muted-foreground">This Month</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-ifind-aqua/10 rounded-xl flex items-center justify-center">
                  <Users className="h-5 w-5 text-ifind-aqua" />
                </div>
                <Star className="h-4 w-4 text-yellow-500" />
              </div>
              <p className="text-2xl font-bold text-ifind-charcoal">42</p>
              <p className="text-xs text-muted-foreground">Total Clients</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-ifind-purple/10 rounded-xl flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-ifind-purple" />
                </div>
              </div>
              <p className="text-2xl font-bold text-ifind-charcoal">18</p>
              <p className="text-xs text-muted-foreground">Sessions This Week</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                  <Star className="h-5 w-5 text-yellow-500" />
                </div>
              </div>
              <p className="text-2xl font-bold text-ifind-charcoal">4.9</p>
              <p className="text-xs text-muted-foreground">Rating (126 reviews)</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Today's Appointments */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-poppins font-semibold text-ifind-charcoal">
              Today's Appointments
            </h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/mobile-app/expert-app/appointments')}
              className="text-ifind-teal hover:text-ifind-teal"
            >
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {todayAppointments.map((appointment) => (
              <Card key={appointment.id} className="border-border/50 hover:border-ifind-aqua/30 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-ifind-aqua to-ifind-teal rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {appointment.clientName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-poppins font-medium text-ifind-charcoal">
                          {appointment.clientName}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {appointment.time}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        {appointment.type === 'Video Call' ? (
                          <Video className="h-4 w-4" />
                        ) : (
                          <MessageSquare className="h-4 w-4" />
                        )}
                        <span>{appointment.type}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-poppins font-semibold text-ifind-charcoal mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-24 flex-col space-y-2"
              onClick={() => navigate('/mobile-app/expert-app/availability')}
            >
              <Clock className="h-6 w-6 text-ifind-teal" />
              <span className="text-sm">Set Availability</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col space-y-2"
              onClick={() => navigate('/mobile-app/expert-app/earnings')}
            >
              <DollarSign className="h-6 w-6 text-ifind-aqua" />
              <span className="text-sm">View Earnings</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col space-y-2"
              onClick={() => navigate('/mobile-app/expert-app/profile')}
            >
              <Users className="h-6 w-6 text-ifind-purple" />
              <span className="text-sm">Edit Profile</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col space-y-2"
              onClick={() => navigate('/mobile-app/expert-app/appointments')}
            >
              <Calendar className="h-6 w-6 text-yellow-500" />
              <span className="text-sm">All Sessions</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
