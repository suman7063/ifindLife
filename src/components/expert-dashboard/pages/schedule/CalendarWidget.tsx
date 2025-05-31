
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  duration: string;
  type: 'consultation' | 'therapy' | 'follow-up';
  client: string;
}

const CalendarWidget: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Mock calendar events
  const events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Individual Therapy',
      time: '09:00',
      duration: '60 min',
      type: 'therapy',
      client: 'Sarah Johnson'
    },
    {
      id: '2',
      title: 'Consultation',
      time: '11:00',
      duration: '45 min',
      type: 'consultation',
      client: 'Michael Chen'
    },
    {
      id: '3',
      title: 'Follow-up Session',
      time: '14:30',
      duration: '30 min',
      type: 'follow-up',
      client: 'Emma Davis'
    },
    {
      id: '4',
      title: 'Couples Therapy',
      time: '16:00',
      duration: '90 min',
      type: 'therapy',
      client: 'The Wilsons'
    }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'therapy':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'consultation':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'follow-up':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Manage your appointments and availability</CardDescription>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Calendar Header */}
        <div className="flex justify-between items-center mb-4">
          <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Today's Schedule */}
        <div className="mb-6">
          <h4 className="font-medium mb-3">Today's Schedule</h4>
          <div className="space-y-2">
            {events.map((event) => (
              <div 
                key={event.id} 
                className={`p-3 rounded-lg border ${getEventTypeColor(event.type)}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium">{event.title}</h5>
                    <p className="text-sm opacity-80">{event.client}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-medium">{event.time}</p>
                    <p className="opacity-80">{event.duration}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">4</p>
            <p className="text-sm text-gray-600">Today</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">12</p>
            <p className="text-sm text-gray-600">This Week</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">42</p>
            <p className="text-sm text-gray-600">This Month</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarWidget;
