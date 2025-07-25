
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Star, BookOpen, Heart, Activity } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import LoadingScreen from '@/components/auth/LoadingScreen';
import { toast } from 'sonner';
import UserDashboardSidebar from '@/components/user/dashboard/UserDashboardSidebar';
import DashboardHome from '@/components/user/dashboard/DashboardHome';
import ProfileSection from '@/components/user/dashboard/sections/ProfileSection';
// WalletSection removed - now using reward system
import ConsultationsSection from '@/components/user/dashboard/sections/ConsultationsSection';
import FavoritesSection from '@/components/user/dashboard/sections/FavoritesSection';
import MessagesSection from '@/components/user/dashboard/sections/MessagesSection';
import SecuritySection from '@/components/user/dashboard/sections/SecuritySection';
import SettingsSection from '@/components/user/dashboard/sections/SettingsSection';
import SupportSection from '@/components/user/dashboard/sections/SupportSection';
import ProgramsSection from '@/components/user/dashboard/sections/ProgramsSection';
import BookingHistorySection from '@/components/user/dashboard/sections/BookingHistorySection';
import ProgressTrackingSection from '@/components/user/dashboard/sections/ProgressTrackingSection';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { UserProfile } from '@/types/database/unified';

export interface UserDashboardPagesProps {
  currentUser?: UserProfile | null;
  onNavigate?: (section: string) => void;
}

const UserDashboardPages: React.FC<UserDashboardPagesProps> = ({ 
  currentUser, 
  onNavigate = () => {} 
}) => {
  // Mock data with safe defaults
  const mockData = {
    recentActivities: [
      { id: 1, type: 'session', description: 'Completed session with Dr. Sarah Johnson', date: '2024-01-15', icon: User },
      { id: 2, type: 'program', description: 'Enrolled in Anxiety Management Program', date: '2024-01-14', icon: BookOpen },
      { id: 3, type: 'review', description: 'Left a review for Dr. Michael Chen', date: '2024-01-13', icon: Star }
    ],
    upcomingAppointments: [
      { id: 1, expertName: 'Dr. Sarah Johnson', date: '2024-01-20', time: '2:00 PM', type: 'Individual Session' },
      { id: 2, expertName: 'Dr. Michael Chen', date: '2024-01-22', time: '10:00 AM', type: 'Group Therapy' }
    ],
    favoriteExperts: currentUser?.favorite_experts || [],
    favoritePrograms: currentUser?.favorite_programs || [],
    enrolledCourses: currentUser?.enrolled_courses || []
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {currentUser?.name || 'User'}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your mental wellness journey today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorite Experts</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.favoriteExperts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Programs</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.enrolledCourses.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.upcomingAppointments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reward Points</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentUser?.reward_points || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" onClick={() => onNavigate('experts')}>
              Find Experts
            </Button>
            <Button variant="outline" onClick={() => onNavigate('programs')}>
              Browse Programs
            </Button>
            <Button variant="outline" onClick={() => onNavigate('appointments')}>
              Book Session
            </Button>
            <Button variant="outline" onClick={() => onNavigate('rewards')}>
              View Rewards
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.recentActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Icon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{appointment.expertName}</p>
                  <p className="text-sm text-gray-500">{appointment.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{appointment.date}</p>
                  <p className="text-xs text-gray-500">{appointment.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboardPages;
