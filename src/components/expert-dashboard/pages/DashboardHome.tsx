
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Calendar, MessageSquare, DollarSign, TrendingUp, Clock, Phone } from 'lucide-react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import MasterStatusControl from '../components/MasterStatusControl';
import SessionScheduleCard from './dashboard/SessionScheduleCard';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalClients: number;
  pendingAppointments: number;
  unreadMessages: number;
  monthlyEarnings: number;
  completedSessions: number;
  averageRating: number;
  pendingCalls: number;
}

const DashboardHome: React.FC = () => {
  const { expert } = useSimpleAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    pendingAppointments: 0,
    unreadMessages: 0,
    monthlyEarnings: 0,
    completedSessions: 0,
    averageRating: 0,
    pendingCalls: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (expert?.id) {
      loadDashboardStats();
    }
  }, [expert?.id]);

  const loadDashboardStats = async () => {
    if (!expert?.id) return;

    try {
      // Load basic stats - you can expand this with real data queries
      // For now, showing placeholder data
      setStats({
        totalClients: 12,
        pendingAppointments: 3,
        unreadMessages: 5,
        monthlyEarnings: 2500,
        completedSessions: 28,
        averageRating: 4.8,
        pendingCalls: 2
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending Approval</Badge>;
      case 'disapproved':
        return <Badge variant="destructive">Disapproved</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (!expert) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Expert Dashboard</h1>
          <p className="text-gray-600 mt-2">Loading expert profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {expert.name}!</h1>
        <div className="flex items-center gap-4 mt-2">
          <p className="text-gray-600">Expert Dashboard</p>
          {getStatusBadge(expert.status)}
        </div>
      </div>

      {/* Status Control & Session Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MasterStatusControl />
        <SessionScheduleCard />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingAppointments}</div>
            <p className="text-xs text-muted-foreground">
              This week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unreadMessages}</div>
            <p className="text-xs text-muted-foreground">
              Requires response
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.monthlyEarnings}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Sessions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedSessions}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating}/5</div>
            <p className="text-xs text-muted-foreground">
              From {stats.totalClients} reviews
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Calls</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingCalls}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting response
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Account Status Alert */}
      {expert.status === 'pending' && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800">Account Under Review</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-700">
              Your expert account is currently under review. You'll be able to receive calls and bookings once approved.
              Make sure your profile is complete with all required information.
            </p>
          </CardContent>
        </Card>
      )}

      {expert.status === 'disapproved' && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Account Needs Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">
              Your expert account application was not approved. Please contact support for more information.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardHome;
