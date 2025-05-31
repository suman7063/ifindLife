
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
  TrendingUp,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { useUnifiedAuth } from '@/contexts/auth/UnifiedAuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardHome = () => {
  const { expert } = useUnifiedAuth();
  const navigate = useNavigate();

  const stats = [
    {
      title: "Total Clients",
      value: "12",
      description: "Active clients",
      icon: Users,
      trend: "+3 from last month",
      color: "text-blue-600"
    },
    {
      title: "This Month's Earnings",
      value: "$2,450.00",
      description: "Current month revenue",
      icon: DollarSign,
      trend: "+18% from last month",
      color: "text-green-600"
    },
    {
      title: "Upcoming Sessions",
      value: "8",
      description: "Next 7 days",
      icon: Calendar,
      trend: "4 today, 4 this week",
      color: "text-purple-600"
    },
    {
      title: "Average Rating",
      value: "4.8",
      description: "Based on 24 reviews",
      icon: Star,
      trend: "Excellent rating",
      color: "text-yellow-600"
    }
  ];

  const recentActivities = [
    {
      type: "session",
      message: "Completed session with Sarah M.",
      time: "2 hours ago",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      type: "booking",
      message: "New booking from John D. for tomorrow",
      time: "4 hours ago",
      icon: Calendar,
      color: "text-blue-600"
    },
    {
      type: "message",
      message: "3 new messages from clients",
      time: "6 hours ago",
      icon: MessageSquare,
      color: "text-purple-600"
    },
    {
      type: "review",
      message: "New 5-star review from Maria L.",
      time: "1 day ago",
      icon: Star,
      color: "text-yellow-600"
    }
  ];

  const quickActions = [
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
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {expert?.name || expert?.full_name || 'Expert'}!
            </h1>
            <p className="text-gray-600 mt-2">
              Here's what's happening with your consultations today.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <Badge variant={expert?.status === 'approved' ? 'default' : 'secondary'}>
                {expert?.status === 'approved' ? 'Verified Expert' : expert?.status || 'Pending'}
              </Badge>
              {expert?.status === 'approved' && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Available for bookings
                </Badge>
              )}
            </div>
          </div>
          <div className="hidden md:block">
            <div className="text-right text-sm text-gray-600">
              <p>{new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
              <p className="font-medium text-gray-800">
                {new Date().toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
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
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
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

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest activities and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <activity.icon className={`h-4 w-4 mt-1 ${activity.color}`} />
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
          <CardDescription>Track your consultation performance and growth</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">85%</div>
              <p className="text-sm text-muted-foreground">Client Satisfaction</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">42</div>
              <p className="text-sm text-muted-foreground">Sessions This Month</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">96%</div>
              <p className="text-sm text-muted-foreground">Session Completion Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;
