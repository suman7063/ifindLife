
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar, Clock, TrendingUp } from 'lucide-react';
import { useUserAuth } from '@/contexts/auth/hooks/useUserAuth';

const DashboardOverview: React.FC = () => {
  const { currentUser } = useUserAuth();

  const stats = [
    {
      title: 'Active Programs',
      value: '3',
      icon: BookOpen,
      change: '+1 this month',
      color: 'text-blue-600'
    },
    {
      title: 'Total Sessions',
      value: '12',
      icon: Calendar,
      change: '+4 this week',
      color: 'text-green-600'
    },
    {
      title: 'Hours Completed',
      value: '18',
      icon: Clock,
      change: '+6 this week',
      color: 'text-purple-600'
    },
    {
      title: 'Progress Score',
      value: '78%',
      icon: TrendingUp,
      change: '+12% improvement',
      color: 'text-orange-600'
    }
  ];

  const upcomingSessions = [
    {
      id: '1',
      program: 'Stress Management',
      date: 'Today',
      time: '2:00 PM',
      expert: 'Dr. Sarah Wilson'
    },
    {
      id: '2',
      program: 'Mindfulness Meditation',
      date: 'Tomorrow',
      time: '10:00 AM',
      expert: 'Dr. Michael Chen'
    },
    {
      id: '3',
      program: 'Anxiety Relief',
      date: 'Friday',
      time: '4:30 PM',
      expert: 'Dr. Emily Rodriguez'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">
          Welcome back, {currentUser?.name || 'User'}!
        </h2>
        <p className="text-gray-600 mt-2">
          Here's an overview of your mental health journey
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-xs ${stat.color} mt-1`}>{stat.change}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Sessions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{session.program}</p>
                  <p className="text-sm text-gray-600">{session.expert}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{session.date}</p>
                  <p className="text-sm text-gray-600">{session.time}</p>
                </div>
              </div>
            ))}
            <Button className="w-full mt-4" variant="outline">
              View All Sessions
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Stress Management</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-sm font-medium">75%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Mindfulness</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <span className="text-sm font-medium">60%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Anxiety Relief</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                  <span className="text-sm font-medium">90%</span>
                </div>
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline">
              View Detailed Progress
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
