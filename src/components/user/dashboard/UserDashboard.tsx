import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserProfile } from '@/types/supabase/user';
import UserDashboardLayout from './UserDashboardLayout';
import DashboardHome from './DashboardHome';
import UserAppointments from './ConsultationsSection';
import UserFavorites from './sections/UserFavorites';
import ProfileSettings from './ProfileSettings';
import { withProfileTypeAdapter } from '@/components/wrappers/withProfileTypeAdapter';
import { useAuth } from '@/contexts/auth/AuthContext';

interface UserDashboardProps {
  user: UserProfile | null;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const navigate = useNavigate();
  const location = useLocation();
  const { profile: userProfile } = useAuth();

  // Function to extract the tab from the URL
  const getTabFromURL = useCallback(() => {
    const pathSegments = location.pathname.split('/');
    const tabSegment = pathSegments[pathSegments.length - 1];

    if (['overview', 'appointments', 'favorites', 'profile'].includes(tabSegment)) {
      return tabSegment;
    }

    return 'overview'; // Default tab
  }, [location.pathname]);

  // Update activeTab based on URL on initial load and when URL changes
  useEffect(() => {
    const tab = getTabFromURL();
    setActiveTab(tab);
  }, [getTabFromURL]);

  // Update URL when activeTab changes
  useEffect(() => {
    navigate(`/user-dashboard/${activeTab}`, { replace: true });
  }, [activeTab, navigate]);

  // Fix the profile types using withProfileTypeAdapter
  return (
    <UserDashboardLayout user={userProfile}>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <DashboardHome user={userProfile} />
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4">
            <UserAppointments user={userProfile} />
          </TabsContent>

          <TabsContent value="favorites" className="space-y-4">
            <UserFavorites user={userProfile} />
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <ProfileSettings user={userProfile} />
          </TabsContent>
        </Tabs>
      </div>
    </UserDashboardLayout>
  );
};

export default withProfileTypeAdapter(UserDashboard, 'A');
