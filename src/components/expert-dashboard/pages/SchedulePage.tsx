
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Plus, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import CalendarWidget from './schedule/CalendarWidget';

const SchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock data for upcoming appointments
  const appointments = [
    {
      id: '1',
      clientName: 'Sarah Johnson',
      time: '10:00 AM',
      duration: '60 min',
      type: 'Video Call',
      status: 'confirmed'
    },
    {
      id: '2',
      clientName: 'Michael Chen',
      time: '2:00 PM',
      duration: '45 min',
      type: 'Phone Call',
      status: 'pending'
    },
    {
      id: '3',
      clientName: 'Emma Davis',
      time: '4:30 PM',
      duration: '60 min',
      type: 'Video Call',
      status: 'confirmed'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      confirmed: 'default',
      pending: 'secondary',
      completed: 'outline'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || 'default'}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Schedule Management</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Availability Settings
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Block Time
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Widget */}
        <div className="lg:col-span-2">
          <CalendarWidget />
        </div>

        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Today's Schedule
            </CardTitle>
            <CardDescription>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="p-3 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{appointment.clientName}</h4>
                  {getStatusBadge(appointment.status)}
                </div>
                <div className="text-sm text-gray-600">
                  <p>{appointment.time} • {appointment.duration}</p>
                  <p>{appointment.type}</p>
                </div>
              </div>
            ))}
            
            {appointments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No appointments scheduled for today</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Weekly Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Overview</CardTitle>
          <CardDescription>Your schedule for this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <div key={day} className="text-center">
                <h3 className="font-medium mb-2">{day}</h3>
                <div className="space-y-1">
                  {index < 5 && (
                    <div className="bg-blue-100 text-blue-800 text-xs p-1 rounded">
                      {Math.floor(Math.random() * 3) + 1} sessions
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchedulePage;
