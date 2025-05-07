
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CalendarIcon, Clock, Users, DollarSign } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AnalyticsProps {
  appointments: any[];
  earnings: any[];
  clients: any[];
}

const ExpertDashboardAnalytics: React.FC<AnalyticsProps> = ({
  appointments = [],
  earnings = [],
  clients = []
}) => {
  // Calculate key metrics
  const totalAppointments = appointments.length;
  const totalEarnings = earnings.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalClients = clients.length;
  const completionRate = appointments.length > 0 
    ? (appointments.filter(apt => apt.status === 'completed').length / appointments.length) * 100 
    : 0;
  
  // Format chart data for appointments by day
  const appointmentsByDay = [
    { name: 'Mon', appointments: 0 },
    { name: 'Tue', appointments: 0 },
    { name: 'Wed', appointments: 0 },
    { name: 'Thu', appointments: 0 },
    { name: 'Fri', appointments: 0 },
    { name: 'Sat', appointments: 0 },
    { name: 'Sun', appointments: 0 }
  ];
  
  // Populate with real data if available
  appointments.forEach(apt => {
    const date = new Date(apt.appointment_date);
    const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1; // Adjust for Sunday
    if (appointmentsByDay[dayIndex]) {
      appointmentsByDay[dayIndex].appointments += 1;
    }
  });
  
  // Format recent activity
  const recentActivity = [
    ...appointments.map(apt => ({
      type: 'appointment',
      title: `Appointment with ${apt.user_name || 'Client'}`,
      time: apt.appointment_date,
      status: apt.status
    })),
    ...earnings.map(earning => ({
      type: 'earning',
      title: `${earning.service} payment`,
      amount: earning.amount,
      time: earning.date
    }))
  ]
  .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
  .slice(0, 5);
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard Analytics</h2>
      
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary/10 rounded-full mr-4">
                <CalendarIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Appointments</p>
                <h3 className="text-2xl font-bold">{totalAppointments}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-full mr-4">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                <h3 className="text-2xl font-bold">${totalEarnings.toFixed(2)}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-full mr-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Clients</p>
                <h3 className="text-2xl font-bold">{totalClients}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-amber-100 rounded-full mr-4">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <h3 className="text-2xl font-bold">{completionRate.toFixed(0)}%</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Appointments by Day</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appointmentsByDay} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="appointments" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-2">
                  <div className="flex items-center">
                    {activity.type === 'appointment' ? (
                      <CalendarIcon className="h-4 w-4 mr-2 text-primary" />
                    ) : (
                      <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                    )}
                    <span>{activity.title}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No recent activity</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpertDashboardAnalytics;
