
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Star, 
  TrendingUp, 
  Clock, 
  MessageSquare,
  AlertCircle,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const DashboardHome = () => {
  const { expertProfile } = useAuth();
  const [stats, setStats] = useState({
    totalEarnings: 1250.00,
    pendingPayouts: 800.00,
    totalClients: 24,
    activeClients: 8,
    avgRating: 4.8,
    totalReviews: 156,
    upcomingAppointments: 3,
    completedSessions: 89,
    responseRate: 98,
    onlineHours: 42
  });

  const today = format(new Date(), 'EEEE, MMMM do, yyyy');

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {expertProfile?.name || 'Expert'}!</h1>
            <p className="text-blue-100 mt-2">{today}</p>
            <p className="text-blue-100">Ready to help your clients achieve their wellness goals?</p>
          </div>
          <div className="flex items-center space-x-3">
            <Avatar className="h-16 w-16 border-2 border-white">
              <AvatarImage src={expertProfile?.profile_picture} alt={expertProfile?.name} />
              <AvatarFallback className="bg-white text-blue-600 text-xl font-bold">
                {expertProfile?.name?.charAt(0) || 'E'}
              </AvatarFallback>
            </Avatar>
            <div className="text-right">
              <Badge variant="secondary" className="bg-green-500 text-white">
                {expertProfile?.status === 'approved' ? 'Verified Expert' : expertProfile?.status || 'Pending'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeClients}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalClients} total clients
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgRating}</div>
            <p className="text-xs text-muted-foreground">
              Based on {stats.totalReviews} reviews
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingAppointments}</div>
            <p className="text-xs text-muted-foreground">
              Upcoming appointments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest client interactions and earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Consultation completed with Sarah Johnson</p>
                  <p className="text-xs text-muted-foreground">2 hours ago • Earned $75.00</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">New appointment scheduled with Michael Chen</p>
                  <p className="text-xs text-muted-foreground">Tomorrow at 2:00 PM</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-3 bg-yellow-50 rounded-lg">
                <MessageSquare className="h-5 w-5 text-yellow-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">New message from Emma Davis</p>
                  <p className="text-xs text-muted-foreground">45 minutes ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your expert services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/expert-dashboard/schedule">
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Manage Schedule
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            
            <Link to="/expert-dashboard/clients">
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  View Clients
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            
            <Link to="/expert-dashboard/services">
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Update Services
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            
            <Link to="/expert-dashboard/earnings">
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Earnings
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Session Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Completed Sessions</span>
                <span className="font-medium">{stats.completedSessions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Response Rate</span>
                <span className="font-medium">{stats.responseRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Online Hours (This Week)</span>
                <span className="font-medium">{stats.onlineHours}h</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Credentials & Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Profile Verified</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Credentials Approved</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Background Check: Pending</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Specializations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge variant="secondary">Anxiety Management</Badge>
              <Badge variant="secondary">Stress Relief</Badge>
              <Badge variant="secondary">Life Coaching</Badge>
              <p className="text-xs text-muted-foreground mt-2">
                <Link to="/expert-dashboard/profile" className="text-blue-500 hover:underline">
                  Update specializations →
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;
