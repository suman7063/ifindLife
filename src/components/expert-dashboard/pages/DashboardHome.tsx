
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  MessageCircle, 
  Star,
  TrendingUp,
  Clock,
  Edit
} from 'lucide-react';
import PresenceStatusControl from '../components/PresenceStatusControl';
import AwayMessagesPanel from '../components/AwayMessagesPanel';
import CallReceptionWidget from '../call/CallReceptionWidget';


const DashboardHome = () => {
  const { expert: expertProfile } = useSimpleAuth();
  const navigate = useNavigate();

  const isApproved = expertProfile?.status === 'approved';

  const handleEditProfile = () => {
    navigate('/expert-dashboard/profile');
  };

  const handleViewSchedule = () => {
    navigate('/expert-dashboard/schedule');
  };

  const handleViewClients = () => {
    navigate('/expert-dashboard/clients');
  };

  const handleViewMessages = () => {
    navigate('/expert-dashboard/messages');
  };

  const handleViewEarnings = () => {
    navigate('/expert-dashboard/earnings');
  };


  const handleStartConsultation = () => {
    // TODO: Implement consultation start functionality
    console.log('Starting consultation...');
  };

  if (!isApproved) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <Clock className="w-12 h-12 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Under Review</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Your expert account is currently being reviewed by our team. You'll receive an email notification once your account is approved and you can start accepting consultations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Presence and Messages Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PresenceStatusControl />
        <AwayMessagesPanel />
      </div>

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {expertProfile?.name}!
            </h1>
            <p className="text-blue-100">
              You're helping people find their path to wellness.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Verified Expert
              </Badge>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">
                  {expertProfile?.average_rating || 0} ({expertProfile?.reviews_count || 0} reviews)
                </span>
              </div>
            </div>
          </div>
          <Button 
            variant="secondary" 
            onClick={handleEditProfile}
            className="flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              +0% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultations</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              +0% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0</div>
            <p className="text-xs text-muted-foreground">
              +0% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expertProfile?.average_rating || 0}</div>
            <p className="text-xs text-muted-foreground">
              Based on {expertProfile?.reviews_count || 0} reviews
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
            <CardDescription>Manage your availability and appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleViewSchedule} className="w-full">
              <Calendar className="w-4 h-4 mr-2" />
              View Schedule
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clients</CardTitle>
            <CardDescription>View and manage your client relationships</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleViewClients} className="w-full">
              <Users className="w-4 h-4 mr-2" />
              View Clients
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
            <CardDescription>Communicate with your clients</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleViewMessages} className="w-full">
              <MessageCircle className="w-4 h-4 mr-2" />
              View Messages
            </Button>
          </CardContent>
        </Card>


        <Card>
          <CardHeader>
            <CardTitle>Earnings</CardTitle>
            <CardDescription>Track your income and payouts</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleViewEarnings} className="w-full">
              <DollarSign className="w-4 h-4 mr-2" />
              View Earnings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Consultation</CardTitle>
            <CardDescription>Start an immediate consultation</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleStartConsultation} className="w-full bg-green-600 hover:bg-green-700">
              Start Consultation
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest interactions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No recent activity to display</p>
            <p className="text-sm">Your consultations and interactions will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;
