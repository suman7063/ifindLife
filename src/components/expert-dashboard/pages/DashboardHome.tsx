
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Calendar, 
  Clock, 
  DollarSign, 
  MessageCircle, 
  UserCheck, 
  Users, 
  ArrowRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const DashboardHome: React.FC = () => {
  // These would be fetched from the backend in a real implementation
  const stats = {
    totalAppointments: 12,
    upcomingAppointments: 3,
    totalClients: 8,
    earnings: 1850,
    completionRate: 95,
    averageRating: 4.7
  };
  
  const upcomingAppointments = [
    { id: 1, client: 'Sarah Johnson', time: '10:00 AM', date: 'Today', type: 'Initial Consultation' },
    { id: 2, client: 'Michael Chen', time: '2:30 PM', date: 'Today', type: 'Follow-up Session' },
    { id: 3, client: 'Emma Wilson', time: '11:15 AM', date: 'Tomorrow', type: 'Therapy Session' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Your expert portal overview and summary</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAppointments}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingAppointments}</div>
            <p className="text-xs text-muted-foreground">Next one today at 10:00 AM</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-muted-foreground">+1 new client this week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.earnings}</div>
            <p className="text-xs text-muted-foreground">+$350 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completionRate}%</div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating} ★</div>
            <p className="text-xs text-muted-foreground">From 24 reviews</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Upcoming Appointments Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingAppointments.map(appointment => (
              <div key={appointment.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-ifind-teal/20 p-2 rounded-full">
                    <Calendar className="h-5 w-5 text-ifind-teal" />
                  </div>
                  <div>
                    <h4 className="font-medium">{appointment.client}</h4>
                    <div className="flex gap-2 text-sm text-muted-foreground">
                      <span>{appointment.date}</span>
                      <span>•</span>
                      <span>{appointment.time}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <Badge className="bg-ifind-teal/10 text-ifind-teal border-none">
                    {appointment.type}
                  </Badge>
                </div>
              </div>
            ))}
            
            <Button variant="ghost" className="w-full justify-between" asChild>
              <a href="/expert-dashboard/schedule">
                View all appointments <ArrowRight className="h-4 w-4 ml-1" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Messages Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-8 rounded-lg flex flex-col items-center justify-center text-center">
            <MessageCircle className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="font-medium">No unread messages</h3>
            <p className="text-sm text-muted-foreground mb-4">You're all caught up!</p>
            <Button asChild variant="outline">
              <a href="/expert-dashboard/messages">View message center</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;
