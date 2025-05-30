
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Star, 
  Clock,
  MessageSquare,
  TrendingUp
} from 'lucide-react';
import { useUnifiedAuth } from '@/contexts/auth/UnifiedAuthContext';

const DashboardHome = () => {
  const { expert } = useUnifiedAuth();

  const stats = [
    {
      title: "Total Clients",
      value: "0",
      description: "Active clients",
      icon: Users,
      trend: "+0% from last month"
    },
    {
      title: "This Month's Earnings",
      value: "$0.00",
      description: "Current month revenue",
      icon: DollarSign,
      trend: "+0% from last month"
    },
    {
      title: "Upcoming Sessions",
      value: "0",
      description: "Scheduled sessions",
      icon: Calendar,
      trend: "Next 7 days"
    },
    {
      title: "Average Rating",
      value: "0.0",
      description: "Based on client reviews",
      icon: Star,
      trend: "No reviews yet"
    }
  ];

  const recentActivities = [
    {
      type: "info",
      message: "Welcome to your expert dashboard!",
      time: "Just now"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {expert?.name || 'Expert'}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your consultations today.
        </p>
        <div className="mt-4">
          <Badge variant={expert?.status === 'approved' ? 'default' : 'secondary'}>
            {expert?.status === 'approved' ? 'Verified Expert' : expert?.status || 'Pending'}
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to get you started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Set Available Hours
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Update Profile
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Check Messages
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest activities and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Performance Overview
          </CardTitle>
          <CardDescription>Track your consultation performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Performance data will appear here once you start conducting consultations.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;
